import { afterEach, describe, expect, it } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  OWNER_CONFIRMED_SELLER,
  collectFinancialKeys,
} from "@workos-final/domain";
import { resetCloudLoginAttemptGuard } from "../src/cloud/controlPlane.js";
import {
  addOrganization,
  addUser,
  cleanupCloudTemps,
  createCloudFixture,
  loginCloud,
  MEMBER_PASSWORD,
  OWNER_PASSWORD,
} from "./cloud-harness.js";

afterEach(() => {
  resetCloudLoginAttemptGuard();
  cleanupCloudTemps();
});

const readyValues = {
  "root.inscription": "BANI",
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

async function json(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

async function confirmPlatformCostEvidence(
  app: {
    request: (path: string, init?: RequestInit) => Response | Promise<Response>;
  },
  cookie: string,
) {
  const admin = await json(
    await app.request("/api/resources-admin", { headers: { cookie } }),
  );
  const rows = (admin.costEvidence as Array<{ evidenceRowId?: string; amount?: number }>) ?? [];
  for (const row of rows) {
    if (!row.evidenceRowId || typeof row.amount !== "number") {
      continue;
    }
    const written = await app.request(
      `/api/resources-admin/cost-evidence/${encodeURIComponent(row.evidenceRowId)}`,
      {
        method: "PATCH",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify({ amount: row.amount, note: "Confirmat test financiar" }),
      },
    );
    expect(written.status).toBe(200);
  }
}

describe("ALT_B_SCOPED financial access", () => {
  it("filters owner, member-commercial and workshop payloads", async () => {
    const fixture = createCloudFixture();
    const org = await addOrganization(fixture, "Atelier Bani");
    await addUser(fixture, {
      email: "owner-bani@test",
      password: OWNER_PASSWORD,
      organizationId: org.organization.organizationId,
      role: "owner",
    });
    await addUser(fixture, {
      email: "member-bani@test",
      password: MEMBER_PASSWORD,
      organizationId: org.organization.organizationId,
      role: "member",
    });
    const owner = await loginCloud(
      fixture.app,
      "owner-bani@test",
      OWNER_PASSWORD,
      org.organization.organizationId,
    );
    const member = await loginCloud(
      fixture.app,
      "member-bani@test",
      MEMBER_PASSWORD,
      org.organization.organizationId,
    );
    const ownerHeaders = {
      cookie: owner.cookie ?? "",
      "content-type": "application/json",
    };
    const memberHeaders = { cookie: member.cookie ?? "" };

    const seller = await fixture.app.request("/api/seller", {
      method: "PATCH",
      headers: ownerHeaders,
      body: JSON.stringify({
        legalName: OWNER_CONFIRMED_SELLER.legalName,
        brand: OWNER_CONFIRMED_SELLER.brand,
        fiscalId: OWNER_CONFIRMED_SELLER.fiscalId,
        tradeRegister: OWNER_CONFIRMED_SELLER.tradeRegister,
        address: OWNER_CONFIRMED_SELLER.address,
        locality: OWNER_CONFIRMED_SELLER.locality,
        iban: OWNER_CONFIRMED_SELLER.iban,
        bank: OWNER_CONFIRMED_SELLER.bank,
      }),
    });
    expect(seller.status).toBe(200);
    await confirmPlatformCostEvidence(fixture.app, owner.cookie ?? "");

    const compiled = await fixture.app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: ownerHeaders,
      body: JSON.stringify({ values: readyValues }),
    });
    const compiledBody = await json(compiled);
    const confirmOwner = await fixture.app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: ownerHeaders,
        body: JSON.stringify({
          definition: compiledBody.definition,
          reviewId: compiledBody.reviewId,
        }),
      },
    );
    const confirmOwnerBody = await json(confirmOwner);
    const ownerConfirmKeys = collectFinancialKeys(confirmOwnerBody);
    expect(ownerConfirmKeys.has("internalCost")).toBe(true);
    expect(ownerConfirmKeys.has("markupPercent")).toBe(true);
    expect(ownerConfirmKeys.has("grossPrice")).toBe(true);

    const confirmMember = await fixture.app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { ...memberHeaders, "content-type": "application/json" },
        body: JSON.stringify({
          definition: compiledBody.definition,
          reviewId: compiledBody.reviewId,
        }),
      },
    );
    const confirmMemberBody = await json(confirmMember);
    const memberConfirmKeys = collectFinancialKeys(confirmMemberBody);
    expect(memberConfirmKeys.has("grossPrice")).toBe(true);
    expect(memberConfirmKeys.has("netPrice")).toBe(true);
    expect(memberConfirmKeys.has("internalCost")).toBe(false);
    expect(memberConfirmKeys.has("markupPercent")).toBe(false);
    expect(memberConfirmKeys.has("eic")).toBe(false);

    const customer = await fixture.app.request("/api/customers", {
      method: "POST",
      headers: ownerHeaders,
      body: JSON.stringify({ displayName: "Client Bani" }),
    });
    expect(customer.status).toBe(201);
    const customerId = ((await json(customer)).customer as { customerId: string }).customerId;
    const createdQuote = await fixture.app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`,
      {
        method: "POST",
        headers: ownerHeaders,
        body: JSON.stringify({
          definition: compiledBody.definition,
          reviewId: compiledBody.reviewId,
          customerId,
        }),
      },
    );
    const createdQuoteBody = await json(createdQuote);
    expect(createdQuote.status, JSON.stringify(createdQuoteBody)).toBe(200);
    const quoteId = (createdQuoteBody.quoteSnapshot as { quoteSnapshotId: string }).quoteSnapshotId;

    const memberQuote = await json(
      await fixture.app.request(`/api/quotes/${encodeURIComponent(quoteId)}`, {
        headers: memberHeaders,
      }),
    );
    const memberQuoteKeys = collectFinancialKeys(memberQuote);
    expect(memberQuoteKeys.has("grossPrice")).toBe(true);
    expect(memberQuoteKeys.has("internalCost")).toBe(false);
    expect(memberQuoteKeys.has("markupPercent")).toBe(false);
    expect(memberQuoteKeys.has("marginAmount")).toBe(false);
    expect(memberQuoteKeys.has("eic")).toBe(false);
    expect(memberQuoteKeys.has("rate")).toBe(false);
    expect(memberQuoteKeys.has("cost")).toBe(false);

    const ownerQuote = await json(
      await fixture.app.request(`/api/quotes/${encodeURIComponent(quoteId)}`, {
        headers: { cookie: owner.cookie ?? "" },
      }),
    );
    expect(collectFinancialKeys(ownerQuote).has("internalCost")).toBe(true);
    expect(collectFinancialKeys(ownerQuote).has("marginAmount")).toBe(true);

    await fixture.app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${encodeURIComponent(quoteId)}/acceptance`,
      { method: "POST", headers: { cookie: owner.cookie ?? "" } },
    );
    const createdOrder = await fixture.app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${encodeURIComponent(quoteId)}/order`,
      { method: "POST", headers: { cookie: owner.cookie ?? "" } },
    );
    const orderId = ((await json(createdOrder)).orderSnapshot as { orderSnapshotId: string })
      .orderSnapshotId;
    const released = await json(
      await fixture.app.request(
        `/api/products/${CANONICAL_PRODUCT_CODE}/orders/${encodeURIComponent(orderId)}/production-release`,
        { method: "POST", headers: { cookie: owner.cookie ?? "" } },
      ),
    );
    const snapshotId = (released.snapshot as { snapshotId: string }).snapshotId;
    const planned = await json(
      await fixture.app.request(
        `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${encodeURIComponent(snapshotId)}/execution-plan`,
        { method: "POST", headers: { cookie: owner.cookie ?? "" } },
      ),
    );
    const planId = (planned.executionPlan as { plan: { planId: string } }).plan.planId;

    const memberJob = await json(
      await fixture.app.request(`/api/jobs/${encodeURIComponent(orderId)}`, {
        headers: memberHeaders,
      }),
    );
    const memberJobKeys = collectFinancialKeys(memberJob);
    expect(memberJobKeys.has("grossPrice")).toBe(true);
    expect(memberJobKeys.has("internalCost")).toBe(false);
    expect(memberJobKeys.has("markupPercent")).toBe(false);
    expect(memberJobKeys.has("eicTotal")).toBe(false);
    expect(memberJobKeys.has("actualInternalCost")).toBe(false);

    const ownerJob = await json(
      await fixture.app.request(`/api/jobs/${encodeURIComponent(orderId)}`, {
        headers: { cookie: owner.cookie ?? "" },
      }),
    );
    expect(collectFinancialKeys(ownerJob).has("internalCost")).toBe(true);
    expect(collectFinancialKeys(ownerJob).has("eicTotal")).toBe(true);

    const memberExecution = await json(
      await fixture.app.request(`/api/execution-plans/${encodeURIComponent(planId)}`, {
        headers: memberHeaders,
      }),
    );
    const workshopKeys = collectFinancialKeys(memberExecution);
    expect(workshopKeys.has("internalCost")).toBe(false);
    expect(workshopKeys.has("markupPercent")).toBe(false);
    expect(workshopKeys.has("marginAmount")).toBe(false);
    expect(workshopKeys.has("netPrice")).toBe(false);
    expect(workshopKeys.has("vatPercent")).toBe(false);
    expect(workshopKeys.has("grossPrice")).toBe(false);
    expect(workshopKeys.has("eicTotal")).toBe(false);
    expect(workshopKeys.has("actualInternalCost")).toBe(false);

    const ownerExecution = await json(
      await fixture.app.request(`/api/execution-plans/${encodeURIComponent(planId)}`, {
        headers: { cookie: owner.cookie ?? "" },
      }),
    );
    expect(collectFinancialKeys(ownerExecution).has("eicTotal")).toBe(false);
    expect(collectFinancialKeys(ownerExecution).has("actualInternalCost")).toBe(false);

    const memberResources = await json(
      await fixture.app.request("/api/resources-admin", { headers: memberHeaders }),
    );
    expect(collectFinancialKeys(memberResources).has("rate")).toBe(false);
    expect(JSON.stringify(memberResources)).not.toContain("\"amount\"");
    expect(JSON.stringify(memberResources)).not.toContain("amountDisplay");
    expect(JSON.stringify(memberResources)).not.toMatch(/\d+,\d{2} EUR/);

    expect((await fixture.app.request("/api/quotes/qts:missing")).status).toBe(401);
    expect((await fixture.app.request("/api/jobs/ord:missing")).status).toBe(401);

    fixture.close();
  });
});
