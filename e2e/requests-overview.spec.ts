import { expect, test } from "./fixtures";
import { createCommercialQuote, uniqueQuoteInscription } from "./helpers/quotes";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  confirmCanonicalLettersOnPage,
  listRequestOverview,
  uniqueRequestToken,
} from "./helpers/requests";

function requestRow(page: import("@playwright/test").Page, title: string) {
  return page.locator(".requests-list li").filter({ hasText: title });
}

test("office can record a request, configure a product, and find the linked quote", async ({
  page,
  request,
}) => {
  const fatalErrors: string[] = [];
  const requestCreates: string[] = [];
  const quoteCreates: string[] = [];

  page.on("pageerror", (error) => {
    fatalErrors.push(error.message);
  });
  page.on("request", (item) => {
    if (item.method() === "POST" && item.url().endsWith("/api/requests")) {
      requestCreates.push(item.url());
    }
    if (item.method() === "POST" && /\/quote-snapshots$/.test(new URL(item.url()).pathname)) {
      quoteCreates.push(item.url());
    }
  });

  const token = uniqueRequestToken("CER");
  const customerName = `Client ${token}`;
  const title = `Litere fațadă ${token}`;
  const inscription = token.slice(0, 8);
  const beforeOverview = await listRequestOverview(request);
  const beforeCount = Array.isArray((beforeOverview.overview.requests as unknown[]))
    ? (beforeOverview.overview.requests as unknown[]).length
    : 0;

  await page.goto("/requests");
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Cereri" })).toBeVisible();
  await page.getByRole("button", { name: "Cerere nouă" }).click();
  const createForm = page.locator("form.people-create");
  await createForm.getByRole("button", { name: "Clientul nu e în listă" }).click();
  await expect(createForm.getByLabel("CUI")).toHaveCount(0);
  await expect(createForm.getByLabel("Email")).toHaveCount(0);
  await expect(createForm.getByLabel("Telefon")).toHaveCount(0);
  await createForm.getByRole("textbox", { name: "Nume client" }).fill(customerName);
  await createForm.getByRole("button", { name: "Creează clientul" }).click();
  await expect(createForm.getByRole("combobox", { name: "Client" })).toHaveValue(/cus:/);
  await createForm.getByRole("textbox", { name: "Titlu" }).fill(title);
  await createForm.getByRole("textbox", { name: "Descriere" }).fill(
    "Clientul sună pentru litere luminoase pe fațadă, text scurt, adâncime 60 mm.",
  );
  await createForm.getByRole("button", { name: "Creează cererea" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(/CER-[0-9A-F]{8}/)).toBeVisible();
  await expect(page.getByRole("link", { name: customerName })).toBeVisible();
  const requestUrl = page.url();
  expect(requestUrl).toMatch(/\/requests\/crq/);

  await page.getByRole("link", { name: "Înapoi la Cereri" }).click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(requestRow(page, title)).toBeVisible();
  await expect(requestRow(page, title)).toContainText(customerName);
  await expect(requestRow(page, title)).toContainText("Nouă");
  await expect(requestRow(page, title)).not.toContainText("De preluat");
  await expect(requestRow(page, title)).not.toContainText("Urmează oferta");
  await expect(requestRow(page, title).locator("a.registry-row")).not.toHaveClass(/is-attention/);
  await expect(requestRow(page, title)).toContainText("Deschide");
  await expect(page.getByText("contentHash")).toHaveCount(0);
  await expect(page.getByText("Intake")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/requests-overview-desktop.png",
    fullPage: true,
  });

  await requestRow(page, title).getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(
    page.getByText("Clientul sună pentru litere luminoase pe fațadă, text scurt, adâncime 60 mm."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Editează cererea" }).click();
  await page.getByLabel("Stare").selectOption({ label: "În lucru" });
  await page.getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByText("În lucru", { exact: true }).first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/request-detail.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Alege produs" }).click();
  await expect(page).toHaveURL(/\/products\?request=/);
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(page).toHaveURL(new RegExp(`/products/${CANONICAL_LETTERS_PRODUCT_CODE}\\?request=`));
  await expect(page.getByText(/Cerere CER-[0-9A-F]{8}/).first()).toBeVisible();
  await expect(page.getByText(`Client ${customerName}`)).toBeVisible();
  await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/request-product-context.png",
    fullPage: true,
  });

  await confirmCanonicalLettersOnPage(page, inscription);
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  const quote = page.locator(".quote-section");
  await expect(quote.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  await expect(quote.getByRole("combobox", { name: "Client" })).toHaveCount(0);
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("heading", { name: "Ofertă creată" })).toBeVisible();
  await expect(quote.getByText(`Client: ${customerName}`)).toBeVisible();
  await expect(quote.getByText(/OF-[0-9A-F]{8}/)).toBeVisible();

  await page.goto(requestUrl);
  await expect(page.getByRole("heading", { name: "Oferte și lucrări legate" })).toBeVisible();
  await expect(page.getByText("Ofertă creată")).toBeVisible();
  await expect(page.getByRole("link", { name: /OF-[0-9A-F]{8}/ })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/request-linked-quote.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: /Ofertă OF-/ }).click();
  await expect(page).toHaveURL(/\/quotes\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(page.getByText("Creată", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Marchează acceptată" }).click();
  await expect(page.getByText("Acceptată", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează comanda" })).toBeVisible();

  await page.goto(requestUrl);
  await expect(page.getByText("Ofertă acceptată")).toBeVisible();

  await page.getByRole("link", { name: /Ofertă OF-/ }).click();
  await expect(page).toHaveURL(/\/quotes\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await page.getByRole("button", { name: "Creează comanda" }).click();
  await expect(page).toHaveURL(/\/jobs\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await expect(page.getByText("Comandă creată")).toBeVisible();

  await page.goto(requestUrl);
  await expect(page.getByText("Comandă creată")).toBeVisible();

  await page.getByRole("link", { name: "Oferte" }).click();
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
  await expect(page.locator(".requests-list li").filter({ hasText: inscription })).toContainText(
    "Cu comandă",
  );

  await page.getByRole("link", { name: "Lucrări" }).click();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(page.locator(".requests-list li").filter({ hasText: inscription })).toBeVisible();

  await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Cereri" }).click();
  await expect(requestRow(page, title).getByRole("link", { name: title })).toHaveAttribute(
    "href",
    /\/requests\//,
  );
  await expect(requestRow(page, title)).toContainText("Deschide oferta");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/requests");
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(requestRow(page, title)).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Stare" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.screenshot({
    path: "docs/worklog/screenshots/requests-narrow.png",
    fullPage: true,
  });

  expect(requestCreates).toHaveLength(1);
  expect(quoteCreates).toHaveLength(1);
  expect(fatalErrors).toEqual([]);

  const afterOverview = await listRequestOverview(request);
  const afterCount = (afterOverview.overview.requests as unknown[]).length;
  expect(afterCount).toBe(beforeCount + 1);
});

test("product and quote paths still work without a request", async ({ page, request }) => {
  const orphan = await createCommercialQuote(request, uniqueQuoteInscription("NORQ"));
  const overview = await listRequestOverview(request);
  const requests = overview.overview.requests as Array<{
    title: string;
    linkedQuoteCount: number;
  }>;

  await page.goto(`/products/${CANONICAL_LETTERS_PRODUCT_CODE}`);
  await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
  await expect(page.getByText(/Cerere CER-/)).toHaveCount(0);

  await page.goto("/quotes");
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
  await expect(page.locator(".requests-list li").filter({ hasText: orphan.inscription })).toBeVisible();
  expect(requests.some((item) => item.title.includes(orphan.inscription))).toBe(false);
});
