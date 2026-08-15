import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "../product/frontlitPlexiAl06.js";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  FOREX_10MM_ID,
  PLEXIGLAS_3MM_OPAL_ID,
  RETURN_CANT_FORMING_ID,
} from "./catalog.js";
import { projectResourcesAdministration } from "./projection.js";
import { resourceWhereUsed } from "./whereUsed.js";

describe("resources administration projection", () => {
  it("derives where-used from live type resolution, not a manual list", () => {
    const plexiUses = resourceWhereUsed(PLEXIGLAS_3MM_OPAL_ID);
    expect(plexiUses).toEqual([
      expect.objectContaining({
        resourceId: PLEXIGLAS_3MM_OPAL_ID,
        typeId: "PLEXIGLAS_FACE",
        role: "FACE",
        productCode: CANONICAL_PRODUCT_CODE,
      }),
    ]);
    expect(resourceWhereUsed(FOREX_10MM_ID)[0]?.role).toBe("BACK");
    expect(resourceWhereUsed(ALUMINIUM_RETURN_PROFILE_ID)[0]?.role).toBe("VOLUME");
    expect(resourceWhereUsed(RETURN_CANT_FORMING_ID)[0]?.role).toBe("VOLUME");
  });

  it("projects family, specification, service and cost without a write path", () => {
    const admin = projectResourcesAdministration();
    expect(admin.writeState).toBe("NOT_IMPLEMENTED");
    expect(admin.families.map((item) => item.id)).toEqual([
      "PLEXIGLAS",
      "FOREX",
      "ALUMINIUM",
    ]);
    const plexiglas = admin.materials.find((item) => item.id === PLEXIGLAS_3MM_OPAL_ID);
    expect(plexiglas?.familyLabel).toBe("Plexiglas");
    expect(plexiglas?.opticalLabel).toBe("Opal");
    expect(plexiglas?.thicknessLabel).toBe("3 mm");
    expect(plexiglas?.usedBy[0]?.displayLine).toContain("Față / Plexiglas");
    expect(plexiglas?.cost?.amountDisplay).toBe("16,00 EUR / m²");
    expect(admin.services).toEqual([
      expect.objectContaining({
        id: RETURN_CANT_FORMING_ID,
        kind: "SERVICE",
        kindLabel: "Serviciu",
        familyId: null,
      }),
    ]);
    expect(admin.serviceRecipes).toEqual([
      expect.objectContaining({
        id: "RCP_PROFILE_FORMING",
        kind: "SERVICE",
        completenessLabel: "Configurată",
        costEvidenceId: RETURN_CANT_FORMING_ID,
      }),
    ]);
    expect(admin.laborRecipes).toEqual([]);
    expect(admin.missingServiceRecipes.map((item) => item.processId)).toContain(
      "CUT_SHEET_CNC",
    );
    expect(admin.missingLaborRecipes.map((item) => item.processId)).toContain(
      "BOND_LETTER_BODY",
    );
    expect(admin.costEvidence).toHaveLength(4);
    expect(admin.costEvidence.map((item) => item.resourceId).sort()).toEqual(
      admin.materials
        .concat(admin.services)
        .map((item) => item.id)
        .sort(),
    );
  });
});
