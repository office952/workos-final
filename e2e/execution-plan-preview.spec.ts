import { expect, test } from "./fixtures";

async function confirmLetters(
  page: import("@playwright/test").Page,
  values: {
    faceFinish: "none" | "vinyl";
    volumeFinish: "none" | "painted";
    faceColor?: string;
    volumeColor?: string;
  },
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
  await page.getByLabel("Finisaj volum").selectOption(values.volumeFinish);
  if (values.volumeColor) {
    await page.getByLabel("Culoare volum").fill(values.volumeColor);
  }
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

test("confirmed LETTERS product shows a read-only production plan preview", async ({
  page,
}) => {
  await confirmLetters(page, { faceFinish: "none", volumeFinish: "none" });
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await expect(page.getByText("Cost intern curent: 382,50 EUR (complet)")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Geometrie confirmată.")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Complet")).toBeVisible();
  await expect(page.getByText("Costuri încă în calibrare")).toHaveCount(0);
  await expect(page.getByText("Geometrie din Analyzer")).toHaveCount(0);
  await expect(page.getByText("Analyzer")).toHaveCount(0);
  await expect(page.getByText("Debitare foaie CNC").first()).toBeVisible();
  await expect(page.getByText("Componentă: Față").first()).toBeVisible();
  await expect(page.getByText("Furnizori disponibili: CNC 4020").first()).toBeVisible();
  await expect(
    page.getByText("Furnizori disponibili: Masă asamblare 1; Masă asamblare 2").first(),
  ).toBeVisible();
  await expect(page.getByText("Montare module LED").first()).toBeVisible();
  await expect(page.getByText("Resursă: Modul LED 12V: 125 buc").first()).toBeVisible();
  await expect(page.getByText("Resursă: Sursă LED 12V 160W: 1 buc").first()).toBeVisible();
  await expect(page.getByText("Nu necesită echipament").first()).toBeVisible();
  await expect(page.getByText("Fără furnizor configurat")).toHaveCount(0);
  await expect(page.getByText("Aplicare folie")).toHaveCount(0);
  await expect(page.getByText("Vopsire RAL")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Completează" })).toHaveCount(0);
  await expect(page.getByText("CUT_SHEET_CNC")).toHaveCount(0);
  await expect(page.getByText("ExecutionTask")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-operations.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-assembly.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-lighting.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-missing-provider.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-narrow.png",
    fullPage: true,
  });
});

test("vinyl face adds only the selected finish operation to the plan", async ({
  page,
}) => {
  await confirmLetters(page, {
    faceFinish: "vinyl",
    volumeFinish: "none",
    faceColor: "alb",
  });
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await expect(page.getByText("Aplicare folie").first()).toBeVisible();
  await expect(page.getByText("Resursă: Folie Oracal 651: 0,25 m²").first()).toBeVisible();
  await expect(page.getByText("Vopsire RAL")).toHaveCount(0);
  await expect(page.getByText("Total cost intern estimat: 386,00 EUR")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-vinyl.png",
    fullPage: true,
  });
});

test("painted volume adds RAL with an honest missing provider", async ({ page }) => {
  await confirmLetters(page, {
    faceFinish: "none",
    volumeFinish: "painted",
    volumeColor: "RAL 9010",
  });
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await expect(page.getByText("Vopsire RAL").first()).toBeVisible();
  await expect(page.getByText("Aplicare folie")).toHaveCount(0);
  await expect(page.getByText("Stare: Fără furnizor").first()).toBeVisible();
  await expect(page.getByText("Total cost intern estimat: 432,50 EUR")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-plan-ral.png",
    fullPage: true,
  });
});
