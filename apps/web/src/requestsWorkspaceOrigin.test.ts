import { afterEach, describe, expect, it } from "vitest";
import {
  bindClientHubOrigin,
  isRequestsWorkspaceOrigin,
  requestObjectBack,
  requestsRegistryReturnHref,
  requestsRegistryReturnState,
  requestsRegistrySearchWithoutCustomer,
  resolveRequestsWorkspaceOrigin,
} from "./requestsWorkspaceOrigin";

const registryOrigin = {
  kind: "registry" as const,
  requestId: "crq:1",
  search: "?q=vest",
  scrollY: 12,
};

const hubOrigin = {
  kind: "client-hub" as const,
  requestId: "crq:1",
  customerId: "cus:alpha",
  customerDisplayName: "Client Alpha S.R.L.",
};

afterEach(() => {
  sessionStorage.clear();
});

describe("requestsWorkspaceOrigin", () => {
  it("accepts only a complete discriminated origin", () => {
    expect(isRequestsWorkspaceOrigin(registryOrigin)).toBe(true);
    expect(isRequestsWorkspaceOrigin(hubOrigin)).toBe(true);
    expect(
      isRequestsWorkspaceOrigin({
        requestId: "crq:1",
        search: "?status=new",
        scrollY: 80,
      }),
    ).toBe(false);
    expect(isRequestsWorkspaceOrigin({ requestId: "crq:1" })).toBe(false);
  });

  it("returns the registry with stored search and does not use Hub as registry", () => {
    expect(requestsRegistryReturnHref(registryOrigin)).toBe("/requests?q=vest");
    expect(requestsRegistryReturnHref(null)).toBe("/requests");
    expect(requestsRegistryReturnHref(hubOrigin)).toBe("/requests");
    expect(requestsRegistryReturnState(null)).toEqual({ requestsFreshVisit: true });
    expect(requestsRegistryReturnState(registryOrigin)).toEqual({
      restoreRequestsRegistryScroll: 12,
    });
    expect(requestsRegistryReturnState(hubOrigin)).toEqual({ requestsFreshVisit: true });
  });

  it("strips Hub customer from a registry return search", () => {
    expect(requestsRegistrySearchWithoutCustomer("?customer=cus%3A1&q=vest")).toBe("?q=vest");
    expect(requestsRegistrySearchWithoutCustomer("?customer=cus:1")).toBe("");
  });

  it("renders registry back as Cereri and Hub back as the real client", () => {
    expect(requestObjectBack(null)).toEqual({
      href: "/requests",
      label: "Cereri",
      ariaLabel: "Înapoi la Cereri",
      state: { requestsFreshVisit: true },
    });
    expect(requestObjectBack(registryOrigin)).toEqual({
      href: "/requests?q=vest",
      label: "Cereri",
      ariaLabel: "Înapoi la Cereri",
      state: { restoreRequestsRegistryScroll: 12 },
    });
    expect(requestObjectBack(hubOrigin)).toEqual({
      href: "/clients/cus%3Aalpha?section=cereri",
      label: "Client Alpha S.R.L.",
      ariaLabel: "Înapoi la Client Alpha S.R.L.",
    });
    expect(bindClientHubOrigin("crq:9", {
      customerId: "cus:alpha",
      customerDisplayName: "Client Alpha S.R.L.",
    })).toEqual({
      ...hubOrigin,
      requestId: "crq:9",
    });
  });

  it("prefers location state over leftover session storage", () => {
    sessionStorage.setItem(
      "workos.requests.workspaceOrigin",
      JSON.stringify({ ...registryOrigin, search: "?q=stale" }),
    );
    expect(resolveRequestsWorkspaceOrigin("crq:1", { requestsWorkspaceOrigin: hubOrigin })).toEqual(
      hubOrigin,
    );
    expect(resolveRequestsWorkspaceOrigin("crq:1", undefined)).toEqual({
      ...registryOrigin,
      search: "?q=stale",
    });
    expect(resolveRequestsWorkspaceOrigin("crq:other", { requestsWorkspaceOrigin: hubOrigin })).toBeNull();
  });
});
