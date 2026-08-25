import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, safeClick, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "old");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = "http://127.0.0.1:3010";
const runtime = "old-demo-db-copy-isolated";

async function shot(page, spec) {
  await captureShot(page, {
    app: "OLD",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role: "admin-dev-preview",
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: spec.assertion,
    routeAssertion: page.url(),
  });
}

async function goto(page, path) {
  await page.goto(new URL(path, baseURL).toString(), {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  }).catch(() => undefined);
  await waitSettled(page);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  await context.addInitScript(() => {
    sessionStorage.setItem("workos-dev-role", "admin");
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(15000);

  try {
    await goto(page, "/quotes");
    if (await safeClick(page.getByText("DEMO-QUOTE-EUR-001"))) {
      await waitSettled(page);
      await shot(page, {
        route: "/quotes/:quoteId",
        screenId: "oferte-detail",
        state: "opened",
        assertion: "quote master-detail selected",
      });
    }

    await goto(page, "/orders");
    const orderRow = page.locator("a, button, [role='button']").filter({ hasText: /DEMO|CMD|ORD/i }).first();
    if (await orderRow.isVisible().catch(() => false)) {
      await orderRow.click();
      await waitSettled(page);
      await shot(page, {
        route: "/orders/:orderId",
        screenId: "comenzi-detail",
        state: "opened",
        assertion: "order selected",
      });
    }

    await goto(page, "/clients");
    if (await safeClick(page.getByText("Demo Client Alpha"))) {
      await waitSettled(page);
      await shot(page, {
        route: "/clients/:clientName",
        screenId: "client-workspace",
        state: "opened",
        assertion: "client hub",
      });
      for (const tab of ["Prezentare", "Cereri", "Oferte", "Comenzi", "Timeline"]) {
        if (await safeClick(page.getByRole("tab", { name: tab })) || await safeClick(page.getByText(tab, { exact: true }))) {
          await shot(page, {
            route: page.url(),
            screenId: `client-tab-${tab.toLowerCase()}`,
            state: "opened",
            assertion: tab,
          });
        }
      }
    }

    await goto(page, "/employees-records");
    if (await safeClick(page.getByText("Demo Assembler"))) {
      await waitSettled(page);
      await shot(page, {
        route: "/employees-records/:employeeId",
        screenId: "employee-profile",
        state: "opened",
        assertion: "HR profile demo",
      });
    }

    await goto(page, "/tablet");
    const station = page.locator("a[href*='/tablet/']").first();
    if (await station.isVisible().catch(() => false)) {
      await station.click();
      await waitSettled(page);
      await shot(page, {
        route: "/tablet/:stationId",
        screenId: "tablet-station-queue",
        state: "opened",
        assertion: "tablet queue",
      });
    }

    await goto(page, "/documents");
    const docRow = page.locator("table tbody tr").first();
    if (await docRow.isVisible().catch(() => false)) {
      await docRow.click();
      await waitSettled(page);
      await shot(page, {
        route: "/documents",
        screenId: "document-detail-drawer",
        state: "opened",
        assertion: "document drawer",
      });
    }

    await goto(page, "/employee-app-v2/personal/info");
    await shot(page, {
      route: "/employee-app-v2/personal/info",
      screenId: "emp-mobile-v2-personal-info",
      state: "prototype",
      assertion: "v2 personal info",
    });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
