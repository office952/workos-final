import { expect, test } from "@playwright/test";

test("letters configuration spine is fail-closed then confirmable", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Produse" }).click();

  await expect(page.getByRole("heading", { name: "Litere volumetrice" })).toBeVisible();
  await expect(page.getByLabel("Textul literelor")).toBeVisible();
  await expect(page.getByLabel("Perimetru confirmat (mm)")).toBeVisible();
  await expect(page.getByLabel("Include iluminare")).not.toBeChecked();
  await expect(page.getByLabel("Tip iluminare")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Prețuri" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pricing" })).toHaveCount(0);

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Mai sunt informații de completat.")).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Textul literelor" })).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "Perimetru confirmat (mm)" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirmă configurația" })).toHaveCount(0);

  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Material față").selectOption("plexiglas");
  await page.getByLabel("Finisaj față").selectOption("vinyl");
  await expect(page.getByLabel("Culoare față")).toBeVisible();
  await page.getByLabel("Culoare față").fill("alb");
  await page.getByLabel("Material cant").selectOption("aluminum");
  await page.getByLabel("Adâncime cant (mm)").fill("60");
  await page.getByLabel("Finisaj cant").selectOption("none");
  await page.getByLabel("Material spate").selectOption("forex");

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Mai sunt informații de completat.")).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "Perimetru confirmat (mm)" }),
  ).toBeVisible();

  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByRole("heading", { name: "Verificare înainte de confirmare" })).toBeVisible();
  await expect(page.getByText("Textul literelor: WORKOS")).toBeVisible();
  await expect(page.getByText("Perimetru confirmat (mm): 12500")).toBeVisible();
  await expect(page.getByText("Componente active: Față, Cant, Spate")).toBeVisible();
  await expect(
    page.getByText("Măsurătorile de mai sus sunt introduse de operator"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await expect(page.getByText("Litere volumetrice: WORKOS")).toBeVisible();
  await expect(page.getByText("Perimetru confirmat: 12500 mm (introdus de operator)")).toBeVisible();
  await expect(page.getByText("Lungime cant: 12,5 m")).toBeVisible();
  await expect(page.getByText("Profil aluminiu cant: 12,5 m").first()).toBeVisible();
  await expect(page.getByText("Formare cant: 12,5 m").first()).toBeVisible();
  await expect(page.getByText("Cost intern estimat", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Costul intern al produsului este parțial")).toBeVisible();
  await expect(page.getByText("Total cost intern estimat (doar cant): 312,50 EUR")).toBeVisible();
  await expect(
    page.getByText("Neincluse încă în costul intern pilot: Față, Spate, Iluminare"),
  ).toBeVisible();
  await expect(page.getByText("Geometrie din Analyzer")).toBeVisible();
  await expect(page.getByText("Preț client")).toHaveCount(0);
  await expect(page.getByText("EIC")).toHaveCount(0);
  await expect(page.getByText("ProductTruth")).toHaveCount(0);
  await expect(page.getByText("PARTIAL")).toHaveCount(0);
});
