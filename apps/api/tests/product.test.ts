import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const readyValues = {
  "root.inscription": "WORKOS",
  "face.material": "plexiglas",
  "face.finish": "none",
  "returnCant.material": "aluminum",
  "returnCant.depthMm": 60,
  "returnCant.finish": "none",
  "returnCant.confirmedPerimeterMm": 12500,
  "back.material": "forex",
  "lighting.selected": false,
};

async function compileReady() {
  const response = await createApp().request(
    "/api/product-templates/letters/compile",
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

describe("product configuration API", () => {
  it("returns the LETTERS template and form schema", async () => {
    const response = await createApp().request("/api/product-templates/letters");
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const template = body.template as JsonObject;
    const family = template.family as JsonObject;
    expect(template.code).toBe("letters");
    expect(family.label).toBe("Litere volumetrice");
  });

  it("compiles a valid draft to a ready definition", async () => {
    const compiled = await compileReady();
    expect(compiled.definition.readiness).toBe("ready");
    expect(compiled.reviewId).toBe(compiled.definition.reviewId);
  });

  it("rejects confirmation while the reviewed definition is blocked", async () => {
    const response = await createApp().request(
      "/api/product-templates/letters/compile",
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
      "/api/product-templates/letters/confirm",
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
      "/api/product-templates/letters/compile",
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
      "/api/product-templates/letters/confirm",
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
      "/api/product-templates/letters/confirm",
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
