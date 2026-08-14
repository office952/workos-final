import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "./frontlitPlexiAl06.js";
import {
  collectChildCategoryIds,
  computeCategoryDepth,
  projectProductSystemAdministration,
} from "./productSystemAdmin.js";
import type { ProductCategory } from "./types.js";

describe("product system administration projection", () => {
  it("derives family category and product relationships from the catalog", () => {
    const admin = projectProductSystemAdministration();
    expect(admin.families).toHaveLength(1);
    expect(admin.families[0]?.id).toBe("LIGHTED_VOLUMETRIC_SIGNS");
    expect(admin.families[0]?.label).toBe("Litere și semne volumetrice luminoase");
    expect(admin.families[0]?.id).not.toBe(admin.families[0]?.label);
    expect(admin.families[0]?.categoryIds).toHaveLength(3);
    expect(admin.families[0]?.productCodes).toEqual([CANONICAL_PRODUCT_CODE]);
    expect(admin.families[0]?.readiness.lifecycle).toBe("ACTIVE");
    expect(admin.families[0]?.readiness.canDelete).toBe(false);
    expect(admin.categories.map((item) => item.id)).toEqual([
      "FRONT_LIT_VOLUMETRIC_LETTERS",
      "HALO_LIT_VOLUMETRIC_LETTERS",
      "FULL_ALUMINIUM_VOLUMETRIC_LETTERS",
    ]);
    const used = admin.categories.find((item) => item.id === "FRONT_LIT_VOLUMETRIC_LETTERS");
    const empty = admin.categories.find((item) => item.id === "HALO_LIT_VOLUMETRIC_LETTERS");
    expect(used?.productCodes).toEqual([CANONICAL_PRODUCT_CODE]);
    expect(used?.readiness.canDelete).toBe(false);
    expect(used?.readiness.deleteBlockers[0]).toMatch(/1 produs/);
    expect(empty?.productCodes).toEqual([]);
    expect(empty?.readiness.canDelete).toBe(true);
    expect(empty?.readiness.canRetire).toBe(true);
  });

  it("derives product composition settings and products-using without duplicate lists", () => {
    const admin = projectProductSystemAdministration();
    const product = admin.products[0];
    expect(product?.code).toBe(CANONICAL_PRODUCT_CODE);
    expect(product?.code).not.toBe(product?.label);
    expect(product?.familyId).toBe("LIGHTED_VOLUMETRIC_SIGNS");
    expect(product?.categoryId).toBe("FRONT_LIT_VOLUMETRIC_LETTERS");
    expect(product?.formSchemaId).toBe("prd-letters-frontlit-plexi-al06-form-v1");
    expect(product?.formBound).toBe(true);
    expect(product?.composition.map((item) => item.variantId)).toEqual([
      "FACE_PLEXIGLAS_3MM",
      "VOLUME_ALUMINIUM_06",
      "BACK_FOREX_10MM",
      "LIGHTING_FRONT_LED",
    ]);
    expect(product?.readiness.canDelete).toBe(false);
    expect(product?.readiness.canRetire).toBe(true);
    expect(product?.readiness.editClasses).toContain("DISPLAY_EDITABLE");
    expect(product?.unresolvedAreas).toContain("Regula de rezervă PSU nu este stabilită");

    const lighting = admin.variants.find((item) => item.variantId === "LIGHTING_FRONT_LED");
    expect(lighting?.usedByProductCodes).toEqual([CANONICAL_PRODUCT_CODE]);
    expect(lighting?.usedByLabels[0]).toContain("Litere volumetrice luminoase");
    expect(lighting?.independentCalculation).toBe(true);
    expect(lighting?.technicalSettings.map((item) => item.id)).toEqual([
      "ledPitchMm",
      "psuReservePercent",
    ]);
    expect(lighting?.technicalSettings[0]?.valueDisplay).toBe("100 mm");
    expect(lighting?.readiness.canDelete).toBe(false);
    expect(lighting?.readiness.editClasses).toContain("TECHNICAL_SETTING_EDITABLE");
    expect(lighting?.readiness.editClasses).toContain("CODE_CONTRACT_ONLY");

    const ids = [
      ...admin.families.map((item) => item.id),
      ...admin.categories.map((item) => item.id),
      ...admin.products.map((item) => item.code),
      ...admin.variants.map((item) => item.variantId),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("walks recursive categories without assuming two levels", () => {
    const nested: ProductCategory[] = [
      {
        id: "root",
        familyId: "F",
        parentId: null,
        label: "Root",
        sortOrder: 1,
      },
      {
        id: "mid",
        familyId: "F",
        parentId: "root",
        label: "Mid",
        sortOrder: 1,
      },
      {
        id: "leaf",
        familyId: "F",
        parentId: "mid",
        label: "Leaf",
        sortOrder: 1,
      },
    ];
    expect(collectChildCategoryIds(nested, "root")).toEqual(["mid"]);
    expect(collectChildCategoryIds(nested, "mid")).toEqual(["leaf"]);
    expect(computeCategoryDepth(nested, "leaf")).toBe(2);
    expect(computeCategoryDepth(nested, "root")).toBe(0);
  });
});
