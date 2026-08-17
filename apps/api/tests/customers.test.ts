import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "@workos-final/domain";
import { createApp } from "../src/app.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

describe("customer API", () => {
  it("creates, lists, renames and retires a customer without uniqueness", async () => {
    const app = createApp();
    const empty = await app.request("/api/customers");
    expect(empty.status).toBe(200);
    expect((await readBody(empty)).customers).toEqual([]);

    const first = await app.request("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "  SC Exemplu SRL  " }),
    });
    const second = await app.request("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "SC Exemplu SRL" }),
    });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    const created = (await readBody(first)).customer as JsonObject;
    const duplicate = (await readBody(second)).customer as JsonObject;
    expect(created.displayName).toBe("SC Exemplu SRL");
    expect(created.status).toBe("ACTIVE");
    expect(String(created.customerId).startsWith("cus:")).toBe(true);
    expect(duplicate.customerId).not.toBe(created.customerId);

    const renamed = await app.request(`/api/customers/${created.customerId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "SC Exemplu Nou SRL" }),
    });
    expect(((await readBody(renamed)).customer as JsonObject).displayName).toBe(
      "SC Exemplu Nou SRL",
    );

    const retired = await app.request(`/api/customers/${created.customerId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "RETIRED" }),
    });
    expect(((await readBody(retired)).customer as JsonObject).status).toBe("RETIRED");
    expect(JSON.stringify(await readBody(await app.request("/api/customers")))).not.toMatch(
      /email|phone|CUI|CRM|lead/,
    );
  });

  it("rejects an empty name", async () => {
    const app = createApp();
    const created = await app.request("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "   " }),
    });
    expect(created.status).toBe(400);
  });

  it("requires an active customer for a new commercial quote", async () => {
    const app = createApp();
    const compiled = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      }),
    });
    const reviewed = await readBody(compiled);
    const missing = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: reviewed.definition,
        reviewId: reviewed.reviewId,
      }),
    });
    expect(missing.status).toBe(422);
    expect((await readBody(missing)).error).toBe("missing_customer");
  });
});
