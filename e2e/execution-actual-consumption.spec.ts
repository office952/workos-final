import { type Locator, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";
import { openExecutionWorkspace } from "./helpers/execution";
import { assignExecutorIfNeeded, assignProviderIfNeeded, ensureTestExecutor } from "./helpers/people";

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

test("records planned vs actual resource consumption on LETTERS tasks", async ({
  page,
  request,
}) => {
  await ensureTestExecutor(request);
  await confirmLetters(page, "CONSUM");
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await expect(page.getByRole("heading", { name: "Acceptat pentru producție" })).toBeVisible();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();

  const faceCnc = taskCard(page, "Debitare foaie CNC", "Față");
  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  const placeLed = taskCard(page, "Montare module LED", "Iluminare");
  const wire = taskCard(page, "Cablare electrică", "Iluminare");
  const inspect = taskCard(page, "Control calitate final", "Produs");

  const startedFace = await assignAndStart(faceCnc, "CNC 4020");
  if (startedFace) {
    await expect(faceCnc.getByText("Cantitate planificată: 12,5 m")).toBeVisible();
    await faceCnc.getByText("Consum real", { exact: true }).click();
    await expect(faceCnc.getByText(/Planificat: Debitare CNC față/)).toBeVisible();
    await expect(faceCnc.getByLabel("Cantitate folosită (Debitare CNC față)")).toHaveValue("");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-consumption-before-entry.png",
      fullPage: true,
    });
    await faceCnc.getByLabel("Cantitate folosită (Debitare CNC față)").fill("12.7");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-consumption-entered.png",
      fullPage: true,
    });
    await faceCnc.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(faceCnc.getByText("Stare: Finalizat")).toBeVisible();
  await expect(faceCnc.getByText("Debitare CNC față: 12,7 m")).toBeVisible();
  await expect(faceCnc.getByText("Cantitate planificată: 12,5 m")).toBeVisible();
  await expect(faceCnc.getByLabel("Cantitate folosită (Debitare CNC față)")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-consumption-completed.png",
    fullPage: true,
  });

  const startedBack = await assignAndStart(backCnc, "CNC 4020");
  if (startedBack) {
    await backCnc.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(backCnc.getByText("Stare: Finalizat")).toBeVisible();

  const startedLed = await assignAndStart(placeLed, "Montaj LED / electric");
  if (startedLed) {
    await placeLed.getByText("Consum real", { exact: true }).click();
    await placeLed.getByLabel("Cantitate folosită (Modul LED 12V)").fill("127");
    await placeLed.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(placeLed.getByText("Modul LED 12V: 127 buc")).toBeVisible();
  await expect(placeLed.getByText("Cantitate planificată: 125 buc")).toBeVisible();

  const startedWire = await assignAndStart(wire, "Montaj LED / electric");
  if (startedWire) {
    await expect(wire.getByLabel("Cantitate realizată")).toHaveCount(0);
    await wire.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(wire.getByText("Stare: Finalizat")).toBeVisible();
  await expect(wire.getByText("Fără consum înregistrat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-consumption-no-material.png",
    fullPage: true,
  });

  await expect(inspect.getByText("Nu necesită utilaj dedicat")).toBeVisible();
  await expect(inspect.getByText("Consum real")).toHaveCount(0);
  await expect(page.getByText("Cost intern planificat: 382,50 EUR (complet)")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(faceCnc.getByText("Debitare CNC față: 12,7 m")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-consumption-narrow.png",
    fullPage: true,
  });
});
