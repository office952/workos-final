import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  QUOTE_OVERVIEW_FILTERS,
  filterQuoteOverview,
  quoteOverviewFilterLabel,
  type QuoteOverviewFilter,
  type QuoteOverviewItem,
  type QuoteOverviewProjection,
} from "@workos-final/domain";
import { pageErrorKind } from "../../../fetchAccess";
import { fetchQuoteOverview } from "../../../quotesApi";
import { useRegistrySearchQuery } from "../../../useRegistrySearchQuery";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { Ui20FilterChip, Ui20RegistryToolbar } from "../shared/Ui20RegistryControls";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: QuoteOverviewProjection };

export function QuotesRegistry() {
  useContinuityFacts({});
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
    return <p className="ui20-status">Se încarcă ofertele…</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-status">Nu ai acces la lista de oferte.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Nu s-au putut încărca ofertele.</p>;
  }

  const { overview } = page;
  const searching = query.trim().length > 0;

  return (
    <article className="ui20-surface" data-surface="oferte" data-floorplan="commercial-register">
      <header className="ui20-registry-head">
        <h1>Oferte</h1>
        <p className="ui20-kicker">
          Registru comercial — referință, valoare, linie acceptare/comandă, următoarea stare.
        </p>
        <p className="ui20-registry-pulse" aria-label="Rezumat oferte">
          <span>{overview.summary.total} oferte</span>
          <span data-energy={overview.summary.needsAttention > 0 ? "blocked" : undefined}>
            {overview.summary.needsAttention} necesită atenție
          </span>
          <span>{overview.summary.accepted} acceptate</span>
          <span>{overview.summary.ordered} cu comandă</span>
        </p>
      </header>

      {overview.quotes.length === 0 ? (
        <p>Nu există încă oferte.</p>
      ) : (
        <>
          <Ui20RegistryToolbar
            filterLabel="Filtre oferte"
            filters={QUOTE_OVERVIEW_FILTERS.map((item) => (
              <Ui20FilterChip
                key={item}
                pressed={item === filter}
                onClick={() => setFilter(item)}
              >
                {quoteOverviewFilterLabel(item)}
              </Ui20FilterChip>
            ))}
            searchLabel="Caută ofertă"
            searchPlaceholder="Caută ofertă, client sau OF-."
            query={query}
            onQueryChange={setQuery}
            countLabel={quoteResultCountLabel(visible.length)}
          />
          {visible.length === 0 ? (
            <p>
              {searching
                ? "Nicio ofertă nu corespunde căutării."
                : "Nicio ofertă în acest filtru."}
            </p>
          ) : (
            <table className="ui20-worklist">
              <caption className="visually-hidden">Registru oferte</caption>
              <thead>
                <tr>
                  <th scope="col">Referință</th>
                  <th scope="col">Client</th>
                  <th scope="col">Valoare</th>
                  <th scope="col">Stare</th>
                  <th scope="col">Linie</th>
                  <th scope="col">Urmează</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((quote) => (
                  <tr
                    key={quote.quoteSnapshotId}
                    className="ui20-work-row"
                    data-quote-id={quote.quoteSnapshotId}
                    data-energy={quote.needsAttention ? "blocked" : "quiet"}
                  >
                    <td>
                      <Link to={quote.href}>{quote.reference}</Link>
                      <span className="ui20-k">{quote.inscription}</span>
                      {quote.attentionLabel ? (
                        <span className="ui20-attention">{quote.attentionLabel}</span>
                      ) : null}
                    </td>
                    <td>
                      {quote.customerId ? (
                        <Link to={`/clients/${encodeURIComponent(quote.customerId)}`}>
                          {quote.customerDisplayName}
                        </Link>
                      ) : (
                        quote.customerDisplayName
                      )}
                    </td>
                    <td>
                      {quote.grossDisplay} {quote.currency}
                    </td>
                    <td>{quote.stageLabel}</td>
                    <td>
                      {quote.requestReference
                        ? `Din cererea ${quote.requestReference}`
                        : lineageLabel(quote)}
                    </td>
                    <td>
                      <Link className="ui20-link-button" to={quote.href}>
                        {quote.nextActionLabel}
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

function quoteResultCountLabel(count: number): string {
  return count === 1 ? "1 ofertă" : `${count} oferte`;
}

function compareQuoteRows(left: QuoteOverviewItem, right: QuoteOverviewItem): number {
  if (left.needsAttention !== right.needsAttention) {
    return left.needsAttention ? -1 : 1;
  }
  return right.createdAt.localeCompare(left.createdAt);
}

function lineageLabel(quote: QuoteOverviewItem): string {
  if (quote.orderSnapshotId) {
    return "Cu comandă";
  }
  if (quote.acceptanceId) {
    return "Acceptată";
  }
  return "—";
}
