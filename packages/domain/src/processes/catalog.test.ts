import { describe, expect, it } from "vitest";
import { CAPABILITY_IDS } from "../capabilities.js";
import { RETURN_CANT_FORMING_ID } from "../resources/catalog.js";
import {
  APPLY_SURFACE_FINISH_ID,
  BOND_LETTER_BODY_ID,
  CUT_SHEET_CNC_ID,
  FORM_ALUMINIUM_PROFILE_ID,
  PLACE_LED_MODULES_ID,
  PROCESS_CATEGORIES,
  getOperationalProcess,
  getProductionCapability,
  operationalProcesses,
  processesForType,
  productionCapabilityClasses,
} from "./catalog.js";

describe("operational process catalog", () => {
  it("keeps unique process and capability identities", () => {
    const processIds = operationalProcesses.map((item) => item.id);
    const capabilityIds = productionCapabilityClasses.map((item) => item.id);
    expect(new Set(processIds).size).toBe(processIds.length);
    expect(new Set(capabilityIds).size).toBe(capabilityIds.length);
    expect(processIds).toEqual([
      CUT_SHEET_CNC_ID,
      FORM_ALUMINIUM_PROFILE_ID,
      APPLY_SURFACE_FINISH_ID,
      BOND_LETTER_BODY_ID,
      PLACE_LED_MODULES_ID,
    ]);
  });

  it("uses only declared categories and shop-floor capabilities", () => {
    for (const process of operationalProcesses) {
      expect(PROCESS_CATEGORIES).toContain(process.category);
      expect(getProductionCapability(process.requiredCapabilityId)).toBeDefined();
    }
    expect(productionCapabilityClasses.map((item) => item.id)).not.toEqual(
      expect.arrayContaining([...CAPABILITY_IDS]),
    );
  });

  it("requires a capability class and never a machine or employee identity", () => {
    expect(JSON.stringify(operationalProcesses)).not.toMatch(
      /machineId|machineCode|employeeId|orderId|assigned/i,
    );
    expect(getOperationalProcess(CUT_SHEET_CNC_ID)?.requiredCapabilityId).toBe(
      "CNC_ROUTING",
    );
    expect(getOperationalProcess(FORM_ALUMINIUM_PROFILE_ID)?.requiredCapabilityId).toBe(
      "PROFILE_FORMING",
    );
    expect(getOperationalProcess(BOND_LETTER_BODY_ID)?.requiredCapabilityId).toBe(
      "MANUAL_ASSEMBLY",
    );
    expect(getProductionCapability("CNC_ROUTING")?.kind).toBe("MACHINE");
    expect(getProductionCapability("MANUAL_ASSEMBLY")?.kind).toBe("HUMAN_SKILL");
  });

  it("keeps process applicability reusable across component types", () => {
    expect(processesForType("PLEXIGLAS_FACE").map((item) => item.id)).toEqual([
      CUT_SHEET_CNC_ID,
      APPLY_SURFACE_FINISH_ID,
      BOND_LETTER_BODY_ID,
    ]);
    expect(processesForType("FOREX_BACK").map((item) => item.id)).toEqual([
      CUT_SHEET_CNC_ID,
    ]);
    expect(processesForType("ALUMINIUM_VOLUME").map((item) => item.id)).toEqual([
      FORM_ALUMINIUM_PROFILE_ID,
      APPLY_SURFACE_FINISH_ID,
      BOND_LETTER_BODY_ID,
    ]);
    expect(getOperationalProcess(CUT_SHEET_CNC_ID)?.applicableTypeIds).toEqual([
      "PLEXIGLAS_FACE",
      "FOREX_BACK",
    ]);
  });

  it("keeps forming linked to the service resource without owning the price", () => {
    const forming = getOperationalProcess(FORM_ALUMINIUM_PROFILE_ID);
    expect(forming?.resourceIds).toEqual([RETURN_CANT_FORMING_ID]);
    expect(forming?.id).not.toBe(RETURN_CANT_FORMING_ID);
    expect(JSON.stringify(forming)).not.toMatch(/"amount"|EUR/);
  });

  it("allows a future execution task to reference a process without changing the definition", () => {
    const futureTask = {
      processId: CUT_SHEET_CNC_ID,
      orderRef: "ORDER-123",
      assignedEmployeeId: "EMP-9",
      machineId: "CNC-ALPHA",
    };
    expect(getOperationalProcess(futureTask.processId)?.id).toBe(CUT_SHEET_CNC_ID);
    expect(JSON.stringify(operationalProcesses)).not.toMatch(
      /ORDER-123|EMP-9|CNC-ALPHA/,
    );
    expect(
      operationalProcesses.every(
        (item) =>
          !("sequence" in item) && !("order" in item) && !("taskId" in item),
      ),
    ).toBe(true);
  });

  it("keeps lighting process blocked and forming as the live foundation", () => {
    expect(getOperationalProcess(FORM_ALUMINIUM_PROFILE_ID)).toEqual(
      expect.objectContaining({
        lifecycle: "ACTIVE",
        readiness: "IMPLEMENTED_PROCESS_FOUNDATION",
      }),
    );
    expect(getOperationalProcess(CUT_SHEET_CNC_ID)?.readiness).toBe("KNOWN_PROCESS");
    expect(getOperationalProcess(PLACE_LED_MODULES_ID)?.readiness).toBe("BLOCKED");
  });
});
