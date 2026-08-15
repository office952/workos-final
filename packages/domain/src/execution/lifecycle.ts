import type { ProviderKind } from "../workcenters/catalog.js";
import {
  assignedProviderStillValid,
  dependenciesCompleted,
  liveEligibleProviders,
  type AssignedExecutionProvider,
  type ExecutionPlanRecord,
  type ExecutionTask,
} from "./plan.js";

export const TASK_MUTATION_ERRORS = [
  "not_found",
  "ineligible_provider",
  "reassignment_locked",
  "missing_assignment",
  "provider_unavailable",
  "dependencies_incomplete",
  "invalid_transition",
] as const;
export type TaskMutationError = (typeof TASK_MUTATION_ERRORS)[number];

export type TaskMutationResult =
  | { ok: true; record: ExecutionPlanRecord; alreadyApplied: boolean }
  | { ok: false; error: TaskMutationError };

export function assignProviderToTask(
  record: ExecutionPlanRecord,
  taskId: string,
  providerId: string,
): TaskMutationResult {
  const task = findTask(record, taskId);
  if (!task) {
    return { ok: false, error: "not_found" };
  }
  if (task.status !== "PLANNED") {
    return { ok: false, error: "reassignment_locked" };
  }
  const provider = liveEligibleProviders(task.requiredCapabilityId).find(
    (item) => item.id === providerId,
  );
  if (!provider) {
    return { ok: false, error: "ineligible_provider" };
  }
  if (
    task.assignedProvider?.id === provider.id &&
    task.assignedProvider.kind === provider.kind
  ) {
    return { ok: true, record, alreadyApplied: true };
  }
  return {
    ok: true,
    alreadyApplied: false,
    record: replaceTask(record, {
      ...task,
      assignedProvider: {
        id: provider.id,
        kind: provider.kind,
        label: provider.label,
      },
    }),
  };
}

export function startExecutionTask(
  record: ExecutionPlanRecord,
  taskId: string,
  startedAt: string,
): TaskMutationResult {
  const task = findTask(record, taskId);
  if (!task) {
    return { ok: false, error: "not_found" };
  }
  if (task.status === "IN_PROGRESS") {
    return { ok: true, record, alreadyApplied: true };
  }
  if (task.status !== "PLANNED") {
    return { ok: false, error: "invalid_transition" };
  }
  if (!task.assignedProvider) {
    return { ok: false, error: "missing_assignment" };
  }
  if (
    !assignedProviderStillValid(task.requiredCapabilityId, task.assignedProvider)
  ) {
    return { ok: false, error: "provider_unavailable" };
  }
  const byId = taskIndex(record);
  if (!dependenciesCompleted(task, byId)) {
    return { ok: false, error: "dependencies_incomplete" };
  }
  return {
    ok: true,
    alreadyApplied: false,
    record: replaceTask(record, {
      ...task,
      status: "IN_PROGRESS",
      startedAt,
    }),
  };
}

export function completeExecutionTask(
  record: ExecutionPlanRecord,
  taskId: string,
  completedAt: string,
): TaskMutationResult {
  const task = findTask(record, taskId);
  if (!task) {
    return { ok: false, error: "not_found" };
  }
  if (task.status === "COMPLETED") {
    return { ok: true, record, alreadyApplied: true };
  }
  if (task.status !== "IN_PROGRESS") {
    return { ok: false, error: "invalid_transition" };
  }
  return {
    ok: true,
    alreadyApplied: false,
    record: replaceTask(record, {
      ...task,
      status: "COMPLETED",
      completedAt,
    }),
  };
}

export function isProviderKind(value: string): value is ProviderKind {
  return value === "MACHINE" || value === "WORKCENTER";
}

export function assignedProviderFromRow(
  id: string | null,
  kind: string | null,
  label: string | null,
): AssignedExecutionProvider | null {
  if (!id || !kind || !label || !isProviderKind(kind)) {
    return null;
  }
  return { id, kind, label };
}

function findTask(
  record: ExecutionPlanRecord,
  taskId: string,
): ExecutionTask | undefined {
  return record.tasks.find((task) => task.taskId === taskId);
}

function taskIndex(record: ExecutionPlanRecord): Map<string, ExecutionTask> {
  return new Map(record.tasks.map((task) => [task.taskId, task]));
}

function replaceTask(
  record: ExecutionPlanRecord,
  next: ExecutionTask,
): ExecutionPlanRecord {
  return {
    ...record,
    tasks: record.tasks.map((task) => (task.taskId === next.taskId ? next : task)),
  };
}
