import type {
  ComponentCalculationContract,
  ComponentCalculationResult,
} from "./componentContract.js";

export const LIGHTING_COMPONENT_ID = "LIGHTING";

const LIGHTING_UNAVAILABLE = [
  "Regula de pas LED nu este stabilită",
  "Regula de rezervă PSU nu este stabilită",
] as const;

export const lightingFrontLedContract: ComponentCalculationContract = {
  variantId: "LIGHTING_FRONT_LED",
  role: "LIGHTING",
  collectMeasurements() {
    return [];
  },
  calculate(): ComponentCalculationResult {
    return {
      variantId: "LIGHTING_FRONT_LED",
      role: "LIGHTING",
      status: "UNAVAILABLE",
      quantities: [],
      requirements: [],
      unavailable: [...LIGHTING_UNAVAILABLE],
    };
  },
};
