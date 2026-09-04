import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import { setTheme } from "./helpers/account";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  configureCanonicalLettersForRequest,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

test("pre-quote INTERNAL wave shows the job preview and refuses live v2 freeze", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
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
  await expect(page.getByText("Total ofertă client")).toBeVisible();
  await expect(page.locator(".commercial-job-preview .commercial-gross")).toContainText(
    "866,82 EUR",
  );
  await expect(page.locator(".commercial-job-breakdown")).toContainText("624,82 EUR");
  await expect(page.locator(".commercial-job-breakdown")).toContainText("242,00 EUR");
  await expect(page.locator(".product-decision-rail .owner-internal-costs")).toContainText(
    "300,00 EUR",
  );
  const createQuote = page.getByRole("button", { name: "Creează oferta" });
  await expect(createQuote).toBeDisabled();
  await expect(
    page.getByText(
      "Previzualizarea ofertei cu montaj este pregătită. Înghețarea acestei oferte nu este activată în această etapă.",
    ),
  ).toBeVisible();
  await expect(page.getByLabel("Decizie comercială")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rezumat" })).toHaveCount(0);
  await expect(page.getByText("866,82 EUR")).toHaveCount(1);
  await mkdir(".tmp/review/prequote-v3-lock", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/01-product-ready-1440-light.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/05-product-ready-1280-light.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.getByText("866,82 EUR")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rezumat" })).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/06-product-ready-768-light.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await setTheme(page, "Întunecată");
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/07-product-ready-1440-dark.png",
    fullPage: true,
  });
  await setTheme(page, "Deschisă");
  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await expect(page.getByText("242,00 EUR cu TVA")).toBeVisible();
  await expect(page.getByText("200,00 EUR fără TVA")).toBeVisible();
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/03-request-ready-1440-light.png",
    fullPage: true,
  });
  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
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
  expect(compile.ok()).toBeTruthy();
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
        customerId,
        requestId,
      },
    },
  );
  expect(freeze.status()).toBe(422);
  expect(((await freeze.json()) as { error: string }).error).toBe(
    "service_quote_freeze_not_authorized",
  );

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

test("expired subcontract evidence can be renewed through Resurse și costuri", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
  const token = uniqueRequestToken("PQ2");
  const enable = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "SUBCONTRACTED" },
  });
  expect(enable.ok()).toBeTruthy();
  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${token}` },
  });
  const customerId = ((await customer.json()) as { customer: { customerId: string } }).customer
    .customerId;
  const created = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere reînnoire ${token}`,
      description: "Cerere sintetică pentru reînnoire evidență.",
    },
  });
  const requestId = ((await created.json()) as { request: { requestId: string } }).request
    .requestId;
  expect(
    (
      await request.patch(`/api/requests/${encodeURIComponent(requestId)}`, {
        data: { optionalScopeIds: ["SITE_INSTALLATION"] },
      })
    ).ok(),
  ).toBeTruthy();
  expect(
    (
      await request.patch(
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
          },
        },
      )
    ).ok(),
  ).toBeTruthy();

  const evidence = await request.post("/api/resources-admin/cost-evidence", {
    data: {
      resourceId: "SVC-SITE-INSTALL-SUBCONTRACT",
      amount: 180,
      note: "Evidență expirată pentru reînnoire.",
      supplierLabel: "Montaj Rapid SRL",
      validFrom: "2020-01-01",
      validUntil: "2020-06-01",
    },
  });
  if (evidence.status() === 409) {
    const admin = await request.get("/api/resources-admin");
    const adminBody = (await admin.json()) as {
      costEvidence: Array<{ resourceId: string; evidenceRowId: string | null }>;
    };
    const row = adminBody.costEvidence.find(
      (item) => item.resourceId === "SVC-SITE-INSTALL-SUBCONTRACT",
    );
    expect(row?.evidenceRowId).toBeTruthy();
    const supersede = await request.patch(
      `/api/resources-admin/cost-evidence/${encodeURIComponent(row?.evidenceRowId ?? "")}`,
      {
        data: {
          amount: 180,
          note: "Evidență expirată pentru reînnoire.",
          supplierLabel: "Montaj Rapid SRL",
          validFrom: "2020-01-01",
          validUntil: "2020-06-01",
        },
      },
    );
    expect(supersede.ok()).toBeTruthy();
  } else {
    expect(evidence.ok()).toBeTruthy();
  }

  const price = await request.patch(
    `/api/requests/${encodeURIComponent(requestId)}/installation-price`,
    { data: { netPrice: 200 } },
  );
  expect(price.ok()).toBeTruthy();

  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(
    page.getByText("Evidența subcontractantului nu este validă pentru această dată."),
  ).toBeVisible();
  await expect(page.getByText("Montajul nu are încă un cost complet.")).toBeVisible();
  await expect(page.getByText("Preț final client: 866,82 EUR")).toHaveCount(0);
  await expect(page.getByText("Total ofertă client")).toHaveCount(0);
  await expect(page.getByText("Totalul ofertei nu este gata.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Actualizează dovada de cost" })).toBeVisible();
  await expect(page.getByText("242,00 EUR")).toBeVisible();
  await expect(page.getByText("866,82 EUR")).toHaveCount(0);
  await mkdir(".tmp/review/prequote-v3-lock", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/02-product-blocked-1440-light.png",
    fullPage: true,
  });
  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await expect(page.getByText("Necesită acțiune")).toBeVisible();
  await expect(page.getByText("242,00 EUR cu TVA")).toBeVisible();
  await expect(page.getByRole("link", { name: "Actualizează dovada de cost" })).toBeVisible();
  await page.screenshot({
    path: ".tmp/review/prequote-v3-lock/04-request-blocked-1440-light.png",
    fullPage: true,
  });
  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));

  await page.goto(
    "/admin/resources?selected=cost%3ASVC-SITE-INSTALL-SUBCONTRACT%3Aunqualified",
  );
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByText("Montaj Rapid SRL").first()).toBeVisible();
  await expect(page.getByText("2020-06-01").first()).toBeVisible();
  await page.getByRole("button", { name: "Editează tarif" }).click();
  await expect(page.getByLabel("Furnizor")).toHaveValue("Montaj Rapid SRL");
  await page.getByLabel("Valid de la").fill("2026-01-01");
  await page.getByLabel("Valid până la").fill("2027-12-31");
  await page.getByRole("button", { name: "Salvează tarif" }).click();
  await expect(page.getByText("2027-12-31").first()).toBeVisible();

  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByText("Total ofertă client")).toBeVisible();
  await expect(page.locator(".commercial-job-preview .commercial-gross")).toContainText(
    "866,82 EUR",
  );
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeDisabled();
});
