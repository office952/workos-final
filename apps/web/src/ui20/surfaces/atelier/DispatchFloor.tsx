import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { OperatorTaskInboxProjection } from "@workos-final/domain";
import { fetchOperatorTaskInbox } from "../../../atelierApi";
import { OperatorIdentifyForm } from "../../../OperatorIdentifyForm";
import { useOperatorSession } from "../../../OperatorSessionContext";
import { startExecutionTask } from "../../../productApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { projectAtelierWorklist } from "./atelierWorklist";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "no_session" }
  | { kind: "ready"; inbox: OperatorTaskInboxProjection };

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
      <article className="ui20-surface" data-surface="atelier" data-instrument="dispatch">
        <h1>Atelier</h1>
        <p className="ui20-kicker">Identifică operatorul ca să vezi lucrările disponibile.</p>
        {expired ? <p>Sesiunea operatorului a expirat.</p> : null}
        <OperatorIdentifyForm onIdentified={() => setReloadToken((value) => value + 1)} />
      </article>
    );
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Atelierul nu a putut fi încărcat.</p>;
  }

  const rows = projectAtelierWorklist(page.inbox);

  return (
    <article className="ui20-surface" data-surface="atelier" data-instrument="dispatch">
      <h1>Atelier</h1>
      <p className="ui20-kicker">{page.inbox.operator.displayName}</p>
      {notice ? <p className="ui20-error">{notice}</p> : null}
      {rows.length === 0 ? (
        <p>Niciun task disponibil.</p>
      ) : (
        <table className="ui20-worklist">
          <caption className="visually-hidden">Taskuri atelier</caption>
          <thead>
            <tr>
              <th scope="col">Lucrare</th>
              <th scope="col">Operație</th>
              <th scope="col">Utilaj</th>
              <th scope="col">Stare</th>
              <th scope="col">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.item.taskId}
                className="ui20-task ui20-work-row"
                data-task-id={row.item.taskId}
                data-energy={row.energy}
              >
                <td>{row.item.inscription}</td>
                <td>
                  {row.item.seqLabel}. {row.item.processLabel}
                  {row.item.scopeLabel ? ` · ${row.item.scopeLabel}` : ""}
                </td>
                <td>{row.item.providerLabel ?? "—"}</td>
                <td>{row.item.statusLabel}</td>
                <td>
                  <p className="ui20-actions">
                    {row.actionLabel ? (
                      <button
                        type="button"
                        onClick={() => void claimStart(row.item.taskId)}
                        disabled={busyTaskId === row.item.taskId}
                      >
                        {row.actionLabel}
                      </button>
                    ) : null}
                    <Link to={row.item.workspaceHref}>Deschide execuția</Link>
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}
