import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { selectOrCreateCustomer } from "./helpers/customers";
import { copyDownload } from "./helpers/copyDownload";
import { uniqueJobInscription } from "./helpers/jobs";

const lettersName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function confirmLetters(page: Page, inscription: string) {
  await page.goto("/products");
  await page.getByRole("link", { name: lettersName }).click();
  await page.getByLabel("Textul literelor").fill(inscription);
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}

test("LETTERS commercial flow shows one next action through production handoff", async ({
  page,
}) => {
  const inscription = uniqueJobInscription("CE");
  await confirmLetters(page, inscription);
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează comanda" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-summary.png",
    fullPage: true,
  });
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await page.locator(".quote-section").screenshot({
    path: "docs/worklog/screenshots/letters-commercial-client-price.png",
  });
  await page.getByRole("button", { name: "Creează oferta" }).click();
  const quote = page.locator(".quote-section");
  await expect(quote.getByRole("heading", { name: /Ofertă creată|Ofertă acceptată/ })).toBeVisible();
  await expect(quote.getByRole("link", { name: "Descarcă oferta PDF" })).toBeVisible();
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-offer-created.png",
  });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    quote.getByRole("link", { name: "Descarcă oferta PDF" }).click(),
  ]);
  await copyDownload(page, await download.path(), "docs/worklog/screenshots/letters-quote-customer.pdf");
  if ((await quote.getByRole("button", { name: "Marchează acceptată" }).count()) > 0) {
    await quote.getByRole("button", { name: "Marchează acceptată" }).click();
  }
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-offer-accepted.png",
  });
  if ((await quote.getByRole("button", { name: "Creează comanda" }).count()) > 0) {
    await quote.getByRole("button", { name: "Creează comanda" }).click();
  }
  await expect(page.getByRole("heading", { name: "Comandă creată" })).toBeVisible();
  await page.locator(".order-section").screenshot({
    path: "docs/worklog/screenshots/letters-order-created-commercial.png",
  });
  await page.getByRole("button", { name: "Eliberează pentru producție" }).click();
  await expect(page.getByRole("button", { name: "Creează planul de execuție" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-production-handoff.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Creează planul de execuție" }).click();
  await expect(page.getByRole("link", { name: "Deschide execuția" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-execution-handoff-commercial.png",
    fullPage: true,
  });
  await expect(page.getByText("Detalii interne")).toBeVisible();
  await expect(page.getByText("Atelier / test tehnic")).toHaveCount(0);
  await page.locator(".secondary-details").screenshot({
    path: "docs/worklog/screenshots/letters-internal-details-collapsed.png",
  });
  await page.goto("/");
  await expect(page.getByText(`Client: Client Demo LETTERS`).first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/jobs-customer-letters.png",
    fullPage: true,
  });
});

test("ACM uses the same commercial section at 118,66 EUR", async ({ page }) => {
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
  await expect(page.getByText("Preț final client: 118,66 EUR")).toBeVisible();
  await selectOrCreateCustomer(page, "Client Demo ACM");
  await page.getByRole("button", { name: "Creează oferta" }).click();
  const quote = page.locator(".quote-section");
  await expect(quote.getByText("Preț final: 118,66 EUR")).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    quote.getByRole("link", { name: "Descarcă oferta PDF" }).click(),
  ]);
  await copyDownload(page, await download.path(), "docs/worklog/screenshots/acm-quote-customer.pdf");
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-commercial-state.png",
    fullPage: true,
  });
});

test("seller admin is distinct from customers and historical quotes stay frozen", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await page.getByRole("main").getByRole("link", { name: "Date firmă", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Date firmă" })).toBeVisible();
  await expect(page.getByLabel("Denumire legală")).toHaveValue("HUB MEDIA PRODUCTION S.R.L.");
  await page.screenshot({
    path: "docs/worklog/screenshots/seller-admin.png",
    fullPage: true,
  });
  await confirmLetters(page, uniqueJobInscription("SL"));
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await page.getByRole("button", { name: "Creează oferta" }).click();
  const quote = page.locator(".quote-section");
  const documentHref = await quote.getByRole("link", { name: "Descarcă oferta PDF" }).getAttribute("href");
  expect(documentHref).toBeTruthy();
  const snapshotPath = documentHref!.replace(/\/document$/, "");
  await request.patch("/api/seller", {
    data: {
      legalName: "P-Media B",
      brand: "P-Media B",
      fiscalId: "RO54481582",
      tradeRegister: "J2026024600006",
      address: "Șos. Sălaj, Nr. 351-353, Bl. 5, Et. 2, Ap. 22, Sector 5",
      locality: "București",
      iban: "RO81RZBR0000060030657337",
      bank: "RAIFFEISEN BANK",
    },
  });
  const stored = await request.get(snapshotPath);
  const snapshot = ((await stored.json()) as { quoteSnapshot: { seller?: { legalName: string } } })
    .quoteSnapshot;
  expect(snapshot.seller?.legalName).toBe("HUB MEDIA PRODUCTION S.R.L.");
  await request.patch("/api/seller", {
    data: {
      legalName: "HUB MEDIA PRODUCTION S.R.L.",
      brand: "HUB MEDIA PRODUCTION",
      fiscalId: "RO54481582",
      tradeRegister: "J2026024600006",
      address: "Șos. Sălaj, Nr. 351-353, Bl. 5, Et. 2, Ap. 22, Sector 5",
      locality: "București",
      iban: "RO81RZBR0000060030657337",
      bank: "RAIFFEISEN BANK",
    },
  });
});

test("keeps the commercial flow usable at 390px and atelier secondary", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await confirmLetters(page, uniqueJobInscription("N"));
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await expect(page.getByText("Atelier / test tehnic")).toBeVisible();
  await page.locator(".atelier-details").screenshot({
    path: "docs/worklog/screenshots/letters-atelier-secondary.png",
  });
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await page.getByRole("button", { name: "Creează oferta" }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-commercial-narrow.png",
    fullPage: true,
  });
});
