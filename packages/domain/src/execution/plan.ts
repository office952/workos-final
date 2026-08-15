import { getProductionCapability } from "../processes/catalog.js";
import type { AcceptedProductionSnapshot } from "../production/snapshot.js";
import { productionWorkFromSnapshot } from "../production/snapshot.js";
import type { ProviderKind } from "../workcenters/catalog.js";
import { providersForCapability } from "../workcenters/providers.js";

export const EXECUTION_PLAN_SCHEMA_VERSION = 1 as const;
export const EXECUTION_PLAN_STATUSES = ["PLANNED"] as const;
export type ExecutionPlanStatus = (typeof EXECUTION_PLAN_STATUSES)[number];

export const EXECUTION_PROGRESS_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export type ExecutionProgressStatus = (typeof EXECUTION_PROGRESS_STATUSES)[number];

export const EXECUTION_TASK_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export type ExecutionTaskStatus = (typeof EXECUTION_TASK_STATUSES)[number];

export type AssignedExecutionProvider = {
  id: string;
  kind: ProviderKind;
  label: string;
};

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
  assignedProvider: AssignedExecutionProvider | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type ExecutionPlanRecord = {
  plan: ExecutionPlan;
  tasks: readonly ExecutionTask[];
};

export type ExecutionEligibleProvider = {
  id: string;
  kind: ProviderKind;
  label: string;
};

export type ExecutionTaskView = ExecutionTask & {
  statusLabel: string;
  assignmentLabel: string;
  dependsOnLabels: readonly string[];
  waitingFor: readonly string[];
  eligibleProviders: readonly ExecutionEligibleProvider[];
  canAssign: boolean;
  canStart: boolean;
  canComplete: boolean;
};

export type ExecutionPlanView = {
  plan: ExecutionPlan;
  progressStatus: ExecutionProgressStatus;
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
      startedAt: null,
      completedAt: null,
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
  const progressStatus = deriveExecutionProgress(record.tasks);
  return {
    plan: record.plan,
    progressStatus,
    statusLabel: executionProgressStatusLabel(progressStatus),
    tasks: record.tasks.map((task) => {
      const eligibleProviders = liveEligibleProviders(task.requiredCapabilityId);
      const dependsOnLabels = task.dependsOnTaskIds.flatMap((id) => {
        const dependency = byId.get(id);
        return dependency ? [taskDependencyLabel(dependency)] : [];
      });
      const waitingFor = incompleteDependencyLabels(task, byId);
      return {
        ...task,
        statusLabel: executionTaskStatusLabel(task.status),
        assignmentLabel: task.assignedProvider?.label ?? "Nealocat",
        dependsOnLabels,
        waitingFor,
        eligibleProviders,
        canAssign: task.status === "PLANNED" && eligibleProviders.length > 0,
        canStart: canStartTask(task, byId),
        canComplete: task.status === "IN_PROGRESS",
      };
    }),
  };
}

export function deriveExecutionProgress(
  tasks: readonly ExecutionTask[],
): ExecutionProgressStatus {
  if (tasks.length === 0 || tasks.every((task) => task.status === "PLANNED")) {
    return "PLANNED";
  }
  if (tasks.every((task) => task.status === "COMPLETED")) {
    return "COMPLETED";
  }
  return "IN_PROGRESS";
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

export function executionProgressStatusLabel(
  status: ExecutionProgressStatus,
): string {
  switch (status) {
    case "PLANNED":
      return "Planificat";
    case "IN_PROGRESS":
      return "În lucru";
    case "COMPLETED":
      return "Finalizat";
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
    case "IN_PROGRESS":
      return "În lucru";
    case "COMPLETED":
      return "Finalizat";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function liveEligibleProviders(
  capabilityId: string,
): ExecutionEligibleProvider[] {
  const capability = getProductionCapability(capabilityId);
  if (!capability) {
    return [];
  }
  return providersForCapability(capability.id)
    .filter((item) => item.lifecycle === "ACTIVE")
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
    }))
    .sort((left, right) => left.label.localeCompare(right.label, "ro"));
}

export function assignedProviderStillValid(
  capabilityId: string,
  assigned: AssignedExecutionProvider,
): boolean {
  return liveEligibleProviders(capabilityId).some(
    (item) => item.id === assigned.id && item.kind === assigned.kind,
  );
}

export function incompleteDependencyLabels(
  task: ExecutionTask,
  byId: ReadonlyMap<string, ExecutionTask>,
): string[] {
  return task.dependsOnTaskIds.flatMap((id) => {
    const dependency = byId.get(id);
    if (!dependency || dependency.status === "COMPLETED") {
      return [];
    }
    return [taskDependencyLabel(dependency)];
  });
}

export function dependenciesCompleted(
  task: ExecutionTask,
  byId: ReadonlyMap<string, ExecutionTask>,
): boolean {
  return task.dependsOnTaskIds.every((id) => byId.get(id)?.status === "COMPLETED");
}

function canStartTask(
  task: ExecutionTask,
  byId: ReadonlyMap<string, ExecutionTask>,
): boolean {
  return (
    task.status === "PLANNED" &&
    task.assignedProvider !== null &&
    assignedProviderStillValid(task.requiredCapabilityId, task.assignedProvider) &&
    dependenciesCompleted(task, byId)
  );
}

function taskDependencyLabel(task: ExecutionTask): string {
  return `${task.processLabel} — ${task.scopeLabel}`;
}
