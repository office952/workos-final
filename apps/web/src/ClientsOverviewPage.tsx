import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CUSTOMER_REGISTRY_FILTERS,
  customerRegistryFilterLabel,
  filterCustomerRegistry,
  type CustomerRegistryFilter,
  type CustomerRegistryProjection,
} from "@workos-final/domain";
import {
  CustomerProfileFields,
  customerProfilePatchFromForm,
  emptyCustomerProfileForm,
  type CustomerProfileFormValue,
} from "./CustomerProfileFields";
import { createCustomer, fetchCustomerRegistry } from "./customerApi";
import { pageErrorKind } from "./fetchAccess";
import {
  RegistrySearchField,
  registrySearchResultSummary,
} from "./RegistrySearchField";
import { ActionDrawer } from "./ui/ActionDrawer";
import { EmptyState } from "./ui/EmptyState";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; registry: CustomerRegistryProjection };

export function ClientsOverviewPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [filter, setFilter] = useState<CustomerRegistryFilter>("ALL");
  const [query, setQuery] = useRegistrySearchQuery();
  const [notice, setNotice] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const filteredPool = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterCustomerRegistry(page.registry, filter, "")];
  }, [filter, page]);

  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    return [...filterCustomerRegistry(page.registry, filter, query)];
  }, [filter, page, query]);

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
  const empty = registry.customers.length === 0;
  const searching = query.trim().length > 0;

  return (
    <section className="jobs-overview">
      <PageHeader
        title="Clienți"
        lead="Cine sunt clienții, ce activitate comercială au și ce trebuie deschis acum."
        actions={
          <button type="button" onClick={() => setDrawerOpen(true)}>
            Client nou
          </button>
        }
        meta={
          empty ? null : (
            <p className="page-summary">
              Clienți {registry.summary.total}
              {" · "}
              Activi {registry.summary.active}
              {" · "}
              Necesită atenție {registry.summary.needsAttention}
            </p>
          )
        }
      />

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

      {empty ? (
        <EmptyState title="Nu există încă clienți." />
      ) : (
        <>
          <div className="filter-row" role="group" aria-label="Filtre clienți">
            {CUSTOMER_REGISTRY_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={item === filter}
                onClick={() => setFilter(item)}
              >
                {customerRegistryFilterLabel(item)}
              </button>
            ))}
          </div>
          <RegistrySearchField
            label="Caută client"
            placeholder="Caută client..."
            value={query}
            onChange={setQuery}
            resultSummary={registrySearchResultSummary({
              visibleCount: visible.length,
              poolCount: filteredPool.length,
              totalCount: registry.summary.total,
              query,
              nounPlural: "clienți",
            })}
          />
          {visible.length === 0 ? (
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
                  <div className="jobs-identity">
                    <Link to={customer.href}>{customer.displayName}</Link>
                    <span>
                      {[customer.cui, customer.contactName, customer.city]
                        .filter(Boolean)
                        .join(" · ") || "Fără CUI sau contact"}
                    </span>
                    {customer.attentionLabel ? (
                      <p className="jobs-attention">{customer.attentionLabel}</p>
                    ) : null}
                  </div>
                  <div className="jobs-status">
                    <StatusChip
                      label={customer.statusLabel}
                      tone={customer.status === "ACTIVE" ? "ok" : "neutral"}
                    />
                    <p>
                      Cereri deschise {customer.openRequestCount}
                      {" · "}
                      Oferte {customer.quoteCount}
                      {" · "}
                      Lucrări {customer.jobCount}
                    </p>
                  </div>
                  <Link className="button-link" to={customer.href}>
                    Deschide clientul
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
