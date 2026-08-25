import { randomBytes } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  DESKTOP,
  NARROW,
  TABLET,
  appendScreenshotRow,
  captureShot,
  clickEach,
  initScreenshotManifest,
  safeClick,
  setViewport,
  waitSettled,
} from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "new");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = process.env.NEW_APP_URL ?? "http://127.0.0.1:5173";
const runtime = process.env.NEW_RUNTIME_FIXTURE ?? "single-plane-dev-isolated";
const role = "operator-dev";

const RESPONSIVE = new Set([
  "jobs-overview",
  "atelier-inbox",
  "requests-overview",
  "quotes-overview",
  "clients-overview",
  "product-catalog",
  "product-config-letters-edit",
  "admin-home",
  "admin-people-list",
  "execution-workspace",
  "cloud-login",
  "operator-identify-dialog",
]);

async function shot(page, spec) {
  const viewports = spec.viewports ?? [DESKTOP];
  for (const viewport of viewports) {
    await setViewport(page, viewport);
    await captureShot(page, {
      app: "NEW",
      route: spec.route,
      screenId: spec.screenId,
      state: spec.state,
      role: spec.role ?? role,
      runtime,
      viewport,
      outDir,
      manifestPath,
      assertion: spec.assertion,
      routeAssertion: spec.routeAssertion ?? page.url(),
    });
  }
}

function viewportsFor(screenId) {
  return RESPONSIVE.has(screenId) ? [DESKTOP, TABLET, NARROW] : [DESKTOP];
}

async function expectText(page, text) {
  const found = await page.getByText(text).first().isVisible().catch(() => false);
  if (!found) {
    throw new Error(`ASSERTION_FAILED missing visible text: ${JSON.stringify(text)} at ${page.url()}`);
  }
  return text;
}

async function openCatalogCategories(page) {
  const cats = page.getByRole("navigation", { name: "Categorii catalog" }).getByRole("button");
  await clickEach(cats, 10);
}

async function captureStaticRoutes(page) {
  const routes = [
    { path: "/", screenId: "jobs-overview", heading: "Lucrări", state: "empty-or-populated" },
    { path: "/atelier", screenId: "atelier-inbox", heading: "Munca mea", state: "empty-or-no-session" },
    { path: "/requests", screenId: "requests-overview", heading: "Cereri", state: "empty-or-populated" },
    { path: "/quotes", screenId: "quotes-overview", heading: "Oferte", state: "empty-or-populated" },
    { path: "/clients", screenId: "clients-overview", heading: "Clienți", state: "empty-or-populated" },
    { path: "/products", screenId: "product-catalog", heading: "Produse", state: "populated-catalog" },
    { path: "/admin", screenId: "admin-home", heading: "Administrare", state: "populated" },
    { path: "/admin/seller", screenId: "admin-seller", heading: "Date firmă", state: "unconfigured-or-configured" },
    { path: "/admin/customers", screenId: "admin-customers-lifecycle", heading: "Clienți", state: "empty-or-populated" },
    { path: "/admin/people", screenId: "admin-people-list", heading: "Oameni", state: "populated" },
    { path: "/admin/people/skills", screenId: "admin-skills", heading: "Competențe", state: "populated" },
    { path: "/admin/resources", screenId: "admin-resources-catalog", heading: "Resurse", state: "populated" },
    { path: "/admin/stock", screenId: "admin-stock-overview", heading: "Stoc", state: "populated" },
    { path: "/admin/processes", screenId: "admin-processes-catalog", heading: "Procese", state: "populated" },
    { path: "/admin/workcenters", screenId: "admin-workcenters-catalog", heading: "Utilaje", state: "populated" },
    { path: "/admin/product-system", screenId: "admin-product-system", heading: "Sistem produs", state: "populated" },
    { path: "/components", screenId: "components-inspection", heading: "Module", state: "populated" },
    { path: "/governance", screenId: "governance-inspection", heading: "Guvernanța", state: "populated" },
    { path: "/system", screenId: "system-status", heading: "Stare sistem", state: "connected" },
  ];

  for (const item of routes) {
    await page.goto(new URL(item.path, baseURL).toString(), { waitUntil: "domcontentloaded" });
    await waitSettled(page);
    const assertion = await expectText(page, item.heading);
    await shot(page, {
      route: item.path,
      screenId: item.screenId,
      state: item.state,
      assertion,
      viewports: viewportsFor(item.screenId),
    });

    if (
      [
        "/admin/resources",
        "/admin/processes",
        "/admin/workcenters",
        "/admin/product-system",
        "/components",
        "/governance",
      ].includes(item.path)
    ) {
      await openCatalogCategories(page);
      await shot(page, {
        route: item.path,
        screenId: `${item.screenId}-categories`,
        state: "category-walk",
        assertion: "catalog categories clicked",
      });
    }

    if (item.path === "/requests") {
      for (const filter of ["Noi", "În lucru", "Blocate", "Anulate"]) {
        if (await safeClick(page.getByRole("button", { name: filter }))) {
          await shot(page, {
            route: "/requests",
            screenId: "requests-overview",
            state: `filter-${filter}`,
            assertion: `filter ${filter}`,
          });
        }
      }
      await safeClick(page.getByRole("button", { name: "Toate" }));
    }

    if (item.path === "/") {
      for (const filter of ["Necesită acțiune", "În execuție", "Finalizate"]) {
        if (await safeClick(page.getByRole("button", { name: filter }))) {
          await shot(page, {
            route: "/",
            screenId: "jobs-overview",
            state: `filter-${filter}`,
            assertion: `filter ${filter}`,
          });
        }
      }
      await safeClick(page.getByRole("button", { name: "Toate" }));
    }
  }

  await page.goto(new URL("/this-route-does-not-exist", baseURL).toString(), {
    waitUntil: "domcontentloaded",
  });
  appendScreenshotRow(manifestPath, {
    app: "NEW",
    route: "*",
    screen_id: "catch-all-redirect",
    state: "redirect",
    role,
    runtime_fixture: runtime,
    viewport: DESKTOP.name,
    region: "none",
    file: "",
    sha256: "",
    visible_assertion: "redirected to /",
    route_assertion: page.url(),
    problems: "",
    status: page.url().endsWith("/") ? "not-applicable" : "blocked",
  });
}

async function captureOperatorDialog(page) {
  await page.goto(new URL("/", baseURL).toString(), { waitUntil: "domcontentloaded" });
  if (await safeClick(page.getByRole("button", { name: "Identifică-te" }))) {
    await shot(page, {
      route: "(shell overlay)",
      screenId: "operator-identify-dialog",
      state: "open-empty-pin",
      assertion: "Identifică operatorul",
      viewports: viewportsFor("operator-identify-dialog"),
    });
    await safeClick(page.getByRole("button", { name: "Anulează" }));
  }
}

async function confirmLetters(page) {
  await page.goto(new URL("/products", baseURL).toString(), { waitUntil: "domcontentloaded" });
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await waitSettled(page);
  await shot(page, {
    route: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    screenId: "product-config-letters-edit",
    state: "empty-form",
    assertion: await expectText(page, "Textul literelor"),
    viewports: viewportsFor("product-config-letters-edit"),
  });
  const inscription = `AUD${randomBytes(2).toString("hex")}`.toUpperCase();
  await page.getByLabel("Textul literelor").fill(inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await shot(page, {
    route: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    screenId: "product-config-letters-edit",
    state: "filled",
    assertion: "filled LETTERS form",
  });
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await waitSettled(page);
  await shot(page, {
    route: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    screenId: "product-config-letters-edit",
    state: "review",
    assertion: await expectText(page, "confirmare"),
  });
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await waitSettled(page);
  await shot(page, {
    route: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    screenId: "product-config-confirmed",
    state: "confirmed-pre-quote",
    assertion: await expectText(page, "Configurație confirmată"),
  });
  return inscription;
}

async function confirmAcm(page) {
  await page.goto(new URL("/products", baseURL).toString(), { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Panou ACM casetat" }).click();
  await waitSettled(page);
  await shot(page, {
    route: "/products/PRD-ACM-CASSETTE-NONE",
    screenId: "product-config-acm-edit",
    state: "empty-form",
    assertion: await expectText(page, "Panou ACM casetat"),
  });
  await page.getByLabel("Denumire lucrare").fill("AUDIT ACM");
  await page.getByLabel("Sistem de prindere").selectOption("steel_angle");
  await page.getByLabel("Lățime exterioară (mm)").fill("1000");
  await page.getByLabel("Înălțime exterioară (mm)").fill("500");
  await page.getByLabel("Adâncime casetă (mm)").selectOption("40");
  await page.getByLabel("Număr de îndoituri").selectOption("2");
  await shot(page, {
    route: "/products/PRD-ACM-CASSETTE-NONE",
    screenId: "product-config-acm-edit",
    state: "filled",
    assertion: "filled ACM form",
  });
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await waitSettled(page);
  await shot(page, {
    route: "/products/PRD-ACM-CASSETTE-NONE",
    screenId: "product-config-acm-edit",
    state: "review",
    assertion: await expectText(page, "confirmare"),
  });
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await waitSettled(page);
  await shot(page, {
    route: "/products/PRD-ACM-CASSETTE-NONE",
    screenId: "product-config-confirmed",
    state: "confirmed-acm",
    assertion: await expectText(page, "Configurație confirmată"),
  });
}

async function walkCommercialSpine(page, request) {
  await confirmLetters(page);
  const quote = page.locator(".quote-section");
  if (await quote.getByRole("textbox", { name: "Nume client" }).isVisible().catch(() => false)) {
    await quote.getByRole("textbox", { name: "Nume client" }).fill("Client Audit Sintetic");
    await quote.getByRole("button", { name: "Adaugă client" }).click();
    await waitSettled(page);
  } else if (await quote.getByRole("combobox", { name: "Client" }).isVisible().catch(() => false)) {
    const select = quote.getByRole("combobox", { name: "Client" });
    const options = await select.locator("option").allTextContents();
    const usable = options.find((item) => item && !item.includes("Selectează") && item.trim().length > 0);
    if (usable) {
      await select.selectOption({ label: usable });
    }
  }
  if (await quote.getByRole("button", { name: "Creează oferta" }).isVisible().catch(() => false)) {
    await quote.getByRole("button", { name: "Creează oferta" }).click();
    await waitSettled(page);
    await shot(page, {
      route: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      screenId: "product-config-confirmed",
      state: "quote-frozen",
      assertion: await expectText(page, "Ofertă"),
    });
    if (await quote.getByRole("button", { name: "Marchează acceptată" }).isVisible().catch(() => false)) {
      await quote.getByRole("button", { name: "Marchează acceptată" }).click();
      await waitSettled(page);
    }
    if (await page.getByRole("button", { name: "Creează comanda" }).isVisible().catch(() => false)) {
      await page.getByRole("button", { name: "Creează comanda" }).click();
      await waitSettled(page);
      await shot(page, {
        route: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        screenId: "product-config-order-restore",
        state: "order-created",
        assertion: await expectText(page, "Comandă"),
      });
    }
    if (await page.getByRole("button", { name: "Eliberează pentru producție" }).isVisible().catch(() => false)) {
      await page.getByRole("button", { name: "Eliberează pentru producție" }).click();
      await waitSettled(page);
    }
    if (await page.getByRole("button", { name: "Creează planul de execuție" }).isVisible().catch(() => false)) {
      await page.getByRole("button", { name: "Creează planul de execuție" }).click();
      await waitSettled(page);
    }
    if (await page.getByRole("link", { name: "Deschide execuția" }).isVisible().catch(() => false)) {
      await page.getByRole("link", { name: "Deschide execuția" }).click();
      await waitSettled(page);
      await shot(page, {
        route: "/execution/:planId",
        screenId: "execution-workspace",
        state: "populated-planned",
        assertion: await expectText(page, "Plan de execuție"),
        viewports: viewportsFor("execution-workspace"),
      });
    }
  }

  const quotes = await request.get(new URL("/api/quotes", baseURL).toString());
  if (quotes.ok()) {
    const body = await quotes.json();
    const first = body.quotes?.[0] ?? body.items?.[0];
    const quoteId = first?.quoteSnapshotId ?? first?.id;
    const productCode = first?.productCode ?? "PRD-LETTERS-FRONTLIT-PLEXI-AL06";
    if (quoteId) {
      await page.goto(new URL(`/products/${productCode}?quote=${encodeURIComponent(quoteId)}`, baseURL).toString());
      await waitSettled(page);
      await shot(page, {
        route: `/products/${productCode}?quote=`,
        screenId: "product-config-quote-restore",
        state: "populated",
        assertion: "quote restore",
      });
    }
  }

  const jobs = await request.get(new URL("/api/jobs", baseURL).toString());
  if (jobs.ok()) {
    const body = await jobs.json();
    const first = body.jobs?.[0] ?? body.items?.[0];
    const orderId = first?.orderSnapshotId ?? first?.id;
    const productCode = first?.productCode ?? "PRD-LETTERS-FRONTLIT-PLEXI-AL06";
    if (orderId) {
      await page.goto(new URL(`/products/${productCode}?order=${encodeURIComponent(orderId)}`, baseURL).toString());
      await waitSettled(page);
      await shot(page, {
        route: `/products/${productCode}?order=`,
        screenId: "product-config-order-restore",
        state: "populated",
        assertion: "order restore",
      });
    }
  }

  const customers = await request.get(new URL("/api/customers", baseURL).toString());
  if (customers.ok()) {
    const body = await customers.json();
    const first = (body.customers ?? []).find((item) => item.status === "ACTIVE") ?? body.customers?.[0];
    if (first?.customerId) {
      for (const section of ["prezentare", "cereri", "oferte", "lucrari"]) {
        await page.goto(
          new URL(`/clients/${first.customerId}?section=${section}`, baseURL).toString(),
        );
        await waitSettled(page);
        await shot(page, {
          route: `/clients/:customerId?section=${section}`,
          screenId: `client-workspace-${section}`,
          state: "populated",
          assertion: `client ${section}`,
        });
      }
    }
  }

  const people = await request.get(new URL("/api/people", baseURL).toString());
  if (people.ok()) {
    const body = await people.json();
    const first = (body.people ?? []).find((item) => item.status === "ACTIVE");
    if (first?.personId) {
      await page.goto(new URL(`/admin/people/${encodeURIComponent(first.personId)}`, baseURL).toString());
      await waitSettled(page);
      await shot(page, {
        route: "/admin/people/:personId",
        screenId: "admin-person-detail",
        state: "populated",
        assertion: await expectText(page, first.displayName ?? "Persoană"),
      });
    }
  }

  const inventory = await request.get(new URL("/api/inventory", baseURL).toString());
  if (inventory.ok()) {
    const body = await inventory.json();
    const first = body.balances?.[0] ?? body.items?.[0] ?? body.materials?.[0];
    const resourceId = first?.resourceId ?? first?.id;
    if (resourceId) {
      await page.goto(new URL(`/admin/stock/${encodeURIComponent(resourceId)}`, baseURL).toString());
      await waitSettled(page);
      await shot(page, {
        route: "/admin/stock/:resourceId",
        screenId: "admin-stock-item",
        state: "populated",
        assertion: "stock item",
      });
    }
  }

  const reqs = await request.get(new URL("/api/requests", baseURL).toString());
  if (reqs.ok()) {
    const body = await reqs.json();
    const first = body.requests?.[0];
    if (first?.requestId) {
      await page.goto(new URL(`/requests/${encodeURIComponent(first.requestId)}`, baseURL).toString());
      await waitSettled(page);
      await shot(page, {
        route: "/requests/:requestId",
        screenId: "request-detail",
        state: "populated-or-created",
        assertion: "request detail",
      });
    }
  }
}

async function createSyntheticRequest(page, request) {
  const created = await request.post(new URL("/api/customers", baseURL).toString(), {
    data: { displayName: "Client Audit Cerere" },
  });
  if (!created.ok()) {
    return;
  }
  const customer = (await created.json()).customer;
  const req = await request.post(new URL("/api/requests", baseURL).toString(), {
    data: {
      customerId: customer.customerId,
      title: "Cerere audit sintetică",
      description: "Fixture izolată pentru audit UI.",
    },
  });
  if (!req.ok()) {
    return;
  }
  const requestBody = await req.json();
  const requestId = requestBody.request?.requestId ?? requestBody.requestId;
  if (!requestId) {
    return;
  }
  await page.goto(new URL(`/requests/${encodeURIComponent(requestId)}`, baseURL).toString());
  await waitSettled(page);
  await shot(page, {
    route: "/requests/:requestId",
    screenId: "request-detail",
    state: "synthetic-populated",
    assertion: await expectText(page, "Cerere"),
  });
  await page.goto(
    new URL(
      `/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=${encodeURIComponent(requestId)}`,
      baseURL,
    ).toString(),
  );
  await waitSettled(page);
  await shot(page, {
    route: "/products/:productCode?request=",
    screenId: "product-config-with-request",
    state: "request-context",
    assertion: "request context on product",
  });
}

async function main() {
  if (process.env.INIT_SCREENSHOT_MANIFEST !== "0") {
    initScreenshotManifest(manifestPath);
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();
  const api = context.request;

  try {
    await captureStaticRoutes(page);
    await captureOperatorDialog(page);
    await confirmAcm(page);
    await createSyntheticRequest(page, api);
    await walkCommercialSpine(page, api);
    await page.goto(new URL("/", baseURL).toString());
    await waitSettled(page);
    await shot(page, {
      route: "/",
      screenId: "jobs-overview",
      state: "after-spine-populated",
      assertion: await expectText(page, "Lucrări"),
      viewports: viewportsFor("jobs-overview"),
    });
    await page.goto(new URL("/quotes", baseURL).toString());
    await waitSettled(page);
    await shot(page, {
      route: "/quotes",
      screenId: "quotes-overview",
      state: "after-spine-populated",
      assertion: await expectText(page, "Oferte"),
    });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
