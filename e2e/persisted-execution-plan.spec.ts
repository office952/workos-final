import { expect, test } from "./fixtures";

async function confirmLetters(
  page: import("@playwright/test").Page,
  values: { faceFinish: "none" | "vinyl"; faceColor?: string },
) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption(values.faceFinish);
  if (values.faceColor) {
    await page.getByLabel("Culoare față").fill(values.faceColor);
  }
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

test("accepted snapshot materializes a persisted planned execution plan", async ({
  page,
}) => {
  await confirmLetters(page, { faceFinish: "none" });
  await expect(page.getByRole("heading", { name: "Plan de producție" })).toBeVisible();
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  const snapshot = page.locator(".production-snapshot");
  await expect(
    page.getByRole("heading", { name: /Snapshot (producție creat|deja acceptat)/ }),
  ).toBeVisible();
  await expect(snapshot.getByText("Operații: 12")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-before-plan.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  const plan = page.locator(".execution-plan");
  await expect(
    page.getByRole("heading", { name: /Plan de execuție( deja creat)?/ }),
  ).toBeVisible();
  await expect(plan.getByText(/\/ 12 finalizate/)).toBeVisible();
  await expect(plan.getByText(/Stare: (Planificat|În lucru)/).first()).toBeVisible();
  await expect(plan.getByText("Fără furnizor disponibil").first()).toBeVisible();
  await expect(plan.getByText("Montare module LED").first()).toBeVisible();
  await expect(plan.getByText("Cost intern din snapshot: 595,00 EUR (parțial)")).toBeVisible();
  await expect(plan.getByText(/Fără furnizor: 3/)).toBeVisible();
  await expect(plan.getByRole("tab", { name: "Toate" })).toBeVisible();
  await expect(plan.getByText("QUALITY_CONTROL")).toHaveCount(0);
  await expect(plan.getByText("CUT_SHEET_CNC")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Completează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-persisted.png",
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

  await plan.locator("details.execution-plan-meta-wrap").evaluate((el) => {
    (el as HTMLDetailsElement).open = true;
  });
  const reference = await plan.getByText("Referință: exp:").textContent();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await expect(page.getByRole("heading", { name: "Plan de execuție deja creat" })).toBeVisible();
  await page.locator(".execution-plan details.execution-plan-meta-wrap").evaluate((el) => {
    (el as HTMLDetailsElement).open = true;
  });
  await expect(page.getByText(reference ?? "Referință: exp:")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-idempotent.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Plan de execuție deja creat" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-persisted-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-execution-narrow.png",
    fullPage: true,
  });
});

test("vinyl snapshot persists the frozen vinyl task", async ({ page }) => {
  await confirmLetters(page, { faceFinish: "vinyl", faceColor: "alb" });
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  const plan = page.locator(".execution-plan");
  await expect(plan.getByText(/\/ 13 finalizate/)).toBeVisible();
  await expect(plan.getByText("Aplicare folie").first()).toBeVisible();
  await expect(plan.getByRole("combobox", { name: "Echipament / zonă" }).first()).toBeVisible();
  await expect(plan.getByText("Vopsire RAL")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
});
