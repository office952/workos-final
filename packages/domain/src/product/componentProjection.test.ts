import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "./frontlitPlexiAl06.js";
import { projectComponentArchitecture } from "./componentProjection.js";

describe("component architecture projection", () => {
  it("projects the four roles from real contracts and templates", () => {
    const roles = projectComponentArchitecture();
    expect(roles.map((item) => item.role)).toEqual([
      "FACE",
      "VOLUME",
      "BACK",
      "LIGHTING",
    ]);
    expect(roles.map((item) => item.label)).toEqual([
      "Față",
      "Volum",
      "Spate",
      "Iluminare",
    ]);
    expect(JSON.stringify(roles)).not.toMatch(/RETURN_CANT|Cant\b/);
  });

  it("derives products using a variant from templates, not a hardcoded list", () => {
    const face = projectComponentArchitecture().find((item) => item.role === "FACE");
    expect(face?.variants[0]?.variantId).toBe("FACE_PLEXIGLAS_3MM");
    expect(face?.variants[0]?.usedBy).toEqual([
      expect.objectContaining({
        productCode: CANONICAL_PRODUCT_CODE,
        productLabel:
          "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
      }),
    ]);
    expect(face?.variants[0]?.independentCalculation).toBe(true);
  });

  it("keeps lighting unavailable and projects canonical technical settings", () => {
    const lighting = projectComponentArchitecture().find(
      (item) => item.role === "LIGHTING",
    );
    expect(lighting?.variants[0]?.eic).toBe("Indisponibil");
    expect(lighting?.variants[0]?.gaps).toEqual([
      "Regula de rezervă PSU nu este stabilită",
    ]);
    expect(lighting?.variants[0]?.technicalSettings).toEqual([
      expect.objectContaining({
        id: "ledPitchMm",
        valueDisplay: "100 mm",
        statusLabel: "Setat",
        sourceLabel: "Confirmat de owner",
      }),
      expect.objectContaining({
        id: "psuReservePercent",
        valueDisplay: "Nesetat",
        statusLabel: "Necesită decizie owner",
      }),
    ]);
    expect(
      projectComponentArchitecture().find((item) => item.role === "FACE")?.variants[0]
        ?.technicalSettings,
    ).toEqual([]);
  });

  it("shows BACK receiving FACE area from current product composition", () => {
    const back = projectComponentArchitecture().find((item) => item.role === "BACK");
    expect(back?.variants[0]?.usedBy[0]?.inputNote).toMatch(/Față/);
  });
});
