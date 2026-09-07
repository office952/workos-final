import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  JOB_FILTERS,
  filterJobOverview,
  jobFilterLabel,
  type JobFilter,
  type JobOverviewItem,
  type JobOverviewProjection,
} from "@workos-final/domain";
import { fetchJobOverview } from "../../../jobsApi";
import { pageErrorKind } from "../../../fetchAccess";
import { useRegistrySearchQuery } from "../../../useRegistrySearchQuery";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { Ui20FilterChip, Ui20RegistryToolbar } from "../shared/Ui20RegistryControls";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: JobOverviewProjection };

export function JobsRegistry() {
  useContinuityFacts({});
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
    return <p className="ui20-status">Se încarcă lucrările…</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-status">Nu ai acces la lista de lucrări.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Nu s-au putut încărca lucrările.</p>;
  }

  const { overview } = page;
  const searching = query.trim().length > 0;

  return (
    <article className="ui20-surface" data-surface="lucrari" data-floorplan="registry">
      <header className="ui20-registry-head">
        <h1>Lucrări</h1>
        <p className="ui20-kicker">
          Registru operațional — stare, atenție, progres și următoarea acțiune.
        </p>
        <p className="ui20-registry-pulse" aria-label="Rezumat lucrări">
          <span>{overview.summary.total} lucrări</span>
          <span>{overview.summary.inExecution} în execuție</span>
          <span data-energy={overview.summary.needsAttention > 0 ? "blocked" : undefined}>
            {overview.summary.needsAttention} necesită atenție
          </span>
          <span>{overview.summary.completed} finalizate</span>
        </p>
      </header>

      {overview.jobs.length === 0 ? (
        <p>Nu există încă lucrări comerciale.</p>
      ) : (
        <>
          <Ui20RegistryToolbar
            filterLabel="Filtre lucrări"
            filters={JOB_FILTERS.map((item) => (
              <Ui20FilterChip
                key={item}
                pressed={item === filter}
                onClick={() => setFilter(item)}
              >
                {jobFilterLabel(item)}
              </Ui20FilterChip>
            ))}
            searchLabel="Caută lucrare"
            searchPlaceholder="Caută lucrare, client sau text."
            query={query}
            onQueryChange={setQuery}
            countLabel={jobResultCountLabel(visible.length)}
          />
          {visible.length === 0 ? (
            <p>
              {searching
                ? "Nicio lucrare nu corespunde căutării."
                : "Nicio lucrare în acest filtru."}
            </p>
          ) : (
            <table className="ui20-worklist">
              <caption className="visually-hidden">Registru lucrări</caption>
              <thead>
                <tr>
                  <th scope="col">Lucrare</th>
                  <th scope="col">Client</th>
                  <th scope="col">Stare</th>
                  <th scope="col">Progres</th>
                  <th scope="col">Dată</th>
                  <th scope="col">Urmează</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((job) => (
                  <tr
                    key={job.jobId}
                    className="ui20-work-row"
                    data-job-id={job.jobId}
                    data-energy={job.needsAttention ? "blocked" : "quiet"}
                  >
                    <td>
                      <Link to={job.href}>{job.inscription}</Link>
                      <span className="ui20-k">{job.productLabel}</span>
                      {job.attentionLabel ? (
                        <span className="ui20-attention">{job.attentionLabel}</span>
                      ) : null}
                    </td>
                    <td>
                      {job.customerId ? (
                        <Link to={`/clients/${encodeURIComponent(job.customerId)}`}>
                          {job.customerDisplayName}
                        </Link>
                      ) : (
                        job.customerDisplayName
                      )}
                    </td>
                    <td>{job.stageLabel}</td>
                    <td>{job.progressLabel ?? "—"}</td>
                    <td>{formatJobDate(job.createdAt)}</td>
                    <td>
                      <Link className="ui20-link-button" to={job.href}>
                        {job.nextActionLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </article>
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
