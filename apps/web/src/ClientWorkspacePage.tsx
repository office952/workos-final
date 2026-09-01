import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  customerHref,
  customerWorkspaceSectionLabel,
  type Customer,
  type CustomerWorkspaceProjection,
  type JobOverviewItem,
  type QuoteOverviewItem,
  type RequestOverviewItem,
} from "@workos-final/domain";
import {
  customerAddressLine,
  customerHasCommercialActivity,
  customerIdentityLine,
  customerWorkspaceAttentionAction,
  clientWorkspaceSectionItems,
  displayOrUnset,
  formatClientDate,
  sectionFromQuery,
  CLIENT_WORKSPACE_SECTION_PATH,
} from "./clientWorkspaceView";
import {
  clientsRegistryReturnHref,
  clientsRegistryReturnState,
  resolveClientsWorkspaceOrigin,
} from "./clientsWorkspaceOrigin";
import {
  CustomerProfileFields,
  customerProfilePatchFromForm,
  emptyCustomerProfileForm,
  type CustomerProfileFormValue,
} from "./CustomerProfileFields";
import { fetchCustomerWorkspace, updateCustomer } from "./customerApi";
import { pageErrorKind } from "./fetchAccess";
import { usePathIdAfter } from "./navigation/usePathIdAfter";
import { quoteDocumentUrl } from "./productApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { EmptyState } from "./ui/EmptyState";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "missing" }
  | { kind: "ready"; workspace: CustomerWorkspaceProjection };

export function ClientWorkspacePage() {
  const customerId = usePathIdAfter("/clients/");
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CustomerProfileFormValue>(emptyCustomerProfileForm());
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const editTriggerRef = useRef<HTMLButtonElement | null>(null);
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

  if (page.kind === "loading" || (page.kind === "ready" && page.workspace.customer.customerId !== customerId)) {
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
  const origin = resolveClientsWorkspaceOrigin(customer.customerId, location.state);
  const backHref = clientsRegistryReturnHref(origin);
  const identity = customerIdentityLine(customer);
  const attention = customerWorkspaceAttentionAction(workspace);

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

  function closeEditor() {
    setEditing(false);
    setDraft(formFromCustomer(customer));
    setNotice(null);
  }

  return (
    <section className="client-workspace">
      <Link
        className="client-object-back"
        to={backHref}
        state={clientsRegistryReturnState(origin)}
        aria-label="Înapoi la Clienți"
      >
        <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Clienți
      </Link>

      <header className="client-object-header">
        <div className="client-object-titles">
          <h1>{customer.displayName}</h1>
          {identity ? <p className="client-object-identity">{identity}</p> : null}
          {workspace.canCreateRequest ? null : (
            <p className="client-object-retired">Retras · Istoricul rămâne vizibil.</p>
          )}
        </div>
        <div className="client-object-actions">
          <button
            ref={editTriggerRef}
            type="button"
            className="button-quiet"
            disabled={busy}
            onClick={() => {
              setDraft(formFromCustomer(customer));
              setEditing(true);
            }}
          >
            Editează datele
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
      </header>

      <ClientSummaryRail summary={workspace.summary} />

      {notice ? <p>{notice}</p> : null}

      <nav className="client-local-nav" aria-label="Secțiuni client">
        {clientWorkspaceSectionItems().map((item) => (
          <Link
            key={item}
            to={`${customerHref(customer.customerId)}?section=${CLIENT_WORKSPACE_SECTION_PATH[item]}`}
            aria-current={item === section ? "page" : undefined}
          >
            {customerWorkspaceSectionLabel(item)}
          </Link>
        ))}
      </nav>

      {section === "OVERVIEW" ? (
        <OverviewPane workspace={workspace} attention={attention} />
      ) : null}
      {section === "REQUESTS" ? <RequestsPane requests={workspace.requests} /> : null}
      {section === "QUOTES" ? <QuotesPane quotes={workspace.quotes} /> : null}
      {section === "JOBS" ? <JobsPane jobs={workspace.jobs} /> : null}

      <ActionDrawer title="Editează clientul" open={editing} onClose={closeEditor}>
        <form
          className="client-edit-drawer-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <div className="client-edit-drawer-fields">
            <CustomerProfileFields value={draft} onChange={setDraft} disabled={busy} />
          </div>
          <div className="action-drawer-actions client-edit-drawer-footer">
            <button type="button" className="button-quiet" disabled={busy} onClick={closeEditor}>
              Anulează
            </button>
            <button type="submit" disabled={busy || draft.displayName.trim().length === 0}>
              Salvează
            </button>
          </div>
        </form>
      </ActionDrawer>
    </section>
  );
}

function ClientSummaryRail({
  summary,
}: {
  summary: CustomerWorkspaceProjection["summary"];
}) {
  return (
    <div className="client-summary-rail" aria-label="Rezumat comercial">
      <div className="client-summary-segment">
        <strong>{summary.requestCount}</strong>
        <span>Cereri</span>
      </div>
      <div className="client-summary-segment">
        <strong>{summary.quoteCount}</strong>
        <span>Oferte</span>
      </div>
      <div className="client-summary-segment">
        <strong>{summary.jobCount}</strong>
        <span>Lucrări</span>
      </div>
    </div>
  );
}

function OverviewPane({
  workspace,
  attention,
}: {
  workspace: CustomerWorkspaceProjection;
  attention: ReturnType<typeof customerWorkspaceAttentionAction>;
}) {
  const { customer } = workspace;
  const hasActivity = customerHasCommercialActivity(workspace);
  return (
    <div className="client-overview">
      {attention ? (
        <Link className="client-attention-row" to={attention.href}>
          <span className="client-attention-copy">
            <span className="client-attention-label">Necesită atenție</span>
            <span>{attention.label}</span>
          </span>
          <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      ) : null}

      <article className="client-profile-panel">
        <h2>Date client</h2>
        <p className="client-profile-hint">
          Datele curente se pot modifica. Ofertele și comenzile înghețate păstrează
          identitatea de atunci.
        </p>
        <dl className="client-profile-list">
          <ProfileRow label="CUI" value={customer.cui} />
          <ProfileRow label="Contact" value={customer.contactName} />
          <ProfileRow label="Telefon" value={customer.phone} />
          <ProfileRow label="Email" value={customer.email} />
          <ProfileRow label="Adresă" value={customerAddressLine(customer)} />
          <ProfileRow label="Note" value={customer.notes} />
        </dl>
      </article>

      {!hasActivity ? (
        <EmptyState title="Clientul nu are încă activitate comercială." />
      ) : null}

      <section className="client-activity-block">
        <h2>Activitate recentă</h2>
        {workspace.recentActivity.length === 0 ? (
          <p className="client-activity-empty">Nicio activitate înregistrată.</p>
        ) : (
          <ul className="client-activity-list">
            {workspace.recentActivity.map((item) => (
              <li key={`${item.href}-${item.at}`}>
                <Link className="client-activity-row" to={item.href}>
                  <span className="client-activity-title">{item.label}</span>
                  <span className="client-activity-meta">{formatClientDate(item.at)}</span>
                  <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function RequestsPane({ requests }: { requests: readonly RequestOverviewItem[] }) {
  if (requests.length === 0) {
    return <EmptyState title="Nicio cerere înregistrată." />;
  }
  return (
    <ul className="client-collection-list">
      {requests.map((request) => (
        <li key={request.requestId}>
          <Link
            className={
              request.needsAttention
                ? "client-collection-row is-attention"
                : "client-collection-row"
            }
            to={request.href}
          >
            <span className="client-collection-identity">{request.title}</span>
            <span className="client-collection-ref">{request.reference}</span>
            <span className="client-collection-status">{request.statusLabel}</span>
            <span className="client-collection-next">{request.nextActionLabel}</span>
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function QuotesPane({ quotes }: { quotes: readonly QuoteOverviewItem[] }) {
  if (quotes.length === 0) {
    return <EmptyState title="Nicio ofertă înregistrată." />;
  }
  return (
    <ul className="client-collection-list">
      {quotes.map((quote) => (
        <li key={quote.quoteSnapshotId}>
          <div
            className={
              quote.needsAttention
                ? "client-collection-row client-quote-row is-attention"
                : "client-collection-row client-quote-row"
            }
          >
            <Link className="client-collection-identity" to={quote.href}>
              <span>{quote.inscription}</span>
              <span className="client-collection-frozen">
                Client la înghețare: {quote.customerDisplayName ?? "—"}
              </span>
            </Link>
            <span className="client-collection-ref">{quote.reference}</span>
            <span className="client-collection-amount">
              {quote.grossDisplay} {quote.currency}
            </span>
            <span className="client-collection-status">{quote.stageLabel}</span>
            <a
              className="client-collection-pdf"
              href={quoteDocumentUrl(quote.productCode, quote.quoteSnapshotId)}
              aria-label="Descarcă oferta PDF"
            >
              PDF
            </a>
            <Link className="client-collection-next" to={quote.href}>
              {quote.nextActionLabel}
            </Link>
            <Link className="client-collection-chevron" to={quote.href} tabIndex={-1} aria-hidden="true">
              <ChevronRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function JobsPane({ jobs }: { jobs: readonly JobOverviewItem[] }) {
  if (jobs.length === 0) {
    return <EmptyState title="Nicio lucrare înregistrată." />;
  }
  return (
    <ul className="client-collection-list">
      {jobs.map((job) => (
        <li key={job.jobId}>
          <Link
            className={
              job.needsAttention
                ? "client-collection-row client-job-row is-attention"
                : "client-collection-row client-job-row"
            }
            to={job.href}
          >
            <span className="client-collection-identity">
              <span>{job.inscription}</span>
              <span className="client-collection-frozen">{job.productLabel}</span>
            </span>
            <span className="client-collection-status">
              {job.progressLabel ?? job.stageLabel}
            </span>
            <span className="client-collection-next">{job.nextActionLabel}</span>
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
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
      <dd>{displayOrUnset(value)}</dd>
    </div>
  );
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
