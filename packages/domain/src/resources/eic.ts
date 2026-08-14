import { RETURN_CANT_COMPONENT_ID } from "../product/returnCant.js";
import type { ProductAggregate } from "../product/types.js";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  RETURN_CANT_FORMING_ID,
  getCostEvidence,
  getResource,
} from "./catalog.js";

export type ResourceRequirement = {
  componentId: string;
  resourceId: string;
  quantity: number;
  unit: "m";
};

export type EicLine = {
  resourceId: string;
  label: string;
  quantity: number;
  unit: "m";
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
  const quantity = aggregate.quantities.find(
    (item) => item.componentId === RETURN_CANT_COMPONENT_ID,
  );
  if (!quantity) {
    return [];
  }
  return [
    {
      componentId: RETURN_CANT_COMPONENT_ID,
      resourceId: ALUMINIUM_RETURN_PROFILE_ID,
      quantity: quantity.value,
      unit: "m",
    },
    {
      componentId: RETURN_CANT_COMPONENT_ID,
      resourceId: RETURN_CANT_FORMING_ID,
      quantity: quantity.value,
      unit: "m",
    },
  ];
}

export function applyRequirement(requirement: ResourceRequirement): EicLine {
  const resource = getResource(requirement.resourceId);
  const evidence = getCostEvidence(requirement.resourceId);
  if (!resource || !evidence) {
    throw new Error(`Unknown resource ${requirement.resourceId}`);
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
  const lines: EicLine[] = resourceRequirements(aggregate).map(applyRequirement);

  return {
    completeness: "PARTIAL",
    currency: "EUR",
    lines,
    total: lines.reduce((sum, line) => sum + line.cost, 0),
    excludedComponentLabels: ["Față", "Spate", "Iluminare"],
  };
}
