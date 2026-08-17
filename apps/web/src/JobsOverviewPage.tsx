import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  JOB_FILTERS,
  filterJobOverview,
  jobFilterLabel,
  type JobFilter,
  type JobOverviewItem,
  type JobOverviewProjection,
  type JobStage,
} from "@workos-final/domain";
import { fetchJobOverview } from "./jobsApi";
import { EmptyState } from "./ui/EmptyState";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip, type StatusTone } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; overview: JobOverviewProjection };

export function JobsOverviewPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [filter, setFilter] = useState<JobFilter>("ALL");

  useEffect(() => {
    let cancelled = false;
    void fetchJobOverview()
      .then((overview) => {
        if (!cancelled) {
          setPage({ kind: "ready", overview });
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
  }, []);

  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterJobOverview(page.overview, filter)].sort(compareJobRows);
  }, [filter, page]);

  if (page.kind === "loading") {
    return <p>Se încarcă lucrările…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca lucrările.</p>;
  }

  const { overview } = page;
  const empty = overview.jobs.length === 0;

  return (
    <section className="jobs-overview">
      <PageHeader
        title="Lucrări"
        lead="Lucrările comerciale curente, starea lor și ce trebuie făcut acum."
        meta={
          empty ? null : (
            <p className="page-summary">
              Lucrări active {overview.summary.active}
              {" · "}
              În execuție {overview.summary.inExecution}
              {" · "}
              Necesită atenție {overview.summary.needsAttention}
              {" · "}
              Finalizate {overview.summary.completed}
            </p>
          )
        }
      />

      {empty ? (
        <EmptyState
          title="Nu există încă lucrări comerciale."
          action={
            <p>
              <Link to="/products">Deschide produsele</Link> pentru a crea o comandă.
            </p>
          }
        />
      ) : (
        <>
          <div className="filter-row" role="group" aria-label="Filtre lucrări">
            {JOB_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={item === filter}
                onClick={() => setFilter(item)}
              >
                {jobFilterLabel(item)}
              </button>
            ))}
          </div>
          {visible.length === 0 ? (
            <EmptyState title="Nicio lucrare în acest filtru." />
          ) : (
            <ul className="jobs-list">
              {visible.map((job) => (
                <li key={job.jobId}>
                  <div className="jobs-identity">
                    <Link to={job.href}>{job.inscription}</Link>
                    <span>{job.productLabel}</span>
                    {job.customerDisplayName ? (
                      <span className="jobs-customer">Client: {job.customerDisplayName}</span>
                    ) : null}
                  </div>
                  <div className="jobs-status">
                    <StatusChip label={job.stageLabel} tone={stageTone(job.stage)} />
                    {job.progressLabel ? <p>{job.progressLabel}</p> : null}
                    {job.attentionLabel ? (
                      <p className="jobs-attention">{job.attentionLabel}</p>
                    ) : null}
                  </div>
                  <p className="jobs-date">{formatJobDate(job.createdAt)}</p>
                  <Link className="button-link" to={job.href}>
                    {job.nextActionLabel}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function compareJobRows(left: JobOverviewItem, right: JobOverviewItem): number {
  if (left.needsAttention !== right.needsAttention) {
    return left.needsAttention ? -1 : 1;
  }
  return right.createdAt.localeCompare(left.createdAt);
}

function stageTone(stage: JobStage): StatusTone {
  switch (stage) {
    case "ORDER_CREATED":
    case "RELEASED":
      return "warn";
    case "EXECUTION_PLANNED":
    case "EXECUTION_IN_PROGRESS":
      return "progress";
    case "EXECUTION_COMPLETED":
      return "done";
    default: {
      const _exhaustive: never = stage;
      return _exhaustive;
    }
  }
}

function formatJobDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
