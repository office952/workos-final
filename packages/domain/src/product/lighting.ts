import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  listVariantTechnicalSettings,
  unresolvedSettingReasons,
} from "./technicalSettings.js";

export const LIGHTING_COMPONENT_ID = "LIGHTING";

export const LIGHTING_REQUIRED_SETTING_IDS = [
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
] as const;

const LIGHTING_CALCULATION_NOT_AUTHORIZED =
  "Calculul de cantitate LED nu este autorizat încă";

function lightingGaps(
  settings: ComponentCalculationInput["technicalSettings"],
): string[] {
  return unresolvedSettingReasons(settings, LIGHTING_REQUIRED_SETTING_IDS);
}

export const lightingFrontLedContract: ComponentCalculationContract = {
  variantId: "LIGHTING_FRONT_LED",
  role: "LIGHTING",
  profile: {
    measurement: "none",
    quantityUnit: null,
    independentCalculation: true,
    eic: "unavailable",
    structuralGaps: lightingGaps(listVariantTechnicalSettings("LIGHTING_FRONT_LED")),
  },
  collectMeasurements() {
    return [];
  },
  calculate(input: ComponentCalculationInput): ComponentCalculationResult {
    const unavailable = lightingGaps(input.technicalSettings);
    return {
      variantId: "LIGHTING_FRONT_LED",
      role: "LIGHTING",
      status: "UNAVAILABLE",
      quantities: [],
      requirements: [],
      unavailable:
        unavailable.length > 0 ? unavailable : [LIGHTING_CALCULATION_NOT_AUTHORIZED],
    };
  },
};
