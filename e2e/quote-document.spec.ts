import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { selectOrCreateCustomer } from "./helpers/customers";
import { copyDownload } from "./helpers/copyDownload";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const lettersName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function confirmLetters(page: Page) {
  await page.goto("/products");
  await page.getByRole("link", { name: lettersName }).click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
}

async function confirmAcm(page: Page) {
  await page.goto("/products");
  await page.getByRole("link", { name: "Panou ACM casetat" }).click();
  await page.getByLabel("Denumire lucrare").fill("PANOU ACM");
  await page.getByLabel("Sistem de prindere").selectOption("steel_angle");
  await page.getByLabel("Lățime exterioară (mm)").fill("1000");
  await page.getByLabel("Înălțime exterioară (mm)").fill("500");
  await page.getByLabel("Adâncime casetă (mm)").selectOption("40");
  await page.getByLabel("Număr de îndoituri").selectOption("2");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
}

async function freezeAndDownload(page: Page, evidenceName: string, customerName: string) {
  await selectOrCreateCustomer(page, customerName);
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("heading", { name: /Ofertă creată|Ofertă acceptată/ })).toBeVisible();
  const downloadLink = quote.getByRole("link", { name: "Descarcă oferta PDF" });
  await expect(downloadLink).toBeVisible();
  await quote.screenshot({
    path: `docs/worklog/screenshots/${evidenceName}-quote-pdf-cta.png`,
  });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    downloadLink.click(),
  ]);
  await copyDownload(page, await download.path(), `docs/worklog/screenshots/${evidenceName}-quote-document.pdf`);
  expect(download.suggestedFilename()).toMatch(/^Oferta-OF-[0-9A-F]{8}\.pdf$/);
}

test("downloads LETTERS offer PDF from the frozen quote", async ({ page }) => {
  await confirmLetters(page);
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await freezeAndDownload(page, "letters", "Client Demo LETTERS");
});

test("downloads ACM offer PDF from the frozen quote", async ({ page }) => {
  await confirmAcm(page);
  await expect(page.getByText("Preț final client: 118,66 EUR")).toBeVisible();
  await freezeAndDownload(page, "acm", "Client Demo ACM");
});

test("keeps the PDF download action usable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await confirmLetters(page);
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("link", { name: "Descarcă oferta PDF" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-pdf-narrow.png",
  });
});
