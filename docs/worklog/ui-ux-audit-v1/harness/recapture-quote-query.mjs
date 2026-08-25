import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "new");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = "http://127.0.0.1:5173";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: DESKTOP });
  const response = await page.request.get(`${baseURL}/api/quotes`);
  const body = await response.json();
  const first = body.overview?.quotes?.[0];
  if (!first?.quoteSnapshotId) {
    throw new Error("no quote snapshot");
  }
  const href = `/products/${first.productCode}?quote=${encodeURIComponent(first.quoteSnapshotId)}`;
  await page.goto(new URL(href, baseURL).toString(), { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await captureShot(page, {
    app: "NEW",
    route: href,
    screenId: "product-config-quote-restore",
    state: "quote-query-populated",
    role: "operator-dev",
    runtime: "single-plane-dev-isolated",
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: "explicit ?quote= restore",
    routeAssertion: page.url(),
  });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
