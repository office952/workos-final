import type { ResourceRequirement } from "../resources/requirement.js";
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
};

export type ComponentCalculationResult = {
  variantId: ComponentVariantId;
  role: ComponentRole;
  status: ComponentCalculationStatus;
  quantities: readonly TechnicalQuantity[];
  requirements: readonly ResourceRequirement[];
  unavailable: readonly string[];
};

export type ComponentCalculationContract = {
  variantId: ComponentVariantId;
  role: ComponentRole;
  collectMeasurements(values: DraftValues): TechnicalMeasurement[];
  calculate(input: ComponentCalculationInput): ComponentCalculationResult;
};
