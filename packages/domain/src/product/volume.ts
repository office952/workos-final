import {
  ALUMINIUM_RETURN_PROFILE_ID,
  RETURN_CANT_FORMING_ID,
} from "../resources/catalog.js";
import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import type { DraftValues, TechnicalMeasurement } from "./types.js";
import { linearMetersFromMm } from "./units.js";

export const VOLUME_COMPONENT_ID = "VOLUME";
export const VOLUME_PERIMETER_FIELD = "volume.confirmedPerimeterMm";

export function volumeLinearMeters(perimeterMm: number): number {
  return linearMetersFromMm(perimeterMm);
}

function volumeResult(
  status: ComponentCalculationResult["status"],
  quantities: ComponentCalculationResult["quantities"],
  requirements: ComponentCalculationResult["requirements"],
): ComponentCalculationResult {
  return {
    variantId: "VOLUME_ALUMINIUM_06",
    role: "VOLUME",
    status,
    quantities,
    requirements,
    unavailable: ["Geometrie din Analyzer"],
  };
}

export const volumeAluminium06Contract: ComponentCalculationContract = {
  variantId: "VOLUME_ALUMINIUM_06",
  role: "VOLUME",
  collectMeasurements(values: DraftValues): TechnicalMeasurement[] {
    const perimeter = values[VOLUME_PERIMETER_FIELD];
    if (typeof perimeter !== "number") {
      return [];
    }
    return [
      {
        componentId: VOLUME_COMPONENT_ID,
        fieldId: VOLUME_PERIMETER_FIELD,
        value: perimeter,
        unit: "mm",
        source: "OPERATOR_MANUAL",
        confirmed: true,
      },
    ];
  },
  calculate(input: ComponentCalculationInput): ComponentCalculationResult {
    const perimeter = input.measurements.find(
      (item) => item.fieldId === VOLUME_PERIMETER_FIELD,
    );
    if (!perimeter) {
      return volumeResult("MISSING_MEASUREMENT", [], []);
    }
    const meters = volumeLinearMeters(perimeter.value);
    return volumeResult(
      "CALCULATED",
      [
        {
          componentId: VOLUME_COMPONENT_ID,
          id: "volume_linear",
          label: "Lungime volum",
          value: meters,
          unit: "m",
          basis: "confirmed_perimeter",
        },
      ],
      [
        {
          componentId: VOLUME_COMPONENT_ID,
          resourceId: ALUMINIUM_RETURN_PROFILE_ID,
          quantity: meters,
          unit: "m",
        },
        {
          componentId: VOLUME_COMPONENT_ID,
          resourceId: RETURN_CANT_FORMING_ID,
          quantity: meters,
          unit: "m",
        },
      ],
    );
  },
};
