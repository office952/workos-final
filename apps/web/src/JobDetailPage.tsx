import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { formatCustomerMoneyAmount, jobConfiguratorHref } from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { fetchJobDetail, type JobDetailResponse } from "./jobsApi";
import { EmptyState } from "./ui/EmptyState";
import { Notice } from "./ui/Notice";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "ready"; detail: JobDetailResponse };

function money(value: unknown): string | null {
  return typeof value === "number" ? formatCustomerMoneyAmount(value) : null;
}

function textValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function JobDetailPage() {
  const { jobId = "" } = useParams();
  const location = useLocation();
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    document.getElementById("continut-principal")?.focus();
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void fetchJobDetail(jobId)
      .then((result) => {
        if (cancelled) {
          return;
        }
        if (!result.ok) {
          setPage({ kind: result.reason === "unavailable" ? "error" : result.reason });
          return;
        }
        setPage({ kind: "ready", detail: result.detail });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (page.kind === "loading") {
    return (
      <article className="decision-workspace">
        <p>Se încarcă lucrarea…</p>
      </article>
    );
  }
  if (page.kind === "not_found") {
    return (
      <article className="decision-workspace">
        <EmptyState title="Lucrarea nu a fost găsită." />
      </article>
    );
  }
  if (page.kind === "forbidden") {
    return (
      <article className="decision-workspace">
        <Notice tone="warn">Nu ai acces la această lucrare.</Notice>
      </article>
    );
  }
  if (page.kind === "error") {
    return (
      <article className="decision-workspace">
        <Notice tone="warn">Lucrarea nu a putut fi încărcată.</Notice>
      </article>
    );
  }

  const { job, order, quote, request, execution } = page.detail;
  const commercial = (order.commercial ?? {}) as Record<string, unknown>;
  const truth = (order.truth ?? {}) as Record<string, unknown>;
  const values = (truth.values ?? {}) as Record<string, unknown>;
  const inscription = job.inscription;
  const depthMm = textValue(values["volume.depthMm"]);
  const planView = (execution?.view ?? null) as {
    plan?: { eicTotal?: number };
    actualInternalCost?: { calculableTotal?: number | null; statusLabel?: string };
  } | null;
  const configuratorHref = jobConfiguratorHref({
    productCode: job.productCode,
    orderSnapshotId: job.orderSnapshotId,
  });
  const blocked = Boolean(execution?.blocked || (job.needsAttention && execution));
  const recovered = Boolean(execution && !execution.blocked && !job.needsAttention);
  const progressValue =
    job.taskCount !== null
      ? `${job.completedCount ?? 0} din ${job.taskCount}`
      : job.progressLabel;
  const identityRefs = [request?.reference, quote.reference].filter(
    (part): part is string => Boolean(part),
  );
  const openExecution =
    execution?.href &&
    (job.nextAction === "OPEN_EXECUTION" ||
      job.nextAction === "CONTINUE_EXECUTION" ||
      job.nextAction === "VIEW_COMPLETED")
      ? { to: execution.href, label: "Deschide execuția" }
      : null;
  const continueConfigurator =
    !openExecution && job.nextAction !== "OPEN_EXECUTION"
      ? { to: configuratorHref, label: job.nextActionLabel }
      : null;
  const statusTone = job.stage === "EXECUTION_COMPLETED" ? "ok" : blocked ? "warn" : "progress";

  return (
    <article className="decision-workspace">
      <header className="decision-header">
        <div className="decision-title-row">
          <h1>{inscription}</h1>
          <StatusChip
            label={blocked ? (execution?.attentionLabel ?? job.attentionLabel ?? job.stageLabel) : job.stageLabel}
            tone={statusTone}
          />
        </div>
        <p className="decision-identity">
          {job.customerId && job.customerDisplayName ? (
            <ClientLink customerId={job.customerId} displayName={job.customerDisplayName} />
          ) : (
            "Fără client"
          )}
          {identityRefs.length > 0 ? ` · ${identityRefs.join(" · ")}` : null}
        </p>
        <p className="decision-next">
          {`Următorul pas: ${job.nextActionLabel}.`}
        </p>
      </header>
      <div className="decision-grid">
        <div className="decision-stack">
          <section className="decision-card" aria-labelledby="job-config">
            <h2 id="job-config">Configurație</h2>
            <dl className="decision-fields">
              <Field label="Produs">{job.productLabel}</Field>
              <Field label="Text">{inscription}</Field>
              {depthMm ? <Field label="Adâncime">{depthMm} mm</Field> : null}
            </dl>
            <p className="decision-links">
              <Link to={configuratorHref}>Deschide configuratorul</Link>
            </p>
          </section>
          <section className="decision-card" aria-labelledby="job-progress">
            <h2 id="job-progress">Progres operații</h2>
            {progressValue ? (
              <p className="decision-progress-value">{progressValue}</p>
            ) : (
              <p>Nicio operație pornită.</p>
            )}
            {job.taskCount !== null ? (
              <p className="decision-progress-meta">
                {job.completedCount ?? 0} finalizate · {job.inProgressCount ?? 0} în lucru
              </p>
            ) : null}
          </section>
        </div>
        <div className="decision-stack">
          {blocked ? (
            <section className="decision-card decision-card-blocked" aria-labelledby="job-block">
              <h2 id="job-block">Blocaj</h2>
              <p>{execution?.attentionLabel ?? job.attentionLabel}</p>
            </section>
          ) : recovered ? (
            <section className="decision-card" aria-labelledby="job-ready">
              <h2 id="job-ready">Stare</h2>
              <p>{job.stageLabel}. Aceeași lucrare, fără blocaj curent.</p>
            </section>
          ) : job.needsAttention && job.attentionLabel ? (
            <section className="decision-card decision-card-blocked" aria-labelledby="job-attention">
              <h2 id="job-attention">Următorul pas</h2>
              <p>{job.attentionLabel}</p>
            </section>
          ) : null}
          <section className="decision-card" aria-labelledby="job-links">
            <h2 id="job-links">Legături</h2>
            <div className="decision-links">
              {request ? (
                <Link to={request.href}>
                  Cerere{request.reference ? ` ${request.reference}` : ""}
                </Link>
              ) : null}
              <Link to={quote.href}>Ofertă{quote.reference ? ` ${quote.reference}` : ""}</Link>
              {execution?.href ? <Link to={execution.href}>Plan de execuție</Link> : null}
            </div>
          </section>
        </div>
      </div>
      <section className="decision-card decision-span" aria-labelledby="job-plan">
        <h2 id="job-plan">Plan</h2>
        {execution && job.taskCount !== null ? (
          <p>
            {job.taskCount} operații · {job.completedCount ?? 0} finalizate ·{" "}
            {job.inProgressCount ?? 0} în lucru
          </p>
        ) : execution ? (
          <p>
            {[execution.statusLabel, job.progressLabel, execution.progressLabel]
              .filter((part, index, all) => part && all.indexOf(part) === index)
              .join(" · ")}
          </p>
        ) : (
          <p>Fără plan de execuție încă.</p>
        )}
        {planView?.plan && typeof planView.plan.eicTotal === "number" ? (
          <dl className="decision-fields">
            <Field label="Planificat versus real">
              Cost intern planificat: {money(planView.plan.eicTotal)}
              {planView.actualInternalCost
                ? ` · Cost intern real: ${
                    money(planView.actualInternalCost.calculableTotal) ??
                    planView.actualInternalCost.statusLabel ??
                    "—"
                  }`
                : ""}
            </Field>
          </dl>
        ) : null}
      </section>
      <section className="decision-card decision-money" aria-labelledby="job-money">
        <h2 id="job-money">Preț client</h2>
        {money(commercial.grossPrice) ? (
          <dl className="decision-money-fields">
            {money(commercial.netPrice) ? <Field label="Net">{money(commercial.netPrice)}</Field> : null}
            {typeof commercial.vatPercent === "number" ? (
              <Field label="TVA">TVA {commercial.vatPercent}%</Field>
            ) : null}
            <Field label="Brut">
              <span className="commercial-gross">Brut: {money(commercial.grossPrice)}</span>
            </Field>
            {typeof commercial.internalCost === "number" ? (
              <Field label="Cost intern">Cost intern: {money(commercial.internalCost)}</Field>
            ) : null}
            {typeof commercial.markupPercent === "number" ? (
              <Field label="Adaos">Adaos: {commercial.markupPercent}%</Field>
            ) : null}
            {typeof commercial.marginAmount === "number" ? (
              <Field label="Marjă">{money(commercial.marginAmount)}</Field>
            ) : null}
          </dl>
        ) : (
          <p>Prețul clientului nu este disponibil pe acest ecran.</p>
        )}
      </section>
      <p className="decision-actions">
        {openExecution ? (
          <Link className="button-link" to={openExecution.to}>
            {openExecution.label}
          </Link>
        ) : continueConfigurator ? (
          <Link className="button-link" to={continueConfigurator.to}>
            {continueConfigurator.label}
          </Link>
        ) : null}
        <Link className="button-link button-secondary" to="/">
          Înapoi la Lucrări
        </Link>
      </p>
    </article>
  );
}
