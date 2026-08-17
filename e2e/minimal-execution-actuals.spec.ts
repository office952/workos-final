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

test("records planned vs completed quantity on LETTERS tasks", async ({ page, request }) => {
  await ensureTestExecutor(request);
  await confirmLetters(page, "ACTUALS");
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await expect(
    page.getByRole("heading", { name: "Acceptat pentru producție" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  const plan = page.locator(".execution-plan");
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();

  const faceCnc = taskCard(page, "Debitare foaie CNC", "Față");
  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  const volumeForm = taskCard(page, "Formare profil aluminiu", "Volum");
  const placeLed = taskCard(page, "Montare module LED", "Iluminare");
  const wire = taskCard(page, "Cablare electrică", "Iluminare");
  const inspect = taskCard(page, "Control calitate final", "Produs");
  const pack = taskCard(page, "Ambalare", "Produs");

  const startedFace = await assignAndStart(faceCnc, "CNC 4020");
  if (startedFace) {
    await expect(faceCnc.getByText("Cantitate planificată: 12,5 m")).toBeVisible();
    await expect(faceCnc.getByLabel("Cantitate realizată")).toHaveValue("12.5");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-actuals-quantity-form.png",
      fullPage: true,
    });
    await faceCnc.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(faceCnc.getByText("Stare: Finalizat")).toBeVisible();
  await expect(faceCnc.getByText("Realizat: 12,5 m")).toBeVisible();
  await expect(faceCnc.getByText("Conform planului")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actuals-as-planned.png",
    fullPage: true,
  });

  const startedBack = await assignAndStart(backCnc, "CNC 4020");
  if (startedBack) {
    await backCnc.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(backCnc.getByText("Realizat: 12,5 m")).toBeVisible();

  const startedLed = await assignAndStart(placeLed, "Montaj LED / electric");
  if (startedLed) {
    await expect(placeLed.getByText("Cantitate planificată: 125 buc")).toBeVisible();
    await expect(placeLed.getByLabel("Cantitate realizată")).toHaveValue("125");
    await placeLed.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(placeLed.getByText("Realizat: 125 buc")).toBeVisible();
  await expect(placeLed.getByText("Conform planului")).toBeVisible();

  const startedVolume = await assignAndStart(volumeForm, "CNC Cant Litere");
  if (startedVolume) {
    await volumeForm.getByLabel("Cantitate realizată").fill("12");
    await volumeForm.getByLabel("Notă").fill("2 module înlocuite în timpul montajului");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-actuals-variance-form.png",
      fullPage: true,
    });
    await volumeForm.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(volumeForm.getByText("Realizat: 12 m")).toBeVisible();
  await expect(volumeForm.getByText("Diferență față de plan: -0,5 m")).toBeVisible();
  await expect(plan.getByText("Abateri: 1")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actuals-with-variance.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-execution-variance.png",
    fullPage: true,
  });

  const startedWire = await assignAndStart(wire, "Montaj LED / electric");
  if (startedWire) {
    await expect(wire.getByLabel("Cantitate realizată")).toHaveCount(0);
    await wire.getByLabel("Notă").fill("Executat conform fișei");
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-actuals-no-quantity.png",
      fullPage: true,
    });
    await wire.getByRole("button", { name: "Finalizează" }).click();
  }
  await expect(wire.getByText("Stare: Finalizat")).toBeVisible();
  await expect(wire.getByText("Notă: Executat conform fișei")).toBeVisible();
  await expect(wire.getByText("Realizat:")).toHaveCount(0);

  await expect(plan.getByText(/\/ 12 finalizate/)).toBeVisible();
  await expect(plan.getByText("Cost intern planificat: 382,50 EUR (complet)")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actuals-progress.png",
    fullPage: true,
  });

  await expect(inspect.getByText("Nu necesită echipament")).toBeVisible();
  await expect(pack.getByText("Nu necesită echipament")).toBeVisible();
  await expect(inspect.getByRole("button", { name: "Alocă", exact: true })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actuals-no-provider.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(placeLed.getByText("Realizat: 125 buc")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-actuals-narrow.png",
    fullPage: true,
  });
});
