import { useState } from "react";
import { Link } from "react-router-dom";
import {
  COMPLETION_NOTE_MAX_LENGTH,
  type ActualInternalCostLine,
  type ActualInternalCostProjection,
  type ExecutionPlanView,
  type ExecutionTaskView,
  type PlannedStartBlockReason,
} from "@workos-final/domain";
import {
  formatCostCompleteness,
  formatMoney,
  formatQuantity,
  formatUnit,
} from "./formatDisplay";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";

type TaskLane = "next" | "blocked" | "upcoming" | "completed" | "gap";

const LANES: readonly { id: TaskLane; label: string }[] = [
  { id: "next", label: "Acum / următorul" },
  { id: "blocked", label: "Blocate" },
  { id: "upcoming", label: "Urmează" },
  { id: "completed", label: "Finalizate" },
  { id: "gap", label: "Necesită configurare atelier" },
];

type ExecutionPlanPanelProps = {
  view: ExecutionPlanView;
  reused: boolean;
  busy: boolean;
  onAssignProvider: (taskId: string, providerId: string) => void;
  onAssignExecutor: (taskId: string, personId: string) => void;
  onStartTask: (taskId: string) => void;
  onCompleteTask: (
    taskId: string,
    input?: {
      completedQuantity?: number;
      note?: string;
      actualConsumption?: readonly { resourceId: string; actualQuantity: number }[];
    },
  ) => void;
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
  const lanes = LANES.map((lane) => ({
    ...lane,
    tasks: view.tasks.filter((task) => taskLane(task) === lane.id),
  })).filter((lane) => lane.tasks.length > 0);

  return (
    <div className="execution-plan">
      <header className="execution-plan-head">
        <h3>{reused ? "Plan de execuție deja creat" : "Plan de execuție"}</h3>
        <p className="execution-plan-product">{view.plan.inscription}</p>
        <p className={`task-status status-chip ${statusTone(view.statusLabel)}`}>
          Stare: {view.statusLabel}
        </p>
      </header>
      <p className="execution-plan-cost">
        Cost intern planificat: {formatMoney(view.plan.eicTotal)} {view.plan.eicCurrency}
        {formatCostCompleteness(view.plan.eicCompleteness)}
      </p>
      {view.actualInternalCost.status !== "UNAVAILABLE" ? (
        <section className="execution-internal-cost" aria-label="Rezumat cost intern">
          <p className="execution-plan-cost">
            Cost intern real: {actualCostSummary(view.actualInternalCost)}
          </p>
          {view.actualInternalCost.availableDifference !== null ? (
            <p className="execution-plan-cost">
              Diferență pe costurile disponibile:{" "}
              {formatSignedMoney(view.actualInternalCost.availableDifference)}{" "}
              {view.actualInternalCost.currency}
            </p>
          ) : null}
          <details className="execution-actual-cost-wrap">
            <summary>Detalii cost real</summary>
            <ActualInternalCostDetails cost={view.actualInternalCost} />
          </details>
        </section>
      ) : null}
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
          <li>Proveniență: {view.sourceKindLabel}</li>
          <li>Referință: {view.plan.planId}</li>
        </ul>
      </details>
      {lanes.length === 0 ? (
        <EmptyState title="Nu există taskuri în acest plan." />
      ) : (
        lanes.map((lane) => (
          <section
            key={lane.id}
            className={`execution-lane${lane.id === "gap" ? " is-quiet" : ""}`}
            aria-labelledby={`execution-lane-${lane.id}`}
          >
            <h4 id={`execution-lane-${lane.id}`}>{lane.label}</h4>
            <ol className="production-ops">
              {lane.tasks.map((task) => (
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
          </section>
        ))
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
  onCompleteTask: (
    taskId: string,
    input?: {
      completedQuantity?: number;
      note?: string;
      actualConsumption?: readonly { resourceId: string; actualQuantity: number }[];
    },
  ) => void;
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
  const [actualQuantities, setActualQuantities] = useState<Record<string, string>>({});

  function submitComplete() {
    const trimmedNote = note.trim();
    const actualConsumption = task.resourceDemands.flatMap((demand) => {
      const raw = actualQuantities[demand.resourceId]?.trim() ?? "";
      if (raw.length === 0) {
        return [];
      }
      const parsed = Number(raw.replace(",", "."));
      return Number.isFinite(parsed)
        ? [{ resourceId: demand.resourceId, actualQuantity: parsed }]
        : [];
    });
    const payload = {
      ...(trimmedNote ? { note: trimmedNote } : {}),
      ...(actualConsumption.length > 0 ? { actualConsumption } : {}),
    };
    if (!task.requiresCompletedQuantity) {
      onCompleteTask(task.taskId, payload);
      return;
    }
    const parsed = Number(completedQuantity.replace(",", "."));
    onCompleteTask(task.taskId, {
      ...(Number.isFinite(parsed) ? { completedQuantity: parsed } : {}),
      ...payload,
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
              {task.requiresProvider
                ? task.assignedProvider
                  ? `Alocat: ${task.assignedProvider.label}`
                  : "Alocare: Nealocat"
                : task.providerRequirementLabel}
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
          {task.status === "COMPLETED" && task.hasPlannedResources ? (
            <div>
              <dt>Consum real</dt>
              <dd>
                {task.actualConsumption.length === 0
                  ? "Fără consum înregistrat"
                  : task.actualConsumption
                      .map(
                        (entry) =>
                          `${entry.resourceLabel}: ${formatQuantity(entry.actualQuantity)} ${formatUnit(entry.unit)}`,
                      )
                      .join("; ")}
              </dd>
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
        {task.status === "PLANNED" && task.assignedExecutor && task.startBlockReason ? (
          <Notice compact>
            <p>{plannedStartBlockLabel(task.startBlockReason)}</p>
          </Notice>
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
            {task.canRecordActualConsumption ? (
              <details className="task-consumption">
                <summary>Consum real</summary>
                <ul className="task-consumption-list">
                  {task.resourceDemands.map((demand) => (
                    <li key={demand.resourceId} className="task-consumption-row">
                      <p>
                        Planificat: {demand.label} — {formatQuantity(demand.quantity)}{" "}
                        {formatUnit(demand.unit)}
                      </p>
                      <p>Unitate: {formatUnit(demand.unit)}</p>
                      <Field label={`Cantitate folosită (${demand.label})`}>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={actualQuantities[demand.resourceId] ?? ""}
                          onChange={(event) =>
                            setActualQuantities((current) => ({
                              ...current,
                              [demand.resourceId]: event.target.value,
                            }))
                          }
                          disabled={busy}
                        />
                      </Field>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
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
      {task.requiresProvider && task.eligibleProviders.length === 0 ? (
        <Notice compact>
          <p>Necesită configurare atelier. Nu există echipament sau zonă eligibilă.</p>
        </Notice>
      ) : null}
      {task.status === "PLANNED" &&
      !task.assignedExecutor &&
      task.eligibleExecutors.length === 0 ? (
        <Notice compact>
          <p>Nicio persoană eligibilă acum pentru această operație.</p>
          <p>
            <Link to="/admin/people">Deschide oamenii</Link>
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

function ActualInternalCostDetails({ cost }: { cost: ActualInternalCostProjection }) {
  if (cost.lines.length === 0) {
    return <p>Nu există încă un cost intern real calculabil.</p>;
  }
  const groups = groupActualCostLines(cost.lines);
  return (
    <div className="actual-internal-cost-details">
      {groups.map((group) => (
        <section key={group.label}>
          <h5>{group.label}</h5>
          <ul>
            {group.lines.map((line) => (
              <li key={line.resourceId}>
                <p>
                  {line.label}: {line.statusLabel}
                </p>
                {line.status === "CALCULABLE" ? (
                  <p>
                    {formatQuantity(line.actualQuantity ?? 0)} {formatUnit(line.unit)} · tarif{" "}
                    {formatMoney(line.rate ?? 0)} {line.currency} ·{" "}
                    {formatMoney(line.actualCost ?? 0)} {line.currency}
                  </p>
                ) : (
                  <p>{line.unavailableReason}</p>
                )}
                <p>
                  {line.quantitySourceLabel}. {line.costSourceLabel}.
                </p>
                {line.sourceTaskLabels.length > 0 ? (
                  <p>Task: {line.sourceTaskLabels.join(", ")}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function groupActualCostLines(lines: readonly ActualInternalCostLine[]) {
  const groups = new Map<string, ActualInternalCostLine[]>();
  for (const line of lines) {
    const label = line.groupLabel ?? "Alte";
    const current = groups.get(label) ?? [];
    current.push(line);
    groups.set(label, current);
  }
  return [...groups.entries()].map(([label, groupLines]) => ({
    label,
    lines: groupLines,
  }));
}

function actualCostSummary(cost: ActualInternalCostProjection): string {
  if (cost.status === "UNAVAILABLE" || cost.calculableTotal === null) {
    return "indisponibil";
  }
  const partial = cost.status === "PARTIAL" ? " (parțial)" : "";
  return `${formatMoney(cost.calculableTotal)} ${cost.currency}${partial}`;
}

function formatSignedMoney(value: number): string {
  const labeled = formatMoney(Math.abs(value));
  if (value > 0) {
    return `+${labeled}`;
  }
  if (value < 0) {
    return `−${labeled}`;
  }
  return labeled;
}

function taskLane(task: ExecutionTaskView): TaskLane {
  if (task.status === "COMPLETED") {
    return "completed";
  }
  if (task.requiresProvider && task.eligibleProviders.length === 0) {
    return "gap";
  }
  if (task.status === "IN_PROGRESS" || task.canStart) {
    return "next";
  }
  if (task.waitingFor.length > 0) {
    return "upcoming";
  }
  return "blocked";
}

function plannedStartBlockLabel(reason: PlannedStartBlockReason): string {
  switch (reason) {
    case "unavailable_person":
      return "Persoana alocată este indisponibilă temporar. Startul este blocat.";
    case "ineligible_executor":
      return "Persoana alocată nu mai este eligibilă pentru această operație. Startul este blocat.";
    case "executor_unavailable":
      return "Persoana alocată nu mai este activă. Startul este blocat.";
    default: {
      const _exhaustive: never = reason;
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
