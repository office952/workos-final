import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export const CLIENTS_REGISTRY_SCROLL_PREFIX = "workos.clients.registry.scroll:";

export function clientsRegistryScrollStorageKey(locationKey: string): string {
  return `${CLIENTS_REGISTRY_SCROLL_PREFIX}${locationKey}`;
}

function scrollRoot(): HTMLElement {
  return document.scrollingElement instanceof HTMLElement
    ? document.scrollingElement
    : document.documentElement;
}

function readScrollY(): number {
  const column = document.querySelector(".app-shell-column");
  if (column instanceof HTMLElement && column.scrollTop > 0) {
    return column.scrollTop;
  }
  return scrollRoot().scrollTop || window.scrollY;
}

function writeScrollY(y: number) {
  const column = document.querySelector(".app-shell-column");
  if (column instanceof HTMLElement) {
    column.scrollTop = y;
  }
  window.scrollTo(0, y);
  scrollRoot().scrollTop = y;
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
  const restoreY =
    state && typeof state === "object" && "restoreClientsRegistryScroll" in state
      ? (state as { restoreClientsRegistryScroll?: unknown }).restoreClientsRegistryScroll
      : undefined;
  const freshVisit =
    state && typeof state === "object" && "clientsFreshVisit" in state
      ? Boolean((state as { clientsFreshVisit?: unknown }).clientsFreshVisit)
      : false;

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (freshVisit) {
      writeScrollY(0);
      return;
    }
    if (typeof restoreY === "number" && Number.isFinite(restoreY) && restoreY > 0) {
      writeScrollY(restoreY);
      const frame = window.requestAnimationFrame(() => {
        writeScrollY(restoreY);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (!key) {
      return;
    }
    const raw = sessionStorage.getItem(clientsRegistryScrollStorageKey(key));
    if (!raw) {
      return;
    }
    const y = Number(raw);
    if (!Number.isFinite(y) || y <= 0) {
      return;
    }
    writeScrollY(y);
    const frame = window.requestAnimationFrame(() => {
      writeScrollY(y);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [enabled, freshVisit, key, restoreY]);

  useEffect(() => {
    if (!enabled || !key) {
      return;
    }
    const persist = () => {
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
