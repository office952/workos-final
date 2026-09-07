import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  commercialPrimaryActionLabel,
  type DraftValues,
  type ProductAggregate,
  type ProductDefinition,
  type RequestDetailProjection,
} from "@workos-final/domain";
import {
  constructionRowNodes,
  projectConstructionComposition,
  type ConstructionCompositionNode,
} from "../../../constructionCompositionModel";
import { FormRenderer } from "../../../FormRenderer";
import {
  compileConfiguration,
  confirmReviewedConfiguration,
  createQuoteSnapshot,
  fetchTemplateProjection,
  type TemplateProjection,
} from "../../../productApi";
import { readRequestDetail } from "../../../requestsApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; projection: TemplateProjection };

type ConfirmedState = {
  definition: ProductDefinition;
  aggregate: ProductAggregate;
};

function nodeName(node: ConstructionCompositionNode): string {
  return node.roleLabel ?? node.label;
}

export function ConstructionWorkspace() {
  const { productCode = "" } = useParams();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request");
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [request, setRequest] = useState<RequestDetailProjection | null>(null);
  const [values, setValues] = useState<DraftValues>({});
  const [focusComponentId, setFocusComponentId] = useState<string>("ROOT");
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    setDefinition(null);
    setConfirmed(null);
    setFocusComponentId("ROOT");
    void fetchTemplateProjection(productCode)
      .then((projection) => {
        if (!cancelled) {
          setPage(projection ? { kind: "ready", projection } : { kind: "missing" });
        }
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
    if (!requestId) {
      setRequest(null);
      return;
    }
    void readRequestDetail(requestId)
      .then((detail) => {
        if (!cancelled) {
          setRequest(detail);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRequest(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  useContinuityFacts({
    requestId: request?.request.requestId ?? requestId,
    requestReference: request?.request.reference,
    customerName: request?.customerDisplayName,
  });

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă configuratorul…</p>;
  }
  if (page.kind === "missing") {
    return <p className="ui20-error">Produsul cerut nu este disponibil.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Produsul nu a putut fi încărcat.</p>;
  }

  const { template, formSchema } = page.projection;
  const nodes = projectConstructionComposition(template, formSchema, values);
  const row = constructionRowNodes(nodes);
  const selected = nodes.find((node) => node.id === focusComponentId) ?? nodes[0];
  const reviewing = definition?.readiness === "ready" && !confirmed;

  async function handleCompile() {
    setBusy(true);
    setNotice(null);
    setConfirmed(null);
    try {
      setDefinition(await compileConfiguration(productCode, values));
    } catch {
      setNotice("Configurația nu a putut fi verificată.");
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    if (!definition) {
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const result = await confirmReviewedConfiguration(
        productCode,
        definition,
        requestId ?? undefined,
      );
      if (result.ok) {
        setConfirmed({
          definition,
          aggregate: result.aggregate,
        });
        setDefinition(null);
      } else if (result.reason === "review_mismatch") {
        setDefinition(null);
        setNotice("Configurația verificată nu mai corespunde. Verificați din nou.");
      } else {
        setDefinition(result.definition);
      }
    } catch {
      setNotice("Confirmarea nu a putut fi aplicată.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateQuote() {
    if (!confirmed || !request) {
      setNotice("Oferta se creează din cererea legată, cu clientul existent.");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const result = await createQuoteSnapshot(
        productCode,
        confirmed.definition,
        request.request.customerId,
        request.request.requestId,
      );
      if (result.ok) {
        void navigate(`/quotes/${encodeURIComponent(result.quoteSnapshot.quoteSnapshotId)}`);
        return;
      }
      if (result.reason === "review_mismatch") {
        setConfirmed(null);
        setDefinition(null);
        setNotice("Configurația verificată nu mai corespunde. Verificați din nou.");
      } else if (result.reason === "not_ready") {
        setConfirmed(null);
        setDefinition(result.definition ?? null);
      } else {
        setNotice(result.message ?? "Oferta nu a putut fi creată.");
      }
    } catch {
      setNotice("Oferta nu a putut fi creată.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="ui20-surface" data-surface="configurator" data-instrument="construction">
      <h1>{template.label}</h1>
      <p className="ui20-kicker">
        {request
          ? `${request.request.reference}${
              request.customerDisplayName ? ` · ${request.customerDisplayName}` : ""
            }`
          : "Construcția produsului"}
      </p>
      <div className="ui20-instrument-config">
        <section aria-labelledby="composition-heading">
          <h2 id="composition-heading">Compoziție</h2>
          <div
            className="ui20-composition-map"
            data-composition
            data-confirmed={confirmed ? "true" : "false"}
            role="toolbar"
            aria-label="Roluri de construcție"
          >
            {row.map((node, index) => (
              <span key={node.id} className="ui20-comp-item">
                {index > 0 ? (
                  <span className="ui20-comp-rel" aria-hidden="true">
                    —
                  </span>
                ) : null}
                <button
                  type="button"
                  className="ui20-comp-node"
                  aria-pressed={!confirmed && focusComponentId === node.id}
                  onClick={() => {
                    if (!confirmed) {
                      setFocusComponentId(node.id);
                    }
                  }}
                >
                  {nodeName(node)}
                </button>
              </span>
            ))}
            {nodes
              .filter((node) => node.role === "LIGHTING")
              .map((node) => (
                <span key={node.id} className="ui20-comp-item">
                  <span className="ui20-comp-rel" aria-hidden="true">
                    ↓
                  </span>
                  <button
                    type="button"
                    className="ui20-comp-node"
                    aria-pressed={!confirmed && focusComponentId === node.id}
                    onClick={() => {
                      if (!confirmed) {
                        setFocusComponentId(node.id);
                      }
                    }}
                  >
                    {nodeName(node)}
                  </button>
                </span>
              ))}
          </div>
        </section>
        <section
          className="ui20-lens"
          data-lens={confirmed ? "confirmed" : "context"}
          aria-labelledby="lens-heading"
        >
          <h2 id="lens-heading">
            {confirmed
              ? "Configurație confirmată"
              : `Lentilă — ${selected ? nodeName(selected) : "context"}`}
          </h2>
          {!confirmed ? (
            <div className="ui20-form">
              <FormRenderer
                template={template}
                schema={formSchema}
                values={values}
                focusComponentId={focusComponentId}
                onChange={(fieldId, value) => {
                  setValues((current) => ({ ...current, [fieldId]: value }));
                  setDefinition(null);
                  setConfirmed(null);
                  setNotice(null);
                }}
              />
              <p className="ui20-actions">
                <button type="button" onClick={() => void handleCompile()} disabled={busy}>
                  Verifică configurația
                </button>
              </p>
            </div>
          ) : null}
          {definition?.readiness === "blocked" ? (
            <div className="ui20-blocked-note">
              <p>Probleme de rezolvat: {definition.missing.length}</p>
              <ul>
                {definition.missing.map((item) => (
                  <li key={item.fieldId}>{item.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {reviewing && definition ? (
            <p className="ui20-actions">
              <button type="button" onClick={() => void handleConfirm()} disabled={busy}>
                Confirmă configurația
              </button>
              <button
                type="button"
                className="ui20-ghost"
                onClick={() => setDefinition(null)}
                disabled={busy}
              >
                Editează
              </button>
            </p>
          ) : null}
          {confirmed ? (
            <div>
              <p>{confirmed.aggregate.inscription}</p>
              <p className="ui20-meta">{confirmed.aggregate.productLabel}</p>
              {confirmed.aggregate.components.length > 0 ? (
                <ul className="ui20-confirmed-roles">
                  {confirmed.aggregate.components.map((component) => (
                    <li key={component.id}>{component.label}</li>
                  ))}
                </ul>
              ) : null}
              <p className="ui20-actions">
                <button type="button" onClick={() => void handleCreateQuote()} disabled={busy}>
                  {commercialPrimaryActionLabel("CREATE_QUOTE")}
                </button>
              </p>
            </div>
          ) : null}
          {notice ? <p className="ui20-error">{notice}</p> : null}
        </section>
      </div>
    </article>
  );
}
