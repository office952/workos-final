import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCloudSessionOptional } from "./CloudSessionContext";
import { OperatorIdentifyForm } from "./OperatorIdentifyForm";
import { useOperatorSession, isDevOperatorUiEnabled } from "./OperatorSessionContext";
import { fetchSellerProfile } from "./sellerApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { IdentityMenu } from "./ui/IdentityMenu";

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
  const [identifyOpen, setIdentifyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [legalName, setLegalName] = useState<string | null>(null);
  const officeRoute = isAdminOfficeRoute(pathname);

  useEffect(() => {
    if (hash !== "#continut-principal") {
      return;
    }
    document.getElementById("continut-principal")?.focus();
  }, [hash]);

  useEffect(() => {
    if (cloud?.mode !== "cloud" || !cloud.organization) {
      setLegalName(null);
      return;
    }
    let cancelled = false;
    void fetchSellerProfile()
      .then((seller) => {
        if (!cancelled) {
          setLegalName(seller?.legalName?.trim() || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLegalName(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cloud?.mode, cloud?.organization]);

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
            <button
              type="button"
              className="app-meniu-trigger"
              onClick={() => setMenuOpen(true)}
            >
              Meniu
            </button>
            <div className="app-utilities" role="group" aria-label="Utilitare">
              {cloud?.mode === "cloud" && cloud.organization ? (
                <IdentityMenu
                  shortName={cloud.organization.displayName}
                  legalName={legalName}
                  accountLabel={cloud.user?.email ?? cloud.organization.displayName}
                  memberships={cloud.memberships}
                  currentOrganizationId={cloud.organization.organizationId}
                  onSwitchOrganization={(organizationId) => {
                    void cloud.switchOrganization(organizationId);
                  }}
                  onLogout={() => {
                    void cloud.logout();
                  }}
                />
              ) : (
                <IdentityMenu shortName="Atelier Demo" />
              )}
              {officeRoute ? (
                <OfficeOperatorChip
                  ready={ready}
                  operatorName={operator?.displayName ?? null}
                  dev={isDevOperatorUiEnabled()}
                />
              ) : (
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
                        onClick={() => setIdentifyOpen(true)}
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
                    <button type="button" onClick={() => setIdentifyOpen(true)}>
                      Identifică-te
                    </button>
                  )}
                </div>
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
      <main id="continut-principal" className="app-content" tabIndex={-1}>
        {children}
      </main>
      <ActionDrawer title="Meniu" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <nav className="app-meniu-drawer" aria-label="Navigare principală">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isNavItemCurrent(item, pathname, search) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </ActionDrawer>
      <ActionDrawer title="Identifică operatorul" open={identifyOpen} onClose={() => setIdentifyOpen(false)}>
        <OperatorIdentifyForm onIdentified={() => setIdentifyOpen(false)} />
      </ActionDrawer>
    </div>
  );
}

function OfficeOperatorChip({
  ready,
  operatorName,
  dev,
}: {
  ready: boolean;
  operatorName: string | null;
  dev: boolean;
}) {
  if (!ready || !operatorName) {
    return null;
  }
  return (
    <p className="operator-chip operator-chip-passive" aria-label="Operator curent">
      {dev ? <span className="operator-dev-badge">DEV · </span> : null}
      Operator: <strong>{operatorName}</strong>
    </p>
  );
}

function isAdminOfficeRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
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
    return item.matchPrefixes.some((prefix) =>
      COMMERCIAL_PREFIXES.includes(prefix as (typeof COMMERCIAL_PREFIXES)[number]),
    );
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
