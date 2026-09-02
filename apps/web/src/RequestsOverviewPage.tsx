import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, FileCheck, FilePlus, Inbox, Search, TriangleAlert } from "lucide-react";
import {
  REQUEST_OVERVIEW_FILTERS,
  requestOverviewFilterLabel,
  type Customer,
  type RequestOverviewFilter,
  type RequestOverviewProjection,
} from "@workos-final/domain";
import { createCustomer, fetchCustomers } from "./customerApi";
import { pageErrorKind } from "./fetchAccess";
import { RegistrySearchField } from "./RegistrySearchField";
import {
  formatRequestDate,
  requestRowMeta,
  requestsResultCountLabel,
  visibleRequests,
} from "./requestsRegistryView";
import { createCommercialRequest, fetchRequestOverview } from "./requestsApi";
import {
  bindClientHubOrigin,
  clearPendingClientHubOrigin,
  clearRequestsWorkspaceOrigin,
  markPendingClientHubOrigin,
  markRequestsWorkspaceOrigin,
  readPendingClientHubOrigin,
  requestsRegistrySearchWithoutCustomer,
} from "./requestsWorkspaceOrigin";
import {
  persistRequestsRegistryScroll,
  readRequestsRegistryScrollY,
  useRequestsRegistryScroll,
} from "./useRequestsRegistryScroll";
import { useRequestsRegistryState } from "./useRequestsRegistryState";
import { ActionDrawer } from "./ui/ActionDrawer";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { MetricCard } from "./ui/MetricCard";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: RequestOverviewProjection };

export function RequestsOverviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const presetCustomerId = searchParams.get("customer") ?? "";
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const { query, setQuery, status, setStatus, attention, setAttention } =
    useRequestsRegistryState();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(Boolean(presetCustomerId));
  useRequestsRegistryScroll(page.kind === "ready");

  useEffect(() => {
    clearRequestsWorkspaceOrigin();
  }, []);

  useEffect(() => {
    if (!presetCustomerId) {
      clearPendingClientHubOrigin();
      return;
    }
    const locked = customers.find((customer) => customer.customerId === presetCustomerId);
    if (locked) {
      markPendingClientHubOrigin({
        customerId: locked.customerId,
        customerDisplayName: locked.displayName,
      });
    }
  }, [customers, presetCustomerId]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchRequestOverview(), fetchCustomers()])
      .then(([overview, listed]) => {
        if (!cancelled) {
          setPage({ kind: "ready", overview });
          setCustomers(listed);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPage({ kind: pageErrorKind(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return visibleRequests(page.overview, status, query, attention);
  }, [attention, page, query, status]);

  async function handleCreate(input: {
    customerId: string;
    title: string;
    description: string;
  }) {
    setNotice(null);
    try {
      const detail = await createCommercialRequest(input);
      setDrawerOpen(false);
      const pending = readPendingClientHubOrigin();
      const hubOrigin =
        pending && pending.customerId === input.customerId
          ? bindClientHubOrigin(detail.request.requestId, pending)
          : null;
      if (hubOrigin) {
        markRequestsWorkspaceOrigin(hubOrigin);
        clearPendingClientHubOrigin();
        navigate(
          { pathname: `/requests/${encodeURIComponent(detail.request.requestId)}` },
          { state: { requestsWorkspaceOrigin: hubOrigin } },
        );
        return;
      }
      navigate({ pathname: `/requests/${encodeURIComponent(detail.request.requestId)}` });
    } catch {
      setNotice("Cererea nu a putut fi creată.");
    }
  }

  async function handleCreateCustomer(displayName: string) {
    const created = await createCustomer(displayName);
    setCustomers(created.customers);
    return created.customer.customerId;
  }

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă cererile…</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la lista de cereri.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Nu s-au putut încărca cererile.</PageStatus>;
  }

  const { overview } = page;
  const emptyCatalog = overview.requests.length === 0;
  const searching = query.trim().length > 0;

  return (
    <section className="requests-overview">
      <PageHeader
        title="Cereri de ofertă"
        lead="Ce a cerut clientul, starea de birou și ce trebuie făcut acum."
        actions={
          <button type="button" onClick={() => setDrawerOpen(true)}>
            Cerere nouă
          </button>
        }
      />

      <div className="metric-band">
        <MetricCard
          label="Cereri"
          value={overview.summary.total}
          icon={<Inbox size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Necesită atenție"
          value={overview.summary.needsAttention}
          icon={<TriangleAlert size={40} strokeWidth={1.5} />}
          iconTone="warning"
        />
        <MetricCard
          label="Noi"
          value={overview.summary.newCount}
          icon={<FilePlus size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Gata de ofertă"
          value={overview.summary.readyForQuote}
          icon={<FileCheck size={40} strokeWidth={1.5} />}
        />
      </div>

      {notice ? <p>{notice}</p> : null}

      <ActionDrawer title="Cerere nouă" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <RequestCreateForm
          customers={customers}
          initialCustomerId={presetCustomerId}
          customerLocked={Boolean(presetCustomerId)}
          onCreate={handleCreate}
          onCreateCustomer={handleCreateCustomer}
          onCancel={() => setDrawerOpen(false)}
        />
      </ActionDrawer>

      <div className="registry-toolbar">
        <div className="registry-toolbar-primary">
          <div className="filter-row requests-status-chips" role="group" aria-label="Stare">
            {REQUEST_OVERVIEW_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === status ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={item === status}
                onClick={() => setStatus(item)}
              >
                {requestOverviewFilterLabel(item)}
              </button>
            ))}
          </div>
          <label className="requests-status-filter">
            <span>Stare:</span>
            <select
              aria-label="Stare"
              value={status}
              onChange={(event) => setStatus(event.target.value as RequestOverviewFilter)}
            >
              {REQUEST_OVERVIEW_FILTERS.map((item) => (
                <option key={item} value={item}>
                  {requestOverviewFilterLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <div className="filter-row" role="group" aria-label="Filtru atenție">
            <button
              type="button"
              className={attention ? "button-quiet is-selected" : "button-quiet"}
              aria-pressed={attention}
              onClick={() => setAttention(!attention)}
            >
              Necesită atenție
            </button>
          </div>
          <p className="registry-result-count">{requestsResultCountLabel(visible.length)}</p>
        </div>
        <RegistrySearchField
          label="Caută cerere"
          placeholder="Caută titlu, CER- sau client."
          value={query}
          onChange={setQuery}
          hideLabel
          leadingIcon={<Search size={16} strokeWidth={1.75} />}
        />
      </div>

      {emptyCatalog ? (
        <EmptyState title="Nu există încă cereri de ofertă." />
      ) : visible.length === 0 ? (
        <EmptyState
          title={
            searching
              ? "Nicio cerere nu corespunde căutării."
              : "Nicio cerere în acest filtru."
          }
        />
      ) : (
        <ul className="requests-list">
          {visible.map((request) => (
            <li key={request.requestId}>
              <Link
                className={request.needsAttention ? "registry-row is-attention" : "registry-row"}
                to={request.href}
                onClick={(event) => {
                  if (
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  ) {
                    return;
                  }
                  event.preventDefault();
                  persistRequestsRegistryScroll(location.key);
                  const origin = {
                    kind: "registry" as const,
                    requestId: request.requestId,
                    search: requestsRegistrySearchWithoutCustomer(location.search),
                    scrollY: readRequestsRegistryScrollY(),
                  };
                  markRequestsWorkspaceOrigin(origin);
                  navigate(request.href, { state: { requestsWorkspaceOrigin: origin } });
                }}
              >
                <div className="registry-row-identity">
                  <span className="registry-row-name">{request.title}</span>
                  <span className="registry-row-meta">{requestRowMeta(request)}</span>
                </div>
                <div className="requests-row-status">
                  <span>{request.statusLabel}</span>
                  {request.needsAttention && request.attentionLabel ? (
                    <span className="requests-row-attention">{request.attentionLabel}</span>
                  ) : request.commercialProgressLabel ? (
                    <span>{request.commercialProgressLabel}</span>
                  ) : null}
                </div>
                <p className="requests-row-date">{formatRequestDate(request.createdAt)}</p>
                <span className="requests-row-action">{request.nextActionLabel}</span>
                <span className="registry-row-open" aria-hidden="true">
                  <ChevronRight size={16} strokeWidth={1.75} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RequestCreateForm({
  customers,
  initialCustomerId,
  customerLocked,
  onCreate,
  onCreateCustomer,
  onCancel,
}: {
  customers: readonly Customer[];
  initialCustomerId: string;
  customerLocked: boolean;
  onCreate: (input: {
    customerId: string;
    title: string;
    description: string;
  }) => Promise<void>;
  onCreateCustomer: (displayName: string) => Promise<string>;
  onCancel: () => void;
}) {
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inlineCreate, setInlineCreate] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [busy, setBusy] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);
  const active = customers.filter((customer) => customer.status === "ACTIVE");

  useEffect(() => {
    if (initialCustomerId) {
      setCustomerId(initialCustomerId);
    }
  }, [initialCustomerId]);

  return (
    <form
      className="people-create"
      onSubmit={(event) => {
        event.preventDefault();
        if (!customerId || title.trim().length === 0 || description.trim().length === 0) {
          setValidation("Alege clientul și completează titlul și descrierea.");
          return;
        }
        setValidation(null);
        setBusy(true);
        void onCreate({
          customerId,
          title: title.trim(),
          description: description.trim(),
        }).finally(() => setBusy(false));
      }}
    >
      <Field label="Client">
        <select
          value={customerId}
          disabled={busy || customerLocked}
          onChange={(event) => setCustomerId(event.target.value)}
        >
          <option value="">Alege clientul</option>
          {active.map((customer) => (
            <option key={customer.customerId} value={customer.customerId}>
              {customer.displayName}
            </option>
          ))}
        </select>
      </Field>
      {customerLocked ? (
        <p className="field-hint">Clientul este cel al spațiului din care ai deschis cererea.</p>
      ) : inlineCreate ? (
        <div className="request-inline-create">
          <Field label="Nume client">
            <input
              value={newClientName}
              disabled={busy}
              onChange={(event) => setNewClientName(event.target.value)}
            />
          </Field>
          <button
            type="button"
            disabled={busy || newClientName.trim().length === 0}
            onClick={() => {
              setBusy(true);
              void onCreateCustomer(newClientName.trim())
                .then((createdId) => {
                  setCustomerId(createdId);
                  setInlineCreate(false);
                  setNewClientName("");
                })
                .finally(() => setBusy(false));
            }}
          >
            Creează clientul
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="button-quiet request-inline-create-trigger"
          disabled={busy}
          onClick={() => setInlineCreate(true)}
        >
          Clientul nu e în listă
        </button>
      )}
      <Field label="Titlu">
        <input
          value={title}
          disabled={busy}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Field>
      <Field label="Descriere">
        <textarea
          value={description}
          disabled={busy}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>
      {validation ? <p className="status-bad">{validation}</p> : null}
      <div className="action-drawer-actions">
        <button type="button" className="button-quiet" disabled={busy} onClick={onCancel}>
          Anulează
        </button>
        <button
          type="submit"
          disabled={
            busy ||
            !customerId ||
            title.trim().length === 0 ||
            description.trim().length === 0
          }
        >
          Creează cererea
        </button>
      </div>
    </form>
  );
}
