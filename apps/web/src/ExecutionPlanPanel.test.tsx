import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { ExecutionPlanView } from "@workos-final/domain";
import { ExecutionPlanPanel } from "./ExecutionPlanPanel";

const view: ExecutionPlanView = {
  plan: {
    planId: "exp:test",
    sourceSnapshotId: "aps:test",
    sourceSnapshotHash: "hash",
    productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    productLabel: "Litere",
    inscription: "WORKOS",
    createdAt: "2026-08-16T10:00:00.000Z",
    status: "PLANNED",
    taskCount: 2,
    schemaVersion: 1,
    eicTotal: 595,
    eicCurrency: "EUR",
    eicCompleteness: "PARTIAL",
  },
  progress: {
    total: 2,
    completed: 0,
    inProgress: 0,
    planned: 2,
    waitingDependencies: 1,
    noProvider: 1,
    noExecutor: 2,
    varianceCount: 0,
    status: "PLANNED",
  },
  progressStatus: "PLANNED",
  statusLabel: "Planificat",
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
      executionPlanId: "exp:test",
      sourceOperationId: "op-1",
      processId: "CUT_SHEET_CNC",
      processLabel: "Debitare foaie CNC",
      scope: "BACK",
      scopeLabel: "Spate",
      seq: 1,
      seqLabel: "01",
      dependsOnTaskIds: [],
      requiredCapabilityId: "CNC_ROUTING",
      requiredCapabilityLabel: "Debitare CNC",
      status: "PLANNED",
      quantities: [{ label: "Lungime", value: 12.5, unit: "m" }],
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
      measurableQuantity: { label: "Lungime", value: 12.5, unit: "m" },
      requiresCompletedQuantity: true,
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
    {
      taskId: "task:2",
      executionPlanId: "exp:test",
      sourceOperationId: "op-2",
      processId: "INSPECT_FINISHED_LETTER",
      processLabel: "Control calitate final",
      scope: "PRODUCT",
      scopeLabel: "Produs",
      seq: 2,
      seqLabel: "02",
      dependsOnTaskIds: ["task:1"],
      requiredCapabilityId: "QUALITY_CONTROL",
      requiredCapabilityLabel: "Control calitate",
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
      dependsOnLabels: ["Debitare foaie CNC — Spate"],
      waitingFor: ["Debitare foaie CNC — Spate"],
      eligibleProviders: [],
      eligibleExecutors: [{ id: "per:1", label: "Maria" }],
      measurableQuantity: null,
      requiresCompletedQuantity: false,
      completionOutcomeLabel: null,
      completedQuantityLabel: null,
      varianceLabel: null,
      canAssign: false,
      canAssignExecutor: true,
      canStart: false,
      canComplete: false,
      hasPlannedResources: false,
      canRecordActualConsumption: false,
    },
  ],
};

describe("ExecutionPlanPanel", () => {
  it("renders operator status, provider/executor and wait reason without raw IDs", () => {
    render(
      <MemoryRouter>
        <ExecutionPlanPanel
          view={view}
          reused={false}
          busy={false}
          onAssignProvider={() => undefined}
          onAssignExecutor={() => undefined}
          onStartTask={() => undefined}
          onCompleteTask={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Plan de execuție" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rezumat cost intern" })).toBeInTheDocument();
    expect(screen.getByText("Cost intern planificat: 595,00 EUR (parțial)")).toBeInTheDocument();
    expect(screen.getByText("Cost intern real: indisponibil")).toBeInTheDocument();
    expect(screen.getByText("WORKOS")).toBeInTheDocument();
    expect(screen.getByText("0 / 2 finalizate")).toBeInTheDocument();
    expect(screen.getByText("Fără furnizor: 1")).toBeInTheDocument();
    expect(screen.getByText("Stare: Planificat", { selector: ".execution-plan-head .task-status" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "01. Debitare foaie CNC" })).toBeInTheDocument();
    expect(screen.getByText("Componentă: Spate")).toBeInTheDocument();
    expect(screen.getAllByText("Echipament / zonă").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Alocare: Nealocat").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Executant: Nealocat").length).toBeGreaterThan(0);
    expect(screen.getByText("Cantitate planificată: 12,5 m")).toBeInTheDocument();
    expect(screen.getByText("Așteaptă: Debitare foaie CNC — Spate")).toBeInTheDocument();
    expect(screen.getByText("Fără furnizor disponibil")).toBeInTheDocument();
    expect(screen.queryByText("task:1")).not.toBeInTheDocument();
    expect(screen.queryByText("QUALITY_CONTROL")).not.toBeInTheDocument();
    expect(screen.queryByText("CUT_SHEET_CNC")).not.toBeInTheDocument();
  });

  it("renders completed planned vs actual quantity and variance", () => {
    const completed: ExecutionPlanView = {
      ...view,
      progress: {
        ...view.progress,
        completed: 1,
        planned: 1,
        varianceCount: 1,
        status: "IN_PROGRESS",
      },
      statusLabel: "În lucru",
      tasks: [
        {
          ...view.tasks[0],
          status: "COMPLETED",
          statusLabel: "Finalizat",
          assignedProvider: { id: "MCH_CNC_4020", kind: "MACHINE", label: "CNC 4020" },
          assignedExecutor: { id: "per:1", label: "Maria" },
          assignmentLabel: "CNC 4020",
          completedQuantityLabel: "Realizat: 12 m",
          varianceLabel: "Cu abatere",
          canAssign: false,
          canAssignExecutor: false,
          canStart: false,
          canComplete: false,
        },
      ],
    };

    render(
      <MemoryRouter>
        <ExecutionPlanPanel
          view={completed}
          reused={false}
          busy={false}
          onAssignProvider={() => undefined}
          onAssignExecutor={() => undefined}
          onStartTask={() => undefined}
          onCompleteTask={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Stare: Finalizat")).toBeInTheDocument();
    expect(screen.getByText("Alocat: CNC 4020")).toBeInTheDocument();
    expect(screen.getByText("Executant: Maria")).toBeInTheDocument();
    expect(screen.getByText("Cantitate planificată: 12,5 m")).toBeInTheDocument();
    expect(screen.getByText("Realizat: 12 m")).toBeInTheDocument();
    expect(screen.getByText("Cu abatere")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pornește" })).not.toBeInTheDocument();
  });

  it("shows optional actual consumption inputs only while the task can complete", () => {
    const inProgress: ExecutionPlanView = {
      ...view,
      progress: { ...view.progress, inProgress: 1, planned: 1, status: "IN_PROGRESS" },
      statusLabel: "În lucru",
      tasks: [
        {
          ...view.tasks[0],
          status: "IN_PROGRESS",
          statusLabel: "În lucru",
          assignedProvider: { id: "MCH_CNC_4020", kind: "MACHINE", label: "CNC 4020" },
          assignedExecutor: { id: "per:1", label: "Maria" },
          assignmentLabel: "CNC 4020",
          resourceDemands: [
            { resourceId: "MAT-LED-MODULE", label: "Modul LED 12V", quantity: 125, unit: "buc" },
          ],
          canAssign: false,
          canAssignExecutor: false,
          canStart: false,
          canComplete: true,
          hasPlannedResources: true,
          canRecordActualConsumption: true,
        },
        view.tasks[1],
      ],
    };

    render(
      <MemoryRouter>
        <ExecutionPlanPanel
          view={inProgress}
          reused={false}
          busy={false}
          onAssignProvider={() => undefined}
          onAssignExecutor={() => undefined}
          onStartTask={() => undefined}
          onCompleteTask={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Consum real")).toBeInTheDocument();
    expect(screen.getByText("Planificat: Modul LED 12V — 125 buc")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantitate folosită (Modul LED 12V)")).toHaveValue(null);
    expect(screen.queryByText("Fără consum înregistrat")).not.toBeInTheDocument();
    expect(screen.queryByText("ActualConsumptionEntry")).not.toBeInTheDocument();
  });

  it("renders frozen actual consumption and keeps tasks without materials clean", () => {
    const completed: ExecutionPlanView = {
      ...view,
      progress: { ...view.progress, completed: 1, planned: 1, status: "IN_PROGRESS" },
      statusLabel: "În lucru",
      tasks: [
        {
          ...view.tasks[0],
          status: "COMPLETED",
          statusLabel: "Finalizat",
          assignedProvider: { id: "MCH_CNC_4020", kind: "MACHINE", label: "CNC 4020" },
          assignedExecutor: { id: "per:1", label: "Maria" },
          assignmentLabel: "CNC 4020",
          resourceDemands: [
            { resourceId: "MAT-LED-MODULE", label: "Modul LED 12V", quantity: 125, unit: "buc" },
          ],
          actualConsumption: [
            {
              entryId: "act:task:1:MAT-LED-MODULE",
              taskId: "task:1",
              resourceId: "MAT-LED-MODULE",
              resourceLabel: "Modul LED 12V",
              actualQuantity: 127,
              unit: "buc",
              recordedAt: "2026-08-16T12:12:00.000Z",
              note: null,
            },
          ],
          completedQuantityLabel: "Realizat: 125 buc",
          canAssign: false,
          canAssignExecutor: false,
          canStart: false,
          canComplete: false,
          hasPlannedResources: true,
          canRecordActualConsumption: false,
        },
        {
          ...view.tasks[1],
          status: "COMPLETED",
          statusLabel: "Finalizat",
          canAssign: false,
          canAssignExecutor: false,
          canStart: false,
          canComplete: false,
        },
      ],
    };

    render(
      <MemoryRouter>
        <ExecutionPlanPanel
          view={completed}
          reused={false}
          busy={false}
          onAssignProvider={() => undefined}
          onAssignExecutor={() => undefined}
          onStartTask={() => undefined}
          onCompleteTask={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Modul LED 12V: 127 buc")).toBeInTheDocument();
    expect(screen.queryByLabelText("Cantitate folosită (Modul LED 12V)")).not.toBeInTheDocument();
    expect(screen.queryByText("Fără consum înregistrat")).not.toBeInTheDocument();
  });

  it("renders projected actual internal cost without computing rates in the UI", () => {
    const priced: ExecutionPlanView = {
      ...view,
      actualInternalCost: {
        status: "PARTIAL",
        statusLabel: "Parțial",
        currency: "EUR",
        calculableTotal: 63.5,
        plannedComparableTotal: 62.5,
        availableDifference: 1,
        calculableCount: 1,
        unavailableCount: 1,
        lines: [
          {
            resourceId: "MAT-LED-MODULE",
            label: "Modul LED 12V",
            kind: "MATERIAL",
            group: "lighting",
            groupLabel: "Iluminare",
            plannedQuantity: 125,
            actualQuantity: 127,
            unit: "buc",
            rate: 0.5,
            currency: "EUR",
            plannedCost: 62.5,
            actualCost: 63.5,
            difference: 1,
            status: "CALCULABLE",
            statusLabel: "Cost calculabil",
            unavailableReason: null,
            quantitySourceLabel: "Consum real înregistrat",
            costSourceLabel: "Tarif înghețat din snapshot",
            sourceTaskLabels: ["Montare module LED — Iluminare"],
          },
          {
            resourceId: "LAB-BOND-LETTER-BODY",
            label: "Lipire corp literă",
            kind: "LABOR",
            group: "labor",
            groupLabel: "Manoperă",
            plannedQuantity: 12.5,
            actualQuantity: null,
            unit: "m",
            rate: 5,
            currency: "EUR",
            plannedCost: 62.5,
            actualCost: null,
            difference: null,
            status: "UNAVAILABLE",
            statusLabel: "Cost indisponibil",
            unavailableReason: "Fără consum înregistrat",
            quantitySourceLabel: "Fără consum înregistrat",
            costSourceLabel: "Tarif înghețat din snapshot",
            sourceTaskLabels: [],
          },
        ],
      },
    };

    render(
      <MemoryRouter>
        <ExecutionPlanPanel
          view={priced}
          reused={false}
          busy={false}
          onAssignProvider={() => undefined}
          onAssignExecutor={() => undefined}
          onStartTask={() => undefined}
          onCompleteTask={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Cost intern real: 63,50 EUR (parțial)")).toBeInTheDocument();
    expect(screen.getByText("Diferență pe costurile disponibile: +1,00 EUR")).toBeInTheDocument();
    expect(screen.getByText("Modul LED 12V: Cost calculabil")).toBeInTheDocument();
    expect(screen.getByText("Lipire corp literă: Cost indisponibil")).toBeInTheDocument();
    expect(screen.queryByText("ActualCostProjection")).not.toBeInTheDocument();
  });
});
