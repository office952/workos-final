import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { commercialPrimaryActionLabel } from "@workos-final/domain";
import { fetchJobDetail, type JobDetailResponse } from "../../../jobsApi";
import { usePathIdAfter } from "../../../navigation/usePathIdAfter";
import { createExecutionPlan, createProductionRelease } from "../../../productApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "ready"; detail: JobDetailResponse };

export function ProductionTraveler() {
  const jobId = usePathIdAfter("/jobs/");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void fetchJobDetail(jobId)
      .then((result) => {
        if (cancelled) {
          return;
        }
        if (!result.ok) {
          setPage({ kind: result.reason === "unavailable" ? "error" : result.reason });
          return;
        }
        setPage({ kind: "ready", detail: result.detail });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const job = page.kind === "ready" ? page.detail.job : null;
  useContinuityFacts({
    requestId: page.kind === "ready" ? page.detail.request?.requestId : null,
    requestReference: page.kind === "ready" ? page.detail.request?.reference : null,
    customerName: job?.customerDisplayName,
    quoteId: page.kind === "ready" ? page.detail.quote.quoteSnapshotId : null,
    quoteReference: page.kind === "ready" ? page.detail.quote.reference : null,
    jobId: job?.jobId,
    planId: job?.planId,
  });

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă lucrarea…</p>;
  }
  if (page.kind === "not_found") {
    return <p className="ui20-error">Lucrarea nu a fost găsită.</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-error">Nu ai acces la această lucrare.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Lucrarea nu a putut fi încărcată.</p>;
  }

  const { detail } = page;
  const { job: item, quote, request, release, execution } = detail;

  async function refresh() {
    const result = await fetchJobDetail(item.jobId);
    if (result.ok) {
      setPage({ kind: "ready", detail: result.detail });
    }
  }

  async function releaseProduction() {
    setBusy(true);
    setNotice(null);
    const result = await createProductionRelease(item.productCode, item.orderSnapshotId);
    setBusy(false);
    if (!result.ok) {
      setNotice(result.message ?? "Eliberarea nu a putut fi creată.");
      return;
    }
    await refresh();
  }

  async function createPlan() {
    const snapshotId = item.releaseSnapshotId ?? release?.releaseSnapshotId;
    if (!snapshotId) {
      setNotice("Eliberarea trebuie să existe înainte de planul de execuție.");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await createExecutionPlan(item.productCode, snapshotId);
      await refresh();
    } catch {
      setNotice("Planul de execuție nu a putut fi creat.");
    } finally {
      setBusy(false);
    }
  }

  const executionHref = execution?.href ?? (item.planId ? `/execution/${encodeURIComponent(item.planId)}` : null);

  return (
    <article className="ui20-surface" data-surface="lucrare">
      <h1>{item.inscription}</h1>
      <p className="ui20-kicker">
        Traveler de producție. Comanda, eliberarea și planul rămân pași expliciți. După plan,
        continuarea verticală este atelierul.
      </p>
      <section className="ui20-cluster" aria-labelledby="job-now">
        <h2 id="job-now">Unde este lucrarea</h2>
        <dl>
          <div className="ui20-fact">
            <dt>Client</dt>
            <dd>{item.customerDisplayName ?? "—"}</dd>
          </div>
          <div className="ui20-fact">
            <dt>Stare</dt>
            <dd data-job-state>{item.stageLabel}</dd>
          </div>
          <div className="ui20-fact">
            <dt>Comandă</dt>
            <dd>{item.orderSnapshotId}</dd>
          </div>
          <div className="ui20-fact">
            <dt>Eliberare</dt>
            <dd>{item.releaseSnapshotId ?? release?.releaseSnapshotId ?? "Nu există încă"}</dd>
          </div>
          <div className="ui20-fact">
            <dt>Plan de execuție</dt>
            <dd>{item.planId ?? execution?.planId ?? "Nu există încă"}</dd>
          </div>
          {request ? (
            <div className="ui20-fact">
              <dt>Cerere</dt>
              <dd>
                <Link to={request.href}>{request.reference ?? "Deschide cererea"}</Link>
              </dd>
            </div>
          ) : null}
          <div className="ui20-fact">
            <dt>Ofertă</dt>
            <dd>
              <Link to={quote.href}>{quote.reference ?? "Deschide oferta"}</Link>
            </dd>
          </div>
        </dl>
      </section>
      <section className="ui20-cluster" aria-labelledby="job-next">
        <h2 id="job-next">Următoarea acțiune</h2>
        <p data-job-next>Următorul pas: {item.nextActionLabel}</p>
        {item.attentionLabel ? <p>{item.attentionLabel}</p> : null}
        <p className="ui20-actions">
          {item.nextAction === "RELEASE_TO_PRODUCTION" ? (
            <button
              type="button"
              data-next-action={item.nextAction}
              onClick={() => void releaseProduction()}
              disabled={busy}
            >
              {commercialPrimaryActionLabel("RELEASE_PRODUCTION")}
            </button>
          ) : null}
          {item.nextAction === "CREATE_EXECUTION_PLAN" ? (
            <button
              type="button"
              data-next-action={item.nextAction}
              onClick={() => void createPlan()}
              disabled={busy}
            >
              {commercialPrimaryActionLabel("CREATE_EXECUTION_PLAN")}
            </button>
          ) : null}
          {item.planId ? (
            <Link to="/atelier" data-next-action="OPEN_ATELIER">
              Deschide atelierul
            </Link>
          ) : null}
          {executionHref &&
          (item.nextAction === "OPEN_EXECUTION" ||
            item.nextAction === "CONTINUE_EXECUTION" ||
            item.nextAction === "VIEW_COMPLETED") ? (
            <Link to={executionHref}>{commercialPrimaryActionLabel("OPEN_EXECUTION")}</Link>
          ) : null}
        </p>
      </section>
      {notice ? <p className="ui20-error">{notice}</p> : null}
    </article>
  );
}
