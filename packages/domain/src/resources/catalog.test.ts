import { describe, expect, it } from "vitest";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  FOREX_10MM_ID,
  MAT_LED_MODULE_ID,
  MAT_LED_PSU_12V_100W_ID,
  MAT_LED_PSU_12V_160W_ID,
  MAT_LED_PSU_12V_200W_ID,
  MAT_LED_PSU_12V_60W_ID,
  PLEXIGLAS_3MM_OPAL_ID,
  RETURN_CANT_FORMING_ID,
  costEvidence,
  getCostEvidence,
  getResource,
  listMaterialSpecifications,
  listServiceResources,
  matchMaterialSpecification,
  matchMaterialSpecificationIn,
  materialFamilies,
  resourceCatalog,
  resourceKindLabel,
  type ResourceDefinition,
} from "./catalog.js";

const plexiglas5mmOpalFixture: ResourceDefinition = {
  id: "plexiglas_5mm_opal",
  label: "Plexiglas 5 mm opal",
  kind: "MATERIAL",
  unit: "m2",
  familyId: "PLEXIGLAS",
  specification: {
    familyId: "PLEXIGLAS",
    form: "sheet",
    thicknessMm: 5,
    opticalType: "opal",
  },
};

const forex5mmFixture: ResourceDefinition = {
  id: "forex_5mm",
  label: "Forex 5 mm",
  kind: "MATERIAL",
  unit: "m2",
  familyId: "FOREX",
  specification: {
    familyId: "FOREX",
    form: "sheet",
    thicknessMm: 5,
  },
};

describe("resource catalog", () => {
  it("keeps unique resource identities", () => {
    const ids = resourceCatalog.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      PLEXIGLAS_3MM_OPAL_ID,
      FOREX_10MM_ID,
      ALUMINIUM_RETURN_PROFILE_ID,
      RETURN_CANT_FORMING_ID,
      MAT_LED_MODULE_ID,
      MAT_LED_PSU_12V_60W_ID,
      MAT_LED_PSU_12V_100W_ID,
      MAT_LED_PSU_12V_160W_ID,
      MAT_LED_PSU_12V_200W_ID,
    ]);
  });

  it("classifies live resources as material or service", () => {
    expect(getResource(PLEXIGLAS_3MM_OPAL_ID)?.kind).toBe("MATERIAL");
    expect(getResource(FOREX_10MM_ID)?.kind).toBe("MATERIAL");
    expect(getResource(ALUMINIUM_RETURN_PROFILE_ID)?.kind).toBe("MATERIAL");
    expect(getResource(RETURN_CANT_FORMING_ID)?.kind).toBe("SERVICE");
    expect(resourceKindLabel("SERVICE")).toBe("Serviciu");
    expect(listServiceResources().map((item) => item.id)).toEqual([
      RETURN_CANT_FORMING_ID,
    ]);
  });

  it("separates material family from purchasable specification", () => {
    expect(materialFamilies.map((item) => item.id)).toEqual([
      "PLEXIGLAS",
      "FOREX",
      "ALUMINIUM",
      "LED",
    ]);
    const plexiglas = getResource(PLEXIGLAS_3MM_OPAL_ID);
    expect(plexiglas?.familyId).toBe("PLEXIGLAS");
    expect(plexiglas?.label).toBe("Plexiglas 3 mm opal");
    expect(plexiglas?.specification).toEqual({
      familyId: "PLEXIGLAS",
      form: "sheet",
      thicknessMm: 3,
      opticalType: "opal",
    });
    expect(plexiglas?.id).not.toMatch(/face/i);
    expect(getResource(FOREX_10MM_ID)?.id).not.toMatch(/back/i);
    expect(getResource(FOREX_10MM_ID)?.specification?.thicknessMm).toBe(10);
    expect(getResource(ALUMINIUM_RETURN_PROFILE_ID)?.specification).toEqual({
      familyId: "ALUMINIUM",
      form: "profile",
      thicknessMm: 0.6,
    });
    expect(getResource(RETURN_CANT_FORMING_ID)?.familyId).toBeUndefined();
    expect(getResource(RETURN_CANT_FORMING_ID)?.specification).toBeUndefined();
  });

  it("resolves current Plexiglas 3 mm opal and keeps 5 mm as a non-live fixture", () => {
    expect(
      matchMaterialSpecification("PLEXIGLAS", {
        thicknessMm: 3,
        opticalType: "opal",
        form: "sheet",
      })?.id,
    ).toBe(PLEXIGLAS_3MM_OPAL_ID);
    expect(
      matchMaterialSpecification("PLEXIGLAS", {
        thicknessMm: 5,
        opticalType: "opal",
        form: "sheet",
      }),
    ).toBeUndefined();
    expect(listMaterialSpecifications("PLEXIGLAS").map((item) => item.id)).toEqual([
      PLEXIGLAS_3MM_OPAL_ID,
    ]);
    expect(
      matchMaterialSpecificationIn(
        [...resourceCatalog, plexiglas5mmOpalFixture],
        "PLEXIGLAS",
        { thicknessMm: 5, opticalType: "opal", form: "sheet" },
      )?.id,
    ).toBe("plexiglas_5mm_opal");
  });

  it("resolves current Forex 10 mm and keeps 5 mm as a non-live fixture", () => {
    expect(
      matchMaterialSpecification("FOREX", { thicknessMm: 10, form: "sheet" })?.id,
    ).toBe(FOREX_10MM_ID);
    expect(
      matchMaterialSpecification("FOREX", { thicknessMm: 5, form: "sheet" }),
    ).toBeUndefined();
    expect(
      matchMaterialSpecificationIn(
        [...resourceCatalog, forex5mmFixture],
        "FOREX",
        { thicknessMm: 5, form: "sheet" },
      )?.id,
    ).toBe("forex_5mm");
  });

  it("keeps one active cost evidence row per live resource", () => {
    expect(costEvidence.map((item) => item.resourceId).sort()).toEqual(
      resourceCatalog.map((item) => item.id).sort(),
    );
    expect(getCostEvidence(PLEXIGLAS_3MM_OPAL_ID)).toEqual(
      expect.objectContaining({
        amount: 16,
        currency: "EUR",
        perUnit: "m2",
        classification: "OWNER_CONFIRMED",
      }),
    );
    expect(getCostEvidence(FOREX_10MM_ID)?.amount).toBe(16);
    expect(getCostEvidence(ALUMINIUM_RETURN_PROFILE_ID)?.amount).toBe(10);
    expect(getCostEvidence(RETURN_CANT_FORMING_ID)?.amount).toBe(15);
    expect(JSON.stringify(resourceCatalog)).not.toMatch(/"amount":/);
  });
});
