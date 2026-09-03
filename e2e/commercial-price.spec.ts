import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function confirmLetters(
  page: Page,
  values: { inscription: string; depth: string; faceFinish?: string },
) {
  await page.goto("/products");
  await page.getByRole("link", { name: productName }).click();
  await page.getByLabel("Textul literelor").fill(values.inscription);
  await page.getByLabel("Finisaj față").selectOption(values.faceFinish ?? "none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption(values.depth);
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
}

test("shows complete customer price after confirmed 60 mm internal cost", async ({
  page,
}) => {
  await confirmLetters(page, { inscription: "COM60", depth: "60" });
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Complet")).toBeVisible();
  const quote = page.locator(".quote-section");
  await expect(quote.getByRole("heading", { name: "Ofertă" })).toBeVisible();
  await expect(quote.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await expect(quote.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-60mm-relation.png",
    fullPage: true,
  });
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-60mm-summary.png",
  });
  await page.locator(".eic-section").screenshot({
    path: "docs/worklog/screenshots/letters-commercial-60mm-breakdown.png",
  });
});

test("shows complete customer price after confirmed 30 mm internal cost", async ({
  page,
}) => {
  await confirmLetters(page, { inscription: "COM30", depth: "30" });
  await expect(page.getByText("Total cost intern estimat: 370,00 EUR")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Complet")).toBeVisible();
  const quote = page.locator(".quote-section");
  await expect(quote.getByRole("heading", { name: "Ofertă" })).toBeVisible();
  await expect(quote.getByText("Preț final client: 604,40 EUR")).toBeVisible();
  await expect(quote.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  await expect(quote.getByText("624,82 EUR")).toHaveCount(0);
});

for (const { depth, eic, gross } of [
  { depth: "80", eic: "395,00 EUR", gross: "645,23 EUR" },
  { depth: "100", eic: "407,50 EUR", gross: "665,66 EUR" },
] as const) {
  test(`shows complete customer price after confirmed ${depth} mm internal cost`, async ({
    page,
  }) => {
    await confirmLetters(page, { inscription: `COM${depth}`, depth });
    await expect(page.getByText(`Total cost intern estimat: ${eic}`)).toBeVisible();
    const quote = page.locator(".quote-section");
    await expect(quote.getByText(`Preț final client: ${gross}`)).toBeVisible();
    await expect(quote.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  });
}

test("keeps commercial readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await confirmLetters(page, { inscription: "COMN", depth: "60" });
  const quote = page.locator(".quote-section");
  await expect(quote.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-narrow.png",
  });
});
