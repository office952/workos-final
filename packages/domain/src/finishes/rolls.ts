import type { OrganizationFinishOverlay, RollFamily, RollProfile } from "./types.js";

export const HUB_MEDIA_ORGANIZATION_ID = "org:hub-media";
export const ROLL_REGISTRY_SOURCE = "FC2A_ROLL_REGISTRY";

export const SHARED_ORACAL_ROLL_1000_ID = "roll:shared:oracal:1000";
export const SHARED_ORACAL_ROLL_1260_ID = "roll:shared:oracal:1260";
export const SHARED_PRINT_ROLL_1050_ID = "roll:shared:print:1050";
export const SHARED_PRINT_ROLL_1370_ID = "roll:shared:print:1370";
export const HUB_MEDIA_PRINT_ROLL_1050_ID = "roll:org:hub-media:print:1050";
export const HUB_MEDIA_PRINT_ROLL_1370_ID = "roll:org:hub-media:print:1370";

export const sharedRollProfiles: readonly RollProfile[] = [
  {
    id: SHARED_ORACAL_ROLL_1000_ID,
    family: "oracal",
    brand: "Oracal",
    series: null,
    widthMm: 1000,
    active: true,
    isDefault: true,
    scope: { kind: "shared" },
    notes: "Shared Oracal default width. Not a ProductTemplate constant.",
    source: ROLL_REGISTRY_SOURCE,
  },
  {
    id: SHARED_ORACAL_ROLL_1260_ID,
    family: "oracal",
    brand: "Oracal",
    series: null,
    widthMm: 1260,
    active: true,
    isDefault: false,
    scope: { kind: "shared" },
    notes: "Shared Oracal alternate width.",
    source: ROLL_REGISTRY_SOURCE,
  },
  {
    id: SHARED_PRINT_ROLL_1050_ID,
    family: "print",
    brand: null,
    series: null,
    widthMm: 1050,
    active: true,
    isDefault: true,
    scope: { kind: "shared" },
    notes: "Shared print default width. Not a ProductTemplate constant.",
    source: ROLL_REGISTRY_SOURCE,
  },
  {
    id: SHARED_PRINT_ROLL_1370_ID,
    family: "print",
    brand: null,
    series: null,
    widthMm: 1370,
    active: true,
    isDefault: false,
    scope: { kind: "shared" },
    notes: "Shared print alternate width.",
    source: ROLL_REGISTRY_SOURCE,
  },
];

export const hubMediaPrintRollProfiles: readonly RollProfile[] = [
  {
    id: HUB_MEDIA_PRINT_ROLL_1050_ID,
    family: "print",
    brand: null,
    series: null,
    widthMm: 1050,
    active: true,
    isDefault: true,
    scope: { kind: "organization", organizationId: HUB_MEDIA_ORGANIZATION_ID },
    notes: "HUB MEDIA organization print width. Not universal Product Truth.",
    source: "HUB_MEDIA_ORGANIZATION_CONFIGURATION",
  },
  {
    id: HUB_MEDIA_PRINT_ROLL_1370_ID,
    family: "print",
    brand: null,
    series: null,
    widthMm: 1370,
    active: true,
    isDefault: false,
    scope: { kind: "organization", organizationId: HUB_MEDIA_ORGANIZATION_ID },
    notes: "HUB MEDIA organization print width. Not universal Product Truth.",
    source: "HUB_MEDIA_ORGANIZATION_CONFIGURATION",
  },
];

export const HUB_MEDIA_FINISH_OVERLAY: OrganizationFinishOverlay = {
  organizationId: HUB_MEDIA_ORGANIZATION_ID,
  enabledApplicationIds: "all",
  disabledRollProfileIds: [],
  additionalRollProfiles: hubMediaPrintRollProfiles,
};

export function getRollProfile(
  id: string,
  extra: readonly RollProfile[] = [],
): RollProfile | undefined {
  return [...sharedRollProfiles, ...hubMediaPrintRollProfiles, ...extra].find(
    (item) => item.id === id,
  );
}

export function resolveCompatibleRolls(input: {
  family: RollFamily;
  organization?: OrganizationFinishOverlay | null;
  profiles?: readonly RollProfile[];
}): RollProfile[] {
  const disabled = new Set(input.organization?.disabledRollProfileIds ?? []);
  const orgProfiles = (input.organization?.additionalRollProfiles ?? []).filter(
    (item) => item.family === input.family && item.active && !disabled.has(item.id),
  );
  const shared = (input.profiles ?? sharedRollProfiles).filter(
    (item) =>
      item.family === input.family &&
      item.active &&
      item.scope.kind === "shared" &&
      !disabled.has(item.id),
  );
  const replacedWidths = new Set(orgProfiles.map((item) => item.widthMm));
  const remainingShared = shared.filter((item) => !replacedWidths.has(item.widthMm));
  return [...remainingShared, ...orgProfiles].sort((left, right) => {
    if (left.isDefault !== right.isDefault) {
      return left.isDefault ? -1 : 1;
    }
    return left.widthMm - right.widthMm;
  });
}

export function defaultRollProfile(
  family: RollFamily,
  organization?: OrganizationFinishOverlay | null,
): RollProfile | undefined {
  const rolls = resolveCompatibleRolls({ family, organization });
  return rolls.find((item) => item.isDefault) ?? rolls[0];
}
