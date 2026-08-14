import type {
  ComponentCalculationContract,
  ComponentCalculationInput,
  ComponentCalculationResult,
} from "./componentContract.js";
import { resolveTypeResources } from "./componentTypes.js";
import type { DraftValues, TechnicalMeasurement } from "./types.js";
import { linearMetersFromMm } from "./units.js";

export const VOLUME_COMPONENT_ID = "VOLUME";
export const VOLUME_PERIMETER_FIELD = "volume.confirmedPerimeterMm";

export function volumeLinearMeters(perimeterMm: number): number {
  return linearMetersFromMm(perimeterMm);
}

const VOLUME_GAPS = ["Geometrie din Analyzer"] as const;

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
    unavailable: [...VOLUME_GAPS, ...extraUnavailable],
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
    structuralGaps: VOLUME_GAPS,
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
      return volumeResult("MISSING_MEASUREMENT", [], []);
    }
    const meters = volumeLinearMeters(perimeter.value);
    const resolutions = resolveTypeResources("ALUMINIUM_VOLUME", input.values);
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
      resolutions
        .filter((item) => item.status === "RESOLVED")
        .map((item) => ({
          componentId: VOLUME_COMPONENT_ID,
          resourceId: item.resourceId,
          quantity: meters,
          unit: "m" as const,
        })),
      resolutions.flatMap((item) =>
        item.status === "UNRESOLVED" ? [item.reason] : [],
      ),
    );
  },
};
