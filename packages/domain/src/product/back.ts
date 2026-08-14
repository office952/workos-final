import { FOREX_BACK_SHEET_ID } from "../resources/catalog.js";
import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import { squareMetersFromMm2 } from "./units.js";

export const BACK_COMPONENT_ID = "BACK";

const BACK_GAPS = ["Debitare CNC"] as const;

function backResult(
  status: ComponentCalculationResult["status"],
  quantities: ComponentCalculationResult["quantities"],
  requirements: ComponentCalculationResult["requirements"],
): ComponentCalculationResult {
  return {
    variantId: "BACK_FOREX_10MM",
    role: "BACK",
    status,
    quantities,
    requirements,
    unavailable: [...BACK_GAPS],
  };
}

export const backForex10mmContract: ComponentCalculationContract = {
  variantId: "BACK_FOREX_10MM",
  role: "BACK",
  profile: {
    measurement: "supplied_area_mm2",
    quantityUnit: "m2",
    independentCalculation: true,
    eic: "material",
    structuralGaps: BACK_GAPS,
  },
  collectMeasurements() {
    return [];
  },
  calculate(input: ComponentCalculationInput): ComponentCalculationResult {
    const areaMm2 = input.shared.confirmedAreaMm2;
    if (typeof areaMm2 !== "number") {
      return backResult("MISSING_MEASUREMENT", [], []);
    }
    const squareMeters = squareMetersFromMm2(areaMm2);
    return backResult(
      "CALCULATED",
      [
        {
          componentId: BACK_COMPONENT_ID,
          id: "back_area",
          label: "Suprafață spate",
          value: squareMeters,
          unit: "m2",
          basis: "confirmed_area",
        },
      ],
      [
        {
          componentId: BACK_COMPONENT_ID,
          resourceId: FOREX_BACK_SHEET_ID,
          quantity: squareMeters,
          unit: "m2",
        },
      ],
    );
  },
};
