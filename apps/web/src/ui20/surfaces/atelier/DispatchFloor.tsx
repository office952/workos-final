import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { OperatorInboxTaskItem, OperatorTaskInboxProjection } from "@workos-final/domain";
import { fetchOperatorTaskInbox } from "../../../atelierApi";
import { OperatorIdentifyForm } from "../../../OperatorIdentifyForm";
import { useOperatorSession } from "../../../OperatorSessionContext";
import { startExecutionTask } from "../../../productApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "no_session" }
  | { kind: "ready"; inbox: OperatorTaskInboxProjection };

function TaskRow({
  item,
  action,
  busy,
}: {
  item: OperatorInboxTaskItem;
  action?: { label: string; onClick: () => void };
  busy: boolean;
}) {
  return (
    <article className="ui20-task" data-task-id={item.taskId}>
      <h3>
        {item.seqLabel}. {item.processLabel}
      </h3>
      <p className="ui20-meta">
        {item.inscription} · {item.scopeLabel} · {item.statusLabel}
      </p>
      {item.providerLabel ? <p>Utilaj: {item.providerLabel}</p> : null}
      {item.waitingForLabels.length > 0 ? (
        <p>Așteaptă: {item.waitingForLabels.join(", ")}</p>
      ) : null}
      <p className="ui20-actions">
        {action ? (
          <button type="button" onClick={action.onClick} disabled={busy}>
            {action.label}
          </button>
        ) : null}
        <Link to={item.workspaceHref}>Deschide execuția</Link>
      </p>
    </article>
  );
}

export function DispatchFloor() {
  const { ready, operator, expired } = useOperatorSession();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useContinuityFacts({});

  useEffect(() => {
    if (!ready) {
      setPage({ kind: "loading" });
      return;
    }
    if (!operator) {
      setPage({ kind: "no_session" });
      return;
    }
    let cancelled = false;
    setPage({ kind: "loading" });
    void fetchOperatorTaskInbox()
      .then((response) => {
        if (cancelled) {
          return;
        }
        if (!response.inbox || !response.operator) {
          setPage({ kind: "no_session" });
          return;
        }
        setPage({ kind: "ready", inbox: response.inbox });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ready, operator, reloadToken]);

  async function claimStart(taskId: string) {
    setBusyTaskId(taskId);
    setNotice(null);
    try {
      const result = await startExecutionTask(taskId);
      if (!result.ok) {
        setNotice("Pornirea nu a putut fi aplicată.");
      }
      setReloadToken((value) => value + 1);
    } catch {
      setNotice("Pornirea nu a putut fi aplicată.");
    } finally {
      setBusyTaskId(null);
    }
  }

  if (!ready || page.kind === "loading") {
    return <p className="ui20-status">Se încarcă atelierul…</p>;
  }
  if (page.kind === "no_session") {
    return (
      <article className="ui20-surface" data-surface="atelier">
        <h1>Atelier</h1>
        <p className="ui20-kicker">
          Podea de dispecerat. Identifică operatorul. Nu inventăm telemetrie.
        </p>
        {expired ? <p>Sesiunea operatorului a expirat.</p> : null}
        <OperatorIdentifyForm onIdentified={() => setReloadToken((value) => value + 1)} />
      </article>
    );
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Atelierul nu a putut fi încărcat.</p>;
  }

  const { inbox } = page;

  return (
    <article className="ui20-surface" data-surface="atelier">
      <h1>Atelier</h1>
      <p className="ui20-kicker">
        {inbox.operator.displayName}. Ce poate porni acum, din starea reală a taskurilor.
      </p>
      {notice ? <p className="ui20-error">{notice}</p> : null}
      <section className="ui20-cluster" aria-labelledby="atelier-ready">
        <h2 id="atelier-ready">Pot porni ({inbox.summary.availableReady})</h2>
        {inbox.availableReady.length === 0 ? (
          <p>Niciun task gata de pornire.</p>
        ) : (
          inbox.availableReady.map((item) => (
            <TaskRow
              key={item.taskId}
              item={item}
              busy={busyTaskId === item.taskId}
              action={
                item.canClaimStart
                  ? { label: "Pornește", onClick: () => void claimStart(item.taskId) }
                  : undefined
              }
            />
          ))
        )}
      </section>
      <section className="ui20-cluster" aria-labelledby="atelier-mine">
        <h2 id="atelier-mine">În lucru ({inbox.summary.inProgressMine})</h2>
        {inbox.inProgressMine.length === 0 ? (
          <p>Niciun task pornit de tine.</p>
        ) : (
          inbox.inProgressMine.map((item) => (
            <TaskRow key={item.taskId} item={item} busy={false} />
          ))
        )}
      </section>
      <section className="ui20-cluster" aria-labelledby="atelier-blocked">
        <h2 id="atelier-blocked">Blocate ({inbox.summary.availableNeedsProvider})</h2>
        {inbox.availableNeedsProvider.length === 0 ? (
          <p>Niciun task blocat de utilaj.</p>
        ) : (
          inbox.availableNeedsProvider.map((item) => (
            <TaskRow key={item.taskId} item={item} busy={false} />
          ))
        )}
      </section>
    </article>
  );
}
