import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ExecutionWorkspacePage } from "./ExecutionWorkspacePage";

vi.mock("./productApi", () => ({
  readExecutionPlanById: () =>
    Promise.resolve({
      plan: {
        planId: "exp:aps:test",
        sourceSnapshotId: "aps:test",
        sourceSnapshotHash: "hash",
        productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        productLabel: "Litere",
        inscription: "WORKOS",
        createdAt: "2026-08-16T10:00:00.000Z",
        status: "PLANNED",
        taskCount: 1,
        schemaVersion: 1,
        eicTotal: 382.5,
        eicCurrency: "EUR",
        eicCompleteness: "COMPLETE",
      },
      progress: {
        total: 1,
        completed: 0,
        inProgress: 0,
        planned: 1,
        waitingDependencies: 0,
        noProvider: 0,
        noExecutor: 1,
        varianceCount: 0,
        status: "PLANNED",
      },
      progressStatus: "PLANNED",
      statusLabel: "Planificat",
      sourceKind: "ORDER",
      sourceKindLabel: "Eliberată din comandă",
      actualInternalCost: {
        status: "UNAVAILABLE",
        statusLabel: "Indisponibil",
        currency: "EUR",
        calculableTotal: null,
        plannedComparableTotal: null,
        availableDifference: null,
        lines: [],
        calculableCount: 0,
        unavailableCount: 0,
      },
      tasks: [
        {
          taskId: "task:1",
          executionPlanId: "exp:aps:test",
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
          eligibleProviders: [{ id: "MCH_CNC_4020", kind: "MACHINE", label: "CNC 4020" }],
          eligibleExecutors: [{ id: "per:1", label: "Maria" }],
          measurableQuantity: null,
          requiresCompletedQuantity: false,
          completionOutcomeLabel: null,
          completedQuantityLabel: null,
          varianceLabel: null,
          canAssign: true,
          canAssignExecutor: true,
          canStart: false,
          canComplete: false,
          hasPlannedResources: false,
          canRecordActualConsumption: false,
        },
      ],
    }),
  assignExecutionTaskProvider: vi.fn(),
  assignExecutionTaskExecutor: vi.fn(),
  startExecutionTask: vi.fn(),
  completeExecutionTask: vi.fn(),
}));

describe("ExecutionWorkspacePage", () => {
  it("shows job identity and next work without commercial price", async () => {
    render(
      <MemoryRouter initialEntries={["/execution/exp:aps:test"]}>
        <Routes>
          <Route path="/execution/:planId" element={<ExecutionWorkspacePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "WORKOS" })).toBeInTheDocument();
    expect(screen.getByText("Litere. Eliberată din comandă.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Blocate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "01. Debitare foaie CNC" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Înapoi la produs" })).toHaveAttribute(
      "href",
      "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    );
    expect(screen.queryByText("624,82")).not.toBeInTheDocument();
    expect(screen.queryByText("TVA")).not.toBeInTheDocument();
    expect(screen.queryByText("exp:aps:test")).not.toBeInTheDocument();
  });
});
