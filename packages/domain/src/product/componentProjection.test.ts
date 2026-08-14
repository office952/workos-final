import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "./frontlitPlexiAl06.js";
import { projectComponentArchitecture } from "./componentProjection.js";
import { seededDisplayLabelCatalog } from "./displayMetadata.js";

describe("component architecture projection", () => {
  it("projects the four roles from real contracts and templates", () => {
    const roles = projectComponentArchitecture(seededDisplayLabelCatalog());
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
    const face = projectComponentArchitecture(seededDisplayLabelCatalog()).find((item) => item.role === "FACE");
    expect(face?.types[0]?.typeId).toBe("PLEXIGLAS_FACE");
    expect(face?.types[0]?.label).toBe("Plexiglas");
    expect(face?.types[0]?.usedBy).toEqual([
      expect.objectContaining({
        productCode: CANONICAL_PRODUCT_CODE,
        productLabel:
          "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
      }),
    ]);
    expect(face?.types[0]?.independentCalculation).toBe(true);
    expect(face?.types[0]?.processIds).toEqual(["CUT_SHEET_CNC"]);
    expect(face?.types[0]?.processRequirements).toEqual([
      { processId: "CUT_SHEET_CNC", label: "Debitare foaie CNC" },
      {
        processId: "APPLY_SURFACE_FINISH",
        label: "Aplicare folie (Finisaj față: Colantat)",
      },
    ]);
    expect(
      face?.types[0]?.configurations[0]?.attributes.find((item) => item.id === "face.opticalType"),
    ).toEqual(
      expect.objectContaining({
        valueDisplay: "Opal",
        ownership: "MATERIAL_IDENTITY",
      }),
    );
  });

  it("keeps lighting partial and projects canonical technical settings", () => {
    const lighting = projectComponentArchitecture(seededDisplayLabelCatalog()).find(
      (item) => item.role === "LIGHTING",
    );
    expect(lighting?.types[0]?.eic).toBe("Indisponibil");
    expect(lighting?.types[0]?.gaps).toEqual([
      "Cantitatea de module LED nu poate fi calculată: pasul LED nu are o bază geometrică confirmată",
      "Sarcina LED nu poate fi calculată: lipsesc cantitatea de module și puterea pe modul",
      "Capacitatea minimă a sursei nu poate fi calculată: sarcina LED nu este cunoscută",
      "Selecția fizică a sursei nu este disponibilă: nu există catalog canonic de PSU",
    ]);
    expect(lighting?.types[0]?.technicalSettings).toEqual([
      expect.objectContaining({
        id: "ledPitchMm",
        valueDisplay: "100 mm",
        statusLabel: "Setat",
        sourceLabel: "Confirmat de owner",
      }),
      expect.objectContaining({
        id: "psuReservePercent",
        valueDisplay: "25 %",
        statusLabel: "Setat",
        sourceLabel: "Confirmat de owner",
        administrationLabel: "Configurabil",
      }),
    ]);
    expect(lighting?.types[0]?.calculationInputs[0]?.label).toBe(
      "Bază geometrică module LED",
    );
    expect(lighting?.types[0]?.calculationResults.map((item) => item.label)).toEqual([
      "Cantitate module LED",
      "Sarcină LED",
      "Capacitate minimă sursă",
      "Selecție fizică sursă",
    ]);
    expect(
      projectComponentArchitecture(seededDisplayLabelCatalog()).find((item) => item.role === "FACE")?.types[0]
        ?.technicalSettings,
    ).toEqual([]);
  });

  it("shows BACK receiving FACE area from current product composition", () => {
    const back = projectComponentArchitecture(seededDisplayLabelCatalog()).find((item) => item.role === "BACK");
    expect(back?.types[0]?.usedBy[0]?.inputNote).toMatch(/Față/);
  });
});
