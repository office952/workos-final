import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const CLIENTS_REGISTRY_SCROLL_PREFIX = "workos.clients.registry.scroll:";
const RESTORE_FRAME_BUDGET = 24;

export function clientsRegistryScrollStorageKey(locationKey: string): string {
  return `${CLIENTS_REGISTRY_SCROLL_PREFIX}${locationKey}`;
}

function documentScrollRoot(): HTMLElement {
  return document.scrollingElement instanceof HTMLElement
    ? document.scrollingElement
    : document.documentElement;
}

function scrollingElement(): HTMLElement {
  const column = document.querySelector(".app-shell-column");
  if (column instanceof HTMLElement && column.scrollHeight > column.clientHeight + 1) {
    return column;
  }
  return documentScrollRoot();
}

function readScrollY(): number {
  const column = document.querySelector(".app-shell-column");
  if (column instanceof HTMLElement && column.scrollTop > 0) {
    return column.scrollTop;
  }
  return documentScrollRoot().scrollTop || window.scrollY;
}

function writeScrollY(y: number) {
  const column = document.querySelector(".app-shell-column");
  if (column instanceof HTMLElement) {
    column.scrollTop = y;
  }
  window.scrollTo(0, y);
  documentScrollRoot().scrollTop = y;
}

function reachableScrollY(target: number): number {
  const node = scrollingElement();
  const maxScroll = Math.max(0, node.scrollHeight - node.clientHeight);
  return Math.min(target, maxScroll);
}

export function persistClientsRegistryScroll(locationKey: string) {
  if (!locationKey) {
    return;
  }
  sessionStorage.setItem(clientsRegistryScrollStorageKey(locationKey), String(readScrollY()));
}

export function readClientsRegistryScrollY(): number {
  return readScrollY();
}

export function restoreClientsRegistryScrollY(y: number) {
  writeScrollY(y);
}

export function useClientsRegistryScroll(enabled: boolean) {
  const location = useLocation();
  const { key, state } = location;
  const restoringRef = useRef(false);
  const restoreY =
    state && typeof state === "object" && "restoreClientsRegistryScroll" in state
      ? (state as { restoreClientsRegistryScroll?: unknown }).restoreClientsRegistryScroll
      : undefined;
  const freshVisit =
    state && typeof state === "object" && "clientsFreshVisit" in state
      ? Boolean((state as { clientsFreshVisit?: unknown }).clientsFreshVisit)
      : false;

  useLayoutEffect(() => {
    if (!enabled || typeof history === "undefined" || !("scrollRestoration" in history)) {
      return;
    }
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, [enabled]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (freshVisit) {
      restoringRef.current = false;
      writeScrollY(0);
      return;
    }
    const stored =
      key && sessionStorage.getItem(clientsRegistryScrollStorageKey(key));
    const storedY = stored ? Number(stored) : Number.NaN;
    const target =
      typeof restoreY === "number" && Number.isFinite(restoreY) && restoreY > 0
        ? restoreY
        : Number.isFinite(storedY) && storedY > 0
          ? storedY
          : null;
    if (target === null) {
      return;
    }

    restoringRef.current = true;
    writeScrollY(target);
    let frames = 0;
    let raf = 0;
    const tick = () => {
      frames += 1;
      writeScrollY(target);
      const reached = reachableScrollY(target);
      if (reached >= target - 1 && Math.abs(readScrollY() - reached) <= 1) {
        restoringRef.current = false;
        return;
      }
      if (frames < RESTORE_FRAME_BUDGET) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      restoringRef.current = false;
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
      restoringRef.current = false;
    };
  }, [enabled, freshVisit, key, restoreY]);

  useEffect(() => {
    if (!enabled || !key) {
      return;
    }
    const persist = () => {
      if (restoringRef.current) {
        return;
      }
      persistClientsRegistryScroll(key);
    };
    window.addEventListener("scroll", persist, { passive: true });
    const column = document.querySelector(".app-shell-column");
    column?.addEventListener("scroll", persist, { passive: true });
    return () => {
      window.removeEventListener("scroll", persist);
      column?.removeEventListener("scroll", persist);
    };
  }, [enabled, key]);
}
