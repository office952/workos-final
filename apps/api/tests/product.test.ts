import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "@workos-final/domain";
import { createApp } from "../src/app.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const readyValues = {
  "root.inscription": "WORKOS",
  "face.finish": "none",
  "returnCant.depthMm": "60",
  "returnCant.finish": "none",
  "returnCant.confirmedPerimeterMm": 12500,
};

async function compileReady() {
  const response = await createApp().request(
    `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values: readyValues }),
    },
  );
  const body = await readBody(response);
  return {
    definition: body.definition as JsonObject,
    reviewId: body.reviewId as string,
  };
}

describe("product catalog API", () => {
  it("projects the family, front-lit category, and canonical product", async () => {
    const response = await createApp().request("/api/product-catalog");
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const tree = JSON.stringify(body.tree);
    expect(tree).toContain("Litere și semne volumetrice luminoase");
    expect(tree).toContain("Litere volumetrice luminoase cu iluminare față");
    expect(tree).toContain(CANONICAL_PRODUCT_CODE);
    expect(tree).not.toContain('"code":"letters"');
  });
});

describe("product configuration API", () => {
  it("returns the canonical product and form schema", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}`,
    );
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const template = body.template as JsonObject;
    expect(template.code).toBe(CANONICAL_PRODUCT_CODE);
    expect(template.legacyReference).toBe("TPL-VOLUMETRIC-LETTERS_v2");
  });

  it("compiles a valid draft to a ready definition", async () => {
    const compiled = await compileReady();
    expect(compiled.definition.readiness).toBe("ready");
    expect(compiled.reviewId).toBe(compiled.definition.reviewId);
    expect(compiled.definition.templateCode).toBe(CANONICAL_PRODUCT_CODE);
  });

  it("rejects confirmation while the reviewed definition is blocked", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: { ...readyValues, "root.inscription": "" },
        }),
      },
    );
    const body = await readBody(response);
    const confirm = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: body.definition,
          reviewId: body.reviewId,
        }),
      },
    );
    expect(confirm.status).toBe(422);
  });

  it("rejects confirmation of a different definition than the one reviewed", async () => {
    const reviewed = await compileReady();
    const changed = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: { ...readyValues, "root.inscription": "CHANGED" },
        }),
      },
    );
    const changedBody = await readBody(changed);
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: changedBody.definition,
          reviewId: reviewed.reviewId,
        }),
      },
    );
    expect(response.status).toBe(409);
  });

  it("confirms the reviewed definition and returns partial EIC", async () => {
    const reviewed = await compileReady();
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: reviewed.definition,
          reviewId: reviewed.reviewId,
        }),
      },
    );
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const truth = body.truth as JsonObject;
    const aggregate = body.aggregate as JsonObject;
    const eic = body.eic as JsonObject;
    expect(truth.status).toBe("CONFIRMED_IN_RUNTIME");
    expect((aggregate.quantities as Array<{ value: number }>)[0]?.value).toBe(12.5);
    expect(eic.completeness).toBe("PARTIAL");
    expect(eic.total).toBe(312.5);
    expect(eic.currency).toBe("EUR");
  });
});
