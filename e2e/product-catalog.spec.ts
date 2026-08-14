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
  await expect(page.getByText("Familie", { exact: true })).toBeVisible();
  await expect(page.getByText("Produs", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-products.png",
    fullPage: true,
  });

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
  await expect(page.getByText("Material față: Plexiglas 3 mm")).toBeVisible();
  await expect(page.getByText("Material volum: Aluminiu 0,6 mm")).toBeVisible();
  await expect(page.getByText("Material spate: Forex 10 mm")).toBeVisible();
  await expect(page.getByText("Iluminare: Iluminare frontală")).toBeVisible();
  await expect(page.getByLabel("Include iluminare")).toHaveCount(0);

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Mai sunt informații de completat.")).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "Suprafață confirmată (mm²)" }),
  ).toBeVisible();

  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("vinyl");
  await page.getByLabel("Culoare față").fill("alb");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-configure.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByRole("heading", { name: "Verificare înainte de confirmare" })).toBeVisible();
  await expect(page.getByText("Revizuiți configurația.")).toBeVisible();
  await expect(page.getByText("Suprafață confirmată (mm²): 250000")).toBeVisible();
  await expect(page.getByLabel("Textul literelor")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Modifică configurația" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-review.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await expect(page.getByText("Lungime volum: 12,5 m")).toBeVisible();
  await expect(page.getByText("Suprafață față: 0,25 m²")).toBeVisible();
  await expect(page.getByText("Suprafață spate: 0,25 m²")).toBeVisible();
  await expect(
    page.getByText("Total cost intern estimat (fără iluminare): 320,50 EUR"),
  ).toBeVisible();
  await expect(page.getByText("Costul intern al produsului este parțial")).toBeVisible();
  await expect(page.getByText("Neincluse încă în costul intern pilot: Iluminare")).toBeVisible();
  await expect(page.getByText("RETURN_CANT")).toHaveCount(0);
  await expect(page.getByText("Lungime cant")).toHaveCount(0);
  await expect(page.getByText("Preț client")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-confirm.png",
    fullPage: true,
  });
});
