import { getColorById, listColorsBySystem, projectOracal641Color } from "./colorRegistry.js";
import { normalizeColorCode } from "./colorIds.js";
import { listVisibleFinishApplications, resolveFinishCompatibility } from "./resolve.js";
import {
  SHARED_ORACAL_ROLL_1260_ID,
  SHARED_PRINT_ROLL_1370_ID,
  getRollProfile,
  resolveCompatibleRolls,
} from "./rolls.js";
import type {
  ColorCatalogItem,
  FinishApplicationId,
  OrganizationFinishOverlay,
  RollProfile,
} from "./types.js";
import { isFinishApplicationId } from "./types.js";
import { projectLettersVolumeOptions } from "./lettersVolume.js";
import type {
  DraftValue,
  DraftValues,
  FieldOption,
  ProductTemplate,
} from "../product/types.js";
const LETTERS_PRODUCT_CODE = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";

export const FACE_FINISH_FIELD = "face.finish";
export const FACE_VINYL_SERIES_FIELD = "face.vinylSeries";
export const FACE_COLOR_ID_FIELD = "face.colorId";
export const FACE_ROLL_PROFILE_FIELD = "face.rollProfileId";
export const FACE_PRINT_ROLL_PROFILE_FIELD = "face.printRollProfileId";
export const FACE_LAMINATION_FIELD = "face.lamination";
export const FACE_FINISH_APPLICATION_FIELD = "face.finishApplicationId";
export const FACE_COLOR_CODE_FIELD = "face.colorCode";
export const FACE_COLOR_DISPLAY_NAME_FIELD = "face.colorDisplayName";
export const FACE_COLOR_SWATCH_FIELD = "face.colorSwatch";
export const FACE_ROLL_WIDTH_MM_FIELD = "face.rollWidthMm";

export const LETTERS_FACE_V2_ALLOWED_APPLICATIONS = [
  "none",
  "face_letters_standard",
  "face_letters_premium",
  "illuminated_letter_face",
  "print_face",
  "print_face_laminated",
] as const satisfies readonly FinishApplicationId[];

export const SHARED_FINISH_ORGANIZATION_ID = "org:shared-default";

export const LETTERS_FACE_COLOR_651_010_ID = "oracal:651:010";
export const LETTERS_FACE_COLOR_8500_010_ID = "oracal:8500:010";

export type LettersFaceFinish = "none" | "oracal" | "print";
export type LettersFaceVinylSeries = "641" | "651" | "8500";
export type LettersFaceLamination = "none" | "laminated";

export type LettersFaceBlockCode =
  | "MISSING_ORACAL_SERIES"
  | "MISSING_ORACAL_COLOR"
  | "MISSING_ORACAL_ROLL"
  | "MISSING_PRINT_ROLL"
  | "MISSING_LAMINATION"
  | "INVALID_COLOR"
  | "WRONG_SERIES_COLOR"
  | "INACTIVE_COLOR"
  | "INVALID_ROLL"
  | "INACTIVE_ROLL"
  | "WRONG_FAMILY_ROLL"
  | "ORG_CAPABILITY_DISABLED"
  | "PRODUCT_TRUTH_CONFLICT";

export type LettersFaceIssue = {
  code: LettersFaceBlockCode;
  fieldId: string;
  fieldLabel: string;
};

export type CatalogColorOption = {
  id: string;
  code: string;
  displayName: string;
  swatch: string;
  system: ColorCatalogItem["system"];
  active: boolean;
};

export type CatalogRollOption = {
  id: string;
  widthMm: number;
  label: string;
  family: RollProfile["family"];
  active: boolean;
};

export type ProductConfigurationOptions = {
  selectOptions: Readonly<Record<string, readonly FieldOption[]>>;
  catalogColors: Readonly<Record<string, readonly CatalogColorOption[]>>;
  catalogRolls: Readonly<Record<string, readonly CatalogRollOption[]>>;
};

export type LettersFaceResolution =
  | {
      ok: true;
      applicationId: FinishApplicationId;
      snapshotValues: DraftValues;
    }
  | {
      ok: false;
      issues: readonly LettersFaceIssue[];
    };

const SERIES_APPLICATION: Record<LettersFaceVinylSeries, FinishApplicationId> = {
  "641": "face_letters_standard",
  "651": "face_letters_premium",
  "8500": "illuminated_letter_face",
};

const FINISH_OPTIONS: readonly FieldOption[] = [
  { value: "none", label: "Fără finisaj" },
  { value: "oracal", label: "Oracal" },
  { value: "print", label: "Print" },
];

const SERIES_OPTIONS: readonly FieldOption[] = [
  { value: "641", label: "Oracal 641" },
  { value: "651", label: "Oracal 651" },
  { value: "8500", label: "Oracal 8500" },
];

const LAMINATION_OPTIONS: readonly FieldOption[] = [
  { value: "none", label: "Fără laminare" },
  { value: "laminated", label: "Cu laminare" },
];

const FIELD_LABELS: Record<string, string> = {
  [FACE_FINISH_FIELD]: "Finisaj față",
  [FACE_VINYL_SERIES_FIELD]: "Serie Oracal",
  [FACE_COLOR_ID_FIELD]: "Culoare",
  [FACE_ROLL_PROFILE_FIELD]: "Rolă",
  [FACE_PRINT_ROLL_PROFILE_FIELD]: "Rolă print",
  [FACE_LAMINATION_FIELD]: "Laminare",
};

export function defaultFinishOrganization(): OrganizationFinishOverlay {
  return {
    organizationId: SHARED_FINISH_ORGANIZATION_ID,
    enabledApplicationIds: "all",
    disabledRollProfileIds: [],
    additionalRollProfiles: [],
  };
}

export function isLettersFaceV2Template(template: ProductTemplate): boolean {
  return (
    template.code === LETTERS_PRODUCT_CODE &&
    template.version === "2" &&
    Boolean(template.slotFinishAllowances?.length)
  );
}

export function lettersFaceAllowedApplications(
  template: ProductTemplate,
): FinishApplicationId[] {
  const declared = template.slotFinishAllowances?.find((item) => item.slot === "FACE");
  if (declared) {
    return [...declared.allowedApplicationIds];
  }
  return [...LETTERS_FACE_V2_ALLOWED_APPLICATIONS];
}

export function projectProductConfigurationOptions(
  template: ProductTemplate,
  values: DraftValues,
  organization: OrganizationFinishOverlay = defaultFinishOrganization(),
): ProductConfigurationOptions | null {
  if (!isLettersFaceV2Template(template)) {
    return null;
  }
  const face = projectLettersFaceOptions({ template, values, organization });
  const volume = projectLettersVolumeOptions({ template, values, organization });
  return {
    selectOptions: {
      ...face.selectOptions,
      ...volume.selectOptions,
    },
    catalogColors: {
      ...face.catalogColors,
      ...volume.catalogColors,
    },
    catalogRolls: {
      ...face.catalogRolls,
      ...volume.catalogRolls,
    },
  };
}

export function projectLettersFaceOptions(input: {
  template: ProductTemplate;
  values: DraftValues;
  organization?: OrganizationFinishOverlay;
}): ProductConfigurationOptions {
  const organization = input.organization ?? defaultFinishOrganization();
  const allowed = lettersFaceAllowedApplications(input.template);
  const visible = listVisibleFinishApplications({
    slot: "FACE",
    allowedApplicationIds: allowed,
    organization,
  });
  const visibleSet = new Set(visible);
  const finish = readFinish(input.values);

  const finishOptions = FINISH_OPTIONS.filter((option) => {
    if (option.value === "none") {
      return visibleSet.has("none");
    }
    if (option.value === "oracal") {
      return (
        visibleSet.has("face_letters_standard") ||
        visibleSet.has("face_letters_premium") ||
        visibleSet.has("illuminated_letter_face")
      );
    }
    return visibleSet.has("print_face") || visibleSet.has("print_face_laminated");
  });

  const vinylSeriesOptions = SERIES_OPTIONS.filter((option) => {
    const applicationId = SERIES_APPLICATION[option.value as LettersFaceVinylSeries];
    return visibleSet.has(applicationId);
  });

  const laminationOptions = LAMINATION_OPTIONS.filter((option) => {
    if (option.value === "none") {
      return visibleSet.has("print_face");
    }
    return visibleSet.has("print_face_laminated");
  });

  const series = readSeries(input.values);
  const colors =
    finish === "oracal" && series
      ? listColorsForSeries(series)
          .filter((item) => item.active)
          .map(toColorOption)
      : [];

  const oracalRolls =
    finish === "oracal"
      ? resolveCompatibleRolls({ family: "oracal", organization }).map(toRollOption)
      : [];
  const printRolls =
    finish === "print"
      ? resolveCompatibleRolls({ family: "print", organization }).map(toRollOption)
      : [];

  return {
    selectOptions: {
      [FACE_FINISH_FIELD]: finishOptions,
      [FACE_VINYL_SERIES_FIELD]: vinylSeriesOptions,
      [FACE_LAMINATION_FIELD]: laminationOptions,
    },
    catalogColors: {
      [FACE_COLOR_ID_FIELD]: colors,
    },
    catalogRolls: {
      [FACE_ROLL_PROFILE_FIELD]: oracalRolls,
      [FACE_PRINT_ROLL_PROFILE_FIELD]: printRolls,
    },
  };
}

export function normalizeLettersFaceDraft(values: DraftValues): DraftValues {
  const next: DraftValues = { ...values };
  if (next[FACE_FINISH_FIELD] !== "vinyl") {
    return next;
  }
  next[FACE_FINISH_FIELD] = "oracal";
  if (readSeries(next) === undefined) {
    next[FACE_VINYL_SERIES_FIELD] = "651";
  }
  const existingColorId = asNonEmptyString(next[FACE_COLOR_ID_FIELD]);
  if (!existingColorId) {
    const matched = matchLegacyFaceColor(asNonEmptyString(next["face.color"]));
    if (matched) {
      next[FACE_COLOR_ID_FIELD] = matched.id;
    }
  }
  return next;
}

export function resolveLettersFaceDraft(input: {
  template: ProductTemplate;
  values: DraftValues;
  organization?: OrganizationFinishOverlay;
  extraColors?: readonly ColorCatalogItem[];
  extraRolls?: readonly RollProfile[];
}): LettersFaceResolution {
  const organization = input.organization ?? defaultFinishOrganization();
  const finish = readFinish(input.values);
  if (finish === undefined || finish === "none") {
    return {
      ok: true,
      applicationId: "none",
      snapshotValues: {},
    };
  }

  const allowed = lettersFaceAllowedApplications(input.template);
  const issues: LettersFaceIssue[] = [];

  if (finish === "oracal") {
    const series = readSeries(input.values);
    if (!series) {
      return { ok: false, issues: [issue("MISSING_ORACAL_SERIES", FACE_VINYL_SERIES_FIELD)] };
    }
    const applicationId = SERIES_APPLICATION[series];
    const colorId = asNonEmptyString(input.values[FACE_COLOR_ID_FIELD]);
    const rollId = asNonEmptyString(input.values[FACE_ROLL_PROFILE_FIELD]);
    if (!colorId) {
      issues.push(issue("MISSING_ORACAL_COLOR", FACE_COLOR_ID_FIELD));
    }
    if (!rollId) {
      issues.push(issue("MISSING_ORACAL_ROLL", FACE_ROLL_PROFILE_FIELD));
    }
    if (issues.length > 0) {
      return { ok: false, issues };
    }

    const color = lookupColor(colorId!, input.extraColors);
    if (!color) {
      return { ok: false, issues: [issue("INVALID_COLOR", FACE_COLOR_ID_FIELD)] };
    }
    if (!color.active) {
      return { ok: false, issues: [issue("INACTIVE_COLOR", FACE_COLOR_ID_FIELD)] };
    }
    if (!colorMatchesSeries(series, color)) {
      return { ok: false, issues: [issue("WRONG_SERIES_COLOR", FACE_COLOR_ID_FIELD)] };
    }

    const roll = lookupRoll(rollId!, organization, input.extraRolls);
    if (!roll) {
      return { ok: false, issues: [issue("INVALID_ROLL", FACE_ROLL_PROFILE_FIELD)] };
    }
    if (!roll.active) {
      return { ok: false, issues: [issue("INACTIVE_ROLL", FACE_ROLL_PROFILE_FIELD)] };
    }
    if (roll.family !== "oracal") {
      return { ok: false, issues: [issue("WRONG_FAMILY_ROLL", FACE_ROLL_PROFILE_FIELD)] };
    }

    const resolveColor = series === "641" ? projectOracal641Color(color) : color;
    const compatibility = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: allowed,
      organization,
      extraColors: [
        ...(input.extraColors ?? []),
        ...(series === "641" ? [resolveColor] : []),
      ],
      selection: {
        slot: "FACE",
        applicationId,
        colorId: resolveColor.id,
        rollProfileId: roll.id,
        rollWidthMm: roll.widthMm,
        laminated: null,
      },
    });
    if (compatibility.status === "FAILED") {
      return { ok: false, issues: [compatibilityIssue(compatibility.code)] };
    }

    return {
      ok: true,
      applicationId,
      snapshotValues: snapshotOracal(applicationId, color, roll),
    };
  }

  const lamination = readLamination(input.values);
  if (!lamination) {
    return { ok: false, issues: [issue("MISSING_LAMINATION", FACE_LAMINATION_FIELD)] };
  }
  const applicationId: FinishApplicationId =
    lamination === "laminated" ? "print_face_laminated" : "print_face";
  const rollId = asNonEmptyString(input.values[FACE_PRINT_ROLL_PROFILE_FIELD]);
  if (!rollId) {
    return { ok: false, issues: [issue("MISSING_PRINT_ROLL", FACE_PRINT_ROLL_PROFILE_FIELD)] };
  }
  const roll = lookupRoll(rollId, organization, input.extraRolls);
  if (!roll) {
    return { ok: false, issues: [issue("INVALID_ROLL", FACE_PRINT_ROLL_PROFILE_FIELD)] };
  }
  if (!roll.active) {
    return { ok: false, issues: [issue("INACTIVE_ROLL", FACE_PRINT_ROLL_PROFILE_FIELD)] };
  }
  if (roll.family !== "print") {
    return { ok: false, issues: [issue("WRONG_FAMILY_ROLL", FACE_PRINT_ROLL_PROFILE_FIELD)] };
  }

  const compatibility = resolveFinishCompatibility({
    slot: "FACE",
    allowedApplicationIds: allowed,
    organization,
    selection: {
      slot: "FACE",
      applicationId,
      colorId: null,
      rollProfileId: roll.id,
      rollWidthMm: roll.widthMm,
      laminated: lamination === "laminated",
    },
  });
  if (compatibility.status === "FAILED") {
    return { ok: false, issues: [compatibilityIssue(compatibility.code)] };
  }

  return {
    ok: true,
    applicationId,
    snapshotValues: snapshotPrint(applicationId, roll, lamination === "laminated"),
  };
}

export function deriveLettersFaceApplicationId(
  values: DraftValues,
): FinishApplicationId | undefined {
  const snap = values[FACE_FINISH_APPLICATION_FIELD];
  if (typeof snap === "string" && isFinishApplicationId(snap)) {
    return snap;
  }
  if (values[FACE_FINISH_FIELD] === "vinyl") {
    return "face_letters_premium";
  }
  const finish = readFinish(values);
  if (finish === "none") {
    return "none";
  }
  if (finish === "oracal") {
    const series = readSeries(values);
    return series ? SERIES_APPLICATION[series] : undefined;
  }
  if (finish === "print") {
    const lamination = readLamination(values);
    if (lamination === "laminated") {
      return "print_face_laminated";
    }
    if (lamination === "none") {
      return "print_face";
    }
  }
  return undefined;
}

export function formatLettersFaceField(
  fieldId: string,
  value: DraftValue | undefined,
  values: DraftValues,
  options?: ProductConfigurationOptions | null,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (fieldId === FACE_COLOR_ID_FIELD) {
    const code = values[FACE_COLOR_CODE_FIELD];
    const name = values[FACE_COLOR_DISPLAY_NAME_FIELD];
    if (typeof code === "string" && typeof name === "string") {
      return `${code} — ${name}`;
    }
    const match = options?.catalogColors[fieldId]?.find((item) => item.id === value);
    return match ? `${match.code} — ${match.displayName}` : null;
  }
  if (fieldId === FACE_ROLL_PROFILE_FIELD || fieldId === FACE_PRINT_ROLL_PROFILE_FIELD) {
    const width = values[FACE_ROLL_WIDTH_MM_FIELD];
    if (typeof width === "number") {
      return `Rolă ${width} mm`;
    }
    const match = options?.catalogRolls[fieldId]?.find((item) => item.id === value);
    return match ? `Rolă ${match.widthMm} mm` : null;
  }
  if (fieldId === FACE_FINISH_FIELD && value === "oracal") {
    const series = readSeries(values);
    return series ? `Oracal ${series}` : "Oracal";
  }
  const select = options?.selectOptions[fieldId]?.find((item) => item.value === String(value));
  return select?.label ?? null;
}

export function lettersFaceReadyValues(kind: "none" | "641" | "651" | "8500" | "print" | "print_laminated"): DraftValues {
  const area = { "face.confirmedAreaMm2": 250000 };
  switch (kind) {
    case "none":
      return { [FACE_FINISH_FIELD]: "none", ...area };
    case "641":
      return {
        [FACE_FINISH_FIELD]: "oracal",
        [FACE_VINYL_SERIES_FIELD]: "641",
        [FACE_COLOR_ID_FIELD]: LETTERS_FACE_COLOR_651_010_ID,
        [FACE_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
        ...area,
      };
    case "651":
      return {
        [FACE_FINISH_FIELD]: "oracal",
        [FACE_VINYL_SERIES_FIELD]: "651",
        [FACE_COLOR_ID_FIELD]: LETTERS_FACE_COLOR_651_010_ID,
        [FACE_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
        ...area,
      };
    case "8500":
      return {
        [FACE_FINISH_FIELD]: "oracal",
        [FACE_VINYL_SERIES_FIELD]: "8500",
        [FACE_COLOR_ID_FIELD]: LETTERS_FACE_COLOR_8500_010_ID,
        [FACE_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
        ...area,
      };
    case "print":
      return {
        [FACE_FINISH_FIELD]: "print",
        [FACE_PRINT_ROLL_PROFILE_FIELD]: SHARED_PRINT_ROLL_1370_ID,
        [FACE_LAMINATION_FIELD]: "none",
        ...area,
      };
    case "print_laminated":
      return {
        [FACE_FINISH_FIELD]: "print",
        [FACE_PRINT_ROLL_PROFILE_FIELD]: SHARED_PRINT_ROLL_1370_ID,
        [FACE_LAMINATION_FIELD]: "laminated",
        ...area,
      };
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function snapshotOracal(
  applicationId: FinishApplicationId,
  color: ColorCatalogItem,
  roll: RollProfile,
): DraftValues {
  return {
    [FACE_FINISH_APPLICATION_FIELD]: applicationId,
    [FACE_COLOR_CODE_FIELD]: color.code,
    [FACE_COLOR_DISPLAY_NAME_FIELD]: color.displayName,
    [FACE_COLOR_SWATCH_FIELD]: color.swatch,
    [FACE_ROLL_WIDTH_MM_FIELD]: roll.widthMm,
  };
}

function snapshotPrint(
  applicationId: FinishApplicationId,
  roll: RollProfile,
  laminated: boolean,
): DraftValues {
  return {
    [FACE_FINISH_APPLICATION_FIELD]: applicationId,
    [FACE_ROLL_WIDTH_MM_FIELD]: roll.widthMm,
    [FACE_LAMINATION_FIELD]: laminated ? "laminated" : "none",
  };
}

function listColorsForSeries(series: LettersFaceVinylSeries): ColorCatalogItem[] {
  switch (series) {
    case "641":
    case "651":
      return listColorsBySystem("ORACAL_651");
    case "8500":
      return listColorsBySystem("ORACAL_8500");
    default: {
      const _exhaustive: never = series;
      return _exhaustive;
    }
  }
}

function colorMatchesSeries(series: LettersFaceVinylSeries, color: ColorCatalogItem): boolean {
  switch (series) {
    case "641":
      return color.system === "ORACAL_641" || color.system === "ORACAL_651";
    case "651":
      return color.system === "ORACAL_651";
    case "8500":
      return color.system === "ORACAL_8500";
    default: {
      const _exhaustive: never = series;
      return _exhaustive;
    }
  }
}

function matchLegacyFaceColor(raw: string | undefined): ColorCatalogItem | undefined {
  if (!raw) {
    return undefined;
  }
  const colors = listColorsBySystem("ORACAL_651").filter((item) => item.active);
  const normalized = normalizeColorCode("ORACAL_651", raw).toLowerCase();
  const byCode = colors.filter(
    (item) => normalizeColorCode("ORACAL_651", item.code).toLowerCase() === normalized,
  );
  if (byCode.length === 1) {
    return byCode[0];
  }
  const byName = colors.filter((item) => item.displayName.toLowerCase() === raw.trim().toLowerCase());
  if (byName.length === 1) {
    return byName[0];
  }
  return undefined;
}

function lookupColor(
  id: string,
  extra: readonly ColorCatalogItem[] | undefined,
): ColorCatalogItem | undefined {
  return extra?.find((item) => item.id === id) ?? getColorById(id);
}

function lookupRoll(
  id: string,
  organization: OrganizationFinishOverlay,
  extra: readonly RollProfile[] | undefined,
): RollProfile | undefined {
  return getRollProfile(id, [
    ...organization.additionalRollProfiles,
    ...(extra ?? []),
  ]);
}

function toColorOption(item: ColorCatalogItem): CatalogColorOption {
  return {
    id: item.id,
    code: item.code,
    displayName: item.displayName,
    swatch: item.swatch,
    system: item.system,
    active: item.active,
  };
}

function toRollOption(item: RollProfile): CatalogRollOption {
  return {
    id: item.id,
    widthMm: item.widthMm,
    label: `${item.widthMm} mm`,
    family: item.family,
    active: item.active,
  };
}

function readFinish(values: DraftValues): LettersFaceFinish | undefined {
  const value = values[FACE_FINISH_FIELD];
  if (value === "none" || value === "oracal" || value === "print") {
    return value;
  }
  if (value === "vinyl") {
    return "oracal";
  }
  return undefined;
}

function readSeries(values: DraftValues): LettersFaceVinylSeries | undefined {
  const value = values[FACE_VINYL_SERIES_FIELD];
  if (value === "641" || value === "651" || value === "8500") {
    return value;
  }
  return undefined;
}

function readLamination(values: DraftValues): LettersFaceLamination | undefined {
  const value = values[FACE_LAMINATION_FIELD];
  if (value === "none" || value === "laminated") {
    return value;
  }
  return undefined;
}

function asNonEmptyString(value: DraftValue | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function issue(code: LettersFaceBlockCode, fieldId: string): LettersFaceIssue {
  return {
    code,
    fieldId,
    fieldLabel: FIELD_LABELS[fieldId] ?? fieldId,
  };
}

function compatibilityIssue(code: string): LettersFaceIssue {
  if (code === "ORG_CAPABILITY_DISABLED") {
    return issue("ORG_CAPABILITY_DISABLED", FACE_FINISH_FIELD);
  }
  if (code === "PRODUCT_TRUTH_CONFLICT") {
    return issue("PRODUCT_TRUTH_CONFLICT", FACE_FINISH_FIELD);
  }
  return issue("PRODUCT_TRUTH_CONFLICT", FACE_FINISH_FIELD);
}
