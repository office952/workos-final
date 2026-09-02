import { expect, test } from "./fixtures";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  configureCanonicalLettersForRequest,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

test("pre-quote INTERNAL wave freezes a v2 job quote without rewriting product-only v1", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("PQ1");
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
      title: `Litere prequote ${token}`,
      description: "Cerere sintetică pentru valul pre-ofertă.",
    },
  });
  expect(created.ok()).toBeTruthy();
  const requestId = ((await created.json()) as { request: { requestId: string } }).request
    .requestId;

  const selected = await request.patch(`/api/requests/${encodeURIComponent(requestId)}`, {
    data: { optionalScopeIds: ["SITE_INSTALLATION"] },
  });
  expect(selected.ok()).toBeTruthy();

  const facts = await request.patch(
    `/api/requests/${encodeURIComponent(requestId)}/installation-facts`,
    {
      data: {
        expectedVersion: 0,
        street: "Strada Fabricii 10",
        city: "București",
        measurementStatus: "OFFICE_MEASURED",
        facadeType: "CONCRETE",
        fixingMethod: "MECHANICAL_ANCHOR",
        siteElectrical: "NOT_APPLICABLE",
        crewSize: 3,
        plannedDurationHours: 4,
      },
    },
  );
  expect(facts.ok()).toBeTruthy();

  const evidence = await request.post("/api/resources-admin/cost-evidence", {
    data: {
      resourceId: "LAB-SITE-INSTALL",
      amount: 25,
      note: "Tarif sintetic owner pentru montaj intern.",
    },
  });
  if (evidence.status() === 409) {
    const admin = await request.get("/api/resources-admin");
    const adminBody = (await admin.json()) as {
      costEvidence: Array<{ resourceId: string; evidenceRowId: string | null }>;
    };
    const row = adminBody.costEvidence.find((item) => item.resourceId === "LAB-SITE-INSTALL");
    expect(row?.evidenceRowId).toBeTruthy();
    const supersede = await request.patch(
      `/api/resources-admin/cost-evidence/${encodeURIComponent(row?.evidenceRowId ?? "")}`,
      { data: { amount: 25, note: "Tarif sintetic owner pentru montaj intern." } },
    );
    expect(supersede.ok()).toBeTruthy();
  } else {
    expect(evidence.ok()).toBeTruthy();
  }

  const price = await request.patch(
    `/api/requests/${encodeURIComponent(requestId)}/installation-price`,
    {
      data: { netPrice: 200 },
    },
  );
  expect(price.ok()).toBeTruthy();

  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByText("Produs: 624,82 EUR")).toBeVisible();
  await expect(page.getByText("Montaj la locație: 242,00 EUR")).toBeVisible();
  await expect(page.getByText("Preț final client: 866,82 EUR")).toBeVisible();
  const createQuote = page.getByRole("button", { name: "Creează oferta" });
  await expect(createQuote).toBeEnabled();
  await createQuote.click();
  await expect(page.getByRole("heading", { name: "Ofertă creată" })).toBeVisible();
  await expect(page.getByText("Preț final: 866,82 EUR")).toBeVisible();

  const quotes = await request.get("/api/quotes");
  const quotesBody = (await quotes.json()) as {
    overview: { quotes: Array<{ quoteSnapshotId: string }> };
  };
  const latestId = quotesBody.overview.quotes[0]?.quoteSnapshotId;
  expect(latestId).toBeTruthy();
  const snapshot = await request.get(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/quote-snapshots/${encodeURIComponent(latestId ?? "")}`,
  );
  const snapshotBody = (await snapshot.json()) as {
    quoteSnapshot: { schemaVersion: number; jobCommercial?: { grossPrice: number } };
  };
  expect(snapshotBody.quoteSnapshot.schemaVersion).toBe(2);
  expect(snapshotBody.quoteSnapshot.jobCommercial?.grossPrice).toBe(866.82);

  const productOnly = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere fără montaj ${token}`,
      description: "Cerere sintetică fără montaj.",
    },
  });
  const productOnlyId = ((await productOnly.json()) as { request: { requestId: string } }).request
    .requestId;
  await configureCanonicalLettersForRequest(page, productOnlyId);
  await confirmCanonicalLettersOnPage(page, "NOPQ");
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeEnabled();
});
