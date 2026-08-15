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
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
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
    const quantities = aggregate.quantities as Array<{
      componentId: string;
      value: number;
    }>;
    expect(quantities.find((item) => item.componentId === "VOLUME")?.value).toBe(12.5);
    expect(quantities.find((item) => item.componentId === "FACE")?.value).toBe(0.25);
    expect(quantities.find((item) => item.componentId === "BACK")?.value).toBe(0.25);
    expect(eic.completeness).toBe("PARTIAL");
    expect(eic.total).toBe(595);
    expect(eic.currency).toBe("EUR");
    expect((eic.excludedComponentLabels as string[])).toEqual([]);
    const preview = body.executionPlanPreview as JsonObject;
    expect(preview.status).toBe("PREVIEW");
    expect(preview.operationCount).toBeGreaterThan(0);
    expect(preview.summary).toEqual(
      expect.objectContaining({
        internalCostTotal: 595,
        internalCostCompleteness: "PARTIAL",
      }),
    );
    expect(JSON.stringify(preview)).not.toMatch(/ExecutionTask|startTask|assignedTo/);
  });

  it("does not let a draft override product-fixed identity", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: {
            ...readyValues,
            "face.materialFamily": "aluminum",
            "face.opticalType": "transparent",
            "lighting.mode": "halo",
          },
        }),
      },
    );
    const body = await readBody(response);
    const definition = body.definition as { values: Record<string, unknown> };
    expect(definition.values["face.materialFamily"]).toBe("plexiglas");
    expect(definition.values["face.opticalType"]).toBe("opal");
    expect(definition.values["lighting.mode"]).toBe("front_lit");
  });

  it("freezes an accepted production snapshot idempotently without tasks", async () => {
    const reviewed = await compileReady();
    const app = createApp();
    const payload = {
      definition: reviewed.definition,
      reviewId: reviewed.reviewId,
    };
    const first = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const firstBody = await readBody(first);
    const snapshot = firstBody.snapshot as JsonObject;
    expect(first.status).toBe(200);
    expect(firstBody.created).toBe(true);
    expect(snapshot.status).toBe("ACCEPTED");
    expect(snapshot.eic).toEqual(
      expect.objectContaining({ total: 595, completeness: "PARTIAL" }),
    );
    expect((snapshot.operations as unknown[]).length).toBe(12);
    expect(JSON.stringify(snapshot)).not.toMatch(
      /ExecutionTask|eligibleProviders|assignedProvider|startTask/,
    );

    const second = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const secondBody = await readBody(second);
    expect(second.status).toBe(200);
    expect(secondBody.created).toBe(false);
    expect((secondBody.snapshot as JsonObject).snapshotId).toBe(snapshot.snapshotId);
    expect((secondBody.snapshot as JsonObject).createdAt).toBe(snapshot.createdAt);

    const read = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}`,
    );
    expect(read.status).toBe(200);
    const readBodyJson = await readBody(read);
    expect((readBodyJson.snapshot as JsonObject).contentHash).toBe(snapshot.contentHash);

    const mutate = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}`,
      { method: "PATCH", headers: { "content-type": "application/json" }, body: "{}" },
    );
    expect(mutate.status).toBe(404);
  });
});
