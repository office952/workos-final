import { copyFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { createCustomer, selectOrCreateCustomer } from "./helpers/customers";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";
import { uniqueJobInscription } from "./helpers/jobs";

const lettersName =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

async function confirmLetters(page: Page, inscription: string) {
  await page.goto("/products");
  await page.getByRole("link", { name: lettersName }).click();
  await expect(page.getByRole("heading", { name: lettersName })).toBeVisible();
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
}

test("admin can create a customer without building CRM", async ({ page }) => {
  await page.goto("/admin");
  await page.getByRole("link", { name: "Clienți" }).click();
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/customers-catalog.png",
    fullPage: true,
  });
  await page.getByLabel("Nume").fill("SC Exemplu Catalog");
  await page.getByRole("button", { name: "Adaugă client" }).click();
  await expect(page.getByText("SC Exemplu Catalog").first()).toBeVisible();
  await expect(page.getByText(/lead|pipeline|oportunitate|CUI/i)).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/customers-created.png",
    fullPage: true,
  });
});

test("LETTERS quote freezes customer into PDF, order and Lucrări", async ({ page }) => {
  await confirmLetters(page, "WORKOS");
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  await page.locator(".quote-section").screenshot({
    path: "docs/worklog/screenshots/letters-customer-selected.png",
  });
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("heading", { name: /Ofertă creată|Ofertă acceptată/ })).toBeVisible();
  await expect(quote.getByText("Client: Client Demo LETTERS")).toBeVisible();
  await expect(quote.getByText("Preț final: 624,82 EUR")).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-quote-customer-frozen.png",
  });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    quote.getByRole("link", { name: "Descarcă oferta PDF" }).click(),
  ]);
  copyFileSync(await download.path(), "docs/worklog/screenshots/letters-quote-customer.pdf");
  if ((await quote.getByRole("button", { name: "Marchează acceptată" }).count()) > 0) {
    await quote.getByRole("button", { name: "Marchează acceptată" }).click();
  }
  await expect(quote.getByRole("heading", { name: "Ofertă acceptată" })).toBeVisible();
  if ((await quote.getByRole("button", { name: "Creează comanda" }).count()) > 0) {
    await quote.getByRole("button", { name: "Creează comanda" }).click();
  }
  await expect(page.locator(".order-section").getByText("Client: Client Demo LETTERS")).toBeVisible();
  await page.goto("/");
  await expect(page.getByText("Client: Client Demo LETTERS").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/jobs-customer-letters.png",
    fullPage: true,
  });
});

test("ACM quote freezes a different customer", async ({ page }) => {
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
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByText("Client: Client Demo ACM")).toBeVisible();
  await expect(quote.getByText("Preț final: 118,66 EUR")).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    quote.getByRole("link", { name: "Descarcă oferta PDF" }).click(),
  ]);
  copyFileSync(await download.path(), "docs/worklog/screenshots/acm-quote-customer.pdf");
  await quote.screenshot({
    path: "docs/worklog/screenshots/acm-quote-customer-frozen.png",
  });
});

test("renaming a customer does not rewrite a frozen quote", async ({ page, request }) => {
  await confirmLetters(page, "RENAME");
  await selectOrCreateCustomer(page, "SC Exemplu SRL");
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByText("Client: SC Exemplu SRL")).toBeVisible();
  const listed = await request.get("/api/customers");
  const customers = ((await listed.json()) as { customers: Array<{ customerId: string; displayName: string }> })
    .customers;
  const customer = customers.find((item) => item.displayName === "SC Exemplu SRL");
  expect(customer).toBeTruthy();
  const documentHref = await quote.getByRole("link", { name: "Descarcă oferta PDF" }).getAttribute("href");
  expect(documentHref).toBeTruthy();
  const snapshotPath = documentHref!.replace(/\/document$/, "");
  await request.patch(`/api/customers/${customer!.customerId}`, {
    data: { displayName: "SC Exemplu Nou SRL" },
  });
  await expect(quote.getByText("Client: SC Exemplu SRL")).toBeVisible();
  const stored = await request.get(snapshotPath);
  const snapshot = ((await stored.json()) as { quoteSnapshot: { customer?: { displayName: string } } })
    .quoteSnapshot;
  expect(snapshot.customer?.displayName).toBe("SC Exemplu SRL");
  await expect(quote.getByText("SC Exemplu Nou SRL")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quote-customer-after-rename.png",
    fullPage: true,
  });
});

test("Lucrări distinguishes two similar jobs by customer", async ({ page, request }) => {
  const inscription = uniqueJobInscription("DUP");
  const alfa = await createCustomer(request, "Client Alfa");
  const beta = await createCustomer(request, "Client Beta");
  const compiled = await request.post("/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/compile", {
    data: {
      values: {
        "root.inscription": inscription,
        "face.finish": "none",
        "face.confirmedAreaMm2": 250000,
        "volume.depthMm": "60",
        "volume.finish": "none",
        "volume.confirmedPerimeterMm": 12500,
      },
    },
  });
  const compiledBody = (await compiled.json()) as { definition: unknown; reviewId: string };
  const quoteA = await request.post("/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/quote-snapshots", {
    data: {
      definition: compiledBody.definition,
      reviewId: compiledBody.reviewId,
      customerId: alfa.customerId,
    },
  });
  const quoteB = await request.post("/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/quote-snapshots", {
    data: {
      definition: compiledBody.definition,
      reviewId: compiledBody.reviewId,
      customerId: beta.customerId,
    },
  });
  const quoteAId = ((await quoteA.json()) as { quoteSnapshot: { quoteSnapshotId: string } })
    .quoteSnapshot.quoteSnapshotId;
  const quoteBId = ((await quoteB.json()) as { quoteSnapshot: { quoteSnapshotId: string } })
    .quoteSnapshot.quoteSnapshotId;
  await request.post(`/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/quote-snapshots/${quoteAId}/acceptance`);
  await request.post(`/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/quote-snapshots/${quoteBId}/acceptance`);
  await request.post(`/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/quote-snapshots/${quoteAId}/order`);
  await request.post(`/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/quote-snapshots/${quoteBId}/order`);
  await page.goto("/");
  await expect(page.getByText("Client: Client Alfa").first()).toBeVisible();
  await expect(page.getByText("Client: Client Beta").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/jobs-two-customers.png",
    fullPage: true,
  });
});

test("customer selector stays usable at 390px", async ({ page }) => {
  await confirmLetters(page, "NARROW");
  await page.setViewportSize({ width: 390, height: 844 });
  await selectOrCreateCustomer(page, "Client Demo LETTERS");
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByText("Client: Client Demo LETTERS")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await quote.screenshot({
    path: "docs/worklog/screenshots/letters-customer-narrow.png",
  });
});
