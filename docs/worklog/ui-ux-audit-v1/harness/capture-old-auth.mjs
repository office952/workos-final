import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "old");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = process.env.OLD_AUTH_APP_URL ?? "http://127.0.0.1:3011";
const runtime = "old-demo-auth-preview-isolated";

async function shot(page, spec) {
  await captureShot(page, {
    app: "OLD",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role: "unauthenticated",
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

  const loginPage = await browser.newPage({ viewport: DESKTOP });
  await loginPage.route("**/api/v1/auth/me**", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", body: "null" }),
  );
  await loginPage.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await loginPage.waitForTimeout(800);
  await waitSettled(loginPage);
  await shot(loginPage, {
    route: "(pre-shell)",
    screenId: "login-gate",
    state: "unauthenticated",
    assertion: "OIDC login wall",
  });
  await loginPage.close();

  const missingPage = await browser.newPage({ viewport: DESKTOP });
  await missingPage.route("**/api/v1/auth/me**", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ detail: "auth_config_missing" }),
    }),
  );
  await missingPage.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await missingPage.waitForTimeout(800);
  await waitSettled(missingPage);
  await shot(missingPage, {
    route: "(pre-shell)",
    screenId: "auth-config-missing",
    state: "auth-503",
    assertion: "auth config missing honesty",
  });
  await missingPage.close();

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
