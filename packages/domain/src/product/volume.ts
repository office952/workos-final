import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import { deriveLettersVolumeApplicationId } from "../finishes/lettersVolume.js";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_651_ID,
} from "../resources/catalog.js";
import { resolveTypeResources } from "./componentTypes.js";
import {
  RETURN_WRAP_ALLOWANCE_SETTING_ID,
  resolvedSettingValue,
  type ComponentTechnicalSettingDefinition,
} from "./technicalSettings.js";
import type { DraftValues, TechnicalMeasurement } from "./types.js";
import { linearMetersFromMm, squareMetersFromMm2 } from "./units.js";

export const VOLUME_COMPONENT_ID = "VOLUME";
export const VOLUME_PERIMETER_FIELD = "volume.confirmedPerimeterMm";
export const VOLUME_MISSING_PERIMETER = "Perimetru volum neconfirmat";

export function volumeLinearMeters(perimeterMm: number): number {
  return linearMetersFromMm(perimeterMm);
}

function volumeResult(
  status: ComponentCalculationResult["status"],
  quantities: ComponentCalculationResult["quantities"],
  requirements: ComponentCalculationResult["requirements"],
  extraUnavailable: readonly string[] = [],
): ComponentCalculationResult {
  return {
    typeId: "ALUMINIUM_VOLUME",
    role: "VOLUME",
    status,
    quantities,
    requirements,
    unavailable: [...extraUnavailable],
  };
}

export const aluminiumVolumeContract: ComponentCalculationContract = {
  typeId: "ALUMINIUM_VOLUME",
  role: "VOLUME",
  profile: {
    measurement: "confirmed_perimeter_mm",
    quantityUnit: "m",
    independentCalculation: true,
    eic: "material_and_operation",
    structuralGaps: [],
  },
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
      return volumeResult("MISSING_MEASUREMENT", [], [], [VOLUME_MISSING_PERIMETER]);
    }
    const meters = volumeLinearMeters(perimeter.value);
    const depthMm = Number(input.values["volume.depthMm"]);
    const lateralArea =
      Number.isFinite(depthMm) && depthMm > 0 ? meters * (depthMm / 1000) : undefined;
    const resolutions = resolveTypeResources("ALUMINIUM_VOLUME", input.values);
    const requirements = [
      ...resolutions
        .filter((item) => item.status === "RESOLVED")
        .map((item) => ({
          componentId: VOLUME_COMPONENT_ID,
          resourceId: item.resourceId,
          quantity: meters,
          unit: "m" as const,
          ...(item.resourceId === ALUMINIUM_RETURN_PROFILE_ID &&
          Number.isFinite(depthMm) &&
          depthMm > 0
            ? { costQualifier: { volumeDepthMm: depthMm } }
            : {}),
        })),
      ...volumeFinishMaterialRequirements(
        input.values,
        perimeter.value,
        depthMm,
        lateralArea,
        input.technicalSettings,
      ),
    ];
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
        ...(lateralArea === undefined
          ? []
          : [
              {
                componentId: VOLUME_COMPONENT_ID,
                id: "volume_lateral",
                label: "Suprafață laterală volum",
                value: lateralArea,
                unit: "m2" as const,
                basis: "confirmed_perimeter" as const,
              },
            ]),
      ],
      requirements,
      [
        ...resolutions.flatMap((item) =>
          item.status === "UNRESOLVED" ? [item.reason] : [],
        ),
        ...volumeWrapUnavailable(input.values, input.technicalSettings),
      ],
    );
  },
};

function volumeFinishMaterialRequirements(
  values: DraftValues,
  perimeterMm: number,
  depthMm: number,
  lateralArea: number | undefined,
  technicalSettings: readonly ComponentTechnicalSettingDefinition[],
): ComponentCalculationResult["requirements"] {
  if (values["volume.finish"] === "vinyl" && lateralArea !== undefined) {
    return [
      {
        componentId: VOLUME_COMPONENT_ID,
        resourceId: MAT_VINYL_ORACAL_651_ID,
        quantity: lateralArea,
        unit: "m2",
      },
    ];
  }
  const applicationId = deriveLettersVolumeApplicationId(values);
  if (
    applicationId !== "return_letters_standard" &&
    applicationId !== "return_cant_volum_wrapping"
  ) {
    return [];
  }
  if (!Number.isFinite(depthMm) || depthMm <= 0) {
    return [];
  }
  const allowance = resolvedSettingValue(
    technicalSettings,
    RETURN_WRAP_ALLOWANCE_SETTING_ID,
  );
  if (allowance === undefined) {
    return [];
  }
  return [
    {
      componentId: VOLUME_COMPONENT_ID,
      resourceId:
        applicationId === "return_letters_standard"
          ? MAT_VINYL_ORACAL_641_ID
          : MAT_VINYL_ORACAL_651_ID,
      quantity: squareMetersFromMm2(perimeterMm * (depthMm + allowance)),
      unit: "m2",
    },
  ];
}

function volumeWrapUnavailable(
  values: DraftValues,
  technicalSettings: readonly ComponentTechnicalSettingDefinition[],
): string[] {
  const applicationId = deriveLettersVolumeApplicationId(values);
  if (
    applicationId !== "return_letters_standard" &&
    applicationId !== "return_cant_volum_wrapping"
  ) {
    return [];
  }
  const allowance = resolvedSettingValue(
    technicalSettings,
    RETURN_WRAP_ALLOWANCE_SETTING_ID,
  );
  if (allowance !== undefined) {
    return [];
  }
  const setting = technicalSettings.find(
    (item) => item.id === RETURN_WRAP_ALLOWANCE_SETTING_ID,
  );
  return [setting?.unresolvedReason ?? "Adaosul de înfășurare pe cant nu este stabilit"];
}
