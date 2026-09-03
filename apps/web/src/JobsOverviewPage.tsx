import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CheckCircle2, ChevronRight, PlayCircle, Search, TriangleAlert } from "lucide-react";
import {
  JOB_FILTERS,
  filterJobOverview,
  jobFilterLabel,
  type JobFilter,
  type JobOverviewItem,
  type JobOverviewProjection,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { fetchJobOverview } from "./jobsApi";
import { RegistrySearchField } from "./RegistrySearchField";
import { pageErrorKind } from "./fetchAccess";
import { EmptyState } from "./ui/EmptyState";
import { MetricCard } from "./ui/MetricCard";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: JobOverviewProjection };

export function JobsOverviewPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [filter, setFilter] = useState<JobFilter>("ALL");
  const [query, setQuery] = useRegistrySearchQuery();

  useEffect(() => {
    let cancelled = false;
    void fetchJobOverview()
      .then((overview) => {
        if (!cancelled) {
          setPage({ kind: "ready", overview });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPage({ kind: pageErrorKind(error) });
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
    return [...filterJobOverview(page.overview, filter, query)].sort(compareJobRows);
  }, [filter, page, query]);

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă lucrările…</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la lista de lucrări.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Nu s-au putut încărca lucrările.</PageStatus>;
  }

  const { overview } = page;
  const empty = overview.jobs.length === 0;
  const searching = query.trim().length > 0;

  return (
    <section className="requests-overview">
      <PageHeader
        title="Lucrări"
        lead="Lucrările comerciale curente, starea lor și ce trebuie făcut acum."
      />

      <div className="metric-band">
        <MetricCard
          label="Lucrări"
          value={overview.summary.total}
          icon={<Briefcase size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="În execuție"
          value={overview.summary.inExecution}
          icon={<PlayCircle size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Necesită atenție"
          value={overview.summary.needsAttention}
          icon={<TriangleAlert size={40} strokeWidth={1.5} />}
          iconTone="warning"
        />
        <MetricCard
          label="Finalizate"
          value={overview.summary.completed}
          icon={<CheckCircle2 size={40} strokeWidth={1.5} />}
        />
      </div>

      {empty ? (
        <EmptyState
          title="Nu există încă lucrări comerciale."
          action={
            <p>
              <Link to="/products">Deschide catalogul</Link> pentru a crea o comandă.
            </p>
          }
        />
      ) : (
        <>
          <div className="registry-toolbar">
            <div className="registry-toolbar-primary">
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
              <p className="registry-result-count">{jobResultCountLabel(visible.length)}</p>
            </div>
            <RegistrySearchField
              label="Caută lucrare"
              placeholder="Caută lucrare, client sau text."
              value={query}
              onChange={setQuery}
              hideLabel
              leadingIcon={<Search size={16} strokeWidth={1.75} />}
            />
          </div>
          {visible.length === 0 ? (
            <EmptyState
              title={
                searching
                  ? "Nicio lucrare nu corespunde căutării."
                  : "Nicio lucrare în acest filtru."
              }
            />
          ) : (
            <ul className="requests-list">
              {visible.map((job) => (
                <li key={job.jobId}>
                  <div
                    className={job.needsAttention ? "registry-row is-attention" : "registry-row"}
                  >
                    <div className="registry-row-identity">
                      <Link className="registry-row-name" to={job.href}>
                        {job.inscription}
                      </Link>
                      <span className="registry-row-meta">{job.productLabel}</span>
                      <ClientLink
                        customerId={job.customerId}
                        displayName={job.customerDisplayName}
                      />
                    </div>
                    <div className="requests-row-status">
                      <span>{job.stageLabel}</span>
                      {job.progressLabel ? <span>{job.progressLabel}</span> : null}
                      {job.attentionLabel ? (
                        <span className="requests-row-attention">{job.attentionLabel}</span>
                      ) : null}
                    </div>
                    <p className="requests-row-date">{formatJobDate(job.createdAt)}</p>
                    <Link className="requests-row-action" to={job.href}>
                      {job.nextActionLabel}
                    </Link>
                    <Link className="registry-row-open" to={job.href} aria-label={`Deschide ${job.inscription}`}>
                      <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function jobResultCountLabel(count: number): string {
  return count === 1 ? "1 lucrare" : `${count} lucrări`;
}

function compareJobRows(left: JobOverviewItem, right: JobOverviewItem): number {
  if (left.needsAttention !== right.needsAttention) {
    return left.needsAttention ? -1 : 1;
  }
  return right.createdAt.localeCompare(left.createdAt);
}

function formatJobDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
