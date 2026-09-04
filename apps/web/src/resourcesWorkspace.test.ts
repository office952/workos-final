import { describe, expect, it } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  projectResourcesAdministration,
} from "@workos-final/domain";
import {
  costRowsForProduct,
  costStatusDisplay,
  costVariantDisplay,
  filterCostRows,
  filterRecipeRows,
  listWorkspaceRecipes,
  listWorkspaceResources,
  parseProductTemplateFilter,
  parseResourcesWorkspaceView,
  recipeRowsForProduct,
  resourceRowsForProduct,
  resolveProductUsage,
  splitCreateTariffResources,
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

  it("defaults product context to all registered templates", () => {
    expect(parseProductTemplateFilter(null, admin.templateUsages)).toBeNull();
    expect(parseProductTemplateFilter("unknown-template", admin.templateUsages)).toBeNull();
    expect(parseProductTemplateFilter(CANONICAL_PRODUCT_CODE, admin.templateUsages)).toBe(
      CANONICAL_PRODUCT_CODE,
    );
  });

  it("filters workspace rows from generic template usage", () => {
    const letters = resolveProductUsage(admin, CANONICAL_PRODUCT_CODE);
    const acm = resolveProductUsage(admin, ACM_CASSETTE_NONE_PRODUCT_CODE);
    const lettersCosts = costRowsForProduct(admin.costEvidence, letters);
    const acmCosts = costRowsForProduct(admin.costEvidence, acm);
    expect(lettersCosts.some((row) => row.resourceLabel === "Profil aluminiu 0,6 mm")).toBe(true);
    expect(lettersCosts.filter((row) => row.resourceLabel === "Profil aluminiu 0,6 mm")).toHaveLength(
      4,
    );
    expect(acmCosts.some((row) => row.resourceLabel === "Profil aluminiu 0,6 mm")).toBe(false);
    expect(acmCosts.some((row) => row.resourceLabel === "ACM 3 mm")).toBe(true);
    expect(lettersCosts.some((row) => row.resourceLabel === "Ambalare")).toBe(true);
    expect(acmCosts.some((row) => row.resourceLabel === "Ambalare")).toBe(true);

    const lettersResources = resourceRowsForProduct(listWorkspaceResources(admin), letters);
    const acmResources = resourceRowsForProduct(listWorkspaceResources(admin), acm);
    expect(lettersResources.some((row) => row.label === "Plexiglas 3 mm opal")).toBe(true);
    expect(acmResources.some((row) => row.label === "Plexiglas 3 mm opal")).toBe(false);
    expect(lettersResources.some((row) => row.label === "Manoperă montaj la locație")).toBe(false);

    const lettersRecipes = recipeRowsForProduct(listWorkspaceRecipes(admin), letters);
    const acmRecipes = recipeRowsForProduct(listWorkspaceRecipes(admin), acm);
    expect(lettersRecipes.some((row) => row.label === "Formare profil aluminiu")).toBe(true);
    expect(acmRecipes.some((row) => row.label === "Formare profil aluminiu")).toBe(false);
    expect(acmRecipes.some((row) => row.label === "Debitare CNC foaie panou")).toBe(true);
  });

  it("prefers template resources for Adaugă tarif without hiding the rest", () => {
    const letters = resolveProductUsage(admin, CANONICAL_PRODUCT_CODE);
    const split = splitCreateTariffResources(listWorkspaceResources(admin), letters);
    expect(split.preferred.some((row) => row.label === "Profil aluminiu 0,6 mm")).toBe(true);
    expect(split.other.some((row) => row.label === "Manoperă montaj la locație")).toBe(true);
    expect(split.preferred.some((row) => row.label === "Manoperă montaj la locație")).toBe(false);
  });
});
