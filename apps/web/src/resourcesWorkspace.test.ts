import { describe, expect, it } from "vitest";
import { projectResourcesAdministration } from "@workos-final/domain";
import {
  costStatusDisplay,
  costVariantDisplay,
  filterCostRows,
  filterRecipeRows,
  listWorkspaceRecipes,
  parseResourcesWorkspaceView,
  tariffAmountDisplay,
} from "./resourcesWorkspace";

const admin = projectResourcesAdministration();

describe("resourcesWorkspace", () => {
  it("defaults the workspace to Costuri interne", () => {
    expect(parseResourcesWorkspaceView(null)).toBe("costuri");
    expect(parseResourcesWorkspaceView("retete")).toBe("retete");
  });

  it("shows qualifier as a variant, not a technical key", () => {
    const aluminium = admin.costEvidence.find(
      (row) => row.resourceId === "aluminium_return_profile" && row.qualifier?.value === 60,
    );
    expect(aluminium).toBeTruthy();
    expect(costVariantDisplay(aluminium!)).toBe("60 mm");
    expect(tariffAmountDisplay(aluminium!)).toBe("3,00 EUR / m");
    expect(costStatusDisplay(aluminium!)).toBe("Confirmat");
  });

  it("filters the flat cost registry without category navigation", () => {
    const found = filterCostRows(admin.costEvidence, "plexiglas", "Material", "confirmed");
    expect(found.map((row) => row.resourceLabel)).toContain("Plexiglas 3 mm opal");
    expect(filterCostRows(admin.costEvidence, "", "Manoperă", "all").length).toBeGreaterThan(0);
  });

  it("keeps missing recipes in one worklist", () => {
    const recipes = listWorkspaceRecipes(admin);
    expect(recipes.some((row) => row.label === "Formare profil aluminiu")).toBe(true);
    expect(recipes.some((row) => row.completenessLabel === "Lipsă")).toBe(true);
    expect(filterRecipeRows(recipes, "", "Material").length).toBe(0);
  });
});
