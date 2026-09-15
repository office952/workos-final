import { describe, expect, it } from "vitest";
import { colorCatalogId } from "./colorIds.js";
import {
  createManualOracal641Color,
  getColorById,
  listColorsBySystem,
  listOracal641ProjectedColors,
  listStoredColors,
  oracal651Colors,
  oracal8500Colors,
  projectOracal641Color,
  ralClassicColors,
  resolveColorReference,
} from "./colorRegistry.js";

describe("color registry foundation", () => {
  it("normalizes the proven RAL, 651, and 8500 counts with unique ids", () => {
    expect(ralClassicColors).toHaveLength(213);
    expect(oracal651Colors).toHaveLength(79);
    expect(oracal8500Colors).toHaveLength(55);
    const stored = listStoredColors();
    const ids = stored.map((item) => item.id);
    expect(new Set(ids).size).toBe(stored.length);
    expect(ralClassicColors.every((item) => item.system === "RAL" && item.swatch.startsWith("#"))).toBe(
      true,
    );
  });

  it("looks up RAL, 651, and translucent 8500 by stable id", () => {
    const ral = getColorById("ral:9010");
    expect(ral).toMatchObject({
      system: "RAL",
      brand: "RAL",
      code: "9010",
      displayName: "Pure white",
      swatch: "#FFFFFF",
      translucent: false,
      source: "LEGACY_COLOR_REGISTRY",
    });
    const vinyl = getColorById("oracal:651:010");
    expect(vinyl).toMatchObject({
      system: "ORACAL_651",
      series: "651",
      code: "010",
      displayName: "White",
    });
    const translucent = getColorById("oracal:8500:010");
    expect(translucent).toMatchObject({
      system: "ORACAL_8500",
      series: "8500",
      translucent: true,
      displayName: "White",
    });
    expect(oracal8500Colors.every((item) => item.translucent)).toBe(true);
  });

  it("projects 641 from 651 without collapsing identity", () => {
    const source = oracal651Colors.find((item) => item.code === "031");
    expect(source).toBeDefined();
    if (!source) {
      throw new Error("expected 651 031");
    }
    const projected = projectOracal641Color(source);
    expect(projected.id).toBe(colorCatalogId("ORACAL_641", "031"));
    expect(projected.system).toBe("ORACAL_641");
    expect(projected.series).toBe("641");
    expect(projected.code).toBe(source.code);
    expect(projected.displayName).toBe(source.displayName);
    expect(projected.swatch).toBe(source.swatch);
    expect(source.system).toBe("ORACAL_651");
    expect(source.series).toBe("651");
    expect(getColorById("oracal:641:031")).toEqual(projected);
    expect(listOracal641ProjectedColors()).toHaveLength(79);
    expect(listColorsBySystem("ORACAL_641").every((item) => item.system === "ORACAL_641")).toBe(
      true,
    );
  });

  it("creates a 641 manual fallback that needs review", () => {
    const manual = createManualOracal641Color("999", "Cod atelier");
    expect(manual).toMatchObject({
      id: "oracal:641:manual:999",
      system: "ORACAL_641",
      series: "641",
      code: "999",
      displayName: "Cod atelier",
      source: "OPERATOR_MANUAL",
      needsReview: true,
    });
    expect(oracal651Colors.some((item) => item.code === "999")).toBe(false);
    const resolved = resolveColorReference("ORACAL_641", "999");
    expect(resolved?.source).toBe("OPERATOR_MANUAL");
    expect(resolved?.needsReview).toBe(true);
  });
});
