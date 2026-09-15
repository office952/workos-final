export const FINISH_FAMILIES = ["none", "oracal", "print", "ral", "stock"] as const;
export type FinishFamily = (typeof FINISH_FAMILIES)[number];

export const FINISH_APPLICATION_IDS = [
  "none",
  "face_letters_standard",
  "face_letters_premium",
  "illuminated_letter_face",
  "print_face",
  "print_face_laminated",
  "return_stock",
  "return_cant_volum_wrapping",
  "return_ral",
] as const;
export type FinishApplicationId = (typeof FINISH_APPLICATION_IDS)[number];

export const FINISH_SLOTS = ["FACE", "VOLUME"] as const;
export type FinishSlot = (typeof FINISH_SLOTS)[number];

export const COLOR_SYSTEMS = ["RAL", "ORACAL_641", "ORACAL_651", "ORACAL_8500"] as const;
export type ColorSystem = (typeof COLOR_SYSTEMS)[number];

export const COLOR_SOURCES = ["LEGACY_COLOR_REGISTRY", "OPERATOR_MANUAL"] as const;
export type ColorSource = (typeof COLOR_SOURCES)[number];

export const ROLL_FAMILIES = ["oracal", "print"] as const;
export type RollFamily = (typeof ROLL_FAMILIES)[number];

export const LAMINATION_STATES = ["none", "required", "forbidden"] as const;
export type LaminationState = (typeof LAMINATION_STATES)[number];

export const FINISH_COMPATIBILITY_FAILURE_CODES = [
  "MISSING_REQUIRED_CONFIGURATION",
  "INVALID_CATALOG_REFERENCE",
  "NO_RESOLVABLE_RESOURCE",
  "PRODUCT_TRUTH_CONFLICT",
] as const;
export type FinishCompatibilityFailureCode =
  (typeof FINISH_COMPATIBILITY_FAILURE_CODES)[number];

export type FinishCatalogItem = {
  id: string;
  applicationId: FinishApplicationId;
  finishFamily: FinishFamily;
  compatibleSlots: readonly FinishSlot[];
  brand: "Oracal" | null;
  series: "641" | "651" | "8500" | null;
  colorSystem: ColorSystem | null;
  requiresColor: boolean;
  requiresRoll: boolean;
  rollFamily: RollFamily | null;
  lamination: LaminationState;
  translucent: boolean;
  intendedResourceId: string | null;
  active: boolean;
  source: string;
};

export type ColorCatalogItem = {
  id: string;
  system: ColorSystem;
  brand: "RAL" | "Oracal";
  series: "641" | "651" | "8500" | null;
  code: string;
  displayName: string;
  swatch: string;
  translucent: boolean;
  active: boolean;
  source: ColorSource;
  needsReview: boolean;
};

export type RollScope =
  | { readonly kind: "shared" }
  | { readonly kind: "organization"; readonly organizationId: string };

export type RollProfile = {
  id: string;
  family: RollFamily;
  brand: string | null;
  series: string | null;
  widthMm: number;
  active: boolean;
  isDefault: boolean;
  scope: RollScope;
  notes: string;
  source: string;
};

export type FinishSelection = {
  slot: FinishSlot;
  applicationId: FinishApplicationId | null;
  colorId: string | null;
  rollProfileId: string | null;
  rollWidthMm: number | null;
  laminated: boolean | null;
};

export type FinishSelectionSnapshot = {
  applicationId: FinishApplicationId;
  colorId: string | null;
  colorCode: string | null;
  colorDisplayName: string | null;
  swatch: string | null;
  rollProfileId: string | null;
  rollWidthMm: number | null;
  laminated: boolean | null;
};

export type OrganizationFinishOverlay = {
  organizationId: string;
  enabledApplicationIds: readonly FinishApplicationId[] | "all";
  disabledRollProfileIds: readonly string[];
  additionalRollProfiles: readonly RollProfile[];
};

export type SlotFinishAllowance = {
  slot: FinishSlot;
  allowedApplicationIds: readonly FinishApplicationId[];
};

export type FinishCompatibilityInput = {
  slot: FinishSlot;
  allowedApplicationIds: readonly FinishApplicationId[];
  organization?: OrganizationFinishOverlay;
  selection: FinishSelection;
  knownResourceIds?: ReadonlySet<string>;
  extraColors?: readonly ColorCatalogItem[];
};

export type FinishCompatibilitySuccess = {
  status: "OK";
  visibleApplicationIds: readonly FinishApplicationId[];
  application: FinishCatalogItem;
  requiredFields: readonly ("color" | "roll" | "lamination")[];
  colorSystem: ColorSystem | null;
  rollFamily: RollFamily | null;
  compatibleColors: readonly ColorCatalogItem[];
  compatibleRolls: readonly RollProfile[];
  intendedResourceId: string | null;
};

export type FinishCompatibilityFailure = {
  status: "FAILED";
  code: FinishCompatibilityFailureCode;
  reason: string;
  visibleApplicationIds: readonly FinishApplicationId[];
};

export type FinishCompatibilityResult =
  | FinishCompatibilitySuccess
  | FinishCompatibilityFailure;

export function isFinishApplicationId(value: string): value is FinishApplicationId {
  return (FINISH_APPLICATION_IDS as readonly string[]).includes(value);
}

export function isColorSystem(value: string): value is ColorSystem {
  return (COLOR_SYSTEMS as readonly string[]).includes(value);
}

export function isRollFamily(value: string): value is RollFamily {
  return (ROLL_FAMILIES as readonly string[]).includes(value);
}

export function isFinishSlot(value: string): value is FinishSlot {
  return (FINISH_SLOTS as readonly string[]).includes(value);
}
