import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  commercialPrimaryActionLabel,
  type CommercialPriceProjection,
  type DraftValues,
  type ProductAggregate,
  type ProductDefinition,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { projectConstructionComposition } from "../../../constructionCompositionModel";
import { FormRenderer } from "../../../FormRenderer";
import { formatMoney } from "../../../formatDisplay";
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
  commercialPrice: CommercialPriceProjection;
};

export function ConstructionWorkspace() {
  const { productCode = "" } = useParams();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request");
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [request, setRequest] = useState<RequestDetailProjection | null>(null);
  const [values, setValues] = useState<DraftValues>({});
  const [focusComponentId, setFocusComponentId] = useState<string | undefined>(undefined);
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    setDefinition(null);
    setConfirmed(null);
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
          commercialPrice: result.commercialPrice,
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
    <article className="ui20-surface" data-surface="configurator">
      <h1>{template.label}</h1>
      <p className="ui20-kicker">
        Compoziție constructivă și lentilă de context. Schema existentă decide câmpurile.
        {request
          ? ` Cerere ${request.request.reference}${
              request.customerDisplayName ? ` · ${request.customerDisplayName}` : ""
            }.`
          : ""}
      </p>
      <div className="ui20-composition" role="toolbar" aria-label="Roluri selectate">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            aria-current={focusComponentId === node.id}
            onClick={() => setFocusComponentId(node.id)}
          >
            {node.roleLabel ?? node.label}
          </button>
        ))}
      </div>
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
        <section className="ui20-cluster">
          <h2>Blocată</h2>
          <p>Probleme de rezolvat: {definition.missing.length}</p>
          <ul>
            {definition.missing.map((item) => (
              <li key={item.fieldId}>{item.label}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {reviewing && definition ? (
        <section className="ui20-cluster">
          <h2>Gata de confirmare</h2>
          <p className="ui20-actions">
            <button type="button" onClick={() => void handleConfirm()} disabled={busy}>
              Confirmă configurația
            </button>
            <button type="button" onClick={() => setDefinition(null)} disabled={busy}>
              Editează
            </button>
          </p>
        </section>
      ) : null}
      {confirmed ? (
        <section className="ui20-cluster">
          <h2>Configurație confirmată</h2>
          <p>{confirmed.aggregate.inscription}</p>
          {confirmed.commercialPrice.grossPrice !== null ? (
            <p>
              Preț final client: {formatMoney(confirmed.commercialPrice.grossPrice)}{" "}
              {confirmed.commercialPrice.currency}
            </p>
          ) : (
            <p>Prețul clientului nu este disponibil pe această configurație.</p>
          )}
          <p className="ui20-actions">
            <button type="button" onClick={() => void handleCreateQuote()} disabled={busy}>
              {commercialPrimaryActionLabel("CREATE_QUOTE")}
            </button>
          </p>
        </section>
      ) : null}
      {notice ? <p className="ui20-error">{notice}</p> : null}
    </article>
  );
}
