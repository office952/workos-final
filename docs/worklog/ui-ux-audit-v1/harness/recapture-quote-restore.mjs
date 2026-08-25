import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "new");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = "http://127.0.0.1:5173";
const runtime = "single-plane-dev-isolated";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: DESKTOP });
  const response = await page.request.get(`${baseURL}/api/quotes`);
  if (!response.ok()) {
    throw new Error(`quotes ${response.status()}`);
  }
  const body = await response.json();
  const first = body.overview?.quotes?.[0];
  if (!first?.href && !first?.quoteSnapshotId) {
    throw new Error("no quote to restore");
  }
  const href =
    first.href ??
    `/products/${first.productCode}?quote=${encodeURIComponent(first.quoteSnapshotId)}`;
  await page.goto(new URL(href, baseURL).toString(), { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await captureShot(page, {
    app: "NEW",
    route: href,
    screenId: "product-config-quote-restore",
    state: "populated",
    role: "operator-dev",
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: "frozen quote restore",
    routeAssertion: page.url(),
  });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
