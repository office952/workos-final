import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "old");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = process.env.OLD_AUTH_APP_URL ?? "http://127.0.0.1:3011";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: DESKTOP });
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("/api/v1/auth/")) {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ detail: "auth_config_missing" }),
      });
      return;
    }
    await route.continue();
  });
  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await waitSettled(page);
  await captureShot(page, {
    app: "OLD",
    route: "(pre-shell)",
    screenId: "auth-config-missing",
    state: "auth-503-intercept",
    role: "unauthenticated",
    runtime: "old-demo-auth-preview-isolated",
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: await page.locator("body").innerText().then((text) => text.slice(0, 80)),
    routeAssertion: page.url(),
  });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
