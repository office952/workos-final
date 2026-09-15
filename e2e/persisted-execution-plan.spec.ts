import { expect, test } from "./fixtures";
import { openExecutionWorkspace } from "./helpers/execution";
import {
  confirmLettersV2NoneStock,
  fillLettersV2NoneStock,
  selectLettersFaceOracal651,
} from "./helpers/lettersV2";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

async function confirmLetters(
  page: import("@playwright/test").Page,
  values: { face: "none" | "oracal651" },
) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  if (values.face === "none") {
    await confirmLettersV2NoneStock(page);
  } else {
    await fillLettersV2NoneStock(page);
    await selectLettersFaceOracal651(page);
    await page.getByRole("button", { name: "Verifică configurația" }).click();
    await page.getByRole("button", { name: "Confirmă configurația" }).click();
    await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  }
  await revealSecondaryProductSurfaces(page);
}

test("accepted snapshot materializes a persisted planned execution plan", async ({
  page,
}) => {
  await confirmLetters(page, { face: "none" });
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  const snapshot = page.locator(".production-snapshot");
  await expect(
    page.getByRole("heading", { name: "Acceptat pentru producție" }),
  ).toBeVisible();
  await expect(snapshot.getByText("Operații: 12")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-before-plan.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await expect(page.getByRole("link", { name: "Deschide execuția" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-open-workspace.png",
    fullPage: true,
  });
  await openExecutionWorkspace(page);
  const plan = page.locator(".execution-plan");
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();
  await expect(plan.getByText(/\/ 12 finalizate/)).toBeVisible();
  await expect(plan.getByText(/Stare: (Planificat|În lucru)/).first()).toBeVisible();
  await expect(plan.getByText("Nu necesită utilaj dedicat").first()).toBeVisible();
  await expect(plan.getByRole("heading", { name: /Montare module LED/ })).toBeVisible();
  await expect(plan.getByText(/Cost intern (planificat|real)/)).toHaveCount(0);
  await expect(plan.getByText(/Fără furnizor: 0/)).toBeVisible();
  await expect(plan.getByRole("heading", { name: "Necesită configurare atelier" })).toHaveCount(0);
  await expect(plan.getByText("QUALITY_CONTROL")).toHaveCount(0);
  await expect(plan.getByText("CUT_SHEET_CNC")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Completează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-persisted.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-execution-handoff.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-execution-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-execution-no-provider.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-tasks.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-task-dependencies.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-task-assembly.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-task-missing-provider.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-task-lighting.png",
    fullPage: true,
  });

  await plan.locator("details.execution-plan-meta-wrap", { hasText: "Detalii plan" }).evaluate((el) => {
    (el as HTMLDetailsElement).open = true;
  });
  const provenance = plan.locator(".execution-plan-meta").getByText("Proveniență:");
  await expect(provenance).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează planul de execuție" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ })).toBeVisible();
  await expect(provenance).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-idempotent.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-persisted-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-execution-narrow.png",
    fullPage: true,
  });
});

test("Oracal snapshot persists the frozen vinyl task", async ({ page }) => {
  await confirmLetters(page, { face: "oracal651" });
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await openExecutionWorkspace(page);
  const plan = page.locator(".execution-plan");
  await expect(plan.getByText(/\/ 13 finalizate/)).toBeVisible();
  await expect(plan.getByRole("heading", { name: /Aplicare folie/ })).toBeVisible();
  await expect(plan.getByRole("combobox", { name: "Utilaj dedicat" }).first()).toBeVisible();
  await expect(plan.getByText("Vopsire RAL")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
});
