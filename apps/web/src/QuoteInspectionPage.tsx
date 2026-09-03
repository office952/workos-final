import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { formatCustomerMoneyAmount, type QuoteOverviewStage } from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { appPathname } from "./navigation/routePath";
import { usePathIdAfter } from "./navigation/usePathIdAfter";
import { acceptQuoteSnapshot, createOrderSnapshot } from "./productApi";
import { fetchQuoteInspection, type QuoteInspectionResponse } from "./quotesApi";
import { EmptyState } from "./ui/EmptyState";
import { Notice } from "./ui/Notice";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "ready"; detail: QuoteInspectionResponse };

function money(value: unknown): string | null {
  return typeof value === "number" ? formatCustomerMoneyAmount(value) : null;
}

function textValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function quoteConsequence(stage: QuoteOverviewStage): string {
  switch (stage) {
    case "QUOTE_CREATED":
      return "Acceptarea este o decizie pe snapshot-ul înghețat. Nu recalculează prețul.";
    case "QUOTE_ACCEPTED":
      return "Următorul pas creează comanda din această ofertă. Nu recompilează prețul.";
    case "ORDER_CREATED":
      return "Deschide lucrarea existentă. Nu recompilează prețul.";
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function QuoteInspectionPage() {
  const quoteSnapshotId = usePathIdAfter("/quotes/");
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    document.getElementById("continut-principal")?.focus();
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void fetchQuoteInspection(quoteSnapshotId)
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
  }, [quoteSnapshotId]);

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă oferta…</PageStatus>;
  }
  if (page.kind === "not_found") {
    return <EmptyState title="Oferta nu a fost găsită." />;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la această ofertă.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Oferta nu a putut fi încărcată.</PageStatus>;
  }

  const { quote, quoteSnapshot, order } = page.detail;
  const commercial = (quoteSnapshot.commercial ?? {}) as Record<string, unknown>;
  const truth = (quoteSnapshot.truth ?? {}) as Record<string, unknown>;
  const values = (truth.values ?? {}) as Record<string, unknown>;
  const depthMm = textValue(values["volume.depthMm"]);
  const accepted = quote.stage !== "QUOTE_CREATED";
  const configuration = depthMm ? `adâncime ${depthMm} mm` : null;

  async function accept() {
    setBusy(true);
    setActionError(null);
    const result = await acceptQuoteSnapshot(quote.productCode, quote.quoteSnapshotId);
    if (!result.ok) {
      setBusy(false);
      setActionError(result.message ?? "Oferta nu a putut fi acceptată.");
      return;
    }
    const refreshed = await fetchQuoteInspection(quote.quoteSnapshotId);
    setBusy(false);
    if (refreshed.ok) {
      setPage({ kind: "ready", detail: refreshed.detail });
      return;
    }
    setActionError("Oferta a fost acceptată, dar ecranul nu s-a putut reîmprospăta.");
  }

  async function createOrder() {
    setBusy(true);
    setActionError(null);
    const result = await createOrderSnapshot(quote.productCode, quote.quoteSnapshotId);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.message ?? "Comanda nu a putut fi creată.");
      return;
    }
    navigate(appPathname(`/jobs/${encodeURIComponent(result.orderSnapshot.orderSnapshotId)}`));
  }

  const primary =
    quote.stage === "QUOTE_CREATED"
      ? { label: "Marchează acceptată", onClick: accept }
      : quote.stage === "QUOTE_ACCEPTED"
        ? { label: "Creează comanda", onClick: createOrder }
        : null;

  return (
    <section className="request-object">
      <Link className="client-object-back" to="/quotes" aria-label="Înapoi la Oferte">
        <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Înapoi la Oferte
      </Link>

      <header className="client-object-header">
        <div className="client-object-titles">
          <h1>{quote.inscription}</h1>
          <p className="client-object-identity">
            {quote.reference} · Ofertă înghețată. Verifică datele înainte de decizie.
          </p>
          <StatusChip label={quote.stageLabel} tone={accepted ? "ok" : "progress"} />
        </div>
        <div className="client-object-actions">
          {primary ? (
            <button type="button" onClick={() => void primary.onClick()} disabled={busy}>
              {primary.label}
            </button>
          ) : order ? (
            <Link className="button-link" to={order.href}>
              Deschide lucrarea
            </Link>
          ) : null}
        </div>
      </header>

      {actionError ? <Notice tone="warn">{actionError}</Notice> : null}

      <section className="request-section" aria-labelledby="quote-source">
        <h2 id="quote-source">Client și sursă</h2>
        <dl className="request-facts">
          <Fact label="Client">
            {quote.customerId && quote.customerDisplayName ? (
              <ClientLink customerId={quote.customerId} displayName={quote.customerDisplayName} />
            ) : (
              "—"
            )}
          </Fact>
          <Fact label="Cerere sursă">
            {page.detail.request ? (
              <Link to={page.detail.request.href}>
                {page.detail.request.reference ?? "Deschide cererea"}
              </Link>
            ) : (
              "—"
            )}
          </Fact>
          <Fact label="Produs">{quote.productLabel}</Fact>
          <Fact label="Configurație">{configuration ?? "—"}</Fact>
        </dl>
      </section>

      <section className="request-section" aria-labelledby="quote-price">
        <h2 id="quote-price">Valori comerciale</h2>
        <dl className="request-facts">
          {money(commercial.netPrice) ? <Fact label="Net">{money(commercial.netPrice)}</Fact> : null}
          {typeof commercial.vatPercent === "number" ? (
            <Fact label="TVA">
              <span>TVA {commercial.vatPercent}%</span>
            </Fact>
          ) : null}
          {money(commercial.grossPrice) ? (
            <Fact label="Preț client">
              <span className="commercial-gross">Brut: {money(commercial.grossPrice)}</span>
            </Fact>
          ) : (
            <Fact label="Preț client">
              Brut: {quote.grossDisplay} {quote.currency}
            </Fact>
          )}
          {typeof commercial.internalCost === "number" ? (
            <Fact label="Cost intern">{money(commercial.internalCost)}</Fact>
          ) : null}
          {typeof commercial.markupPercent === "number" ? (
            <Fact label="Adaos">{commercial.markupPercent}%</Fact>
          ) : null}
          {typeof commercial.marginAmount === "number" ? (
            <Fact label="Marjă">{money(commercial.marginAmount)}</Fact>
          ) : null}
          <Fact label="Stare">
            {quote.stageLabel}
            {accepted ? " · valabilă ca snapshot înghețat" : ""}
          </Fact>
          <Fact label="Consecința deciziei">{quoteConsequence(quote.stage)}</Fact>
        </dl>
      </section>
    </section>
  );
}
