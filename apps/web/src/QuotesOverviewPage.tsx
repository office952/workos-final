import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  QUOTE_OVERVIEW_FILTERS,
  filterQuoteOverview,
  quoteOverviewFilterLabel,
  requestOverviewHref,
  type QuoteOverviewFilter,
  type QuoteOverviewItem,
  type QuoteOverviewProjection,
  type QuoteOverviewStage,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import {
  RegistrySearchField,
  registrySearchResultSummary,
} from "./RegistrySearchField";
import { pageErrorKind } from "./fetchAccess";
import { fetchQuoteOverview } from "./quotesApi";
import { EmptyState } from "./ui/EmptyState";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip, type StatusTone } from "./ui/StatusChip";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: QuoteOverviewProjection };

export function QuotesOverviewPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [filter, setFilter] = useState<QuoteOverviewFilter>("ALL");
  const [query, setQuery] = useRegistrySearchQuery();

  useEffect(() => {
    let cancelled = false;
    void fetchQuoteOverview()
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

  const filteredPool = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterQuoteOverview(page.overview, filter, "")];
  }, [filter, page]);

  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterQuoteOverview(page.overview, filter, query)].sort(compareQuoteRows);
  }, [filter, page, query]);

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă ofertele…</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la lista de oferte.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Nu s-au putut încărca ofertele.</PageStatus>;
  }

  const { overview } = page;
  const empty = overview.quotes.length === 0;
  const searching = query.trim().length > 0;

  return (
    <section className="jobs-overview">
      <PageHeader
        title="Oferte"
        lead="Ofertele înghețate, starea lor comercială și ce trebuie făcut acum."
        meta={
          empty ? null : (
            <p className="page-summary">
              Oferte {overview.summary.total}
              {" · "}
              Necesită atenție {overview.summary.needsAttention}
              {" · "}
              Acceptate {overview.summary.accepted}
              {" · "}
              Cu comandă {overview.summary.ordered}
            </p>
          )
        }
      />

      {empty ? (
        <EmptyState
          title="Nu există încă oferte."
          action={
            <p>
              <Link to="/products">Deschide catalogul</Link> pentru a crea o ofertă.
            </p>
          }
        />
      ) : (
        <>
          <div className="filter-row" role="group" aria-label="Filtre oferte">
            {QUOTE_OVERVIEW_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={item === filter}
                onClick={() => setFilter(item)}
              >
                {quoteOverviewFilterLabel(item)}
              </button>
            ))}
          </div>
          <RegistrySearchField
            label="Caută ofertă"
            placeholder="Caută ofertă..."
            value={query}
            onChange={setQuery}
            resultSummary={registrySearchResultSummary({
              visibleCount: visible.length,
              poolCount: filteredPool.length,
              totalCount: overview.summary.total,
              query,
              nounPlural: "oferte",
            })}
          />
          {visible.length === 0 ? (
            <EmptyState
              title={
                searching ? "Nicio ofertă găsită." : "Nicio ofertă în acest filtru."
              }
            />
          ) : (
            <ul className="jobs-list">
              {visible.map((quote) => (
                <li key={quote.quoteSnapshotId}>
                  <div className="jobs-identity">
                    <Link to={quote.href}>{quote.reference}</Link>
                    <span>{quote.inscription}</span>
                    <span>{quote.productLabel}</span>
                    <ClientLink
                      customerId={quote.customerId}
                      displayName={quote.customerDisplayName}
                    />
                    <span className="commercial-gross">
                      {quote.grossDisplay} {quote.currency}
                    </span>
                    {quote.requestId && quote.requestReference ? (
                      <Link
                        className="registry-provenance-link"
                        to={requestOverviewHref(quote.requestId)}
                      >
                        Din cererea {quote.requestReference}
                      </Link>
                    ) : null}
                  </div>
                  <div className="jobs-status">
                    <StatusChip label={quote.stageLabel} tone={stageTone(quote.stage)} />
                    {quote.attentionLabel ? (
                      <p className="jobs-attention">{quote.attentionLabel}</p>
                    ) : null}
                  </div>
                  <p className="jobs-date">{formatQuoteDate(quote.createdAt)}</p>
                  <Link className="button-link" to={quote.href}>
                    {quote.nextActionLabel}
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

function compareQuoteRows(left: QuoteOverviewItem, right: QuoteOverviewItem): number {
  if (left.needsAttention !== right.needsAttention) {
    return left.needsAttention ? -1 : 1;
  }
  return right.createdAt.localeCompare(left.createdAt);
}

function stageTone(stage: QuoteOverviewStage): StatusTone {
  switch (stage) {
    case "QUOTE_CREATED":
      return "warn";
    case "QUOTE_ACCEPTED":
      return "progress";
    case "ORDER_CREATED":
      return "done";
    default: {
      const _exhaustive: never = stage;
      return _exhaustive;
    }
  }
}

function formatQuoteDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
