import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  DESKTOP,
  captureShot,
  initScreenshotManifest,
  requireUrlMatch,
  requireVisibleText,
  waitSettled,
} from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "old");
const manifestPath = join(repo, ".tmp", "ui-ux-audit-v1", "closure-old-execution.csv");
const baseURL = process.env.OLD_APP_URL ?? "http://127.0.0.1:3010";
const api = process.env.OLD_API_URL ?? "http://127.0.0.1:8010";

async function shot(page, spec) {
  await captureShot(page, {
    app: "OLD",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role: "admin-dev-preview",
    runtime: "old-demo-db-copy-isolated",
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: spec.assertion,
    routeAssertion: spec.route,
  });
}

async function main() {
  const dashboard = await (await fetch(`${api}/api/v1/execution/dashboard`)).json();
  if (!Array.isArray(dashboard.rows) || dashboard.rows.length < 1) {
    throw new Error("ASSERTION_FAILED isolated demo dashboard has no rows");
  }
  const row = dashboard.rows[0];
  if (row.order_id !== 1 || row.order_code !== "DEMO-ORDER-001") {
    throw new Error(`ASSERTION_FAILED unexpected dashboard fixture ${JSON.stringify(row)}`);
  }

  initScreenshotManifest(manifestPath);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  await context.addInitScript(() => {
    sessionStorage.setItem("workos-dev-role", "admin");
  });
  const page = await context.newPage();

  await page.goto(`${baseURL}/execution`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
  await requireUrlMatch(page, /\/execution\/?$/);
  await requireVisibleText(page, "Execuție");
  await requireVisibleText(page, "Comenzi în execuție");
  await requireVisibleText(page, "DEMO-ORDER-001");
  if (page.url().includes("ops-graph") || page.url().includes("reality-review")) {
    throw new Error(`ASSERTION_FAILED /execution redirected away: ${page.url()}`);
  }
  await shot(page, {
    route: "/execution",
    screenId: "execution-dashboard",
    state: "direct-demo-populated",
    assertion: "Executie heading + Comenzi in executie + DEMO-ORDER-001",
  });

  await page.goto(`${baseURL}/execution/${row.order_id}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
  await page.waitForTimeout(4000);
  await requireUrlMatch(page, `/execution/${row.order_id}`);
  await requireVisibleText(page, "Rezultat execuție");
  await requireVisibleText(page, "DEMO-ORDER-001");
  if (page.url().includes("ops-graph")) {
    throw new Error("ASSERTION_FAILED execution detail opened Ops Graph");
  }
  await shot(page, {
    route: "/execution/:order_id",
    screenId: "execution-detail",
    state: "demo-order-001-populated",
    assertion: "Rezultat executie + DEMO-ORDER-001",
  });

  await browser.close();
  console.log("OLD_EXECUTION_DASHBOARD_DIRECT_CAPTURE=YES");
  console.log("OLD_EXECUTION_DETAIL=CAPTURED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
