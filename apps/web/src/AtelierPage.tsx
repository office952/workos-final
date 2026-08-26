import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { OperatorInboxTaskItem, OperatorTaskInboxProjection } from "@workos-final/domain";
import { fetchOperatorTaskInbox } from "./atelierApi";
import { OperatorIdentifyForm } from "./OperatorIdentifyForm";
import { useOperatorSession } from "./OperatorSessionContext";
import { startExecutionTask, type TaskMutationFailure } from "./productApi";
import { EmptyState } from "./ui/EmptyState";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "no_session" }
  | { kind: "ready"; inbox: OperatorTaskInboxProjection };

export function AtelierPage() {
  const { ready, operator, expired } = useOperatorSession();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

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
        setNotice(startNotice(result));
        setReloadToken((value) => value + 1);
        return;
      }
      setReloadToken((value) => value + 1);
    } catch {
      setNotice("Pornirea nu a putut fi aplicată.");
    } finally {
      setBusyTaskId(null);
    }
  }

  if (!ready || page.kind === "loading") {
    return (
      <section className="atelier-page">
        <PageHeader title="Atelier" lead="Munca mea pe atelier, acum." />
        <PageStatus kind="loading">Se încarcă atelierul…</PageStatus>
      </section>
    );
  }

  if (page.kind === "no_session") {
    return (
      <section className="atelier-page">
        <PageHeader
          title="Atelier"
          lead="Identifică operatorul înainte de a porni sau finaliza muncă."
        />
        {expired ? (
          <Notice tone="warn" compact>
            <p>Sesiunea operatorului a expirat. Contul Cloud rămâne deschis.</p>
          </Notice>
        ) : null}
        <EmptyState title="Identifică-te pentru a vedea munca disponibilă." />
        <OperatorIdentifyForm />
      </section>
    );
  }

  if (page.kind === "error") {
    return (
      <section className="atelier-page">
        <PageHeader title="Atelier" lead="Munca mea pe atelier, acum." />
        <PageStatus kind="error">Atelierul nu a putut fi încărcat.</PageStatus>
      </section>
    );
  }

  const { inbox } = page;
  const unavailable = inbox.operator.availability === "TEMPORARILY_UNAVAILABLE";
  const noClaimable =
    inbox.summary.availableReady === 0 && inbox.summary.availableNeedsProvider === 0;
  const emptyAll =
    inbox.summary.inProgressMine === 0 &&
    noClaimable &&
    inbox.summary.waitingDependencies === 0;

  return (
    <section className="atelier-page">
      <PageHeader
        title="Atelier"
        lead="Inbox operațional. Nu este hartă de fabrică și nu calculează prețuri."
        meta={
          <p className="page-summary">
            {unavailable ? "Indisponibil temporar pentru taskuri noi · " : null}
            {`${inbox.summary.availableNeedsProvider} blocate · ${inbox.summary.availableReady} pot porni · ${inbox.summary.inProgressMine} în lucru`}
          </p>
        }
      />

      {notice ? (
        <Notice tone="warn" compact>
          <p>{notice}</p>
        </Notice>
      ) : null}

      {unavailable && inbox.summary.inProgressMine === 0 ? (
        <Notice tone="info" compact>
          <p>Ești identificat, dar momentan indisponibil pentru taskuri noi.</p>
        </Notice>
      ) : null}

      {emptyAll && !unavailable ? (
        <EmptyState title="Nu ai taskuri disponibile acum." />
      ) : null}

      <InboxLane
        title="Blocate"
        tone="warn"
        items={inbox.availableNeedsProvider}
        renderMeta={() => (
          <p className="atelier-block-reason">Necesită utilaj dedicat înainte de pornire.</p>
        )}
        renderActions={(item) => (
          <Link className="button-quiet" to={item.workspaceHref}>
            Deschide lucrarea
          </Link>
        )}
      />

      <InboxLane
        title="Pot porni acum"
        tone="ok"
        empty={
          emptyAll
            ? null
            : unavailable
              ? "Nu poți revendica taskuri noi cât ești indisponibil."
              : inbox.summary.availableReady === 0
                ? "Nu ai taskuri pe care le poți porni acum."
                : null
        }
        items={inbox.availableReady}
        renderActions={(item) => (
          <>
            <button
              type="button"
              disabled={busyTaskId !== null}
              onClick={() => void claimStart(item.taskId)}
            >
              {busyTaskId === item.taskId ? "Se pornește…" : "Pornește"}
            </button>
            <Link className="button-quiet" to={item.workspaceHref}>
              Deschide lucrarea
            </Link>
          </>
        )}
      />

      <InboxLane
        title="În lucru"
        tone="progress"
        items={inbox.inProgressMine}
        renderActions={(item) => (
          <Link className="button-link" to={item.workspaceHref}>
            Continuă
          </Link>
        )}
      />

      {inbox.waitingDependencies.length > 0 ? (
        <InboxLane
          title="Urmează"
          tone="neutral"
          items={inbox.waitingDependencies}
          renderActions={(item) => (
            <Link className="button-quiet" to={item.workspaceHref}>
              Deschide lucrarea
            </Link>
          )}
        />
      ) : null}

      <p className="atelier-order-note">{inbox.displayOrderNote}</p>
    </section>
  );
}

function InboxLane({
  title,
  items,
  empty,
  tone,
  renderMeta,
  renderActions,
}: {
  title: string;
  items: readonly OperatorInboxTaskItem[];
  empty?: string | null;
  tone: "warn" | "ok" | "progress" | "neutral";
  renderMeta?: (item: OperatorInboxTaskItem) => ReactNode;
  renderActions: (item: OperatorInboxTaskItem) => ReactNode;
}) {
  if (items.length === 0) {
    if (!empty) {
      return null;
    }
    return (
      <section className="atelier-lane" aria-label={title}>
        <h2>{title}</h2>
        <p className="atelier-lane-empty">{empty}</p>
      </section>
    );
  }

  return (
    <section className="atelier-lane" aria-label={title}>
      <h2>{title}</h2>
      <ul className="atelier-task-list">
        {items.map((item) => (
          <li key={item.taskId} className="atelier-task-row">
            <div className="atelier-task-main">
              <p className="atelier-task-title">
                <span className="atelier-task-seq">{item.seqLabel}</span> {item.processLabel}
                <span className="atelier-task-scope"> · {item.scopeLabel}</span>
              </p>
              <p className="atelier-task-meta">
                {item.customerDisplayName ? `${item.customerDisplayName} · ` : null}
                {item.inscription}
              </p>
              <p className="atelier-task-meta">
                {item.productLabel}
                {" · "}
                {item.requiredCapabilityLabel}
                {item.providerLabel ? ` · ${item.providerLabel}` : null}
                {item.reservedForLabel
                  ? ` · Rezervat / alocat pentru ${item.reservedForLabel}`
                  : null}
              </p>
              {item.waitingForLabels.length > 0 ? (
                <p className="atelier-task-meta">
                  Așteaptă: {item.waitingForLabels.join(", ")}
                </p>
              ) : null}
              {renderMeta?.(item)}
            </div>
            <div className="atelier-task-actions">
              <StatusChip label={item.statusLabel} tone={tone} />
              {renderActions(item)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function startNotice(result: TaskMutationFailure): string {
  switch (result.error) {
    case "already_started_by_other":
      return result.startedBy
        ? `Taskul a fost pornit deja de ${result.startedBy.displayName}.`
        : "Taskul a fost pornit deja de alt operator.";
    case "unavailable_person":
      return "Ești indisponibil temporar. Nu poți revendica taskuri noi.";
    case "ineligible_executor":
      return "Nu ești eligibil pentru această operație.";
    case "missing_assignment":
      return "Taskul necesită utilaj dedicat înainte de pornire.";
    case "dependencies_incomplete":
      return "Taskul așteaptă alte operații.";
    case "invalid_session":
    case "expired_session":
    case "revoked_session":
      return "Identifică-te din nou pentru a continua.";
    default:
      return "Pornirea nu a putut fi aplicată.";
  }
}
