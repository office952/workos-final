import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const requireTesseract = createRequire(join(process.cwd(), "package.json"));
const { createWorker } = requireTesseract("tesseract.js");

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const shotRoot = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1");
const outDir = join(repo, ".tmp", "ui-ux-audit-v1", "privacy-ocr");
mkdirSync(outDir, { recursive: true });

const blocklist = JSON.parse(readFileSync(join(repo, ".tmp", "ui-ux-audit-v1", "privacy-blocklist.json"), "utf8"));
const extra = [
  /per:legacy/i,
  /\bRO\d{2}[A-Z]{4}\d{16}\b/i,
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\+40\s?\d{2,3}[\s-]?\d{3}[\s-]?\d{3,4}/,
];

const files = [];
for (const dir of ["new", "old"]) {
  for (const name of readdirSync(join(shotRoot, dir))) {
    if (name.endsWith(".png")) {
      files.push(join(shotRoot, dir, name));
    }
  }
}
files.sort();

const worker = await createWorker("eng+ron");
const hits = [];
const decodeFailures = [];
let index = 0;
for (const file of files) {
  index += 1;
  let text = "";
  try {
    const result = await worker.recognize(file);
    text = result.data.text ?? "";
  } catch (error) {
    decodeFailures.push({ file, error: String(error) });
    console.log(`FAIL ${index}/${files.length} ${file}`);
    continue;
  }
  const matched = [];
  for (const pattern of blocklist.patterns) {
    if (new RegExp(pattern, "i").test(text)) {
      matched.push(pattern);
    }
  }
  for (const pattern of extra) {
    if (pattern.test(text)) {
      matched.push(String(pattern));
    }
  }
  if (matched.length) {
    hits.push({ file, matched, sample: text.replace(/\s+/g, " ").slice(0, 240) });
  }
  if (index % 20 === 0 || index === files.length) {
    console.log(`OCR ${index}/${files.length} hits=${hits.length}`);
  }
}
await worker.terminate();

const report = {
  scanned: files.length,
  hits,
  decodeFailures,
  PIXEL_PRIVACY_SCAN: hits.length === 0 && decodeFailures.length === 0 ? "PASS" : "FAIL",
  hash: createHash("sha256").update(JSON.stringify({ files: files.length, hits })).digest("hex"),
};
writeFileSync(join(outDir, "ocr-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ scanned: files.length, hits: hits.length, decodeFailures: decodeFailures.length }, null, 2));
