import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Search, TriangleAlert, UserCheck, UserMinus, Users } from "lucide-react";
import {
  CUSTOMER_REGISTRY_FILTERS,
  customerRegistryFilterLabel,
  filterCustomerRegistry,
  type CustomerRegistryFilter,
  type CustomerRegistryProjection,
} from "@workos-final/domain";
import {
  clientIdentityMeta,
  clientsResultCountLabel,
  visibleClients,
} from "./clientsRegistryView";
import {
  CustomerProfileFields,
  customerProfilePatchFromForm,
  emptyCustomerProfileForm,
  type CustomerProfileFormValue,
} from "./CustomerProfileFields";
import { createCustomer, fetchCustomerRegistry } from "./customerApi";
import { pageErrorKind } from "./fetchAccess";
import { RegistrySearchField } from "./RegistrySearchField";
import { ActionDrawer } from "./ui/ActionDrawer";
import { EmptyState } from "./ui/EmptyState";
import { MetricCard } from "./ui/MetricCard";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import {
  persistClientsRegistryScroll,
  useClientsRegistryScroll,
} from "./useClientsRegistryScroll";
import { useClientsRegistryState } from "./useClientsRegistryState";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; registry: CustomerRegistryProjection };

export function ClientsOverviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const { query, setQuery, status, setStatus, attention, setAttention } =
    useClientsRegistryState();
  const [notice, setNotice] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useClientsRegistryScroll(page.kind === "ready");

  useEffect(() => {
    let cancelled = false;
    void fetchCustomerRegistry()
      .then((registry) => {
        if (!cancelled) {
          setPage({ kind: "ready", registry });
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
    return visibleClients(filterCustomerRegistry(page.registry, status, query), attention);
  }, [attention, page, query, status]);

  async function handleCreate(value: CustomerProfileFormValue) {
    setNotice(null);
    try {
      const created = await createCustomer(
        value.displayName,
        customerProfilePatchFromForm(value),
      );
      setDrawerOpen(false);
      navigate(
        created.customer.customerId
          ? { pathname: `/clients/${encodeURIComponent(created.customer.customerId)}` }
          : "/clients",
      );
    } catch {
      setNotice("Clientul nu a putut fi creat.");
    }
  }

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă clienții…</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la lista de clienți.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Nu s-au putut încărca clienții.</PageStatus>;
  }

  const { registry } = page;
  const emptyCatalog = registry.customers.length === 0;
  const searching = query.trim().length > 0;

  return (
    <section className="clients-overview">
      <PageHeader
        title="Clienți"
        lead="Cine sunt clienții, ce activitate comercială au și ce trebuie deschis acum."
        actions={
          <button type="button" onClick={() => setDrawerOpen(true)}>
            Client nou
          </button>
        }
      />

      <div className="metric-band">
        <MetricCard
          label="Clienți"
          value={registry.summary.total}
          icon={<Users size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Activi"
          value={registry.summary.active}
          icon={<UserCheck size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Retrași"
          value={registry.summary.retired}
          icon={<UserMinus size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Necesită atenție"
          value={registry.summary.needsAttention}
          icon={<TriangleAlert size={40} strokeWidth={1.5} />}
          iconTone="warning"
        />
      </div>

      {notice ? <p>{notice}</p> : null}

      <ActionDrawer
        title="Client nou"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <ClientCreateForm
          onCreate={handleCreate}
          onCancel={() => setDrawerOpen(false)}
        />
      </ActionDrawer>

      <div className="registry-toolbar">
        <div className="registry-toolbar-primary">
          <div className="filter-row" role="group" aria-label="Status clienți">
            {CUSTOMER_REGISTRY_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === status ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={item === status}
                onClick={() => setStatus(item)}
              >
                {clientsFilterLabel(item)}
              </button>
            ))}
          </div>
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
          <p className="registry-result-count">{clientsResultCountLabel(visible.length)}</p>
        </div>
        <RegistrySearchField
          label="Caută client"
          placeholder="Caută client, CUI, contact, oraș..."
          value={query}
          onChange={setQuery}
          hideLabel
          leadingIcon={<Search size={16} strokeWidth={1.75} />}
        />
      </div>

      {emptyCatalog ? (
        <EmptyState title="Nu există încă clienți." />
      ) : visible.length === 0 ? (
        <EmptyState
          title={
            searching
              ? "Niciun client nu corespunde căutării."
              : "Niciun client în acest filtru."
          }
        />
      ) : (
        <ul className="clients-list">
          {visible.map((customer) => (
            <li key={customer.customerId}>
              <Link
                className={
                  customer.needsAttention ? "registry-row is-attention" : "registry-row"
                }
                to={customer.href}
                onClick={() => persistClientsRegistryScroll(location.key)}
              >
                <div className="registry-row-identity">
                  <div className="registry-row-title">
                    <span className="registry-row-name">{customer.displayName}</span>
                    <span className="registry-row-status">{customer.statusLabel}</span>
                    {customer.needsAttention && customer.attentionLabel ? (
                      <span className="registry-row-attention">{customer.attentionLabel}</span>
                    ) : null}
                  </div>
                  <span className="registry-row-meta">{clientIdentityMeta(customer)}</span>
                </div>
                <div className="registry-row-summary" aria-label="Activitate comercială">
                  <div className="registry-row-metric">
                    <b>{customer.openRequestCount}</b>
                    <span>Cereri</span>
                  </div>
                  <div className="registry-row-metric">
                    <b>{customer.quoteCount}</b>
                    <span>Oferte</span>
                  </div>
                  <div className="registry-row-metric">
                    <b>{customer.jobCount}</b>
                    <span>Lucrări</span>
                  </div>
                </div>
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

function clientsFilterLabel(filter: CustomerRegistryFilter): string {
  return filter === "RETIRED" ? "Retrași" : customerRegistryFilterLabel(filter);
}

function ClientCreateForm({
  onCreate,
  onCancel,
}: {
  onCreate: (value: CustomerProfileFormValue) => Promise<void>;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(emptyCustomerProfileForm());
  const [busy, setBusy] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);

  return (
    <form
      className="people-create"
      onSubmit={(event) => {
        event.preventDefault();
        if (value.displayName.trim().length === 0) {
          setValidation("Introdu numele afișat.");
          return;
        }
        setValidation(null);
        setBusy(true);
        void onCreate(value).finally(() => setBusy(false));
      }}
    >
      <p className="field-hint">
        Introdu numele care apare pe cereri și oferte.
      </p>
      <CustomerProfileFields value={value} onChange={setValue} disabled={busy} />
      {validation ? <p className="status-bad">{validation}</p> : null}
      <div className="action-drawer-actions">
        <button type="button" className="button-quiet" disabled={busy} onClick={onCancel}>
          Anulează
        </button>
        <button type="submit" disabled={busy || value.displayName.trim().length === 0}>
          Salvează clientul
        </button>
      </div>
    </form>
  );
}
