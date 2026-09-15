import type { ColorSystem } from "./types.js";

export function normalizeColorCode(system: ColorSystem, code: string): string {
  let normalized = code.trim();
  if (system === "RAL") {
    return normalized.replace(/^ral[\s-]*/i, "").replace(/\s+/g, "");
  }
  normalized = normalized.replace(/^oracal[\s-]*/i, "");
  switch (system) {
    case "ORACAL_641":
      return normalized.replace(/^641[\s-]*/i, "");
    case "ORACAL_651":
      return normalized.replace(/^651[\s-]*/i, "");
    case "ORACAL_8500":
      return normalized.replace(/^8500[\s-]*/i, "");
    default: {
      const _exhaustive: never = system;
      return _exhaustive;
    }
  }
}

export function colorCatalogId(system: ColorSystem, code: string): string {
  const normalized = normalizeColorCode(system, code);
  switch (system) {
    case "RAL":
      return `ral:${normalized}`;
    case "ORACAL_641":
      return `oracal:641:${normalized}`;
    case "ORACAL_651":
      return `oracal:651:${normalized}`;
    case "ORACAL_8500":
      return `oracal:8500:${normalized}`;
    default: {
      const _exhaustive: never = system;
      return _exhaustive;
    }
  }
}

export function manualOracal641ColorId(code: string): string {
  return `oracal:641:manual:${normalizeColorCode("ORACAL_641", code)}`;
}

export function isManualOracal641ColorId(id: string): boolean {
  return id.startsWith("oracal:641:manual:");
}

export function colorIdCode(id: string): string | undefined {
  const parts = id.split(":");
  if (isManualOracal641ColorId(id)) {
    return parts[3];
  }
  if (parts[0] === "ral") {
    return parts[1];
  }
  if (parts[0] === "oracal" && parts.length >= 3) {
    return parts[2];
  }
  return undefined;
}
