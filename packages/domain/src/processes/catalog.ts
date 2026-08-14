import type { ComponentTypeId } from "../product/types.js";
import { RETURN_CANT_FORMING_ID } from "../resources/catalog.js";

export const PROCESS_CATEGORIES = [
  "CUTTING",
  "FORMING",
  "FINISHING",
  "ASSEMBLY",
  "ELECTRICAL",
] as const;
export type ProcessCategory = (typeof PROCESS_CATEGORIES)[number];

export const PROCESS_LIFECYCLES = ["ACTIVE", "PLANNED", "RETIRED"] as const;
export type ProcessLifecycle = (typeof PROCESS_LIFECYCLES)[number];

export const PROCESS_READINESS = [
  "IMPLEMENTED_PROCESS_FOUNDATION",
  "KNOWN_PROCESS",
  "PLANNED",
  "BLOCKED",
] as const;
export type ProcessReadiness = (typeof PROCESS_READINESS)[number];

export const PRODUCTION_CAPABILITY_CLASS_IDS = [
  "CNC_ROUTING",
  "PROFILE_FORMING",
  "MANUAL_ASSEMBLY",
  "VINYL_APPLICATION",
  "ELECTRICAL_ASSEMBLY",
] as const;
export type ProductionCapabilityClassId =
  (typeof PRODUCTION_CAPABILITY_CLASS_IDS)[number];

export const PRODUCTION_CAPABILITY_KINDS = [
  "MACHINE",
  "WORKSTATION",
  "HUMAN_SKILL",
] as const;
export type ProductionCapabilityKind = (typeof PRODUCTION_CAPABILITY_KINDS)[number];

export type ProductionCapabilityClass = {
  id: ProductionCapabilityClassId;
  label: string;
  description: string;
  kind: ProductionCapabilityKind;
};

export type OperationalProcess = {
  id: string;
  label: string;
  description: string;
  category: ProcessCategory;
  requiredCapabilityId: ProductionCapabilityClassId;
  applicableTypeIds: readonly ComponentTypeId[];
  outcome: string;
  resourceIds: readonly string[];
  lifecycle: ProcessLifecycle;
  readiness: ProcessReadiness;
  readinessNote: string;
};

export const CUT_SHEET_CNC_ID = "CUT_SHEET_CNC";
export const FORM_ALUMINIUM_PROFILE_ID = "FORM_ALUMINIUM_PROFILE";
export const APPLY_SURFACE_FINISH_ID = "APPLY_SURFACE_FINISH";
export const BOND_LETTER_BODY_ID = "BOND_LETTER_BODY";
export const PLACE_LED_MODULES_ID = "PLACE_LED_MODULES";

export const productionCapabilityClasses: readonly ProductionCapabilityClass[] = [
  {
    id: "CNC_ROUTING",
    label: "Debitare CNC",
    description: "Stație/utilaj care debitează foi. Nu este un utilaj concret.",
    kind: "MACHINE",
  },
  {
    id: "PROFILE_FORMING",
    label: "Formare profil",
    description: "Stație/utilaj care formează profilul de aluminiu. Nu este un utilaj concret.",
    kind: "MACHINE",
  },
  {
    id: "MANUAL_ASSEMBLY",
    label: "Asamblare manuală",
    description: "Capabilitate de atelier / îndemânare umană. Nu este un angajat.",
    kind: "HUMAN_SKILL",
  },
  {
    id: "VINYL_APPLICATION",
    label: "Aplicare folie",
    description: "Capabilitate de aplicare finisaj. Nu este un angajat.",
    kind: "HUMAN_SKILL",
  },
  {
    id: "ELECTRICAL_ASSEMBLY",
    label: "Asamblare electrică",
    description: "Post de lucru pentru montaj electric. Nu este un utilaj concret.",
    kind: "WORKSTATION",
  },
];

export const operationalProcesses: readonly OperationalProcess[] = [
  {
    id: CUT_SHEET_CNC_ID,
    label: "Debitare foaie CNC",
    description:
      "Debitare CNC a foii. Același proces servește față Plexiglas și spate Forex. Fără model de utilaj.",
    category: "CUTTING",
    requiredCapabilityId: "CNC_ROUTING",
    applicableTypeIds: ["PLEXIGLAS_FACE", "FOREX_BACK"],
    outcome: "Geometrie debitată",
    resourceIds: [],
    lifecycle: "PLANNED",
    readiness: "KNOWN_PROCESS",
    readinessNote:
      "Cunoscut din golurile actuale de debitare CNC. Fără preț CNC și fără geometrie de debitare în acest build.",
  },
  {
    id: FORM_ALUMINIUM_PROFILE_ID,
    label: "Formare profil aluminiu",
    description:
      "Cum se formează profilul de volum. Consumă evidența de cost a serviciului, dar nu este rândul de preț.",
    category: "FORMING",
    requiredCapabilityId: "PROFILE_FORMING",
    applicableTypeIds: ["ALUMINIUM_VOLUME"],
    outcome: "Profil de aluminiu format",
    resourceIds: [RETURN_CANT_FORMING_ID],
    lifecycle: "ACTIVE",
    readiness: "IMPLEMENTED_PROCESS_FOUNDATION",
    readinessNote:
      "Identitate de proces stabilă, legată de serviciul return_cant_forming. Fără execuție și fără utilaj concret.",
  },
  {
    id: APPLY_SURFACE_FINISH_ID,
    label: "Aplicare finisaj",
    description:
      "Aplicare de finisaj pe suprafață când comanda alege un finisaj. Reutilizabil pe față și volum.",
    category: "FINISHING",
    requiredCapabilityId: "VINYL_APPLICATION",
    applicableTypeIds: ["PLEXIGLAS_FACE", "ALUMINIUM_VOLUME"],
    outcome: "Suprafață finisată",
    resourceIds: [],
    lifecycle: "PLANNED",
    readiness: "PLANNED",
    readinessNote:
      "Finisajul există ca configurație de comandă. Rețeta de serviciu/labor nu este modelată.",
  },
  {
    id: BOND_LETTER_BODY_ID,
    label: "Lipire față-volum",
    description:
      "Asamblare manuală a corpului. Fără angajat numit. Compunerea de produs decide mai târziu dependențele.",
    category: "ASSEMBLY",
    requiredCapabilityId: "MANUAL_ASSEMBLY",
    applicableTypeIds: ["PLEXIGLAS_FACE", "ALUMINIUM_VOLUME"],
    outcome: "Corp de literă asamblat",
    resourceIds: [],
    lifecycle: "PLANNED",
    readiness: "PLANNED",
    readinessNote: "Identitate de proces manual. Fără rețetă de labor și fără Pontaj.",
  },
  {
    id: PLACE_LED_MODULES_ID,
    label: "Montare module LED",
    description:
      "Montaj electric al modulelor LED. Blocat până când iluminarea este calculabilă.",
    category: "ELECTRICAL",
    requiredCapabilityId: "ELECTRICAL_ASSEMBLY",
    applicableTypeIds: ["LIGHTING_FRONT_LED"],
    outcome: "Module LED montate",
    resourceIds: [],
    lifecycle: "PLANNED",
    readiness: "BLOCKED",
    readinessNote:
      "Iluminarea rămâne incompletă: rezerva PSU nu este decisă. Procesul este rezervat, nu executabil.",
  },
];

export function getProductionCapability(
  id: string,
): ProductionCapabilityClass | undefined {
  return productionCapabilityClasses.find((item) => item.id === id);
}

export function getOperationalProcess(id: string): OperationalProcess | undefined {
  return operationalProcesses.find((item) => item.id === id);
}

export function processesForType(typeId: ComponentTypeId): OperationalProcess[] {
  return operationalProcesses.filter((item) =>
    item.applicableTypeIds.includes(typeId),
  );
}

export function processesForCapability(
  capabilityId: ProductionCapabilityClassId,
): OperationalProcess[] {
  return operationalProcesses.filter(
    (item) => item.requiredCapabilityId === capabilityId,
  );
}

export function processesForCategory(category: ProcessCategory): OperationalProcess[] {
  return operationalProcesses.filter((item) => item.category === category);
}

export function processCategoryLabel(category: ProcessCategory): string {
  switch (category) {
    case "CUTTING":
      return "Debitare";
    case "FORMING":
      return "Formare";
    case "FINISHING":
      return "Finisare";
    case "ASSEMBLY":
      return "Asamblare";
    case "ELECTRICAL":
      return "Electric";
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

export function processLifecycleLabel(lifecycle: ProcessLifecycle): string {
  switch (lifecycle) {
    case "ACTIVE":
      return "Activ";
    case "PLANNED":
      return "Planificat";
    case "RETIRED":
      return "Retras";
    default: {
      const _exhaustive: never = lifecycle;
      return _exhaustive;
    }
  }
}

export function processReadinessLabel(readiness: ProcessReadiness): string {
  switch (readiness) {
    case "IMPLEMENTED_PROCESS_FOUNDATION":
      return "Fundație de proces";
    case "KNOWN_PROCESS":
      return "Proces cunoscut";
    case "PLANNED":
      return "Planificat";
    case "BLOCKED":
      return "Blocat";
    default: {
      const _exhaustive: never = readiness;
      return _exhaustive;
    }
  }
}

export function productionCapabilityKindLabel(
  kind: ProductionCapabilityKind,
): string {
  switch (kind) {
    case "MACHINE":
      return "Utilaj / stație de mașină";
    case "WORKSTATION":
      return "Post de lucru";
    case "HUMAN_SKILL":
      return "Îndemânare umană";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
