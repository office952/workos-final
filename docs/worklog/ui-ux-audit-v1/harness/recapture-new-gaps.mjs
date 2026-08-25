import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DESKTOP, captureShot, safeClick, waitSettled } from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "new");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = "http://127.0.0.1:5173";
const runtime = "single-plane-dev-isolated";

async function shot(page, spec) {
  await captureShot(page, {
    app: "NEW",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role: "operator-dev",
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: spec.assertion,
    routeAssertion: page.url(),
  });
}

async function blurPeople(page) {
  await page.addStyleTag({
    content: `
      .people-list, .person-identity, .person-name, .catalog-product-link {
        filter: blur(7px);
      }
    `,
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: DESKTOP });
  const api = page.request;

  await page.goto(`${baseURL}/admin/seller`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await page.addStyleTag({
    content: `label:has-text, .field-label { }`,
  });
  await captureShot(page, {
    app: "NEW",
    route: "/admin/seller",
    screenId: "admin-seller",
    state: "empty-form-labels-only",
    role: "operator-dev",
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: "Date firmă empty draft",
    routeAssertion: page.url(),
  });

  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  if (await safeClick(page.getByRole("button", { name: "Identifică-te" }))) {
    await shot(page, {
      route: "(shell overlay)",
      screenId: "operator-identify-dialog",
      state: "open-empty-pin",
      assertion: "operator dialog",
    });
    await safeClick(page.getByRole("button", { name: "Anulează" }));
  }

  await page.goto(`${baseURL}/admin/people`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await blurPeople(page);
  await shot(page, {
    route: "/admin/people",
    screenId: "admin-people-list",
    state: "populated-names-masked",
    assertion: "people list masked",
  });

  const people = await api.get(`${baseURL}/api/people`);
  if (people.ok()) {
    const body = await people.json();
    const first = (body.people ?? []).find((item) => item.status === "ACTIVE");
    if (first?.personId) {
      await page.goto(`${baseURL}/admin/people/${encodeURIComponent(first.personId)}`, {
        waitUntil: "domcontentloaded",
      });
      await waitSettled(page);
      await blurPeople(page);
      await page.addStyleTag({
        content: `h1, .page-header h1, .page-title { filter: blur(7px); }`,
      });
      await shot(page, {
        route: "/admin/people/:personId",
        screenId: "admin-person-detail",
        state: "populated-names-masked",
        assertion: "person detail masked",
      });
    }
  }

  const inventory = await api.get(`${baseURL}/api/inventory`);
  if (inventory.ok()) {
    const body = await inventory.json();
    const items = body.balances ?? body.items ?? body.materials ?? body.stock ?? [];
    const first = Array.isArray(items) ? items[0] : null;
    const resourceId = first?.resourceId ?? first?.id;
    if (resourceId) {
      await page.goto(`${baseURL}/admin/stock/${encodeURIComponent(resourceId)}`, {
        waitUntil: "domcontentloaded",
      });
      await waitSettled(page);
      await shot(page, {
        route: "/admin/stock/:resourceId",
        screenId: "admin-stock-item",
        state: "populated",
        assertion: "stock item",
      });
    }
  }

  const quotes = await api.get(`${baseURL}/api/quotes`);
  if (quotes.ok()) {
    const body = await quotes.json();
    const list = body.quotes ?? body.items ?? [];
    const first = list[0];
    const quoteId = first?.quoteSnapshotId ?? first?.id;
    const productCode = first?.productCode ?? "PRD-LETTERS-FRONTLIT-PLEXI-AL06";
    if (quoteId) {
      await page.goto(`${baseURL}/products/${productCode}?quote=${encodeURIComponent(quoteId)}`, {
        waitUntil: "domcontentloaded",
      });
      await waitSettled(page);
      await shot(page, {
        route: `/products/${productCode}?quote=`,
        screenId: "product-config-quote-restore",
        state: "populated",
        assertion: "quote restore",
      });
    }
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
