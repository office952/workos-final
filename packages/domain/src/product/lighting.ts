import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
  ComponentInspectionLine,
} from "./componentContract.js";
import {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  listTypeTechnicalSettings,
  resolvedSettingValue,
  unresolvedSettingReasons,
} from "./technicalSettings.js";

export const LIGHTING_COMPONENT_ID = "LIGHTING";

export const LIGHTING_REQUIRED_SETTING_IDS = [
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
] as const;

export const LIGHTING_MISSING_LED_GEOMETRY =
  "Cantitatea de module LED nu poate fi calculată: pasul LED nu are o bază geometrică confirmată";
export const LIGHTING_MISSING_LED_LOAD =
  "Sarcina LED nu poate fi calculată: lipsesc cantitatea de module și puterea pe modul";
export const LIGHTING_MISSING_PSU_CAPACITY =
  "Capacitatea minimă a sursei nu poate fi calculată: sarcina LED nu este cunoscută";
export const LIGHTING_MISSING_PSU_SELECTION =
  "Selecția fizică a sursei nu este disponibilă: nu există catalog canonic de PSU";

export const LIGHTING_CALCULATION_INPUTS: readonly ComponentInspectionLine[] = [
  {
    label: "Bază geometrică module LED",
    value: "Lipsește. Pasul LED nu se aplică pe perimetru sau suprafață fără contract confirmat.",
  },
  {
    label: "Putere pe modul LED",
    value: "Lipsește. Nu există specificație canonică de resursă.",
  },
  {
    label: "Sarcină LED totală",
    value: "Lipsește. Depinde de cantitate și de puterea pe modul.",
  },
];

export const LIGHTING_CALCULATION_RESULTS: readonly ComponentInspectionLine[] = [
  { label: "Cantitate module LED", value: "Indisponibil" },
  { label: "Sarcină LED", value: "Indisponibil" },
  {
    label: "Capacitate minimă sursă",
    value: "Indisponibil. Se calculează din sarcina LED și rezerva tehnică.",
  },
  {
    label: "Selecție fizică sursă",
    value: "Indisponibil. Nu există catalog canonic de PSU.",
  },
];

const LIGHTING_MISSING_PREREQUISITES = [
  LIGHTING_MISSING_LED_GEOMETRY,
  LIGHTING_MISSING_LED_LOAD,
  LIGHTING_MISSING_PSU_CAPACITY,
  LIGHTING_MISSING_PSU_SELECTION,
] as const;

export function requiredPsuCapacityW(
  totalLedLoadW: number,
  psuReservePercent: number,
): number {
  if (!Number.isFinite(totalLedLoadW) || totalLedLoadW < 0) {
    throw new Error("totalLedLoadW must be a finite non-negative number");
  }
  if (!Number.isFinite(psuReservePercent) || psuReservePercent < 0) {
    throw new Error("psuReservePercent must be a finite non-negative number");
  }
  return totalLedLoadW * (1 + psuReservePercent / 100);
}

function lightingSettingGaps(
  settings: ComponentCalculationInput["technicalSettings"],
): string[] {
  return unresolvedSettingReasons(settings, LIGHTING_REQUIRED_SETTING_IDS);
}

function lightingUnavailable(
  knownLedLoadW: number | undefined,
): string[] {
  if (knownLedLoadW === undefined) {
    return [...LIGHTING_MISSING_PREREQUISITES];
  }
  return [
    LIGHTING_MISSING_LED_GEOMETRY,
    LIGHTING_MISSING_LED_LOAD,
    LIGHTING_MISSING_PSU_SELECTION,
  ];
}

export const lightingFrontLedContract: ComponentCalculationContract = {
  typeId: "LIGHTING_FRONT_LED",
  role: "LIGHTING",
  profile: {
    measurement: "none",
    quantityUnit: null,
    independentCalculation: true,
    eic: "unavailable",
    structuralGaps: [
      ...lightingSettingGaps(listTypeTechnicalSettings("LIGHTING_FRONT_LED")),
      ...LIGHTING_MISSING_PREREQUISITES,
    ],
    calculationInputs: LIGHTING_CALCULATION_INPUTS,
    calculationResults: LIGHTING_CALCULATION_RESULTS,
  },
  collectMeasurements() {
    return [];
  },
  calculate(input: ComponentCalculationInput): ComponentCalculationResult {
    const settingGaps = lightingSettingGaps(input.technicalSettings);
    if (settingGaps.length > 0) {
      return {
        typeId: "LIGHTING_FRONT_LED",
        role: "LIGHTING",
        status: "UNAVAILABLE",
        quantities: [],
        requirements: [],
        unavailable: settingGaps,
      };
    }

    const reservePercent = resolvedSettingValue(
      input.technicalSettings,
      PSU_RESERVE_SETTING_ID,
    );
    if (reservePercent === undefined) {
      throw new Error("lighting reserve setting passed gap check without a resolved value");
    }

    const knownLedLoadW = input.shared.totalLedLoadW;
    const quantities =
      knownLedLoadW === undefined
        ? []
        : [
            {
              componentId: LIGHTING_COMPONENT_ID,
              id: "minimumRequiredPsuCapacityW",
              label: "Capacitate minimă sursă",
              value: requiredPsuCapacityW(knownLedLoadW, reservePercent),
              unit: "W" as const,
              basis: "calculated_from_settings" as const,
            },
          ];

    return {
      typeId: "LIGHTING_FRONT_LED",
      role: "LIGHTING",
      status: "PARTIAL",
      quantities,
      requirements: [],
      unavailable: lightingUnavailable(knownLedLoadW),
    };
  },
};
