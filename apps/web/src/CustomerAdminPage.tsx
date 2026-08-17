import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerHref, type Customer } from "@workos-final/domain";
import {
  createCustomer,
  fetchCustomers,
  renameCustomer,
  retireCustomer,
} from "./customerApi";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; customers: Customer[] };

export function CustomerAdminPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchCustomers()
      .then((customers) => {
        if (!cancelled) {
          setPage({ kind: "ready", customers });
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

  async function apply(action: () => Promise<Customer[]>) {
    setBusy(true);
    setNotice(null);
    try {
      const customers = await action();
      setPage({ kind: "ready", customers });
    } catch {
      setNotice("Acțiunea nu a putut fi aplicată.");
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return <p>Se încarcă clienții…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca clienții.</p>;
  }

  const active = page.customers.filter((customer) => customer.status === "ACTIVE");
  const retired = page.customers.filter((customer) => customer.status === "RETIRED");

  return (
    <section>
      <PageHeader
        title="Clienți"
        lead="Ciclu de viață: adăugare, redenumire și retragere. Datele de lucru se editează în workspace-ul clientului."
      />
      <form
        className="people-create"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = name.trim();
          if (trimmed.length === 0) {
            return;
          }
          void apply(async () => {
            const created = await createCustomer(trimmed);
            setName("");
            return created.customers;
          });
        }}
      >
        <Field label="Nume">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={busy}
          />
        </Field>
        <button type="submit" disabled={busy || name.trim().length === 0}>
          Adaugă client
        </button>
      </form>
      {notice ? <p className="status-bad">{notice}</p> : null}
      <h2>Activi</h2>
      {active.length === 0 ? (
        <EmptyState title="Nu există clienți activi." action={<p>Adaugă primul client.</p>} />
      ) : (
        <ul className="people-list">
          {active.map((customer) => (
            <li key={customer.customerId}>
              {editingId === customer.customerId ? (
                <>
                  <Field label="Nume">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      disabled={busy}
                    />
                  </Field>
                  <button
                    type="button"
                    disabled={busy || draft.trim().length === 0}
                    onClick={() =>
                      void apply(async () => {
                        const customers = await renameCustomer(customer.customerId, draft);
                        setEditingId(null);
                        return customers;
                      })
                    }
                  >
                    Salvează
                  </button>
                </>
              ) : (
                <>
                  <p>{customer.displayName}</p>
                  <StatusChip label="Activ" tone="ok" />
                  <Link className="button-link" to={customerHref(customer.customerId)}>
                    Deschide workspace
                  </Link>
                  <button
                    type="button"
                    className="button-quiet"
                    disabled={busy}
                    onClick={() => {
                      setEditingId(customer.customerId);
                      setDraft(customer.displayName);
                    }}
                  >
                    Editează nume
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    disabled={busy}
                    onClick={() => void apply(() => retireCustomer(customer.customerId))}
                  >
                    Retrage clientul
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <details className="people-retired" open={retired.length > 0}>
        <summary>
          <h2>Retrasi</h2>
        </summary>
        {retired.length === 0 ? <p>Niciun client retras.</p> : null}
        <ul className="people-list">
          {retired.map((customer) => (
            <li key={customer.customerId}>
              <p>{customer.displayName}</p>
              <StatusChip label="Retras" tone="neutral" />
              <Link className="button-link" to={customerHref(customer.customerId)}>
                Deschide workspace
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
