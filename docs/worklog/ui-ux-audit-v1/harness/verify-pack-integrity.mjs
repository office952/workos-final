import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const shotRoot = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1");

function loadPrivacyPatterns() {
  const patterns = [/MISSING:/, /per:legacy/i, /\bRO\d{2}[A-Z]{4}\d{16}\b/i];
  const blocklistPath = join(repo, ".tmp", "ui-ux-audit-v1", "privacy-blocklist.json");
  try {
    const extra = JSON.parse(readFileSync(blocklistPath, "utf8"));
    for (const item of extra.patterns ?? []) {
      patterns.push(new RegExp(item, "i"));
    }
  } catch {
    // Blocklist stays outside the evidence pack.
  }
  return patterns;
}

const PII = loadPrivacyPatterns();

function parseCsv(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const cols = [];
      let cur = "";
      let q = false;
      for (const ch of line) {
        if (ch === '"') {
          q = !q;
          continue;
        }
        if (ch === "," && !q) {
          cols.push(cur);
          cur = "";
          continue;
        }
        cur += ch;
      }
      cols.push(cur);
      return {
        status: cols[13],
        file: cols[8],
        sha: cols[9],
        line,
      };
    });
}

const rows = parseCsv(readFileSync(manifestPath, "utf8"));
const captured = rows.filter((row) => row.status === "captured");
const pngs = [];
for (const dir of ["new", "old"]) {
  for (const name of readdirSync(join(shotRoot, dir))) {
    if (name.endsWith(".png")) {
      pngs.push(`docs/worklog/screenshots/ui-ux-audit-v1/${dir}/${name}`);
    }
  }
}

let missingFile = 0;
let hashMismatch = 0;
let decodeFail = 0;
for (const row of captured) {
  if (!row.file) {
    missingFile += 1;
    continue;
  }
  const abs = join(repo, row.file);
  let bytes;
  try {
    bytes = readFileSync(abs);
  } catch {
    missingFile += 1;
    continue;
  }
  if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    decodeFail += 1;
  }
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== row.sha) {
    hashMismatch += 1;
  }
}

const capturedFiles = new Set(captured.map((row) => row.file.replaceAll("\\", "/")));
const orphan = pngs.filter((file) => !capturedFiles.has(file));
const missingMarkers = rows.filter((row) => /MISSING:/.test(row.line)).length;
const textHits = [];
for (const target of [
  manifestPath,
  join(here, "..", "source-route-inventory.csv"),
  join(repo, "docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md"),
]) {
  let text = "";
  try {
    text = readFileSync(target, "utf8");
  } catch {
    continue;
  }
  for (const pattern of PII) {
    if (pattern.test(text)) {
      textHits.push(`${target} ${pattern}`);
    }
  }
}

const hashes = new Map();
for (const row of captured) {
  if (!row.sha) {
    continue;
  }
  hashes.set(row.sha, [...(hashes.get(row.sha) ?? []), row.file]);
}
const dupes = [...hashes.entries()].filter(([, files]) => files.length > 1);

const report = {
  CAPTURED_ROWS: captured.length,
  ACTUAL_PNG: pngs.length,
  CAPTURED_ROW_WITHOUT_FILE: missingFile,
  PNG_WITHOUT_MANIFEST_ROW: orphan.length,
  HASH_MISMATCH: hashMismatch,
  PNG_DECODE_FAILURES: decodeFail,
  MISSING_ASSERTION_MARKERS: missingMarkers,
  TEXT_METADATA_HITS: textHits,
  DUPLICATE_HASH_GROUPS: dupes.map(([sha, files]) => ({ sha, files })),
  orphans: orphan,
};

writeFileSync(join(repo, ".tmp/ui-ux-audit-v1/integrity.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
