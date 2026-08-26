import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { formatCustomerMoneyAmount, type QuoteOverviewStage } from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { acceptQuoteSnapshot, createOrderSnapshot } from "./productApi";
import { fetchQuoteInspection, type QuoteInspectionResponse } from "./quotesApi";
import { EmptyState } from "./ui/EmptyState";
import { Notice } from "./ui/Notice";
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

function Field({ label, children }: { label: string; children: ReactNode }) {
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
  const { quoteSnapshotId = "" } = useParams();
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
    return (
      <article className="decision-workspace">
        <p>Se încarcă oferta…</p>
      </article>
    );
  }
  if (page.kind === "not_found") {
    return (
      <article className="decision-workspace">
        <EmptyState title="Oferta nu a fost găsită." />
      </article>
    );
  }
  if (page.kind === "forbidden") {
    return (
      <article className="decision-workspace">
        <Notice tone="warn">Nu ai acces la această ofertă.</Notice>
      </article>
    );
  }
  if (page.kind === "error") {
    return (
      <article className="decision-workspace">
        <Notice tone="warn">Oferta nu a putut fi încărcată.</Notice>
      </article>
    );
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
    navigate(`/jobs/${encodeURIComponent(result.orderSnapshot.orderSnapshotId)}`);
  }

  const primary =
    quote.stage === "QUOTE_CREATED"
      ? { label: "Marchează acceptată", onClick: accept }
      : quote.stage === "QUOTE_ACCEPTED"
        ? { label: "Creează comanda", onClick: createOrder }
        : null;

  return (
    <article className="decision-workspace">
      <header className="decision-header">
        <div className="decision-title-row">
          <h1>{quote.inscription}</h1>
          <StatusChip label={quote.stageLabel} tone={accepted ? "ok" : "progress"} />
        </div>
        <p className="decision-identity">
          {quote.reference} · Ofertă înghețată. Verifică datele înainte de decizie.
        </p>
      </header>
      <div className="decision-grid">
        <section className="decision-card" aria-labelledby="quote-source">
          <h2 id="quote-source">Client și sursă</h2>
          <dl className="decision-fields">
            <Field label="Client">
              {quote.customerId && quote.customerDisplayName ? (
                <ClientLink customerId={quote.customerId} displayName={quote.customerDisplayName} />
              ) : (
                "—"
              )}
            </Field>
            <Field label="Cerere sursă">
              {page.detail.request ? (
                <Link to={page.detail.request.href}>
                  {page.detail.request.reference ?? "Deschide cererea"}
                </Link>
              ) : (
                "—"
              )}
            </Field>
            <Field label="Produs">{quote.productLabel}</Field>
            <Field label="Configurație">{configuration ?? "—"}</Field>
          </dl>
        </section>
        <section className="decision-card decision-card-finance" aria-labelledby="quote-price">
          <h2 id="quote-price">Valori comerciale</h2>
          <dl className="decision-fields">
            {money(commercial.netPrice) ? <Field label="Net">{money(commercial.netPrice)}</Field> : null}
            {typeof commercial.vatPercent === "number" ? (
              <Field label="TVA">
                <span>TVA {commercial.vatPercent}%</span>
              </Field>
            ) : null}
            {money(commercial.grossPrice) ? (
              <Field label="Preț client">
                <span className="commercial-gross">Brut: {money(commercial.grossPrice)}</span>
              </Field>
            ) : (
              <Field label="Preț client">
                Brut: {quote.grossDisplay} {quote.currency}
              </Field>
            )}
            {typeof commercial.internalCost === "number" ? (
              <Field label="Cost intern">{money(commercial.internalCost)}</Field>
            ) : null}
            {typeof commercial.markupPercent === "number" ? (
              <Field label="Adaos">{commercial.markupPercent}%</Field>
            ) : null}
            {typeof commercial.marginAmount === "number" ? (
              <Field label="Marjă">{money(commercial.marginAmount)}</Field>
            ) : null}
            <Field label="Stare">
              {quote.stageLabel}
              {accepted ? " · valabilă ca snapshot înghețat" : ""}
            </Field>
            <Field label="Consecința deciziei">{quoteConsequence(quote.stage)}</Field>
          </dl>
        </section>
      </div>
      {actionError ? <Notice tone="warn">{actionError}</Notice> : null}
      <p className="decision-actions">
        {primary ? (
          <button type="button" onClick={() => void primary.onClick()} disabled={busy}>
            {primary.label}
          </button>
        ) : order ? (
          <Link className="button-link" to={order.href}>
            Deschide lucrarea
          </Link>
        ) : null}
      </p>
    </article>
  );
}
