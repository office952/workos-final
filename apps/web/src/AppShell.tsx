import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { OperatorCandidate } from "@workos-final/domain";
import { useOperatorSession, isDevOperatorUiEnabled } from "./OperatorSessionContext";
import { fetchOperatorCandidates } from "./operatorSessionApi";
import { Field } from "./ui/Field";

export type AppNavItem = {
  to: string;
  label: string;
  end?: boolean;
  matchPrefixes?: readonly string[];
};

type AppShellProps = {
  children: ReactNode;
  navItems: readonly AppNavItem[];
};

const COMMERCIAL_PREFIXES = ["/requests", "/quotes", "/clients"] as const;

export function AppShell({ children, navItems }: AppShellProps) {
  const { pathname, search } = useLocation();
  const commercial =
    isPrefixActive(pathname, COMMERCIAL_PREFIXES) || isProductCommercialPath(pathname, search);
  const { ready, operator, identify, logout } = useOperatorSession();
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState<OperatorCandidate[]>([]);
  const [personId, setPersonId] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;
    void fetchOperatorCandidates()
      .then((list) => {
        if (cancelled) {
          return;
        }
        const withPin = list.filter((candidate) => candidate.pinConfigured);
        setCandidates(withPin);
        setPersonId((current) =>
          withPin.some((candidate) => candidate.personId === current)
            ? current
            : withPin[0]?.personId || "",
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError("Lista de operatori nu a putut fi încărcată.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function submitIdentify(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await identify(personId, pin);
      if (!result.ok) {
        setError(identifyErrorLabel(result.error));
        return;
      }
      setPin("");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-row">
            <p className="app-brand">
              <Link to="/">WorkOS Final</Link>
            </p>
            <nav className="app-nav" aria-label="Navigare principală">
              {navItems.map((item) =>
                item.matchPrefixes ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={
                      isPrefixActive(pathname, item.matchPrefixes) ||
                      isProductCommercialPath(pathname, search)
                        ? "page"
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                ) : (
                  <NavLink key={item.to} to={item.to} end={item.end ?? item.to === "/"}>
                    {item.label}
                  </NavLink>
                ),
              )}
            </nav>
            <div className="operator-chip" aria-label="Operator curent">
              {!ready ? (
                <span className="operator-chip-muted">Se verifică operatorul…</span>
              ) : operator ? (
                <>
                  <span>
                    {isDevOperatorUiEnabled() ? (
                      <span className="operator-dev-badge">DEV · </span>
                    ) : null}
                    Operator: <strong>{operator.displayName}</strong>
                  </span>
                  <button
                    type="button"
                    className="button-quiet"
                    onClick={() => {
                      setOpen(true);
                      setError(null);
                      setPin("");
                    }}
                  >
                    Schimbă
                  </button>
                  <button
                    type="button"
                    className="button-quiet"
                    onClick={() => {
                      void logout();
                    }}
                  >
                    Ieși
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(true);
                    setError(null);
                    setPin("");
                  }}
                >
                  Identifică-te
                </button>
              )}
            </div>
          </div>
          {commercial ? (
            <nav className="app-subnav" aria-label="Navigare comercială">
              <NavLink to="/requests">Cereri</NavLink>
              <NavLink to="/quotes">Oferte</NavLink>
              <NavLink to="/clients">Clienți</NavLink>
            </nav>
          ) : null}
        </div>
      </header>
      <main className="app-content">{children}</main>
      {open ? (
        <dialog
          className="operator-modal"
          open
          aria-label="Identificare operator"
          onCancel={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <form className="operator-modal-card" onSubmit={submitIdentify}>
            <h2>Identifică operatorul</h2>
            <p className="client-current-hint">
              PIN-ul spune cine lucrează acum pe acest terminal. Nu este cont, rol sau pontaj.
            </p>
            <Field label="Persoană">
              <select
                value={personId}
                onChange={(event) => setPersonId(event.target.value)}
                disabled={busy || candidates.length === 0}
              >
                {candidates.length === 0 ? (
                  <option value="">Nicio persoană cu PIN</option>
                ) : (
                  candidates.map((candidate) => (
                    <option key={candidate.personId} value={candidate.personId}>
                      {candidate.displayName}
                      {candidate.availability === "TEMPORARILY_UNAVAILABLE"
                        ? ` (${candidate.availabilityLabel})`
                        : ""}
                    </option>
                  ))
                )}
              </select>
            </Field>
            <Field label="PIN">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                disabled={busy}
              />
            </Field>
            {error ? <p className="status-bad">{error}</p> : null}
            <div className="operator-modal-actions">
              <button
                type="button"
                className="button-quiet"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Anulează
              </button>
              <button type="submit" disabled={busy || personId.length === 0 || pin.length < 4}>
                Confirmă
              </button>
            </div>
          </form>
        </dialog>
      ) : null}
    </div>
  );
}

function identifyErrorLabel(error: string): string {
  switch (error) {
    case "invalid_pin":
      return "PIN greșit.";
    case "not_configured":
      return "Această persoană nu are PIN configurat.";
    case "retired_person":
      return "Persoana nu mai este activă.";
    case "rate_limited":
      return "Prea multe încercări. Așteaptă puțin.";
    case "unknown_person":
      return "Persoana nu a fost găsită.";
    default:
      return "Identificarea nu a reușit.";
  }
}

function isPrefixActive(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isProductCommercialPath(pathname: string, search: string): boolean {
  if (!pathname.startsWith("/products/")) {
    return false;
  }
  const params = new URLSearchParams(search);
  return params.has("request") || params.has("quote") || params.has("order");
}
