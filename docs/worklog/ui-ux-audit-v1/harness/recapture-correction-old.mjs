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
const manifestPath = join(repo, ".tmp", "ui-ux-audit-v1", "correction-old-shots.csv");
const baseURL = process.env.OLD_APP_URL ?? "http://127.0.0.1:3010";
const runtime = "old-demo-db-copy-isolated";
const role = "admin-dev-preview";

async function shot(page, spec) {
  await captureShot(page, {
    app: "OLD",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role,
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: spec.assertion,
    routeAssertion: spec.route,
  });
}

async function main() {
  initScreenshotManifest(manifestPath);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  await context.addInitScript(() => {
    sessionStorage.setItem("workos-dev-role", "admin");
  });
  const page = await context.newPage();

  await page.goto(`${baseURL}/clients/Demo%20Client%20Alpha`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
  await requireUrlMatch(page, "/clients/");
  const tabBar = page.locator("div.flex.items-center.gap-0\\.5.border-b");
  for (const [label, screenId, assertion] of [
    ["Overview", "client-tab-overview", "Overview"],
    ["Cereri", "client-tab-cereri", "Cereri"],
    ["Oferte", "client-tab-oferte", "Oferte"],
    ["Comenzi", "client-tab-comenzi", "Comenzi"],
  ]) {
    const tab = tabBar.getByRole("button", { name: label, exact: true });
    if ((await tab.count()) === 0) {
      throw new Error(`ASSERTION_FAILED missing local client tab ${label}`);
    }
    await tab.click();
    await waitSettled(page);
    await requireUrlMatch(page, "/clients/");
    if (page.url().includes("/orders") && !page.url().includes("/clients/")) {
      throw new Error("ASSERTION_FAILED client tab navigated to global orders");
    }
    await requireVisibleText(page, "Demo Client Alpha");
    await shot(page, {
      route: "/clients/:clientName",
      screenId,
      state: "local-tab",
      assertion: `client local tab ${assertion}`,
    });
  }

  await page.goto(
    `${baseURL}/product-system/products/TPL-ACM-BOXED-MOUNTING-SUPPORT_v1`,
    { waitUntil: "domcontentloaded", timeout: 45000 },
  );
  await waitSettled(page);
  await requireUrlMatch(page, "/product-system/products/");
  await page.waitForTimeout(1500);
  const editorOpened = await page.evaluate(() => {
    const button = document.querySelector("[data-testid='product-system-v2-admin-open-editor']");
    if (!button) {
      return false;
    }
    button.click();
    return true;
  });
  if (!editorOpened) {
    throw new Error("ASSERTION_FAILED legacy editor button missing");
  }
  await page.waitForTimeout(2000);
  const compiler = page.getByTestId("product-system-studio-tab-compiler");
  if ((await compiler.count()) === 0) {
    throw new Error("ASSERTION_FAILED Product Compiler tab missing");
  }
  await compiler.click();
  await waitSettled(page);
  await requireUrlMatch(page, "/product-system/products/");
  await requireVisibleText(page, "Product Compiler");
  await shot(page, {
    route: "/product-system/products/:templateCode",
    screenId: "ps-studio-tab-structure",
    state: "local-tab",
    assertion: "Product Compiler",
  });

  const operational = page.getByRole("button", { name: "Resurse operaționale", exact: true });
  await operational.click();
  await waitSettled(page);
  await requireUrlMatch(page, "/product-system/products/");
  if (page.url().includes("/reports/operational")) {
    throw new Error("ASSERTION_FAILED studio operational tab opened global reports");
  }
  await requireVisibleText(page, "Resurse operaționale");
  await shot(page, {
    route: "/product-system/products/:templateCode",
    screenId: "ps-studio-tab-operational",
    state: "local-tab",
    assertion: "Resurse operaționale",
  });

  const formTab = page.getByTestId("product-system-form-system-tab");
  if ((await formTab.count()) > 0) {
    await formTab.click();
    await waitSettled(page);
    await requireUrlMatch(page, "/product-system/products/");
    await shot(page, {
      route: "/product-system/products/:templateCode",
      screenId: "ps-studio-tab-form-system",
      state: "local-tab",
      assertion: "Form System",
    });
  }

  const general = page.getByRole("button", { name: "Informații generale", exact: true });
  if ((await general.count()) > 0) {
    await general.click();
    await waitSettled(page);
    await requireUrlMatch(page, "/product-system/products/");
    await shot(page, {
      route: "/product-system/products/:templateCode",
      screenId: "ps-studio-tab-general",
      state: "local-tab",
      assertion: "Informații generale",
    });
  }

  await page.goto(`${baseURL}/intake-v6-app/operator`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
  await requireUrlMatch(page, "/intake-v6-app/");
  if (!page.url().includes("/operator")) {
    throw new Error(`ASSERTION_FAILED intake standalone is not an operator workspace: ${page.url()}`);
  }
  const intakeText = await page.locator("body").innerText();
  if (intakeText.trim().length < 20) {
    throw new Error("ASSERTION_FAILED intake standalone operator is blank");
  }
  await shot(page, {
    route: "/intake-v6-app/operator",
    screenId: "intake-v6-standalone-operator",
    state: "operator-workspace",
    assertion: "intake operator workspace visible",
  });

  await page.goto(`${baseURL}/execution`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
  await requireVisibleText(page, "Execuție");
  const detail = page.locator("a[href^='/execution/']").filter({
    hasNotText: /ops-graph|reality-review|machine-runs/i,
  });
  let opened = false;
  const count = await detail.count();
  for (let index = 0; index < count; index += 1) {
    const href = await detail.nth(index).getAttribute("href");
    if (!href || /ops-graph|reality-review|machine-runs/.test(href)) {
      continue;
    }
    await detail.nth(index).click();
    await waitSettled(page);
    if (/\/execution\/ops-graph/.test(page.url())) {
      continue;
    }
    await requireUrlMatch(page, "/execution/");
    await shot(page, {
      route: "/execution/:order_id",
      screenId: "execution-detail",
      state: "opened-from-list",
      assertion: "execution detail not ops-graph",
    });
    opened = true;
    break;
  }
  if (!opened) {
    console.log("OLD_EXECUTION_DETAIL_UNAVAILABLE");
  }

  await page.goto(`${baseURL}/orders/DEMO-ORDER-001`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
  const orderCard = page.getByText("DEMO-ORDER-001").first();
  if (await orderCard.isVisible().catch(() => false)) {
    await orderCard.click();
    await waitSettled(page);
  }
  await requireVisibleText(page, "DEMO-ORDER-001");
  await requireVisibleText(page, "Demo Client Alpha");
  await shot(page, {
    route: "/orders/:orderId",
    screenId: "comenzi-detail",
    state: "selected-detail",
    assertion: "DEMO-ORDER-001 selected",
  });

  await browser.close();
  console.log("OLD_RECAPTURE_OK");
}

await main();
