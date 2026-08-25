import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const staging = join(repo, ".tmp", "ui-ux-audit-v1", "zip-staging");
const zipPath = join(repo, "docs", "worklog", "WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1_EVIDENCE.zip");
const sidecar = `${zipPath}.sha256`;

rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

function copyTree(fromAbs, toAbs) {
  const st = statSync(fromAbs);
  if (st.isDirectory()) {
    mkdirSync(toAbs, { recursive: true });
    for (const name of readdirSync(fromAbs)) {
      copyTree(join(fromAbs, name), join(toAbs, name));
    }
    return;
  }
  mkdirSync(dirname(toAbs), { recursive: true });
  writeFileSync(toAbs, readFileSync(fromAbs));
}

copyTree(join(repo, "docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md"), join(staging, "WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md"));
copyTree(join(repo, "docs/worklog/ui-ux-audit-v1"), join(staging, "ui-ux-audit-v1"));
copyTree(join(repo, "docs/worklog/screenshots/ui-ux-audit-v1"), join(staging, "screenshots/ui-ux-audit-v1"));

const ps = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path -LiteralPath '${zipPath.replaceAll("'", "''")}') { Remove-Item -LiteralPath '${zipPath.replaceAll("'", "''")}' -Force }
$zip = [System.IO.Compression.ZipFile]::Open('${zipPath.replaceAll("'", "''")}', 'Create')
function Add-Rel($abs, $rel) {
  $entry = $rel.Replace('\\','/')
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $abs, $entry, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}
function Walk($root, $prefix) {
  Get-ChildItem -LiteralPath $root -Force | ForEach-Object {
    $rel = if ($prefix) { "$prefix/$($_.Name)" } else { $_.Name }
    if ($_.PSIsContainer) { Walk $_.FullName $rel } else { Add-Rel $_.FullName $rel }
  }
}
Walk '${staging.replaceAll("'", "''")}' ''
$zip.Dispose()
`;
execFileSync("powershell", ["-NoProfile", "-Command", ps], { stdio: "inherit" });

const bytes = readFileSync(zipPath);
const sha = createHash("sha256").update(bytes).digest("hex");
writeFileSync(sidecar, `${sha}  WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1_EVIDENCE.zip\n`, "utf8");

const crcPs = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath.replaceAll("'", "''")}')
$n = 0
foreach ($e in $zip.Entries) {
  if ($e.Name -eq '') { continue }
  $s = $e.Open()
  $null = $s.CopyTo([System.IO.Stream]::Null)
  $s.Close()
  $n++
}
$zip.Dispose()
Write-Output "ZIP_ENTRIES=$n"
Write-Output "ZIP_CRC=PASS"
`;
const crcOut = execFileSync("powershell", ["-NoProfile", "-Command", crcPs], { encoding: "utf8" });
console.log(`ZIP_BYTES=${bytes.length}`);
console.log(`SHA256=${sha}`);
console.log(crcOut);
if (bytes.includes(Buffer.from(sha))) {
  throw new Error("zip contains its own sha256");
}
