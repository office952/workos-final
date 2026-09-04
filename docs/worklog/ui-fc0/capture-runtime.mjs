import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = join(dirname(fileURLToPath(import.meta.url)), "evidence");
const origin = process.env.WORKOS_FC0_ORIGIN ?? "http://127.0.0.1:5181";
mkdirSync(root, { recursive: true });

const listRoutes = [
  ["jobs", "/jobs"],
  ["atelier", "/atelier"],
  ["clients", "/clients"],
  ["requests", "/requests"],
  ["quotes", "/quotes"],
  ["products", "/products"],
  ["configurator", "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06"],
  ["components", "/components"],
  ["governance", "/governance"],
  ["admin", "/admin"],
  ["product-system", "/admin/product-system"],
  ["resources", "/admin/resources"],
  ["stock", "/admin/stock"],
  ["processes", "/admin/processes"],
  ["workcenters", "/admin/workcenters"],
  ["people", "/admin/people"],
  ["skills", "/admin/people/skills"],
  ["customers-admin", "/admin/customers"],
  ["seller", "/admin/seller"],
  ["operational-services", "/admin/operational-services"],
  ["system", "/system"],
];

const extraViewports = {
  "product-system": true,
  components: true,
  workcenters: true,
  people: true,
  products: true,
  configurator: true,
  quotes: true,
  jobs: true,
  requests: true,
  resources: true,
  clients: true,
  atelier: true,
};

const darkRoutes = ["product-system", "clients", "atelier", "resources"];

const rows = [];

function record(row) {
  rows.push(row);
}

async function shot(page, name, route, state, viewport, theme) {
  const file = `${name}_${viewport}_${theme}_${state}.png`;
  await page.screenshot({ path: join(root, file), fullPage: true });
  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement;
    return {
      scrollWidth: el?.scrollWidth ?? 0,
      clientWidth: el?.clientWidth ?? 0,
      hOverflow: (el?.scrollWidth ?? 0) - (el?.clientWidth ?? 0) > 2,
    };
  });
  record({
    ROUTE: route,
    STATE: state,
    VIEWPORT: String(viewport),
    THEME: theme,
    FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
    SCREENSHOT: `docs/worklog/ui-fc0/evidence/${file}`,
    RESULT: overflow.hOverflow ? "H_OVERFLOW" : "OPENED",
    H_OVERFLOW: overflow.hOverflow,
  });
}

async function goto(page, path) {
  const response = await page.goto(origin + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  return response;
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.addInitScript(() => localStorage.setItem("workos.theme", "light"));

let opened = 0;
for (const [name, route] of listRoutes) {
  const response = await goto(page, route);
  const status = response?.status() ?? 0;
  if (status >= 400) {
    record({
      ROUTE: route,
      STATE: "error",
      VIEWPORT: "1440",
      THEME: "light",
      FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
      SCREENSHOT: "",
      RESULT: `HTTP_${status}`,
    });
    continue;
  }
  opened += 1;
  await shot(page, name, route, "default", 1440, "light");
  if (extraViewports[name]) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await shot(page, name, route, "default", 1280, "light");
    await page.setViewportSize({ width: 768, height: 1024 });
    await shot(page, name, route, "default", 768, "light");
    await page.setViewportSize({ width: 1440, height: 900 });
  }
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.addInitScript(() => localStorage.setItem("workos.theme", "dark"));
for (const name of darkRoutes) {
  const route = listRoutes.find((row) => row[0] === name)?.[1];
  if (!route) continue;
  await goto(page, route);
  await page.evaluate(() => localStorage.setItem("workos.theme", "dark"));
  await page.reload({ waitUntil: "networkidle" });
  await shot(page, name, route, "default", 1440, "dark");
}

await page.evaluate(() => localStorage.setItem("workos.theme", "light"));
await goto(page, "/clients");
await page.reload({ waitUntil: "networkidle" });
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.screenshot({ path: join(root, "clients_1440_light_keyboard.png"), fullPage: false });
record({
  ROUTE: "/clients",
  STATE: "keyboard",
  VIEWPORT: "1440",
  THEME: "light",
  FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
  SCREENSHOT: "docs/worklog/ui-fc0/evidence/clients_1440_light_keyboard.png",
  RESULT: "KEYBOARD_SMOKE",
});

const firstClient = page.locator('a[href^="/clients/"]').first();
if (await firstClient.count()) {
  await firstClient.click();
  await page.waitForLoadState("networkidle");
  await shot(page, "client-hub", page.url().replace(origin, ""), "selected", 1440, "light");
} else {
  record({
    ROUTE: "/clients/:id",
    STATE: "empty",
    VIEWPORT: "1440",
    THEME: "light",
    FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
    SCREENSHOT: "",
    RESULT: "NO_OBJECT_IN_FIXTURE",
  });
}

await goto(page, "/requests");
const newRequest = page.getByRole("button", { name: "Cerere nouă" });
if (await newRequest.count()) {
  await newRequest.click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(root, "requests_1440_light_drawer.png"), fullPage: true });
  record({
    ROUTE: "/requests",
    STATE: "drawer",
    VIEWPORT: "1440",
    THEME: "light",
    FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
    SCREENSHOT: "docs/worklog/ui-fc0/evidence/requests_1440_light_drawer.png",
    RESULT: "DRAWER_OPENED",
  });
}

const loginMounted = await page.locator(".login-page").count();
record({
  ROUTE: "Login",
  STATE: "not_mounted",
  VIEWPORT: "1440",
  THEME: "light",
  FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
  SCREENSHOT: "",
  RESULT: loginMounted ? "LOGIN_VISIBLE" : "NOT_MOUNTED_SINGLE_PLANE",
});

await browser.close();

const manifest = {
  FIXTURE_CLASSIFICATION: "LOCAL_SYNTHETIC_SINGLE_PLANE",
  REAL_CLOUD: "NO",
  REAL_DATA: "NO",
  ORIGIN: origin,
  FRESH_RUNTIME_ROUTES_OPENED: opened,
  ROWS: rows,
};
writeFileSync(join(root, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ opened, rows: rows.length }, null, 2));
