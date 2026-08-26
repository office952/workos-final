import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  projectCommercialExperience,
  type AcceptedProductionSnapshot,
  type CommercialPriceProjection,
  type Customer,
  type DraftValues,
  type EicResult,
  type ExecutionPlanPreview,
  type ExecutionPlanView,
  type FormSchema,
  type ProductAggregate,
  type ProductDefinition,
  type ProductTruth,
  type OrderSnapshot,
  type QuoteAcceptanceDecision,
  type QuoteSnapshot,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { createCustomer, fetchCustomers } from "./customerApi";
import { FormRenderer } from "./FormRenderer";
import {
  AcceptedSnapshotSection,
  CommercialProgress,
  ConfiguratorSummary,
  ConfirmedSummary,
  ConstructionFacts,
  EicSection,
  OrderSnapshotSection,
  ProductionPreviewSection,
  QuoteSnapshotSection,
  ReadinessNotice,
  ReviewPanel,
} from "./ProductConfigurationViews";
import {
  acceptProductionSnapshot,
  compileConfiguration,
  confirmReviewedConfiguration,
  createExecutionPlan,
  acceptQuoteSnapshot,
  createOrderSnapshot,
  createProductionRelease,
  createQuoteSnapshot,
  fetchTemplateProjection,
  readExecutionPlan,
  readOrderSnapshot,
  readOrderSnapshotById,
  readProductionRelease,
  readQuoteAcceptance,
  readQuoteSnapshot,
  type TemplateProjection,
} from "./productApi";
import { readRequestDetail } from "./requestsApi";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; projection: TemplateProjection };

type RestoredJob = {
  order: OrderSnapshot;
  release?: AcceptedProductionSnapshot;
  executionPlan?: ExecutionPlanView;
};

type RestoredJobState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; job: RestoredJob };

type RestoredQuote = {
  quote: QuoteSnapshot;
  acceptance?: QuoteAcceptanceDecision;
  order?: OrderSnapshot;
};

type RestoredRequestState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; detail: RequestDetailProjection };

type RestoredQuoteState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; offer: RestoredQuote };

export function ProductConfigurationPage() {
  const { productCode = "" } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const quoteId = searchParams.get("quote");
  const requestId = searchParams.get("request");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [restoredJob, setRestoredJob] = useState<RestoredJobState>({ kind: "idle" });
  const [restoredQuote, setRestoredQuote] = useState<RestoredQuoteState>({ kind: "idle" });
  const [restoredRequest, setRestoredRequest] = useState<RestoredRequestState>({
    kind: "idle",
  });
  const [values, setValues] = useState<DraftValues>({});
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<{
    truth: ProductTruth;
    aggregate: ProductAggregate;
    eic?: EicResult;
    commercialPrice: CommercialPriceProjection;
    executionPlanPreview: ExecutionPlanPreview;
    definition: ProductDefinition;
    quoteSnapshot?: QuoteSnapshot;
    quoteReused?: boolean;
    quoteAcceptance?: QuoteAcceptanceDecision;
    orderSnapshot?: OrderSnapshot;
    snapshot?: AcceptedProductionSnapshot;
    snapshotReused?: boolean;
    executionPlan?: ExecutionPlanView;
    executionPlanReused?: boolean;
  } | null>(null);
  const [confirmNotice, setConfirmNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    setDefinition(null);
    setConfirmed(null);
    setConfirmNotice(null);

    void fetchTemplateProjection(productCode)
      .then((projection) => {
        if (cancelled) {
          return;
        }
        setPage(projection ? { kind: "ready", projection } : { kind: "missing" });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productCode]);

  useEffect(() => {
    let cancelled = false;
    void fetchCustomers()
      .then((listed) => {
        if (!cancelled) {
          setCustomers(listed);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCustomers([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (page.kind !== "ready" || !orderId) {
      setRestoredJob({ kind: "idle" });
      return;
    }
    let cancelled = false;
    setRestoredJob({ kind: "loading" });
    void readOrderSnapshotById(productCode, orderId)
      .then(async (order) => {
        if (cancelled) {
          return;
        }
        if (!order) {
          setRestoredJob({ kind: "missing" });
          return;
        }
        const commercial = await loadCommercialExecution(productCode, order.orderSnapshotId);
        if (cancelled) {
          return;
        }
        setRestoredJob({
          kind: "ready",
          job: {
            order,
            release: commercial.snapshot,
            executionPlan: commercial.executionPlan,
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setRestoredJob({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, page.kind, productCode]);

  useEffect(() => {
    if (page.kind !== "ready" || orderId || !quoteId) {
      setRestoredQuote({ kind: "idle" });
      return;
    }
    let cancelled = false;
    setRestoredQuote({ kind: "loading" });
    void readQuoteSnapshot(productCode, quoteId)
      .then(async (quote) => {
        if (cancelled) {
          return;
        }
        if (!quote) {
          setRestoredQuote({ kind: "missing" });
          return;
        }
        const acceptance = await readQuoteAcceptance(productCode, quote.quoteSnapshotId);
        const order = acceptance
          ? await readOrderSnapshot(productCode, quote.quoteSnapshotId)
          : null;
        if (cancelled) {
          return;
        }
        setRestoredQuote({
          kind: "ready",
          offer: {
            quote,
            acceptance: acceptance ?? undefined,
            order: order ?? undefined,
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setRestoredQuote({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, page.kind, productCode, quoteId]);

  useEffect(() => {
    if (page.kind !== "ready" || orderId || quoteId || !requestId) {
      setRestoredRequest({ kind: "idle" });
      return;
    }
    let cancelled = false;
    setRestoredRequest({ kind: "loading" });
    void readRequestDetail(requestId)
      .then((detail) => {
        if (cancelled) {
          return;
        }
        if (!detail) {
          setRestoredRequest({ kind: "missing" });
          return;
        }
        setSelectedCustomerId(detail.request.customerId);
        setRestoredRequest({ kind: "ready", detail });
      })
      .catch(() => {
        if (!cancelled) {
          setRestoredRequest({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, page.kind, quoteId, requestId]);

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă produsul…</PageStatus>;
  }
  if (page.kind === "missing") {
    return <PageStatus kind="missing">Produsul cerut nu este disponibil.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Nu s-a putut încărca produsul.</PageStatus>;
  }

  const { template, formSchema } = page.projection;
  const reviewing = definition?.readiness === "ready" && !confirmed;
  const editing = !confirmed && !reviewing;

  async function handleCompile() {
    setBusy(true);
    setConfirmed(null);
    setConfirmNotice(null);
    try {
      setDefinition(await compileConfiguration(productCode, values));
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    if (!definition) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await confirmReviewedConfiguration(productCode, definition);
      if (result.ok) {
        setConfirmed({
          truth: result.truth,
          aggregate: result.aggregate,
          eic: result.eic,
          commercialPrice: result.commercialPrice,
          executionPlanPreview: result.executionPlanPreview,
          definition,
        });
        setDefinition(null);
      } else if (result.reason === "review_mismatch") {
        setDefinition(null);
        setConfirmed(null);
        setConfirmNotice("Configurația verificată nu mai corespunde. Verificați din nou.");
      } else {
        setDefinition(result.definition);
        setConfirmed(null);
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleFreezeQuote() {
    if (!confirmed) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createQuoteSnapshot(
        productCode,
        confirmed.definition,
        restoredRequest.kind === "ready"
          ? restoredRequest.detail.request.customerId
          : selectedCustomerId,
        restoredRequest.kind === "ready"
          ? restoredRequest.detail.request.requestId
          : undefined,
      );
      if (result.ok) {
        const quoteAcceptance = await readQuoteAcceptance(
          productCode,
          result.quoteSnapshot.quoteSnapshotId,
        );
        const orderSnapshot = quoteAcceptance
          ? await readOrderSnapshot(productCode, result.quoteSnapshot.quoteSnapshotId)
          : null;
        const commercial = orderSnapshot
          ? await loadCommercialExecution(productCode, orderSnapshot.orderSnapshotId)
          : {};
        if (result.requestLinkError) {
          setConfirmNotice("Oferta a fost creată, dar nu s-a legat de cerere.");
        }
        setConfirmed({
          ...confirmed,
          quoteSnapshot: result.quoteSnapshot,
          quoteReused: !result.created,
          quoteAcceptance: quoteAcceptance ?? undefined,
          orderSnapshot: orderSnapshot ?? undefined,
          snapshot: commercial.snapshot ?? confirmed.snapshot,
          snapshotReused: commercial.snapshot ? true : confirmed.snapshotReused,
          executionPlan: commercial.executionPlan ?? confirmed.executionPlan,
          executionPlanReused: commercial.executionPlan ? true : confirmed.executionPlanReused,
        });
      } else if (result.reason === "review_mismatch") {
        setConfirmed(null);
        setDefinition(null);
        setConfirmNotice("Configurația verificată nu mai corespunde. Verificați din nou.");
      } else if (result.reason === "not_ready") {
        setConfirmed(null);
        setDefinition(result.definition ?? null);
      } else {
        setConfirmNotice(
          result.message ??
            (result.reason === "missing_customer"
              ? "Selectează clientul."
              : "Prețul clientului nu poate fi calculat."),
        );
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleAcceptQuote() {
    if (!confirmed?.quoteSnapshot) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await acceptQuoteSnapshot(
        productCode,
        confirmed.quoteSnapshot.quoteSnapshotId,
      );
      if (result.ok) {
        const orderSnapshot = await readOrderSnapshot(
          productCode,
          result.quoteSnapshot.quoteSnapshotId,
        );
        const commercial = orderSnapshot
          ? await loadCommercialExecution(productCode, orderSnapshot.orderSnapshotId)
          : {};
        setConfirmed({
          ...confirmed,
          quoteSnapshot: result.quoteSnapshot,
          quoteAcceptance: result.acceptance,
          orderSnapshot: orderSnapshot ?? undefined,
          snapshot: commercial.snapshot ?? confirmed.snapshot,
          snapshotReused: commercial.snapshot ? true : confirmed.snapshotReused,
          executionPlan: commercial.executionPlan ?? confirmed.executionPlan,
          executionPlanReused: commercial.executionPlan ? true : confirmed.executionPlanReused,
        });
      } else {
        setConfirmNotice(
          result.message ?? "Oferta nu poate fi acceptată din snapshot-ul curent.",
        );
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateOrder() {
    if (!confirmed?.quoteSnapshot) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createOrderSnapshot(
        productCode,
        confirmed.quoteSnapshot.quoteSnapshotId,
      );
      if (result.ok) {
        const commercial = await loadCommercialExecution(
          productCode,
          result.orderSnapshot.orderSnapshotId,
        );
        setConfirmed({
          ...confirmed,
          quoteSnapshot: result.quoteSnapshot,
          quoteAcceptance: result.acceptance,
          orderSnapshot: result.orderSnapshot,
          snapshot: commercial.snapshot ?? confirmed.snapshot,
          snapshotReused: commercial.snapshot ? true : confirmed.snapshotReused,
          executionPlan: commercial.executionPlan ?? confirmed.executionPlan,
          executionPlanReused: commercial.executionPlan ? true : confirmed.executionPlanReused,
        });
      } else {
        setConfirmNotice(
          result.message ?? "Comanda nu poate fi creată din oferta curentă.",
        );
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleReleaseProduction() {
    if (!confirmed?.orderSnapshot) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createProductionRelease(
        productCode,
        confirmed.orderSnapshot.orderSnapshotId,
      );
      if (result.ok) {
        const executionPlan = await readExecutionPlan(productCode, result.snapshot.snapshotId);
        setConfirmed({
          ...confirmed,
          orderSnapshot: result.orderSnapshot,
          snapshot: result.snapshot,
          snapshotReused: !result.created,
          executionPlan: executionPlan ?? undefined,
          executionPlanReused: Boolean(executionPlan),
        });
      } else {
        setConfirmNotice(
          result.message ?? "Comanda nu poate fi eliberată pentru producție.",
        );
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleAcceptProduction() {
    if (!confirmed) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await acceptProductionSnapshot(productCode, confirmed.definition);
      if (result.ok) {
        setConfirmed({
          ...confirmed,
          snapshot: result.snapshot,
          snapshotReused: !result.created,
        });
      } else if (result.reason === "review_mismatch") {
        setConfirmed(null);
        setDefinition(null);
        setConfirmNotice("Configurația verificată nu mai corespunde. Verificați din nou.");
      } else {
        setConfirmed(null);
        setDefinition(result.definition);
      }
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateExecutionPlan() {
    if (!confirmed?.snapshot) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createExecutionPlan(productCode, confirmed.snapshot.snapshotId);
      setConfirmed({
        ...confirmed,
        executionPlan: result.executionPlan,
        executionPlanReused: !result.created,
      });
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleRestoreRelease() {
    if (restoredJob.kind !== "ready") {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createProductionRelease(productCode, restoredJob.job.order.orderSnapshotId);
      if (result.ok) {
        setRestoredJob({
          kind: "ready",
          job: {
            ...restoredJob.job,
            order: result.orderSnapshot,
            release: result.snapshot,
          },
        });
      } else {
        setConfirmNotice("Eliberarea pentru producție nu a putut fi creată.");
      }
    } catch {
      setConfirmNotice("Eliberarea pentru producție nu a putut fi creată.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRestoreAcceptQuote() {
    if (restoredQuote.kind !== "ready") {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await acceptQuoteSnapshot(
        productCode,
        restoredQuote.offer.quote.quoteSnapshotId,
      );
      if (result.ok) {
        setRestoredQuote({
          kind: "ready",
          offer: {
            ...restoredQuote.offer,
            quote: result.quoteSnapshot,
            acceptance: result.acceptance,
          },
        });
      } else {
        setConfirmNotice("Oferta nu a putut fi acceptată.");
      }
    } catch {
      setConfirmNotice("Oferta nu a putut fi acceptată.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRestoreCreateOrder() {
    if (restoredQuote.kind !== "ready") {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createOrderSnapshot(
        productCode,
        restoredQuote.offer.quote.quoteSnapshotId,
      );
      if (result.ok) {
        setRestoredQuote({
          kind: "ready",
          offer: {
            quote: result.quoteSnapshot,
            acceptance: result.acceptance,
            order: result.orderSnapshot,
          },
        });
      } else {
        setConfirmNotice("Comanda nu a putut fi creată.");
      }
    } catch {
      setConfirmNotice("Comanda nu a putut fi creată.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRestoreCreatePlan() {
    if (restoredJob.kind !== "ready" || !restoredJob.job.release) {
      return;
    }
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await createExecutionPlan(productCode, restoredJob.job.release.snapshotId);
      setRestoredJob({
        kind: "ready",
        job: {
          ...restoredJob.job,
          executionPlan: result.executionPlan,
        },
      });
    } catch {
      setConfirmNotice("Planul de execuție nu a putut fi creat.");
    } finally {
      setBusy(false);
    }
  }

  if (quoteId && !orderId) {
    if (restoredQuote.kind === "loading" || restoredQuote.kind === "idle") {
      return <p>Se încarcă oferta…</p>;
    }
    if (restoredQuote.kind === "missing") {
      return <p>Oferta cerută nu este disponibilă.</p>;
    }
    if (restoredQuote.kind === "error") {
      return <p>Oferta nu a putut fi încărcată.</p>;
    }
    return (
      <section className="product-page">
        <PageHeader
          title={template.label}
          lead={`${restoredQuote.offer.quote.inscription}${
            restoredQuote.offer.quote.customer
              ? ` · ${restoredQuote.offer.quote.customer.displayName}`
              : ""
          } — continuare ofertă.`}
          meta={<ConstructionFacts facts={template.identityFacts} />}
        />
        {confirmNotice ? (
          <Notice tone="warn" compact>
            <p>{confirmNotice}</p>
          </Notice>
        ) : null}
        <QuoteSnapshotSection
          snapshot={restoredQuote.offer.quote}
          acceptance={restoredQuote.offer.acceptance}
          order={restoredQuote.offer.order}
          reused
          busy={busy}
          onFreeze={() => undefined}
          onAccept={() => void handleRestoreAcceptQuote()}
          onCreateOrder={() => void handleRestoreCreateOrder()}
        />
        {restoredQuote.offer.order ? (
          <>
            <OrderSnapshotSection snapshot={restoredQuote.offer.order} />
            <div className="action-row">
              <Link
                className="button-link"
                to={`/jobs/${encodeURIComponent(restoredQuote.offer.order.orderSnapshotId)}`}
              >
                Deschide lucrarea
              </Link>
            </div>
          </>
        ) : null}
      </section>
    );
  }

  if (orderId) {
    if (restoredJob.kind === "loading" || restoredJob.kind === "idle") {
      return <p>Se încarcă lucrarea…</p>;
    }
    if (restoredJob.kind === "missing") {
      return <p>Lucrarea cerută nu este disponibilă.</p>;
    }
    if (restoredJob.kind === "error") {
      return <p>Lucrarea nu a putut fi încărcată.</p>;
    }
    return (
      <section className="product-page">
        <PageHeader
          title={template.label}
          lead={`${restoredJob.job.order.inscription}${
            restoredJob.job.order.customer
              ? ` · ${restoredJob.job.order.customer.displayName}`
              : ""
          } — continuare lucrare comercială.`}
          meta={<ConstructionFacts facts={template.identityFacts} />}
        />
        {confirmNotice ? (
          <Notice tone="warn" compact>
            <p>{confirmNotice}</p>
          </Notice>
        ) : null}
        <OrderSnapshotSection
          snapshot={restoredJob.job.order}
          release={restoredJob.job.release}
          busy={busy}
          onRelease={restoredJob.job.release ? undefined : () => void handleRestoreRelease()}
        />
        <p>
          <Link
            className="button-link"
            to={`/jobs/${encodeURIComponent(restoredJob.job.order.orderSnapshotId)}`}
          >
            Deschide lucrarea
          </Link>
        </p>
        {restoredJob.job.release ? (
          <AcceptedSnapshotSection
            snapshot={restoredJob.job.release}
            reused
            onCreatePlan={() => void handleRestoreCreatePlan()}
            busy={busy}
            hasExecutionPlan={Boolean(restoredJob.job.executionPlan)}
          />
        ) : null}
        {restoredJob.job.executionPlan ? (
          <div id="execution-plan" className="execution-handoff">
            <Notice tone="ok" compact>
              <p>Plan de execuție creat.</p>
            </Notice>
            <p className="page-lead">Lucrul pe taskuri se face în execuție, nu aici.</p>
            <div className="action-row">
              <Link
                className="button-link"
                to={`/execution/${restoredJob.job.executionPlan.plan.planId}`}
              >
                Deschide execuția
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  if (requestId && !orderId && !quoteId) {
    if (restoredRequest.kind === "loading" || restoredRequest.kind === "idle") {
      return <p>Se încarcă cererea…</p>;
    }
    if (restoredRequest.kind === "missing") {
      return <p>Cererea de ofertă nu este disponibilă.</p>;
    }
    if (restoredRequest.kind === "error") {
      return <p>Cererea de ofertă nu a putut fi încărcată.</p>;
    }
  }

  const requestContext =
    restoredRequest.kind === "ready" ? restoredRequest.detail : null;

  const summaryFacts = selectedConfigurationFacts(formSchema, values);
  const summaryStatus = confirmed
    ? "Completă"
    : reviewing
      ? "Pregătită pentru confirmare"
      : definition?.readiness === "blocked"
        ? "Blocat"
        : "Neconfirmată";
  const priceLabel =
    confirmed && confirmed.commercialPrice.completeness === "COMPLETE"
      ? `Preț client ${formatCommercialGross(confirmed.commercialPrice)}`
      : null;
  const catalogHref = requestContext
    ? `/products?request=${encodeURIComponent(requestContext.request.requestId)}`
    : "/products";

  return (
    <section className="product-page configurator-workspace">
      <PageHeader
        title={template.label}
        lead={
          confirmed
            ? `${confirmed.aggregate.inscription} — configurație confirmată.`
            : reviewing
              ? "Configurația este pregătită pentru confirmare."
              : "Completează configurația, apoi verifică."
        }
      />
      <div className="configurator-layout">
        <div className="configurator-main">
      {requestContext ? (
        <Notice tone="ok" compact>
          <div className="request-return-context">
            <p>
              Cerere {requestContext.request.reference}
              {requestContext.customerDisplayName ? " · " : ""}
              <ClientLink
                customerId={requestContext.request.customerId}
                displayName={requestContext.customerDisplayName}
                prefix="Client "
              />
              . Client preluat din cerere.
            </p>
            <Link
              className="button-link"
              to={`/requests/${encodeURIComponent(requestContext.request.requestId)}`}
            >
              Înapoi la cerere
            </Link>
          </div>
        </Notice>
      ) : null}

      <ConstructionFacts facts={template.identityFacts} />

      {editing ? (
        <>
          <FormRenderer
            template={template}
            schema={formSchema}
            values={values}
            onChange={(fieldId, value) => {
              setValues((current) => ({ ...current, [fieldId]: value }));
              setDefinition(null);
              setConfirmed(null);
              setConfirmNotice(null);
            }}
          />
          <div className="action-row">
            <button type="button" onClick={() => void handleCompile()} disabled={busy}>
              Verifică configurația
            </button>
          </div>
        </>
      ) : null}

      {confirmNotice ? (
        <Notice tone="warn" compact>
          <p>{confirmNotice}</p>
        </Notice>
      ) : null}

      {definition?.readiness === "blocked" ? <ReadinessNotice definition={definition} /> : null}

      {reviewing && definition ? (
        <ReviewPanel
          template={template}
          formSchema={formSchema}
          definition={definition}
          busy={busy}
          onConfirm={() => void handleConfirm()}
          onEdit={() => {
            setDefinition(null);
            setConfirmNotice(null);
          }}
        />
      ) : null}

      {confirmed ? (
        <ConfirmedCommercialWorkspace
          confirmed={confirmed}
          busy={busy}
          customers={customers}
          selectedCustomerId={
            requestContext?.request.customerId ?? selectedCustomerId
          }
          onSelectCustomer={requestContext ? undefined : setSelectedCustomerId}
          onCreateCustomer={
            requestContext
              ? undefined
              : async (displayName) => {
                  const created = await createCustomer(displayName);
                  setCustomers(created.customers);
                  setSelectedCustomerId(created.customer.customerId);
                }
          }
          onEditConfiguration={() => {
            setConfirmed(null);
            setDefinition(null);
          }}
          onFreeze={() => void handleFreezeQuote()}
          onAccept={() => void handleAcceptQuote()}
          onCreateOrder={() => void handleCreateOrder()}
          onRelease={() => void handleReleaseProduction()}
          onAcceptProduction={() => void handleAcceptProduction()}
          onCreatePlan={() => void handleCreateExecutionPlan()}
        />
      ) : null}
        </div>
        <ConfiguratorSummary
          statusLabel={summaryStatus}
          requestLabel={
            requestContext
              ? `Cerere ${requestContext.request.reference}`
              : null
          }
          facts={summaryFacts}
          priceLabel={priceLabel}
          catalogHref={catalogHref}
        />
      </div>
    </section>
  );
}

type ConfirmedProduct = {
  truth: ProductTruth;
  aggregate: ProductAggregate;
  eic?: EicResult;
  commercialPrice: CommercialPriceProjection;
  executionPlanPreview: ExecutionPlanPreview;
  quoteSnapshot?: QuoteSnapshot;
  quoteReused?: boolean;
  quoteAcceptance?: QuoteAcceptanceDecision;
  orderSnapshot?: OrderSnapshot;
  snapshot?: AcceptedProductionSnapshot;
  snapshotReused?: boolean;
  executionPlan?: ExecutionPlanView;
  executionPlanReused?: boolean;
};

function ConfirmedCommercialWorkspace({
  confirmed,
  busy,
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onCreateCustomer,
  onEditConfiguration,
  onFreeze,
  onAccept,
  onCreateOrder,
  onRelease,
  onAcceptProduction,
  onCreatePlan,
}: {
  confirmed: ConfirmedProduct;
  busy: boolean;
  customers: readonly Customer[];
  selectedCustomerId: string;
  onSelectCustomer?: (customerId: string) => void;
  onCreateCustomer?: (displayName: string) => Promise<void>;
  onEditConfiguration: () => void;
  onFreeze: () => void;
  onAccept: () => void;
  onCreateOrder: () => void;
  onRelease: () => void;
  onAcceptProduction: () => void;
  onCreatePlan: () => void;
}) {
  const commercialRelease =
    confirmed.snapshot &&
    confirmed.orderSnapshot &&
    confirmed.snapshot.sourceOrderSnapshotId === confirmed.orderSnapshot.orderSnapshotId
      ? confirmed.snapshot
      : undefined;
  const experience = projectCommercialExperience({
    commercialCompleteness: confirmed.commercialPrice.completeness,
    internalCostCompleteness: confirmed.eic?.completeness,
    quote: confirmed.quoteSnapshot,
    acceptance: confirmed.quoteAcceptance,
    order: confirmed.orderSnapshot,
    released: Boolean(commercialRelease),
    executionPlanId: confirmed.executionPlan?.plan.planId,
  });
  const quoteFrozen = Boolean(confirmed.quoteSnapshot);

  return (
    <div className="confirmed-result">
      <CommercialProgress experience={experience} />
      {quoteFrozen ? (
        <details className="phase-summary">
          <summary>Configurație confirmată</summary>
          <ConfirmedSummary aggregate={confirmed.aggregate} truth={confirmed.truth} />
        </details>
      ) : (
        <>
          <ConfirmedSummary aggregate={confirmed.aggregate} truth={confirmed.truth} />
          <div className="action-row">
            <button type="button" className="button-secondary" onClick={onEditConfiguration}>
              Modifică configurația
            </button>
          </div>
        </>
      )}

      <QuoteSnapshotSection
        price={confirmed.commercialPrice}
        snapshot={confirmed.quoteSnapshot}
        acceptance={confirmed.quoteAcceptance}
        order={confirmed.orderSnapshot}
        reused={Boolean(confirmed.quoteReused)}
        busy={busy}
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={onSelectCustomer}
        onCreateCustomer={onCreateCustomer}
        onFreeze={onFreeze}
        onAccept={onAccept}
        onCreateOrder={onCreateOrder}
      />

      {confirmed.orderSnapshot ? (
        <>
          <OrderSnapshotSection
            snapshot={confirmed.orderSnapshot}
            release={commercialRelease}
            busy={busy}
            onRelease={commercialRelease ? undefined : onRelease}
          />
          <p>
            <Link
              className="button-link"
              to={`/jobs/${encodeURIComponent(confirmed.orderSnapshot.orderSnapshotId)}`}
            >
              Deschide lucrarea
            </Link>
          </p>
        </>
      ) : null}

      {commercialRelease ? (
        <AcceptedSnapshotSection
          snapshot={commercialRelease}
          reused={Boolean(confirmed.snapshotReused)}
          onCreatePlan={onCreatePlan}
          busy={busy}
          hasExecutionPlan={Boolean(confirmed.executionPlan)}
        />
      ) : null}

      {confirmed.executionPlan ? (
        <div id="execution-plan" className="execution-handoff">
          <Notice tone="ok" compact>
            <p>
              {confirmed.executionPlanReused
                ? "Planul de execuție era deja creat."
                : "Plan de execuție creat."}
            </p>
          </Notice>
          <p className="page-lead">Lucrul pe taskuri se face în execuție, nu aici.</p>
          <div className="action-row">
            <Link
              className="button-link"
              to={`/execution/${confirmed.executionPlan.plan.planId}`}
            >
              Deschide execuția
            </Link>
          </div>
        </div>
      ) : null}

      <details className="secondary-details">
        <summary>Detalii interne</summary>
        {confirmed.eic ? (
          <EicSection eic={confirmed.eic} aggregate={confirmed.aggregate} />
        ) : null}
        {confirmed.executionPlan ? null : (
          <ProductionPreviewSection
            preview={confirmed.executionPlanPreview}
            basedOnSnapshot={Boolean(confirmed.snapshot)}
            commercial={Boolean(confirmed.orderSnapshot)}
          />
        )}
      </details>

      {confirmed.orderSnapshot ? null : (
        <details className="atelier-details">
          <summary>Atelier / test tehnic</summary>
          <p className="page-lead">
            Cale tehnică de atelier, fără comandă comercială.
          </p>
          {confirmed.snapshot && !commercialRelease ? (
            <AcceptedSnapshotSection
              snapshot={confirmed.snapshot}
              reused={Boolean(confirmed.snapshotReused)}
              onCreatePlan={onCreatePlan}
              busy={busy}
              hasExecutionPlan={Boolean(confirmed.executionPlan)}
            />
          ) : null}
          <div className="action-row">
            <button type="button" className="button-secondary" onClick={onAcceptProduction} disabled={busy}>
              Acceptă pentru producție
            </button>
          </div>
        </details>
      )}
    </div>
  );
}

function selectedConfigurationFacts(
  schema: FormSchema,
  values: DraftValues,
): string[] {
  return schema.sections.flatMap((section) =>
    section.fields.flatMap((field) => {
      const raw = values[field.id];
      if (raw === undefined || raw === null || raw === "") {
        return [];
      }
      if (field.type === "boolean") {
        return raw === true ? [field.label] : [];
      }
      const option = field.options?.find((item) => item.value === String(raw));
      return [`${field.label}: ${option?.label ?? String(raw)}`];
    }),
  );
}

function formatCommercialGross(price: CommercialPriceProjection): string {
  if (typeof price.grossPrice !== "number") {
    return "";
  }
  return `${price.grossPrice.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${price.currency}`;
}

async function loadCommercialExecution(
  productCode: string,
  orderSnapshotId: string,
): Promise<{
  snapshot?: AcceptedProductionSnapshot;
  executionPlan?: ExecutionPlanView;
}> {
  const snapshot = await readProductionRelease(productCode, orderSnapshotId);
  if (!snapshot) {
    return {};
  }
  const executionPlan = await readExecutionPlan(productCode, snapshot.snapshotId);
  return {
    snapshot,
    executionPlan: executionPlan ?? undefined,
  };
}
