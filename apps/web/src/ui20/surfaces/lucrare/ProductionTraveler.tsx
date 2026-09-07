import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { commercialPrimaryActionLabel } from "@workos-final/domain";
import { fetchJobDetail, type JobDetailResponse } from "../../../jobsApi";
import { usePathIdAfter } from "../../../navigation/usePathIdAfter";
import { createExecutionPlan, createProductionRelease } from "../../../productApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { projectJobTraveler } from "./jobTravelerView";

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
  const traveler = projectJobTraveler(detail);

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

  const executionHref =
    execution?.href ?? (item.planId ? `/execution/${encodeURIComponent(item.planId)}` : null);

  return (
    <article className="ui20-surface" data-surface="lucrare" data-instrument="traveler">
      <h1>{item.inscription}</h1>
      <p className="ui20-kicker">{item.customerDisplayName ?? "—"} · Poziția în producție</p>
      <div className="ui20-traveler">
        <section className="ui20-lane" data-lane="past" aria-labelledby="job-past">
          <h2 id="job-past">Trecut</h2>
          <ul>
            {traveler.past.map((entry) => (
              <li key={entry.id}>
                {entry.href ? <Link to={entry.href}>{entry.label}</Link> : entry.label}
              </li>
            ))}
          </ul>
        </section>
        <section className="ui20-lane" data-lane="current" aria-labelledby="job-now">
          <h2 id="job-now">Acum</h2>
          <p>
            <strong>{traveler.current.title}</strong>
          </p>
          <p data-job-state>{traveler.current.stateLabel}</p>
          <p data-job-next>Următorul pas: {traveler.current.nextLabel}</p>
          {traveler.current.attention ? <p>{traveler.current.attention}</p> : null}
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
        <section className="ui20-lane" data-lane="next" aria-labelledby="job-next">
          <h2 id="job-next">Următor</h2>
          {traveler.next.length === 0 ? (
            <p>Nimic după poziția curentă.</p>
          ) : (
            <ul>
              {traveler.next.map((entry) => (
                <li key={entry.id}>{entry.label}</li>
              ))}
            </ul>
          )}
          {request ? (
            <p>
              <Link to={request.href}>{request.reference ?? "Cerere"}</Link>
              {" · "}
              <Link to={quote.href}>{quote.reference ?? "Ofertă"}</Link>
            </p>
          ) : (
            <p>
              <Link to={quote.href}>{quote.reference ?? "Ofertă"}</Link>
            </p>
          )}
        </section>
      </div>
      {notice ? <p className="ui20-error">{notice}</p> : null}
    </article>
  );
}
