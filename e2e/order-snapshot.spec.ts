import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { selectOrCreateCustomer } from "./helpers/customers";

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function acceptGoldenQuote(page: Page, inscription: string) {
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
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await quote.getByRole("button", { name: "Îngheață oferta" }).click();
  await expect(
    quote.getByRole("heading", { name: /Ofertă salvată|Ofertă acceptată/ }),
  ).toBeVisible();
  if ((await quote.getByRole("button", { name: "Acceptă oferta" }).count()) > 0) {
    await quote.getByRole("button", { name: "Acceptă oferta" }).click();
  }
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  return quote;
}

test("creates an order from an accepted quote without releasing production", async ({
  page,
}) => {
  const quote = await acceptGoldenQuote(page, "ORD60");
  await expect(quote.getByText("Preț final: 624,82 EUR")).toBeVisible();
  const createOrder = quote.getByRole("button", { name: "Creează comanda" });
  if ((await createOrder.count()) > 0) {
    await expect(
      quote.getByText("Oferta acceptată nu a fost încă transformată în comandă."),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-order-before-create.png",
      fullPage: true,
    });
    await quote.screenshot({
      path: "docs/worklog/screenshots/letters-order-create-action.png",
    });
    await createOrder.click();
  }
  const order = page.locator(".order-section");
  await expect(order.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await expect(order.getByText("Preț final: 624,82 EUR")).toBeVisible();
  await expect(order.getByText("382,50 EUR")).toBeVisible();
  await expect(order.getByText("35% · 133,88 EUR")).toBeVisible();
  await expect(order.getByText("516,38 EUR")).toBeVisible();
  await expect(order.getByText("21% · 108,44 EUR")).toBeVisible();
  await expect(
    order.getByText("Comanda nu a fost încă eliberată pentru producție."),
  ).toBeVisible();
  await expect(quote.getByRole("button", { name: "Creează comanda" })).toHaveCount(0);
  await expect(order.getByRole("button", { name: "Eliberează pentru producție" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Acceptă pentru producție" })).toHaveCount(0);
  await expect(page.getByText("Atelier / test tehnic")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toHaveCount(0);
  await order.screenshot({
    path: "docs/worklog/screenshots/letters-order-created.png",
  });
  await order.screenshot({
    path: "docs/worklog/screenshots/letters-order-breakdown.png",
  });
  await order.screenshot({
    path: "docs/worklog/screenshots/letters-order-not-released.png",
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-order-vs-production.png",
    fullPage: true,
  });
});

test("retries order creation without a second snapshot", async ({ page }) => {
  const quote = await acceptGoldenQuote(page, "ORDR");
  const createOrder = quote.getByRole("button", { name: "Creează comanda" });
  if ((await createOrder.count()) > 0) {
    await createOrder.click();
  }
  await expect(page.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  await expect(quote.getByRole("button", { name: "Creează comanda" })).toHaveCount(0);
});

test("keeps created order readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const quote = await acceptGoldenQuote(page, "ORDN");
  const createOrder = quote.getByRole("button", { name: "Creează comanda" });
  if ((await createOrder.count()) > 0) {
    await createOrder.click();
  }
  await expect(page.getByText("Preț final: 624,82 EUR").first()).toBeVisible();
  await expect(
    page.getByText("Comanda nu a fost încă eliberată pentru producție."),
  ).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.locator(".order-section").screenshot({
    path: "docs/worklog/screenshots/letters-order-narrow.png",
  });
});
