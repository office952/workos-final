import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Ui20PresentationModel } from "../navigation/ui20NavigationPresentation";
import { hasMaiMulte } from "../navigation/ui20NavigationPresentation";

type GlobalNavigationProps = {
  model: Ui20PresentationModel;
  reducedChrome?: boolean;
};

type OpenPanel = "commercial" | "more" | null;

export function GlobalNavigation({ model, reducedChrome = false }: GlobalNavigationProps) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const commercialId = useId();
  const moreId = useId();
  const rootRef = useRef<HTMLElement | null>(null);
  const commercialTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDocumentMouseDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      const closing = open;
      setOpen(null);
      if (closing === "commercial") {
        commercialTriggerRef.current?.focus();
        return;
      }
      if (closing === "more") {
        moreTriggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const showCommercial = !reducedChrome && model.commercial.length > 0;
  const showMore = !reducedChrome && hasMaiMulte(model);
  const showRequests = !reducedChrome && model.requests;
  const showJobs = !reducedChrome && model.jobs;

  return (
    <nav className="global-nav" aria-label="Navigare principală" ref={rootRef}>
      {model.home ? (
        <Link
          to={model.home.href}
          className={navClass(model.activeSlot === "home")}
          aria-current={model.activeSlot === "home" ? "page" : undefined}
        >
          {model.home.destination.label}
        </Link>
      ) : null}

      {showRequests ? (
        <Link
          to={model.requests!.href}
          className={navClass(model.activeSlot === "requests")}
          aria-current={model.activeSlot === "requests" ? "page" : undefined}
        >
          {model.requests!.destination.label}
        </Link>
      ) : null}

      {showCommercial ? (
        <div className="global-nav-popover">
          <button
            ref={commercialTriggerRef}
            type="button"
            className={navClass(model.activeSlot === "commercial", true)}
            aria-expanded={open === "commercial"}
            aria-controls={commercialId}
            onClick={() => setOpen((current) => (current === "commercial" ? null : "commercial"))}
          >
            Comercial
          </button>
          {open === "commercial" ? (
            <div id={commercialId} className="global-nav-panel" role="region" aria-label="Comercial">
              {model.commercial.map((item) => (
                <Link
                  key={item.destination.id}
                  to={item.href}
                  className={panelLinkClass(model.activeDestination?.id === item.destination.id)}
                  aria-current={
                    model.activeDestination?.id === item.destination.id ? "page" : undefined
                  }
                  onClick={() => setOpen(null)}
                >
                  {item.destination.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {showJobs ? (
        <Link
          to={model.jobs!.href}
          className={navClass(model.activeSlot === "jobs")}
          aria-current={model.activeSlot === "jobs" ? "page" : undefined}
        >
          {model.jobs!.destination.label}
        </Link>
      ) : null}

      {model.atelier ? (
        <Link
          to={model.atelier.href}
          className={navClass(model.activeSlot === "atelier")}
          aria-current={model.activeSlot === "atelier" ? "page" : undefined}
        >
          {model.atelier.destination.label}
        </Link>
      ) : null}

      {showMore ? (
        <div className="global-nav-popover">
          <button
            ref={moreTriggerRef}
            type="button"
            className={navClass(model.activeSlot === "more", true)}
            aria-expanded={open === "more"}
            aria-controls={moreId}
            onClick={() => setOpen((current) => (current === "more" ? null : "more"))}
          >
            Mai multe
          </button>
          {open === "more" ? (
            <div id={moreId} className="global-nav-panel" role="region" aria-label="Mai multe">
              {model.moreGroups.map((group) => (
                <div key={group.id} className="global-nav-group">
                  <p className="global-nav-group-label">{group.label}</p>
                  {group.items.map((item) => (
                    <Link
                      key={item.destination.id}
                      to={item.href}
                      className={panelLinkClass(model.activeDestination?.id === item.destination.id)}
                      aria-current={
                        model.activeDestination?.id === item.destination.id ? "page" : undefined
                      }
                      onClick={() => setOpen(null)}
                    >
                      {item.destination.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}

function navClass(active: boolean, isTrigger = false): string {
  return ["global-nav-item", isTrigger ? "is-trigger" : "", active ? "is-active" : ""]
    .filter(Boolean)
    .join(" ");
}

function panelLinkClass(active: boolean): string {
  return ["global-nav-panel-link", active ? "is-active" : ""].filter(Boolean).join(" ");
}
