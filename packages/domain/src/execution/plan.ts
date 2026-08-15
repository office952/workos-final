import { getProductionCapability } from "../processes/catalog.js";
import type { AcceptedProductionSnapshot } from "../production/snapshot.js";
import { productionWorkFromSnapshot } from "../production/snapshot.js";
import { providersForCapability } from "../workcenters/providers.js";

export const EXECUTION_PLAN_SCHEMA_VERSION = 1 as const;
export const EXECUTION_PLAN_STATUSES = ["PLANNED"] as const;
export type ExecutionPlanStatus = (typeof EXECUTION_PLAN_STATUSES)[number];

export const EXECUTION_TASK_STATUSES = ["PLANNED"] as const;
export type ExecutionTaskStatus = (typeof EXECUTION_TASK_STATUSES)[number];

export type ExecutionPlan = {
  planId: string;
  sourceSnapshotId: string;
  sourceSnapshotHash: string;
  productCode: string;
  productLabel: string;
  inscription: string;
  createdAt: string;
  status: ExecutionPlanStatus;
  taskCount: number;
  schemaVersion: typeof EXECUTION_PLAN_SCHEMA_VERSION;
  eicTotal: number;
  eicCurrency: "EUR";
  eicCompleteness: AcceptedProductionSnapshot["eic"]["completeness"];
};

export type ExecutionTask = {
  taskId: string;
  executionPlanId: string;
  sourceOperationId: string;
  processId: string;
  processLabel: string;
  scope: string;
  scopeLabel: string;
  seq: number;
  seqLabel: string;
  dependsOnTaskIds: readonly string[];
  requiredCapabilityId: string;
  requiredCapabilityLabel: string;
  status: ExecutionTaskStatus;
  quantities: AcceptedProductionSnapshot["operations"][number]["quantities"];
  resourceDemands: AcceptedProductionSnapshot["operations"][number]["resourceDemands"];
  assignedProvider: null;
  createdAt: string;
};

export type ExecutionPlanRecord = {
  plan: ExecutionPlan;
  tasks: readonly ExecutionTask[];
};

export type ExecutionEligibleProvider = {
  label: string;
};

export type ExecutionTaskView = ExecutionTask & {
  statusLabel: string;
  assignmentLabel: string;
  dependsOnLabels: readonly string[];
  eligibleProviders: readonly ExecutionEligibleProvider[];
};

export type ExecutionPlanView = {
  plan: ExecutionPlan;
  statusLabel: string;
  tasks: readonly ExecutionTaskView[];
};

export function executionPlanIdFromSnapshot(
  snapshotId: string,
): string {
  return `exp:${snapshotId}`;
}

export function executionTaskId(planId: string, sourceOperationId: string): string {
  return `task:${planId}:${sourceOperationId}`;
}

export function materializeExecutionPlanFromSnapshot(
  snapshot: AcceptedProductionSnapshot,
  options?: { createdAt?: string },
): ExecutionPlanRecord {
  const work = productionWorkFromSnapshot(snapshot);
  const createdAt = options?.createdAt ?? new Date().toISOString();
  const planId = executionPlanIdFromSnapshot(snapshot.snapshotId);
  const tasks = work.operations.map((operation, index) => {
    const seq = index + 1;
    return {
      taskId: executionTaskId(planId, operation.id),
      executionPlanId: planId,
      sourceOperationId: operation.id,
      processId: operation.processId,
      processLabel: operation.processLabel,
      scope: operation.scope,
      scopeLabel: operation.scopeLabel,
      seq,
      seqLabel: String(seq).padStart(2, "0"),
      dependsOnTaskIds: operation.dependsOn.map((operationId) =>
        executionTaskId(planId, operationId),
      ),
      requiredCapabilityId: operation.requiredCapabilityId,
      requiredCapabilityLabel: operation.requiredCapabilityLabel,
      status: "PLANNED" as const,
      quantities: operation.quantities,
      resourceDemands: operation.resourceDemands,
      assignedProvider: null,
      createdAt,
    };
  });

  return {
    plan: {
      planId,
      sourceSnapshotId: snapshot.snapshotId,
      sourceSnapshotHash: snapshot.contentHash,
      productCode: snapshot.productCode,
      productLabel: snapshot.productLabel,
      inscription: snapshot.inscription,
      createdAt,
      status: "PLANNED",
      taskCount: tasks.length,
      schemaVersion: EXECUTION_PLAN_SCHEMA_VERSION,
      eicTotal: work.eic.total,
      eicCurrency: work.eic.currency,
      eicCompleteness: work.eic.completeness,
    },
    tasks,
  };
}

export function projectExecutionPlanView(
  record: ExecutionPlanRecord,
): ExecutionPlanView {
  const byId = new Map(record.tasks.map((task) => [task.taskId, task]));
  return {
    plan: record.plan,
    statusLabel: executionPlanStatusLabel(record.plan.status),
    tasks: record.tasks.map((task) => ({
      ...task,
      statusLabel: executionTaskStatusLabel(task.status),
      assignmentLabel: "Nealocat",
      dependsOnLabels: task.dependsOnTaskIds.flatMap((id) => {
        const dependency = byId.get(id);
        return dependency ? [`${dependency.processLabel} — ${dependency.scopeLabel}`] : [];
      }),
      eligibleProviders: liveEligibleProviders(task.requiredCapabilityId),
    })),
  };
}

export function executionPlanStatusLabel(status: ExecutionPlanStatus): string {
  switch (status) {
    case "PLANNED":
      return "Planificat";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function executionTaskStatusLabel(status: ExecutionTaskStatus): string {
  switch (status) {
    case "PLANNED":
      return "Planificat";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function liveEligibleProviders(capabilityId: string): ExecutionEligibleProvider[] {
  const capability = getProductionCapability(capabilityId);
  if (!capability) {
    return [];
  }
  return providersForCapability(capability.id)
    .filter((item) => item.lifecycle === "ACTIVE")
    .map((item) => ({ label: item.label }))
    .sort((left, right) => left.label.localeCompare(right.label, "ro"));
}
