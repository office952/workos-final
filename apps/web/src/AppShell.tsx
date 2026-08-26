import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCloudSessionOptional } from "./CloudSessionContext";
import { OperatorIdentifyForm } from "./OperatorIdentifyForm";
import { useOperatorSession, isDevOperatorUiEnabled } from "./OperatorSessionContext";
import { ThemeSwitcher } from "./theme/ThemeSwitcher";
import { ActionDrawer } from "./ui/ActionDrawer";

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
  const { pathname, search, hash } = useLocation();
  const commercial =
    isPrefixActive(pathname, COMMERCIAL_PREFIXES) || isProductCommercialPath(pathname, search);
  const cloud = useCloudSessionOptional();
  const { ready, operator, logout } = useOperatorSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hash !== "#continut-principal") {
      return;
    }
    document.getElementById("continut-principal")?.focus();
  }, [hash]);

  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) {
      return;
    }
    document.getElementById("continut-principal")?.focus();
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#continut-principal" onClick={skipToContent}>
        Sari la conținut
      </a>
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
                    aria-current={isNavItemCurrent(item, pathname, search) ? "page" : undefined}
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
            <div className="app-utilities" role="group" aria-label="Utilitare">
              <ThemeSwitcher />
              {cloud?.mode === "cloud" && cloud.organization ? (
                <div className="organization-chip" aria-label="Organizație curentă">
                  <span
                    className="utility-truncate"
                    title={cloud.user?.email ?? cloud.organization.displayName}
                  >
                    Cont: <strong>{cloud.user?.email ?? cloud.organization.displayName}</strong>
                  </span>
                  <span className="utility-truncate" title={cloud.organization.displayName}>
                    Organizație: <strong>{cloud.organization.displayName}</strong>
                  </span>
                  {cloud.memberships.length > 1 ? (
                    <select
                      aria-label="Schimbă organizația"
                      value={cloud.organization.organizationId}
                      onChange={(event) => {
                        void cloud.switchOrganization(event.target.value);
                      }}
                    >
                      {cloud.memberships.map((item) => (
                        <option key={item.organizationId} value={item.organizationId}>
                          {item.displayName}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <button
                    type="button"
                    className="button-quiet"
                    onClick={() => {
                      void cloud.logout();
                    }}
                  >
                    Ieși din cont
                  </button>
                </div>
              ) : (
                <p className="account-chip" aria-label="Cont" title="Cont: atelier local">
                  Cont: atelier local
                </p>
              )}
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
                      onClick={() => setOpen(true)}
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
                  <button type="button" onClick={() => setOpen(true)}>
                    Identifică-te
                  </button>
                )}
              </div>
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
      <main id="continut-principal" className="app-content" tabIndex={-1}>
        {children}
      </main>
      <ActionDrawer title="Identifică operatorul" open={open} onClose={() => setOpen(false)}>
        <OperatorIdentifyForm onIdentified={() => setOpen(false)} />
      </ActionDrawer>
    </div>
  );
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
  return params.has("quote") || params.has("order");
}

function isNavItemCurrent(item: AppNavItem, pathname: string, search: string): boolean {
  if (item.to === "/" && pathname === "/") {
    return true;
  }
  if (item.matchPrefixes && isPrefixActive(pathname, item.matchPrefixes)) {
    return true;
  }
  if (item.matchPrefixes && isProductCommercialPath(pathname, search)) {
    return item.matchPrefixes.some((prefix) => COMMERCIAL_PREFIXES.includes(prefix as (typeof COMMERCIAL_PREFIXES)[number]));
  }
  return false;
}
