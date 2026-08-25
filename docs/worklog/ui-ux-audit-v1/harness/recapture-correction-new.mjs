import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  DESKTOP,
  NARROW,
  captureShot,
  initScreenshotManifest,
  requireUrlMatch,
  requireVisibleText,
  setViewport,
  waitSettled,
} from "./capture-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const outDir = join(repo, "docs", "worklog", "screenshots", "ui-ux-audit-v1", "new");
const manifestPath = join(repo, ".tmp", "ui-ux-audit-v1", "correction-new-shots.csv");
const baseURL = process.env.NEW_APP_URL ?? "http://127.0.0.1:5173";
const api = process.env.NEW_API_URL ?? "http://127.0.0.1:8787";
const pin = process.env.WORKOS_AUDIT_SYNTHETIC_PIN;
const runtime = "single-plane-dev-isolated-synthetic";
const role = "operator-dev";

if (!pin || pin.length < 4) {
  throw new Error("WORKOS_AUDIT_SYNTHETIC_PIN must be set in the environment");
}

async function shot(page, spec) {
  await captureShot(page, {
    app: "NEW",
    route: spec.route,
    screenId: spec.screenId,
    state: spec.state,
    role,
    runtime,
    viewport: spec.viewport ?? DESKTOP,
    outDir,
    manifestPath,
    assertion: spec.assertion,
    routeAssertion: spec.route,
  });
}

async function main() {
  initScreenshotManifest(manifestPath);
  const jobs = await (await fetch(`${api}/api/jobs`)).json();
  const href = jobs.overview?.jobs?.[0]?.href ?? "/execution";
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();

  await page.goto(`${baseURL}/admin/seller`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await requireVisibleText(page, "Date firmă");
  await requireVisibleText(page, "Audit Synthetic SRL");
  await requireUrlMatch(page, "/admin/seller");
  const sellerText = await page.locator("body").innerText();
  if (/per:legacy|RO\d{2}[A-Z]{4}\d{10,}/i.test(sellerText)) {
    throw new Error("ASSERTION_FAILED seller page still shows a legal or bank identifier");
  }
  await shot(page, {
    route: "/admin/seller",
    screenId: "admin-seller",
    state: "synthetic-legal-name-only",
    assertion: "Date firmă + Audit Synthetic SRL",
  });

  await page.goto(`${baseURL}/admin/people`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await requireVisibleText(page, "Oameni");
  await requireVisibleText(page, "Operator Eligible");
  const peopleText = await page.locator("body").innerText();
  if (/per:legacy|@[a-z0-9.-]+\.[a-z]{2,}/i.test(peopleText)) {
    throw new Error("ASSERTION_FAILED people list still shows a person identifier or email");
  }
  for (const viewport of [DESKTOP, NARROW]) {
    await setViewport(page, viewport);
    await shot(page, {
      route: "/admin/people",
      screenId: "admin-people-list",
      state: "synthetic-populated",
      assertion: "Oameni + Operator Eligible",
      viewport,
    });
  }
  await setViewport(page, DESKTOP);

  await page.getByRole("link", { name: "Operator Eligible" }).first().click();
  await waitSettled(page);
  await requireVisibleText(page, "Identitate");
  await requireVisibleText(page, "Operator Eligible");
  await requireUrlMatch(page, "/admin/people/");
  await shot(page, {
    route: "/admin/people/:personId",
    screenId: "admin-person-detail",
    state: "synthetic-populated",
    assertion: "Identitate + Operator Eligible",
  });

  await page.goto(`${baseURL}/admin/people/skills`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await requireVisibleText(page, "Skill-uri");
  await requireUrlMatch(page, "/admin/people/skills");
  const skillsText = await page.locator("body").innerText();
  if (/per:legacy|Competențe/i.test(skillsText)) {
    throw new Error("ASSERTION_FAILED skills page leaked a person identifier or used the wrong heading");
  }
  await shot(page, {
    route: "/admin/people/skills",
    screenId: "admin-skills",
    state: "synthetic-populated",
    assertion: "Skill-uri",
  });

  await page.goto(`${baseURL}/admin/resources`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await requireVisibleText(page, "Resurse");
  const cats = page.getByRole("navigation", { name: "Categorii catalog" }).getByRole("button");
  const catCount = Math.min(await cats.count(), 8);
  for (let index = 0; index < catCount; index += 1) {
    const item = cats.nth(index);
    if (await item.isVisible().catch(() => false)) {
      await item.click();
      await page.waitForTimeout(150);
    }
  }
  await setViewport(page, NARROW);
  await waitSettled(page);
  await requireVisibleText(page, "Resurse");
  await shot(page, {
    route: "/admin/resources",
    screenId: "admin-resources-catalog-categories",
    state: "category-walk-narrow",
    assertion: "Resurse + category rail",
    viewport: NARROW,
  });
  await setViewport(page, DESKTOP);

  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await page.getByRole("button", { name: "Identifică-te" }).click();
  await requireVisibleText(page, "Identifică operatorul");
  await shot(page, {
    route: "/",
    screenId: "operator-identify-dialog",
    state: "open-empty-pin",
    assertion: "Identifică operatorul",
  });

  await page.locator('input[type="password"]').fill("0000");
  await page.getByRole("button", { name: "Confirmă" }).click();
  const pinError = page.locator(".status-bad");
  await pinError.waitFor({ state: "visible", timeout: 8000 }).catch(() => undefined);
  const pinErrorText = ((await pinError.textContent().catch(() => "")) ?? "").trim();
  if (!/PIN|greșit|gresit|reusit|reușit/i.test(pinErrorText)) {
    throw new Error(`ASSERTION_FAILED invalid PIN dialog missing error, got ${JSON.stringify(pinErrorText)}`);
  }
  await shot(page, {
    route: "/",
    screenId: "operator-identify-dialog",
    state: "invalid-pin",
    assertion: "invalid PIN error visible",
  });

  await page.locator('input[type="password"]').fill(pin);
  await page.getByRole("button", { name: "Confirmă" }).click();
  await page.waitForTimeout(400);
  await requireVisibleText(page, "Operator Eligible");
  await page.keyboard.press("Escape").catch(() => undefined);
  await shot(page, {
    route: "/",
    screenId: "operator-session",
    state: "eligible-identified",
    assertion: "Operator Eligible",
  });

  await page.goto(new URL(href, baseURL).toString(), { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await requireUrlMatch(page, "/execution/");
  const execText = await page.locator("body").innerText();
  if (!/Alocă mai întâi utilajul|Utilaj dedicat|Debitare foaie CNC|Pornește/i.test(execText)) {
    throw new Error("ASSERTION_FAILED execution workspace missing machine or task language");
  }
  await shot(page, {
    route: "/execution/:planId",
    screenId: "execution-workspace",
    state: "machine-blocked-or-planned",
    assertion: "execution task language visible",
  });

  await page.goto(`${baseURL}/atelier`, { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await requireVisibleText(page, "Munca mea");
  await requireVisibleText(page, "Operator Eligible");
  await shot(page, {
    route: "/atelier",
    screenId: "atelier-inbox",
    state: "session-populated-or-ready",
    assertion: "Munca mea + Operator Eligible",
  });

  await page.getByRole("button", { name: "Schimbă" }).click();
  await page.getByLabel("Persoană").selectOption({ label: "Operator Ineligible" });
  await page.locator('input[type="password"]').fill(pin);
  await page.getByRole("button", { name: "Confirmă" }).click();
  await page.waitForTimeout(400);
  await requireVisibleText(page, "Operator Ineligible");
  await page.goto(new URL(href, baseURL).toString(), { waitUntil: "domcontentloaded" });
  await waitSettled(page);
  await shot(page, {
    route: "/execution/:planId",
    screenId: "execution-workspace",
    state: "ineligible-operator",
    assertion: "Operator Ineligible",
  });

  await browser.close();
  console.log("NEW_RECAPTURE_OK");
}

await main();
