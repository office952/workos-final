import {
  getOperationalProcess,
  getProductionCapability,
  processesForCapability,
  type ProductionCapabilityClassId,
} from "../processes/catalog.js";
import { getCostEvidence } from "../resources/catalog.js";

export const RECIPE_GAP_STATES = [
  "CANONICAL_COST_EXISTS",
  "SERVICE_RECIPE_MISSING",
  "LABOR_RECIPE_MISSING",
  "RESOURCE_COST_MISSING",
  "NOT_APPLICABLE",
  "UNKNOWN",
] as const;
export type RecipeGapState = (typeof RECIPE_GAP_STATES)[number];

export type RecipeGapRow = {
  processId: string | null;
  processLabel: string | null;
  capabilityId: ProductionCapabilityClassId;
  capabilityLabel: string;
  state: RecipeGapState;
  stateLabel: string;
};

export function recipeGapLabel(state: RecipeGapState): string {
  switch (state) {
    case "CANONICAL_COST_EXISTS":
      return "Rețetă de cost canonică";
    case "SERVICE_RECIPE_MISSING":
      return "Rețetă de serviciu lipsește";
    case "LABOR_RECIPE_MISSING":
      return "Rețetă de labor lipsește";
    case "RESOURCE_COST_MISSING":
      return "Cost de resursă lipsește";
    case "NOT_APPLICABLE":
      return "Fără proces operațional încă";
    case "UNKNOWN":
      return "Necunoscut";
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

export function recipeGapForProcess(processId: string): RecipeGapState {
  const process = getOperationalProcess(processId);
  if (!process) {
    return "UNKNOWN";
  }
  if (process.resourceIds.length > 0) {
    const missing = process.resourceIds.some((resourceId) => !getCostEvidence(resourceId));
    return missing ? "RESOURCE_COST_MISSING" : "CANONICAL_COST_EXISTS";
  }
  const capability = getProductionCapability(process.requiredCapabilityId);
  if (!capability) {
    return "UNKNOWN";
  }
  switch (capability.kind) {
    case "HUMAN_SKILL":
      return "LABOR_RECIPE_MISSING";
    case "MACHINE":
    case "WORKSTATION":
      return "SERVICE_RECIPE_MISSING";
    default: {
      const _exhaustive: never = capability.kind;
      return _exhaustive;
    }
  }
}

export function recipeGapsForCapability(
  capabilityId: ProductionCapabilityClassId,
): readonly RecipeGapRow[] {
  const capability = getProductionCapability(capabilityId);
  const capabilityLabel = capability?.label ?? capabilityId;
  const processes = processesForCapability(capabilityId);
  if (processes.length === 0) {
    return [
      {
        processId: null,
        processLabel: null,
        capabilityId,
        capabilityLabel,
        state: "NOT_APPLICABLE",
        stateLabel: recipeGapLabel("NOT_APPLICABLE"),
      },
    ];
  }
  return processes.map((process) => {
    const state = recipeGapForProcess(process.id);
    return {
      processId: process.id,
      processLabel: process.label,
      capabilityId,
      capabilityLabel,
      state,
      stateLabel: recipeGapLabel(state),
    };
  });
}
