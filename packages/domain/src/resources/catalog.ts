export const RESOURCE_KINDS = ["MATERIAL", "SERVICE"] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export const MATERIAL_FAMILY_IDS = ["PLEXIGLAS", "FOREX", "ALUMINIUM", "LED"] as const;
export type MaterialFamilyId = (typeof MATERIAL_FAMILY_IDS)[number];

export type ResourceUnit = "m" | "m2" | "buc";
export type MaterialForm = "sheet" | "profile";

export type ElectricalSpecification = {
  voltageV: number;
  capacityW?: number;
};

export type MaterialFamily = {
  id: MaterialFamilyId;
  label: string;
  description: string;
};

export type MaterialSpecification = {
  familyId: MaterialFamilyId;
  form: MaterialForm;
  thicknessMm?: number;
  opticalType?: "opal";
};

export type ResourceDefinition = {
  id: string;
  label: string;
  kind: ResourceKind;
  unit: ResourceUnit;
  familyId?: MaterialFamilyId;
  specification?: MaterialSpecification;
  electrical?: ElectricalSpecification;
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

export const PLEXIGLAS_3MM_OPAL_ID = "plexiglas_3mm_opal";
export const FOREX_10MM_ID = "forex_10mm";
export const ALUMINIUM_RETURN_PROFILE_ID = "aluminium_return_profile";
export const RETURN_CANT_FORMING_ID = "return_cant_forming";
export const MAT_LED_MODULE_ID = "MAT-LED-MODULE";
export const MAT_LED_PSU_12V_60W_ID = "MAT-LED-PSU-12V-60W";
export const MAT_LED_PSU_12V_100W_ID = "MAT-LED-PSU-12V-100W";
export const MAT_LED_PSU_12V_160W_ID = "MAT-LED-PSU-12V-160W";
export const MAT_LED_PSU_12V_200W_ID = "MAT-LED-PSU-12V-200W";

export const materialFamilies: readonly MaterialFamily[] = [
  {
    id: "PLEXIGLAS",
    label: "Plexiglas",
    description: "Familie de foi PMMA. Grosimea și proprietatea optică sunt specificație, nu familia.",
  },
  {
    id: "FOREX",
    label: "Forex",
    description: "Familie de foi PVC expandat. Grosimea este specificație.",
  },
  {
    id: "ALUMINIUM",
    label: "Aluminiu",
    description: "Familie de aluminiu. Tabla, profilul și grosimea sunt specificație.",
  },
  {
    id: "LED",
    label: "Iluminare LED",
    description:
      "Module LED și surse 12V. Puterea pe modul este setare tehnică; capacitatea sursei este specificație de resursă.",
  },
];

export const resourceCatalog: readonly ResourceDefinition[] = [
  {
    id: PLEXIGLAS_3MM_OPAL_ID,
    label: "Plexiglas 3 mm opal",
    kind: "MATERIAL",
    unit: "m2",
    familyId: "PLEXIGLAS",
    specification: {
      familyId: "PLEXIGLAS",
      form: "sheet",
      thicknessMm: 3,
      opticalType: "opal",
    },
  },
  {
    id: FOREX_10MM_ID,
    label: "Forex 10 mm",
    kind: "MATERIAL",
    unit: "m2",
    familyId: "FOREX",
    specification: {
      familyId: "FOREX",
      form: "sheet",
      thicknessMm: 10,
    },
  },
  {
    id: ALUMINIUM_RETURN_PROFILE_ID,
    label: "Profil aluminiu 0,6 mm",
    kind: "MATERIAL",
    unit: "m",
    familyId: "ALUMINIUM",
    specification: {
      familyId: "ALUMINIUM",
      form: "profile",
      thicknessMm: 0.6,
    },
  },
  {
    id: RETURN_CANT_FORMING_ID,
    label: "Formare profil aluminiu",
    kind: "SERVICE",
    unit: "m",
  },
  {
    id: MAT_LED_MODULE_ID,
    label: "Modul LED 12V",
    kind: "MATERIAL",
    unit: "buc",
    familyId: "LED",
    electrical: { voltageV: 12 },
  },
  {
    id: MAT_LED_PSU_12V_60W_ID,
    label: "Sursă LED 12V 60W",
    kind: "MATERIAL",
    unit: "buc",
    familyId: "LED",
    electrical: { voltageV: 12, capacityW: 60 },
  },
  {
    id: MAT_LED_PSU_12V_100W_ID,
    label: "Sursă LED 12V 100W",
    kind: "MATERIAL",
    unit: "buc",
    familyId: "LED",
    electrical: { voltageV: 12, capacityW: 100 },
  },
  {
    id: MAT_LED_PSU_12V_160W_ID,
    label: "Sursă LED 12V 160W",
    kind: "MATERIAL",
    unit: "buc",
    familyId: "LED",
    electrical: { voltageV: 12, capacityW: 160 },
  },
  {
    id: MAT_LED_PSU_12V_200W_ID,
    label: "Sursă LED 12V 200W",
    kind: "MATERIAL",
    unit: "buc",
    familyId: "LED",
    electrical: { voltageV: 12, capacityW: 200 },
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
    note: "Service/process cost for forming aluminium profile. Not a physical material. Not an exact match to RETURN_PROFILE_MACHINE_FORMING 5 EUR/ml. Keep temporarily.",
  },
  {
    resourceId: PLEXIGLAS_3MM_OPAL_ID,
    amount: 16,
    currency: "EUR",
    perUnit: "m2",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Legacy MAT-ACP-FATA-LITERE: plexiglas 3 mm PMMA opal = 16 EUR/mp purchase, no markup. Waste not folded into unit cost.",
  },
  {
    resourceId: FOREX_10MM_ID,
    amount: 16,
    currency: "EUR",
    perUnit: "m2",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Legacy MAT-SPATE-PVC-LITERE: Forex 10 mm = 16 EUR/mp purchase, no markup. Waste not folded into unit cost.",
  },
  {
    resourceId: MAT_LED_MODULE_ID,
    amount: 0.5,
    currency: "EUR",
    perUnit: "buc",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Default de dezvoltare din evidența owner 0,5 EUR/buc. De calibrat ulterior pe achiziția reală de atelier.",
  },
  {
    resourceId: MAT_LED_PSU_12V_60W_ID,
    amount: 12,
    currency: "EUR",
    perUnit: "buc",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Default de dezvoltare din catalogul owner 12 EUR/buc. De calibrat ulterior.",
  },
  {
    resourceId: MAT_LED_PSU_12V_100W_ID,
    amount: 16,
    currency: "EUR",
    perUnit: "buc",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Default de dezvoltare din catalogul owner 16 EUR/buc. De calibrat ulterior.",
  },
  {
    resourceId: MAT_LED_PSU_12V_160W_ID,
    amount: 20,
    currency: "EUR",
    perUnit: "buc",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Default de dezvoltare din catalogul owner 20 EUR/buc. De calibrat ulterior.",
  },
  {
    resourceId: MAT_LED_PSU_12V_200W_ID,
    amount: 40,
    currency: "EUR",
    perUnit: "buc",
    source: "OWNER_CONFIRMED_PURCHASE",
    classification: "OWNER_CONFIRMED",
    note: "Default de dezvoltare din catalogul owner 40 EUR/buc. De calibrat ulterior.",
  },
];

export function getMaterialFamily(id: string): MaterialFamily | undefined {
  return materialFamilies.find((item) => item.id === id);
}

export function getResource(id: string): ResourceDefinition | undefined {
  return resourceCatalog.find((item) => item.id === id);
}

export function getCostEvidence(resourceId: string): CostEvidence | undefined {
  return costEvidence.find((item) => item.resourceId === resourceId);
}

export function listMaterialSpecifications(
  familyId: MaterialFamilyId,
): ResourceDefinition[] {
  return resourceCatalog.filter(
    (item) => item.kind === "MATERIAL" && item.familyId === familyId,
  );
}

export function listServiceResources(): ResourceDefinition[] {
  return resourceCatalog.filter((item) => item.kind === "SERVICE");
}

export type PsuCapacityEntry = {
  resourceId: string;
  label: string;
  capacityW: number;
  voltageV: number;
};

export function listPsuCapacityCatalog(): readonly PsuCapacityEntry[] {
  return resourceCatalog.flatMap((item) => {
    const capacityW = item.electrical?.capacityW;
    if (capacityW === undefined || item.electrical === undefined) {
      return [];
    }
    return [
      {
        resourceId: item.id,
        label: item.label,
        capacityW,
        voltageV: item.electrical.voltageV,
      },
    ];
  });
}

export function matchMaterialSpecification(
  familyId: MaterialFamilyId,
  query: {
    thicknessMm?: number;
    opticalType?: "opal";
    form?: MaterialForm;
  },
): ResourceDefinition | undefined {
  return matchMaterialSpecificationIn(resourceCatalog, familyId, query);
}

export function matchMaterialSpecificationIn(
  catalog: readonly ResourceDefinition[],
  familyId: MaterialFamilyId,
  query: {
    thicknessMm?: number;
    opticalType?: "opal";
    form?: MaterialForm;
  },
): ResourceDefinition | undefined {
  return catalog.find((item) => {
    if (item.kind !== "MATERIAL" || item.familyId !== familyId) {
      return false;
    }
    const spec = item.specification;
    if (!spec) {
      return false;
    }
    if (query.thicknessMm !== undefined && spec.thicknessMm !== query.thicknessMm) {
      return false;
    }
    if (query.opticalType !== undefined && spec.opticalType !== query.opticalType) {
      return false;
    }
    if (query.form !== undefined && spec.form !== query.form) {
      return false;
    }
    return true;
  });
}

export function resourceKindLabel(kind: ResourceKind): string {
  switch (kind) {
    case "MATERIAL":
      return "Material";
    case "SERVICE":
      return "Serviciu";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function resourceUnitLabel(unit: ResourceUnit): string {
  switch (unit) {
    case "m":
      return "m";
    case "m2":
      return "m²";
    case "buc":
      return "buc";
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function costSourceLabel(source: CostEvidence["source"]): string {
  switch (source) {
    case "PILOT_INTERNAL_EVIDENCE":
      return "Evidență internă de pilot";
    case "OWNER_CONFIRMED_PURCHASE":
      return "Achiziție confirmată de owner";
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}

export function costClassificationLabel(
  classification: CostEvidence["classification"],
): string {
  switch (classification) {
    case "AI_DECISION":
      return "Decizie AI / pilot";
    case "OWNER_CONFIRMED":
      return "Confirmat de owner";
    default: {
      const _exhaustive: never = classification;
      return _exhaustive;
    }
  }
}
