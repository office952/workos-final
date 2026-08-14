import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  DraftValues,
  ProductAggregate,
  ProductDefinition,
  ProductTruth,
} from "@workos-final/domain";
import { FormRenderer } from "./FormRenderer";
import {
  compileConfiguration,
  confirmConfiguration,
  fetchTemplateProjection,
  type TemplateProjection,
} from "./productApi";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; projection: TemplateProjection };

export function ProductConfigurationPage() {
  const { templateCode = "" } = useParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [values, setValues] = useState<DraftValues>({
    "lighting.selected": false,
  });
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<{
    truth: ProductTruth;
    aggregate: ProductAggregate;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    setDefinition(null);
    setConfirmed(null);

    void fetchTemplateProjection(templateCode)
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
  }, [templateCode]);

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

  async function handleCompile() {
    setBusy(true);
    setConfirmed(null);
    try {
      setDefinition(await compileConfiguration(templateCode, values));
    } catch {
      setPage({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    setBusy(true);
    try {
      const result = await confirmConfiguration(templateCode, values);
      if (result.ok) {
        setConfirmed({ truth: result.truth, aggregate: result.aggregate });
        setDefinition(null);
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

  return (
    <section>
      <h1>{template.label}</h1>
      <p className="page-lead">{template.description}</p>

      <FormRenderer
        template={template}
        schema={formSchema}
        values={values}
        onChange={(fieldId, value) => {
          setValues((current) => ({ ...current, [fieldId]: value }));
          setDefinition(null);
          setConfirmed(null);
        }}
      />

      <div className="action-row">
        <button type="button" onClick={() => void handleCompile()} disabled={busy}>
          Verifică configurația
        </button>
      </div>

      {definition?.readiness === "blocked" ? (
        <div className="notice notice-blocked">
          <p>Mai sunt informații de completat.</p>
          <ul>
            {definition.missing.map((item) => (
              <li key={item.fieldId}>{item.label}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {definition?.readiness === "ready" && !confirmed ? (
        <div className="notice">
          <h2>Verificare înainte de confirmare</h2>
          <p>Produs: {template.label}</p>
          <p>
            Componente active:{" "}
            {template.components
              .filter((component) =>
                definition.selectedComponentIds.includes(component.id),
              )
              .map((component) => component.label)
              .join(", ")}
          </p>
          <ul>
            {formSchema.sections
              .flatMap((section) => section.fields)
              .filter(
                (field) =>
                  definition.values[field.id] !== undefined &&
                  field.type !== "boolean",
              )
              .map((field) => {
                const raw = definition.values[field.id];
                const label =
                  field.options?.find((option) => option.value === raw)?.label ??
                  String(raw);
                return (
                  <li key={field.id}>
                    {field.label}: {label}
                  </li>
                );
              })}
          </ul>
          <button type="button" onClick={() => void handleConfirm()} disabled={busy}>
            Confirmă configurația
          </button>
        </div>
      ) : null}

      {confirmed ? (
        <div className="notice notice-ok">
          <h2>Configurație confirmată</h2>
          <p>
            {confirmed.aggregate.productLabel}: {confirmed.aggregate.inscription}
          </p>
          {confirmed.aggregate.components.map((component) => (
            <div key={component.id}>
              <h3>{component.label}</h3>
              <ul>
                {component.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="page-lead">
            Indisponibil acum: {confirmed.aggregate.unavailable.join(", ")}.
          </p>
        </div>
      ) : null}
    </section>
  );
}
