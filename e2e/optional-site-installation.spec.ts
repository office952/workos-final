import { expect, test } from "./fixtures";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

test("optional site installation is silent until selected and then blocks quote freeze", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("MON");
  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${token}` },
  });
  expect(customer.ok()).toBeTruthy();
  const customerBody = (await customer.json()) as { customer: { customerId: string } };
  const created = await request.post("/api/requests", {
    data: {
      customerId: customerBody.customer.customerId,
      title: `Litere montaj ${token}`,
      description: "Cerere izolată pentru montaj opțional.",
    },
  });
  expect(created.ok()).toBeTruthy();
  const createdBody = (await created.json()) as {
    request: { requestId: string; optionalScopeIds: string[] };
    detail: { installationScope: unknown };
  };
  expect(createdBody.request.optionalScopeIds).toEqual([]);
  expect(createdBody.detail.installationScope).toBeNull();
  const requestId = createdBody.request.requestId;

  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  const checkbox = page.getByRole("checkbox", { name: /Montaj la locație/ });
  await expect(checkbox).toBeVisible();
  await expect(checkbox).not.toBeChecked();

  await page
    .locator(`a[href*="${CANONICAL_LETTERS_PRODUCT_CODE}"]`)
    .filter({ hasText: "Configurează" })
    .click();
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByRole("heading", { name: "Ofertă" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Montaj la locație" })).toHaveCount(0);
  const createQuote = page.getByRole("button", { name: "Creează oferta" });
  await expect(createQuote).toBeVisible();
  await expect(createQuote).toBeEnabled();

  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        response.url().includes("/api/requests/"),
    ),
    page.getByRole("checkbox", { name: /Montaj la locație/ }).click(),
  ]);
  await expect(page.getByRole("checkbox", { name: /Montaj la locație/ })).toBeChecked();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /Montaj la locație/ })).toBeChecked();

  await page
    .locator(`a[href*="${CANONICAL_LETTERS_PRODUCT_CODE}"]`)
    .filter({ hasText: "Configurează" })
    .click();
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByText(/Preț final client: 624,82 EUR/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Montaj la locație" })).toBeVisible();
  await expect(page.getByText("Parțial")).toBeVisible();
  await expect(page.getByText("Montajul nu are încă un cost complet.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeDisabled();
  await expect(page.locator(".installation-scope-section")).not.toContainText(/0(?:[.,]00)? EUR/);

  const quotesBefore = await request.get("/api/quotes");
  const quotesBeforeBody = (await quotesBefore.json()) as {
    overview: { quotes: unknown[] };
  };
  const compile = await request.post(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/compile`,
    {
      data: {
        values: {
          "root.inscription": token.slice(0, 8),
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    },
  );
  const compiled = (await compile.json()) as {
    definition: unknown;
    reviewId: string;
  };
  const freeze = await request.post(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/quote-snapshots`,
    {
      data: {
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId: customerBody.customer.customerId,
        requestId,
      },
    },
  );
  expect(freeze.status()).toBe(422);
  const freezeBody = (await freeze.json()) as {
    error: string;
    quoteSnapshot?: unknown;
  };
  expect(freezeBody.error).toBe("incomplete_offer");
  expect(freezeBody.quoteSnapshot).toBeUndefined();
  const quotesAfter = await request.get("/api/quotes");
  const quotesAfterBody = (await quotesAfter.json()) as {
    overview: { quotes: unknown[] };
  };
  expect(quotesAfterBody.overview.quotes).toHaveLength(quotesBeforeBody.overview.quotes.length);

  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        response.url().includes("/api/requests/"),
    ),
    page.getByRole("checkbox", { name: /Montaj la locație/ }).click(),
  ]);
  await page
    .locator(`a[href*="${CANONICAL_LETTERS_PRODUCT_CODE}"]`)
    .filter({ hasText: "Configurează" })
    .click();
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByRole("heading", { name: "Montaj la locație" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeEnabled();
});
