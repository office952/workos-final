import type { ResourceRequirement } from "../resources/requirement.js";
import type { ComponentTechnicalSettingDefinition } from "./technicalSettings.js";
import type {
  ComponentCalculationStatus,
  ComponentRole,
  ComponentVariantId,
  DraftValues,
  TechnicalMeasurement,
  TechnicalQuantity,
} from "./types.js";

export type SharedCalculationContext = {
  confirmedAreaMm2?: number;
};

export type ComponentCalculationInput = {
  values: DraftValues;
  measurements: readonly TechnicalMeasurement[];
  shared: SharedCalculationContext;
  technicalSettings: readonly ComponentTechnicalSettingDefinition[];
};

export type ComponentCalculationResult = {
  variantId: ComponentVariantId;
  role: ComponentRole;
  status: ComponentCalculationStatus;
  quantities: readonly TechnicalQuantity[];
  requirements: readonly ResourceRequirement[];
  unavailable: readonly string[];
};

export type ComponentMeasurementKind =
  | "confirmed_area_mm2"
  | "confirmed_perimeter_mm"
  | "supplied_area_mm2"
  | "none";

export type ComponentEicReadiness = "material" | "material_and_operation" | "unavailable";

export type ComponentContractProfile = {
  measurement: ComponentMeasurementKind;
  quantityUnit: "m" | "m2" | null;
  independentCalculation: boolean;
  eic: ComponentEicReadiness;
  structuralGaps: readonly string[];
  resourceIds: readonly string[];
};

export type ComponentCalculationContract = {
  variantId: ComponentVariantId;
  role: ComponentRole;
  profile: ComponentContractProfile;
  collectMeasurements(values: DraftValues): TechnicalMeasurement[];
  calculate(input: ComponentCalculationInput): ComponentCalculationResult;
};
