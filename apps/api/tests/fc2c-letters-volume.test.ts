import { describe, expect, it } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  LETTERS_FORM_SCHEMA_V2_ID,
  LETTERS_VOLUME_COLOR_651_010_ID,
  LETTERS_VOLUME_RAL_9005_ID,
  SHARED_ORACAL_ROLL_1260_ID,
  VOLUME_COLOR_ID_FIELD,
  VOLUME_RAL_COLOR_ID_FIELD,
  lettersFaceReadyValues,
  lettersVolumeReadyValues,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const readyBase = {
  "root.inscription": "WORKOS",
  ...lettersFaceReadyValues("none"),
};

async function compile(values: Record<string, unknown>) {
  const response = await createApp().request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ values: { ...readyBase, ...values } }),
  });
  return { response, body: await readBody(response) };
}

async function confirm(values: Record<string, unknown>) {
  const compiled = await compile(values);
  const response = await createApp().request(`/api/products/${CANONICAL_PRODUCT_CODE}/confirm`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      definition: compiled.body.definition,
      reviewId: compiled.body.reviewId,
    }),
  });
  return { response, body: await readBody(response) };
}

describe("FC2C LETTERS VOLUME catalog API", () => {
  it("GET product returns VOLUME catalog options on the V2 template", async () => {
    const response = await createApp().request(`/api/products/${CANONICAL_PRODUCT_CODE}`);
    const body = await readBody(response);
    expect(response.status).toBe(200);
    expect((body.template as JsonObject).version).toBe("2");
    expect((body.formSchema as JsonObject).id).toBe(LETTERS_FORM_SCHEMA_V2_ID);
    const options = body.configurationOptions as JsonObject;
    expect((options.selectOptions as JsonObject)["volume.finish"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: "stock" }),
        expect.objectContaining({ value: "oracal" }),
        expect.objectContaining({ value: "painted" }),
      ]),
    );
  });

  it("compiles and confirms stock, 641, 651 and RAL with COMPLETE EIC", async () => {
    for (const kind of ["stock", "641", "651", "painted"] as const) {
      const compiled = await compile(lettersVolumeReadyValues(kind));
      expect((compiled.body.definition as JsonObject).readiness, kind).toBe("ready");
      const confirmed = await confirm(lettersVolumeReadyValues(kind));
      expect(confirmed.response.status, kind).toBe(200);
      expect((confirmed.body.eic as JsonObject).completeness, kind).toBe("COMPLETE");
    }
  });

  it("rejects an invalid browser-supplied Oracal color id", async () => {
    const { body } = await compile({
      ...lettersVolumeReadyValues("651"),
      [VOLUME_COLOR_ID_FIELD]: "oracal:651:missing",
    });
    const definition = body.definition as JsonObject;
    expect(definition.readiness).toBe("blocked");
    expect(definition.missing).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: VOLUME_COLOR_ID_FIELD })]),
    );
  });

  it("rejects an invalid browser-supplied RAL id", async () => {
    const { body } = await compile({
      ...lettersVolumeReadyValues("painted"),
      [VOLUME_RAL_COLOR_ID_FIELD]: "ral:missing",
    });
    expect((body.definition as JsonObject).readiness).toBe("blocked");
    expect((body.definition as JsonObject).missing).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: VOLUME_RAL_COLOR_ID_FIELD })]),
    );
  });

  it("keeps catalog identities available for 641/651/RAL without blocking EIC", async () => {
    const compiled = await compile(lettersVolumeReadyValues("651"));
    expect((compiled.body.definition as JsonObject).readiness).toBe("ready");
    const painted = await compile(lettersVolumeReadyValues("painted"));
    expect((painted.body.definition as JsonObject).readiness).toBe("ready");
    expect(SHARED_ORACAL_ROLL_1260_ID.length).toBeGreaterThan(0);
    expect(LETTERS_VOLUME_COLOR_651_010_ID.length).toBeGreaterThan(0);
    expect(LETTERS_VOLUME_RAL_9005_ID.length).toBeGreaterThan(0);
  });
});
