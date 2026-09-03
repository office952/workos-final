import { expect, test } from "./fixtures";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  configureCanonicalLettersForRequest,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

test("optional site installation is silent until selected and then blocks quote freeze", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("MON");
  const enable = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "INTERNAL" },
  });
  expect(enable.ok()).toBeTruthy();
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

  await configureCanonicalLettersForRequest(page, requestId);
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

  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByText("Produs: 624,82 EUR")).toBeVisible();
  await expect(page.getByText("Totalul ofertei nu este gata.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Montaj la locație" })).toBeVisible();
  await expect(page.getByText("Necesită acțiune")).toBeVisible();
  await expect(page.getByText("Montajul nu are încă un cost complet.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeDisabled();
  await expect(page.getByLabel("Decizie comercială")).not.toContainText(/0(?:[.,]00)? EUR/);

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
  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByRole("heading", { name: "Montaj la locație" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeEnabled();
});

test("orphan product quote cannot link to a request with incomplete site installation", async ({
  request,
}) => {
  const token = uniqueRequestToken("ORL");
  const enable = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "INTERNAL" },
  });
  expect(enable.ok()).toBeTruthy();
  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${token}` },
  });
  expect(customer.ok()).toBeTruthy();
  const customerId = ((await customer.json()) as { customer: { customerId: string } }).customer
    .customerId;
  const created = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere orphan ${token}`,
      description: "Cerere izolată pentru link orphan.",
    },
  });
  expect(created.ok()).toBeTruthy();
  const requestId = ((await created.json()) as { request: { requestId: string } }).request
    .requestId;
  const selected = await request.patch(`/api/requests/${encodeURIComponent(requestId)}`, {
    data: { optionalScopeIds: ["SITE_INSTALLATION"] },
  });
  expect(selected.ok()).toBeTruthy();

  const compile = await request.post(`/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/compile`, {
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
  });
  const compiled = (await compile.json()) as { definition: unknown; reviewId: string };
  const orphan = await request.post(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/quote-snapshots`,
    {
      data: {
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId,
      },
    },
  );
  expect(orphan.ok()).toBeTruthy();
  const orphanBody = (await orphan.json()) as {
    quoteSnapshot: { quoteSnapshotId: string; contentHash: string };
  };
  const quoteSnapshotId = orphanBody.quoteSnapshot.quoteSnapshotId;
  const contentHash = orphanBody.quoteSnapshot.contentHash;

  const detailBefore = await request.get(`/api/requests/${encodeURIComponent(requestId)}`);
  expect(
    ((await detailBefore.json()) as { detail: { linkedOffers: unknown[] } }).detail.linkedOffers,
  ).toHaveLength(0);

  const linked = await request.post(`/api/requests/${encodeURIComponent(requestId)}/quotes`, {
    data: { quoteSnapshotId },
  });
  expect(linked.status()).toBe(422);
  const linkedBody = (await linked.json()) as {
    error: string;
    reasons: string[];
    link?: unknown;
  };
  expect(linkedBody.error).toBe("incomplete_offer");
  expect(linkedBody.reasons).toEqual([
    "Montajul nu are încă un cost complet.",
    "Prețul de montaj nu este confirmat de owner.",
  ]);
  expect(linkedBody.link).toBeUndefined();

  const detailAfter = await request.get(`/api/requests/${encodeURIComponent(requestId)}`);
  expect(
    ((await detailAfter.json()) as { detail: { linkedOffers: unknown[] } }).detail.linkedOffers,
  ).toHaveLength(0);
  const reread = await request.get(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}`,
  );
  expect(
    ((await reread.json()) as { quoteSnapshot: { contentHash: string } }).quoteSnapshot
      .contentHash,
  ).toBe(contentHash);
});
