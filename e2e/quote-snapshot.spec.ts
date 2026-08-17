import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { selectOrCreateCustomer } from "./helpers/customers";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function confirmLetters(
  page: Page,
  values: { inscription: string; depth: string },
) {
  await page.goto("/products");
  await page.getByRole("link", { name: productName }).click();
  await page.getByLabel("Textul literelor").fill(values.inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption(values.depth);
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
}

test("freezes a quote from complete commercial price without production acceptance", async ({
  page,
}) => {
  await confirmLetters(page, { inscription: "QTS60", depth: "60" });
  const quote = page.locator(".quote-section");
  await expect(quote.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quote-before-freeze.png",
    fullPage: true,
  });
  await expect(quote.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-action.png",
  });
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("heading", { name: "Ofertă creată" })).toBeVisible();
  await expect(quote.getByText("Preț final: 624,82 EUR")).toBeVisible();
  await expect(quote.getByText("Client: Client Demo LETTERS")).toBeVisible();
  await expect(quote.getByRole("link", { name: "Descarcă oferta PDF" })).toBeVisible();
  await expect(quote.getByRole("button", { name: "Marchează acceptată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.getByRole("button", { name: "Acceptă pentru producție" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toHaveCount(0);
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-frozen-summary.png",
  });
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-frozen-breakdown.png",
  });
});

test("blocks quote freeze when 30 mm commercial is partial", async ({ page }) => {
  await confirmLetters(page, { inscription: "QTS30", depth: "30" });
  const quote = page.locator(".quote-section");
  await expect(quote.getByRole("button", { name: "Creează oferta" })).toHaveCount(0);
  await expect(
    quote.getByText("Costul intern nu este complet."),
  ).toBeVisible();
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-30mm-blocked.png",
  });
});

test("keeps frozen quote readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await confirmLetters(page, { inscription: "QTSN", depth: "60" });
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await page.locator(".quote-section").getByRole("button", { name: "Creează oferta" }).click();
  await expect(page.getByText("Preț final: 624,82 EUR")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.locator(".quote-section").screenshot({
    path: "docs/worklog/screenshots/letters-quote-narrow.png",
  });
});
