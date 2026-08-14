import type { ProductAggregate } from "../product/types.js";
import { getCostEvidence, getResource, type ResourceUnit } from "./catalog.js";
import type { ResourceRequirement } from "./requirement.js";

export type { ResourceRequirement };

export type EicLine = {
  resourceId: string;
  label: string;
  quantity: number;
  unit: ResourceUnit;
  rate: number;
  currency: "EUR";
  cost: number;
};

export type EicResult = {
  completeness: "PARTIAL" | "COMPLETE";
  currency: "EUR";
  lines: readonly EicLine[];
  total: number;
  excludedComponentLabels: readonly string[];
};

export function resourceRequirements(
  aggregate: ProductAggregate,
): ResourceRequirement[] {
  return [...aggregate.requirements];
}

export function applyRequirement(requirement: ResourceRequirement): EicLine {
  const resource = getResource(requirement.resourceId);
  const evidence = getCostEvidence(requirement.resourceId);
  if (!resource || !evidence) {
    throw new Error(`Unknown resource ${requirement.resourceId}`);
  }
  if (requirement.unit !== resource.unit || requirement.unit !== evidence.perUnit) {
    throw new Error(`Unit mismatch for ${requirement.resourceId}`);
  }
  return {
    resourceId: requirement.resourceId,
    label: resource.label,
    quantity: requirement.quantity,
    unit: requirement.unit,
    rate: evidence.amount,
    currency: evidence.currency,
    cost: requirement.quantity * evidence.amount,
  };
}

export function compileEic(aggregate: ProductAggregate): EicResult {
  const requirements = resourceRequirements(aggregate);
  const lines: EicLine[] = requirements.map(applyRequirement);
  const excludedComponentLabels = aggregate.componentStatuses
    .filter((item) => item.status !== "CALCULATED")
    .map((item) => item.label);

  return {
    completeness: excludedComponentLabels.length === 0 ? "COMPLETE" : "PARTIAL",
    currency: "EUR",
    lines,
    total: lines.reduce((sum, line) => sum + line.cost, 0),
    excludedComponentLabels,
  };
}
