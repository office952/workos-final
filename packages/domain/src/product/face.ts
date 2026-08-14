import { PLEXIGLAS_FACE_SHEET_ID } from "../resources/catalog.js";
import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import type { DraftValues, TechnicalMeasurement } from "./types.js";
import { squareMetersFromMm2 } from "./units.js";

export const FACE_COMPONENT_ID = "FACE";
export const FACE_AREA_FIELD = "face.confirmedAreaMm2";

export function faceAreaSquareMeters(areaMm2: number): number {
  return squareMetersFromMm2(areaMm2);
}

function faceResult(
  status: ComponentCalculationResult["status"],
  quantities: ComponentCalculationResult["quantities"],
  requirements: ComponentCalculationResult["requirements"],
): ComponentCalculationResult {
  return {
    variantId: "FACE_PLEXIGLAS_3MM",
    role: "FACE",
    status,
    quantities,
    requirements,
    unavailable: ["Geometrie din Analyzer", "Debitare CNC"],
  };
}

export const facePlexiglas3mmContract: ComponentCalculationContract = {
  variantId: "FACE_PLEXIGLAS_3MM",
  role: "FACE",
  collectMeasurements(values: DraftValues): TechnicalMeasurement[] {
    const area = values[FACE_AREA_FIELD];
    if (typeof area !== "number") {
      return [];
    }
    return [
      {
        componentId: FACE_COMPONENT_ID,
        fieldId: FACE_AREA_FIELD,
        value: area,
        unit: "mm2",
        source: "OPERATOR_MANUAL",
        confirmed: true,
      },
    ];
  },
  calculate(input: ComponentCalculationInput): ComponentCalculationResult {
    const area = input.measurements.find(
      (item) => item.fieldId === FACE_AREA_FIELD,
    );
    if (!area) {
      return faceResult("MISSING_MEASUREMENT", [], []);
    }
    const squareMeters = faceAreaSquareMeters(area.value);
    return faceResult(
      "CALCULATED",
      [
        {
          componentId: FACE_COMPONENT_ID,
          id: "face_area",
          label: "Suprafață față",
          value: squareMeters,
          unit: "m2",
          basis: "confirmed_area",
        },
      ],
      [
        {
          componentId: FACE_COMPONENT_ID,
          resourceId: PLEXIGLAS_FACE_SHEET_ID,
          quantity: squareMeters,
          unit: "m2",
        },
      ],
    );
  },
};
