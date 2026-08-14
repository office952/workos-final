import { describe, expect, it } from "vitest";
import { PLEXIGLAS_FACE_SHEET_ID } from "../resources/catalog.js";
import { FACE_AREA_FIELD, FACE_COMPONENT_ID, facePlexiglas3mmContract } from "./face.js";

describe("FACE_PLEXIGLAS_3MM", () => {
  it("converts confirmed area to quantity and plexiglas demand without a product", () => {
    const measurements = facePlexiglas3mmContract.collectMeasurements({
      [FACE_AREA_FIELD]: 250000,
    });
    const result = facePlexiglas3mmContract.calculate({
      values: {},
      measurements,
      shared: {},
      technicalSettings: [],
    });
    expect(result.status).toBe("CALCULATED");
    expect(result.quantities).toEqual([
      expect.objectContaining({
        componentId: FACE_COMPONENT_ID,
        value: 0.25,
        unit: "m2",
      }),
    ]);
    expect(result.requirements).toEqual([
      {
        componentId: FACE_COMPONENT_ID,
        resourceId: PLEXIGLAS_FACE_SHEET_ID,
        quantity: 0.25,
        unit: "m2",
      },
    ]);
  });

  it("does not invent a FACE quantity without measurement", () => {
    const result = facePlexiglas3mmContract.calculate({
      values: {},
      measurements: [],
      shared: {},
      technicalSettings: [],
    });
    expect(result.status).toBe("MISSING_MEASUREMENT");
    expect(result.quantities).toEqual([]);
    expect(result.requirements).toEqual([]);
  });
});
