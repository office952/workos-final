import { describe, expect, it } from "vitest";
import { lightingFrontLedContract } from "./lighting.js";
import {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  createTechnicalSettingsRegistry,
  lightingFrontLedTechnicalSettings,
  listTypeTechnicalSettings,
} from "./technicalSettings.js";

describe("LIGHTING_FRONT_LED", () => {
  it("consumes canonical settings and stays unavailable without inventing quantities", () => {
    const technicalSettings = listTypeTechnicalSettings("LIGHTING_FRONT_LED");
    const pitch = technicalSettings.find((item) => item.id === LED_PITCH_SETTING_ID);
    const reserve = technicalSettings.find((item) => item.id === PSU_RESERVE_SETTING_ID);
    expect(pitch?.resolution).toEqual({ status: "RESOLVED", value: 100 });
    expect(reserve?.resolution).toEqual({
      status: "UNRESOLVED",
      reason: "OWNER_DECISION_REQUIRED",
    });

    const result = lightingFrontLedContract.calculate({
      values: { "lighting.mode": "front_lit" },
      measurements: [],
      shared: {},
      technicalSettings,
    });
    expect(result.status).toBe("UNAVAILABLE");
    expect(result.quantities).toEqual([]);
    expect(result.requirements).toEqual([]);
    expect(result.unavailable).toEqual(["Regula de rezervă PSU nu este stabilită"]);
    expect(result.unavailable).not.toContain("Regula de pas LED nu este stabilită");
    expect(result.requirements.some((item) => item.quantity === 0)).toBe(false);
  });

  it("does not invent LED quantity when required settings are resolved in a fixture", () => {
    const registry = createTechnicalSettingsRegistry(
      lightingFrontLedTechnicalSettings.map((setting) =>
        setting.id === PSU_RESERVE_SETTING_ID
          ? {
              ...setting,
              classification: "OWNER_CONFIRMED",
              resolution: { status: "RESOLVED", value: 99 },
            }
          : setting,
      ),
    );
    const result = lightingFrontLedContract.calculate({
      values: {},
      measurements: [],
      shared: {},
      technicalSettings: registry.listByType("LIGHTING_FRONT_LED"),
    });
    expect(result.status).toBe("UNAVAILABLE");
    expect(result.quantities).toEqual([]);
    expect(result.requirements).toEqual([]);
    expect(result.unavailable).toEqual(["Calculul de cantitate LED nu este autorizat încă"]);
  });
});
