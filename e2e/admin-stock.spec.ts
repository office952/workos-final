import { type Locator, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";
import { openExecutionWorkspace } from "./helpers/execution";
import {
  assignExecutorIfNeeded,
  assignProviderIfNeeded,
  configureTestExecutorPin,
  ensureTestExecutor,
  identifyTestExecutorOnPage,
} from "./helpers/people";

async function confirmLetters(page: Page, inscription: string) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill(inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
}

function taskCard(page: Page, processLabel: string, scopeLabel: string) {
  return page.locator(".execution-plan .production-op").filter({
    has: page.getByRole("heading", { name: new RegExp(`\\d+\\. ${processLabel}`) }),
  }).filter({
    hasText: `Componentă: ${scopeLabel}`,
  });
}

async function assignAndStart(card: Locator, providerLabel: string) {
  if (await card.getByText("Stare: Finalizat").isVisible()) {
    return false;
  }
  await assignProviderIfNeeded(card, providerLabel);
  await assignExecutorIfNeeded(card);
  if (await card.getByText("Stare: În lucru").isVisible()) {
    return true;
  }
  const start = card.getByRole("button", { name: "Pornește" });
  await expect(start).toBeVisible();
  await start.click();
  await expect(card.getByText("Stare: În lucru")).toBeVisible();
  return true;
}

function formatBalance(value: number): string {
  return value.toLocaleString("ro-RO", { maximumFractionDigits: 2 });
}

test("shows stock identity, empty history, adjustment and execution OUT", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
  const person = await ensureTestExecutor(request);
  await configureTestExecutorPin(request, person.personId);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resurse și cost intern" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Stoc" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Procese operaționale" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Utilaje și zone" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-admin-nav.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Resurse și cost intern" }).click();
  await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
  await page.goto("/admin");
  await page.getByRole("link", { name: "Procese operaționale" }).click();
  await expect(page.getByRole("heading", { name: "Procese operaționale" })).toBeVisible();
  await page.goto("/admin");
  await page.getByRole("link", { name: "Utilaje și zone" }).click();
  await expect(page.getByRole("heading", { name: "Utilaje și zone" })).toBeVisible();
  await page.goto("/admin");
  await page.getByRole("link", { name: "Stoc" }).click();
  await expect(page.getByRole("heading", { name: "Stoc" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Materiale în stoc" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Modul LED 12V" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Plexiglas 3 mm opal" })).toBeVisible();
  await expect(page.getByText("Inventory Engine")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-overview.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Plexiglas 3 mm opal" }).click();
  await expect(page.getByRole("heading", { name: "Plexiglas 3 mm opal" })).toBeVisible();
  const plexi = await request.get("/api/inventory/plexiglas_3mm_opal");
  const plexiBody = (await plexi.json()) as { movements: unknown[] };
  if (plexiBody.movements.length === 0) {
    await expect(
      page.getByText("Nu există mișcări de stoc pentru acest material."),
    ).toBeVisible();
    await expect(page.getByText("Fără mișcări")).toBeVisible();
  }
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-empty-history.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Înapoi la stoc" }).click();
  await page.getByRole("link", { name: "Forex 10 mm" }).click();
  await expect(page.getByRole("heading", { name: "Forex 10 mm" })).toBeVisible();
  const initialButton = page.getByRole("button", { name: "Înregistrează stoc inițial" });
  const adjustButton = page.getByRole("button", { name: "Ajustare stoc" });
  await expect(initialButton.or(adjustButton)).toBeVisible();
  if (await initialButton.isVisible()) {
    await page.getByLabel(/Înregistrează stoc inițial/).fill("2");
    await initialButton.click();
  } else {
    await page.getByLabel(/Ajustare stoc/).fill("2");
    await adjustButton.click();
  }
  await expect(page.getByText("Ajustare stoc +2 m²").first()).toBeVisible();
  await expect(page.getByText("În stoc")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-material-detail.png",
    fullPage: true,
  });

  const ledBefore = await request.get("/api/inventory/MAT-LED-MODULE");
  const ledBeforeBody = (await ledBefore.json()) as { item: { balance: number } };

  await confirmLetters(page, `ST${Date.now().toString().slice(-4)}`);
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  await identifyTestExecutorOnPage(page);
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();

  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  const placeLed = taskCard(page, "Montare module LED", "Iluminare");
  const startedBack = await assignAndStart(backCnc, "CNC 4020");
  if (startedBack) {
    await backCnc.getByRole("button", { name: "Finalizează" }).click();
  }
  const startedLed = await assignAndStart(placeLed, "Montaj LED / electric");
  if (startedLed) {
    await placeLed.getByText("Consum real", { exact: true }).click();
    await placeLed.getByLabel("Cantitate folosită (Modul LED 12V)").fill("127");
    await placeLed.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(placeLed.getByText("Modul LED 12V: 127 buc")).toBeVisible();
  await expect(page.getByText(/Cost intern (planificat|real)/)).toHaveCount(0);
  const expectedLedBalance = startedLed
    ? ledBeforeBody.item.balance - 127
    : ledBeforeBody.item.balance;

  await page.goto("/admin/stock/MAT-LED-MODULE");
  await expect(page.getByRole("heading", { name: "Modul LED 12V" })).toBeVisible();
  await expect(
    page.getByText(`Sold curent: ${formatBalance(expectedLedBalance)} buc`),
  ).toBeVisible();
  await expect(page.getByText("Sold negativ")).toBeVisible();
  await expect(page.getByText("Consum producție −127 buc").first()).toBeVisible();
  await expect(page.getByText("Task: Montare module LED — Iluminare").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-led-out.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-negative-balance.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText("Consum producție −127 buc").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/stock-narrow.png",
    fullPage: true,
  });
});
