import type { ComponentVariantId } from "./types.js";

export const LED_PITCH_SETTING_ID = "ledPitchMm";
export const PSU_RESERVE_SETTING_ID = "psuReservePercent";

export const TECHNICAL_SETTING_VALUE_TYPES = ["number"] as const;
export const TECHNICAL_SETTING_UNITS = ["mm", "percent"] as const;
export const TECHNICAL_SETTING_CLASSIFICATIONS = [
  "OWNER_CONFIRMED",
  "OWNER_DECISION_REQUIRED",
] as const;

export type TechnicalSettingValueType = (typeof TECHNICAL_SETTING_VALUE_TYPES)[number];
export type TechnicalSettingUnit = (typeof TECHNICAL_SETTING_UNITS)[number];
export type TechnicalSettingClassification =
  (typeof TECHNICAL_SETTING_CLASSIFICATIONS)[number];

export type TechnicalSettingResolution =
  | { readonly status: "RESOLVED"; readonly value: number }
  | { readonly status: "UNRESOLVED"; readonly reason: "OWNER_DECISION_REQUIRED" };

export type ComponentTechnicalSettingDefinition = {
  readonly id: string;
  readonly variantId: ComponentVariantId;
  readonly label: string;
  readonly description: string;
  readonly valueType: TechnicalSettingValueType;
  readonly unit: TechnicalSettingUnit;
  readonly resolution: TechnicalSettingResolution;
  readonly source: string;
  readonly classification: TechnicalSettingClassification;
  readonly configurable: boolean;
  readonly unresolvedReason: string;
  readonly note?: string;
  readonly constraints?: {
    readonly min?: number;
    readonly max?: number;
  };
};

export type ComponentTechnicalSettingProjection = {
  readonly id: string;
  readonly label: string;
  readonly valueDisplay: string;
  readonly statusLabel: string;
  readonly sourceLabel: string;
  readonly administrationLabel: string;
};

export type TechnicalSettingsRegistry = {
  readonly definitions: readonly ComponentTechnicalSettingDefinition[];
  get(
    variantId: ComponentVariantId,
    id: string,
  ): ComponentTechnicalSettingDefinition | undefined;
  listByVariant(variantId: ComponentVariantId): readonly ComponentTechnicalSettingDefinition[];
};

export function createTechnicalSettingsRegistry(
  definitions: readonly ComponentTechnicalSettingDefinition[],
): TechnicalSettingsRegistry {
  const seen = new Set<string>();
  for (const setting of definitions) {
    validateSetting(setting);
    const key = settingKey(setting.variantId, setting.id);
    if (seen.has(key)) {
      throw new Error(`Duplicate technical setting: ${key}`);
    }
    seen.add(key);
  }

  return {
    definitions,
    get(variantId, id) {
      return definitions.find(
        (item) => item.variantId === variantId && item.id === id,
      );
    },
    listByVariant(variantId) {
      return definitions.filter((item) => item.variantId === variantId);
    },
  };
}

export const lightingFrontLedTechnicalSettings: readonly ComponentTechnicalSettingDefinition[] =
  [
    {
      id: LED_PITCH_SETTING_ID,
      variantId: "LIGHTING_FRONT_LED",
      label: "Pas module LED",
      description:
        "Distanța aproximativă curentă între modulele LED. Parametru tehnic configurabil, nu o lege fizică imuabilă.",
      valueType: "number",
      unit: "mm",
      resolution: { status: "RESOLVED", value: 100 },
      source: "owner technical decision",
      classification: "OWNER_CONFIRMED",
      configurable: true,
      unresolvedReason: "Regula de pas LED nu este stabilită",
      note: "Valoare activă canonică. Documentația explică; calculul consumă.",
    },
    {
      id: PSU_RESERVE_SETTING_ID,
      variantId: "LIGHTING_FRONT_LED",
      label: "Rezervă sursă de alimentare",
      description:
        "Rezerva sursei de alimentare pentru iluminarea frontală. Fără valoare numerică până la decizia ownerului.",
      valueType: "number",
      unit: "percent",
      resolution: { status: "UNRESOLVED", reason: "OWNER_DECISION_REQUIRED" },
      source: "owner technical decision",
      classification: "OWNER_DECISION_REQUIRED",
      configurable: true,
      unresolvedReason: "Regula de rezervă PSU nu este stabilită",
    },
  ];

export const componentTechnicalSettingsRegistry = createTechnicalSettingsRegistry(
  lightingFrontLedTechnicalSettings,
);

export function listVariantTechnicalSettings(
  variantId: ComponentVariantId,
): readonly ComponentTechnicalSettingDefinition[] {
  return componentTechnicalSettingsRegistry.listByVariant(variantId);
}

export function unresolvedSettingReasons(
  settings: readonly ComponentTechnicalSettingDefinition[],
  requiredIds: readonly string[],
): string[] {
  return requiredIds.flatMap((id) => {
    const setting = settings.find((item) => item.id === id);
    if (setting?.resolution.status === "RESOLVED") {
      return [];
    }
    return [setting?.unresolvedReason ?? `Setarea tehnică ${id} nu este stabilită`];
  });
}

export function projectTechnicalSettings(
  variantId: ComponentVariantId,
): readonly ComponentTechnicalSettingProjection[] {
  return listVariantTechnicalSettings(variantId).map(projectTechnicalSetting);
}

export function projectTechnicalSetting(
  setting: ComponentTechnicalSettingDefinition,
): ComponentTechnicalSettingProjection {
  const resolved = setting.resolution.status === "RESOLVED";
  return {
    id: setting.id,
    label: setting.label,
    valueDisplay: resolved
      ? formatSettingValue(setting.resolution.value, setting.unit)
      : "Nesetat",
    statusLabel: resolved ? "Setat" : "Necesită decizie owner",
    sourceLabel: sourceLabel(setting.classification),
    administrationLabel: setting.configurable ? "Configurabil" : "Fix",
  };
}

function settingKey(variantId: ComponentVariantId, id: string): string {
  return `${variantId}:${id}`;
}

function validateSetting(setting: ComponentTechnicalSettingDefinition): void {
  if (setting.id.trim().length === 0) {
    throw new Error("Technical setting id is required");
  }
  if (setting.classification === "OWNER_CONFIRMED") {
    if (setting.resolution.status !== "RESOLVED") {
      throw new Error(`${setting.id} is owner-confirmed but not resolved`);
    }
  }
  if (setting.classification === "OWNER_DECISION_REQUIRED") {
    if (setting.resolution.status !== "UNRESOLVED") {
      throw new Error(`${setting.id} requires an owner decision but is resolved`);
    }
  }
  if (setting.resolution.status === "RESOLVED") {
    if (!Number.isFinite(setting.resolution.value)) {
      throw new Error(`${setting.id} resolved value must be a finite number`);
    }
    const { min, max } = setting.constraints ?? {};
    if (min !== undefined && setting.resolution.value < min) {
      throw new Error(`${setting.id} is below minimum ${min}`);
    }
    if (max !== undefined && setting.resolution.value > max) {
      throw new Error(`${setting.id} is above maximum ${max}`);
    }
  }
}

function formatSettingValue(value: number, unit: TechnicalSettingUnit): string {
  switch (unit) {
    case "mm":
      return `${value} mm`;
    case "percent":
      return `${value} %`;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

function sourceLabel(classification: TechnicalSettingClassification): string {
  switch (classification) {
    case "OWNER_CONFIRMED":
      return "Confirmat de owner";
    case "OWNER_DECISION_REQUIRED":
      return "Necesită decizie owner";
    default: {
      const _exhaustive: never = classification;
      return _exhaustive;
    }
  }
}
