import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FileCheck, FileText, Search, TriangleAlert } from "lucide-react";
import {
  QUOTE_OVERVIEW_FILTERS,
  filterQuoteOverview,
  quoteOverviewFilterLabel,
  requestOverviewHref,
  type QuoteOverviewFilter,
  type QuoteOverviewItem,
  type QuoteOverviewProjection,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { RegistrySearchField } from "./RegistrySearchField";
import { pageErrorKind } from "./fetchAccess";
import { fetchQuoteOverview } from "./quotesApi";
import { EmptyState } from "./ui/EmptyState";
import { MetricCard } from "./ui/MetricCard";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
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
    <section className="requests-overview">
      <PageHeader
        title="Oferte"
        lead="Ofertele înghețate, starea lor comercială și ce trebuie făcut acum."
      />

      <div className="metric-band">
        <MetricCard
          label="Oferte"
          value={overview.summary.total}
          icon={<FileText size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Necesită atenție"
          value={overview.summary.needsAttention}
          icon={<TriangleAlert size={40} strokeWidth={1.5} />}
          iconTone="warning"
        />
        <MetricCard
          label="Acceptate"
          value={overview.summary.accepted}
          icon={<FileCheck size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Cu comandă"
          value={overview.summary.ordered}
          icon={<FileCheck size={40} strokeWidth={1.5} />}
        />
      </div>

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
          <div className="registry-toolbar">
            <div className="registry-toolbar-primary">
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
              <p className="registry-result-count">{quoteResultCountLabel(visible.length)}</p>
            </div>
            <RegistrySearchField
              label="Caută ofertă"
              placeholder="Caută ofertă, client sau OF-."
              value={query}
              onChange={setQuery}
              hideLabel
              leadingIcon={<Search size={16} strokeWidth={1.75} />}
            />
          </div>
          {visible.length === 0 ? (
            <EmptyState
              title={searching ? "Nicio ofertă găsită." : "Nicio ofertă în acest filtru."}
            />
          ) : (
            <ul className="requests-list">
              {visible.map((quote) => (
                <li key={quote.quoteSnapshotId}>
                  <div
                    className={
                      quote.needsAttention ? "registry-row is-attention" : "registry-row"
                    }
                  >
                    <div className="registry-row-identity">
                      <Link className="registry-row-name" to={{ pathname: quote.href }}>
                        {quote.reference}
                      </Link>
                      <span className="registry-row-meta">{quoteRowMeta(quote)}</span>
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
                    <div className="requests-row-status">
                      <span>{quote.stageLabel}</span>
                      {quote.attentionLabel ? (
                        <span className="requests-row-attention">{quote.attentionLabel}</span>
                      ) : null}
                    </div>
                    <p className="requests-row-date">{formatQuoteDate(quote.createdAt)}</p>
                    <Link className="requests-row-action" to={{ pathname: quote.href }}>
                      {quote.nextActionLabel}
                    </Link>
                    <span className="registry-row-open" aria-hidden="true">
                      <ChevronRight size={16} strokeWidth={1.75} />
                    </span>
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

function quoteRowMeta(quote: QuoteOverviewItem): string {
  return [quote.inscription, quote.productLabel].filter(Boolean).join(" · ");
}

function quoteResultCountLabel(count: number): string {
  return count === 1 ? "1 ofertă" : `${count} oferte`;
}

function compareQuoteRows(left: QuoteOverviewItem, right: QuoteOverviewItem): number {
  if (left.needsAttention !== right.needsAttention) {
    return left.needsAttention ? -1 : 1;
  }
  return right.createdAt.localeCompare(left.createdAt);
}

function formatQuoteDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
