export type ResourceKind = "material" | "operation";

export type ResourceDefinition = {
  id: string;
  label: string;
  kind: ResourceKind;
  unit: "m";
};

export type CostEvidence = {
  resourceId: string;
  amount: number;
  currency: "EUR";
  perUnit: "m";
  source: "PILOT_INTERNAL_EVIDENCE";
  classification: "AI_DECISION";
  note: string;
};

export const ALUMINIUM_RETURN_PROFILE_ID = "aluminium_return_profile";
export const RETURN_CANT_FORMING_ID = "return_cant_forming";

export const resourceCatalog: readonly ResourceDefinition[] = [
  {
    id: ALUMINIUM_RETURN_PROFILE_ID,
    label: "Profil aluminiu cant",
    kind: "material",
    unit: "m",
  },
  {
    id: RETURN_CANT_FORMING_ID,
    label: "Formare cant",
    kind: "operation",
    unit: "m",
  },
];

export const costEvidence: readonly CostEvidence[] = [
  {
    resourceId: ALUMINIUM_RETURN_PROFILE_ID,
    amount: 10,
    currency: "EUR",
    perUnit: "m",
    source: "PILOT_INTERNAL_EVIDENCE",
    classification: "AI_DECISION",
    note: "Legacy material acquisition rate was not a confirmed authority. Pilot internal evidence for EIC only, not a customer price.",
  },
  {
    resourceId: RETURN_CANT_FORMING_ID,
    amount: 15,
    currency: "EUR",
    perUnit: "m",
    source: "PILOT_INTERNAL_EVIDENCE",
    classification: "AI_DECISION",
    note: "Legacy modelare_cant line had a null commercial rate. Pilot internal forming evidence for EIC only.",
  },
];

export function getResource(id: string): ResourceDefinition | undefined {
  return resourceCatalog.find((item) => item.id === id);
}

export function getCostEvidence(resourceId: string): CostEvidence | undefined {
  return costEvidence.find((item) => item.resourceId === resourceId);
}
