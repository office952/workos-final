import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "./fixtures";
import {
  createCommercialOrder,
  createCommercialPlan,
  releaseCommercialOrder,
  uniqueJobInscription,
} from "./helpers/jobs";
import {
  configureTestExecutorPin,
  ensureTestExecutor,
  identifyTestExecutorOnPage,
} from "./helpers/people";
import { createCommercialQuote, uniqueQuoteInscription } from "./helpers/quotes";
import {
  createNamedCustomer,
  createNamedRequest,
  uniqueRequestToken,
} from "./helpers/requests";

const CANONICAL_PRODUCT = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";
const STOCK_RESOURCE = "MAT-LED-MODULE";
const PROOF_DIR = join(process.cwd(), ".tmp", "ui-v3-all-pages", "final-proof");

type Combo = {
  name: "1440 LIGHT" | "1280 LIGHT" | "768 LIGHT" | "1440 DARK";
  width: number;
  height: number;
  theme: "light" | "dark";
};

const COMBOS: Combo[] = [
  { name: "1440 LIGHT", width: 1440, height: 900, theme: "light" },
  { name: "1280 LIGHT", width: 1280, height: 800, theme: "light" },
  { name: "768 LIGHT", width: 768, height: 1024, theme: "light" },
  { name: "1440 DARK", width: 1440, height: 900, theme: "dark" },
];

type SyntheticIds = {
  customerId: string;
  requestId: string;
  quoteSnapshotId: string;
  orderSnapshotId: string;
  planId: string;
  personId: string;
};

type RouteVisit = {
  id: string;
  path: string;
  expectUrl?: RegExp;
  expectHeading?: string | RegExp;
  allowEmptyState?: boolean;
};

function routesFor(ids: SyntheticIds): RouteVisit[] {
  return [
    { id: "/", path: "/", expectHeading: "Lucrări" },
    { id: "/jobs", path: "/jobs", expectHeading: "Lucrări" },
    { id: "/jobs/*", path: `/jobs/${encodeURIComponent(ids.orderSnapshotId)}` },
    { id: "/atelier", path: "/atelier", expectHeading: "Atelier" },
    {
      id: "/commercial",
      path: "/commercial",
      expectUrl: /\/requests$/,
      expectHeading: "Cereri de ofertă",
    },
    { id: "/requests", path: "/requests", expectHeading: "Cereri de ofertă" },
    { id: "/requests/*", path: `/requests/${encodeURIComponent(ids.requestId)}` },
    { id: "/quotes", path: "/quotes", expectHeading: "Oferte" },
    { id: "/quotes/*", path: `/quotes/${encodeURIComponent(ids.quoteSnapshotId)}` },
    { id: "/clients", path: "/clients", expectHeading: "Clienți" },
    { id: "/clients/*", path: `/clients/${encodeURIComponent(ids.customerId)}` },
    { id: "/system", path: "/system", expectHeading: "Stare sistem" },
    { id: "/products", path: "/products", expectHeading: "Catalog" },
    {
      id: "/products/:productCode",
      path: `/products/${CANONICAL_PRODUCT}`,
      expectHeading: /Litere/,
    },
    { id: "/execution/*", path: `/execution/${encodeURIComponent(ids.planId)}` },
    { id: "/components", path: "/components", expectHeading: "Module și componente" },
    { id: "/governance", path: "/governance", expectHeading: "Guvernanța sistemului" },
    { id: "/admin", path: "/admin", expectHeading: "Administrare" },
    {
      id: "/admin/product-system",
      path: "/admin/product-system",
      expectHeading: "Sistem produs",
    },
    { id: "/admin/resources", path: "/admin/resources", expectHeading: "Resurse și costuri" },
    { id: "/admin/stock", path: "/admin/stock", expectHeading: "Stoc" },
    {
      id: "/admin/stock/:resourceId",
      path: `/admin/stock/${STOCK_RESOURCE}`,
      expectHeading: /Modul LED|Stoc/,
    },
    { id: "/admin/processes", path: "/admin/processes", expectHeading: "Procese operaționale" },
    { id: "/admin/workcenters", path: "/admin/workcenters", expectHeading: "Utilaje și zone" },
    { id: "/admin/people", path: "/admin/people", expectHeading: "Oameni" },
    { id: "/admin/people/skills", path: "/admin/people/skills", expectHeading: "Calificări" },
    { id: "/admin/people/*", path: `/admin/people/${encodeURIComponent(ids.personId)}` },
    { id: "/admin/customers", path: "/admin/customers", expectHeading: "Clienți" },
    { id: "/admin/seller", path: "/admin/seller", expectHeading: "Date firmă" },
    {
      id: "/admin/operational-services",
      path: "/admin/operational-services",
      expectHeading: "Servicii operaționale",
    },
    { id: "*", path: "/this-route-does-not-exist", expectUrl: /\/$/, expectHeading: "Lucrări" },
  ];
}

async function createSyntheticIds(request: Parameters<typeof createNamedCustomer>[0]): Promise<SyntheticIds> {
  const token = uniqueRequestToken("VR");
  const customer = await createNamedCustomer(request, `Client ${token}`);
  expect(customer.ok && customer.customerId).toBeTruthy();
  const createdRequest = await createNamedRequest(request, {
    customerId: customer.customerId!,
    title: `Cerere ${token}`,
  });
  expect(createdRequest.ok && createdRequest.requestId).toBeTruthy();
  const quote = await createCommercialQuote(request, uniqueQuoteInscription("VQ"));
  const planned = await createCommercialPlan(
    request,
    await releaseCommercialOrder(
      request,
      await createCommercialOrder(request, uniqueJobInscription("VJ")),
    ),
  );
  const executor = await ensureTestExecutor(request);
  await configureTestExecutorPin(request, executor.personId);
  expect(planned.planId && planned.orderSnapshotId).toBeTruthy();
  return {
    customerId: customer.customerId!,
    requestId: createdRequest.requestId!,
    quoteSnapshotId: quote.quoteSnapshotId,
    orderSnapshotId: planned.orderSnapshotId,
    planId: planned.planId!,
    personId: executor.personId,
  };
}

async function applyCombo(page: Page, combo: Combo) {
  await page.addInitScript((theme: "light" | "dark") => {
    window.localStorage.setItem("workos.theme", theme);
  }, combo.theme);
  await page.setViewportSize({ width: combo.width, height: combo.height });
}

async function waitUntilSettled(page: Page) {
  await expect(page.getByRole("heading", { name: "Se încarcă", exact: true })).toHaveCount(0);
  await expect(page.locator(".page-status-loading")).toHaveCount(0, { timeout: 20_000 });
}

type PageAudit = {
  overflowPx: number;
  headingCount: number;
  emptyState: boolean;
  pageStatus: boolean;
  navUsable: boolean;
  wideControl: string | null;
  whiteIslands: string[];
};

async function auditPage(page: Page, combo: Combo): Promise<PageAudit> {
  return page.evaluate((theme) => {
    const overflowPx = document.documentElement.scrollWidth - window.innerWidth;
    const headingCount = document.querySelectorAll("h1").length;
    const emptyState = Boolean(document.querySelector(".empty-state"));
    const pageStatus = Boolean(document.querySelector(".page-status"));
    const nav = document.querySelector('[aria-label="Navigare principală"]');
    const menu = document.querySelector(".app-meniu-trigger");
    const navUsable = Boolean(
      (nav && getComputedStyle(nav).display !== "none") ||
        (menu && getComputedStyle(menu).display !== "none"),
    );
    let wideControl: string | null = null;
    for (const el of document.querySelectorAll("button, a, input, select, textarea")) {
      const box = el.getBoundingClientRect();
      if (box.width > window.innerWidth + 8) {
        wideControl = `${el.tagName}.${el.className}`.slice(0, 120);
        break;
      }
    }
    const whiteIslands: string[] = [];
    if (theme === "dark") {
      const root = document.querySelector("#continut-principal") ?? document.body;
      for (const el of root.querySelectorAll(
        "section, article, table, .metric-card, .registry-row, .request-section, .owner-catalog, .page-header",
      )) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg === "rgb(255, 255, 255)" && el.clientHeight > 32 && el.clientWidth > 80) {
          whiteIslands.push((el.className || el.tagName).toString().slice(0, 80));
        }
      }
    }
    return {
      overflowPx,
      headingCount,
      emptyState,
      pageStatus,
      navUsable,
      wideControl,
      whiteIslands,
    };
  }, combo.theme);
}

test.describe("UI V3 all existing routes matrix", () => {
  let ids: SyntheticIds;

  test.beforeAll(async ({ request }) => {
    ids = await createSyntheticIds(request);
  });

  for (const combo of COMBOS) {
    test(`${combo.name} visits every resolvable existing route`, async ({ page }) => {
      test.setTimeout(180_000);
      const fatal: string[] = [];
      page.on("pageerror", (error) => {
        fatal.push(error.message);
      });
      await applyCombo(page, combo);
      const visits = routesFor(ids);
      const failures: string[] = [];

      for (const visit of visits) {
        await page.goto(visit.path);
        if (visit.expectUrl) {
          await expect(page).toHaveURL(visit.expectUrl);
        }
        await waitUntilSettled(page);
        if (visit.expectHeading) {
          await expect(page.getByRole("heading", { name: visit.expectHeading }).first()).toBeVisible();
        } else {
          await expect(page.locator("h1").first()).toBeVisible();
        }
        const audit = await auditPage(page, combo);
        if (fatal.length > 0) {
          failures.push(`${visit.id}: uncaught ${fatal.join(" | ")}`);
          fatal.length = 0;
        }
        if (audit.overflowPx > 2) {
          failures.push(`${visit.id}: overflow ${audit.overflowPx}px`);
        }
        if (!visit.expectHeading && audit.headingCount === 0 && !audit.emptyState && !audit.pageStatus) {
          failures.push(`${visit.id}: no H1 / empty / status`);
        }
        if (!audit.navUsable) {
          failures.push(`${visit.id}: navigation not usable`);
        }
        if (audit.wideControl) {
          failures.push(`${visit.id}: impossible-width ${audit.wideControl}`);
        }
        if (audit.whiteIslands.length > 0) {
          failures.push(`${visit.id}: white islands ${audit.whiteIslands.join(", ")}`);
        }
        if (combo.name === "768 LIGHT" && visit.id === "/products") {
          await expect(page.locator(".catalog-product-detail")).toBeHidden();
          await expect(page.locator(".catalog-product-link").first()).toBeVisible();
        }
      }

      expect(failures, failures.join("\n")).toEqual([]);
    });
  }

  test("representative visual pack after matrix setup", async ({ page }) => {
    mkdirSync(PROOF_DIR, { recursive: true });
    const shots: Array<{
      file: string;
      path: string;
      width: number;
      theme: "light" | "dark";
      heading: string | RegExp;
      settle: "registry" | "quote" | "job" | "atelier" | "execution" | "resources" | "catalog768";
    }> = [
      {
        file: "01-oferte-1440-light.png",
        path: "/quotes",
        width: 1440,
        theme: "light",
        heading: "Oferte",
        settle: "registry",
      },
      {
        file: "02-lucrari-1440-light.png",
        path: "/jobs",
        width: 1440,
        theme: "light",
        heading: "Lucrări",
        settle: "registry",
      },
      {
        file: "03-oferta-object-1440-light.png",
        path: `/quotes/${encodeURIComponent(ids.quoteSnapshotId)}`,
        width: 1440,
        theme: "light",
        heading: /.*/,
        settle: "quote",
      },
      {
        file: "04-lucrare-object-1440-light.png",
        path: `/jobs/${encodeURIComponent(ids.orderSnapshotId)}`,
        width: 1440,
        theme: "light",
        heading: /.*/,
        settle: "job",
      },
      {
        file: "05-atelier-1440-light.png",
        path: "/atelier",
        width: 1440,
        theme: "light",
        heading: "Atelier",
        settle: "atelier",
      },
      {
        file: "06-execution-1440-light.png",
        path: `/execution/${encodeURIComponent(ids.planId)}`,
        width: 1440,
        theme: "light",
        heading: /.*/,
        settle: "execution",
      },
      {
        file: "07-resources-1440-light.png",
        path: "/admin/resources",
        width: 1440,
        theme: "light",
        heading: "Resurse și costuri",
        settle: "resources",
      },
      {
        file: "08-catalog-768-light.png",
        path: "/products",
        width: 768,
        theme: "light",
        heading: "Catalog",
        settle: "catalog768",
      },
      {
        file: "09-cereri-1440-dark.png",
        path: "/requests",
        width: 1440,
        theme: "dark",
        heading: "Cereri de ofertă",
        settle: "registry",
      },
      {
        file: "10-oferta-object-1440-dark.png",
        path: `/quotes/${encodeURIComponent(ids.quoteSnapshotId)}`,
        width: 1440,
        theme: "dark",
        heading: /.*/,
        settle: "quote",
      },
    ];
    for (const shot of shots) {
      await applyCombo(page, {
        name: shot.width === 768 ? "768 LIGHT" : shot.theme === "dark" ? "1440 DARK" : "1440 LIGHT",
        width: shot.width,
        height: shot.width === 768 ? 1024 : 900,
        theme: shot.theme,
      });
      await page.goto(shot.path);
      await waitUntilSettled(page);
      if (shot.settle === "atelier") {
        await identifyTestExecutorOnPage(page);
        await waitUntilSettled(page);
      }
      if (shot.heading instanceof RegExp && shot.heading.source === ".*") {
        await expect(page.locator("h1").first()).toBeVisible();
      } else {
        await expect(page.getByRole("heading", { name: shot.heading }).first()).toBeVisible();
      }
      switch (shot.settle) {
        case "registry":
          await expect(page.locator(".metric-band")).toBeVisible();
          break;
        case "quote":
          await expect(page.getByText("Preț client")).toBeVisible();
          await expect(page.locator(".commercial-job-total-value")).toBeVisible();
          break;
        case "job":
          await expect(page.locator(".client-object-header")).toBeVisible();
          break;
        case "atelier":
          await expect(page.locator(".metric-band")).toBeVisible();
          await expect(page.getByText(/Inbox operațional/)).toBeVisible();
          break;
        case "execution":
          await expect(page.getByRole("heading", { name: "Plan de execuție" })).toBeVisible();
          break;
        case "resources":
          await expect(page.getByRole("button", { name: "Costuri interne" })).toBeVisible();
          await expect(page.getByPlaceholder("Caută...")).toBeVisible();
          break;
        case "catalog768":
          await expect(page.locator(".catalog-product-detail")).toBeHidden();
          await expect(page.locator(".catalog-product-link").first()).toBeVisible();
          break;
        default: {
          const exhaustive: never = shot.settle;
          throw new Error(`unhandled visual settle ${exhaustive}`);
        }
      }
      await page.screenshot({
        path: join(PROOF_DIR, shot.file),
        fullPage: true,
      });
    }
  });

  test("representative keyboard and target sanity", async ({ page }) => {
    await applyCombo(page, COMBOS[0]);
    await page.goto("/quotes");
    await waitUntilSettled(page);
    await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
    const search = page.getByRole("searchbox");
    await search.focus();
    await expect(search).toBeFocused();

    await page.goto(`/quotes/${encodeURIComponent(ids.quoteSnapshotId)}`);
    await waitUntilSettled(page);
    const primary = page.getByRole("button", { name: "Marchează acceptată" });
    await primary.focus();
    await expect(primary).toBeFocused();
    const primaryBox = await primary.boundingBox();
    expect(primaryBox && primaryBox.height >= 44 && primaryBox.width >= 44).toBeTruthy();

    await page.getByRole("button", { name: "Cont" }).click();
    await expect(page.getByRole("dialog", { name: "Datele contului" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Datele contului" })).toBeHidden();

    await applyCombo(page, COMBOS[2]);
    await page.goto("/products");
    await waitUntilSettled(page);
    const menu = page.getByRole("button", { name: "Meniu" });
    await expect(menu).toBeVisible();
    await menu.focus();
    await expect(menu).toBeFocused();
    const menuBox = await menu.boundingBox();
    expect(menuBox && menuBox.height >= 44 && menuBox.width >= 44).toBeTruthy();
    await menu.click();
    await expect(page.getByRole("dialog", { name: "Meniu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Meniu" })).toHaveCount(0);
  });
});
