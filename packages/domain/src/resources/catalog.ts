export type ResourceKind = "material" | "operation";
export type ResourceUnit = "m" | "m2";

export type ResourceDefinition = {
  id: string;
  label: string;
  kind: ResourceKind;
  unit: ResourceUnit;
};

export type CostEvidence = {
  resourceId: string;
  amount: number;
  currency: "EUR";
  perUnit: ResourceUnit;
  source: "PILOT_INTERNAL_EVIDENCE" | "OWNER_CONFIRMED_PURCHASE";
  classification: "AI_DECISION" | "OWNER_CONFIRMED";
  note: string;
};

export const ALUMINIUM_RETURN_PROFILE_ID = "aluminium_return_profile";
export const RETURN_CANT_FORMING_ID = "return_cant_forming";
export const PLEXIGLAS_FACE_SHEET_ID = "plexiglas_face_3mm";
export const FOREX_BACK_SHEET_ID = "forex_back_10mm";

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
  {
    id: PLEXIGLAS_FACE_SHEET_ID,
    label: "Plexiglas față 3 mm",
    kind: "material",
    unit: "m2",
  },
  {
    id: FOREX_BACK_SHEET_ID,
    label: "Forex spate 10 mm",
    kind: "material",
    unit: "m2",
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
    note: "Generic return profile is not the same identity as depth-specific MAT-PROFIL-LATERAL-LITERE-60MM. Keep temporarily.",
  },
  {
    resourceId: RETURN_CANT_FORMING_ID,
    amount: 15,
    currency: "EUR",
    perUnit: "m",
    source: "PILOT_INTERNAL_EVIDENCE",
    classification: "AI_DECISION",
    note: "Generic forming is not an exact match to RETURN_PROFILE_MACHINE_FORMING 5 EUR/ml. Keep temporarily.",
  },
  {
    resourceId: PLEXIGLAS_FACE_SHEET_ID,
    amount: 16,
    currency: "EUR",
    perUnit: "m2",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Legacy MAT-ACP-FATA-LITERE: plexiglas 3 mm PMMA opal = 16 EUR/mp purchase, no markup. Waste not folded into unit cost.",
  },
  {
    resourceId: FOREX_BACK_SHEET_ID,
    amount: 16,
    currency: "EUR",
    perUnit: "m2",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Legacy MAT-SPATE-PVC-LITERE: Forex 10 mm = 16 EUR/mp purchase, no markup. Waste not folded into unit cost.",
  },
];

export function getResource(id: string): ResourceDefinition | undefined {
  return resourceCatalog.find((item) => item.id === id);
}

export function getCostEvidence(resourceId: string): CostEvidence | undefined {
  return costEvidence.find((item) => item.resourceId === resourceId);
}
