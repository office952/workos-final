import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const packRoot = join(repo, "docs", "worklog");
const blocklist = JSON.parse(readFileSync(join(repo, ".tmp", "ui-ux-audit-v1", "privacy-blocklist.json"), "utf8"));
const extra = [/per:legacy/i, /\bRO\d{2}[A-Z]{4}\d{16}\b/i];

const targets = [
  join(packRoot, "WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md"),
  join(packRoot, "ui-ux-audit-v1", "screenshot-manifest.csv"),
  join(packRoot, "ui-ux-audit-v1", "source-route-inventory.csv"),
  join(packRoot, "ui-ux-audit-v1", "source-to-manifest-reconciliation.csv"),
  join(packRoot, "ui-ux-audit-v1", "source-to-manifest-reconciliation.md"),
  join(packRoot, "ui-ux-audit-v1", "historical-machine-strict-provenance.md"),
  join(packRoot, "ui-ux-audit-v1", "evidence-index.md"),
  join(packRoot, "ui-ux-audit-v1", "CORRECTION_PLAN_V1.md"),
  join(packRoot, "ui-ux-audit-v1", "route-manifest.csv"),
  join(packRoot, "ui-ux-audit-v1", "route-inventory-reconciliation.txt"),
];

for (const dir of ["new", "old"]) {
  for (const name of readdirSync(join(packRoot, "screenshots", "ui-ux-audit-v1", dir))) {
    targets.push(join(packRoot, "screenshots", "ui-ux-audit-v1", dir, name));
  }
}

const hits = [];
for (const target of targets) {
  const name = target.replaceAll("\\", "/");
  const body = target.endsWith(".png") ? name : `${name}\n${readFileSync(target, "utf8")}`;
  for (const pattern of [...blocklist.patterns, ...extra]) {
    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    if (re.test(body)) {
      hits.push({ target: name, pattern: String(pattern) });
    }
  }
  if (/MISSING:/.test(body)) {
    hits.push({ target: name, pattern: "MISSING:" });
  }
}

const report = {
  scanned: targets.length,
  hits,
  TEXT_METADATA_PRIVACY_SCAN: hits.length === 0 ? "PASS" : "FAIL",
};
writeFileSync(join(repo, ".tmp", "ui-ux-audit-v1", "text-privacy.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
