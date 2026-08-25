import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "new");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = process.env.NEW_CLOUD_WEB_URL ?? "http://127.0.0.1:5181";
const runtime = "temp-cloud-root-isolated";
const email = process.env.NEW_CLOUD_EMAIL ?? "audit-owner@example.test";

async function shot(page, spec) {
  await captureShot(page, {
    app: "NEW",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role: "cloud-unauthenticated",
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: spec.assertion,
    routeAssertion: page.url(),
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: DESKTOP });

  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Autentificare" }).waitFor({ timeout: 20000 });
  await waitSettled(page);
  await shot(page, {
    route: "(cloud gate)",
    screenId: "cloud-login",
    state: "empty-form",
    assertion: "Autentificare empty",
  });

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("WrongPass99");
  await page.getByRole("button", { name: "Intră" }).click();
  await page.waitForSelector(".status-bad", { timeout: 10000 }).catch(() => undefined);
  await waitSettled(page);
  await shot(page, {
    route: "(cloud gate)",
    screenId: "cloud-login",
    state: "invalid-credentials",
    assertion: "Email sau parolă greșită",
  });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
