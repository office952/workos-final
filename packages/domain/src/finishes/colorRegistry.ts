import { colorCatalogId, isManualOracal641ColorId, manualOracal641ColorId, normalizeColorCode } from "./colorIds.js";
import { ORACAL_651_ROWS } from "./colors/oracal651.js";
import { ORACAL_8500_ROWS } from "./colors/oracal8500.js";
import { RAL_CLASSIC_ROWS } from "./colors/ralClassic.js";
import type { ColorCatalogItem, ColorSystem } from "./types.js";

export const COLOR_REGISTRY_SOURCE = "LEGACY_COLOR_REGISTRY" as const;

function fromRow(
  system: Exclude<ColorSystem, "ORACAL_641">,
  brand: ColorCatalogItem["brand"],
  series: ColorCatalogItem["series"],
  row: readonly [string, string, string],
  translucent: boolean,
): ColorCatalogItem {
  const [code, displayName, swatch] = row;
  return {
    id: colorCatalogId(system, code),
    system,
    brand,
    series,
    code,
    displayName,
    swatch,
    translucent,
    active: true,
    source: COLOR_REGISTRY_SOURCE,
    needsReview: false,
  };
}

export const ralClassicColors: readonly ColorCatalogItem[] = RAL_CLASSIC_ROWS.map((row) =>
  fromRow("RAL", "RAL", null, row, false),
);

export const oracal651Colors: readonly ColorCatalogItem[] = ORACAL_651_ROWS.map((row) =>
  fromRow("ORACAL_651", "Oracal", "651", row, false),
);

export const oracal8500Colors: readonly ColorCatalogItem[] = ORACAL_8500_ROWS.map((row) =>
  fromRow("ORACAL_8500", "Oracal", "8500", row, true),
);

export function projectOracal641Color(source: ColorCatalogItem): ColorCatalogItem {
  return {
    id: colorCatalogId("ORACAL_641", source.code),
    system: "ORACAL_641",
    brand: "Oracal",
    series: "641",
    code: source.code,
    displayName: source.displayName,
    swatch: source.swatch,
    translucent: source.translucent,
    active: source.active,
    source: COLOR_REGISTRY_SOURCE,
    needsReview: false,
  };
}

export function listOracal641ProjectedColors(
  palette: readonly ColorCatalogItem[] = oracal651Colors,
): ColorCatalogItem[] {
  return palette
    .filter((item) => item.system === "ORACAL_651" && item.active)
    .map((item) => projectOracal641Color(item));
}

export function createManualOracal641Color(
  code: string,
  displayName?: string,
): ColorCatalogItem {
  const normalized = normalizeColorCode("ORACAL_641", code);
  return {
    id: manualOracal641ColorId(normalized),
    system: "ORACAL_641",
    brand: "Oracal",
    series: "641",
    code: normalized,
    displayName: displayName?.trim() || normalized,
    swatch: "",
    translucent: false,
    active: true,
    source: "OPERATOR_MANUAL",
    needsReview: true,
  };
}

export function listStoredColors(): readonly ColorCatalogItem[] {
  return [...ralClassicColors, ...oracal651Colors, ...oracal8500Colors];
}

export function listColorsBySystem(
  system: ColorSystem,
  extra: readonly ColorCatalogItem[] = [],
): ColorCatalogItem[] {
  switch (system) {
    case "RAL":
      return [...ralClassicColors, ...extra.filter((item) => item.system === "RAL")];
    case "ORACAL_651":
      return [...oracal651Colors, ...extra.filter((item) => item.system === "ORACAL_651")];
    case "ORACAL_8500":
      return [...oracal8500Colors, ...extra.filter((item) => item.system === "ORACAL_8500")];
    case "ORACAL_641":
      return [
        ...listOracal641ProjectedColors(),
        ...extra.filter((item) => item.system === "ORACAL_641"),
      ];
    default: {
      const _exhaustive: never = system;
      return _exhaustive;
    }
  }
}

export function getColorById(
  id: string,
  extra: readonly ColorCatalogItem[] = [],
): ColorCatalogItem | undefined {
  const fromExtra = extra.find((item) => item.id === id);
  if (fromExtra) {
    return fromExtra;
  }
  if (isManualOracal641ColorId(id)) {
    return undefined;
  }
  if (id.startsWith("oracal:641:")) {
    const code = id.slice("oracal:641:".length);
    const source = oracal651Colors.find((item) => item.code === code);
    return source ? projectOracal641Color(source) : undefined;
  }
  return listStoredColors().find((item) => item.id === id);
}

export function resolveColorReference(
  system: ColorSystem,
  code: string,
  extra: readonly ColorCatalogItem[] = [],
): ColorCatalogItem | undefined {
  const normalized = normalizeColorCode(system, code);
  if (system === "ORACAL_641") {
    const projected = listOracal641ProjectedColors().find((item) => item.code === normalized);
    if (projected) {
      return projected;
    }
    const manual = extra.find(
      (item) => item.system === "ORACAL_641" && item.code === normalized,
    );
    return manual ?? createManualOracal641Color(normalized);
  }
  return listColorsBySystem(system, extra).find((item) => item.code === normalized);
}
