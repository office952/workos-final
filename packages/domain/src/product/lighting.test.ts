import { describe, expect, it } from "vitest";
import { lightingFrontLedContract } from "./lighting.js";

describe("LIGHTING_FRONT_LED", () => {
  it("stays unavailable without inventing LED or PSU quantities", () => {
    const result = lightingFrontLedContract.calculate({
      values: { "lighting.mode": "front_lit" },
      measurements: [],
      shared: {},
    });
    expect(result.status).toBe("UNAVAILABLE");
    expect(result.quantities).toEqual([]);
    expect(result.requirements).toEqual([]);
    expect(result.unavailable).toEqual([
      "Regula de pas LED nu este stabilită",
      "Regula de rezervă PSU nu este stabilită",
    ]);
    expect(result.requirements.some((item) => item.quantity === 0)).toBe(false);
  });
});
