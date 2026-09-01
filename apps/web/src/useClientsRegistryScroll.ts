import { useEffect, useLayoutEffect } from "react";

const STORAGE_KEY = "workos.clients.registry.scroll";

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

export function persistClientsRegistryScroll() {
  sessionStorage.setItem(STORAGE_KEY, String(readScrollY()));
}

export function useClientsRegistryScroll(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const raw = sessionStorage.getItem(STORAGE_KEY);
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
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const persist = () => {
      persistClientsRegistryScroll();
    };
    window.addEventListener("scroll", persist, { passive: true });
    const column = document.querySelector(".app-shell-column");
    column?.addEventListener("scroll", persist, { passive: true });
    return () => {
      window.removeEventListener("scroll", persist);
      column?.removeEventListener("scroll", persist);
    };
  }, [enabled]);
}
