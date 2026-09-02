import { afterEach, describe, expect, it } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  LAB_SITE_INSTALL_ID,
  SITE_INSTALLATION_SCOPE_ID,
  SVC_SITE_INSTALL_SUBCONTRACT_ID,
} from "@workos-final/domain";
import { resetCloudLoginAttemptGuard } from "../src/cloud/controlPlane.js";
import { createApp } from "../src/app.js";
import {
  addOrganization,
  addUser,
  cleanupCloudTemps,
  createCloudFixture,
  loginCloud,
  MEMBER_PASSWORD,
  OWNER_PASSWORD,
} from "./cloud-harness.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const lettersValues = {
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

describe("first real letters pre-quote API", () => {
  it("lets the owner complete INTERNAL install and freeze a v2 quote, not a product-only v1", async () => {
    const app = createApp();
    const enable = await app.request("/api/operational-services/SITE_INSTALLATION", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ offerMode: "INTERNAL" }),
    });
    expect(enable.status).toBe(200);

    const createdCustomer = await app.request("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "Client prequote" }),
    });
    const customer = (await readBody(createdCustomer)).customer as JsonObject;
    const createdRequest = await app.request("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerId: customer.customerId,
        title: "Litere cu montaj",
        description: "Cerere sintetică pre-ofertă.",
      }),
    });
    const request = (await readBody(createdRequest)).request as JsonObject;
    const requestId = String(request.requestId);

    const selected = await app.request(`/api/requests/${encodeURIComponent(requestId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    expect(selected.status).toBe(200);

    const facts = await app.request(
      `/api/requests/${encodeURIComponent(requestId)}/installation-facts`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedVersion: 0,
          street: "Strada Fabricii 10",
          city: "București",
          measurementStatus: "OFFICE_MEASURED",
          facadeType: "CONCRETE",
          fixingMethod: "MECHANICAL_ANCHOR",
          siteElectrical: "NOT_APPLICABLE",
          crewSize: 3,
          plannedDurationHours: 4,
        }),
      },
    );
    expect(facts.status).toBe(200);

    const evidence = await app.request("/api/resources-admin/cost-evidence", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        resourceId: LAB_SITE_INSTALL_ID,
        amount: 25,
        note: "Tarif sintetic owner pentru montaj intern.",
      }),
    });
    expect(evidence.status).toBe(201);

    const price = await app.request(
      `/api/requests/${encodeURIComponent(requestId)}/installation-price`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ netPrice: 200 }),
      },
    );
    expect(price.status).toBe(200);
    const priced = await readBody(price);
    const detail = priced.detail as JsonObject;
    const installationScope = detail.installationScope as JsonObject;
    expect(installationScope.eicCompleteness).toBe("COMPLETE");
    expect(installationScope.commercialCompleteness).toBe("COMPLETE");
    expect(installationScope.commercialGrossPrice).toBe(242);

    const compile = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values: { "root.inscription": "PREQ", ...lettersValues } }),
    });
    const compiled = await readBody(compile);
    const confirmed = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        requestId,
      }),
    });
    expect(confirmed.status).toBe(200);
    expect(((await readBody(confirmed)).jobCommercial as JsonObject).grossPrice).toBe(866.82);
    const frozen = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId: customer.customerId,
        requestId,
      }),
    });
    expect(frozen.status).toBe(200);
    const snapshot = (await readBody(frozen)).quoteSnapshot as JsonObject;
    expect(snapshot.schemaVersion).toBe(2);
    expect((snapshot.jobCommercial as JsonObject).grossPrice).toBe(866.82);
    expect(snapshot.commercial).toMatchObject({ grossPrice: 624.82 });

    const productOnlyCompile = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: { "root.inscription": "ONLY", ...lettersValues } }),
      },
    );
    const productCompiled = await readBody(productOnlyCompile);
    const productFrozen = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: productCompiled.definition,
          reviewId: productCompiled.reviewId,
          customerId: customer.customerId,
        }),
      },
    );
    expect(productFrozen.status).toBe(200);
    expect(((await readBody(productFrozen)).quoteSnapshot as JsonObject).schemaVersion).toBe(1);
  });

  it("lets the owner complete SUBCONTRACTED install with supplier evidence, not the 200 EUR selling price", async () => {
    const app = createApp();
    const enable = await app.request("/api/operational-services/SITE_INSTALLATION", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ offerMode: "SUBCONTRACTED" }),
    });
    expect(enable.status).toBe(200);

    const createdCustomer = await app.request("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "Client subcontract" }),
    });
    const customer = (await readBody(createdCustomer)).customer as JsonObject;
    const createdRequest = await app.request("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerId: customer.customerId,
        title: "Litere montaj subcontractat",
        description: "Cerere sintetică subcontract.",
      }),
    });
    const requestId = String(((await readBody(createdRequest)).request as JsonObject).requestId);

    const selected = await app.request(`/api/requests/${encodeURIComponent(requestId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    expect(selected.status).toBe(200);

    const facts = await app.request(
      `/api/requests/${encodeURIComponent(requestId)}/installation-facts`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedVersion: 0,
          street: "Strada Fabricii 10",
          city: "București",
          measurementStatus: "OFFICE_MEASURED",
          facadeType: "CONCRETE",
          fixingMethod: "MECHANICAL_ANCHOR",
          siteElectrical: "NOT_APPLICABLE",
        }),
      },
    );
    expect(facts.status).toBe(200);

    const evidence = await app.request("/api/resources-admin/cost-evidence", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        resourceId: SVC_SITE_INSTALL_SUBCONTRACT_ID,
        amount: 180,
        note: "Cost subcontractant sintetic, nu prețul clientului.",
        supplierLabel: "Montaj Rapid SRL",
        validUntil: "2027-12-31",
      }),
    });
    expect(evidence.status).toBe(201);

    const price = await app.request(
      `/api/requests/${encodeURIComponent(requestId)}/installation-price`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ netPrice: 200 }),
      },
    );
    expect(price.status).toBe(200);
    const installationScope = (await readBody(price)).detail as JsonObject;
    const scope = installationScope.installationScope as JsonObject;
    expect(scope.eicCompleteness).toBe("COMPLETE");
    expect(scope.commercialGrossPrice).toBe(242);

    const compile = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values: { "root.inscription": "SUBC", ...lettersValues } }),
    });
    const compiled = await readBody(compile);
    const frozen = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId: customer.customerId,
        requestId,
      }),
    });
    expect(frozen.status).toBe(200);
    const snapshot = (await readBody(frozen)).quoteSnapshot as JsonObject;
    expect(snapshot.schemaVersion).toBe(2);
    expect((snapshot.jobCommercial as JsonObject).grossPrice).toBe(866.82);
    const installLine = ((snapshot.lines as Array<JsonObject>) ?? []).find(
      (line) => line.kind === "SITE_INSTALLATION",
    );
    expect((installLine?.eic as JsonObject | undefined)?.total).toBe(180);
    expect((installLine?.commercial as JsonObject | undefined)?.grossPrice).toBe(242);
  });
});

describe("first real letters pre-quote owner writes", () => {
  afterEach(() => {
    resetCloudLoginAttemptGuard();
    cleanupCloudTemps();
  });

  it("refuses a Cloud member price write and first install evidence write", async () => {
    const fixture = createCloudFixture();
    const alpha = await addOrganization(fixture, "Atelier Prequote");
    await addUser(fixture, {
      email: "owner-prequote@example.test",
      password: OWNER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "owner",
    });
    await addUser(fixture, {
      email: "member-prequote@example.test",
      password: MEMBER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "member",
    });
    const owner = await loginCloud(fixture.app, "owner-prequote@example.test", OWNER_PASSWORD);
    const member = await loginCloud(
      fixture.app,
      "member-prequote@example.test",
      MEMBER_PASSWORD,
      alpha.organization.organizationId,
    );
    expect(owner.response.status).toBe(200);
    expect(member.response.status).toBe(200);

    const enable = await fixture.app.request("/api/operational-services/SITE_INSTALLATION", {
      method: "PATCH",
      headers: {
        cookie: owner.cookie ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({ offerMode: "INTERNAL" }),
    });
    expect(enable.status).toBe(200);

    const createdCustomer = await fixture.app.request("/api/customers", {
      method: "POST",
      headers: {
        cookie: owner.cookie ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({ displayName: "Client cloud prequote" }),
    });
    const customer = (await readBody(createdCustomer)).customer as JsonObject;
    const createdRequest = await fixture.app.request("/api/requests", {
      method: "POST",
      headers: {
        cookie: owner.cookie ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        customerId: customer.customerId,
        title: "Litere cloud",
        description: "Cerere pentru poarta owner.",
      }),
    });
    const requestId = String(((await readBody(createdRequest)).request as JsonObject).requestId);
    await fixture.app.request(`/api/requests/${encodeURIComponent(requestId)}`, {
      method: "PATCH",
      headers: {
        cookie: owner.cookie ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });

    const memberPrice = await fixture.app.request(
      `/api/requests/${encodeURIComponent(requestId)}/installation-price`,
      {
        method: "PATCH",
        headers: {
          cookie: member.cookie ?? "",
          "content-type": "application/json",
        },
        body: JSON.stringify({ netPrice: 200 }),
      },
    );
    expect(memberPrice.status).toBe(403);

    const memberEvidence = await fixture.app.request("/api/resources-admin/cost-evidence", {
      method: "POST",
      headers: {
        cookie: member.cookie ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        resourceId: LAB_SITE_INSTALL_ID,
        amount: 25,
        note: "Încercare membru.",
      }),
    });
    expect(memberEvidence.status).toBe(403);
    fixture.close();
  });
});
