import { expect, test } from "@playwright/test";

test("letters configuration spine is fail-closed then confirmable", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Produse" }).click();

  await expect(page.getByRole("heading", { name: "Litere volumetrice" })).toBeVisible();
  await expect(page.getByLabel("Textul literelor")).toBeVisible();
  await expect(page.getByLabel("Include iluminare")).not.toBeChecked();
  await expect(page.getByLabel("Tip iluminare")).toHaveCount(0);

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Mai sunt informații de completat.")).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Textul literelor" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Verificare înainte de confirmare" })).toBeVisible();
  await expect(page.getByText("Textul literelor: WORKOS")).toBeVisible();
  await expect(page.getByText("Componente active: Față, Cant, Spate")).toBeVisible();

  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await expect(page.getByText("Litere volumetrice: WORKOS")).toBeVisible();
  await expect(page.getByText("Geometrie din Analyzer")).toBeVisible();
  await expect(page.getByText("Preț", { exact: false })).toBeVisible();
  await expect(page.getByText("EIC")).toHaveCount(0);
  await expect(page.getByText("ProductTruthDTO")).toHaveCount(0);
});
