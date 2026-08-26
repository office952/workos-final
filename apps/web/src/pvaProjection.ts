import type { ExecutionPlanView, ExecutionTaskView } from "@workos-final/domain";
import { formatQuantity, formatUnit } from "./formatDisplay";

export type MeasuredOrUnknown =
  | { kind: "measured"; label: string }
  | { kind: "unknown" }
  | { kind: "not_measured" };

export type PlannedVersusActualRow = {
  taskId: string;
  seqLabel: string;
  processLabel: string;
  scopeLabel: string;
  statusLabel: string;
  planned: MeasuredOrUnknown;
  actual: MeasuredOrUnknown;
  difference: MeasuredOrUnknown;
  duration: MeasuredOrUnknown;
  operatorLabel: string | null;
  providerLabel: string | null;
  deviationReason: string | null;
};

function unknown(): MeasuredOrUnknown {
  return { kind: "unknown" };
}

function notMeasured(): MeasuredOrUnknown {
  return { kind: "not_measured" };
}

function measured(label: string): MeasuredOrUnknown {
  return { kind: "measured", label };
}

export function measuredLabel(value: MeasuredOrUnknown): string {
  switch (value.kind) {
    case "measured":
      return value.label;
    case "unknown":
      return "Necunoscut";
    case "not_measured":
      return "Nemăsurat";
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

function quantityLabel(value: number, unit: string): string {
  return `${formatQuantity(value)} ${formatUnit(unit)}`;
}

function durationLabel(startedAt: string, completedAt: string): string | null {
  const start = Date.parse(startedAt);
  const end = Date.parse(completedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }
  const hours = (end - start) / 3_600_000;
  return `${hours.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} h`;
}

function rowFromTask(task: ExecutionTaskView): PlannedVersusActualRow {
  const planned = task.measurableQuantity
    ? measured(quantityLabel(task.measurableQuantity.value, task.measurableQuantity.unit))
    : unknown();
  let actual: MeasuredOrUnknown = unknown();
  let difference: MeasuredOrUnknown = unknown();
  if (task.status === "COMPLETED") {
    if (task.measurableQuantity && task.completion?.completedQuantity != null) {
      actual = measured(
        quantityLabel(task.completion.completedQuantity, task.measurableQuantity.unit),
      );
      const delta = task.completion.completedQuantity - task.measurableQuantity.value;
      difference = measured(
        `${delta > 0 ? "+" : ""}${quantityLabel(delta, task.measurableQuantity.unit)}`,
      );
    } else if (task.measurableQuantity) {
      actual = notMeasured();
      difference = notMeasured();
    } else {
      actual = notMeasured();
      difference = unknown();
    }
  } else if (task.status === "IN_PROGRESS") {
    actual = notMeasured();
    difference = notMeasured();
  }

  let duration: MeasuredOrUnknown = unknown();
  if (task.startedAt && task.completedAt) {
    const label = durationLabel(task.startedAt, task.completedAt);
    duration = label ? measured(label) : unknown();
  } else if (task.status === "COMPLETED" || task.status === "IN_PROGRESS") {
    duration = notMeasured();
  }

  return {
    taskId: task.taskId,
    seqLabel: task.seqLabel,
    processLabel: task.processLabel,
    scopeLabel: task.scopeLabel,
    statusLabel: task.statusLabel,
    planned,
    actual,
    difference,
    duration,
    operatorLabel: task.assignedExecutor?.label ?? null,
    providerLabel: task.requiresProvider ? task.assignedProvider?.label ?? null : null,
    deviationReason: task.completion?.note ?? null,
  };
}

export function projectPlannedVersusActual(
  view: ExecutionPlanView,
): readonly PlannedVersusActualRow[] {
  return view.tasks.map(rowFromTask);
}
