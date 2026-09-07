import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useOperatorSession } from "../../OperatorSessionContext";
import { ThemeSwitcher } from "../../theme/ThemeSwitcher";
import { ContinuityProvider, ObjectContinuity } from "./ObjectContinuity";

function destinationLabel(pathname: string): string {
  if (pathname.startsWith("/requests/")) {
    return "Cerere";
  }
  if (pathname === "/products") {
    return "Alegere produs";
  }
  if (pathname.startsWith("/products/")) {
    return "Configurator";
  }
  if (pathname.startsWith("/quotes/")) {
    return "Ofertă";
  }
  if (pathname.startsWith("/jobs/")) {
    return "Lucrare";
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
  const { pathname } = useLocation();
  const { operator, logout } = useOperatorSession();
  const operational = pathname === "/atelier" || pathname.startsWith("/execution/");

  return (
    <ContinuityProvider>
      <div className="ui20-shell">
        <a className="ui20-skip" href="#continut-principal">
          Sari la conținut
        </a>
        <header className="ui20-top">
          <p className="ui20-brand">WorkOS</p>
          <nav className="visually-hidden" aria-label="Previzualizare izolată">
            <span>{destinationLabel(pathname)}</span>
          </nav>
          <p className="ui20-status">{destinationLabel(pathname)}</p>
          <ObjectContinuity />
          {operational && operator ? (
            <p>
              <span>{operator.displayName}</span>{" "}
              <button type="button" onClick={() => void logout()}>
                Ieși
              </button>
            </p>
          ) : null}
          <ThemeSwitcher />
        </header>
        <main id="continut-principal" className="ui20-main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </ContinuityProvider>
  );
}
