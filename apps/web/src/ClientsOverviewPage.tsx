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
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; registry: CustomerRegistryProjection };

export function ClientsOverviewPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [filter, setFilter] = useState<CustomerRegistryFilter>("ALL");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCustomerRegistry()
      .then((registry) => {
        if (!cancelled) {
          setPage({ kind: "ready", registry });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
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
    return [...filterCustomerRegistry(page.registry, filter, query)];
  }, [filter, page, query]);

  async function handleCreate(value: CustomerProfileFormValue) {
    setNotice(null);
    try {
      const created = await createCustomer(
        value.displayName,
        customerProfilePatchFromForm(value),
      );
      navigate(created.customer.customerId ? `/clients/${encodeURIComponent(created.customer.customerId)}` : "/clients");
    } catch {
      setNotice("Clientul nu a putut fi creat.");
    }
  }

  if (page.kind === "loading") {
    return <p>Se încarcă clienții…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca clienții.</p>;
  }

  const { registry } = page;
  const empty = registry.customers.length === 0;

  return (
    <section className="jobs-overview">
      <PageHeader
        title="Clienți"
        lead="Cine sunt clienții, ce activitate comercială au și ce trebuie deschis acum."
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

      <ClientCreateForm onCreate={handleCreate} />

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
          <Field label="Caută">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nume, CUI sau contact"
            />
          </Field>
          {visible.length === 0 ? (
            <EmptyState title="Niciun client în acest filtru." />
          ) : (
            <ul className="clients-list">
              {visible.map((customer) => (
                <li key={customer.customerId}>
                  <div className="jobs-identity">
                    <Link to={customer.href}>{customer.displayName}</Link>
                    <span>
                      {[customer.cui, customer.contactName].filter(Boolean).join(" · ") ||
                        "Fără CUI sau contact"}
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
}: {
  onCreate: (value: CustomerProfileFormValue) => Promise<void>;
}) {
  const [value, setValue] = useState(emptyCustomerProfileForm());
  const [busy, setBusy] = useState(false);

  return (
    <details className="client-create">
      <summary>Client nou</summary>
      <form
        className="people-create"
        onSubmit={(event) => {
          event.preventDefault();
          if (value.displayName.trim().length === 0) {
            return;
          }
          setBusy(true);
          void onCreate(value).finally(() => setBusy(false));
        }}
      >
        <CustomerProfileFields value={value} onChange={setValue} disabled={busy} />
        <button type="submit" disabled={busy || value.displayName.trim().length === 0}>
          Creează clientul
        </button>
      </form>
    </details>
  );
}
