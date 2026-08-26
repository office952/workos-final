import { describe, expect, it } from "vitest";
import type { ExecutionPlanView, ExecutionTaskView } from "@workos-final/domain";
import { measuredLabel, projectPlannedVersusActual } from "./pvaProjection";

function task(overrides: Partial<ExecutionTaskView>): ExecutionTaskView {
  return {
    taskId: "task:1",
    executionPlanId: "exp:test",
    sourceOperationId: "op-1",
    processId: "CUT_SHEET_CNC",
    processLabel: "Debitare foaie CNC",
    scope: "FACE",
    scopeLabel: "Față",
    seq: 1,
    seqLabel: "01",
    dependsOnTaskIds: [],
    requiredCapabilityId: "CNC_ROUTING",
    requiredCapabilityLabel: "Debitare CNC",
    providerRequirement: "REQUIRED",
    status: "PLANNED",
    quantities: [],
    resourceDemands: [],
    assignedProvider: null,
    assignedExecutor: null,
    startedAt: null,
    completedAt: null,
    completion: null,
    actualConsumption: [],
    createdAt: "2026-08-16T10:00:00.000Z",
    statusLabel: "Planificat",
    assignmentLabel: "Nealocat",
    dependsOnLabels: [],
    waitingFor: [],
    eligibleProviders: [],
    eligibleExecutors: [],
    measurableQuantity: { label: "Lungime", value: 12.5, unit: "m" },
    requiresCompletedQuantity: true,
    completionOutcomeLabel: null,
    completedQuantityLabel: null,
    varianceLabel: null,
    requiresProvider: true,
    providerRequirementLabel: "Necesită utilaj dedicat",
    canAssign: false,
    canAssignExecutor: false,
    canStart: false,
    canClaimStart: false,
    operatorRelation: "idle",
    startedByLabel: null,
    startBlockReason: null,
    canComplete: false,
    hasPlannedResources: false,
    canRecordActualConsumption: false,
    ...overrides,
  };
}

const view = {
  plan: { inscription: "TEST" },
  tasks: [],
} as unknown as ExecutionPlanView;

describe("projectPlannedVersusActual", () => {
  it("does not use zero as unknown", () => {
    const rows = projectPlannedVersusActual({
      ...view,
      tasks: [task({})],
    });
    expect(measuredLabel(rows[0]!.planned)).toBe("12,5 m");
    expect(measuredLabel(rows[0]!.actual)).toBe("Necunoscut");
    expect(measuredLabel(rows[0]!.difference)).toBe("Necunoscut");
    expect(measuredLabel(rows[0]!.duration)).toBe("Necunoscut");
    expect(JSON.stringify(rows[0]!.actual)).not.toContain("0");
    expect(JSON.stringify(rows[0]!.difference)).not.toContain("0");
  });

  it("marks completed work without a measured quantity as not measured", () => {
    const rows = projectPlannedVersusActual({
      ...view,
      tasks: [
        task({
          status: "COMPLETED",
          statusLabel: "Finalizat",
          completion: {
            completedQuantity: null,
            completedQuantityUnit: null,
            note: null,
            outcome: "COMPLETED_AS_PLANNED",
          },
        }),
      ],
    });
    expect(measuredLabel(rows[0]!.actual)).toBe("Nemăsurat");
    expect(measuredLabel(rows[0]!.difference)).toBe("Nemăsurat");
  });

  it("shows a measured difference without fabricating duration", () => {
    const rows = projectPlannedVersusActual({
      ...view,
      tasks: [
        task({
          status: "COMPLETED",
          statusLabel: "Finalizat",
          completion: {
            completedQuantity: 12.4,
            completedQuantityUnit: "m",
            note: "Ajustare tăiere",
            outcome: "COMPLETED_WITH_VARIANCE",
          },
          startedAt: "2026-08-16T10:00:00.000Z",
          completedAt: "2026-08-16T12:36:00.000Z",
        }),
      ],
    });
    expect(measuredLabel(rows[0]!.actual)).toBe("12,4 m");
    expect(measuredLabel(rows[0]!.difference)).toBe("-0,1 m");
    expect(measuredLabel(rows[0]!.duration)).toBe("2,6 h");
    expect(rows[0]!.deviationReason).toBe("Ajustare tăiere");
  });
});
