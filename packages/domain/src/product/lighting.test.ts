import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  LIGHTING_MISSING_LED_GEOMETRY,
  LIGHTING_MISSING_LED_LOAD,
  LIGHTING_MISSING_PSU_CAPACITY,
  LIGHTING_MISSING_PSU_SELECTION,
  lightingFrontLedContract,
  requiredPsuCapacityW,
} from "./lighting.js";
import {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  listTypeTechnicalSettings,
} from "./technicalSettings.js";

const lightingSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "lighting.ts"),
  "utf8",
);
const contractSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "componentContract.ts"),
  "utf8",
);

describe("LIGHTING_FRONT_LED", () => {
  it("resolves owner-confirmed PSU reserve as a configurable setting", () => {
    const technicalSettings = listTypeTechnicalSettings("LIGHTING_FRONT_LED");
    const pitch = technicalSettings.find((item) => item.id === LED_PITCH_SETTING_ID);
    const reserve = technicalSettings.find((item) => item.id === PSU_RESERVE_SETTING_ID);
    expect(pitch?.resolution).toEqual({ status: "RESOLVED", value: 100 });
    expect(pitch?.source).toBe("OWNER_CONFIRMED");
    expect(reserve?.resolution).toEqual({ status: "RESOLVED", value: 25 });
    expect(reserve?.source).toBe("OWNER_CONFIRMED");
    expect(reserve?.classification).toBe("OWNER_CONFIRMED");
    expect(reserve?.configurable).toBe(true);
    expect(reserve?.unit).toBe("percent");
  });

  it("stays partial without inventing LED quantity or fake zeros", () => {
    const result = lightingFrontLedContract.calculate({
      values: { "lighting.mode": "front_lit" },
      measurements: [],
      shared: {},
      technicalSettings: listTypeTechnicalSettings("LIGHTING_FRONT_LED"),
    });
    expect(result.status).toBe("PARTIAL");
    expect(result.quantities).toEqual([]);
    expect(result.requirements).toEqual([]);
    expect(result.unavailable).toEqual([
      LIGHTING_MISSING_LED_GEOMETRY,
      LIGHTING_MISSING_LED_LOAD,
      LIGHTING_MISSING_PSU_CAPACITY,
      LIGHTING_MISSING_PSU_SELECTION,
    ]);
    expect(result.requirements.some((item) => item.quantity === 0)).toBe(false);
    expect(result.quantities.some((item) => item.value === 0)).toBe(false);
  });

  it("keeps the PSU formula setting-driven and free of hardcoded reserve", () => {
    expect(requiredPsuCapacityW(100, 25)).toBe(125);
    expect(requiredPsuCapacityW(100, 30)).toBe(130);
    expect(lightingSource).not.toMatch(/\b25\b/);
    expect(lightingSource).not.toMatch(/\b1\.25\b/);
    expect(lightingSource).not.toMatch(/\b30\b/);
    expect(lightingSource).not.toMatch(/\b1\.30\b/);
    expect(lightingSource).not.toMatch(/shared\.totalLedLoadW/);
    expect(contractSource).not.toMatch(/totalLedLoadW/);
  });

  it("does not treat confirmed perimeter as LED geometry", () => {
    const result = lightingFrontLedContract.calculate({
      values: {},
      measurements: [
        {
          componentId: "VOLUME",
          fieldId: "volume.confirmedPerimeterMm",
          value: 12500,
          unit: "mm",
          source: "OPERATOR_MANUAL",
          confirmed: true,
        },
      ],
      shared: {},
      technicalSettings: listTypeTechnicalSettings("LIGHTING_FRONT_LED"),
    });
    expect(result.quantities).toEqual([]);
    expect(result.unavailable).toContain(LIGHTING_MISSING_LED_GEOMETRY);
  });
});
