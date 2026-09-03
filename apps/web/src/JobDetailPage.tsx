import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { appLocation } from "./navigation/routePath";
import { usePathIdAfter } from "./navigation/usePathIdAfter";
import { formatCustomerMoneyAmount, jobConfiguratorHref } from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { fetchJobDetail, type JobDetailResponse } from "./jobsApi";
import { EmptyState } from "./ui/EmptyState";
import { PageStatus } from "./ui/PageStatus";
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

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function JobDetailPage() {
  const jobId = usePathIdAfter("/jobs/");
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
    return <PageStatus kind="loading">Se încarcă lucrarea…</PageStatus>;
  }
  if (page.kind === "not_found") {
    return <EmptyState title="Lucrarea nu a fost găsită." />;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la această lucrare.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Lucrarea nu a putut fi încărcată.</PageStatus>;
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
    <section className="request-object">
      <Link className="client-object-back" to="/jobs" aria-label="Înapoi la Lucrări">
        <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Înapoi la Lucrări
      </Link>

      <header className="client-object-header">
        <div className="client-object-titles">
          <h1>{inscription}</h1>
          <p className="client-object-identity">
            {job.customerId && job.customerDisplayName ? (
              <ClientLink customerId={job.customerId} displayName={job.customerDisplayName} />
            ) : (
              "Fără client"
            )}
            {identityRefs.length > 0 ? ` · ${identityRefs.join(" · ")}` : null}
          </p>
          <p className="client-object-identity">{`Următorul pas: ${job.nextActionLabel}.`}</p>
          <StatusChip
            label={
              blocked
                ? (execution?.attentionLabel ?? job.attentionLabel ?? job.stageLabel)
                : job.stageLabel
            }
            tone={statusTone}
          />
        </div>
        <div className="client-object-actions">
          {openExecution ? (
            <Link className="button-link" to={appLocation(openExecution.to)}>
              {openExecution.label}
            </Link>
          ) : continueConfigurator ? (
            <Link className="button-link" to={appLocation(continueConfigurator.to)}>
              {continueConfigurator.label}
            </Link>
          ) : null}
        </div>
      </header>

      {blocked ? (
        <section className="request-section" aria-labelledby="job-block">
          <h2 id="job-block">Blocaj</h2>
          <p>{execution?.attentionLabel ?? job.attentionLabel}</p>
        </section>
      ) : recovered ? (
        <section className="request-section" aria-labelledby="job-ready">
          <h2 id="job-ready">Stare</h2>
          <p>{job.stageLabel}. Aceeași lucrare, fără blocaj curent.</p>
        </section>
      ) : job.needsAttention && job.attentionLabel ? (
        <section className="request-section" aria-labelledby="job-attention">
          <h2 id="job-attention">Următorul pas</h2>
          <p>{job.attentionLabel}</p>
        </section>
      ) : null}

      <section className="request-section" aria-labelledby="job-config">
        <h2 id="job-config">Configurație</h2>
        <dl className="request-facts">
          <Fact label="Produs">{job.productLabel}</Fact>
          <Fact label="Text">{inscription}</Fact>
          {depthMm ? <Fact label="Adâncime">{depthMm} mm</Fact> : null}
        </dl>
        <p>
          <Link to={appLocation(configuratorHref)}>Deschide configuratorul</Link>
        </p>
      </section>

      <section className="request-section" aria-labelledby="job-progress">
        <h2 id="job-progress">Progres operații</h2>
        {progressValue ? <p>{progressValue}</p> : <p>Nicio operație pornită.</p>}
        {job.taskCount !== null ? (
          <p className="client-object-identity">
            {job.completedCount ?? 0} finalizate · {job.inProgressCount ?? 0} în lucru
          </p>
        ) : null}
      </section>

      <section className="request-section" aria-labelledby="job-links">
        <h2 id="job-links">Legături</h2>
        <ul className="request-related-list">
          {request ? (
            <li>
              <Link className="request-related-row" to={appLocation(request.href)}>
                <span>Cerere{request.reference ? ` ${request.reference}` : ""}</span>
              </Link>
            </li>
          ) : null}
          <li>
            <Link className="request-related-row" to={appLocation(quote.href)}>
              <span>Ofertă{quote.reference ? ` ${quote.reference}` : ""}</span>
            </Link>
          </li>
          {execution?.href ? (
            <li>
              <Link className="request-related-row" to={appLocation(execution.href)}>
                <span>Plan de execuție</span>
              </Link>
            </li>
          ) : null}
        </ul>
      </section>

      <section className="request-section" aria-labelledby="job-plan">
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
          <dl className="request-facts">
            <Fact label="Planificat versus real">
              Cost intern planificat: {money(planView.plan.eicTotal)}
              {planView.actualInternalCost
                ? ` · Cost intern real: ${
                    money(planView.actualInternalCost.calculableTotal) ??
                    planView.actualInternalCost.statusLabel ??
                    "—"
                  }`
                : ""}
            </Fact>
          </dl>
        ) : null}
      </section>

      <section className="request-section" aria-labelledby="job-money">
        <h2 id="job-money">Preț client</h2>
        {money(commercial.grossPrice) ? (
          <dl className="request-facts">
            {money(commercial.netPrice) ? <Fact label="Net">{money(commercial.netPrice)}</Fact> : null}
            {typeof commercial.vatPercent === "number" ? (
              <Fact label="TVA">TVA {commercial.vatPercent}%</Fact>
            ) : null}
            <Fact label="Brut">
              <span className="commercial-gross">Brut: {money(commercial.grossPrice)}</span>
            </Fact>
            {typeof commercial.internalCost === "number" ? (
              <Fact label="Cost intern">Cost intern: {money(commercial.internalCost)}</Fact>
            ) : null}
            {typeof commercial.markupPercent === "number" ? (
              <Fact label="Adaos">Adaos: {commercial.markupPercent}%</Fact>
            ) : null}
            {typeof commercial.marginAmount === "number" ? (
              <Fact label="Marjă">{money(commercial.marginAmount)}</Fact>
            ) : null}
          </dl>
        ) : (
          <p>Prețul clientului nu este disponibil pe acest ecran.</p>
        )}
      </section>
    </section>
  );
}
