import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

test("accepts confirmed manual geometry and shows owner-confirmed 60 mm EIC", async ({
  page,
}) => {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("GEO");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Suprafață confirmată (mm²): 250000").first()).toBeVisible();
  await expect(page.getByText("Perimetru confirmat (mm): 12500")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-manual-geometry-review.png",
    fullPage: false,
  });
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.getByText("Suprafață confirmată: 250000 mm² (introdusă de operator)")).toBeVisible();
  await expect(page.getByText("Perimetru confirmat: 12500 mm (introdus de operator)")).toBeVisible();
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Complet")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Geometrie confirmată.")).toBeVisible();
  await expect(page.getByText("Costul intern rămâne parțial")).toHaveCount(0);
  await expect(page.getByText("Geometrie din Analyzer")).toHaveCount(0);
  await expect(page.getByText("Indisponibil acum:")).toHaveCount(0);
  await expect(page.getByText("Module LED: 125 buc", { exact: true })).toBeVisible();
  await page.locator(".eic-section").screenshot({
    path: "docs/worklog/screenshots/letters-manual-geometry-eic.png",
  });
  await page.locator(".eic-section").screenshot({
    path: "docs/worklog/screenshots/letters-cost-calibration-60mm-eic.png",
  });
});

test("keeps 30 mm aluminium profile cost unconfirmed", async ({ page }) => {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("AD30");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("30");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.locator(".eic-section").getByText("Parțial", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Costul intern rămâne parțial: Tarif profil aluminiu neconfirmat pentru adâncimea 30 mm.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Total cost intern estimat: 345,00 EUR")).toBeVisible();
  await page.locator(".eic-section").screenshot({
    path: "docs/worklog/screenshots/letters-cost-calibration-30mm-eic.png",
  });
});

test("blocks missing face area without inventing Analyzer geometry", async ({ page }) => {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("LIPSA");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Probleme de rezolvat: 1")).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Suprafață confirmată (mm²)" })).toBeVisible();
  await expect(page.getByText("Geometrie din Analyzer")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Confirmă configurația" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-manual-geometry-missing.png",
    fullPage: false,
  });
});
