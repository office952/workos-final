import { expect, test } from "./fixtures";

async function confirmCanonicalLetters(page: import("@playwright/test").Page) {
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

test("confirmed LETTERS product can freeze an accepted production snapshot", async ({
  page,
}) => {
  await confirmCanonicalLetters(page);
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  const snapshot = page.locator(".production-snapshot");
  await expect(
    page.getByRole("heading", { name: "Acceptat pentru producție" }),
  ).toBeVisible();
  await expect(snapshot.getByText("Stare: Acceptat / înghețat")).toBeVisible();
  await expect(snapshot.getByText("Operații: 12")).toBeVisible();
  await expect(snapshot.getByText("Cost intern curent: 382,50 EUR (complet)")).toBeVisible();
  await expect(page.getByText("Aliniată la acceptarea de atelier, nu la planul persistat.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByText("ExecutionTask")).toHaveCount(0);
  await expect(page.getByText("Comandă client")).toHaveCount(0);
  await snapshot.locator("details.snapshot-details").evaluate((el) => {
    (el as HTMLDetailsElement).open = true;
  });
  const reference = await page.getByText("Referință: aps:").textContent();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-accepted-production-snapshot.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-accepted.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Acceptă pentru producție" }).click();
  await expect(page.getByRole("heading", { name: "Deja acceptat pentru producție" })).toBeVisible();
  await page.locator(".production-snapshot details.snapshot-details").evaluate((el) => {
    (el as HTMLDetailsElement).open = true;
  });
  await expect(page.getByText(reference ?? "Referință: aps:")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-accepted-production-snapshot-idempotent.png",
    fullPage: true,
  });
});
