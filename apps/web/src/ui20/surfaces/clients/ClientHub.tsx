import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  customerWorkspaceSectionLabel,
  type CustomerProfilePatch,
  type CustomerWorkspaceProjection,
  type CustomerWorkspaceSection,
} from "@workos-final/domain";
import {
  customerAddressLine,
  customerIdentityLine,
  customerWorkspaceAttentionAction,
  displayOrUnset,
  formatClientDate,
  sectionFromQuery,
  CLIENT_WORKSPACE_SECTION_PATH,
  clientWorkspaceSectionItems,
} from "../../../clientWorkspaceView";
import { fetchCustomerWorkspace, updateCustomer } from "../../../customerApi";
import { pageErrorKind } from "../../../fetchAccess";
import { usePathIdAfter } from "../../../navigation/usePathIdAfter";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "missing" }
  | { kind: "ready"; workspace: CustomerWorkspaceProjection };

export function ClientHub() {
  const customerId = usePathIdAfter("/clients/");
  const [searchParams, setSearchParams] = useSearchParams();
  const section = sectionFromQuery(searchParams.get("section"));
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftContact, setDraftContact] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftCity, setDraftCity] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useContinuityFacts({
    customerName: page.kind === "ready" ? page.workspace.customer.displayName : null,
  });

  useEffect(() => {
    if (!customerId) {
      setPage({ kind: "missing" });
      return;
    }
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
        setPage({ kind: "ready", workspace });
        setDraftName(workspace.customer.displayName);
        setDraftContact(workspace.customer.contactName ?? "");
        setDraftPhone(workspace.customer.phone ?? "");
        setDraftEmail(workspace.customer.email ?? "");
        setDraftCity(workspace.customer.city ?? "");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPage({ kind: pageErrorKind(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [customerId, reloadToken]);

  const attention = useMemo(
    () => (page.kind === "ready" ? customerWorkspaceAttentionAction(page.workspace) : null),
    [page],
  );

  function setSection(next: CustomerWorkspaceSection) {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        params.set("section", CLIENT_WORKSPACE_SECTION_PATH[next]);
        return params;
      },
      { replace: true },
    );
  }

  async function saveProfile() {
    if (page.kind !== "ready") {
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const patch: CustomerProfilePatch = {
        displayName: draftName.trim(),
        contactName: draftContact.trim() || null,
        phone: draftPhone.trim() || null,
        email: draftEmail.trim() || null,
        city: draftCity.trim() || null,
      };
      await updateCustomer(page.workspace.customer.customerId, patch);
      setEditing(false);
      setReloadToken((value) => value + 1);
    } catch {
      setNotice("Datele clientului nu au putut fi salvate.");
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă clientul…</p>;
  }
  if (page.kind === "forbidden") {
    return <p className="ui20-status">Nu ai acces la acest client.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Clientul nu a putut fi încărcat.</p>;
  }
  if (page.kind === "missing") {
    return <p className="ui20-status">Clientul nu a fost găsit.</p>;
  }

  const { workspace } = page;
  const { customer, summary } = workspace;

  return (
    <article className="ui20-surface" data-surface="client-hub" data-floorplan="relationship-workspace">
      <header className="ui20-registry-head">
        <p className="ui20-k">
          <Link to="/clients">Clienți</Link>
        </p>
        <h1>{customer.displayName}</h1>
        <p className="ui20-kicker">{customerIdentityLine(customer) || "Fără CUI sau contact"}</p>
        <p className="ui20-registry-pulse" aria-label="Activitate client">
          <span>{summary.openRequestCount} cereri deschise</span>
          <span>{summary.quoteCount} oferte</span>
          <span>{summary.jobCount} lucrări</span>
          {attention ? (
            <span data-energy="blocked">{attention.label}</span>
          ) : null}
        </p>
        <p className="ui20-actions">
          <button type="button" className="ui20-button" onClick={() => setEditing((value) => !value)}>
            {editing ? "Închide editarea" : "Editează datele"}
          </button>
          <Link
            className="ui20-link-button"
            data-primary="true"
            to={`/requests?customer=${encodeURIComponent(customer.customerId)}`}
          >
            Cerere nouă
          </Link>
          {attention?.href ? (
            <Link className="ui20-link-button" to={attention.href}>
              {attention.label}
            </Link>
          ) : null}
        </p>
      </header>

      {notice ? <p className="ui20-error">{notice}</p> : null}

      {editing ? (
        <section className="ui20-panel" aria-label="Editează datele">
          <h2>Date client</h2>
          <label className="ui20-field">
            Nume afișat
            <input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
          </label>
          <label className="ui20-field">
            Contact
            <input value={draftContact} onChange={(event) => setDraftContact(event.target.value)} />
          </label>
          <label className="ui20-field">
            Telefon
            <input value={draftPhone} onChange={(event) => setDraftPhone(event.target.value)} />
          </label>
          <label className="ui20-field">
            Email
            <input value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} />
          </label>
          <label className="ui20-field">
            Oraș
            <input value={draftCity} onChange={(event) => setDraftCity(event.target.value)} />
          </label>
          <p className="ui20-actions">
            <button
              type="button"
              className="ui20-button"
              data-primary="true"
              disabled={busy}
              onClick={() => void saveProfile()}
            >
              Salvează
            </button>
          </p>
        </section>
      ) : null}

      <nav className="ui20-filter-row" aria-label="Secțiuni client">
        {clientWorkspaceSectionItems().map((item) => (
          <button
            key={item}
            type="button"
            className="ui20-filter-chip"
            aria-pressed={item === section}
            data-selected={item === section ? "true" : "false"}
            onClick={() => setSection(item)}
          >
            {customerWorkspaceSectionLabel(item)}
          </button>
        ))}
      </nav>

      {section === "OVERVIEW" ? (
        <section className="ui20-panel" aria-label="Prezentare">
          <h2>Prezentare</h2>
          <dl className="ui20-fact">
            <div>
              <dt>CUI</dt>
              <dd>{displayOrUnset(customer.cui)}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{displayOrUnset(customer.contactName)}</dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>{displayOrUnset(customer.phone)}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{displayOrUnset(customer.email)}</dd>
            </div>
            <div>
              <dt>Adresă</dt>
              <dd>{customerAddressLine(customer) ?? "Nesetat"}</dd>
            </div>
            <div>
              <dt>Stare</dt>
              <dd>{customer.status === "ACTIVE" ? "Activ" : "Retras"}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {section === "REQUESTS" ? (
        <HubList
          title="Cereri"
          empty="Nicio cerere pentru acest client."
          rows={workspace.requests.map((item) => ({
            id: item.requestId,
            href: item.href,
            primary: item.reference,
            secondary: item.title,
            meta: `${item.statusLabel} · ${formatClientDate(item.createdAt)}`,
            action: item.nextActionLabel,
          }))}
        />
      ) : null}

      {section === "QUOTES" ? (
        <HubList
          title="Oferte"
          empty="Nicio ofertă pentru acest client."
          rows={workspace.quotes.map((item) => ({
            id: item.quoteSnapshotId,
            href: item.href,
            primary: item.reference,
            secondary: item.inscription,
            meta: `${item.grossDisplay} ${item.currency} · ${item.stageLabel}`,
            action: item.nextActionLabel,
          }))}
        />
      ) : null}

      {section === "JOBS" ? (
        <HubList
          title="Lucrări"
          empty="Nicio lucrare pentru acest client."
          rows={workspace.jobs.map((item) => ({
            id: item.jobId,
            href: item.href,
            primary: item.inscription,
            secondary: item.productLabel,
            meta: `${item.stageLabel} · ${formatClientDate(item.createdAt)}`,
            action: item.nextActionLabel,
          }))}
        />
      ) : null}
    </article>
  );
}

function HubList({
  title,
  empty,
  rows,
}: {
  title: string;
  empty: string;
  rows: Array<{
    id: string;
    href: string;
    primary: string;
    secondary: string;
    meta: string;
    action: string;
  }>;
}) {
  return (
    <section className="ui20-panel" aria-label={title}>
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p>{empty}</p>
      ) : (
        <table className="ui20-worklist">
          <caption className="visually-hidden">{title}</caption>
          <thead>
            <tr>
              <th scope="col">Obiect</th>
              <th scope="col">Context</th>
              <th scope="col">Urmează</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="ui20-work-row">
                <td>
                  <Link to={row.href}>{row.primary}</Link>
                  <span className="ui20-k">{row.secondary}</span>
                </td>
                <td>{row.meta}</td>
                <td>
                  <Link className="ui20-link-button" to={row.href}>
                    {row.action}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
