import { expect, test } from "@playwright/test";

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
  await expect(plan.getByText("Taskuri: 12")).toBeVisible();
  await expect(plan.getByText("Stare: Planificat").first()).toBeVisible();
  await expect(plan.getByText("Alocare: Nealocat").first()).toBeVisible();
  await expect(plan.getByText("Furnizori disponibili: CNC 4020").first()).toBeVisible();
  await expect(
    plan.getByText("Furnizori disponibili: Masă asamblare 1; Masă asamblare 2").first(),
  ).toBeVisible();
  await expect(plan.getByText("Fără furnizor disponibil").first()).toBeVisible();
  await expect(plan.getByText("Montare module LED").first()).toBeVisible();
  await expect(plan.getByText("Resursă: Modul LED 12V: 125 buc").first()).toBeVisible();
  await expect(plan.getByText("Resursă: Sursă LED 12V 160W: 1 buc").first()).toBeVisible();
  await expect(plan.getByText("Cost intern din snapshot: 595,00 EUR (parțial)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Completează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-persisted.png",
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

  const reference = await plan.getByText("Referință: exp:").textContent();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await expect(page.getByRole("heading", { name: "Plan de execuție deja creat" })).toBeVisible();
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
});

test("vinyl snapshot persists the frozen vinyl task", async ({ page }) => {
  await confirmLetters(page, { faceFinish: "vinyl", faceColor: "alb" });
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  const plan = page.locator(".execution-plan");
  await expect(plan.getByText("Taskuri: 13")).toBeVisible();
  await expect(plan.getByText("Aplicare folie").first()).toBeVisible();
  await expect(plan.getByText("Vopsire RAL")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
});
