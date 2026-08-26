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

test("records LED actuals on execution without projecting workshop money", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
  const person = await ensureTestExecutor(request);
  await configureTestExecutorPin(request, person.personId);
  await confirmLetters(page, `AC${Date.now().toString().slice(-4)}`);
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  await identifyTestExecutorOnPage(page);
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();
  await expect(page.getByText(/Cost intern (planificat|real)/)).toHaveCount(0);
  await expect(page.getByText("Editează cost")).toHaveCount(0);
  await expect(page.getByText("ActualCostProjection")).toHaveCount(0);

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
  await expect(page.getByText("Detalii cost real")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actual-cost-summary.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actual-cost-material.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actual-cost-partial.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actual-cost-led-task.png",
    fullPage: true,
  });

  const inventory = await request.get("/api/inventory/MAT-LED-MODULE");
  const inventoryBody = (await inventory.json()) as {
    movements: Array<{ quantityDelta: number; movementType: string }>;
  };
  expect(
    inventoryBody.movements.some(
      (item) => item.quantityDelta === -127 && item.movementType === "OUT",
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText(/Cost intern (planificat|real)/)).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actual-cost-narrow.png",
    fullPage: true,
  });
});
