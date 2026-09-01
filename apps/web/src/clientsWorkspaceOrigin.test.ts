import { afterEach, describe, expect, it } from "vitest";
import {
  CLIENTS_WORKSPACE_ORIGIN_KEY,
  clearClientsWorkspaceOrigin,
  clientsRegistryReturnHref,
  clientsRegistryReturnState,
  markClientsWorkspaceOrigin,
  readClientsWorkspaceOrigin,
  resolveClientsWorkspaceOrigin,
} from "./clientsWorkspaceOrigin";

afterEach(() => {
  sessionStorage.removeItem(CLIENTS_WORKSPACE_ORIGIN_KEY);
});

describe("clientsWorkspaceOrigin", () => {
  it("returns the stored origin only for the same customer", () => {
    markClientsWorkspaceOrigin({
      customerId: "cus:alpha",
      search: "?q=alpha&status=active&attention=1",
      scrollY: 240,
    });
    expect(readClientsWorkspaceOrigin("cus:alpha")).toEqual({
      customerId: "cus:alpha",
      search: "?q=alpha&status=active&attention=1",
      scrollY: 240,
    });
    expect(readClientsWorkspaceOrigin("cus:beta")).toBeNull();
    expect(clientsRegistryReturnHref(readClientsWorkspaceOrigin("cus:alpha"))).toBe(
      "/clients?q=alpha&status=active&attention=1",
    );
  });

  it("falls back to a fresh clients visit without a matching origin", () => {
    expect(resolveClientsWorkspaceOrigin("cus:alpha", null)).toBeNull();
    expect(clientsRegistryReturnHref(null)).toBe("/clients");
    expect(clientsRegistryReturnState(null)).toEqual({ clientsFreshVisit: true });
  });

  it("prefers the current history-entry origin over leftover storage", () => {
    markClientsWorkspaceOrigin({
      customerId: "cus:alpha",
      search: "?q=stale&status=all",
      scrollY: 400,
    });
    expect(
      resolveClientsWorkspaceOrigin("cus:alpha", {
        clientsWorkspaceOrigin: {
          customerId: "cus:alpha",
          search: "?q=live&status=active",
          scrollY: 80,
        },
      }),
    ).toEqual({
      customerId: "cus:alpha",
      search: "?q=live&status=active",
      scrollY: 80,
    });
  });

  it("does not reuse storage after the registry consumes the origin", () => {
    markClientsWorkspaceOrigin({
      customerId: "cus:alpha",
      search: "?q=alpha&status=active&attention=1",
      scrollY: 240,
    });
    clearClientsWorkspaceOrigin();
    expect(readClientsWorkspaceOrigin("cus:alpha")).toBeNull();
    expect(resolveClientsWorkspaceOrigin("cus:alpha", null)).toBeNull();
    expect(clientsRegistryReturnHref(null)).toBe("/clients");
  });
});
