import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  REQUEST_OVERVIEW_FILTERS,
  requestOverviewFilterLabel,
  type RequestOverviewProjection,
} from "@workos-final/domain";
import { createCustomer, fetchCustomers } from "../../../customerApi";
import { pageErrorKind } from "../../../fetchAccess";
import { createCommercialRequest, fetchRequestOverview } from "../../../requestsApi";
import {
  formatRequestDate,
  requestsResultCountLabel,
  visibleRequests,
} from "../../../requestsRegistryView";
import { useRequestsRegistryState } from "../../../useRequestsRegistryState";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { Ui20FilterChip, Ui20RegistryToolbar } from "../shared/Ui20RegistryControls";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; overview: RequestOverviewProjection };

type CustomerOption = { customerId: string; displayName: string };

export function RequestsRegistry() {
  useContinuityFacts({});
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const { query, setQuery, status, setStatus, attention, setAttention } =
    useRequestsRegistryState();
  const [createOpen, setCreateOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchRequestOverview()
      .then((overview) => {
        if (!cancelled) {
          setPage({ kind: "ready", overview });
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

  async function openCreate() {
    setCreateOpen(true);
    setNotice(null);
    try {
      const list = await fetchCustomers();
      setCustomers(list.map((item) => ({ customerId: item.customerId, displayName: item.displayName })));
    } catch {
      setNotice("Clienții nu au putut fi încărcați.");
    }
  }

  async function submitCreate() {
    setBusy(true);
    setNotice(null);
    try {
      let targetCustomerId = customerId;
      if (!targetCustomerId && newCustomerName.trim()) {
        const created = await createCustomer(newCustomerName.trim());
        targetCustomerId = created.customer.customerId;
      }
      if (!targetCustomerId || !title.trim()) {
        setNotice("Alege un client și completează titlul.");
        return;
      }
      const detail = await createCommercialRequest({
        customerId: targetCustomerId,
        title: title.trim(),
        description: description.trim(),
      });
      navigate(`/requests/${encodeURIComponent(detail.request.requestId)}`);
    } catch {
      setNotice("Cererea nu a putut fi creată.");
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă cererile…</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-status">Nu ai acces la lista de cereri.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Nu s-au putut încărca cererile.</p>;
  }

  const { overview } = page;
  const searching = query.trim().length > 0;

  return (
    <article className="ui20-surface" data-surface="cereri" data-floorplan="registry">
      <header className="ui20-registry-head">
        <div className="ui20-registry-title-row">
          <div>
            <h1>Cereri de ofertă</h1>
            <p className="ui20-kicker">
              Coadă de rezolvare — ce e nerezolvat, progres comercial, următoarea acțiune.
            </p>
          </div>
          <button type="button" className="ui20-button" data-primary="true" onClick={() => void openCreate()}>
            Cerere nouă
          </button>
        </div>
        <p className="ui20-registry-pulse" aria-label="Rezumat cereri">
          <span>{overview.summary.total} cereri</span>
          <span data-energy={overview.summary.needsAttention > 0 ? "blocked" : undefined}>
            {overview.summary.needsAttention} necesită atenție
          </span>
          <span>{overview.summary.newCount} noi</span>
          <span>{overview.summary.readyForQuote} gata de ofertă</span>
        </p>
      </header>

      {createOpen ? (
        <section className="ui20-panel" aria-label="Cerere nouă">
          <h2>Cerere nouă</h2>
          {notice ? <p className="ui20-error">{notice}</p> : null}
          <label className="ui20-field">
            Client existent
            <select
              aria-label="Client existent"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="">—</option>
              {customers.map((item) => (
                <option key={item.customerId} value={item.customerId}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="ui20-field">
            Clientul nu e în listă
            <input
              value={newCustomerName}
              onChange={(event) => setNewCustomerName(event.target.value)}
              placeholder="Nume client nou"
            />
          </label>
          <label className="ui20-field">
            Titlu
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="ui20-field">
            Descriere
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
          </label>
          <p className="ui20-actions">
            <button
              type="button"
              className="ui20-button"
              data-primary="true"
              disabled={busy}
              onClick={() => void submitCreate()}
            >
              Creează cererea
            </button>
            <button type="button" className="ui20-button" onClick={() => setCreateOpen(false)}>
              Anulează
            </button>
          </p>
        </section>
      ) : null}

      {overview.requests.length === 0 && !createOpen ? (
        <p>Nu există încă cereri de ofertă.</p>
      ) : (
        <>
          <Ui20RegistryToolbar
            filterLabel="Filtre cereri"
            filters={
              <>
                {REQUEST_OVERVIEW_FILTERS.map((item) => (
                  <Ui20FilterChip
                    key={item}
                    pressed={item === status}
                    onClick={() => setStatus(item)}
                  >
                    {requestOverviewFilterLabel(item)}
                  </Ui20FilterChip>
                ))}
                <Ui20FilterChip pressed={attention} onClick={() => setAttention(!attention)}>
                  Necesită atenție
                </Ui20FilterChip>
              </>
            }
            searchLabel="Caută cerere"
            searchPlaceholder="Caută referință, client sau titlu."
            query={query}
            onQueryChange={setQuery}
            countLabel={requestsResultCountLabel(visible.length)}
          />
          {visible.length === 0 ? (
            <p>
              {searching || attention || status !== "ALL"
                ? "Nicio cerere nu corespunde filtrelor."
                : "Nicio cerere încă."}
            </p>
          ) : (
            <table className="ui20-worklist">
              <caption className="visually-hidden">Registru cereri</caption>
              <thead>
                <tr>
                  <th scope="col">Referință</th>
                  <th scope="col">Client</th>
                  <th scope="col">Stare</th>
                  <th scope="col">Progres</th>
                  <th scope="col">Dată</th>
                  <th scope="col">Urmează</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr
                    key={item.requestId}
                    className="ui20-work-row"
                    data-request-id={item.requestId}
                    data-energy={item.needsAttention ? "blocked" : "quiet"}
                  >
                    <td>
                      <Link to={item.href}>{item.reference}</Link>
                      <span className="ui20-k">{item.title}</span>
                      {item.attentionLabel ? (
                        <span className="ui20-attention">{item.attentionLabel}</span>
                      ) : null}
                    </td>
                    <td>
                      {item.customerId ? (
                        <Link to={`/clients/${encodeURIComponent(item.customerId)}`}>
                          {item.customerDisplayName}
                        </Link>
                      ) : (
                        item.customerDisplayName
                      )}
                    </td>
                    <td>{item.statusLabel}</td>
                    <td>{item.commercialProgressLabel || "—"}</td>
                    <td>{formatRequestDate(item.createdAt)}</td>
                    <td>
                      <Link className="ui20-link-button" to={item.nextActionHref || item.href}>
                        {item.nextActionLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </article>
  );
}
