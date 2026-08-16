import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  COMPLETION_NOTE_MAX_LENGTH,
  eicLineGroupLabel,
  type AcceptedProductionSnapshot,
  type DraftValues,
  type EicLine,
  type EicLineGroup,
  type EicResult,
  type ExecutionPlanPreview,
  type ExecutionPlanView,
  type ExecutionTaskView,
  type ProductAggregate,
  type ProductDefinition,
  type ProductTruth,
} from "@workos-final/domain";
import { FormRenderer } from "./FormRenderer";
import {
  acceptProductionSnapshot,
  assignExecutionTaskExecutor,
  assignExecutionTaskProvider,
  compileConfiguration,
  completeExecutionTask,
  confirmReviewedConfiguration,
  createExecutionPlan,
  fetchTemplateProjection,
  startExecutionTask,
  type TemplateProjection,
} from "./productApi";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; projection: TemplateProjection };

function formatQuantity(value: number): string {
  return value.toLocaleString("ro-RO", { maximumFractionDigits: 2 });
}

function formatUnit(unit: string): string {
  switch (unit) {
    case "m2":
      return "m²";
    case "mm2":
      return "mm²";
    case "W":
      return "W";
    case "buc":
      return "buc";
    default:
      return unit;
  }
}

function lightingUnavailableReason(aggregate: ProductAggregate): string {
  const lighting = aggregate.componentStatuses.find((item) => item.id === "LIGHTING");
  if (!lighting || lighting.status === "CALCULATED") {
    return "";
  }
  if (lighting.unavailable.length === 0) {
    return " Iluminarea nu este calculată.";
  }
  return ` Iluminarea nu este calculată: ${lighting.unavailable.join("; ")}.`;
}

function measurementCopy(value: number, unit: string): string {
  if (unit === "mm2") {
    return `Suprafață confirmată: ${value} mm² (introdusă de operator)`;
  }
  return `Perimetru confirmat: ${value} mm (introdus de operator)`;
}

function formatMoney(value: number): string {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const EIC_GROUP_ORDER: readonly EicLineGroup[] = [
  "materials",
  "services",
  "labor",
  "lighting",
];

function eicGroups(eic: EicResult): Array<[EicLineGroup, EicLine[]]> {
  return EIC_GROUP_ORDER.flatMap((group) => {
    const lines = eic.lines.filter((line) => line.group === group);
    return lines.length === 0 ? [] : [[group, lines]];
  });
}

export function ProductConfigurationPage() {
  const { productCode = "" } = useParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [values, setValues] = useState<DraftValues>({});
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<{
    truth: ProductTruth;
    aggregate: ProductAggregate;
    eic: EicResult;
    executionPlanPreview: ExecutionPlanPreview;
    definition: ProductDefinition;
    snapshot?: AcceptedProductionSnapshot;
    snapshotReused?: boolean;
    executionPlan?: ExecutionPlanView;
    executionPlanReused?: boolean;
  } | null>(null);
  const [confirmNotice, setConfirmNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    setDefinition(null);
    setConfirmed(null);
    setConfirmNotice(null);

    void fetchTemplateProjection(productCode)
      .then((projection) => {
        if (cancelled) {
          return;
        }
        setPage(projection ? { kind: "ready", projection } : { kind: "missing" });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productCode]);

  if (page.kind === "loading") {
    return <p>Se încarcă produsul…</p>;
  }
  if (page.kind === "missing") {
    return <p>Produsul cerut nu este disponibil.</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-a putut încărca produsul.</p>;
  }

  const { template, formSchema } = page.projection;

  async function handleCompile() {
    setBusy(true);
    setConfirmed(null);
    setConfirmNotice(null);
    try {
      setDefinition(await compileConfiguration(productCode, values));
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    if (!definition) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await confirmReviewedConfiguration(productCode, definition);
      if (result.ok) {
        setConfirmed({
          truth: result.truth,
          aggregate: result.aggregate,
          eic: result.eic,
          executionPlanPreview: result.executionPlanPreview,
          definition,
        });
        setDefinition(null);
      } else if (result.reason === "review_mismatch") {
        setDefinition(null);
        setConfirmed(null);
        setConfirmNotice(
          "Configurația verificată nu mai corespunde. Verificați din nou.",
        );
      } else {
        setDefinition(result.definition);
        setConfirmed(null);
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleAcceptProduction() {
    if (!confirmed) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await acceptProductionSnapshot(productCode, confirmed.definition);
      if (result.ok) {
        setConfirmed({
          ...confirmed,
          snapshot: result.snapshot,
          snapshotReused: !result.created,
        });
      } else if (result.reason === "review_mismatch") {
        setConfirmed(null);
        setDefinition(null);
        setConfirmNotice(
          "Configurația verificată nu mai corespunde. Verificați din nou.",
        );
      } else {
        setConfirmed(null);
        setDefinition(result.definition);
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateExecutionPlan() {
    if (!confirmed?.snapshot) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createExecutionPlan(productCode, confirmed.snapshot.snapshotId);
      setConfirmed({
        ...confirmed,
        executionPlan: result.executionPlan,
        executionPlanReused: !result.created,
      });
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function applyTaskMutation(
    action: () => Promise<
      { ok: true; executionPlan: ExecutionPlanView } | { ok: false; error: string }
    >,
  ) {
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await action();
      if (!result.ok) {
        setConfirmNotice(taskActionNotice(result.error));
        return;
      }
      setConfirmed((current) =>
        current ? { ...current, executionPlan: result.executionPlan } : current,
      );
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>{template.label}</h1>
      <p className="page-lead">{template.description}</p>

      {template.identityFacts.length > 0 ? (
        <div className="notice">
          <h2>Caracteristici produs</h2>
          <ul>
            {template.identityFacts.map((fact) => (
              <li key={fact.id}>
                {fact.label}: {fact.value}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {confirmed || definition?.readiness === "ready" ? null : (
        <>
          <FormRenderer
            template={template}
            schema={formSchema}
            values={values}
            onChange={(fieldId, value) => {
              setValues((current) => ({ ...current, [fieldId]: value }));
              setDefinition(null);
              setConfirmed(null);
              setConfirmNotice(null);
            }}
          />

          <div className="action-row">
            <button type="button" onClick={() => void handleCompile()} disabled={busy}>
              Verifică configurația
            </button>
          </div>
        </>
      )}

      {confirmNotice ? <p className="notice notice-blocked">{confirmNotice}</p> : null}

      {definition?.readiness === "blocked" ? (
        <div className="notice notice-blocked">
          <p>Mai sunt informații de completat.</p>
          <ul>
            {definition.missing.map((item) => (
              <li key={item.fieldId}>{item.label}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {definition?.readiness === "ready" && !confirmed ? (
        <div className="notice">
          <h2>Verificare înainte de confirmare</h2>
          <p>Revizuiți configurația. Nu mai editați formularul în acest pas.</p>
          <p>Produs: {template.label}</p>
          <p>
            Componente active:{" "}
            {template.components
              .filter((component) =>
                definition.selectedComponentIds.includes(component.id),
              )
              .map((component) => component.label)
              .join(", ")}
          </p>
          <ul>
            {formSchema.sections
              .flatMap((section) => section.fields)
              .filter(
                (field) =>
                  definition.values[field.id] !== undefined &&
                  field.type !== "boolean",
              )
              .map((field) => {
                const raw = definition.values[field.id];
                const label =
                  field.options?.find((option) => option.value === raw)?.label ??
                  String(raw);
                return (
                  <li key={field.id}>
                    {field.label}: {label}
                  </li>
                );
              })}
          </ul>
          {definition.measurements.length > 0 ? (
            <p>
              Măsurătorile de mai sus sunt introduse de operator. Nu sunt geometrie
              calculată de WorkOS.
            </p>
          ) : null}
          <div className="action-row">
            <button type="button" onClick={() => void handleConfirm()} disabled={busy}>
              Confirmă configurația
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setDefinition(null);
                setConfirmNotice(null);
              }}
            >
              Modifică configurația
            </button>
          </div>
        </div>
      ) : null}

      {confirmed ? (
        <div className="notice notice-ok">
          <h2>Configurație confirmată</h2>
          <p>
            {confirmed.aggregate.productLabel}: {confirmed.aggregate.inscription}
          </p>
          {confirmed.aggregate.components
            .filter((component) => component.details.length > 0)
            .map((component) => (
              <div key={component.id}>
                <h3>{component.label}</h3>
                <ul>
                  {component.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}

          {confirmed.truth.measurements.map((measurement) => (
            <p key={measurement.fieldId}>
              {measurementCopy(measurement.value, measurement.unit)}
            </p>
          ))}

          <h3>Cantitate tehnică</h3>
          {confirmed.aggregate.quantities.length === 0 ? (
            <p>Cantitatea tehnică nu poate fi calculată fără măsurătoare confirmată.</p>
          ) : (
            <ul>
              {confirmed.aggregate.quantities.map((quantity) => (
                <li key={quantity.id}>
                  {quantity.label}: {formatQuantity(quantity.value)}{" "}
                  {formatUnit(quantity.unit)}
                </li>
              ))}
            </ul>
          )}

          <h3>Resurse necesare</h3>
          {confirmed.eic.lines.length === 0 ? (
            <p>Nu există încă o cerere de resurse pentru acest produs.</p>
          ) : (
            eicGroups(confirmed.eic).map(([group, lines]) => (
              <div key={`need-${group}`}>
                <h4>{eicLineGroupLabel(group)}</h4>
                <ul>
                  {lines.map((line) => (
                    <li key={`${line.resourceId}-need`}>
                      {line.label}: {formatQuantity(line.quantity)} {formatUnit(line.unit)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          <h3>Cost intern estimat</h3>
          <p>
            Costul intern al produsului este parțial. Include materialele, serviciile,
            manopera și iluminarea calculate. Rămâne de calibrat pe costurile reale de
            atelier.
            {lightingUnavailableReason(confirmed.aggregate)}
          </p>
          {confirmed.eic.lines.length === 0 ? (
            <p>Costul intern nu este disponibil pentru componentele necalculate.</p>
          ) : (
            eicGroups(confirmed.eic).map(([group, lines]) => (
              <div key={`cost-${group}`}>
                <h4>{eicLineGroupLabel(group)}</h4>
                <ul>
                  {lines.map((line) => (
                    <li key={`${line.resourceId}-cost`}>
                      {line.label}: {formatQuantity(line.quantity)} {formatUnit(line.unit)} ×{" "}
                      {formatMoney(line.rate)} {line.currency}/{formatUnit(line.unit)} ={" "}
                      {formatMoney(line.cost)} {line.currency}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {confirmed.eic.lines.length > 0 ? (
            <p>
              Total cost intern estimat: {formatMoney(confirmed.eic.total)}{" "}
              {confirmed.eic.currency}
            </p>
          ) : null}
          {confirmed.eic.excludedComponentLabels.length > 0 ? (
            <p>
              Neincluse încă în costul intern pilot:{" "}
              {confirmed.eic.excludedComponentLabels.join(", ")}.
            </p>
          ) : null}
          <p className="page-lead">
            Indisponibil acum: {confirmed.aggregate.unavailable.join(", ")}.
          </p>

          <ExecutionPlanPreviewSection
            preview={confirmed.executionPlanPreview}
            basedOnSnapshot={Boolean(confirmed.snapshot)}
          />

          <div className="action-row">
            <button type="button" onClick={() => void handleAcceptProduction()} disabled={busy}>
              Acceptă pentru producție
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmed(null);
                setDefinition(null);
              }}
            >
              Modifică configurația
            </button>
          </div>

          {confirmed.snapshot ? (
            <AcceptedProductionSnapshotSection
              snapshot={confirmed.snapshot}
              reused={Boolean(confirmed.snapshotReused)}
              onCreatePlan={() => void handleCreateExecutionPlan()}
              busy={busy}
            />
          ) : null}

          {confirmed.executionPlan ? (
            <PersistedExecutionPlanSection
              view={confirmed.executionPlan}
              reused={Boolean(confirmed.executionPlanReused)}
              busy={busy}
              onAssignProvider={(taskId, providerId) =>
                void applyTaskMutation(() => assignExecutionTaskProvider(taskId, providerId))
              }
              onAssignExecutor={(taskId, personId) =>
                void applyTaskMutation(() => assignExecutionTaskExecutor(taskId, personId))
              }
              onStartTask={(taskId) => void applyTaskMutation(() => startExecutionTask(taskId))}
              onCompleteTask={(taskId, input) =>
                void applyTaskMutation(() => completeExecutionTask(taskId, input))
              }
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function ExecutionPlanPreviewSection({
  preview,
  basedOnSnapshot,
}: {
  preview: ExecutionPlanPreview;
  basedOnSnapshot: boolean;
}) {
  return (
    <div className="production-plan">
      <h3>Plan de producție</h3>
      {basedOnSnapshot ? <p>Plan bazat pe snapshot acceptat</p> : null}
      <p>
        {preview.summary.productLabel}: {preview.summary.inscription}
      </p>
      <ul>
        <li>Operații: {preview.summary.operationCount}</li>
        <li>Pregătite: {preview.summary.readyCount}</li>
        <li>Incomplete: {preview.summary.incompleteCount}</li>
        <li>Fără furnizor: {preview.summary.noProviderCount}</li>
        <li>
          Cost intern curent: {formatMoney(preview.summary.internalCostTotal)}{" "}
          {preview.summary.internalCostCurrency}
          {preview.summary.internalCostCompleteness === "PARTIAL" ? " (parțial)" : ""}
        </li>
      </ul>
      <p className="page-lead">{preview.summary.analyzerNote}</p>
      <ol className="production-ops">
        {preview.operations.map((operation) => (
          <li key={operation.id} className="production-op">
            <h4>
              {operation.seqLabel}. {operation.processLabel}
            </h4>
            <p>Componentă: {operation.scopeLabel}</p>
            {operation.quantities.map((quantity) => (
              <p key={`${operation.id}-${quantity.label}`}>
                Cantitate: {formatQuantity(quantity.value)} {formatUnit(quantity.unit)}
              </p>
            ))}
            {operation.resources.map((resource) => (
              <p key={`${operation.id}-${resource.label}`}>
                Resursă: {resource.label}: {formatQuantity(resource.quantity)}{" "}
                {formatUnit(resource.unit)}
              </p>
            ))}
            <p>Capabilitate: {operation.requiredCapabilityLabel}</p>
            <p>
              Furnizori disponibili:{" "}
              {operation.eligibleProviders.length === 0
                ? "Fără furnizor configurat"
                : operation.eligibleProviders.map((item) => item.label).join("; ")}
            </p>
            <p>
              {operation.canStart
                ? "Poate începe"
                : `Depinde de: ${operation.dependsOnLabels.join("; ")}`}
            </p>
            {operation.parallelEligible ? <p>Poate rula în paralel</p> : null}
            <p>Stare: {operation.readinessLabel}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AcceptedProductionSnapshotSection({
  snapshot,
  reused,
  onCreatePlan,
  busy,
}: {
  snapshot: AcceptedProductionSnapshot;
  reused: boolean;
  onCreatePlan: () => void;
  busy: boolean;
}) {
  return (
    <div className="production-snapshot">
      <h3>{reused ? "Snapshot deja acceptat" : "Snapshot producție creat"}</h3>
      <ul>
        <li>Referință: {snapshot.snapshotId}</li>
        <li>Produs: {snapshot.productLabel}</li>
        <li>
          Acceptat: {new Date(snapshot.createdAt).toLocaleString("ro-RO")}
        </li>
        <li>Operații: {snapshot.operations.length}</li>
        <li>
          Cost intern curent: {formatMoney(snapshot.eic.total)} {snapshot.eic.currency}
          {snapshot.eic.completeness === "PARTIAL" ? " (parțial)" : ""}
        </li>
        <li>Stare: Acceptat / înghețat</li>
      </ul>
      <div className="action-row">
        <button type="button" onClick={onCreatePlan} disabled={busy}>
          Creează planul de execuție
        </button>
      </div>
    </div>
  );
}

function PersistedExecutionPlanSection({
  view,
  reused,
  busy,
  onAssignProvider,
  onAssignExecutor,
  onStartTask,
  onCompleteTask,
}: {
  view: ExecutionPlanView;
  reused: boolean;
  busy: boolean;
  onAssignProvider: (taskId: string, providerId: string) => void;
  onAssignExecutor: (taskId: string, personId: string) => void;
  onStartTask: (taskId: string) => void;
  onCompleteTask: (taskId: string, input?: { completedQuantity?: number; note?: string }) => void;
}) {
  return (
    <div className="execution-plan">
      <h3>{reused ? "Plan de execuție deja creat" : "Plan de execuție"}</h3>
      <ul className="execution-progress">
        <li>Stare: {view.statusLabel}</li>
        <li>
          {view.progress.completed} / {view.progress.total} finalizate
        </li>
        <li>În lucru: {view.progress.inProgress}</li>
        <li>În așteptare: {view.progress.waitingDependencies}</li>
        <li>Fără furnizor: {view.progress.noProvider}</li>
        <li>Fără executant: {view.progress.noExecutor}</li>
        {view.progress.varianceCount > 0 ? (
          <li>Abateri: {view.progress.varianceCount}</li>
        ) : null}
      </ul>
      <ul className="execution-plan-meta">
        <li>Produs: {view.plan.productLabel}</li>
        <li>
          Cost intern din snapshot: {formatMoney(view.plan.eicTotal)}{" "}
          {view.plan.eicCurrency}
          {view.plan.eicCompleteness === "PARTIAL" ? " (parțial)" : ""}
        </li>
        <li>Referință: {view.plan.planId}</li>
      </ul>
      <ol className="production-ops">
        {view.tasks.map((task) => (
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

  return (
    <li className="production-op">
      <h4>
        {task.seqLabel}. {task.processLabel}
      </h4>
      <p>Componentă: {task.scopeLabel}</p>
      <p className="task-status">Stare: {task.statusLabel}</p>
      {task.assignedProvider ? <p>Alocat: {task.assignedProvider.label}</p> : <p>Alocare: Nealocat</p>}
      {task.assignedExecutor ? (
        <p>Executant: {task.assignedExecutor.label}</p>
      ) : (
        <p>Executant: Nealocat</p>
      )}
      {task.waitingFor.length > 0 ? <p>Așteaptă: {task.waitingFor.join("; ")}</p> : null}
      {task.eligibleProviders.length === 0 ? <p>Fără furnizor disponibil</p> : null}
      {task.measurableQuantity ? (
        <p>
          Cantitate planificată: {formatQuantity(task.measurableQuantity.value)}{" "}
          {formatUnit(task.measurableQuantity.unit)}
        </p>
      ) : (
        task.quantities.slice(0, 1).map((quantity) => (
          <p key={`${task.taskId}-${quantity.label}`}>
            Cantitate: {formatQuantity(quantity.value)} {formatUnit(quantity.unit)}
          </p>
        ))
      )}
      {task.completedQuantityLabel ? <p>{task.completedQuantityLabel}</p> : null}
      {task.varianceLabel ? <p>{task.varianceLabel}</p> : null}
      {task.completion?.note ? <p>Notă: {task.completion.note}</p> : null}
      {task.startedAt ? (
        <p>Pornit la: {new Date(task.startedAt).toLocaleString("ro-RO")}</p>
      ) : null}
      {task.completedAt ? (
        <p>Finalizat la: {new Date(task.completedAt).toLocaleString("ro-RO")}</p>
      ) : null}
      <div className="task-actions">
        {task.canAssign ? (
          <>
            <label>
              Alocare
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
            </label>
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
            <label>
              Executant
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
            </label>
            <button
              type="button"
              disabled={busy || executorId.length === 0}
              onClick={() => onAssignExecutor(task.taskId, executorId)}
            >
              Alocă executant
            </button>
          </>
        ) : null}
        {task.status === "PLANNED" &&
        task.eligibleExecutors.length === 0 &&
        !task.assignedExecutor ? (
          <p>
            Nu există persoane active configurate.{" "}
            <Link to="/admin/people">Deschide administrarea persoanelor</Link>
          </p>
        ) : null}
        {task.canStart ? (
          <button type="button" disabled={busy} onClick={() => onStartTask(task.taskId)}>
            Pornește
          </button>
        ) : null}
        {task.canComplete ? (
          <>
            {task.requiresCompletedQuantity ? (
              <label>
                Cantitate realizată
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={completedQuantity}
                  onChange={(event) => setCompletedQuantity(event.target.value)}
                  disabled={busy}
                />
              </label>
            ) : null}
            <label>
              Notă
              <input
                type="text"
                maxLength={COMPLETION_NOTE_MAX_LENGTH}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={busy}
              />
            </label>
            <button type="button" disabled={busy} onClick={submitComplete}>
              Finalizează
            </button>
          </>
        ) : null}
      </div>
    </li>
  );
}

function taskActionNotice(error: string): string {
  switch (error) {
    case "ineligible_provider":
      return "Furnizorul ales nu este eligibil pentru această operație.";
    case "reassignment_locked":
      return "Alocarea nu mai poate fi schimbată după pornire.";
    case "missing_assignment":
      return "Taskul nu are furnizor alocat.";
    case "missing_executor":
      return "Taskul nu are executant alocat.";
    case "provider_unavailable":
      return "Furnizorul alocat nu mai este disponibil.";
    case "executor_unavailable":
      return "Executantul alocat nu mai este activ.";
    case "unknown_person":
      return "Persoana aleasă nu există.";
    case "retired_person":
      return "Persoana aleasă nu mai este activă.";
    case "dependencies_incomplete":
      return "Taskul așteaptă alte operații.";
    case "invalid_transition":
      return "Tranziția nu este permisă.";
    case "invalid_quantity":
      return "Cantitatea realizată nu este validă.";
    case "invalid_note":
      return "Nota de finalizare este prea lungă.";
    default:
      return "Acțiunea nu a putut fi aplicată.";
  }
}
