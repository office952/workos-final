import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CUSTOMER_REGISTRY_FILTERS,
  customerRegistryFilterLabel,
  filterCustomerRegistry,
  type CustomerRegistryProjection,
} from "@workos-final/domain";
import { createCustomer, fetchCustomerRegistry } from "../../../customerApi";
import {
  clientIdentityMeta,
  clientsResultCountLabel,
  visibleClients,
} from "../../../clientsRegistryView";
import { pageErrorKind } from "../../../fetchAccess";
import { useClientsRegistryState } from "../../../useClientsRegistryState";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { Ui20FilterChip, Ui20RegistryToolbar } from "../shared/Ui20RegistryControls";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; registry: CustomerRegistryProjection };

export function ClientsRegistry() {
  useContinuityFacts({});
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const { query, setQuery, status, setStatus, attention, setAttention } =
    useClientsRegistryState();
  const [createOpen, setCreateOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  async function submitCreate() {
    setBusy(true);
    setNotice(null);
    try {
      if (!displayName.trim()) {
        setNotice("Completează numele clientului.");
        return;
      }
      const created = await createCustomer(displayName.trim());
      navigate(`/clients/${encodeURIComponent(created.customer.customerId)}`);
    } catch {
      setNotice("Clientul nu a putut fi creat.");
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă clienții…</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-status">Nu ai acces la lista de clienți.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Nu s-au putut încărca clienții.</p>;
  }

  const { registry } = page;

  return (
    <article className="ui20-surface" data-surface="clienti" data-floorplan="registry">
      <header className="ui20-registry-head">
        <div className="ui20-registry-title-row">
          <div>
            <h1>Clienți</h1>
            <p className="ui20-kicker">
              Registru de relații — identitate, atenție comercială, legături active.
            </p>
          </div>
          <button
            type="button"
            className="ui20-button"
            data-primary="true"
            onClick={() => setCreateOpen(true)}
          >
            Client nou
          </button>
        </div>
        <p className="ui20-registry-pulse" aria-label="Rezumat clienți">
          <span>{registry.summary.total} clienți</span>
          <span>{registry.summary.active} activi</span>
          <span data-energy={registry.summary.needsAttention > 0 ? "blocked" : undefined}>
            {registry.summary.needsAttention} necesită atenție
          </span>
        </p>
      </header>

      {createOpen ? (
        <section className="ui20-panel" aria-label="Client nou">
          <h2>Client nou</h2>
          {notice ? <p className="ui20-error">{notice}</p> : null}
          <label className="ui20-field">
            Nume afișat
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoFocus
            />
          </label>
          <p className="ui20-actions">
            <button
              type="button"
              className="ui20-button"
              data-primary="true"
              disabled={busy}
              onClick={() => void submitCreate()}
            >
              Creează clientul
            </button>
            <button type="button" className="ui20-button" onClick={() => setCreateOpen(false)}>
              Anulează
            </button>
          </p>
        </section>
      ) : null}

      <Ui20RegistryToolbar
        filterLabel="Filtre clienți"
        filters={
          <>
            {CUSTOMER_REGISTRY_FILTERS.map((item) => (
              <Ui20FilterChip
                key={item}
                pressed={item === status}
                onClick={() => setStatus(item)}
              >
                {item === "RETIRED" ? "Retrași" : customerRegistryFilterLabel(item)}
              </Ui20FilterChip>
            ))}
            <Ui20FilterChip pressed={attention} onClick={() => setAttention(!attention)}>
              Necesită atenție
            </Ui20FilterChip>
          </>
        }
        searchLabel="Caută client"
        searchPlaceholder="Caută client, CUI sau contact."
        query={query}
        onQueryChange={setQuery}
        countLabel={clientsResultCountLabel(visible.length)}
      />

      {visible.length === 0 ? (
        <p>Niciun client nu corespunde filtrelor.</p>
      ) : (
        <table className="ui20-worklist">
          <caption className="visually-hidden">Registru clienți</caption>
          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Stare</th>
              <th scope="col">Cereri</th>
              <th scope="col">Oferte</th>
              <th scope="col">Lucrări</th>
              <th scope="col">Deschide</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr
                key={item.customerId}
                className="ui20-work-row"
                data-customer-id={item.customerId}
                data-energy={item.needsAttention ? "blocked" : "quiet"}
              >
                <td>
                  <Link to={item.href}>{item.displayName}</Link>
                  <span className="ui20-k">{clientIdentityMeta(item)}</span>
                  {item.attentionLabel ? (
                    <span className="ui20-attention">{item.attentionLabel}</span>
                  ) : null}
                </td>
                <td>{item.statusLabel}</td>
                <td>{item.openRequestCount}</td>
                <td>{item.quoteCount}</td>
                <td>{item.jobCount}</td>
                <td>
                  <Link className="ui20-link-button" to={item.href}>
                    Deschide
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}
