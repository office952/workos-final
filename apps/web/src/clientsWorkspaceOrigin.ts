export const CLIENTS_WORKSPACE_ORIGIN_KEY = "workos.clients.workspaceOrigin";
export const CLIENTS_REGISTRY_RESTORE_SCROLL_KEY = "restoreClientsRegistryScroll";
export const CLIENTS_REGISTRY_FRESH_VISIT_KEY = "clientsFreshVisit";

export type ClientsWorkspaceOrigin = {
  customerId: string;
  search: string;
  scrollY: number;
};

export type ClientsRegistryReturnState = {
  restoreClientsRegistryScroll?: number;
  clientsFreshVisit?: boolean;
  clientsWorkspaceOrigin?: ClientsWorkspaceOrigin;
};

export function isClientsWorkspaceOrigin(value: unknown): value is ClientsWorkspaceOrigin {
  if (!value || typeof value !== "object") {
    return false;
  }
  const origin = value as ClientsWorkspaceOrigin;
  return (
    typeof origin.customerId === "string" &&
    origin.customerId.length > 0 &&
    typeof origin.search === "string" &&
    typeof origin.scrollY === "number" &&
    Number.isFinite(origin.scrollY)
  );
}

export function markClientsWorkspaceOrigin(origin: ClientsWorkspaceOrigin): void {
  sessionStorage.setItem(CLIENTS_WORKSPACE_ORIGIN_KEY, JSON.stringify(origin));
}

export function clearClientsWorkspaceOrigin(): void {
  sessionStorage.removeItem(CLIENTS_WORKSPACE_ORIGIN_KEY);
}

export function readClientsWorkspaceOrigin(customerId: string): ClientsWorkspaceOrigin | null {
  const raw = sessionStorage.getItem(CLIENTS_WORKSPACE_ORIGIN_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isClientsWorkspaceOrigin(parsed) || parsed.customerId !== customerId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function resolveClientsWorkspaceOrigin(
  customerId: string,
  locationState: unknown,
): ClientsWorkspaceOrigin | null {
  if (locationState && typeof locationState === "object") {
    const stateOrigin = (locationState as ClientsRegistryReturnState).clientsWorkspaceOrigin;
    if (isClientsWorkspaceOrigin(stateOrigin) && stateOrigin.customerId === customerId) {
      return stateOrigin;
    }
  }
  return readClientsWorkspaceOrigin(customerId);
}

export function clientsRegistryReturnHref(origin: ClientsWorkspaceOrigin | null): string {
  if (!origin) {
    return "/clients";
  }
  return origin.search.length > 0 ? `/clients${origin.search}` : "/clients";
}

export function clientsRegistryReturnState(
  origin: ClientsWorkspaceOrigin | null,
): ClientsRegistryReturnState {
  if (!origin) {
    return { clientsFreshVisit: true };
  }
  return { restoreClientsRegistryScroll: origin.scrollY };
}
