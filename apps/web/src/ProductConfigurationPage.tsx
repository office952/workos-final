import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  DraftValues,
  EicResult,
  ProductAggregate,
  ProductDefinition,
  ProductTruth,
} from "@workos-final/domain";
import { FormRenderer } from "./FormRenderer";
import {
  compileConfiguration,
  confirmReviewedConfiguration,
  fetchTemplateProjection,
  type TemplateProjection,
} from "./productApi";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; projection: TemplateProjection };

function formatQuantity(value: number): string {
  return value.toLocaleString("ro-RO", { maximumFractionDigits: 2 });
}

function formatMoney(value: number): string {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ProductConfigurationPage() {
  const { productCode = "" } = useParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [values, setValues] = useState<DraftValues>({});
  const [definition, setDefinition] = useState<ProductDefinition | null>(null);
  const [confirmed, setConfirmed] = useState<{
    truth: ProductTruth;
    aggregate: ProductAggregate;
    eic: EicResult;
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
        });
        setDefinition(null);
      } else if (result.reason === "review_mismatch") {
        setDefinition(null);
        setConfirmed(null);
        setConfirmNotice(
          "Configurația verificată nu mai corespunde. Verificați din nou.",
        );
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

      {template.identityFacts.length > 0 ? (
        <div className="notice">
          <h2>Caracteristici produs</h2>
          <ul>
            {template.identityFacts.map((fact) => (
              <li key={fact.id}>
                {fact.label}: {fact.value}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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

      {confirmNotice ? <p className="notice notice-blocked">{confirmNotice}</p> : null}

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
          {definition.measurements.length > 0 ? (
            <p>
              Măsurătorile de mai sus sunt introduse de operator. Nu sunt geometrie
              calculată de WorkOS.
            </p>
          ) : null}
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

          {confirmed.truth.measurements.map((measurement) => (
            <p key={measurement.fieldId}>
              Perimetru confirmat: {measurement.value} mm (introdus de operator)
            </p>
          ))}

          <h3>Cantitate tehnică</h3>
          {confirmed.aggregate.quantities.length === 0 ? (
            <p>Cantitatea tehnică nu poate fi calculată fără măsurătoare confirmată.</p>
          ) : (
            <ul>
              {confirmed.aggregate.quantities.map((quantity) => (
                <li key={quantity.id}>
                  {quantity.label}: {formatQuantity(quantity.value)} {quantity.unit}
                </li>
              ))}
            </ul>
          )}

          <h3>Resurse necesare</h3>
          {confirmed.eic.lines.length === 0 ? (
            <p>Nu există încă o cerere de resurse pentru acest produs.</p>
          ) : (
            <ul>
              {confirmed.eic.lines.map((line) => (
                <li key={`${line.label}-need`}>
                  {line.label}: {formatQuantity(line.quantity)} {line.unit}
                </li>
              ))}
            </ul>
          )}

          <h3>Cost intern estimat</h3>
          <p>Costul intern al produsului este parțial. Este calculat doar pentru cant.</p>
          {confirmed.eic.lines.length === 0 ? (
            <p>Costul intern nu este disponibil pentru componentele necalculate.</p>
          ) : (
            <ul>
              {confirmed.eic.lines.map((line) => (
                <li key={`${line.label}-cost`}>
                  {line.label}: {formatQuantity(line.quantity)} {line.unit} ×{" "}
                  {formatMoney(line.rate)} {line.currency}/{line.unit} ={" "}
                  {formatMoney(line.cost)} {line.currency}
                </li>
              ))}
            </ul>
          )}
          {confirmed.eic.lines.length > 0 ? (
            <p>
              Total cost intern estimat (doar cant): {formatMoney(confirmed.eic.total)}{" "}
              {confirmed.eic.currency}
            </p>
          ) : null}
          <p>
            Neincluse încă în costul intern pilot:{" "}
            {confirmed.eic.excludedComponentLabels.join(", ")}.
          </p>
          <p className="page-lead">
            Indisponibil acum: {confirmed.aggregate.unavailable.join(", ")}.
          </p>
        </div>
      ) : null}
    </section>
  );
}
