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
  "back.material": "forex",
  "lighting.selected": false,
};

describe("product configuration API", () => {
  it("returns the LETTERS template and form schema", async () => {
    const response = await createApp().request("/api/product-templates/letters");
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const template = body.template as JsonObject;
    const family = template.family as JsonObject;
    const formSchema = body.formSchema as JsonObject;
    expect(template.code).toBe("letters");
    expect(family.label).toBe("Litere volumetrice");
    expect((formSchema.sections as unknown[]).length).toBeGreaterThan(0);
  });

  it("compiles a valid draft to a ready definition", async () => {
    const response = await createApp().request(
      "/api/product-templates/letters/compile",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: readyValues }),
      },
    );
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const definition = body.definition as JsonObject;
    expect(definition.readiness).toBe("ready");
  });

  it("keeps inactive lighting from blocking compile", async () => {
    const response = await createApp().request(
      "/api/product-templates/letters/compile",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: { ...readyValues, "lighting.mode": "front_lit" },
        }),
      },
    );
    const body = await readBody(response);
    const definition = body.definition as JsonObject;
    const values = definition.values as JsonObject;
    expect(definition.readiness).toBe("ready");
    expect(values["lighting.mode"]).toBeUndefined();
  });

  it("rejects confirmation when required data is missing", async () => {
    const response = await createApp().request(
      "/api/product-templates/letters/confirm",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: { ...readyValues, "root.inscription": "" },
        }),
      },
    );
    expect(response.status).toBe(422);
    const body = await readBody(response);
    const definition = body.definition as JsonObject;
    expect(definition.readiness).toBe("blocked");
  });

  it("confirms only after a ready definition and returns aggregate from truth", async () => {
    const response = await createApp().request(
      "/api/product-templates/letters/confirm",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: readyValues }),
      },
    );
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const truth = body.truth as JsonObject;
    const aggregate = body.aggregate as JsonObject;
    const components = aggregate.components as Array<{ id: string }>;
    expect(truth.status).toBe("CONFIRMED_IN_RUNTIME");
    expect(aggregate.derivedFrom).toBe("ProductTruth");
    expect(aggregate.inscription).toBe("WORKOS");
    expect(components.map((item) => item.id)).not.toContain("LIGHTING");
  });
});
