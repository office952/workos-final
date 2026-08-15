import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "../product/frontlitPlexiAl06.js";
import { RETURN_CANT_FORMING_ID } from "../resources/catalog.js";
import { CUT_SHEET_CNC_ID, FORM_ALUMINIUM_PROFILE_ID } from "./catalog.js";
import { projectOperationalProcessesAdministration } from "./projection.js";
import { processWhereUsed } from "./whereUsed.js";

describe("operational process projection", () => {
  it("derives where-used from type applicability and product composition", () => {
    const cncUses = processWhereUsed(CUT_SHEET_CNC_ID);
    expect(cncUses.map((item) => item.role).sort()).toEqual(["BACK", "FACE"]);
    expect(cncUses.every((item) => item.productCode === CANONICAL_PRODUCT_CODE)).toBe(
      true,
    );
    expect(processWhereUsed(FORM_ALUMINIUM_PROFILE_ID)[0]?.role).toBe("VOLUME");
  });

  it("projects categories processes and capabilities without a write path", () => {
    const admin = projectOperationalProcessesAdministration();
    expect(admin.writeState).toBe("NOT_IMPLEMENTED");
    expect(admin.categories.map((item) => item.id)).toEqual([
      "CUTTING",
      "FORMING",
      "WELDING",
      "PRINTING",
      "FINISHING",
      "ASSEMBLY",
      "ELECTRICAL",
      "QUALITY_CONTROL",
      "PACKING",
    ]);
    const forming = admin.processes.find((item) => item.id === FORM_ALUMINIUM_PROFILE_ID);
    expect(forming?.requiredCapabilityLabel).toBe("Formare profil");
    expect(forming?.resourceLinks).toEqual([
      { id: RETURN_CANT_FORMING_ID, label: "Formare profil aluminiu" },
    ]);
    expect(forming?.recipeId).toBe("RCP_PROFILE_FORMING");
    expect(forming?.recipeState).toBe("CANONICAL_COST_EXISTS");
    const cnc = admin.processes.find((item) => item.id === CUT_SHEET_CNC_ID);
    expect(cnc?.recipeId).toBeNull();
    expect(cnc?.recipeState).toBe("SERVICE_RECIPE_MISSING");
    expect(cnc?.providerCoverage).toBe("COVERED");
    expect(forming?.usedBy[0]?.displayLine).toContain("Volum / Aluminiu");
    expect(admin.capabilities.find((item) => item.id === "CNC_ROUTING")?.processes[0]?.id).toBe(
      CUT_SHEET_CNC_ID,
    );
    expect(admin.compositions.map((item) => item.id)).toEqual([
      "letters-finish-none",
      "letters-finish-vinyl",
      "letters-volume-painted",
    ]);
    expect(admin.compositions[0]?.composition.completeness).toBe("PARTIAL");
    expect(admin.compositions[0]?.composition.lightingCalculationReadiness).toBe(
      "CALCULATED",
    );
    expect(
      admin.compositions[0]?.composition.nodes.some(
        (item) => item.id === "FACE:CUT_SHEET_CNC",
      ),
    ).toBe(true);
    expect(forming?.providerCoverage).toBe("COVERED");
    expect(forming?.providerCoverageLabel).toBe("Acoperită");
    expect(forming?.providers.map((item) => item.id)).toEqual(["MCH-CNC-CANT-LITERE"]);
    const steelWeld = admin.processes.find((item) => item.id === "WELD_STEEL_JOIN");
    expect(steelWeld?.recipeState).toBe("SERVICE_RECIPE_MISSING");
    expect(steelWeld?.providerCoverage).toBe("COVERED");
    expect(steelWeld?.usedBy).toEqual([]);
    const bonding = admin.processes.find((item) => item.id === "BOND_LETTER_BODY");
    expect(bonding?.providerCoverage).toBe("COVERED");
    expect(bonding?.providers.map((item) => item.id)).toEqual([
      "WC_ASSEMBLY_01",
      "WC_ASSEMBLY_02",
    ]);
    expect(JSON.stringify(admin)).not.toMatch(/machineId|ExecutionPlan|Preț client/);
  });
});
