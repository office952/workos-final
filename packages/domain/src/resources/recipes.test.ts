import { describe, expect, it } from "vitest";
import {
  BOND_LETTER_BODY_ID,
  CUT_CONTOUR_PLOTTER_ID,
  CUT_SHEET_CNC_ID,
  FORM_ALUMINIUM_PROFILE_ID,
  INSPECT_FINISHED_LETTER_ID,
  operationalProcesses,
  PAINT_RAL_ID,
  PRINT_WIDE_FORMAT_ID,
  WELD_ALUMINIUM_JOIN_ID,
  WELD_STEEL_JOIN_ID,
} from "../processes/catalog.js";
import { coverageForCapability, providersForProcess } from "../workcenters/providers.js";
import { recipeGapForProcess } from "../workcenters/recipeGap.js";
import { RETURN_CANT_FORMING_ID } from "./catalog.js";
import {
  costRecipes,
  expectedRecipeKindForProcess,
  getCostRecipe,
  processesMissingRecipe,
  RCP_PROFILE_FORMING_ID,
  recipeForProcess,
  resolveRecipeInternalCost,
} from "./recipes.js";

describe("cost recipes", () => {
  it("keeps unique recipes and one active forming service recipe", () => {
    expect(costRecipes.map((item) => item.id)).toEqual([RCP_PROFILE_FORMING_ID]);
    const forming = getCostRecipe(RCP_PROFILE_FORMING_ID);
    expect(forming).toEqual(
      expect.objectContaining({
        kind: "SERVICE",
        processIds: [FORM_ALUMINIUM_PROFILE_ID],
        quantityBasis: "VOLUME_PERIMETER_M",
        unit: "m",
        costEvidenceId: RETURN_CANT_FORMING_ID,
        lifecycle: "ACTIVE",
      }),
    );
    expect(recipeForProcess(FORM_ALUMINIUM_PROFILE_ID)?.id).toBe(RCP_PROFILE_FORMING_ID);
    expect(JSON.stringify(costRecipes)).not.toMatch(/hourly|machineHour|employee|EUR\/h/);
  });

  it("resolves forming cost from existing evidence without inventing quantity", () => {
    const resolved = resolveRecipeInternalCost(RCP_PROFILE_FORMING_ID, 12.5);
    expect(resolved).toEqual({
      status: "RESOLVED",
      recipeId: RCP_PROFILE_FORMING_ID,
      resourceId: RETURN_CANT_FORMING_ID,
      quantity: 12.5,
      unit: "m",
      rate: 15,
      currency: "EUR",
      cost: 187.5,
    });
  });

  it("keeps CNC service recipe missing while the machine provider stays covered", () => {
    expect(recipeForProcess(CUT_SHEET_CNC_ID)).toBeUndefined();
    expect(expectedRecipeKindForProcess(CUT_SHEET_CNC_ID)).toBe("SERVICE");
    expect(recipeGapForProcess(CUT_SHEET_CNC_ID)).toBe("SERVICE_RECIPE_MISSING");
    expect(coverageForCapability("CNC_ROUTING")).toBe("COVERED");
    expect(providersForProcess(CUT_SHEET_CNC_ID).map((item) => item.id)).toEqual([
      "MCH-CNC-4020",
    ]);
  });

  it("keeps manual assembly as a missing labor recipe without employee wages", () => {
    expect(expectedRecipeKindForProcess(BOND_LETTER_BODY_ID)).toBe("LABOR");
    expect(recipeForProcess(BOND_LETTER_BODY_ID)).toBeUndefined();
    expect(recipeGapForProcess(BOND_LETTER_BODY_ID)).toBe("LABOR_RECIPE_MISSING");
    expect(providersForProcess(BOND_LETTER_BODY_ID).map((item) => item.id)).toEqual([
      "WC_ASSEMBLY_01",
      "WC_ASSEMBLY_02",
    ]);
    expect(JSON.stringify(operationalProcesses)).not.toMatch(/hourlyRate|wage|employeeId/);
  });

  it("keeps painting recipe missing independently from missing provider", () => {
    expect(recipeForProcess(PAINT_RAL_ID)).toBeUndefined();
    expect(recipeGapForProcess(PAINT_RAL_ID)).toBe("SERVICE_RECIPE_MISSING");
    expect(coverageForCapability("PAINTING")).toBe("NO_PROVIDER");
    expect(expectedRecipeKindForProcess(INSPECT_FINISHED_LETTER_ID)).toBe("LABOR");
    expect(processesMissingRecipe("SERVICE")).toContain(CUT_SHEET_CNC_ID);
    expect(processesMissingRecipe("LABOR")).toContain(BOND_LETTER_BODY_ID);
    expect(processesMissingRecipe("SERVICE")).not.toContain(FORM_ALUMINIUM_PROFILE_ID);
  });

  it("derives service recipe gaps for new shop-floor processes without inventing recipes", () => {
    expect(recipeForProcess(WELD_STEEL_JOIN_ID)).toBeUndefined();
    expect(recipeGapForProcess(WELD_STEEL_JOIN_ID)).toBe("SERVICE_RECIPE_MISSING");
    expect(recipeGapForProcess(WELD_ALUMINIUM_JOIN_ID)).toBe("SERVICE_RECIPE_MISSING");
    expect(recipeGapForProcess(PRINT_WIDE_FORMAT_ID)).toBe("SERVICE_RECIPE_MISSING");
    expect(recipeGapForProcess(CUT_CONTOUR_PLOTTER_ID)).toBe("SERVICE_RECIPE_MISSING");
    expect(expectedRecipeKindForProcess(WELD_STEEL_JOIN_ID)).toBe("SERVICE");
    expect(providersForProcess(WELD_STEEL_JOIN_ID).map((item) => item.id)).toEqual([
      "MCH-WELD-STEEL",
    ]);
    expect(providersForProcess(WELD_ALUMINIUM_JOIN_ID).map((item) => item.id)).toEqual([
      "MCH-WELD-ALU",
    ]);
    expect(providersForProcess(PRINT_WIDE_FORMAT_ID).map((item) => item.id)).toEqual([
      "MCH-EPSON-60800",
    ]);
    expect(providersForProcess(CUT_CONTOUR_PLOTTER_ID).map((item) => item.id)).toEqual([
      "MCH-CUTTER-PLOTTER",
    ]);
    expect(costRecipes.map((item) => item.id)).toEqual([RCP_PROFILE_FORMING_ID]);
  });
});
