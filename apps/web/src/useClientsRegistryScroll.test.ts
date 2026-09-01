import { describe, expect, it } from "vitest";
import {
  CLIENTS_REGISTRY_SCROLL_PREFIX,
  clientsRegistryScrollStorageKey,
} from "./useClientsRegistryScroll";

describe("clientsRegistryScrollStorageKey", () => {
  it("scopes stored scroll to one history entry", () => {
    expect(clientsRegistryScrollStorageKey("abc123")).toBe(
      `${CLIENTS_REGISTRY_SCROLL_PREFIX}abc123`,
    );
    expect(clientsRegistryScrollStorageKey("abc123")).not.toBe(
      clientsRegistryScrollStorageKey("def456"),
    );
  });
});
