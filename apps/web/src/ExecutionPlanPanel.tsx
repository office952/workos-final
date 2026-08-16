import { useState } from "react";
import { Link } from "react-router-dom";
import {
  COMPLETION_NOTE_MAX_LENGTH,
  type ExecutionPlanView,
  type ExecutionTaskView,
} from "@workos-final/domain";
import { formatMoney, formatQuantity, formatUnit } from "./formatDisplay";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";

type TaskFilter = "all" | "todo" | "active" | "done";

const FILTERS: readonly { id: TaskFilter; label: string }[] = [
  { id: "all", label: "Toate" },
  { id: "todo", label: "De făcut" },
  { id: "active", label: "În lucru" },
  { id: "done", label: "Finalizate" },
];

type ExecutionPlanPanelProps = {
  view: ExecutionPlanView;
  reused: boolean;
  busy: boolean;
  onAssignProvider: (taskId: string, providerId: string) => void;
  onAssignExecutor: (taskId: string, personId: string) => void;
  onStartTask: (taskId: string) => void;
  onCompleteTask: (taskId: string, input?: { completedQuantity?: number; note?: string }) => void;
};

export function ExecutionPlanPanel({
  view,
  reused,
  busy,
  onAssignProvider,
  onAssignExecutor,
  onStartTask,
  onCompleteTask,
}: ExecutionPlanPanelProps) {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const visible = view.tasks.filter((task) => matchesFilter(task, filter));

  return (
    <div className="execution-plan">
      <header className="execution-plan-head">
        <h3>{reused ? "Plan de execuție deja creat" : "Plan de execuție"}</h3>
        <p className="execution-plan-product">{view.plan.inscription}</p>
        <p className={`task-status status-chip ${statusTone(view.statusLabel)}`}>
          Stare: {view.statusLabel}
        </p>
        <p className="execution-plan-cost">
          Cost intern din snapshot: {formatMoney(view.plan.eicTotal)}{" "}
          {view.plan.eicCurrency}
          {view.plan.eicCompleteness === "PARTIAL" ? " (parțial)" : ""}
        </p>
      </header>
      <ul className="execution-progress metric-row">
        <li>
          {view.progress.completed} / {view.progress.total} finalizate
        </li>
        <li>Planificate {view.progress.planned}</li>
        <li>În lucru: {view.progress.inProgress}</li>
        <li>În așteptare: {view.progress.waitingDependencies}</li>
        <li>Fără furnizor: {view.progress.noProvider}</li>
        <li>Fără executant: {view.progress.noExecutor}</li>
        {view.progress.varianceCount > 0 ? (
          <li>Abateri: {view.progress.varianceCount}</li>
        ) : null}
      </ul>
      <details className="execution-plan-meta-wrap">
        <summary>Detalii plan</summary>
        <ul className="execution-plan-meta">
          <li>Produs: {view.plan.productLabel}</li>
          <li>Referință: {view.plan.planId}</li>
        </ul>
      </details>
      <div className="filter-row" role="tablist" aria-label="Filtru taskuri">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={filter === item.id ? "button-quiet is-selected" : "button-quiet"}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <EmptyState title="Niciun task în acest filtru." />
      ) : (
        <ol className="production-ops">
          {visible.map((task) => (
            <ExecutionTaskCard
              key={task.taskId}
              task={task}
              busy={busy}
              onAssignProvider={onAssignProvider}
              onAssignExecutor={onAssignExecutor}
              onStartTask={onStartTask}
              onCompleteTask={onCompleteTask}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

function ExecutionTaskCard({
  task,
  busy,
  onAssignProvider,
  onAssignExecutor,
  onStartTask,
  onCompleteTask,
}: {
  task: ExecutionTaskView;
  busy: boolean;
  onAssignProvider: (taskId: string, providerId: string) => void;
  onAssignExecutor: (taskId: string, personId: string) => void;
  onStartTask: (taskId: string) => void;
  onCompleteTask: (taskId: string, input?: { completedQuantity?: number; note?: string }) => void;
}) {
  const [providerId, setProviderId] = useState(
    task.assignedProvider?.id ?? task.eligibleProviders[0]?.id ?? "",
  );
  const [executorId, setExecutorId] = useState(
    task.assignedExecutor?.id ?? task.eligibleExecutors[0]?.id ?? "",
  );
  const [completedQuantity, setCompletedQuantity] = useState(
    task.measurableQuantity ? String(task.measurableQuantity.value) : "",
  );
  const [note, setNote] = useState("");

  function submitComplete() {
    const trimmedNote = note.trim();
    if (!task.requiresCompletedQuantity) {
      onCompleteTask(task.taskId, trimmedNote ? { note: trimmedNote } : {});
      return;
    }
    const parsed = Number(completedQuantity.replace(",", "."));
    onCompleteTask(task.taskId, {
      ...(Number.isFinite(parsed) ? { completedQuantity: parsed } : {}),
      ...(trimmedNote ? { note: trimmedNote } : {}),
    });
  }

  const plannedLabel = task.measurableQuantity
    ? `${formatQuantity(task.measurableQuantity.value)} ${formatUnit(task.measurableQuantity.unit)}`
    : null;

  return (
    <li
      className={`production-op task-row${task.status === "COMPLETED" ? " is-complete" : ""}${
        task.canStart || task.canComplete ? " is-actionable" : ""
      }`}
    >
      <div className="task-row-main">
        <p className="task-seq">{task.seqLabel}</p>
        <div className="task-identity">
          <h4>
            {task.seqLabel}. {task.processLabel}
          </h4>
          <p>Componentă: {task.scopeLabel}</p>
        </div>
        <div className="task-status-col">
          <p className={`task-status status-chip ${statusTone(task.statusLabel)}`}>
            Stare: {task.statusLabel}
          </p>
          {task.varianceLabel ? (
            <p className={`status-chip ${varianceTone(task.varianceLabel)}`}>{task.varianceLabel}</p>
          ) : null}
        </div>
        <dl className="task-facts">
          <div>
            <dt>Echipament / zonă</dt>
            <dd>
              {task.assignedProvider
                ? `Alocat: ${task.assignedProvider.label}`
                : "Alocare: Nealocat"}
            </dd>
          </div>
          <div>
            <dt>Executant</dt>
            <dd>
              {task.assignedExecutor
                ? `Executant: ${task.assignedExecutor.label}`
                : "Executant: Nealocat"}
            </dd>
          </div>
          {plannedLabel ? (
            <div>
              <dt>Planificat</dt>
              <dd>Cantitate planificată: {plannedLabel}</dd>
            </div>
          ) : null}
          {task.completedQuantityLabel ? (
            <div>
              <dt>Realizat</dt>
              <dd>{task.completedQuantityLabel}</dd>
            </div>
          ) : null}
        </dl>
        <div className="task-actions">
        {task.canAssign ? (
          <>
            <Field label="Echipament / zonă">
              <select
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
                disabled={busy}
              >
                {task.eligibleProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              disabled={busy || providerId.length === 0}
              onClick={() => onAssignProvider(task.taskId, providerId)}
            >
              Alocă
            </button>
          </>
        ) : null}
        {task.canAssignExecutor ? (
          <>
            <Field label="Executant">
              <select
                value={executorId}
                onChange={(event) => setExecutorId(event.target.value)}
                disabled={busy}
              >
                {task.eligibleExecutors.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.label}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              className="button-secondary"
              disabled={busy || executorId.length === 0}
              onClick={() => onAssignExecutor(task.taskId, executorId)}
            >
              Alocă executant
            </button>
          </>
        ) : null}
        {task.canStart ? (
          <button type="button" disabled={busy} onClick={() => onStartTask(task.taskId)}>
            Pornește
          </button>
        ) : null}
        {task.canComplete ? (
          <>
            {task.requiresCompletedQuantity ? (
              <Field label="Cantitate realizată">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={completedQuantity}
                  onChange={(event) => setCompletedQuantity(event.target.value)}
                  disabled={busy}
                />
              </Field>
            ) : null}
            <Field label="Notă">
              <input
                type="text"
                maxLength={COMPLETION_NOTE_MAX_LENGTH}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={busy}
              />
            </Field>
            <button type="button" disabled={busy} onClick={submitComplete}>
              Finalizează
            </button>
          </>
        ) : null}
        </div>
      </div>
      {task.waitingFor.length > 0 ? (
        <Notice compact>
          <p>Așteaptă: {task.waitingFor.join("; ")}</p>
        </Notice>
      ) : null}
      {task.eligibleProviders.length === 0 ? (
        <Notice tone="warn" compact>
          <p>Fără furnizor disponibil</p>
        </Notice>
      ) : null}
      {task.status === "PLANNED" &&
      !task.assignedExecutor &&
      task.eligibleExecutors.length === 0 ? (
        <Notice compact>
          <p>Nu există persoane active configurate.</p>
          <p>
            <Link to="/admin/people">Adaugă prima persoană</Link>
          </p>
        </Notice>
      ) : null}
      {task.status === "PLANNED" &&
      !task.assignedExecutor &&
      task.eligibleExecutors.length > 0 ? (
        <p className="task-block-reason">Executant nealocat</p>
      ) : null}
      {task.completion?.note ? <p className="task-note">Notă: {task.completion.note}</p> : null}
      <details className="task-details">
        <summary>Detalii</summary>
        <p>Capabilitate: {task.requiredCapabilityLabel}</p>
        {task.startedAt ? (
          <p>Pornit la: {new Date(task.startedAt).toLocaleString("ro-RO")}</p>
        ) : null}
        {task.completedAt ? (
          <p>Finalizat la: {new Date(task.completedAt).toLocaleString("ro-RO")}</p>
        ) : null}
      </details>
    </li>
  );
}

function matchesFilter(task: ExecutionTaskView, filter: TaskFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "todo":
      return task.status === "PLANNED";
    case "active":
      return task.status === "IN_PROGRESS";
    case "done":
      return task.status === "COMPLETED";
    default: {
      const _exhaustive: never = filter;
      return _exhaustive;
    }
  }
}

function statusTone(label: string): string {
  switch (label) {
    case "În lucru":
      return "status-chip-progress";
    case "Finalizat":
      return "status-chip-done";
    default:
      return "status-chip-neutral";
  }
}

function varianceTone(label: string): string {
  return label === "Conform planului" ? "status-chip-ok" : "status-chip-warn";
}
