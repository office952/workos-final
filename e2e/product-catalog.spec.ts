import { expect, test } from "@playwright/test";

test("catalog leads to canonical product confirm and partial EIC", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Produse" }).click();

  await expect(page.getByRole("heading", { name: "Produse" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Litere și semne volumetrice luminoase" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Litere volumetrice luminoase cu iluminare față",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Nu există încă produse în această categorie.").first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Prețuri" })).toHaveCount(0);

  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
  await expect(page.getByText("Material față: Plexiglas")).toBeVisible();
  await expect(page.getByText("Material volum: Aluminiu 0,6 mm")).toBeVisible();
  await expect(page.getByText("Iluminare: Iluminare frontală")).toBeVisible();
  await expect(page.getByLabel("Include iluminare")).toHaveCount(0);
  await expect(page.getByLabel("Material față")).toHaveCount(0);
  await expect(page.getByLabel("Material cant")).toHaveCount(0);

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Mai sunt informații de completat.")).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Textul literelor" })).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "Perimetru confirmat (mm)" }),
  ).toBeVisible();

  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("vinyl");
  await expect(page.getByLabel("Culoare față")).toBeVisible();
  await page.getByLabel("Culoare față").fill("alb");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj cant").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByRole("heading", { name: "Verificare înainte de confirmare" })).toBeVisible();
  await expect(page.getByText("Textul literelor: WORKOS")).toBeVisible();
  await expect(page.getByText("Adâncime volum (mm): 60 mm")).toBeVisible();
  await expect(page.getByText("Perimetru confirmat (mm): 12500")).toBeVisible();

  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await expect(page.getByText("Lungime cant: 12,5 m")).toBeVisible();
  await expect(page.getByText("Total cost intern estimat (doar cant): 312,50 EUR")).toBeVisible();
  await expect(page.getByText("Costul intern al produsului este parțial")).toBeVisible();
  await expect(page.getByText("Preț client")).toHaveCount(0);
  await expect(page.getByText("Include iluminare")).toHaveCount(0);
  await expect(page.getByText("ProductTruth")).toHaveCount(0);
});
