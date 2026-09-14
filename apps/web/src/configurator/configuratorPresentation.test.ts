import { describe, expect, it } from "vitest";
import {
  CFG_TITLE_TO_SCOPE_RAIL_PX,
  configuratorRailMode,
  configuratorRailSlot,
  fieldUnitFromLabel,
  projectVisualLabel,
} from "./configuratorPresentation";

describe("configuratorPresentation", () => {
  it("projects Figma Blueprint grammar without changing Product Truth values", () => {
    expect(projectVisualLabel("Material casetă")).toBe("Material");
    expect(projectVisualLabel("Material față")).toBe("Material");
    expect(projectVisualLabel("Finisaj volum")).toBe("Colantare");
    expect(projectVisualLabel("Lățime exterioară (mm)")).toBe("Lățime finală");
    expect(projectVisualLabel("Adâncime volum (mm)")).toBe("Lățime bandă");
    expect(projectVisualLabel("Adâncime casetă")).toBe("Adâncime panou");
    expect(projectVisualLabel("Înălțime exterioară (mm)")).toBe("Înălțime finală");
    expect(projectVisualLabel("Suprafață confirmată (mm²)")).toBe("Suprafață");
    expect(projectVisualLabel("Textul literelor")).toBe("Text");
    expect(projectVisualLabel("Sistem de prindere")).toBe("Sistem");
    expect(projectVisualLabel("Iluminare")).toBe("Sistem");
    expect(projectVisualLabel("Lățime bandă")).toBe("Lățime bandă");
  });

  it("keeps the title-to-rail token in the accepted 16–20px band", () => {
    expect(CFG_TITLE_TO_SCOPE_RAIL_PX).toBe(18);
  });

  it("adapts rail geometry to the real scope count", () => {
    expect(configuratorRailMode(2)).toBe("group");
    expect(configuratorRailMode(3)).toBe("proportional");
    expect(configuratorRailMode(4)).toBe("distributed");
    expect(configuratorRailSlot(0)).toBe(1);
    expect(configuratorRailSlot(1)).toBe(2);
    expect(configuratorRailSlot(2)).toBe(3);
    expect(configuratorRailSlot(3)).toBe(4);
  });

  it("reads units from the field label, not from hardcoded product rules", () => {
    expect(fieldUnitFromLabel("Lățime exterioară (mm)")).toBe("mm");
    expect(fieldUnitFromLabel("Suprafață confirmată (mm²)")).toBe("mm²");
    expect(fieldUnitFromLabel("Denumire lucrare")).toBeNull();
  });
});
