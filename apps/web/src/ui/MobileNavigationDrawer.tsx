import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Ui20PresentationModel } from "../navigation/ui20NavigationPresentation";
import { hasMaiMulte } from "../navigation/ui20NavigationPresentation";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type MobileView = "root" | "commercial" | "more";

function deriveMobileView(activeSlot: Ui20PresentationModel["activeSlot"]): MobileView {
  if (activeSlot === "commercial") {
    return "commercial";
  }
  if (activeSlot === "more") {
    return "more";
  }
  return "root";
}

export function MobileNavigationDrawer({
  open,
  onClose,
  model,
}: {
  open: boolean;
  onClose: () => void;
  model: Ui20PresentationModel;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreTargetRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const [overrideView, setOverrideView] = useState<MobileView | null>(null);
  const view = overrideView ?? deriveMobileView(model.activeSlot);

  useEffect(() => {
    if (!open) {
      setOverrideView(null);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (open && !wasOpenRef.current) {
      restoreTargetRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    wasOpenRef.current = open;

    if (!open) {
      return;
    }
    const panel = panelRef.current;
    if (!panel) {
      return;
    }
    const active = panel.querySelector<HTMLElement>("[aria-current='page']");
    const closeButton = panel.querySelector<HTMLElement>(".app-nav-drawer-close");
    (active ?? closeButton)?.focus();
  }, [open, view, model.activeDestination?.id, model.activeSlot]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const panel = panelRef.current;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) {
        return;
      }
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (node) => !node.hasAttribute("disabled"),
      );
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      const restore = restoreTargetRef.current;
      restoreTargetRef.current = null;
      restore?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const title =
    view === "commercial" ? "Comercial" : view === "more" ? "Mai multe" : "Meniu";

  return (
    <div className="app-nav-drawer-root">
      <button
        type="button"
        className="app-nav-drawer-scrim"
        aria-label="Închide"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="app-nav-drawer-panel ui20-mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="app-nav-drawer-header">
          {view !== "root" ? (
            <button
              type="button"
              className="button-quiet"
              onClick={() => setOverrideView("root")}
            >
              Înapoi
            </button>
          ) : (
            <span />
          )}
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="button-quiet app-nav-drawer-close"
            aria-label="Închide"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {view === "root" ? (
          <nav className="ui20-mobile-list" aria-label="Destinații">
            {model.home ? (
              <MobileLink
                href={model.home.href}
                label={model.home.destination.label}
                active={model.activeSlot === "home"}
                onNavigate={onClose}
              />
            ) : null}
            {model.requests ? (
              <MobileLink
                href={model.requests.href}
                label={model.requests.destination.label}
                active={model.activeSlot === "requests"}
                onNavigate={onClose}
              />
            ) : null}
            {model.commercial.length > 0 ? (
              <button
                type="button"
                className={mobileItemClass(model.activeSlot === "commercial")}
                onClick={() => setOverrideView("commercial")}
              >
                Comercial
              </button>
            ) : null}
            {model.jobs ? (
              <MobileLink
                href={model.jobs.href}
                label={model.jobs.destination.label}
                active={model.activeSlot === "jobs"}
                onNavigate={onClose}
              />
            ) : null}
            {model.atelier ? (
              <MobileLink
                href={model.atelier.href}
                label={model.atelier.destination.label}
                active={model.activeSlot === "atelier"}
                onNavigate={onClose}
              />
            ) : null}
            {hasMaiMulte(model) ? (
              <button
                type="button"
                className={mobileItemClass(model.activeSlot === "more")}
                onClick={() => setOverrideView("more")}
              >
                Mai multe
              </button>
            ) : null}
          </nav>
        ) : null}

        {view === "commercial" ? (
          <nav className="ui20-mobile-list" aria-label="Comercial">
            {model.commercial.map((item) => (
              <MobileLink
                key={item.destination.id}
                href={item.href}
                label={item.destination.label}
                active={model.activeDestination?.id === item.destination.id}
                onNavigate={onClose}
              />
            ))}
          </nav>
        ) : null}

        {view === "more" ? (
          <nav className="ui20-mobile-list" aria-label="Mai multe">
            {model.moreGroups.map((group) => (
              <div key={group.id} className="ui20-mobile-group">
                <p className="global-nav-group-label">{group.label}</p>
                {group.items.map((item) => (
                  <MobileLink
                    key={item.destination.id}
                    href={item.href}
                    label={item.destination.label}
                    active={model.activeDestination?.id === item.destination.id}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function MobileLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={href}
      className={mobileItemClass(active)}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}

function mobileItemClass(active: boolean): string {
  return ["ui20-mobile-item", active ? "is-active" : ""].filter(Boolean).join(" ");
}
