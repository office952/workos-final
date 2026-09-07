import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { commercialPrimaryActionLabel } from "@workos-final/domain";
import { fetchJobDetail } from "../../../jobsApi";
import { usePathIdAfter } from "../../../navigation/usePathIdAfter";
import {
  acceptQuoteSnapshot,
  createOrderSnapshot,
  createProductionRelease,
} from "../../../productApi";
import { fetchQuoteInspection, type QuoteInspectionResponse } from "../../../quotesApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "ready"; detail: QuoteInspectionResponse };

export function CommercialSheet() {
  const quoteSnapshotId = usePathIdAfter("/quotes/");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [released, setReleased] = useState(false);

  async function load(id: string) {
    const result = await fetchQuoteInspection(id);
    if (!result.ok) {
      setPage({ kind: result.reason === "unavailable" ? "error" : result.reason });
      setReleased(false);
      return;
    }
    let nextReleased = false;
    if (result.detail.order) {
      const job = await fetchJobDetail(result.detail.order.orderSnapshotId);
      nextReleased = job.ok ? Boolean(job.detail.release) : false;
    }
    setReleased(nextReleased);
    setPage({ kind: "ready", detail: result.detail });
  }

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void load(quoteSnapshotId).catch(() => {
      if (!cancelled) {
        setPage({ kind: "error" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [quoteSnapshotId]);

  const quote = page.kind === "ready" ? page.detail.quote : null;
  useContinuityFacts({
    requestId: page.kind === "ready" ? page.detail.request?.requestId : null,
    requestReference: page.kind === "ready" ? page.detail.request?.reference : null,
    customerName: quote?.customerDisplayName,
    quoteId: quote?.quoteSnapshotId,
    quoteReference: quote?.reference,
    jobId: quote?.orderSnapshotId,
  });

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă oferta…</p>;
  }
  if (page.kind === "not_found") {
    return <p className="ui20-error">Oferta nu a fost găsită.</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-error">Nu ai acces la această ofertă.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Oferta nu a putut fi încărcată.</p>;
  }

  const { detail } = page;
  const { quote: item, order, request } = detail;

  async function accept() {
    setBusy(true);
    setNotice(null);
    const result = await acceptQuoteSnapshot(item.productCode, item.quoteSnapshotId);
    if (!result.ok) {
      setBusy(false);
      setNotice(result.message ?? "Oferta nu a putut fi acceptată.");
      return;
    }
    setBusy(false);
    await load(item.quoteSnapshotId);
  }

  async function createOrder() {
    setBusy(true);
    setNotice(null);
    const result = await createOrderSnapshot(item.productCode, item.quoteSnapshotId);
    setBusy(false);
    if (!result.ok) {
      setNotice(result.message ?? "Comanda nu a putut fi creată.");
      return;
    }
    await load(item.quoteSnapshotId);
  }

  async function release() {
    if (!order) {
      return;
    }
    setBusy(true);
    setNotice(null);
    const result = await createProductionRelease(item.productCode, order.orderSnapshotId);
    setBusy(false);
    if (!result.ok) {
      setNotice(result.message ?? "Eliberarea nu a putut fi aplicată.");
      return;
    }
    await load(item.quoteSnapshotId);
  }

  return (
    <article className="ui20-surface ui20-sheet" data-surface="oferta" data-instrument="sheet">
      <h1>{item.inscription}</h1>
      <p className="ui20-kicker">
        {item.reference} · {item.stageLabel}. Valoare înghețată.
      </p>
      <ol className="ui20-chain" aria-label="Continuitate comercială">
        <li data-done="true" data-current={item.stage === "QUOTE_CREATED" ? "true" : "false"}>
          Ofertă
        </li>
        <li
          data-done={item.stage !== "QUOTE_CREATED" ? "true" : "false"}
          data-current={item.stage === "QUOTE_ACCEPTED" ? "true" : "false"}
        >
          Acceptare
        </li>
        <li
          data-done={order ? "true" : "false"}
          data-current={order && !released ? "true" : "false"}
        >
          Comandă
        </li>
        <li data-done={released ? "true" : "false"} data-current="false">
          Eliberare
        </li>
      </ol>
      <p>
        Client: {item.customerDisplayName ?? "—"}
        {request ? (
          <>
            {" · "}
            <Link to={request.href}>{request.reference ?? "Cerere"}</Link>
          </>
        ) : null}
      </p>
      <p>{item.productLabel}</p>
      <div className="ui20-sheet-line">
        <span>{item.inscription}</span>
        <strong>
          {item.grossDisplay} {item.currency}
        </strong>
      </div>
      <p className="ui20-sheet-value" data-quote-value>
        {item.grossDisplay} {item.currency}
      </p>
      <p data-quote-state>{item.stageLabel}</p>
      <p className="ui20-frozen">Înghețată — valoare comercială neschimbabilă</p>
      {order ? (
        <p>
          <Link to={order.href}>Comandă / lucrare</Link>
        </p>
      ) : null}
      <section aria-labelledby="quote-next">
        <h2 id="quote-next">Următoarea acțiune</h2>
        <p>{item.nextActionLabel}</p>
        <p className="ui20-actions">
          {item.nextAction === "ACCEPT_QUOTE" ? (
            <button
              type="button"
              data-next-action={item.nextAction}
              onClick={() => void accept()}
              disabled={busy}
            >
              {commercialPrimaryActionLabel("ACCEPT_QUOTE")}
            </button>
          ) : null}
          {item.nextAction === "CREATE_ORDER" ? (
            <button
              type="button"
              data-next-action={item.nextAction}
              onClick={() => void createOrder()}
              disabled={busy}
            >
              {commercialPrimaryActionLabel("CREATE_ORDER")}
            </button>
          ) : null}
          {order && !released ? (
            <button
              type="button"
              data-next-action="RELEASE_PRODUCTION"
              onClick={() => void release()}
              disabled={busy}
            >
              {commercialPrimaryActionLabel("RELEASE_PRODUCTION")}
            </button>
          ) : null}
          {order && released ? (
            <Link to={order.href} data-next-action="OPEN_ORDER">
              Deschide lucrarea
            </Link>
          ) : null}
        </p>
      </section>
      {notice ? <p className="ui20-error">{notice}</p> : null}
    </article>
  );
}
