import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type {
  AcceptedProductionSnapshot,
  CommercialPriceProjection,
  Customer,
  DraftValues,
  EicResult,
  ExecutionPlanPreview,
  ExecutionPlanView,
  ProductAggregate,
  ProductDefinition,
  ProductTruth,
  OrderSnapshot,
  QuoteAcceptanceDecision,
  QuoteSnapshot,
} from "@workos-final/domain";
import { createCustomer, fetchCustomers } from "./customerApi";
import { FormRenderer } from "./FormRenderer";
import {
  AcceptedSnapshotSection,
  CommercialPriceSection,
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
  type TemplateProjection,
} from "./productApi";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";

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

export function ProductConfigurationPage() {
  const { productCode = "" } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [restoredJob, setRestoredJob] = useState<RestoredJobState>({ kind: "idle" });
  const [values, setValues] = useState<DraftValues>({});
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<{
    truth: ProductTruth;
    aggregate: ProductAggregate;
    eic: EicResult;
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

  if (page.kind === "loading") {
    return <p>Se încarcă produsul…</p>;
  }
  if (page.kind === "missing") {
    return <p>Produsul cerut nu este disponibil.</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-a putut încărca produsul.</p>;
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
        selectedCustomerId,
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
            "Oferta nu poate fi înghețată până când costul intern și prețul client nu sunt complete.",
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

  return (
    <section className="product-page">
      <PageHeader
        title={template.label}
        lead={
          confirmed
            ? `${confirmed.aggregate.inscription} — configurație confirmată.`
            : reviewing
              ? "Configurația este pregătită pentru confirmare."
              : "Completează configurația, apoi verifică."
        }
        meta={<ConstructionFacts facts={template.identityFacts} />}
      />

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
        <div className="confirmed-result">
          <ConfirmedSummary aggregate={confirmed.aggregate} truth={confirmed.truth} />
          <EicSection eic={confirmed.eic} aggregate={confirmed.aggregate} />
          <CommercialPriceSection price={confirmed.commercialPrice} />
          <QuoteSnapshotSection
            price={confirmed.commercialPrice}
            snapshot={confirmed.quoteSnapshot}
            acceptance={confirmed.quoteAcceptance}
            order={confirmed.orderSnapshot}
            reused={Boolean(confirmed.quoteReused)}
            busy={busy}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
            onCreateCustomer={async (displayName) => {
              const created = await createCustomer(displayName);
              setCustomers(created.customers);
              setSelectedCustomerId(created.customer.customerId);
            }}
            onFreeze={() => void handleFreezeQuote()}
            onAccept={() => void handleAcceptQuote()}
            onCreateOrder={() => void handleCreateOrder()}
          />
          {confirmed.orderSnapshot ? (
            <OrderSnapshotSection
              snapshot={confirmed.orderSnapshot}
              release={
                confirmed.snapshot?.sourceOrderSnapshotId ===
                confirmed.orderSnapshot.orderSnapshotId
                  ? confirmed.snapshot
                  : undefined
              }
              busy={busy}
              onRelease={
                confirmed.snapshot?.sourceOrderSnapshotId ===
                confirmed.orderSnapshot.orderSnapshotId
                  ? undefined
                  : () => void handleReleaseProduction()
              }
            />
          ) : null}
          {confirmed.executionPlan ? null : (
            <ProductionPreviewSection
              preview={confirmed.executionPlanPreview}
              basedOnSnapshot={Boolean(confirmed.snapshot)}
              commercial={Boolean(confirmed.orderSnapshot)}
            />
          )}

          {confirmed.snapshot || confirmed.orderSnapshot ? null : (
            <div className="lifecycle-cta">
              <p className="page-lead">
                Atelier / test tehnic. Îngheață configurația tehnică pentru execuție, fără comandă
                comercială.
              </p>
              <div className="action-row">
                <button type="button" onClick={() => void handleAcceptProduction()} disabled={busy}>
                  Acceptă pentru producție
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => {
                    setConfirmed(null);
                    setDefinition(null);
                  }}
                >
                  Modifică configurația
                </button>
              </div>
            </div>
          )}

          {confirmed.snapshot &&
          (!confirmed.orderSnapshot ||
            confirmed.snapshot.sourceOrderSnapshotId === confirmed.orderSnapshot.orderSnapshotId) ? (
            <>
              {confirmed.executionPlan || confirmed.orderSnapshot ? null : (
                <div className="action-row">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => void handleAcceptProduction()}
                    disabled={busy}
                  >
                    Acceptă pentru producție
                  </button>
                  <button
                    type="button"
                    className="button-quiet"
                    onClick={() => {
                      setConfirmed(null);
                      setDefinition(null);
                    }}
                  >
                    Modifică configurația
                  </button>
                </div>
              )}
              <AcceptedSnapshotSection
                snapshot={confirmed.snapshot}
                reused={Boolean(confirmed.snapshotReused)}
                onCreatePlan={() => void handleCreateExecutionPlan()}
                busy={busy}
                hasExecutionPlan={Boolean(confirmed.executionPlan)}
              />
            </>
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
        </div>
      ) : null}
    </section>
  );
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
