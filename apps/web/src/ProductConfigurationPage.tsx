import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  eicLineGroupLabel,
  type DraftValues,
  type EicLine,
  type EicLineGroup,
  type EicResult,
  type ProductAggregate,
  type ProductDefinition,
  type ProductTruth,
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

function formatUnit(unit: string): string {
  switch (unit) {
    case "m2":
      return "m²";
    case "mm2":
      return "mm²";
    case "W":
      return "W";
    case "buc":
      return "buc";
    default:
      return unit;
  }
}

function lightingUnavailableReason(aggregate: ProductAggregate): string {
  const lighting = aggregate.componentStatuses.find((item) => item.id === "LIGHTING");
  if (!lighting || lighting.status === "CALCULATED") {
    return "";
  }
  if (lighting.unavailable.length === 0) {
    return " Iluminarea nu este calculată.";
  }
  return ` Iluminarea nu este calculată: ${lighting.unavailable.join("; ")}.`;
}

function measurementCopy(value: number, unit: string): string {
  if (unit === "mm2") {
    return `Suprafață confirmată: ${value} mm² (introdusă de operator)`;
  }
  return `Perimetru confirmat: ${value} mm (introdus de operator)`;
}

function formatMoney(value: number): string {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const EIC_GROUP_ORDER: readonly EicLineGroup[] = [
  "materials",
  "services",
  "labor",
  "lighting",
];

function eicGroups(eic: EicResult): Array<[EicLineGroup, EicLine[]]> {
  return EIC_GROUP_ORDER.flatMap((group) => {
    const lines = eic.lines.filter((line) => line.group === group);
    return lines.length === 0 ? [] : [[group, lines]];
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

      {confirmed || definition?.readiness === "ready" ? null : (
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
      )}

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
          <p>Revizuiți configurația. Nu mai editați formularul în acest pas.</p>
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
          <div className="action-row">
            <button type="button" onClick={() => void handleConfirm()} disabled={busy}>
              Confirmă configurația
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setDefinition(null);
                setConfirmNotice(null);
              }}
            >
              Modifică configurația
            </button>
          </div>
        </div>
      ) : null}

      {confirmed ? (
        <div className="notice notice-ok">
          <h2>Configurație confirmată</h2>
          <p>
            {confirmed.aggregate.productLabel}: {confirmed.aggregate.inscription}
          </p>
          {confirmed.aggregate.components
            .filter((component) => component.details.length > 0)
            .map((component) => (
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
              {measurementCopy(measurement.value, measurement.unit)}
            </p>
          ))}

          <h3>Cantitate tehnică</h3>
          {confirmed.aggregate.quantities.length === 0 ? (
            <p>Cantitatea tehnică nu poate fi calculată fără măsurătoare confirmată.</p>
          ) : (
            <ul>
              {confirmed.aggregate.quantities.map((quantity) => (
                <li key={quantity.id}>
                  {quantity.label}: {formatQuantity(quantity.value)}{" "}
                  {formatUnit(quantity.unit)}
                </li>
              ))}
            </ul>
          )}

          <h3>Resurse necesare</h3>
          {confirmed.eic.lines.length === 0 ? (
            <p>Nu există încă o cerere de resurse pentru acest produs.</p>
          ) : (
            eicGroups(confirmed.eic).map(([group, lines]) => (
              <div key={`need-${group}`}>
                <h4>{eicLineGroupLabel(group)}</h4>
                <ul>
                  {lines.map((line) => (
                    <li key={`${line.resourceId}-need`}>
                      {line.label}: {formatQuantity(line.quantity)} {formatUnit(line.unit)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          <h3>Cost intern estimat</h3>
          <p>
            Costul intern al produsului este parțial. Include materialele, serviciile,
            manopera și iluminarea calculate. Rămâne de calibrat pe costurile reale de
            atelier.
            {lightingUnavailableReason(confirmed.aggregate)}
          </p>
          {confirmed.eic.lines.length === 0 ? (
            <p>Costul intern nu este disponibil pentru componentele necalculate.</p>
          ) : (
            eicGroups(confirmed.eic).map(([group, lines]) => (
              <div key={`cost-${group}`}>
                <h4>{eicLineGroupLabel(group)}</h4>
                <ul>
                  {lines.map((line) => (
                    <li key={`${line.resourceId}-cost`}>
                      {line.label}: {formatQuantity(line.quantity)} {formatUnit(line.unit)} ×{" "}
                      {formatMoney(line.rate)} {line.currency}/{formatUnit(line.unit)} ={" "}
                      {formatMoney(line.cost)} {line.currency}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
          {confirmed.eic.lines.length > 0 ? (
            <p>
              Total cost intern estimat: {formatMoney(confirmed.eic.total)}{" "}
              {confirmed.eic.currency}
            </p>
          ) : null}
          {confirmed.eic.excludedComponentLabels.length > 0 ? (
            <p>
              Neincluse încă în costul intern pilot:{" "}
              {confirmed.eic.excludedComponentLabels.join(", ")}.
            </p>
          ) : null}
          <p className="page-lead">
            Indisponibil acum: {confirmed.aggregate.unavailable.join(", ")}.
          </p>
          <div className="action-row">
            <button
              type="button"
              onClick={() => {
                setConfirmed(null);
                setDefinition(null);
              }}
            >
              Modifică configurația
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
