import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "../product/frontlitPlexiAl06.js";
import {
  ALUMINIUM_RETURN_PROFILE_ID,
  FOREX_10MM_ID,
  MAT_LED_MODULE_ID,
  MAT_LED_PSU_12V_160W_ID,
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

  it("projects family, specification, service, labor and cost without a write path", () => {
    const admin = projectResourcesAdministration();
    expect(admin.writeState).toBe("NOT_IMPLEMENTED");
    expect(admin.families.map((item) => item.id)).toEqual([
      "PLEXIGLAS",
      "FOREX",
      "ALUMINIUM",
      "LED",
      "VINYL",
    ]);
    const plexiglas = admin.materials.find((item) => item.id === PLEXIGLAS_3MM_OPAL_ID);
    expect(plexiglas?.familyLabel).toBe("Plexiglas");
    expect(plexiglas?.opticalLabel).toBe("Opal");
    expect(plexiglas?.thicknessLabel).toBe("3 mm");
    expect(plexiglas?.usedBy[0]?.displayLine).toContain("Față / Plexiglas");
    expect(plexiglas?.cost?.amountDisplay).toBe("16,00 EUR / m²");
    const ledModule = admin.materials.find((item) => item.id === MAT_LED_MODULE_ID);
    expect(ledModule?.unitLabel).toBe("buc");
    expect(ledModule?.voltageLabel).toBe("12 V");
    expect(ledModule?.cost?.amountDisplay).toBe("0,50 EUR / buc");
    expect(ledModule?.usedBy[0]?.role).toBe("LIGHTING");
    const psu160 = admin.materials.find((item) => item.id === MAT_LED_PSU_12V_160W_ID);
    expect(psu160?.capacityLabel).toBe("160 W");
    expect(psu160?.cost?.amountDisplay).toBe("20,00 EUR / buc");
    expect(admin.services.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        RETURN_CANT_FORMING_ID,
        "SVC-CNC-FACE",
        "SVC-CNC-BACK",
        "SVC-PLACE-LED-MODULES",
        "SVC-ELECTRICAL-FINISH",
        "SVC-PAINT-RAL",
        "SVC-PACK-PRODUCT",
      ]),
    );
    expect(admin.labor.map((item) => item.id)).toEqual([
      "LAB-VINYL-FACE",
      "LAB-VINYL-VOLUME",
      "LAB-BOND-LETTER-BODY",
      "LAB-CLOSE-LETTER-BODY",
    ]);
    expect(admin.serviceRecipes.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        "RCP_PROFILE_FORMING",
        "RCP_CNC_FACE",
        "RCP_CNC_BACK",
        "RCP_PLACE_LED_MODULES",
        "RCP_ELECTRICAL_FINISH",
        "RCP_PAINT_RAL",
        "RCP_PACK_PRODUCT",
      ]),
    );
    expect(admin.laborRecipes.map((item) => item.id)).toEqual([
      "RCP_VINYL_FACE_LABOR",
      "RCP_VINYL_VOLUME_LABOR",
      "RCP_BOND_LETTER_BODY",
      "RCP_CLOSE_LETTER_BODY",
    ]);
    expect(admin.missingServiceRecipes.map((item) => item.processId)).not.toContain(
      "CUT_SHEET_CNC",
    );
    expect(admin.missingServiceRecipes.map((item) => item.processId)).toContain(
      "WELD_STEEL_JOIN",
    );
    expect(admin.missingLaborRecipes.map((item) => item.processId)).not.toContain(
      "BOND_LETTER_BODY",
    );
    expect(admin.missingLaborRecipes.map((item) => item.processId)).toContain(
      "INSPECT_FINISHED_LETTER",
    );
    expect(admin.costEvidence).toHaveLength(20);
    expect(admin.costEvidence.map((item) => item.resourceId).sort()).toEqual(
      admin.materials
        .concat(admin.services)
        .concat(admin.labor)
        .map((item) => item.id)
        .sort(),
    );
  });
});
