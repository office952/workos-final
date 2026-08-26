import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  REQUEST_OVERVIEW_FILTERS,
  filterRequestOverview,
  requestOverviewFilterLabel,
  type CommercialRequestStatus,
  type Customer,
  type RequestOverviewFilter,
  type RequestOverviewProjection,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { createCustomer, fetchCustomers } from "./customerApi";
import {
  RegistrySearchField,
  registrySearchResultSummary,
} from "./RegistrySearchField";
import { createCommercialRequest, fetchRequestOverview } from "./requestsApi";
import { pageErrorKind } from "./fetchAccess";
import { ActionDrawer } from "./ui/ActionDrawer";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip, type StatusTone } from "./ui/StatusChip";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: RequestOverviewProjection };

export function RequestsOverviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetCustomerId = searchParams.get("customer") ?? "";
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [filter, setFilter] = useState<RequestOverviewFilter>("ALL");
  const [query, setQuery] = useRegistrySearchQuery();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(Boolean(presetCustomerId));

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

  const filteredPool = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterRequestOverview(page.overview, filter, "")];
  }, [filter, page]);

  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterRequestOverview(page.overview, filter, query)];
  }, [filter, page, query]);

  async function handleCreate(input: {
    customerId: string;
    title: string;
    description: string;
  }) {
    setNotice(null);
    try {
      const detail = await createCommercialRequest(input);
      navigate(`/requests/${encodeURIComponent(detail.request.requestId)}`);
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
  const empty = overview.requests.length === 0;
  const searching = query.trim().length > 0;

  return (
    <section className="jobs-overview">
      <PageHeader
        title="Cereri de ofertă"
        lead="Ce a cerut clientul, starea de birou și ce trebuie făcut acum."
        actions={
          <button type="button" onClick={() => setDrawerOpen(true)}>
            Cerere nouă
          </button>
        }
        meta={
          empty ? null : (
            <p className="page-summary">
              Cereri {overview.summary.total}
              {" · "}
              Necesită atenție {overview.summary.needsAttention}
              {" · "}
              Noi {overview.summary.newCount}
              {" · "}
              Gata de ofertă {overview.summary.readyForQuote}
            </p>
          )
        }
      />

      {notice ? <p>{notice}</p> : null}

      <ActionDrawer
        title="Cerere nouă"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <RequestCreateForm
          customers={customers}
          initialCustomerId={presetCustomerId}
          onCreate={handleCreate}
          onCreateCustomer={handleCreateCustomer}
          onCancel={() => setDrawerOpen(false)}
        />
      </ActionDrawer>

      {empty ? (
        <EmptyState title="Nu există încă cereri de ofertă." />
      ) : (
        <>
          <div className="filter-row" role="group" aria-label="Filtre cereri">
            {REQUEST_OVERVIEW_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={item === filter}
                onClick={() => setFilter(item)}
              >
                {requestOverviewFilterLabel(item)}
              </button>
            ))}
          </div>
          <RegistrySearchField
            label="Caută cerere"
            placeholder="Caută cerere..."
            value={query}
            onChange={setQuery}
            resultSummary={registrySearchResultSummary({
              visibleCount: visible.length,
              poolCount: filteredPool.length,
              totalCount: overview.summary.total,
              query,
              nounPlural: "cereri",
            })}
          />
          {visible.length === 0 ? (
            <EmptyState
              title={
                searching
                  ? "Nicio cerere nu corespunde căutării."
                  : "Nicio cerere în acest filtru."
              }
            />
          ) : (
            <ul className="jobs-list">
              {visible.map((request) => (
                <li key={request.requestId}>
                  <div className="jobs-identity">
                    <Link to={request.href}>{request.title}</Link>
                    <span>{request.reference}</span>
                    <ClientLink
                      customerId={request.customerId}
                      displayName={request.customerDisplayName}
                    />
                  </div>
                  <div className="jobs-status">
                    <StatusChip
                      label={request.statusLabel}
                      tone={statusTone(request.status)}
                    />
                    {request.commercialProgressLabel ? (
                      <p className="jobs-attention">{request.commercialProgressLabel}</p>
                    ) : null}
                    {request.attentionLabel ? (
                      <p className="jobs-attention">{request.attentionLabel}</p>
                    ) : null}
                  </div>
                  <p className="jobs-date">{formatRequestDate(request.createdAt)}</p>
                  <Link className="button-link" to={request.nextActionHref}>
                    {request.nextActionLabel}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function RequestCreateForm({
  customers,
  initialCustomerId,
  onCreate,
  onCreateCustomer,
  onCancel,
}: {
  customers: readonly Customer[];
  initialCustomerId: string;
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
  useEffect(() => {
    if (initialCustomerId) {
      setCustomerId(initialCustomerId);
    }
  }, [initialCustomerId]);
  const [description, setDescription] = useState("");
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);
  const active = customers.filter((customer) => customer.status === "ACTIVE");

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
          disabled={busy}
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
      <Field label="Nume client">
        <input
          value={newName}
          disabled={busy}
          onChange={(event) => setNewName(event.target.value)}
        />
      </Field>
      <button
        type="button"
        disabled={busy || newName.trim().length === 0}
        onClick={() => {
          const trimmed = newName.trim();
          if (!trimmed) {
            return;
          }
          setBusy(true);
          void onCreateCustomer(trimmed)
            .then((createdId) => {
              setCustomerId(createdId);
              setNewName("");
            })
            .finally(() => setBusy(false));
        }}
      >
        Adaugă client
      </button>
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

function statusTone(status: CommercialRequestStatus): StatusTone {
  switch (status) {
    case "NEW":
    case "WAITING_CUSTOMER":
    case "BLOCKED":
      return "warn";
    case "IN_REVIEW":
    case "READY_FOR_QUOTE":
      return "progress";
    case "CANCELLED":
      return "done";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function formatRequestDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
