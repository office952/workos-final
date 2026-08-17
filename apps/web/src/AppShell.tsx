import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

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
  return params.has("request") || params.has("quote") || params.has("order");
}
