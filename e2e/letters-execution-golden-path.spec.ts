import { type Locator, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { assignExecutorIfNeeded, assignProviderIfNeeded, ensureTestExecutor } from "./helpers/people";

async function confirmLetters(page: Page) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

function taskCard(page: Page, processLabel: string, scopeLabel: string) {
  return page.locator(".execution-plan .production-op").filter({
    has: page.getByRole("heading", { name: new RegExp(`\\d+\\. ${processLabel}`) }),
  }).filter({
    hasText: `Componentă: ${scopeLabel}`,
  });
}

async function executeTask(card: Locator, providerLabel?: string) {
  if (await card.getByText("Stare: Finalizat").isVisible()) {
    return;
  }
  await assignProviderIfNeeded(card, providerLabel);
  await assignExecutorIfNeeded(card);
  if (await card.getByText("Stare: Finalizat").isVisible()) {
    return;
  }
  if (!(await card.getByText("Stare: În lucru").isVisible())) {
    const start = card.getByRole("button", { name: "Pornește" });
    await expect(start).toBeVisible();
    await start.click();
    await expect(card.getByText("Stare: În lucru")).toBeVisible();
  }
  await card.getByRole("button", { name: "Finalizează" }).click();
  await expect(card.getByText("Stare: Finalizat")).toBeVisible();
}

async function startIfReady(card: Locator, providerLabel?: string) {
  if (await card.getByText("Stare: Finalizat").isVisible()) {
    return false;
  }
  if (await card.getByText("Stare: În lucru").isVisible()) {
    return true;
  }
  await assignProviderIfNeeded(card, providerLabel);
  await assignExecutorIfNeeded(card);
  const start = card.getByRole("button", { name: "Pornește" });
  if (!(await start.isVisible())) {
    return false;
  }
  await start.click();
  await expect(card.getByText("Stare: În lucru")).toBeVisible();
  return true;
}

test("executes the reachable LETTERS DAG and keeps no-provider tasks planned", async ({
  page,
  request,
}) => {
  await ensureTestExecutor(request);
  await confirmLetters(page);
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await expect(
    page.getByRole("heading", { name: "Acceptat pentru producție" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  const plan = page.locator(".execution-plan");
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();
  await expect(plan.getByText(/\/ 12 finalizate/)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-plan-summary.png",
    fullPage: true,
  });

  const faceCnc = taskCard(page, "Debitare foaie CNC", "Față");
  const backCnc = taskCard(page, "Debitare foaie CNC", "Spate");
  const volumeForm = taskCard(page, "Formare profil aluminiu", "Volum");
  const bond = taskCard(page, "Lipire față-volum", "Corp");
  const placeLed = taskCard(page, "Montare module LED", "Iluminare");
  const wire = taskCard(page, "Cablare electrică", "Iluminare");
  const psu = taskCard(page, "Pregătire sursă de alimentare", "Iluminare");
  const ignition = taskCard(page, "Probă aprindere", "Iluminare");
  const close = taskCard(page, "Închidere corp", "Corp");
  const uniformity = taskCard(page, "Probă uniformitate", "Iluminare");
  const inspect = taskCard(page, "Control calitate final", "Produs");
  const pack = taskCard(page, "Ambalare", "Produs");

  const startedFace = await startIfReady(faceCnc, "CNC 4020");
  const startedBack = await startIfReady(backCnc, "CNC 4020");
  if (startedFace && startedBack) {
    await expect(faceCnc.getByText("Stare: În lucru")).toBeVisible();
    await expect(backCnc.getByText("Stare: În lucru")).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-golden-parallel-in-progress.png",
      fullPage: true,
    });
  } else {
    const startedVolume = await startIfReady(volumeForm, "CNC Cant Litere");
    if ((startedFace || startedBack) && startedVolume) {
      await page.screenshot({
        path: "docs/worklog/screenshots/letters-golden-parallel-in-progress.png",
        fullPage: true,
      });
    }
  }

  await executeTask(faceCnc, "CNC 4020");
  await executeTask(backCnc, "CNC 4020");
  await executeTask(volumeForm, "CNC Cant Litere");
  await expect(plan.getByText(/[1-9] \/ 12 finalizate/)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-mid-plan.png",
    fullPage: true,
  });

  await expect(placeLed.getByText("Așteaptă:")).toHaveCount(0);
  await executeTask(placeLed, "Montaj LED / electric");
  await executeTask(wire, "Montaj LED / electric");
  await executeTask(psu, "Montaj LED / electric");
  await executeTask(ignition, "Montaj LED / electric");
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-lighting.png",
    fullPage: true,
  });

  await executeTask(bond, "Masă asamblare 1");
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-assembly.png",
    fullPage: true,
  });
  await executeTask(close, "Masă asamblare 1");
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-dependency-released.png",
    fullPage: true,
  });

  await expect(plan.getByText("9 / 12 finalizate")).toBeVisible();
  await expect(plan.getByText("În lucru: 0")).toBeVisible();
  await expect(plan.getByText("Fără furnizor: 3")).toBeVisible();
  await expect(plan.getByText("Stare: În lucru").first()).toBeVisible();
  await expect(plan.getByText("Cost intern planificat: 595,00 EUR (parțial)")).toBeVisible();

  for (const card of [uniformity, inspect, pack]) {
    await expect(card.getByText("Stare: Planificat")).toBeVisible();
    await expect(card.getByText("Fără furnizor disponibil")).toBeVisible();
    await expect(card.getByRole("button", { name: "Alocă", exact: true })).toHaveCount(0);
    await expect(card.getByRole("button", { name: "Pornește" })).toHaveCount(0);
  }
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-final-reachable.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-no-provider.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(plan.getByText("9 / 12 finalizate")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-golden-narrow.png",
    fullPage: true,
  });
});
