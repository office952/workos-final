import { customerHref } from "@workos-final/domain";

export const REQUESTS_WORKSPACE_ORIGIN_KEY = "workos.requests.workspaceOrigin";
export const REQUESTS_PENDING_HUB_ORIGIN_KEY = "workos.requests.pendingClientHubOrigin";

export type RequestsRegistryOrigin = {
  kind: "registry";
  requestId: string;
  search: string;
  scrollY: number;
};

export type RequestsClientHubOrigin = {
  kind: "client-hub";
  requestId: string;
  customerId: string;
  customerDisplayName: string;
};

export type RequestsWorkspaceOrigin = RequestsRegistryOrigin | RequestsClientHubOrigin;

export type PendingClientHubOrigin = {
  customerId: string;
  customerDisplayName: string;
};

export type RequestsRegistryReturnState = {
  restoreRequestsRegistryScroll?: number;
  requestsFreshVisit?: boolean;
  requestsWorkspaceOrigin?: RequestsWorkspaceOrigin;
};

export type RequestObjectBack = {
  href: string;
  label: string;
  ariaLabel: string;
  state?: RequestsRegistryReturnState;
};

export function isRequestsRegistryOrigin(value: unknown): value is RequestsRegistryOrigin {
  if (!value || typeof value !== "object") {
    return false;
  }
  const origin = value as RequestsRegistryOrigin;
  return (
    origin.kind === "registry" &&
    typeof origin.requestId === "string" &&
    origin.requestId.length > 0 &&
    typeof origin.search === "string" &&
    typeof origin.scrollY === "number" &&
    Number.isFinite(origin.scrollY)
  );
}

export function isRequestsClientHubOrigin(value: unknown): value is RequestsClientHubOrigin {
  if (!value || typeof value !== "object") {
    return false;
  }
  const origin = value as RequestsClientHubOrigin;
  return (
    origin.kind === "client-hub" &&
    typeof origin.requestId === "string" &&
    origin.requestId.length > 0 &&
    typeof origin.customerId === "string" &&
    origin.customerId.length > 0 &&
    typeof origin.customerDisplayName === "string" &&
    origin.customerDisplayName.length > 0
  );
}

export function isRequestsWorkspaceOrigin(value: unknown): value is RequestsWorkspaceOrigin {
  return isRequestsRegistryOrigin(value) || isRequestsClientHubOrigin(value);
}

export function isPendingClientHubOrigin(value: unknown): value is PendingClientHubOrigin {
  if (!value || typeof value !== "object") {
    return false;
  }
  const origin = value as PendingClientHubOrigin;
  return (
    typeof origin.customerId === "string" &&
    origin.customerId.length > 0 &&
    typeof origin.customerDisplayName === "string" &&
    origin.customerDisplayName.length > 0
  );
}

export function markRequestsWorkspaceOrigin(origin: RequestsWorkspaceOrigin): void {
  sessionStorage.setItem(REQUESTS_WORKSPACE_ORIGIN_KEY, JSON.stringify(origin));
}

export function clearRequestsWorkspaceOrigin(): void {
  sessionStorage.removeItem(REQUESTS_WORKSPACE_ORIGIN_KEY);
}

export function markPendingClientHubOrigin(origin: PendingClientHubOrigin): void {
  sessionStorage.setItem(REQUESTS_PENDING_HUB_ORIGIN_KEY, JSON.stringify(origin));
}

export function clearPendingClientHubOrigin(): void {
  sessionStorage.removeItem(REQUESTS_PENDING_HUB_ORIGIN_KEY);
}

export function readPendingClientHubOrigin(): PendingClientHubOrigin | null {
  const raw = sessionStorage.getItem(REQUESTS_PENDING_HUB_ORIGIN_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isPendingClientHubOrigin(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readRequestsWorkspaceOrigin(requestId: string): RequestsWorkspaceOrigin | null {
  const raw = sessionStorage.getItem(REQUESTS_WORKSPACE_ORIGIN_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRequestsWorkspaceOrigin(parsed) || parsed.requestId !== requestId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function originFromLocationState(
  requestId: string,
  locationState: unknown,
): RequestsWorkspaceOrigin | null {
  if (!requestId || !locationState || typeof locationState !== "object") {
    return null;
  }
  const stateOrigin = (locationState as RequestsRegistryReturnState).requestsWorkspaceOrigin;
  if (!isRequestsWorkspaceOrigin(stateOrigin) || stateOrigin.requestId !== requestId) {
    return null;
  }
  return stateOrigin;
}

export function consumeRequestsWorkspaceSession(requestId: string): void {
  if (!requestId) {
    return;
  }
  if (readRequestsWorkspaceOrigin(requestId)) {
    clearRequestsWorkspaceOrigin();
  }
}

export function resolveRequestsWorkspaceOrigin(
  requestId: string,
  locationState: unknown,
): RequestsWorkspaceOrigin | null {
  return originFromLocationState(requestId, locationState) ?? readRequestsWorkspaceOrigin(requestId);
}

export function bindRequestObjectOrigin(
  requestId: string,
  locationState: unknown,
): RequestsWorkspaceOrigin | null {
  const stateOrigin = originFromLocationState(requestId, locationState);
  if (stateOrigin) {
    consumeRequestsWorkspaceSession(requestId);
    return stateOrigin;
  }
  return readRequestsWorkspaceOrigin(requestId);
}

export function bindClientHubOrigin(
  requestId: string,
  pending: PendingClientHubOrigin,
): RequestsClientHubOrigin {
  return {
    kind: "client-hub",
    requestId,
    customerId: pending.customerId,
    customerDisplayName: pending.customerDisplayName,
  };
}

export function requestsRegistrySearchWithoutCustomer(search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.delete("customer");
  const next = params.toString();
  return next.length > 0 ? `?${next}` : "";
}

export function requestsRegistryReturnHref(origin: RequestsWorkspaceOrigin | null): string {
  if (!origin || origin.kind === "client-hub") {
    return "/requests";
  }
  return origin.search.length > 0 ? `/requests${origin.search}` : "/requests";
}

export function requestsRegistryReturnState(
  origin: RequestsWorkspaceOrigin | null,
): RequestsRegistryReturnState {
  if (!origin || origin.kind !== "registry") {
    return { requestsFreshVisit: true };
  }
  return { restoreRequestsRegistryScroll: origin.scrollY };
}

export function requestObjectBack(origin: RequestsWorkspaceOrigin | null): RequestObjectBack {
  if (origin?.kind === "client-hub") {
    return {
      href: `${customerHref(origin.customerId)}?section=cereri`,
      label: origin.customerDisplayName,
      ariaLabel: `Înapoi la ${origin.customerDisplayName}`,
    };
  }
  return {
    href: requestsRegistryReturnHref(origin),
    label: "Cereri",
    ariaLabel: "Înapoi la Cereri",
    state: requestsRegistryReturnState(origin),
  };
}
