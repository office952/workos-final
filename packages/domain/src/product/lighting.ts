import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  listTypeTechnicalSettings,
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
  typeId: "LIGHTING_FRONT_LED",
  role: "LIGHTING",
  profile: {
    measurement: "none",
    quantityUnit: null,
    independentCalculation: true,
    eic: "unavailable",
    structuralGaps: lightingGaps(listTypeTechnicalSettings("LIGHTING_FRONT_LED")),
  },
  collectMeasurements() {
    return [];
  },
  calculate(input: ComponentCalculationInput): ComponentCalculationResult {
    const unavailable = lightingGaps(input.technicalSettings);
    return {
      typeId: "LIGHTING_FRONT_LED",
      role: "LIGHTING",
      status: "UNAVAILABLE",
      quantities: [],
      requirements: [],
      unavailable:
        unavailable.length > 0 ? unavailable : [LIGHTING_CALCULATION_NOT_AUTHORIZED],
    };
  },
};
