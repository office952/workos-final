import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { appPathname } from "./navigation/routePath";
import { usePathIdAfter } from "./navigation/usePathIdAfter";
import type { ExecutionPlanView } from "@workos-final/domain";
import { ExecutionPlanPanel } from "./ExecutionPlanPanel";
import { useOperatorSession } from "./OperatorSessionContext";
import {
  assignExecutionTaskExecutor,
  assignExecutionTaskProvider,
  completeExecutionTask,
  readExecutionPlanById,
  startExecutionTask,
  type TaskMutationFailure,
} from "./productApi";
import { PlannedVersusActual } from "./PlannedVersusActual";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; view: ExecutionPlanView };

export function ExecutionWorkspacePage() {
  const planId = usePathIdAfter("/execution/") || undefined;
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
        if (cancelled) {
          return;
        }
        setPage(view ? { kind: "ready", view } : { kind: "missing" });
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

  useEffect(() => {
    if (page.kind !== "ready" || !focusTaskId) {
      return;
    }
    const exists = page.view.tasks.some((task) => task.taskId === focusTaskId);
    if (!exists) {
      setNotice("Taskul selectat din Atelier nu mai este în acest plan.");
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const node = document.getElementById(taskFocusDomId(focusTaskId));
      if (node) {
        node.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [page, focusTaskId]);

  async function applyTaskMutation(
    action: () => Promise<
      { ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure
    >,
  ) {
    setBusy(true);
    setNotice(null);
    try {
      const result = await action();
      if (!result.ok) {
        setNotice(taskActionNotice(result));
        if (planId && result.error === "already_started_by_other") {
          const view = await readExecutionPlanById(planId);
          if (view) {
            setPage({ kind: "ready", view });
          }
        }
        return;
      }
      setPage({ kind: "ready", view: result.executionPlan });
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return (
      <section className="execution-workspace">
        <PageHeader title="Execuție" lead="Planul de execuție." />
        <PageStatus kind="loading">Se încarcă execuția…</PageStatus>
      </section>
    );
  }
  if (page.kind === "missing") {
    return (
      <section className="execution-workspace">
        <PageHeader title="Execuție" lead="Planul de execuție nu este disponibil." />
        <PageStatus kind="missing">Planul cerut nu este disponibil.</PageStatus>
        <p className="execution-workspace-nav">
          <Link to="/atelier">Înapoi la Atelier</Link>
        </p>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section className="execution-workspace">
        <PageHeader title="Execuție" lead="Execuția nu a putut fi încărcată." />
        <PageStatus kind="error">Execuția nu a putut fi încărcată.</PageStatus>
        <p className="execution-workspace-nav">
          <Link to="/atelier">Înapoi la Atelier</Link>
        </p>
      </section>
    );
  }

  const { view } = page;
  const nextTask = view.tasks.find((task) => task.status === "IN_PROGRESS" || task.canStart);

  return (
    <section className="execution-workspace">
      <PageHeader
        title={view.plan.inscription}
        lead={`${view.plan.productLabel}. ${view.sourceKindLabel}.`}
        meta={
          <ul className="metric-row">
            <li>Stare: {view.statusLabel}</li>
            <li>
              {view.progress.completed} / {view.progress.total} finalizate
            </li>
            {nextTask ? <li>Următorul: {nextTask.processLabel}</li> : null}
          </ul>
        }
      />
      <p className="execution-workspace-nav">
        {view.jobHref ? (
          <>
            <Link to={appPathname(view.jobHref)}>Înapoi la lucrare</Link>
            {" · "}
          </>
        ) : null}
        <Link to={`/products/${view.plan.productCode}`}>Înapoi la produs</Link>
        {" · "}
        <Link to="/atelier">Înapoi la Atelier</Link>
      </p>
      {notice ? (
        <Notice tone="warn" compact>
          <p>{notice}</p>
        </Notice>
      ) : null}
      <ExecutionPlanPanel
        view={view}
        reused={false}
        busy={busy}
        focusTaskId={focusTaskId}
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
      <PlannedVersusActual view={view} />
    </section>
  );
}

function taskFocusDomId(taskId: string): string {
  return `execution-task-${encodeURIComponent(taskId)}`;
}

function taskActionNotice(result: TaskMutationFailure): string {
  switch (result.error) {
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
    case "unavailable_person":
      return "Ești indisponibil temporar. Nu poți revendica taskuri noi.";
    case "ineligible_executor":
      return "Nu ești eligibil pentru această operație.";
    case "dependencies_incomplete":
      return "Taskul așteaptă alte operații.";
    case "invalid_transition":
      return "Tranziția nu este permisă.";
    case "invalid_quantity":
      return "Cantitatea realizată nu este validă.";
    case "invalid_unit":
      return "Unitatea nu corespunde resursei planificate.";
    case "invalid_resource":
      return "Resursa aleasă nu face parte din planul taskului.";
    case "invalid_note":
      return "Nota de finalizare este prea lungă.";
    case "already_started_by_other":
      return result.startedBy
        ? `Taskul a fost pornit deja de ${result.startedBy.displayName}.`
        : "Taskul a fost pornit deja de alt operator.";
    case "wrong_executor":
      return result.startedBy
        ? `Doar ${result.startedBy.displayName} poate finaliza acest task.`
        : "Doar executantul care a pornit taskul îl poate finaliza.";
    case "invalid_session":
    case "expired_session":
    case "revoked_session":
      return "Identifică-te din nou pentru a continua.";
    default:
      return "Acțiunea nu a putut fi aplicată.";
  }
}
