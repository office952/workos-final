import { useEffect, useId, useRef } from "react";
import type { NavigationDestination } from "../navigation/navigationRegistry";
import { StableSidebar } from "./StableSidebar";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function MobileNavigationDrawer({
  open,
  onClose,
  destinations,
}: {
  open: boolean;
  onClose: () => void;
  destinations: readonly NavigationDestination[];
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const active = panel?.querySelector<HTMLElement>("[aria-current='page']");
    const closeButton = panel?.querySelector<HTMLElement>(".app-nav-drawer-close");
    (active ?? closeButton)?.focus();

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
      const restore = previouslyFocused.current;
      queueMicrotask(() => restore?.focus());
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

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
        className="app-nav-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="app-nav-drawer-header">
          <h2 id={titleId}>Meniu</h2>
          <button
            type="button"
            className="button-quiet app-nav-drawer-close"
            aria-label="Închide"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <StableSidebar
          destinations={destinations}
          collapsed={false}
          variant="drawer"
          onNavigate={onClose}
        />
      </div>
    </div>
  );
}
