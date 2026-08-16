import { findPerson, type Person } from "../people/identity.js";
import type { ProviderKind } from "../workcenters/catalog.js";
import {
  buildActualConsumption,
  type ActualConsumptionLineInput,
} from "./consumption.js";
import {
  COMPLETION_NOTE_MAX_LENGTH,
  assignedExecutorStillActive,
  assignedProviderStillValid,
  dependenciesCompleted,
  liveEligibleProviders,
  measurablePlannedQuantity,
  type AssignedExecutionExecutor,
  type AssignedExecutionProvider,
  type ExecutionPlanRecord,
  type ExecutionTask,
  type TaskCompletionEvidence,
} from "./plan.js";

export const TASK_MUTATION_ERRORS = [
  "not_found",
  "ineligible_provider",
  "reassignment_locked",
  "missing_assignment",
  "missing_executor",
  "provider_unavailable",
  "executor_unavailable",
  "unknown_person",
  "retired_person",
  "dependencies_incomplete",
  "invalid_transition",
  "invalid_quantity",
  "invalid_unit",
  "invalid_resource",
  "invalid_note",
] as const;
export type TaskMutationError = (typeof TASK_MUTATION_ERRORS)[number];

export type TaskMutationResult =
  | { ok: true; record: ExecutionPlanRecord; alreadyApplied: boolean }
  | { ok: false; error: TaskMutationError };

export type TaskCompletionInput = {
  completedQuantity?: number;
  note?: string;
  actualConsumption?: readonly ActualConsumptionLineInput[];
};

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

export function assignExecutorToTask(
  record: ExecutionPlanRecord,
  taskId: string,
  personId: string,
  people: readonly Person[],
): TaskMutationResult {
  const task = findTask(record, taskId);
  if (!task) {
    return { ok: false, error: "not_found" };
  }
  if (task.status !== "PLANNED") {
    return { ok: false, error: "reassignment_locked" };
  }
  const person = findPerson(people, personId);
  if (!person) {
    return { ok: false, error: "unknown_person" };
  }
  if (person.status !== "ACTIVE") {
    return { ok: false, error: "retired_person" };
  }
  if (task.assignedExecutor?.id === person.personId) {
    return { ok: true, record, alreadyApplied: true };
  }
  return {
    ok: true,
    alreadyApplied: false,
    record: replaceTask(record, {
      ...task,
      assignedExecutor: {
        id: person.personId,
        label: person.displayName,
      },
    }),
  };
}

export function startExecutionTask(
  record: ExecutionPlanRecord,
  taskId: string,
  startedAt: string,
  people: readonly Person[] = [],
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
  if (!task.assignedExecutor) {
    return { ok: false, error: "missing_executor" };
  }
  if (!assignedExecutorStillActive(task.assignedExecutor, people)) {
    return { ok: false, error: "executor_unavailable" };
  }
  const live = findPerson(people, task.assignedExecutor.id);
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
      assignedExecutor: {
        id: task.assignedExecutor.id,
        label: live?.displayName ?? task.assignedExecutor.label,
      },
    }),
  };
}

export function completeExecutionTask(
  record: ExecutionPlanRecord,
  taskId: string,
  completedAt: string,
  input: TaskCompletionInput = {},
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
  const completion = buildCompletionEvidence(task, input);
  if (!completion.ok) {
    return completion;
  }
  const actuals = buildActualConsumption(task, input.actualConsumption, completedAt);
  if (!actuals.ok) {
    return actuals;
  }
  return {
    ok: true,
    alreadyApplied: false,
    record: replaceTask(record, {
      ...task,
      status: "COMPLETED",
      completedAt,
      completion: completion.evidence,
      actualConsumption: actuals.entries,
    }),
  };
}

export function plannedCompletionInput(task: ExecutionTask): TaskCompletionInput {
  const measurable = measurablePlannedQuantity(task);
  return measurable ? { completedQuantity: measurable.value } : {};
}

function buildCompletionEvidence(
  task: ExecutionTask,
  input: TaskCompletionInput,
): { ok: true; evidence: TaskCompletionEvidence } | { ok: false; error: TaskMutationError } {
  const note = readCompletionNote(input.note);
  if (note === false) {
    return { ok: false, error: "invalid_note" };
  }
  const measurable = measurablePlannedQuantity(task);
  if (!measurable) {
    if (input.completedQuantity !== undefined) {
      return { ok: false, error: "invalid_quantity" };
    }
    return {
      ok: true,
      evidence: {
        outcome: "COMPLETED_AS_PLANNED",
        completedQuantity: null,
        completedQuantityUnit: null,
        note,
      },
    };
  }
  if (!isValidCompletedQuantity(input.completedQuantity)) {
    return { ok: false, error: "invalid_quantity" };
  }
  return {
    ok: true,
    evidence: {
      outcome: quantitiesMatch(measurable.value, input.completedQuantity)
        ? "COMPLETED_AS_PLANNED"
        : "COMPLETED_WITH_VARIANCE",
      completedQuantity: input.completedQuantity,
      completedQuantityUnit: measurable.unit,
      note,
    },
  };
}

function isValidCompletedQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function quantitiesMatch(planned: number, actual: number): boolean {
  return Math.abs(planned - actual) < 1e-9;
}

function readCompletionNote(note: string | undefined): string | null | false {
  if (note === undefined) {
    return null;
  }
  if (typeof note !== "string") {
    return false;
  }
  const trimmed = note.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (trimmed.length > COMPLETION_NOTE_MAX_LENGTH) {
    return false;
  }
  return trimmed;
}

export function isProviderKind(value: string): value is ProviderKind {
  return value === "MACHINE" || value === "WORKCENTER";
}

export function isCompletionOutcome(
  value: string,
): value is TaskCompletionEvidence["outcome"] {
  return value === "COMPLETED_AS_PLANNED" || value === "COMPLETED_WITH_VARIANCE";
}

export function completionFromRow(
  outcome: string | null,
  completedQuantity: number | null,
  completedQuantityUnit: string | null,
  note: string | null,
): TaskCompletionEvidence | null {
  if (!outcome || !isCompletionOutcome(outcome)) {
    return null;
  }
  return {
    outcome,
    completedQuantity,
    completedQuantityUnit,
    note,
  };
}

export function assignedExecutorFromRow(
  id: string | null,
  label: string | null,
): AssignedExecutionExecutor | null {
  if (!id || !label) {
    return null;
  }
  return { id, label };
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
