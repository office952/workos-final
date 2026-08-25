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
    routeAssertion: spec.routeAssertion ?? page.url(),
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const unavailablePage = await browser.newPage({ viewport: DESKTOP });
  await unavailablePage.route("**/api/cloud/session", (route) => route.abort());
  await unavailablePage.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await unavailablePage.waitForTimeout(800);
  await shot(unavailablePage, {
    route: "(boot)",
    screenId: "app-boot-unavailable",
    state: "backend-unreachable",
    assertion: "Sistemul nu răspunde",
    routeAssertion: unavailablePage.url(),
  });
  await unavailablePage.close();

  const page = await browser.newPage({ viewport: DESKTOP });

  await page.goto(`${baseURL}/this-route-does-not-exist`, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/", { timeout: 8000 }).catch(() => undefined);
  await waitSettled(page);
  await captureShot(page, {
    app: "NEW",
    route: "*",
    screenId: "catch-all-redirect",
    state: "redirected-to-jobs",
    role: "operator-dev",
    runtime,
    viewport: DESKTOP,
    outDir,
    manifestPath,
    assertion: "unknown route redirected to Lucrări",
    routeAssertion: page.url(),
  });

  await page.goto(`${baseURL}/admin/stock`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  const stockLink = page.locator("a[href^='/admin/stock/']").first();
  if (await stockLink.isVisible().catch(() => false)) {
    await stockLink.click();
    await waitSettled(page);
    await shot(page, {
      route: "/admin/stock/:resourceId",
      screenId: "admin-stock-item",
      state: "populated",
      assertion: "stock item from list",
    });
  }

  await page.goto(`${baseURL}/quotes`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  const quoteLink = page.locator("a[href*='?quote=']").first();
  if (await quoteLink.isVisible().catch(() => false)) {
    await quoteLink.click();
    await waitSettled(page);
    await shot(page, {
      route: page.url().replace(baseURL, ""),
      screenId: "product-config-quote-restore",
      state: "populated",
      assertion: "quote restore from Oferte",
    });
  } else {
    const quotes = await page.request.get(`${baseURL}/api/quotes`);
    if (quotes.ok()) {
      const body = await quotes.json();
      const first = body.overview?.quotes?.[0];
      if (first?.continueHref) {
        await page.goto(new URL(first.continueHref, baseURL).toString(), {
          waitUntil: "domcontentloaded",
        });
        await waitSettled(page);
        await shot(page, {
          route: first.continueHref,
          screenId: "product-config-quote-restore",
          state: "populated",
          assertion: "quote restore from overview.continueHref",
        });
      }
    }
  }

  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  const search = page.getByPlaceholder(/caut/i).first();
  if (await search.isVisible().catch(() => false)) {
    await search.fill("zzzz-no-match");
    await waitSettled(page);
    await shot(page, {
      route: "/",
      screenId: "jobs-overview",
      state: "search-empty",
      assertion: "search with no match",
    });
  }

  await page.goto(`${baseURL}/requests`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  const requestSearch = page.getByPlaceholder(/caut/i).first();
  if (await requestSearch.isVisible().catch(() => false)) {
    await requestSearch.fill("zzzz-no-match");
    await waitSettled(page);
    await shot(page, {
      route: "/requests",
      screenId: "requests-overview",
      state: "search-empty",
      assertion: "request search empty",
    });
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
