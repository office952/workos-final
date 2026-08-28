import { describe, expect, it } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  SITE_INSTALLATION_FREEZE_REASON,
  SITE_INSTALLATION_SCOPE_ID,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";

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

const acmValues = {
  "root.mountingSystem": "steel_angle",
  "face.widthMm": 1000,
  "face.heightMm": 500,
  "face.cassetteDepthMm": "40",
  "face.foldCount": "2",
};

async function compileReady(
  app: ReturnType<typeof createApp>,
  productCode: string,
  values: Record<string, string | number>,
  inscription: string,
) {
  const response = await app.request(`/api/products/${productCode}/compile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      values: { ...values, "root.inscription": inscription },
    }),
  });
  const body = await readBody(response);
  return {
    definition: body.definition as JsonObject,
    reviewId: body.reviewId as string,
  };
}

async function createCustomer(app: ReturnType<typeof createApp>, displayName: string) {
  const created = await app.request("/api/customers", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName }),
  });
  return (await readBody(created)).customer as JsonObject;
}

async function createRequest(
  app: ReturnType<typeof createApp>,
  customerId: string,
  title: string,
  description = "Clientul a cerut o ofertă.",
) {
  return app.request("/api/requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ customerId, title, description }),
  });
}

async function freezeQuote(
  app: ReturnType<typeof createApp>,
  productCode: string,
  values: Record<string, string | number>,
  inscription: string,
  customerId: string,
  requestId?: string,
) {
  const reviewed = await compileReady(app, productCode, values, inscription);
  return app.request(`/api/products/${productCode}/quote-snapshots`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      definition: reviewed.definition,
      reviewId: reviewed.reviewId,
      customerId,
      ...(requestId ? { requestId } : {}),
    }),
  });
}

describe("commercial request API", () => {
  it("creates, lists and updates a request without becoming a quote engine", async () => {
    const app = createApp();
    const customer = await createCustomer(app, "Client Cerere");
    const created = await createRequest(app, customer.customerId as string, "Litere exterior");
    expect(created.status).toBe(201);
    const createdBody = await readBody(created);
    const request = createdBody.request as JsonObject;
    expect(request).toMatchObject({
      customerId: customer.customerId,
      title: "Litere exterior",
      status: "NEW",
    });
    expect(String(request.reference)).toMatch(/^CER-[0-9A-F]{8}$/);
    expect(JSON.stringify(createdBody)).not.toMatch(/contentHash|eic|CostEngine|Intake|SENT/);

    const listed = await readBody(await app.request("/api/requests"));
    const overview = listed.overview as { requests: Array<JsonObject>; summary: JsonObject };
    expect(overview.requests).toHaveLength(1);
    expect(overview.requests[0]).toMatchObject({
      statusLabel: "Nouă",
      nextActionLabel: "Deschide",
      customerDisplayName: "Client Cerere",
    });

    const patched = await app.request(`/api/requests/${request.requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "READY_FOR_QUOTE" }),
    });
    expect(patched.status).toBe(200);
    expect(((await readBody(patched)).request as JsonObject).status).toBe("READY_FOR_QUOTE");

    const invalidStatus = await app.request(`/api/requests/${request.requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "QUOTE_CREATED" }),
    });
    expect(invalidStatus.status).toBe(400);
  });

  it("rejects a retired customer for a new request", async () => {
    const app = createApp();
    const customer = await createCustomer(app, "Client Retras");
    await app.request(`/api/customers/${customer.customerId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "RETIRED" }),
    });
    const created = await createRequest(app, customer.customerId as string, "Cerere retras");
    expect(created.status).toBe(400);
    expect((await readBody(created)).error).toBe("customer_unavailable");
  });

  it("links LETTERS and ACM quotes without mutating Quote Snapshot", async () => {
    const app = createApp();
    const customer = await createCustomer(app, "Client Mix");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Mix litere și ACM"),
    );
    const requestId = (created.request as JsonObject).requestId as string;

    const letters = await freezeQuote(
      app,
      CANONICAL_PRODUCT_CODE,
      lettersValues,
      "REQA",
      customer.customerId as string,
      requestId,
    );
    expect(letters.status).toBe(200);
    const lettersQuote = (await readBody(letters)).quoteSnapshot as JsonObject;
    const lettersHash = lettersQuote.contentHash;

    const otherCustomer = await createCustomer(app, "Alt client");
    const mismatch = await freezeQuote(
      app,
      CANONICAL_PRODUCT_CODE,
      lettersValues,
      "REQB",
      otherCustomer.customerId as string,
      requestId,
    );
    expect(mismatch.status).toBe(422);
    expect((await readBody(mismatch)).error).toBe("request_customer_mismatch");

    const acm = await freezeQuote(
      app,
      ACM_CASSETTE_NONE_PRODUCT_CODE,
      acmValues,
      "REQC",
      customer.customerId as string,
      requestId,
    );
    expect(acm.status).toBe(200);

    await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${lettersQuote.quoteSnapshotId}/acceptance`,
      { method: "POST" },
    );
    await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${lettersQuote.quoteSnapshotId}/order`,
      { method: "POST" },
    );

    const renamed = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Titlu corectat", description: "Descriere corectată" }),
    });
    expect(renamed.status).toBe(200);

    const locked = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customerId: otherCustomer.customerId }),
    });
    expect(locked.status).toBe(409);

    const detail = (await readBody(await app.request(`/api/requests/${requestId}`))).detail as {
      request: JsonObject;
      commercialProgress: string;
      commercialProgressLabel: string;
      linkedOffers: Array<JsonObject>;
    };
    expect(detail.request.title).toBe("Titlu corectat");
    expect(detail.request.status).toBe("NEW");
    expect(detail.commercialProgress).toBe("ORDER_CREATED");
    expect(detail.commercialProgressLabel).toBe("Comandă creată");
    expect(detail.linkedOffers).toHaveLength(2);
    expect(detail.linkedOffers.map((offer) => offer.productCode).sort()).toEqual([
      ACM_CASSETTE_NONE_PRODUCT_CODE,
      CANONICAL_PRODUCT_CODE,
    ].sort());

    const reread = await readBody(
      await app.request(
        `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${lettersQuote.quoteSnapshotId}`,
      ),
    );
    expect((reread.quoteSnapshot as JsonObject).contentHash).toBe(lettersHash);

    const orphan = await freezeQuote(
      app,
      CANONICAL_PRODUCT_CODE,
      lettersValues,
      "REQD",
      (await createCustomer(app, "Fără cerere")).customerId as string,
    );
    expect(orphan.status).toBe(200);
    const quotes = (await readBody(await app.request("/api/quotes"))).overview as {
      quotes: Array<JsonObject>;
    };
    expect(quotes.quotes.some((item) => item.inscription === "REQD")).toBe(true);
    expect(quotes.quotes.some((item) => item.inscription === "REQA")).toBe(true);

    const again = await app.request(`/api/requests/${requestId}/quotes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quoteSnapshotId: lettersQuote.quoteSnapshotId }),
    });
    expect(again.status).toBe(200);
    expect((await readBody(again)).alreadyApplied).toBe(true);
  });

  it("persists optional site installation without creating a quote", async () => {
    const app = createApp();
    const customer = await createCustomer(app, "Client Montaj");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Litere cu montaj"),
    );
    const request = created.request as JsonObject;
    const requestId = request.requestId as string;
    expect(request.optionalScopeIds).toEqual([]);
    expect((created.detail as JsonObject).installationScope).toBeNull();

    const selected = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    expect(selected.status).toBe(200);
    const selectedBody = await readBody(selected);
    expect((selectedBody.request as JsonObject).optionalScopeIds).toEqual([
      SITE_INSTALLATION_SCOPE_ID,
    ]);
    expect((selectedBody.detail as JsonObject).installationScope).toMatchObject({
      scopeId: SITE_INSTALLATION_SCOPE_ID,
      eicCompleteness: "PARTIAL",
      commercialCompleteness: "PARTIAL",
    });
    expect(JSON.stringify(selectedBody.detail)).not.toMatch(/0(?:[.,]0+)? EUR|"total"/);

    const again = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    expect(again.status).toBe(200);
    expect((await readBody(again)).alreadyApplied).toBe(true);

    const unknown = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: ["NOT_A_SCOPE"] }),
    });
    expect(unknown.status).toBe(400);
    expect((await readBody(unknown)).error).toBe("unknown_optional_scope");

    const quotesBefore = (
      (await readBody(await app.request("/api/quotes"))).overview as {
        quotes: Array<JsonObject>;
      }
    ).quotes.length;
    const detailBefore = (await readBody(await app.request(`/api/requests/${requestId}`)))
      .detail as { linkedOffers: Array<JsonObject> };
    const freeze = await freezeQuote(
      app,
      CANONICAL_PRODUCT_CODE,
      lettersValues,
      "INST1",
      customer.customerId as string,
      requestId,
    );
    expect(freeze.status).toBe(422);
    const freezeBody = await readBody(freeze);
    expect(freezeBody.error).toBe("incomplete_offer");
    expect(freezeBody.reasons).toEqual([SITE_INSTALLATION_FREEZE_REASON]);
    expect(freezeBody.quoteSnapshot).toBeUndefined();
    const quotesAfter = (
      (await readBody(await app.request("/api/quotes"))).overview as {
        quotes: Array<JsonObject>;
      }
    ).quotes.length;
    expect(quotesAfter).toBe(quotesBefore);
    const detailAfter = (await readBody(await app.request(`/api/requests/${requestId}`)))
      .detail as { linkedOffers: Array<JsonObject> };
    expect(detailAfter.linkedOffers).toHaveLength(detailBefore.linkedOffers.length);

    const cleared = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [] }),
    });
    expect(cleared.status).toBe(200);
    expect(((await readBody(cleared)).request as JsonObject).optionalScopeIds).toEqual([]);
  });
});
