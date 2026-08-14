import { expect, test } from "@playwright/test";

test("owner surfaces navigate and project system truth", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-system-status.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Produse" }).click();
  await expect(page.getByRole("heading", { name: "Produse" })).toBeVisible();
  await expect(page.getByText("Familie", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Module și componente" }).click();
  await expect(page.getByRole("heading", { name: "Module și componente" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Față" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Volum" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spate" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Iluminare", exact: true })).toBeVisible();
  await expect(page.getByText("Variantă: Plexiglas 3 mm")).toBeVisible();
  await expect(page.getByText("Cost intern: Indisponibil")).toBeVisible();
  await expect(page.getByText("Regula de pas LED nu este stabilită")).toBeVisible();
  await expect(page.getByText("RETURN_CANT")).toHaveCount(0);
  await expect(page.getByText("Cant", { exact: true })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-components.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Guvernanța sistemului" }).click();
  await expect(page.getByRole("heading", { name: "Guvernanța sistemului" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cine deține adevărul" })).toBeVisible();
  await expect(page.getByText("Fără Commercial silent.")).toBeVisible();
  await expect(page.getByText("Nu este activă.")).toBeVisible();
  await expect(page.getByText("Neimplementat").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-governance.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Produse" }).click();
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
  await expect(page.getByLabel("Textul literelor")).toBeVisible();
});
