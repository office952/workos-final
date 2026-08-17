import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { selectOrCreateCustomer } from "./helpers/customers";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const productName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function createGoldenOrder(page: Page, inscription: string) {
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
  await revealSecondaryProductSurfaces(page);
  const quote = page.locator(".quote-section");
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(
    quote.getByRole("heading", { name: /Ofertă creată|Ofertă acceptată/ }),
  ).toBeVisible();
  if ((await quote.getByRole("button", { name: "Marchează acceptată" }).count()) > 0) {
    await quote.getByRole("button", { name: "Marchează acceptată" }).click();
  }
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  const createOrder = quote.getByRole("button", { name: "Creează comanda" });
  if ((await createOrder.count()) > 0) {
    await createOrder.click();
  }
  const order = page.locator(".order-section");
  await expect(order.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  return { quote, order };
}

test("releases a frozen order to production without starting execution", async ({ page }) => {
  const { quote, order } = await createGoldenOrder(page, "REL60");
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await expect(order.getByText("Preț final: 624,82 EUR")).toBeVisible();
  await expect(page.getByRole("button", { name: "Acceptă pentru producție" })).toHaveCount(0);
  await expect(page.getByText("Atelier / test tehnic")).toHaveCount(0);
  const releaseButton = order.getByRole("button", { name: "Eliberează pentru producție" });
  if ((await releaseButton.count()) > 0) {
    await expect(
      order.getByText("Comanda nu a fost încă eliberată pentru producție."),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/letters-release-before.png",
      fullPage: true,
    });
    await order.screenshot({
      path: "docs/worklog/screenshots/letters-release-action.png",
    });
    await releaseButton.click();
  }
  await expect(order.getByText("Eliberată pentru producție.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Eliberată pentru producție" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  await expect(page.getByText("Cost intern curent: 382,50 EUR").first()).toBeVisible();
  await expect(page.getByText("Operații: 12").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Eliberează pentru producție" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Acceptă pentru producție" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Creează planul de execuție" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-release-after.png",
    fullPage: true,
  });
  await order.screenshot({
    path: "docs/worklog/screenshots/letters-release-order-state.png",
  });
  await page.locator(".production-snapshot").screenshot({
    path: "docs/worklog/screenshots/letters-release-snapshot.png",
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-release-lineage.png",
    fullPage: true,
  });
});

test("retries production release without a second snapshot or execution plan", async ({
  page,
}) => {
  const { order } = await createGoldenOrder(page, "RELR");
  const releaseButton = order.getByRole("button", { name: "Eliberează pentru producție" });
  if ((await releaseButton.count()) > 0) {
    await releaseButton.click();
  }
  await expect(page.getByRole("heading", { name: "Eliberată pentru producție" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Eliberează pentru producție" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toHaveCount(0);
});

test("keeps released order readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { order } = await createGoldenOrder(page, "RELN");
  const releaseButton = order.getByRole("button", { name: "Eliberează pentru producție" });
  if ((await releaseButton.count()) > 0) {
    await releaseButton.click();
  }
  await expect(page.getByText("Eliberată pentru producție.").first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-release-narrow.png",
    fullPage: true,
  });
});
