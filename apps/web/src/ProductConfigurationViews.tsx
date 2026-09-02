import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  commercialCompletenessLabel,
  commercialPrimaryActionLabel,
  eicLineGroupLabel,
  providerRequirementLabel,
  quoteDocumentReference,
  type AcceptedProductionSnapshot,
  type CommercialExperienceProjection,
  type CommercialPriceProjection,
  type Customer,
  type EicLine,
  type EicLineGroup,
  type EicResult,
  type ExecutionPlanPreview,
  type FormSchema,
  type ProductAggregate,
  type ProductDefinition,
  type ProductIdentityFact,
  type ProductTemplate,
  type ProductTruth,
  type OrderSnapshot,
  type QuoteAcceptanceDecision,
  type QuoteSnapshot,
  SERVICE_QUOTE_FREEZE_NOT_AUTHORIZED_REASON,
  SERVICE_QUOTE_NOT_ACCEPTABLE_REASON,
  SITE_INSTALLATION_FREEZE_REASON,
  type LiveJobCommercial,
  type SiteInstallationOperatorView,
} from "@workos-final/domain";
import {
  formatCostCompleteness,
  formatMoney,
  formatQuantity,
  formatUnit,
} from "./formatDisplay";
import { ClientLink } from "./ClientLink";
import { quoteDocumentUrl } from "./productApi";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";
import { StatusChip } from "./ui/StatusChip";

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

function measurementCopy(measurement: {
  value: number;
  unit: string;
  label?: string;
}): string {
  const unitLabel = measurement.unit === "mm2" ? "mm²" : "mm";
  const introduced = measurement.unit === "mm2" ? "introdusă" : "introdus";
  if (measurement.label) {
    return `${measurement.label}: ${measurement.value} ${unitLabel} (${introduced} de operator)`;
  }
  if (measurement.unit === "mm2") {
    return `Suprafață confirmată: ${measurement.value} mm² (introdusă de operator)`;
  }
  return `Perimetru confirmat: ${measurement.value} mm (introdus de operator)`;
}

export function ConstructionFacts({ facts }: { facts: readonly ProductIdentityFact[] }) {
  if (facts.length === 0) {
    return null;
  }
  return (
    <section className="form-section construction-facts-card">
      <h2>Fapte fixe</h2>
      <dl className="construction-facts">
        <dt>Construcție</dt>
        {facts.map((fact) => (
          <dd key={fact.id}>
            {fact.label}: {fact.value}
          </dd>
        ))}
      </dl>
    </section>
  );
}

export function ConfiguratorSummary({
  statusLabel,
  requestLabel,
  facts,
  priceLabel,
  catalogHref,
  children,
}: {
  statusLabel: string;
  requestLabel?: string | null;
  facts: readonly string[];
  priceLabel?: string | null;
  catalogHref: string;
  children?: ReactNode;
}) {
  return (
    <aside className="configurator-summary" aria-label="Rezumat">
      <h2>Rezumat</h2>
      <p className="configurator-summary-status">{statusLabel}</p>
      {requestLabel ? <p>{requestLabel}</p> : null}
      {facts.length > 0 ? (
        <ul>
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      ) : (
        <p>Completează câmpurile din stânga. Prețul apare după confirmare.</p>
      )}
      {priceLabel ? <p className="commercial-gross">{priceLabel}</p> : (
        <p>Preț client neconfirmat.</p>
      )}
      {children ? <div className="configurator-summary-actions">{children}</div> : null}
      <Link className="button-quiet" to={catalogHref}>
        Înapoi la Catalog
      </Link>
    </aside>
  );
}

export function ReadinessNotice({ definition }: { definition: ProductDefinition }) {
  return (
    <Notice tone="warn" compact>
      <p>
        Probleme de rezolvat: {definition.missing.length}
      </p>
      <p>Mai sunt informații de completat.</p>
      <ul>
        {definition.missing.map((item) => (
          <li key={item.fieldId}>{item.label}</li>
        ))}
      </ul>
    </Notice>
  );
}

export function ReviewPanel({
  template,
  formSchema,
  definition,
  busy,
  onConfirm,
  onEdit,
}: {
  template: ProductTemplate;
  formSchema: FormSchema;
  definition: ProductDefinition;
  busy: boolean;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <section className="result-section">
      <h2>Configurație pregătită pentru confirmare</h2>
      <p>Revizuiți configurația. Nu mai editați formularul în acest pas.</p>
      <p>Produs: {template.label}</p>
      <p>
        Componente active:{" "}
        {template.components
          .filter((component) => definition.selectedComponentIds.includes(component.id))
          .map((component) => component.label)
          .join(", ")}
      </p>
      <ul className="review-facts">
        {formSchema.sections
          .flatMap((section) => section.fields)
          .filter(
            (field) =>
              definition.values[field.id] !== undefined && field.type !== "boolean",
          )
          .map((field) => {
            const raw = definition.values[field.id];
            const label =
              field.options?.find((option) => option.value === raw)?.label ?? String(raw);
            return (
              <li key={field.id}>
                {field.label}: {label}
              </li>
            );
          })}
      </ul>
      {definition.measurements.length > 0 ? (
        <p className="page-lead">
          Măsurătorile de mai sus sunt introduse de operator. Nu sunt geometrie
          calculată de WorkOS.
        </p>
      ) : null}
      <div className="action-row">
        <button type="button" onClick={onConfirm} disabled={busy}>
          Confirmă configurația
        </button>
        <button type="button" className="button-secondary" onClick={onEdit}>
          Modifică configurația
        </button>
      </div>
    </section>
  );
}

export function ConfirmedSummary({
  aggregate,
  truth,
}: {
  aggregate: ProductAggregate;
  truth: ProductTruth;
}) {
  return (
    <section className="result-section">
      <div className="confirmed-head">
        <h2>Configurație confirmată</h2>
        <p className="confirmed-inscription">{aggregate.inscription}</p>
      </div>
      <div className="confirmed-components">
        {aggregate.components
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
      </div>
      {truth.measurements.map((measurement) => (
        <p key={measurement.fieldId}>
          {measurementCopy(measurement)}
        </p>
      ))}
      {aggregate.quantities.length === 0 ? (
        <p>Cantitatea tehnică nu poate fi calculată fără măsurătoare confirmată.</p>
      ) : (
        <ul className="metric-row">
          {aggregate.quantities.map((quantity) => (
            <li key={quantity.id}>
              {quantity.label}: {formatQuantity(quantity.value)} {formatUnit(quantity.unit)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function EicSection({
  eic,
  aggregate,
}: {
  eic: EicResult;
  aggregate: ProductAggregate;
}) {
  const groups = eicGroups(eic);
  return (
    <section className="result-section eic-section">
      <div className="eic-summary">
        <h3>Cost intern estimat</h3>
        {eic.completeness === "PARTIAL" ? (
          <StatusChip label="Parțial" tone="warn" />
        ) : (
          <StatusChip label="Complet" tone="ok" />
        )}
      </div>
      {eic.lines.length > 0 ? (
        <p>
          Total cost intern estimat: {formatMoney(eic.total)} {eic.currency}
        </p>
      ) : (
        <p>Costul intern nu este disponibil pentru componentele necalculate.</p>
      )}
      {eic.geometryLabel ? <p className="page-lead">{eic.geometryLabel}.</p> : null}
      {eic.completeness === "PARTIAL" ? (
        <p className="page-lead">
          Costul intern rămâne parțial
          {eic.completenessReasons.length > 0
            ? `: ${eic.completenessReasons.join("; ")}`
            : ""}
          .
          {lightingUnavailableReason(aggregate)}
        </p>
      ) : null}
      {eic.excludedComponentLabels.length > 0 ? (
        <p>
          Neincluse încă în costul intern pilot: {eic.excludedComponentLabels.join(", ")}.
        </p>
      ) : null}
      {aggregate.unavailable.length > 0 ? (
        <p className="page-lead">Indisponibil acum: {aggregate.unavailable.join(", ")}.</p>
      ) : null}
      {groups.length > 0 ? (
        <div className="resource-groups">
          {groups.map(([group, lines]) => (
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
          ))}
        </div>
      ) : (
        <p>Nu există încă o cerere de resurse pentru acest produs.</p>
      )}
      {groups.length > 0 ? (
        <details className="calc-details">
          <summary>Detalii cost intern</summary>
          {groups.map(([group, lines]) => (
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
          ))}
        </details>
      ) : null}
    </section>
  );
}

export function CommercialProgress({
  experience,
}: {
  experience: CommercialExperienceProjection;
}) {
  return (
    <ol className="commercial-progress">
      {experience.milestones.map((milestone) => (
        <li key={milestone.id} data-state={milestone.state}>
          <span>{milestone.state === "complete" ? "✓" : milestone.state === "current" ? "●" : "○"}</span>
          {milestone.label}
        </li>
      ))}
    </ol>
  );
}

export function CommercialPriceSection({
  price,
}: {
  price: CommercialPriceProjection;
}) {
  const statusLabel = commercialCompletenessLabel(price.completeness);
  const statusTone = price.completeness === "COMPLETE" ? "ok" : "warn";
  return (
    <section className="result-section commercial-section">
      <div className="commercial-summary">
        <h3>Preț client</h3>
        <StatusChip label={statusLabel} tone={statusTone} />
      </div>
      {price.completeness === "COMPLETE" &&
      price.netPrice !== null &&
      price.vatAmount !== null &&
      price.grossPrice !== null ? (
        <>
          <p className="commercial-gross">
            Preț final client: {formatMoney(price.grossPrice)} {price.currency}
          </p>
          <details className="calc-details">
            <summary>Detalii preț</summary>
            <dl className="commercial-breakdown">
              <div>
                <dt>Subtotal</dt>
                <dd>
                  {formatMoney(price.netPrice)} {price.currency}
                </dd>
              </div>
              <div>
                <dt>TVA</dt>
                <dd>
                  {price.vatPercent}% · {formatMoney(price.vatAmount)} {price.currency}
                </dd>
              </div>
            </dl>
          </details>
        </>
      ) : (
        <>
          <p>Parțial / indisponibil pentru finalizare</p>
          {price.unavailableReasons.length > 0 ? (
            <p className="page-lead">{price.unavailableReasons.join(" ")}</p>
          ) : null}
        </>
      )}
    </section>
  );
}

function QuoteDocumentDownloadLink({ snapshot }: { snapshot: QuoteSnapshot }) {
  return (
    <a
      className="button-link"
      href={quoteDocumentUrl(snapshot.productCode, snapshot.quoteSnapshotId)}
    >
      Descarcă oferta PDF
    </a>
  );
}

function FrozenCustomerLine({
  customer,
}: {
  customer?: { customerId: string; displayName: string };
}) {
  if (!customer?.displayName) {
    return null;
  }
  return (
    <p>
      <ClientLink customerId={customer.customerId} displayName={customer.displayName} />
    </p>
  );
}

function CustomerSelectionFields({
  customers,
  selectedCustomerId,
  busy,
  onSelectCustomer,
  onCreateCustomer,
}: {
  customers: readonly Customer[];
  selectedCustomerId: string;
  busy: boolean;
  onSelectCustomer: (customerId: string) => void;
  onCreateCustomer: (displayName: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const active = customers.filter((customer) => customer.status === "ACTIVE");

  async function submitNewCustomer(displayName: string) {
    await onCreateCustomer(displayName);
    setName("");
  }
  return (
    <div className="customer-select">
      <Field label="Client">
        <select
          value={selectedCustomerId}
          disabled={busy}
          onChange={(event) => onSelectCustomer(event.target.value)}
        >
          <option value="">Alege clientul</option>
          {active.map((customer) => (
            <option key={customer.customerId} value={customer.customerId}>
              {customer.displayName}
            </option>
          ))}
        </select>
      </Field>
      <form
        className="people-create"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = name.trim();
          if (trimmed.length === 0) {
            return;
          }
          void submitNewCustomer(trimmed);
        }}
      >
        <Field label="Nume client">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={busy}
          />
        </Field>
        <button type="submit" disabled={busy || name.trim().length === 0}>
          Adaugă client
        </button>
      </form>
    </div>
  );
}

export function QuoteSnapshotSection({
  price,
  snapshot,
  acceptance,
  order,
  reused,
  busy,
  customers = [],
  selectedCustomerId = "",
  onSelectCustomer,
  onCreateCustomer,
  onFreeze,
  onAccept,
  onCreateOrder,
  installationScope = null,
  jobCommercial = null,
}: {
  price?: CommercialPriceProjection;
  snapshot?: QuoteSnapshot;
  acceptance?: QuoteAcceptanceDecision;
  order?: OrderSnapshot;
  reused: boolean;
  busy: boolean;
  customers?: readonly Customer[];
  selectedCustomerId?: string;
  onSelectCustomer?: (customerId: string) => void;
  onCreateCustomer?: (displayName: string) => Promise<void>;
  onFreeze: () => void;
  onAccept: () => void;
  onCreateOrder: () => void;
  installationScope?: SiteInstallationOperatorView | null;
  jobCommercial?: LiveJobCommercial | null;
}) {
  if (snapshot && acceptance) {
    return (
      <section className="result-section quote-section">
        <div className="commercial-summary">
          <h3>Ofertă acceptată</h3>
          <StatusChip label="Acceptată" tone="ok" />
        </div>
        <QuoteJobPrice snapshot={snapshot} />
        <FrozenCustomerLine customer={snapshot.customer} />
        <p>
          {snapshot.contentHash ? `${quoteDocumentReference(snapshot.contentHash)} · ` : null}
          {new Date(acceptance.acceptedAt).toLocaleDateString("ro-RO")}
        </p>
        {order ? null : snapshot.schemaVersion === 2 ? (
          <p className="page-lead">
            Oferta cu montaj nu poate fi transformată în comandă în această etapă.
          </p>
        ) : (
          <p className="page-lead">Următorul pas: creează comanda.</p>
        )}
        <div className="action-row">
          {order || snapshot.schemaVersion === 2 ? null : (
            <button type="button" onClick={onCreateOrder} disabled={busy}>
              {commercialPrimaryActionLabel("CREATE_ORDER")}
            </button>
          )}
          <QuoteDocumentDownloadLink snapshot={snapshot} />
        </div>
      </section>
    );
  }

  if (snapshot) {
    return (
      <section className="result-section quote-section">
        <div className="commercial-summary">
          <h3>Ofertă creată</h3>
          <StatusChip label="Creată" tone="ok" />
        </div>
        {reused ? <p className="page-lead">Oferta era deja creată pentru această configurație.</p> : null}
        <QuoteJobPrice snapshot={snapshot} />
        <FrozenCustomerLine customer={snapshot.customer} />
        <p>
          {snapshot.contentHash ? `${quoteDocumentReference(snapshot.contentHash)} · ` : null}
          {new Date(snapshot.createdAt).toLocaleDateString("ro-RO")}
        </p>
        <p className="page-lead">Oferta a fost salvată. Modificările ulterioare nu schimbă această ofertă.</p>
        {snapshot.schemaVersion === 2 ? (
          <p className="page-lead">{SERVICE_QUOTE_NOT_ACCEPTABLE_REASON}</p>
        ) : null}
        <div className="action-row">
          <Link
            className="button-link"
            to={{ pathname: `/quotes/${encodeURIComponent(snapshot.quoteSnapshotId)}` }}
          >
            Inspectează oferta
          </Link>
          {snapshot.schemaVersion === 2 ? null : (
            <QuoteDocumentDownloadLink snapshot={snapshot} />
          )}
          {snapshot.schemaVersion === 2 ? null : (
            <button type="button" className="button-secondary" onClick={onAccept} disabled={busy}>
              {commercialPrimaryActionLabel("ACCEPT_QUOTE")}
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!price || price.completeness !== "COMPLETE") {
    return (
      <section className="result-section quote-section">
        <h3>Ofertă</h3>
        <p>
          {price?.internalCostCompleteness === "COMPLETE"
            ? "Prețul clientului nu poate fi calculat."
            : "Costul intern nu este complet."}
        </p>
      </section>
    );
  }

  const installationReady = !installationScope || jobCommercial !== null;
  const serviceInclusivePreview = Boolean(installationScope && jobCommercial);

  return (
    <section className="result-section quote-section">
      <h3>Ofertă</h3>
      {installationScope && jobCommercial ? (
        <div className="commercial-job-preview">
          <p>
            Produs: {formatMoney(price.grossPrice ?? 0)} {price.currency}
          </p>
          <p>
            {installationScope.label}: {formatMoney(installationScope.commercialGrossPrice ?? 0)}{" "}
            {price.currency}
          </p>
          <p className="commercial-gross">
            Preț final client: {formatMoney(jobCommercial.grossPrice)} {jobCommercial.currency}
          </p>
        </div>
      ) : (
        <p className="commercial-gross">
          Preț final client: {formatMoney(price.grossPrice ?? 0)} {price.currency}
        </p>
      )}
      {onSelectCustomer && onCreateCustomer ? (
        <CustomerSelectionFields
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          busy={busy}
          onSelectCustomer={onSelectCustomer}
          onCreateCustomer={onCreateCustomer}
        />
      ) : null}
      {!selectedCustomerId ? <p className="page-lead">Selectează clientul.</p> : null}
      <div className="action-row">
        <button
          type="button"
          onClick={onFreeze}
          disabled={busy || !selectedCustomerId || !installationReady || serviceInclusivePreview}
        >
          {commercialPrimaryActionLabel("CREATE_QUOTE")}
        </button>
        {serviceInclusivePreview ? (
          <p className="page-lead">{SERVICE_QUOTE_FREEZE_NOT_AUTHORIZED_REASON}</p>
        ) : installationScope && !installationReady ? (
          <p className="page-lead">{SITE_INSTALLATION_FREEZE_REASON}</p>
        ) : null}
      </div>
    </section>
  );
}

function QuoteJobPrice({ snapshot }: { snapshot: QuoteSnapshot }) {
  const job = snapshot.jobCommercial;
  if (job && snapshot.lines && snapshot.lines.length > 0) {
    return (
      <div className="commercial-job-preview">
        {snapshot.lines.map((line) => (
          <p key={line.kind}>
            {line.label}: {formatMoney(line.commercial.grossPrice)} {line.commercial.currency}
          </p>
        ))}
        <p className="commercial-gross">
          Preț final: {formatMoney(job.grossPrice)} {job.currency}
        </p>
      </div>
    );
  }
  return (
    <p className="commercial-gross">
      Preț final: {formatMoney(snapshot.commercial.grossPrice)} {snapshot.commercial.currency}
    </p>
  );
}

export function InstallationScopeSection({
  scope,
}: {
  scope: SiteInstallationOperatorView;
}) {
  return (
    <section className="result-section installation-scope-section">
      <div className="commercial-summary">
        <h3>{scope.label}</h3>
        <StatusChip
          label={commercialCompletenessLabel(scope.commercialCompleteness)}
          tone={scope.commercialCompleteness === "COMPLETE" ? "ok" : "warn"}
        />
      </div>
      {scope.commercialCompleteness === "COMPLETE" && scope.commercialGrossPrice != null ? (
        <p>
          Preț montaj: {formatMoney(scope.commercialGrossPrice)} EUR
        </p>
      ) : null}
      {scope.incompleteReasons.length > 0 ? (
        <ul>
          {scope.incompleteReasons.map((reason) => (
            <li key={reason.id}>{reason.label}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function OrderSnapshotSection({
  snapshot,
  release,
  busy = false,
  onRelease,
}: {
  snapshot: OrderSnapshot;
  release?: AcceptedProductionSnapshot;
  busy?: boolean;
  onRelease?: () => void;
}) {
  const released = Boolean(release);
  return (
    <section className="result-section order-section">
      <div className="commercial-summary">
        <h3>Comandă creată</h3>
        <StatusChip label={released ? "Eliberată" : "Creată"} tone="ok" />
      </div>
      <p className="commercial-gross">
        Preț final: {formatMoney(snapshot.commercial.grossPrice)} {snapshot.commercial.currency}
      </p>
      <FrozenCustomerLine customer={snapshot.customer} />
      <p>{new Date(snapshot.createdAt).toLocaleDateString("ro-RO")}</p>
      {released ? (
        <p className="page-lead">Eliberată pentru producție.</p>
      ) : (
        <>
          <p className="page-lead">Comanda nu a fost încă eliberată pentru producție.</p>
          {onRelease ? (
            <div className="action-row">
              <button type="button" onClick={onRelease} disabled={busy}>
                Eliberează pentru producție
              </button>
            </div>
          ) : null}
        </>
      )}
      <details className="snapshot-details">
        <summary>Detalii</summary>
        <ul>
          <li>Referință comandă: {snapshot.orderSnapshotId}</li>
          <li>Ofertă sursă: {snapshot.sourceQuoteSnapshotId}</li>
          <li>Produs: {snapshot.productLabel}</li>
          <li>Stare: Înghețată</li>
        </ul>
      </details>
    </section>
  );
}

export function ProductionPreviewSection({
  preview,
  basedOnSnapshot,
  commercial = false,
}: {
  preview: ExecutionPlanPreview;
  basedOnSnapshot: boolean;
  commercial?: boolean;
}) {
  return (
    <div className="production-plan">
      <h3>Previzualizare producție</h3>
      <p className="page-lead">Estimare orientativă — nu este planul de execuție.</p>
      {basedOnSnapshot ? (
        <p>
          {commercial
            ? "Aliniată la eliberarea comenzii, nu la planul persistat."
            : "Aliniată la acceptarea de atelier, nu la planul persistat."}
        </p>
      ) : null}
      <p>
        {preview.summary.productLabel}: {preview.summary.inscription}
      </p>
      <ul className="metric-row">
        <li>Operații: {preview.summary.operationCount}</li>
        <li>Pregătite: {preview.summary.readyCount}</li>
        <li>Incomplete: {preview.summary.incompleteCount}</li>
        <li>Fără furnizor: {preview.summary.noProviderCount}</li>
        {"internalCostTotal" in preview.summary &&
        preview.summary.internalCostTotal !== undefined ? (
          <li>
            Cost intern curent: {formatMoney(preview.summary.internalCostTotal)}{" "}
            {preview.summary.internalCostCurrency}
            {formatCostCompleteness(preview.summary.internalCostCompleteness)}
          </li>
        ) : null}
      </ul>
      {preview.summary.analyzerNote ? (
        <p className="page-lead">{preview.summary.analyzerNote}</p>
      ) : null}
      <ol className="production-ops">
        {preview.operations.map((operation) => (
          <li key={operation.id} className="production-op preview-op">
            <div className="task-row-main">
              <p className="task-seq">{operation.seqLabel}</p>
              <div className="task-identity">
                <h4>
                  {operation.seqLabel}. {operation.processLabel}
                </h4>
                <p>Componentă: {operation.scopeLabel}</p>
              </div>
              <p className="task-status status-chip status-chip-neutral">
                Stare: {operation.readinessLabel}
              </p>
            </div>
            {operation.quantities.map((quantity) => (
              <p key={`${operation.id}-${quantity.label}`}>
                Cantitate: {formatQuantity(quantity.value)} {formatUnit(quantity.unit)}
              </p>
            ))}
            {operation.resources.map((resource) => (
              <p key={`${operation.id}-${resource.label}`}>
                Resursă: {resource.label}: {formatQuantity(resource.quantity)}{" "}
                {formatUnit(resource.unit)}
              </p>
            ))}
            <p>Capabilitate: {operation.requiredCapabilityLabel}</p>
            <p>
              {operation.providerRequirement === "NOT_REQUIRED"
                ? providerRequirementLabel("NOT_REQUIRED")
                : `Furnizori disponibili: ${
                    operation.eligibleProviders.length === 0
                      ? "Fără furnizor configurat"
                      : operation.eligibleProviders.map((item) => item.label).join("; ")
                  }`}
            </p>
            <p>
              {operation.canStart
                ? "Poate începe"
                : `Depinde de: ${operation.dependsOnLabels.join("; ")}`}
            </p>
            {operation.parallelEligible ? <p>Poate rula în paralel</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AcceptedSnapshotSection({
  snapshot,
  reused,
  onCreatePlan,
  busy,
  hasExecutionPlan,
}: {
  snapshot: AcceptedProductionSnapshot;
  reused: boolean;
  onCreatePlan: () => void;
  busy: boolean;
  hasExecutionPlan: boolean;
}) {
  const commercial = snapshot.releaseSource === "ORDER" || Boolean(snapshot.sourceOrderSnapshotId);
  return (
    <div className="production-snapshot">
      <h3>
        {commercial
          ? reused
            ? "Deja eliberată pentru producție"
            : "Eliberată pentru producție"
          : reused
            ? "Deja acceptat pentru producție"
            : "Acceptat pentru producție"}
      </h3>
      {hasExecutionPlan ? (
        <p className="page-lead">Plan de execuție creat.</p>
      ) : (
        <p className="page-lead">
          {commercial
            ? "Următorul pas: creează planul de execuție pentru atelier."
            : "Următorul pas: creează planul de execuție de atelier."}
        </p>
      )}
      <ul className="metric-row">
        <li>Operații: {snapshot.operations.length}</li>
        {snapshot.eic ? (
          <li>
            Cost intern curent: {formatMoney(snapshot.eic.total)} {snapshot.eic.currency}
            {formatCostCompleteness(snapshot.eic.completeness)}
          </li>
        ) : null}
        <li>Înghețat la: {new Date(snapshot.createdAt).toLocaleString("ro-RO")}</li>
        <li>Stare: Acceptat / înghețat</li>
      </ul>
      {hasExecutionPlan ? null : (
        <div className="action-row">
          <button type="button" onClick={onCreatePlan} disabled={busy}>
            Creează planul de execuție
          </button>
        </div>
      )}
      <details className="snapshot-details">
        <summary>Detalii</summary>
        <ul>
          <li>Referință: {snapshot.snapshotId}</li>
          <li>Produs: {snapshot.productLabel}</li>
          <li>Acceptat: {new Date(snapshot.createdAt).toLocaleString("ro-RO")}</li>
        </ul>
      </details>
    </div>
  );
}
