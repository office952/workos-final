import { describe, expect, it } from "vitest";
import type { OperatorInboxTaskItem, OperatorTaskInboxProjection } from "@workos-final/domain";
import { projectAtelierWorklist } from "./atelierWorklist";

function item(
  taskId: string,
  lane: OperatorInboxTaskItem["lane"],
  canClaimStart: boolean,
): OperatorInboxTaskItem {
  return {
    taskId,
    planId: "exp:1",
    productLabel: "Litere",
    inscription: "HUB",
    customerDisplayName: "Client",
    processLabel: "Debitare foaie CNC",
    scopeLabel: "Față",
    seqLabel: "1",
    requiredCapabilityLabel: "CNC",
    statusLabel: lane === "available_needs_provider" ? "Așteaptă utilaj" : "Gata",
    providerLabel: lane === "available_needs_provider" ? null : "CNC 4020",
    requiresProvider: true,
    waitingForLabels: [],
    reservedForLabel: null,
    canClaimStart,
    workspaceHref: "/execution/exp:1",
    lane,
    planCreatedAt: "2026-09-07T00:00:00.000Z",
    seq: 1,
  };
}

describe("projectAtelierWorklist", () => {
  it("flattens inbox lanes into a worklist with real energy only", () => {
    const inbox: OperatorTaskInboxProjection = {
      operator: { personId: "p:1", displayName: "Operator", availability: "AVAILABLE" },
      summary: {
        inProgressMine: 1,
        availableReady: 1,
        availableNeedsProvider: 1,
        waitingDependencies: 0,
      },
      inProgressMine: [item("task:mine", "in_progress_mine", false)],
      availableReady: [item("task:ready", "available_ready", true)],
      availableNeedsProvider: [item("task:blocked", "available_needs_provider", false)],
      waitingDependencies: [],
      displayOrderNote: "Ordinea nu este prioritate.",
    };
    const rows = projectAtelierWorklist(inbox);
    expect(rows.map((row) => [row.item.taskId, row.energy, row.actionLabel])).toEqual([
      ["task:mine", "current", null],
      ["task:ready", "current", "Pornește"],
      ["task:blocked", "blocked", null],
    ]);
  });
});
