import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useOperatorSession } from "../../OperatorSessionContext";
import { ThemeSwitcher } from "../../theme/ThemeSwitcher";
import { ContinuityProvider, ObjectContinuity } from "./ObjectContinuity";

function destinationLabel(pathname: string, search: string): string {
  if (pathname === "/" || pathname === "/jobs") {
    return "Lucrări";
  }
  if (pathname === "/requests") {
    return "Cereri";
  }
  if (pathname.startsWith("/requests/")) {
    return "Cerere";
  }
  if (pathname === "/products") {
    return new URLSearchParams(search).get("request") ? "Alegere produs" : "Catalog";
  }
  if (pathname.startsWith("/products/")) {
    return "Configurator";
  }
  if (pathname === "/quotes") {
    return "Oferte";
  }
  if (pathname.startsWith("/quotes/")) {
    return "Ofertă";
  }
  if (pathname.startsWith("/jobs/")) {
    return "Lucrare";
  }
  if (pathname === "/clients" || pathname.startsWith("/clients/")) {
    return "Clienți";
  }
  if (pathname === "/atelier") {
    return "Atelier";
  }
  if (pathname.startsWith("/execution/")) {
    return "Execuție";
  }
  return "Previzualizare";
}

export function Ui20Shell({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();
  const { operator, logout } = useOperatorSession();
  const operational = pathname === "/atelier" || pathname.startsWith("/execution/");
  const label = destinationLabel(pathname, search);

  return (
    <ContinuityProvider>
      <div className="ui20-shell">
        <a className="ui20-skip" href="#continut-principal">
          Sari la conținut
        </a>
        <header className="ui20-top">
          <p className="ui20-brand">WorkOS</p>
          <p className="ui20-destination">{label}</p>
          <nav className="visually-hidden" aria-label="Previzualizare izolată">
            <span>{label}</span>
          </nav>
          <ObjectContinuity />
          <div className="ui20-top-actions">
            {operational && operator ? (
              <p className="ui20-operator">
                <span>{operator.displayName}</span>
                <button type="button" onClick={() => void logout()}>
                  Ieși
                </button>
              </p>
            ) : null}
            <ThemeSwitcher />
          </div>
        </header>
        <main id="continut-principal" className="ui20-main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </ContinuityProvider>
  );
}
