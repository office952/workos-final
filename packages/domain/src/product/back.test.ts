import { describe, expect, it } from "vitest";
import { FOREX_BACK_SHEET_ID } from "../resources/catalog.js";
import { BACK_COMPONENT_ID, backForex10mmContract } from "./back.js";

describe("BACK_FOREX_10MM", () => {
  it("owns supplied-area to quantity and forex demand without a product", () => {
    const result = backForex10mmContract.calculate({
      values: {},
      measurements: [],
      shared: { confirmedAreaMm2: 250000 },
      technicalSettings: [],
    });
    expect(result.status).toBe("CALCULATED");
    expect(result.quantities).toEqual([
      expect.objectContaining({
        componentId: BACK_COMPONENT_ID,
        value: 0.25,
        unit: "m2",
      }),
    ]);
    expect(result.requirements).toEqual([
      {
        componentId: BACK_COMPONENT_ID,
        resourceId: FOREX_BACK_SHEET_ID,
        quantity: 0.25,
        unit: "m2",
      },
    ]);
  });

  it("does not assume FACE area unless composition supplies it", () => {
    const result = backForex10mmContract.calculate({
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
