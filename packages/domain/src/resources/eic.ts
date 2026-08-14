import { BACK_COMPONENT_ID } from "../product/back.js";
import { FACE_COMPONENT_ID } from "../product/face.js";
import { RETURN_CANT_COMPONENT_ID } from "../product/returnCant.js";
import type { ProductAggregate } from "../product/types.js";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  FOREX_BACK_SHEET_ID,
  PLEXIGLAS_FACE_SHEET_ID,
  RETURN_CANT_FORMING_ID,
  getCostEvidence,
  getResource,
  type ResourceUnit,
} from "./catalog.js";

export type ResourceRequirement = {
  componentId: string;
  resourceId: string;
  quantity: number;
  unit: ResourceUnit;
};

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

const COMPONENT_LABELS: Record<string, string> = {
  FACE: "Față",
  RETURN_CANT: "Cant",
  BACK: "Spate",
  LIGHTING: "Iluminare",
};

export function resourceRequirements(
  aggregate: ProductAggregate,
): ResourceRequirement[] {
  const requirements: ResourceRequirement[] = [];

  const returnQty = aggregate.quantities.find(
    (item) => item.componentId === RETURN_CANT_COMPONENT_ID,
  );
  if (returnQty) {
    requirements.push(
      {
        componentId: RETURN_CANT_COMPONENT_ID,
        resourceId: ALUMINIUM_RETURN_PROFILE_ID,
        quantity: returnQty.value,
        unit: "m",
      },
      {
        componentId: RETURN_CANT_COMPONENT_ID,
        resourceId: RETURN_CANT_FORMING_ID,
        quantity: returnQty.value,
        unit: "m",
      },
    );
  }

  const faceQty = aggregate.quantities.find(
    (item) => item.componentId === FACE_COMPONENT_ID,
  );
  if (faceQty) {
    requirements.push({
      componentId: FACE_COMPONENT_ID,
      resourceId: PLEXIGLAS_FACE_SHEET_ID,
      quantity: faceQty.value,
      unit: "m2",
    });
  }

  const backQty = aggregate.quantities.find(
    (item) => item.componentId === BACK_COMPONENT_ID,
  );
  if (backQty) {
    requirements.push({
      componentId: BACK_COMPONENT_ID,
      resourceId: FOREX_BACK_SHEET_ID,
      quantity: backQty.value,
      unit: "m2",
    });
  }

  return requirements;
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
  const requirements = resourceRequirements(aggregate);
  const lines: EicLine[] = requirements.map(applyRequirement);
  const covered = new Set(requirements.map((item) => item.componentId));
  const excludedComponentLabels = ["FACE", "RETURN_CANT", "BACK", "LIGHTING"]
    .filter((id) => !covered.has(id))
    .map((id) => COMPONENT_LABELS[id] ?? id);

  return {
    completeness: excludedComponentLabels.length === 0 ? "COMPLETE" : "PARTIAL",
    currency: "EUR",
    lines,
    total: lines.reduce((sum, line) => sum + line.cost, 0),
    excludedComponentLabels,
  };
}
