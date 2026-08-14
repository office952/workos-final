import { describe, expect, it } from "vitest";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  RETURN_CANT_FORMING_ID,
} from "../resources/catalog.js";
import {
  VOLUME_COMPONENT_ID,
  VOLUME_PERIMETER_FIELD,
  volumeAluminium06Contract,
  volumeLinearMeters,
} from "./volume.js";

describe("VOLUME_ALUMINIUM_06", () => {
  it("converts confirmed perimeter in one path", () => {
    expect(volumeLinearMeters(12500)).toBe(12.5);
  });

  it("builds volume quantity and resource demand without a product", () => {
    const measurements = volumeAluminium06Contract.collectMeasurements({
      [VOLUME_PERIMETER_FIELD]: 12500,
      "volume.depthMm": "60",
    });
    const result = volumeAluminium06Contract.calculate({
      values: { "volume.depthMm": "60" },
      measurements,
      shared: {},
    });
    expect(result.status).toBe("CALCULATED");
    expect(result.quantities).toEqual([
      expect.objectContaining({
        componentId: VOLUME_COMPONENT_ID,
        value: 12.5,
        unit: "m",
        label: "Lungime volum",
      }),
    ]);
    expect(result.requirements).toEqual([
      {
        componentId: VOLUME_COMPONENT_ID,
        resourceId: ALUMINIUM_RETURN_PROFILE_ID,
        quantity: 12.5,
        unit: "m",
      },
      {
        componentId: VOLUME_COMPONENT_ID,
        resourceId: RETURN_CANT_FORMING_ID,
        quantity: 12.5,
        unit: "m",
      },
    ]);
  });

  it("does not invent a VOLUME quantity without measurement", () => {
    const result = volumeAluminium06Contract.calculate({
      values: {},
      measurements: [],
      shared: {},
    });
    expect(result.status).toBe("MISSING_MEASUREMENT");
    expect(result.quantities).toEqual([]);
    expect(result.requirements).toEqual([]);
  });
});
