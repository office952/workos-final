import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ExecutionPlanView, ExecutionTaskView } from "@workos-final/domain";
import { usePathIdAfter } from "../../../navigation/usePathIdAfter";
import { OperatorIdentifyForm } from "../../../OperatorIdentifyForm";
import { useOperatorSession } from "../../../OperatorSessionContext";
import {
  assignExecutionTaskExecutor,
  assignExecutionTaskProvider,
  completeExecutionTask,
  readExecutionPlanById,
  startExecutionTask,
} from "../../../productApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; view: ExecutionPlanView };

function TaskStation({
  task,
  active,
  busy,
  onAssignProvider,
  onAssignExecutor,
  onStart,
  onComplete,
}: {
  task: ExecutionTaskView;
  active: boolean;
  busy: boolean;
  onAssignProvider: (taskId: string, providerId: string) => void;
  onAssignExecutor: (taskId: string, personId: string) => void;
  onStart: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}) {
  const [providerId, setProviderId] = useState(task.eligibleProviders[0]?.id ?? "");
  const [executorId, setExecutorId] = useState(task.eligibleExecutors[0]?.id ?? "");

  return (
    <article
      className="ui20-task ui20-station-active"
      id={`task-${task.taskId}`}
      data-task-id={task.taskId}
      data-active={active}
    >
      <p className="ui20-station-kicker">Operație curentă</p>
      <h2>
        {task.seqLabel}. {task.processLabel}
      </h2>
      <p className="ui20-meta">
        {task.scopeLabel} · {task.statusLabel}
      </p>
      <p>{task.assignmentLabel}</p>
      {task.waitingFor.length > 0 ? <p>Așteaptă: {task.waitingFor.join(", ")}</p> : null}
      {task.startBlockReason ? (
        <p className="ui20-blocked-note">Blocat: {task.startBlockReason}</p>
      ) : task.canStart ? (
        <p className="ui20-clear">Poți porni</p>
      ) : null}
      {task.canAssign && task.eligibleProviders.length > 0 ? (
        <p className="ui20-actions">
          <label>
            Utilaj dedicat
            <select value={providerId} onChange={(event) => setProviderId(event.target.value)}>
              {task.eligibleProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => onAssignProvider(task.taskId, providerId)}
            disabled={busy || !providerId}
          >
            Alocă utilaj
          </button>
        </p>
      ) : null}
      {task.canAssignExecutor && task.eligibleExecutors.length > 0 ? (
        <p className="ui20-actions">
          <label>
            Executant
            <select value={executorId} onChange={(event) => setExecutorId(event.target.value)}>
              {task.eligibleExecutors.map((executor) => (
                <option key={executor.id} value={executor.id}>
                  {executor.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => onAssignExecutor(task.taskId, executorId)}
            disabled={busy || !executorId}
          >
            Alocă executant
          </button>
        </p>
      ) : null}
      <p className="ui20-actions">
        {task.canStart ? (
          <button type="button" onClick={() => onStart(task.taskId)} disabled={busy}>
            Pornește
          </button>
        ) : null}
        {task.canComplete ? (
          <button type="button" onClick={() => onComplete(task.taskId)} disabled={busy}>
            Finalizează
          </button>
        ) : null}
      </p>
    </article>
  );
}

export function Workstation() {
  const planId = usePathIdAfter("/execution/");
  const [searchParams] = useSearchParams();
  const focusTaskId = searchParams.get("task");
  const { operator } = useOperatorSession();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!planId) {
      setPage({ kind: "missing" });
      return;
    }
    setPage({ kind: "loading" });
    void readExecutionPlanById(planId)
      .then((view) => {
        if (!cancelled) {
          setPage(view ? { kind: "ready", view } : { kind: "missing" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [planId, operator?.personId]);

  const view = page.kind === "ready" ? page.view : null;
  const jobId = view?.jobHref
    ? decodeURIComponent(view.jobHref.replace(/^\/jobs\//, ""))
    : null;
  useContinuityFacts({
    jobId,
    planId: view?.plan.planId,
  });

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă execuția…</p>;
  }
  if (page.kind === "missing") {
    return <p className="ui20-error">Planul cerut nu este disponibil.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Execuția nu a putut fi încărcată.</p>;
  }

  const { view: plan } = page;
  const active =
    plan.tasks.find((task) => task.taskId === focusTaskId) ??
    plan.tasks.find((task) => task.status === "IN_PROGRESS") ??
    plan.tasks.find((task) => task.canStart);
  async function mutate(
    action: () => Promise<{ ok: true; executionPlan: ExecutionPlanView } | { ok: false }>,
  ) {
    setBusy(true);
    setNotice(null);
    try {
      const result = await action();
      if (!result.ok) {
        setNotice("Acțiunea nu a putut fi aplicată.");
        return;
      }
      setPage({ kind: "ready", view: result.executionPlan });
    } catch {
      setNotice("Acțiunea nu a putut fi aplicată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article
      className="ui20-surface ui20-station"
      data-surface="execution"
      data-instrument="workstation"
    >
      <h1>{plan.plan.inscription}</h1>
      <p className="ui20-kicker">
        {plan.plan.productLabel}. {plan.statusLabel}. {plan.progress.completed} /{" "}
        {plan.progress.total} finalizate.
      </p>
      {plan.jobHref ? <Link to={plan.jobHref}>Înapoi la lucrare</Link> : null}
      {!operator ? (
        <section>
          <h2>Identificare</h2>
          <OperatorIdentifyForm />
        </section>
      ) : null}
      {active ? (
        <TaskStation
          task={active}
          active
          busy={busy}
          onAssignProvider={(taskId, providerId) =>
            void mutate(() => assignExecutionTaskProvider(taskId, providerId))
          }
          onAssignExecutor={(taskId, personId) =>
            void mutate(() => assignExecutionTaskExecutor(taskId, personId))
          }
          onStart={(taskId) => void mutate(() => startExecutionTask(taskId))}
          onComplete={(taskId) => void mutate(() => completeExecutionTask(taskId, {}))}
        />
      ) : null}
      <section className="ui20-plan-quiet" aria-labelledby="all-tasks">
        <h2 id="all-tasks">Plan</h2>
        {plan.tasks.map((task) => (
          <article
            key={task.taskId}
            className="ui20-task"
            data-task-id={task.taskId}
            data-active={task.taskId === active?.taskId}
          >
            <p>
              {task.seqLabel}. {task.processLabel} · {task.scopeLabel} · {task.statusLabel}
            </p>
          </article>
        ))}
      </section>
      {notice ? <p className="ui20-error">{notice}</p> : null}
    </article>
  );
}
