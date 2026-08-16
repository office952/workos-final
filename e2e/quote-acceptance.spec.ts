import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function freezeGoldenQuote(page: Page, inscription: string) {
  await page.goto("/products");
  await page.getByRole("link", { name: productName }).click();
  await page.getByLabel("Textul literelor").fill(inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Îngheață oferta" }).click();
  await expect(quote.getByRole("heading", { name: "Ofertă salvată" })).toBeVisible();
  return quote;
}

test("accepts a frozen quote without creating an order or production snapshot", async ({
  page,
}) => {
  const quote = await freezeGoldenQuote(page, "QAD60");
  await expect(quote.getByText("Preț final: 624,82 EUR")).toBeVisible();
  await expect(quote.getByRole("button", { name: "Acceptă oferta" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quote-before-acceptance.png",
    fullPage: true,
  });
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-accept-action.png",
  });
  await quote.getByRole("button", { name: "Acceptă oferta" }).click();
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await expect(quote.getByText("Preț final: 624,82 EUR")).toBeVisible();
  await expect(
    quote.getByText("Oferta acceptată nu a fost încă transformată în comandă."),
  ).toBeVisible();
  await expect(quote.getByRole("button", { name: "Acceptă oferta" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Acceptă pentru producție" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toHaveCount(0);
  await expect(page.getByText("Comandă creată")).toHaveCount(0);
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-accepted.png",
  });
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-accepted-details.png",
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quote-acceptance-vs-production.png",
    fullPage: true,
  });
});

test("retries quote acceptance without creating a second decision", async ({ page }) => {
  const quote = await freezeGoldenQuote(page, "QADR");
  await quote.getByRole("button", { name: "Acceptă oferta" }).click();
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await expect(quote.getByRole("button", { name: "Acceptă oferta" })).toHaveCount(0);
});

test("keeps accepted quote readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const quote = await freezeGoldenQuote(page, "QADN");
  await quote.getByRole("button", { name: "Acceptă oferta" }).click();
  await expect(page.getByText("Preț final: 624,82 EUR")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-accepted-narrow.png",
  });
});
