import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Ui20PresentationModel } from "../navigation/ui20NavigationPresentation";
import { GlobalNavigation } from "./GlobalNavigation";

type GlobalShellTopProps = {
  model: Ui20PresentationModel;
  reducedChrome?: boolean;
  onOpenMenu: () => void;
  utilities: ReactNode;
};

export function GlobalShellTop({
  model,
  reducedChrome = false,
  onOpenMenu,
  utilities,
}: GlobalShellTopProps) {
  return (
    <header className={reducedChrome ? "global-shell-top is-reduced" : "global-shell-top"}>
      <div className="global-shell-top-inner">
        <div className="global-shell-brand-row">
          <Link to="/" className="global-shell-brand" aria-label="WorkOS — Lucrări">
            WorkOS
          </Link>
          <button type="button" className="app-meniu-trigger" onClick={onOpenMenu}>
            Meniu
          </button>
        </div>
        <div className="global-shell-nav-desktop">
          <GlobalNavigation model={model} reducedChrome={reducedChrome} />
        </div>
        <div className="global-shell-utilities" role="group" aria-label="Utilitare">
          {utilities}
        </div>
      </div>
    </header>
  );
}
