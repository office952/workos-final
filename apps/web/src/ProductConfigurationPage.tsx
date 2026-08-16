import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  AcceptedProductionSnapshot,
  CommercialPriceProjection,
  DraftValues,
  EicResult,
  ExecutionPlanPreview,
  ExecutionPlanView,
  ProductAggregate,
  ProductDefinition,
  ProductTruth,
  QuoteSnapshot,
} from "@workos-final/domain";
import { ExecutionPlanPanel } from "./ExecutionPlanPanel";
import { FormRenderer } from "./FormRenderer";
import {
  AcceptedSnapshotSection,
  CommercialPriceSection,
  ConfirmedSummary,
  ConstructionFacts,
  EicSection,
  ProductionPreviewSection,
  QuoteSnapshotSection,
  ReadinessNotice,
  ReviewPanel,
} from "./ProductConfigurationViews";
import {
  acceptProductionSnapshot,
  assignExecutionTaskExecutor,
  assignExecutionTaskProvider,
  compileConfiguration,
  completeExecutionTask,
  confirmReviewedConfiguration,
  createExecutionPlan,
  createQuoteSnapshot,
  fetchTemplateProjection,
  startExecutionTask,
  type TemplateProjection,
} from "./productApi";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; projection: TemplateProjection };

export function ProductConfigurationPage() {
  const { productCode = "" } = useParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
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
    snapshot?: AcceptedProductionSnapshot;
    snapshotReused?: boolean;
    executionPlan?: ExecutionPlanView;
    executionPlanReused?: boolean;
  } | null>(null);
  const [confirmNotice, setConfirmNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      const result = await createQuoteSnapshot(productCode, confirmed.definition);
      if (result.ok) {
        setConfirmed({
          ...confirmed,
          quoteSnapshot: result.quoteSnapshot,
          quoteReused: !result.created,
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

  async function applyTaskMutation(
    action: () => Promise<
      { ok: true; executionPlan: ExecutionPlanView } | { ok: false; error: string }
    >,
  ) {
    setBusy(true);
    setConfirmNotice(null);
    try {
      const result = await action();
      if (!result.ok) {
        setConfirmNotice(taskActionNotice(result.error));
        return;
      }
      setConfirmed((current) =>
        current ? { ...current, executionPlan: result.executionPlan } : current,
      );
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
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
            reused={Boolean(confirmed.quoteReused)}
            busy={busy}
            onFreeze={() => void handleFreezeQuote()}
          />
          <ProductionPreviewSection
            preview={confirmed.executionPlanPreview}
            basedOnSnapshot={Boolean(confirmed.snapshot)}
          />

          {confirmed.snapshot ? null : (
            <div className="lifecycle-cta">
              <p className="page-lead">Îngheață configurația tehnică pentru execuție.</p>
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

          {confirmed.snapshot ? (
            <>
              {confirmed.executionPlan ? null : (
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
                <p>Configurația este gata. Lucrul de producție este în planul de execuție.</p>
              </Notice>
              <ExecutionPlanPanel
                view={confirmed.executionPlan}
                reused={Boolean(confirmed.executionPlanReused)}
                busy={busy}
                onAssignProvider={(taskId, providerId) =>
                  void applyTaskMutation(() => assignExecutionTaskProvider(taskId, providerId))
                }
                onAssignExecutor={(taskId, personId) =>
                  void applyTaskMutation(() => assignExecutionTaskExecutor(taskId, personId))
                }
                onStartTask={(taskId) => void applyTaskMutation(() => startExecutionTask(taskId))}
                onCompleteTask={(taskId, input) =>
                  void applyTaskMutation(() => completeExecutionTask(taskId, input))
                }
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function taskActionNotice(error: string): string {
  switch (error) {
    case "ineligible_provider":
      return "Furnizorul ales nu este eligibil pentru această operație.";
    case "reassignment_locked":
      return "Alocarea nu mai poate fi schimbată după pornire.";
    case "missing_assignment":
      return "Taskul nu are furnizor alocat.";
    case "missing_executor":
      return "Taskul nu are executant alocat.";
    case "provider_unavailable":
      return "Furnizorul alocat nu mai este disponibil.";
    case "executor_unavailable":
      return "Executantul alocat nu mai este activ.";
    case "unknown_person":
      return "Persoana aleasă nu există.";
    case "retired_person":
      return "Persoana aleasă nu mai este activă.";
    case "dependencies_incomplete":
      return "Taskul așteaptă alte operații.";
    case "invalid_transition":
      return "Tranziția nu este permisă.";
    case "invalid_quantity":
      return "Cantitatea realizată nu este validă.";
    case "invalid_unit":
      return "Unitatea nu corespunde resursei planificate.";
    case "invalid_resource":
      return "Resursa aleasă nu face parte din planul taskului.";
    case "invalid_note":
      return "Nota de finalizare este prea lungă.";
    default:
      return "Acțiunea nu a putut fi aplicată.";
  }
}
