import { describe, expect, it } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  FACE_COLOR_ID_FIELD,
  LETTERS_FACE_COLOR_651_010_ID,
  LETTERS_FORM_SCHEMA_V2_ID,
  MAT_VINYL_LAMINATE_ID,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_651_ID,
  MAT_VINYL_ORACAL_8500_ID,
  MAT_VINYL_PRINT_ID,
  SHARED_ORACAL_ROLL_1260_ID,
  SVC_LARGE_FORMAT_PRINT_ID,
  lettersFaceReadyValues,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const readyBase = {
  "root.inscription": "WORKOS",
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
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

describe("FC2B LETTERS FACE catalog API", () => {
  it("GET product returns the V2 template and catalog options projection", async () => {
    const response = await createApp().request(`/api/products/${CANONICAL_PRODUCT_CODE}`);
    const body = await readBody(response);
    expect(response.status).toBe(200);
    expect((body.template as JsonObject).version).toBe("2");
    expect((body.formSchema as JsonObject).id).toBe(LETTERS_FORM_SCHEMA_V2_ID);
    const options = body.configurationOptions as JsonObject;
    expect(options.selectOptions).toBeTruthy();
    expect((options.selectOptions as JsonObject)["face.finish"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: "none" }),
        expect.objectContaining({ value: "oracal" }),
        expect.objectContaining({ value: "print" }),
      ]),
    );
  });

  it("POST compile independently rejects an invalid browser-supplied color id", async () => {
    const { body } = await compile({
      ...lettersFaceReadyValues("651"),
      [FACE_COLOR_ID_FIELD]: "oracal:651:missing",
    });
    const definition = body.definition as JsonObject;
    expect(definition.readiness).toBe("blocked");
    expect(definition.missing).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldId: FACE_COLOR_ID_FIELD })]),
    );
  });

  it.each(["641", "651", "8500", "print", "print_laminated"] as const)(
    "confirms FACE %s with COMPLETE EIC",
    async (kind) => {
      const { response, body } = await confirm(lettersFaceReadyValues(kind));
      expect(response.status).toBe(200);
      const eic = body.eic as JsonObject;
      expect(eic.completeness).toBe("COMPLETE");
      const requirements = ((body.aggregate as JsonObject).requirements as Array<JsonObject>) ?? [];
      const ids = requirements.map((item) => item.resourceId);
      if (kind === "641") {
        expect(ids).toContain(MAT_VINYL_ORACAL_641_ID);
      }
      if (kind === "651") {
        expect(ids).toContain(MAT_VINYL_ORACAL_651_ID);
      }
      if (kind === "8500") {
        expect(ids).toContain(MAT_VINYL_ORACAL_8500_ID);
      }
      if (kind === "print") {
        expect(ids).toEqual(expect.arrayContaining([MAT_VINYL_PRINT_ID, SVC_LARGE_FORMAT_PRINT_ID]));
        expect(ids).not.toContain(MAT_VINYL_LAMINATE_ID);
      }
      if (kind === "print_laminated") {
        expect(ids).toEqual(
          expect.arrayContaining([
            MAT_VINYL_PRINT_ID,
            SVC_LARGE_FORMAT_PRINT_ID,
            MAT_VINYL_LAMINATE_ID,
          ]),
        );
      }
    },
  );

  it.each(["651", "8500", "print_laminated"] as const)(
    "freezes a COMPLETE quote for FACE %s without price-confidence blocking",
    async (kind) => {
      const app = createApp();
      const compiled = await compile(lettersFaceReadyValues(kind));
      const customer = await app.request("/api/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName: `FC2B ${kind}` }),
      });
      const customerId = ((await readBody(customer)).customer as JsonObject).customerId;
      const frozen = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: compiled.body.definition,
          reviewId: compiled.body.reviewId,
          customerId,
        }),
      });
      expect(frozen.status).toBe(200);
      const body = await readBody(frozen);
      expect((body.quoteSnapshot as JsonObject).status).toBe("FROZEN");
    },
  );

  it("does not treat a valid 651 color as a raw id leak in the compiled snapshot", async () => {
    const { body } = await compile(lettersFaceReadyValues("651"));
    const values = (body.definition as JsonObject).values as JsonObject;
    expect(values[FACE_COLOR_ID_FIELD]).toBe(LETTERS_FACE_COLOR_651_010_ID);
    expect(values["face.colorCode"]).toBe("010");
    expect(values["face.rollProfileId"]).toBe(SHARED_ORACAL_ROLL_1260_ID);
    expect(values["face.rollWidthMm"]).toBe(1260);
  });
});
