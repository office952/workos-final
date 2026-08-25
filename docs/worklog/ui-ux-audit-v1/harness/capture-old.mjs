import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  DESKTOP,
  NARROW,
  TABLET,
  captureShot,
  safeClick,
  setViewport,
  waitSettled,
} from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "old");
const manifestPath = join(here, "..", "screenshot-manifest.csv");
const baseURL = process.env.OLD_APP_URL ?? "http://127.0.0.1:3010";
const runtime = process.env.OLD_RUNTIME_FIXTURE ?? "old-demo-db-copy-isolated";

const RESPONSIVE = new Set([
  "atelier-overview",
  "cereri-list",
  "product-system-catalog",
  "oferte-list",
  "comenzi-list",
  "inventar",
  "clienti-list",
  "setari-shell",
  "shell-sidebar-drawer",
  "emp-mobile-v1-home",
]);

function viewportsFor(screenId) {
  return RESPONSIVE.has(screenId) ? [DESKTOP, TABLET, NARROW] : [DESKTOP];
}

async function shot(page, spec) {
  const viewports = spec.viewports ?? [DESKTOP];
  for (const viewport of viewports) {
    await setViewport(page, viewport);
    await captureShot(page, {
      app: "OLD",
      route: spec.route,
      screenId: spec.screenId,
      state: spec.state,
      role: spec.role ?? "admin-dev-preview",
      runtime,
      viewport,
      outDir,
      manifestPath,
      assertion: spec.assertion,
      routeAssertion: spec.routeAssertion ?? page.url(),
    });
  }
}

async function setRole(page, role) {
  await page.addInitScript((value) => {
    sessionStorage.setItem("workos-dev-role", value);
  }, role);
}

async function goto(page, path) {
  await page.goto(new URL(path, baseURL).toString(), { waitUntil: "domcontentloaded", timeout: 45000 });
  await waitSettled(page);
}

async function clickTab(page, name) {
  return (
    (await safeClick(page.getByRole("tab", { name }))) ||
    (await safeClick(page.getByRole("button", { name }))) ||
    (await safeClick(page.getByRole("link", { name })))
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  await context.addInitScript(() => {
    sessionStorage.setItem("workos-dev-role", "admin");
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(20000);

  const desktopRoutes = [
    { path: "/shop-floor", screenId: "atelier-overview", state: "admin-preview" },
    { path: "/dashboard", screenId: "control-productie", state: "admin-preview" },
    { path: "/intake", screenId: "cereri-list", state: "admin-preview" },
    { path: "/product-system/products", screenId: "product-system-catalog", state: "admin-preview" },
    { path: "/quotes", screenId: "oferte-list", state: "admin-preview" },
    { path: "/orders", screenId: "comenzi-list", state: "admin-preview" },
    { path: "/execution", screenId: "planificare-dashboard", state: "admin-preview" },
    { path: "/execution/machine-runs", screenId: "machine-runs-list", state: "admin-preview" },
    { path: "/execution/ops-graph", screenId: "ops-graph", state: "admin-preview" },
    { path: "/execution/reality-review", screenId: "operational-reality-review", state: "admin-preview" },
    { path: "/operator", screenId: "operator-task-legacy", state: "admin-preview" },
    { path: "/tablet", screenId: "tablet-station-select", state: "admin-preview" },
    { path: "/employees", screenId: "angajati-registry", state: "admin-preview" },
    { path: "/attendance", screenId: "pontaj", state: "admin-preview" },
    { path: "/attendance/effects", screenId: "attendance-effects", state: "admin-preview" },
    { path: "/employees-records", screenId: "evidenta-hr-list", state: "admin-preview" },
    { path: "/employee-payments", screenId: "plati-angajati", state: "admin-preview" },
    { path: "/employee-advances", screenId: "avansuri", state: "admin-preview" },
    { path: "/utilaje", screenId: "utilaje", state: "admin-preview" },
    { path: "/inventory", screenId: "inventar", state: "tab-default" },
    { path: "/inventory?tab=all", screenId: "inventory-tab-all", state: "admin-preview" },
    { path: "/inventory?tab=placi", screenId: "inventory-tab-placi", state: "admin-preview" },
    { path: "/inventory?tab=role", screenId: "inventory-tab-role", state: "admin-preview" },
    { path: "/inventory?tab=cerneala", screenId: "inventory-tab-cerneala", state: "admin-preview" },
    { path: "/inventory?tab=altele", screenId: "inventory-tab-altele", state: "admin-preview" },
    { path: "/inventory?tab=sheet-quality", screenId: "inventory-sheet-quality", state: "admin-preview" },
    { path: "/inventory/pricing", screenId: "preturi", state: "admin-preview" },
    { path: "/clients", screenId: "clienti-list", state: "admin-preview" },
    { path: "/colaboratori", screenId: "colaboratori", state: "admin-preview" },
    { path: "/documents", screenId: "document-center", state: "admin-preview" },
    { path: "/reports", screenId: "rapoarte", state: "admin-preview" },
    { path: "/reports/operational", screenId: "operational-reports", state: "admin-preview" },
    { path: "/modules", screenId: "harta-module", state: "admin-preview" },
    { path: "/governance", screenId: "guvernanta", state: "admin-preview" },
    { path: "/settings", screenId: "setari-shell", state: "admin-preview" },
    { path: "/product-system/blueprint-dossier", screenId: "blueprint-dossier-studio", state: "admin-preview" },
    { path: "/product-system/output-blocks-preview", screenId: "output-blocks-preview", state: "investigate" },
    { path: "/intake-v6/operator", screenId: "intake-v6-bootstrap", state: "admin-preview" },
    { path: "/intake-v6-app", screenId: "intake-v6-standalone", state: "admin-preview" },
    { path: "/employee-app", screenId: "emp-mobile-v1-home", state: "admin-preview" },
    { path: "/employee-app/tasks", screenId: "emp-mobile-v1-tasks", state: "admin-preview" },
    { path: "/employee-app/personal", screenId: "emp-mobile-v1-personal", state: "admin-preview" },
    { path: "/employee-app/requests", screenId: "emp-mobile-v1-requests", state: "admin-preview" },
    { path: "/employee-app/review", screenId: "emp-mobile-v1-review", state: "admin-preview" },
    { path: "/employee-app/team", screenId: "emp-mobile-v1-team", state: "investigate" },
    { path: "/employee-app/attendance", screenId: "emp-mobile-v1-attendance", state: "admin-preview" },
    { path: "/employee-app-v2", screenId: "emp-mobile-v2-home", state: "prototype" },
    { path: "/employee-app-v2/tasks", screenId: "emp-mobile-v2-tasks", state: "prototype" },
    { path: "/employee-app-v2/pipeline", screenId: "emp-mobile-v2-pipeline", state: "investigate" },
    { path: "/employee-app-v2/documents", screenId: "emp-mobile-v2-documents", state: "investigate" },
    { path: "/employee-app-v2/blockers", screenId: "emp-mobile-v2-blockers", state: "investigate" },
    { path: "/employee-app-v2/upcoming", screenId: "emp-mobile-v2-upcoming", state: "investigate" },
    { path: "/employee-app-v2/personal", screenId: "emp-mobile-v2-personal-hub", state: "prototype" },
    { path: "/employee-app-v2/personal/requests", screenId: "emp-mobile-v2-personal-requests", state: "prototype" },
    { path: "/employee-app-v2/personal/attendance", screenId: "emp-mobile-v2-personal-attendance", state: "prototype" },
    { path: "/employee-app-v2/personal/info", screenId: "emp-mobile-v2-personal-info", state: "prototype" },
    { path: "/employee-app-v2/personal/review", screenId: "emp-mobile-v2-personal-review", state: "prototype" },
  ];

  try {
    for (const item of desktopRoutes) {
      const already = join(outDir, `${item.screenId}__${item.state}__desktop__full.png`);
      if (existsSync(already)) {
        continue;
      }
      try {
        await goto(page, item.path);
        if (item.screenId === "product-system-catalog") {
          await page
            .waitForFunction(() => !document.body.innerText.includes("Se încarcă"), { timeout: 15000 })
            .catch(() => undefined);
        }
        await shot(page, {
          route: item.path,
          screenId: item.screenId,
          state: item.state,
          assertion: page.url(),
          viewports: viewportsFor(item.screenId),
        });
      } catch (error) {
        try {
          await shot(page, {
            route: item.path,
            screenId: item.screenId,
            state: "blocked-or-error",
            assertion: String(error).slice(0, 180),
          });
        } catch {
          // Continue the inventory even if the error state cannot be captured.
        }
      }
    }

    await goto(page, "/intake");
    if (await safeClick(page.getByRole("button", { name: /Cerere nouă|Cerere noua|New/i }))) {
      await waitSettled(page);
      await shot(page, {
        route: "/intake",
        screenId: "new-intake-dialog",
        state: "open",
        assertion: "create dialog",
      });
      await page.keyboard.press("Escape");
    }

    await goto(page, "/product-system/products");
    const firstProduct = page.locator("a[href*='/product-system/products/']").nth(1);
    if (await firstProduct.isVisible().catch(() => false)) {
      await firstProduct.click();
      await waitSettled(page);
      await shot(page, {
        route: "/product-system/products/:templateCode",
        screenId: "product-system-editor",
        state: "opened",
        assertion: "template studio",
      });
      for (const tab of ["Structură", "Structura", "Operațional", "Operational", "Formular", "General"]) {
        if (await clickTab(page, tab)) {
          await shot(page, {
            route: page.url(),
            screenId: `ps-studio-tab-${tab.toLowerCase()}`,
            state: "opened",
            assertion: tab,
          });
        }
      }
    }

    await goto(page, "/quotes");
    const quoteLink = page.locator("a[href*='/quotes/']").first();
    if (await quoteLink.isVisible().catch(() => false)) {
      await quoteLink.click();
      await waitSettled(page);
      await shot(page, {
        route: "/quotes/:quoteId",
        screenId: "oferte-detail",
        state: "opened",
        assertion: "quote detail",
      });
    }

    await goto(page, "/orders");
    const orderLink = page.locator("a[href*='/orders/']").first();
    if (await orderLink.isVisible().catch(() => false)) {
      await orderLink.click();
      await waitSettled(page);
      await shot(page, {
        route: "/orders/:orderId",
        screenId: "comenzi-detail",
        state: "opened",
        assertion: "order detail",
      });
    }

    await goto(page, "/clients");
    const clientLink = page.locator("a[href*='/clients/']").first();
    if (await clientLink.isVisible().catch(() => false)) {
      await clientLink.click();
      await waitSettled(page);
      await shot(page, {
        route: "/clients/:clientName",
        screenId: "client-workspace",
        state: "opened",
        assertion: "client hub",
      });
      for (const tab of ["Prezentare", "Overview", "Cereri", "Oferte", "Comenzi", "Timeline"]) {
        if (await clickTab(page, tab)) {
          await shot(page, {
            route: page.url(),
            screenId: `client-tab-${tab.toLowerCase()}`,
            state: "opened",
            assertion: tab,
          });
        }
      }
    }

    await goto(page, "/settings");
    for (const tab of ["Societate", "Plăți Repetitive", "Plati Repetitive", "Cost Intern", "Integrări", "Integrari"]) {
      if (await clickTab(page, tab)) {
        await shot(page, {
          route: "/settings",
          screenId: `settings-tab-${tab.toLowerCase().replaceAll(" ", "-")}`,
          state: "opened",
          assertion: tab,
        });
      }
    }

    await goto(page, "/governance");
    for (const tab of [
      "Ownership",
      "Autoritate",
      "Boundaries",
      "Limite",
      "Truth",
      "Adevăr",
      "Gates",
      "Guardrails",
      "UI",
    ]) {
      if (await clickTab(page, tab)) {
        await shot(page, {
          route: "/governance",
          screenId: `gov-tab-${tab.toLowerCase()}`,
          state: "opened",
          assertion: tab,
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

    const demoWorkspace = process.env.OLD_DEMO_INTAKE_ID ?? "d0e10001-0000-4000-8000-000000000001";
    await goto(page, `/intake-v6/${demoWorkspace}/operator`);
    await shot(page, {
      route: "/intake-v6/:workspaceId/operator",
      screenId: "intake-v6-workspace",
      state: "demo-workspace",
      assertion: "intake v6 workspace",
    });
    for (const step of ["Straturi", "Configurare", "Confirmare", "Finisaje", "Iluminare"]) {
      if (await clickTab(page, step) || await safeClick(page.getByText(step, { exact: true }))) {
        await shot(page, {
          route: "/intake-v6/:workspaceId/operator",
          screenId: `intake-v6-${step.toLowerCase()}`,
          state: "demo-workspace",
          assertion: step,
        });
      }
    }

    await goto(page, "/shop-floor");
    await shot(page, {
      route: "(shell)",
      screenId: "shell-sidebar-drawer",
      state: "admin-nav",
      assertion: "sidebar",
      viewports: viewportsFor("shell-sidebar-drawer"),
    });
    await shot(page, {
      route: "(shell)",
      screenId: "shell-topbar",
      state: "admin-nav",
      assertion: "topbar",
    });

    for (const roleName of ["operator", "sales", "manager", "viewer"]) {
      await context.close();
      const roleContext = await browser.newContext({ viewport: DESKTOP });
      await roleContext.addInitScript((value) => {
        sessionStorage.setItem("workos-dev-role", value);
      }, roleName);
      const rolePage = await roleContext.newPage();
      await goto(rolePage, "/");
      await shot(rolePage, {
        route: "/",
        screenId: "role-home-redirect",
        state: `role-${roleName}`,
        role: roleName,
        assertion: `role ${roleName} landing`,
        routeAssertion: rolePage.url(),
      });
      await roleContext.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
