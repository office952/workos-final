import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, safeClick, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "old");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = process.env.OLD_APP_URL ?? "http://127.0.0.1:3010";
const runtime = "old-demo-db-copy-isolated";
const template = "TPL-ACM-BOXED-MOUNTING-SUPPORT_v1";
const demoWorkspace = process.env.OLD_DEMO_INTAKE_ID ?? "d0e10001-0000-4000-8000-000000000001";

async function shot(page, spec) {
  await captureShot(page, {
    app: "OLD",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role: spec.role ?? "admin-dev-preview",
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
    timeout: 20000,
  });
  await waitSettled(page);
}

async function clickNamed(page, name) {
  return (
    (await safeClick(page.getByRole("tab", { name }))) ||
    (await safeClick(page.getByRole("button", { name }))) ||
    (await safeClick(page.getByRole("link", { name }))) ||
    (await safeClick(page.getByText(name, { exact: true })))
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  await context.addInitScript(() => {
    sessionStorage.setItem("workos-dev-role", "admin");
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.setDefaultNavigationTimeout(20000);

  await goto(page, `/product-system/products/${template}`);
  await page.waitForTimeout(1200);
  await shot(page, {
    route: "/product-system/products/:templateCode",
    screenId: "product-system-editor",
    state: "opened",
    assertion: "template studio",
  });
  for (const tab of ["Structură", "Structura", "Operațional", "Operational", "Formular", "General"]) {
    if (await clickNamed(page, tab)) {
      await waitSettled(page);
      await shot(page, {
        route: page.url(),
        screenId: `ps-studio-tab-${tab.toLowerCase()}`,
        state: "opened",
        assertion: tab,
      });
    }
  }

  for (const [path, screenId] of [
    [`/product-system/products/${template}/structure/vizual-fata`, "ps-structure-face"],
    [`/product-system/products/${template}/structure/volum-aluminiu`, "ps-structure-volume-al"],
    [`/product-system/products/${template}/structure/capac-spate`, "ps-structure-back"],
    [`/product-system/products/${template}/structure/sistem-led`, "ps-structure-led"],
    [`/product-system/products/${template}/structure/conexiune-litere-acm-preturi`, "ps-structure-acm-prices"],
    ["/product-system/output-blocks-preview", "output-blocks-preview"],
  ]) {
    await goto(page, path);
    await shot(page, {
      route: path,
      screenId,
      state: "opened",
      assertion: screenId,
    });
  }

  await goto(page, "/product-system/products");
  await page
    .waitForFunction(() => !document.body.innerText.includes("Se încarcă"), { timeout: 15000 })
    .catch(() => undefined);
  await shot(page, {
    route: "/product-system/products",
    screenId: "product-system-catalog",
    state: "admin-preview-loaded",
    assertion: "catalog after load",
  });

  await goto(page, "/intake");
  const statusCard = page.locator("button, a, [role='button']").filter({ hasText: /Nou|Draft|Ofert|Accept/i }).first();
  if (await statusCard.isVisible().catch(() => false)) {
    await statusCard.click();
    await waitSettled(page);
    await shot(page, {
      route: "/intake",
      screenId: "cereri-pipeline-filter",
      state: "status-selected",
      assertion: "pipeline filter",
    });
  }

  for (const [listPath, linkFragment, screenId] of [
    ["/quotes", "/quotes/", "oferte-detail"],
    ["/orders", "/orders/", "comenzi-detail"],
    ["/execution", "/execution/", "execution-detail"],
    ["/execution/machine-runs", "/execution/machine-runs/", "machine-run-detail"],
    ["/clients", "/clients/", "client-workspace"],
    ["/employees-records", "/employees-records/", "employee-profile"],
  ]) {
    await goto(page, listPath);
    const link = page.locator(`a[href*='${linkFragment}']`).nth(1);
    const fallback = page.locator(`a[href*='${linkFragment}']`).first();
    const target = (await link.isVisible().catch(() => false)) ? link : fallback;
    if (await target.isVisible().catch(() => false)) {
      await target.click();
      await waitSettled(page);
      await shot(page, {
        route: `${listPath}/:id`,
        screenId,
        state: "opened",
        assertion: screenId,
      });
    }
  }

  if (page.url().includes("/clients/")) {
    for (const tab of ["Prezentare", "Overview", "Cereri", "Oferte", "Comenzi", "Timeline"]) {
      if (await clickNamed(page, tab)) {
        await shot(page, {
          route: page.url(),
          screenId: `client-tab-${tab.toLowerCase()}`,
          state: "opened",
          assertion: tab,
        });
      }
    }
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
    const task = page.locator("a[href*='/tablet/']").nth(1);
    if (await task.isVisible().catch(() => false)) {
      await task.click();
      await waitSettled(page);
      await shot(page, {
        route: "/tablet/:stationId/:taskId",
        screenId: "tablet-task-detail",
        state: "opened",
        assertion: "tablet task",
      });
    }
  }

  await goto(page, "/documents");
  const docRow = page.locator("table tbody tr, [role='row']").nth(1);
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

  await goto(page, `/intake-v6/${demoWorkspace}/operator`);
  for (const step of ["Finisaje", "Iluminare", "Panou", "Montaj", "Carcas"]) {
    if (await clickNamed(page, step)) {
      await shot(page, {
        route: "/intake-v6/:workspaceId/operator",
        screenId: `intake-v6-review-${step.toLowerCase()}`,
        state: "demo-workspace",
        assertion: step,
      });
    }
  }

  await goto(page, "/employee-app/personal");
  const blueprint = page.locator("a[href*='/blueprint']").first();
  if (await blueprint.isVisible().catch(() => false)) {
    await blueprint.click();
    await waitSettled(page);
    await shot(page, {
      route: "/employee-app/tasks/orders/:orderId/blueprint",
      screenId: "emp-mobile-v1-order-blueprint",
      state: "opened",
      assertion: "mobile blueprint",
    });
  }

  await goto(page, "/employee-app-v2/tasks");
  const v2task = page.locator("a[href*='/employee-app-v2/tasks/']").first();
  if (await v2task.isVisible().catch(() => false)) {
    await v2task.click();
    await waitSettled(page);
    await shot(page, {
      route: "/employee-app-v2/tasks/:taskId",
      screenId: "emp-mobile-v2-task-detail",
      state: "opened",
      assertion: "v2 task detail",
    });
  }

  await goto(page, "/employee-app-v2/personal/info");
  await shot(page, {
    route: "/employee-app-v2/personal/info",
    screenId: "emp-mobile-v2-personal-info",
    state: "prototype",
    assertion: "v2 personal info",
  });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
