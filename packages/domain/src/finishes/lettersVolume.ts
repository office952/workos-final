import { getColorById, listColorsBySystem, projectOracal641Color } from "./colorRegistry.js";
import { normalizeColorCode } from "./colorIds.js";
import { listVisibleFinishApplications, resolveFinishCompatibility } from "./resolve.js";
import {
  SHARED_ORACAL_ROLL_1260_ID,
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
import type {
  DraftValue,
  DraftValues,
  FieldOption,
  ProductTemplate,
} from "../product/types.js";
import type {
  CatalogColorOption,
  CatalogRollOption,
  ProductConfigurationOptions,
} from "./lettersFace.js";

const DEFAULT_VOLUME_ORGANIZATION: OrganizationFinishOverlay = {
  organizationId: "org:shared-default",
  enabledApplicationIds: "all",
  disabledRollProfileIds: [],
  additionalRollProfiles: [],
};

export const VOLUME_FINISH_FIELD = "volume.finish";
export const VOLUME_VINYL_SERIES_FIELD = "volume.vinylSeries";
export const VOLUME_COLOR_ID_FIELD = "volume.colorId";
export const VOLUME_RAL_COLOR_ID_FIELD = "volume.ralColorId";
export const VOLUME_ROLL_PROFILE_FIELD = "volume.rollProfileId";
export const VOLUME_STOCK_COLOR_FIELD = "volume.stockColor";
export const VOLUME_FINISH_APPLICATION_FIELD = "volume.finishApplicationId";
export const VOLUME_COLOR_CODE_FIELD = "volume.colorCode";
export const VOLUME_COLOR_DISPLAY_NAME_FIELD = "volume.colorDisplayName";
export const VOLUME_COLOR_SWATCH_FIELD = "volume.colorSwatch";
export const VOLUME_ROLL_WIDTH_MM_FIELD = "volume.rollWidthMm";
export const VOLUME_RETURN_WRAP_ALLOWANCE_FIELD = "volume.returnWrapAllowanceMm";

export const LETTERS_VOLUME_V2_ALLOWED_APPLICATIONS = [
  "return_stock",
  "return_letters_standard",
  "return_cant_volum_wrapping",
  "return_ral",
] as const satisfies readonly FinishApplicationId[];

export const LETTERS_VOLUME_COLOR_651_010_ID = "oracal:651:010";
export const LETTERS_VOLUME_RAL_9005_ID = "ral:9005";
export const LETTERS_VOLUME_RAL_9010_ID = "ral:9010";

export type LettersVolumeFinish = "stock" | "oracal" | "painted";
export type LettersVolumeVinylSeries = "641" | "651";

export type LettersVolumeBlockCode =
  | "MISSING_ORACAL_SERIES"
  | "MISSING_ORACAL_COLOR"
  | "MISSING_ORACAL_ROLL"
  | "MISSING_RAL_COLOR"
  | "INVALID_COLOR"
  | "WRONG_SERIES_COLOR"
  | "INACTIVE_COLOR"
  | "INVALID_ROLL"
  | "INACTIVE_ROLL"
  | "WRONG_FAMILY_ROLL"
  | "ORG_CAPABILITY_DISABLED"
  | "PRODUCT_TRUTH_CONFLICT";

export type LettersVolumeIssue = {
  code: LettersVolumeBlockCode;
  fieldId: string;
  fieldLabel: string;
};

export type LettersVolumeResolution =
  | {
      ok: true;
      applicationId: FinishApplicationId;
      snapshotValues: DraftValues;
    }
  | {
      ok: false;
      issues: readonly LettersVolumeIssue[];
    };

const SERIES_APPLICATION: Record<LettersVolumeVinylSeries, FinishApplicationId> = {
  "641": "return_letters_standard",
  "651": "return_cant_volum_wrapping",
};

const FINISH_OPTIONS: readonly FieldOption[] = [
  { value: "stock", label: "Stoc" },
  { value: "oracal", label: "Oracal" },
  { value: "painted", label: "Vopsit RAL" },
];

const SERIES_OPTIONS: readonly FieldOption[] = [
  { value: "641", label: "Oracal 641" },
  { value: "651", label: "Oracal 651" },
];

const FIELD_LABELS: Record<string, string> = {
  [VOLUME_FINISH_FIELD]: "Finisaj volum",
  [VOLUME_VINYL_SERIES_FIELD]: "Serie Oracal",
  [VOLUME_COLOR_ID_FIELD]: "Culoare",
  [VOLUME_RAL_COLOR_ID_FIELD]: "Culoare RAL",
  [VOLUME_ROLL_PROFILE_FIELD]: "Rolă",
  [VOLUME_STOCK_COLOR_FIELD]: "Culoare / descriere stoc",
};

export function lettersVolumeAllowedApplications(
  template: ProductTemplate,
): FinishApplicationId[] {
  const declared = template.slotFinishAllowances?.find((item) => item.slot === "VOLUME");
  if (declared) {
    return [...declared.allowedApplicationIds];
  }
  return [...LETTERS_VOLUME_V2_ALLOWED_APPLICATIONS];
}

export function projectLettersVolumeOptions(input: {
  template: ProductTemplate;
  values: DraftValues;
  organization?: OrganizationFinishOverlay;
}): ProductConfigurationOptions {
  const organization = input.organization ?? DEFAULT_VOLUME_ORGANIZATION;
  const allowed = lettersVolumeAllowedApplications(input.template);
  const visible = listVisibleFinishApplications({
    slot: "VOLUME",
    allowedApplicationIds: allowed,
    organization,
  });
  const visibleSet = new Set(visible);
  const finish = readFinish(input.values);

  const finishOptions = FINISH_OPTIONS.filter((option) => {
    if (option.value === "stock") {
      return visibleSet.has("return_stock");
    }
    if (option.value === "oracal") {
      return (
        visibleSet.has("return_letters_standard") ||
        visibleSet.has("return_cant_volum_wrapping")
      );
    }
    return visibleSet.has("return_ral");
  });

  const vinylSeriesOptions = SERIES_OPTIONS.filter((option) => {
    const applicationId = SERIES_APPLICATION[option.value as LettersVolumeVinylSeries];
    return visibleSet.has(applicationId);
  });

  const series = readSeries(input.values);
  const oracalColors =
    finish === "oracal" && series
      ? listColorsForSeries(series)
          .filter((item) => item.active)
          .map(toColorOption)
      : [];
  const ralColors =
    finish === "painted"
      ? listColorsBySystem("RAL")
          .filter((item) => item.active)
          .map(toColorOption)
      : [];
  const oracalRolls =
    finish === "oracal"
      ? resolveCompatibleRolls({ family: "oracal", organization }).map(toRollOption)
      : [];

  return {
    selectOptions: {
      [VOLUME_FINISH_FIELD]: finishOptions,
      [VOLUME_VINYL_SERIES_FIELD]: vinylSeriesOptions,
    },
    catalogColors: {
      [VOLUME_COLOR_ID_FIELD]: oracalColors,
      [VOLUME_RAL_COLOR_ID_FIELD]: ralColors,
    },
    catalogRolls: {
      [VOLUME_ROLL_PROFILE_FIELD]: oracalRolls,
    },
  };
}

export function normalizeLettersVolumeDraft(values: DraftValues): DraftValues {
  const next: DraftValues = { ...values };
  const finish = next[VOLUME_FINISH_FIELD];
  if (finish === "none") {
    next[VOLUME_FINISH_FIELD] = "stock";
    return next;
  }
  if (finish === "vinyl") {
    next[VOLUME_FINISH_FIELD] = "oracal";
    if (readSeries(next) === undefined) {
      next[VOLUME_VINYL_SERIES_FIELD] = "651";
    }
    if (!asNonEmptyString(next[VOLUME_COLOR_ID_FIELD])) {
      const matched = matchLegacyOracalColor(asNonEmptyString(next["volume.color"]));
      if (matched) {
        next[VOLUME_COLOR_ID_FIELD] = matched.id;
      }
    }
    return next;
  }
  if (finish === "painted" && !asNonEmptyString(next[VOLUME_RAL_COLOR_ID_FIELD])) {
    const matched = matchLegacyRalColor(asNonEmptyString(next["volume.color"]));
    if (matched) {
      next[VOLUME_RAL_COLOR_ID_FIELD] = matched.id;
    }
  }
  return next;
}

export function resolveLettersVolumeDraft(input: {
  template: ProductTemplate;
  values: DraftValues;
  organization?: OrganizationFinishOverlay;
  extraColors?: readonly ColorCatalogItem[];
  extraRolls?: readonly RollProfile[];
}): LettersVolumeResolution {
  const organization = input.organization ?? DEFAULT_VOLUME_ORGANIZATION;
  const finish = readFinish(input.values);
  if (finish === undefined) {
    return { ok: false, issues: [issue("PRODUCT_TRUTH_CONFLICT", VOLUME_FINISH_FIELD)] };
  }

  const allowed = lettersVolumeAllowedApplications(input.template);

  if (finish === "stock") {
    const compatibility = resolveFinishCompatibility({
      slot: "VOLUME",
      allowedApplicationIds: allowed,
      organization,
      selection: {
        slot: "VOLUME",
        applicationId: "return_stock",
        colorId: null,
        rollProfileId: null,
        rollWidthMm: null,
        laminated: null,
      },
    });
    if (compatibility.status === "FAILED") {
      return { ok: false, issues: [compatibilityIssue(compatibility.code)] };
    }
    return {
      ok: true,
      applicationId: "return_stock",
      snapshotValues: {
        [VOLUME_FINISH_APPLICATION_FIELD]: "return_stock",
      },
    };
  }

  if (finish === "painted") {
    const colorId = asNonEmptyString(input.values[VOLUME_RAL_COLOR_ID_FIELD]);
    if (!colorId) {
      return { ok: false, issues: [issue("MISSING_RAL_COLOR", VOLUME_RAL_COLOR_ID_FIELD)] };
    }
    const color = lookupColor(colorId, input.extraColors);
    if (!color) {
      return { ok: false, issues: [issue("INVALID_COLOR", VOLUME_RAL_COLOR_ID_FIELD)] };
    }
    if (!color.active) {
      return { ok: false, issues: [issue("INACTIVE_COLOR", VOLUME_RAL_COLOR_ID_FIELD)] };
    }
    if (color.system !== "RAL") {
      return { ok: false, issues: [issue("WRONG_SERIES_COLOR", VOLUME_RAL_COLOR_ID_FIELD)] };
    }
    const compatibility = resolveFinishCompatibility({
      slot: "VOLUME",
      allowedApplicationIds: allowed,
      organization,
      extraColors: input.extraColors,
      selection: {
        slot: "VOLUME",
        applicationId: "return_ral",
        colorId: color.id,
        rollProfileId: null,
        rollWidthMm: null,
        laminated: null,
      },
    });
    if (compatibility.status === "FAILED") {
      return { ok: false, issues: [compatibilityIssue(compatibility.code)] };
    }
    return {
      ok: true,
      applicationId: "return_ral",
      snapshotValues: snapshotColor("return_ral", color),
    };
  }

  const series = readSeries(input.values);
  if (!series) {
    return { ok: false, issues: [issue("MISSING_ORACAL_SERIES", VOLUME_VINYL_SERIES_FIELD)] };
  }
  const applicationId = SERIES_APPLICATION[series];
  const issues: LettersVolumeIssue[] = [];
  const colorId = asNonEmptyString(input.values[VOLUME_COLOR_ID_FIELD]);
  const rollId = asNonEmptyString(input.values[VOLUME_ROLL_PROFILE_FIELD]);
  if (!colorId) {
    issues.push(issue("MISSING_ORACAL_COLOR", VOLUME_COLOR_ID_FIELD));
  }
  if (!rollId) {
    issues.push(issue("MISSING_ORACAL_ROLL", VOLUME_ROLL_PROFILE_FIELD));
  }
  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const color = lookupColor(colorId!, input.extraColors);
  if (!color) {
    return { ok: false, issues: [issue("INVALID_COLOR", VOLUME_COLOR_ID_FIELD)] };
  }
  if (!color.active) {
    return { ok: false, issues: [issue("INACTIVE_COLOR", VOLUME_COLOR_ID_FIELD)] };
  }
  if (!colorMatchesSeries(series, color)) {
    return { ok: false, issues: [issue("WRONG_SERIES_COLOR", VOLUME_COLOR_ID_FIELD)] };
  }

  const roll = lookupRoll(rollId!, organization, input.extraRolls);
  if (!roll) {
    return { ok: false, issues: [issue("INVALID_ROLL", VOLUME_ROLL_PROFILE_FIELD)] };
  }
  if (!roll.active) {
    return { ok: false, issues: [issue("INACTIVE_ROLL", VOLUME_ROLL_PROFILE_FIELD)] };
  }
  if (roll.family !== "oracal") {
    return { ok: false, issues: [issue("WRONG_FAMILY_ROLL", VOLUME_ROLL_PROFILE_FIELD)] };
  }

  const resolveColor = series === "641" ? projectOracal641Color(color) : color;
  const compatibility = resolveFinishCompatibility({
    slot: "VOLUME",
    allowedApplicationIds: allowed,
    organization,
    extraColors: [
      ...(input.extraColors ?? []),
      ...(series === "641" ? [resolveColor] : []),
    ],
    selection: {
      slot: "VOLUME",
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
    snapshotValues: {
      ...snapshotColor(applicationId, color),
      [VOLUME_ROLL_WIDTH_MM_FIELD]: roll.widthMm,
    },
  };
}

export function deriveLettersVolumeApplicationId(
  values: DraftValues,
): FinishApplicationId | undefined {
  const snap = values[VOLUME_FINISH_APPLICATION_FIELD];
  if (typeof snap === "string" && isFinishApplicationId(snap)) {
    return snap;
  }
  if (values[VOLUME_FINISH_FIELD] === "vinyl") {
    return "return_cant_volum_wrapping";
  }
  const finish = readFinish(values);
  if (finish === "stock") {
    return "return_stock";
  }
  if (finish === "painted") {
    return "return_ral";
  }
  if (finish === "oracal") {
    const series = readSeries(values);
    return series ? SERIES_APPLICATION[series] : undefined;
  }
  return undefined;
}

export function formatLettersVolumeField(
  fieldId: string,
  value: DraftValue | undefined,
  values: DraftValues,
  options?: ProductConfigurationOptions | null,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (fieldId === VOLUME_COLOR_ID_FIELD || fieldId === VOLUME_RAL_COLOR_ID_FIELD) {
    const code = values[VOLUME_COLOR_CODE_FIELD];
    const name = values[VOLUME_COLOR_DISPLAY_NAME_FIELD];
    if (typeof code === "string" && typeof name === "string") {
      return formatColorDisplay(fieldId, code, name);
    }
    const match = options?.catalogColors[fieldId]?.find((item) => item.id === value);
    return match ? formatColorDisplay(fieldId, match.code, match.displayName) : null;
  }
  if (fieldId === VOLUME_ROLL_PROFILE_FIELD) {
    const width = values[VOLUME_ROLL_WIDTH_MM_FIELD];
    if (typeof width === "number") {
      return `Rolă ${width} mm`;
    }
    const match = options?.catalogRolls[fieldId]?.find((item) => item.id === value);
    return match ? `Rolă ${match.widthMm} mm` : null;
  }
  if (fieldId === VOLUME_FINISH_FIELD && value === "oracal") {
    const series = readSeries(values);
    return series ? `Oracal ${series}` : "Oracal";
  }
  if (fieldId === VOLUME_STOCK_COLOR_FIELD && typeof value === "string") {
    return value;
  }
  const select = options?.selectOptions[fieldId]?.find((item) => item.value === String(value));
  return select?.label ?? null;
}

export function lettersVolumeReadyValues(
  kind: "stock" | "641" | "651" | "painted",
): DraftValues {
  const perimeter = {
    "volume.depthMm": "60",
    "volume.confirmedPerimeterMm": 12500,
  };
  switch (kind) {
    case "stock":
      return { [VOLUME_FINISH_FIELD]: "stock", ...perimeter };
    case "641":
      return {
        [VOLUME_FINISH_FIELD]: "oracal",
        [VOLUME_VINYL_SERIES_FIELD]: "641",
        [VOLUME_COLOR_ID_FIELD]: LETTERS_VOLUME_COLOR_651_010_ID,
        [VOLUME_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
        ...perimeter,
      };
    case "651":
      return {
        [VOLUME_FINISH_FIELD]: "oracal",
        [VOLUME_VINYL_SERIES_FIELD]: "651",
        [VOLUME_COLOR_ID_FIELD]: LETTERS_VOLUME_COLOR_651_010_ID,
        [VOLUME_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
        ...perimeter,
      };
    case "painted":
      return {
        [VOLUME_FINISH_FIELD]: "painted",
        [VOLUME_RAL_COLOR_ID_FIELD]: LETTERS_VOLUME_RAL_9005_ID,
        ...perimeter,
      };
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function snapshotColor(applicationId: FinishApplicationId, color: ColorCatalogItem): DraftValues {
  return {
    [VOLUME_FINISH_APPLICATION_FIELD]: applicationId,
    [VOLUME_COLOR_CODE_FIELD]: color.code,
    [VOLUME_COLOR_DISPLAY_NAME_FIELD]: color.displayName,
    [VOLUME_COLOR_SWATCH_FIELD]: color.swatch,
  };
}

function formatColorDisplay(fieldId: string, code: string, name: string): string {
  if (fieldId === VOLUME_RAL_COLOR_ID_FIELD) {
    const prefixed = code.toUpperCase().startsWith("RAL") ? code : `RAL ${code}`;
    return `${prefixed} — ${name}`;
  }
  return `${code} — ${name}`;
}

function listColorsForSeries(series: LettersVolumeVinylSeries): ColorCatalogItem[] {
  switch (series) {
    case "641":
    case "651":
      return listColorsBySystem("ORACAL_651");
    default: {
      const _exhaustive: never = series;
      return _exhaustive;
    }
  }
}

function colorMatchesSeries(series: LettersVolumeVinylSeries, color: ColorCatalogItem): boolean {
  switch (series) {
    case "641":
      return color.system === "ORACAL_641" || color.system === "ORACAL_651";
    case "651":
      return color.system === "ORACAL_651";
    default: {
      const _exhaustive: never = series;
      return _exhaustive;
    }
  }
}

function matchLegacyOracalColor(raw: string | undefined): ColorCatalogItem | undefined {
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

function matchLegacyRalColor(raw: string | undefined): ColorCatalogItem | undefined {
  if (!raw) {
    return undefined;
  }
  const colors = listColorsBySystem("RAL").filter((item) => item.active);
  const normalized = normalizeColorCode("RAL", raw).toLowerCase();
  const byCode = colors.filter(
    (item) => normalizeColorCode("RAL", item.code).toLowerCase() === normalized,
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
  return extra?.find((item) => item.id === id) ?? getColorById(id, extra ?? []);
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

function readFinish(values: DraftValues): LettersVolumeFinish | undefined {
  const value = values[VOLUME_FINISH_FIELD];
  if (value === "stock" || value === "oracal" || value === "painted") {
    return value;
  }
  if (value === "none") {
    return "stock";
  }
  if (value === "vinyl") {
    return "oracal";
  }
  return undefined;
}

function readSeries(values: DraftValues): LettersVolumeVinylSeries | undefined {
  const value = values[VOLUME_VINYL_SERIES_FIELD];
  if (value === "641" || value === "651") {
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

function issue(code: LettersVolumeBlockCode, fieldId: string): LettersVolumeIssue {
  return {
    code,
    fieldId,
    fieldLabel: FIELD_LABELS[fieldId] ?? fieldId,
  };
}

function compatibilityIssue(code: string): LettersVolumeIssue {
  if (code === "ORG_CAPABILITY_DISABLED") {
    return issue("ORG_CAPABILITY_DISABLED", VOLUME_FINISH_FIELD);
  }
  return issue("PRODUCT_TRUTH_CONFLICT", VOLUME_FINISH_FIELD);
}
