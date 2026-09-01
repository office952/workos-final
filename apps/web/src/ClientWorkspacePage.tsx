import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePathIdAfter } from "./navigation/usePathIdAfter";
import {
  CUSTOMER_WORKSPACE_SECTIONS,
  customerHref,
  customerWorkspaceSectionLabel,
  type Customer,
  type CustomerWorkspaceProjection,
  type CustomerWorkspaceSection,
  type JobOverviewItem,
  type QuoteOverviewItem,
  type RequestOverviewItem,
} from "@workos-final/domain";
import {
  CustomerProfileFields,
  customerProfilePatchFromForm,
  emptyCustomerProfileForm,
  type CustomerProfileFormValue,
} from "./CustomerProfileFields";
import { fetchCustomerWorkspace, updateCustomer } from "./customerApi";
import { pageErrorKind } from "./fetchAccess";
import { quoteDocumentUrl } from "./productApi";
import { EmptyState } from "./ui/EmptyState";
import { MetricCard } from "./ui/MetricCard";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";

const SECTION_QUERY: Record<string, CustomerWorkspaceSection> = {
  prezentare: "OVERVIEW",
  cereri: "REQUESTS",
  oferte: "QUOTES",
  lucrari: "JOBS",
};

const SECTION_PATH: Record<CustomerWorkspaceSection, string> = {
  OVERVIEW: "prezentare",
  REQUESTS: "cereri",
  QUOTES: "oferte",
  JOBS: "lucrari",
};

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "missing" }
  | { kind: "ready"; workspace: CustomerWorkspaceProjection };

export function ClientWorkspacePage() {
  const customerId = usePathIdAfter("/clients/");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CustomerProfileFormValue>(emptyCustomerProfileForm());
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const section = sectionFromQuery(searchParams.get("section"));

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void fetchCustomerWorkspace(customerId)
      .then((workspace) => {
        if (cancelled) {
          return;
        }
        if (!workspace) {
          setPage({ kind: "missing" });
          return;
        }
        setDraft(formFromCustomer(workspace.customer));
        setPage({ kind: "ready", workspace });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPage({ kind: pageErrorKind(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă clientul…</PageStatus>;
  }
  if (page.kind === "missing") {
    return <PageStatus kind="missing">Clientul cerut nu este disponibil.</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la acest client.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Clientul nu a putut fi încărcat.</PageStatus>;
  }

  const { workspace } = page;
  const { customer } = workspace;

  async function handleSave() {
    setBusy(true);
    setNotice(null);
    try {
      const updated = await updateCustomer(
        customer.customerId,
        customerProfilePatchFromForm(draft),
      );
      const next = await fetchCustomerWorkspace(updated.customer.customerId);
      if (!next) {
        setPage({ kind: "missing" });
        return;
      }
      setDraft(formFromCustomer(next.customer));
      setEditing(false);
      setPage({ kind: "ready", workspace: next });
    } catch {
      setNotice("Datele clientului nu au putut fi salvate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="client-workspace">
      <PageHeader
        title={customer.displayName}
        lead={headerSummary(customer)}
        actions={
          <div className="client-header-actions">
            <button
              type="button"
              className="button-quiet"
              disabled={busy}
              onClick={() => {
                setEditing((current) => !current);
                setSearchParams({ section: "prezentare" });
              }}
            >
              {editing ? "Anulează editarea" : "Editează datele"}
            </button>
            {workspace.canCreateRequest ? (
              <Link
                className="button-link"
                to={`/requests?customer=${encodeURIComponent(customer.customerId)}`}
              >
                Cerere nouă
              </Link>
            ) : null}
          </div>
        }
        meta={
          <StatusChip
            label={workspace.statusLabel}
            tone={customer.status === "ACTIVE" ? "ok" : "neutral"}
          />
        }
      />
      {workspace.canCreateRequest ? null : (
        <p className="client-retired-note">
          Client retras. Istoricul rămâne vizibil.
        </p>
      )}
      <div className="metric-band">
        <MetricCard label="Cereri" value={workspace.summary.requestCount} />
        <MetricCard label="Oferte" value={workspace.summary.quoteCount} />
        <MetricCard label="Lucrări" value={workspace.summary.jobCount} />
      </div>

      {workspace.nextActions.length > 0 ? (
        <div className="client-next">
          <p>Următorul pas</p>
          <div className="client-next-actions">
            {workspace.nextActions.map((action) => (
              <Link key={`${action.href}-${action.label}`} to={action.href}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {notice ? <p>{notice}</p> : null}

      <nav className="client-sections" aria-label="Secțiuni client">
        {CUSTOMER_WORKSPACE_SECTIONS.map((item) => (
          <Link
            key={item}
            to={`${customerHref(customer.customerId)}?section=${SECTION_PATH[item]}`}
            aria-current={item === section ? "page" : undefined}
          >
            {customerWorkspaceSectionLabel(item)}
          </Link>
        ))}
      </nav>

      {section === "OVERVIEW" ? (
        <OverviewPane
          workspace={workspace}
          editing={editing}
          draft={draft}
          busy={busy}
          onDraftChange={setDraft}
          onSave={() => void handleSave()}
        />
      ) : null}
      {section === "REQUESTS" ? <RequestsPane requests={workspace.requests} /> : null}
      {section === "QUOTES" ? <QuotesPane quotes={workspace.quotes} /> : null}
      {section === "JOBS" ? <JobsPane jobs={workspace.jobs} /> : null}
    </section>
  );
}

function OverviewPane({
  workspace,
  editing,
  draft,
  busy,
  onDraftChange,
  onSave,
}: {
  workspace: CustomerWorkspaceProjection;
  editing: boolean;
  draft: CustomerProfileFormValue;
  busy: boolean;
  onDraftChange: (next: CustomerProfileFormValue) => void;
  onSave: () => void;
}) {
  const { customer } = workspace;
  return (
    <div className="client-overview">
      <article className="client-current-card">
        <h2>Date curente</h2>
        <p className="client-current-hint">
          Aceste date se actualizează. Ofertele și comenzile înghețate păstrează
          identitatea de atunci.
        </p>
        {editing ? (
          <form
            className="client-edit-form"
            onSubmit={(event) => {
              event.preventDefault();
              onSave();
            }}
          >
            <CustomerProfileFields value={draft} onChange={onDraftChange} disabled={busy} />
            <button type="submit" disabled={busy || draft.displayName.trim().length === 0}>
              Salvează datele
            </button>
          </form>
        ) : (
          <dl className="client-profile-list">
            <ProfileRow label="CUI" value={customer.cui} />
            <ProfileRow label="Contact" value={customer.contactName} />
            <ProfileRow label="Telefon" value={customer.phone} />
            <ProfileRow label="Email" value={customer.email} />
            <ProfileRow label="Adresă" value={addressLine(customer)} />
            <ProfileRow label="Note" value={customer.notes} />
          </dl>
        )}
      </article>

      <RelatedWorkspace
        requests={workspace.requests}
        quotes={workspace.quotes}
        jobs={workspace.jobs}
      />

      {workspace.recentActivity.length > 0 ? (
        <article className="client-activity-card">
          <h2>Activitate recentă</h2>
          <ol className="client-activity">
            {workspace.recentActivity.map((item) => (
              <li key={`${item.href}-${item.at}`}>
                <Link to={item.href}>{item.label}</Link>
                <span>{formatDate(item.at)}</span>
              </li>
            ))}
          </ol>
        </article>
      ) : null}
    </div>
  );
}

function RelatedWorkspace({
  requests,
  quotes,
  jobs,
}: {
  requests: readonly RequestOverviewItem[];
  quotes: readonly QuoteOverviewItem[];
  jobs: readonly JobOverviewItem[];
}) {
  if (requests.length === 0 && quotes.length === 0 && jobs.length === 0) {
    return <EmptyState title="Acest client nu are încă cereri, oferte sau lucrări." />;
  }
  return (
    <div className="client-related">
      {requests.length > 0 ? <RequestsPane requests={requests} /> : null}
      {quotes.length > 0 ? <QuotesPane quotes={quotes} /> : null}
      {jobs.length > 0 ? <JobsPane jobs={jobs} /> : null}
    </div>
  );
}

function RequestsPane({ requests }: { requests: readonly RequestOverviewItem[] }) {
  if (requests.length === 0) {
    return <EmptyState title="Acest client nu are cereri." />;
  }
  return (
    <ul className="jobs-list">
      {requests.map((request) => (
        <li key={request.requestId}>
          <div className="jobs-identity">
            <Link to={request.href}>{request.title}</Link>
            <span>{request.reference}</span>
          </div>
          <div className="jobs-status">
            <StatusChip label={request.statusLabel} tone="progress" />
            {request.commercialProgressLabel ? (
              <p>{request.commercialProgressLabel}</p>
            ) : null}
            {request.attentionLabel ? (
              <p className="jobs-attention">{request.attentionLabel}</p>
            ) : null}
          </div>
          <p className="jobs-date">{formatDate(request.createdAt)}</p>
          <Link className="button-link" to={request.nextActionHref}>
            {request.nextActionLabel}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function QuotesPane({ quotes }: { quotes: readonly QuoteOverviewItem[] }) {
  if (quotes.length === 0) {
    return <EmptyState title="Acest client nu are oferte." />;
  }
  return (
    <ul className="jobs-list">
      {quotes.map((quote) => (
        <li key={quote.quoteSnapshotId}>
          <div className="jobs-identity">
            <Link to={quote.href}>{quote.inscription}</Link>
            <span>
              {quote.reference} · {quote.productLabel} · {quote.grossDisplay} {quote.currency}
            </span>
            <span>Client la înghețare: {quote.customerDisplayName ?? "—"}</span>
          </div>
          <div className="jobs-status">
            <StatusChip label={quote.stageLabel} tone="progress" />
            {quote.attentionLabel ? (
              <p className="jobs-attention">{quote.attentionLabel}</p>
            ) : null}
          </div>
          <p className="jobs-date">{formatDate(quote.createdAt)}</p>
          <div className="client-row-actions">
            <a
              className="button-link"
              href={quoteDocumentUrl(quote.productCode, quote.quoteSnapshotId)}
            >
              Descarcă oferta PDF
            </a>
            <Link className="button-link" to={quote.href}>
              {quote.nextActionLabel}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function JobsPane({ jobs }: { jobs: readonly JobOverviewItem[] }) {
  if (jobs.length === 0) {
    return <EmptyState title="Acest client nu are lucrări." />;
  }
  return (
    <ul className="jobs-list">
      {jobs.map((job) => (
        <li key={job.jobId}>
          <div className="jobs-identity">
            <Link to={job.href}>{job.inscription}</Link>
            <span>{job.productLabel}</span>
          </div>
          <div className="jobs-status">
            <StatusChip label={job.stageLabel} tone="progress" />
            {job.progressLabel ? <p>{job.progressLabel}</p> : null}
            {job.attentionLabel ? (
              <p className="jobs-attention">{job.attentionLabel}</p>
            ) : null}
          </div>
          <p className="jobs-date">{formatDate(job.createdAt)}</p>
          <Link className="button-link" to={job.href}>
            {job.nextActionLabel}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProfileRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value && value.trim().length > 0 ? value : "Nesetat"}</dd>
    </div>
  );
}

function headerSummary(customer: Customer): string {
  return [customer.cui, customer.contactName, customer.phone, customer.email]
    .filter((value): value is string => Boolean(value))
    .join(" · ") || "Nesetat";
}

function addressLine(customer: Customer): string | null {
  const parts = [customer.address, customer.city].filter(
    (value): value is string => Boolean(value),
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

function formFromCustomer(customer: Customer): CustomerProfileFormValue {
  return {
    displayName: customer.displayName,
    cui: customer.cui ?? "",
    contactName: customer.contactName ?? "",
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    address: customer.address ?? "",
    city: customer.city ?? "",
    notes: customer.notes ?? "",
  };
}

function sectionFromQuery(value: string | null): CustomerWorkspaceSection {
  if (!value) {
    return "OVERVIEW";
  }
  return SECTION_QUERY[value] ?? "OVERVIEW";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
