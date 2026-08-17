import { describe, expect, it } from "vitest";
import {
  createCustomer,
  generateCustomerId,
  renameCustomer,
  retireCustomer,
} from "./identity.js";

describe("commercial customer identity", () => {
  it("creates an ACTIVE customer with a stable generated id", () => {
    const created = createCustomer("SC Exemplu SRL", {
      createdAt: "2026-08-17T08:00:00.000Z",
    });
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }
    expect(created.customer.customerId.startsWith("cus:")).toBe(true);
    expect(created.customer.displayName).toBe("SC Exemplu SRL");
    expect(created.customer.status).toBe("ACTIVE");
    expect(created.customer.createdAt).toBe("2026-08-17T08:00:00.000Z");
    expect(created.customer.updatedAt).toBe("2026-08-17T08:00:00.000Z");
    expect(created.customer.retiredAt).toBeNull();
    expect(created.customer.customerId).not.toBe("SC Exemplu SRL");
  });

  it("keeps customerId when the display name changes", () => {
    const created = createCustomer("SC Exemplu SRL", {
      customerId: "cus:test-stable",
    });
    if (!created.ok) {
      throw new Error("expected customer");
    }
    const renamed = renameCustomer(
      created.customer,
      "SC Exemplu Nou SRL",
      "2026-08-17T09:00:00.000Z",
    );
    expect(renamed).toEqual({
      ok: true,
      alreadyApplied: false,
      customer: {
        ...created.customer,
        displayName: "SC Exemplu Nou SRL",
        updatedAt: "2026-08-17T09:00:00.000Z",
      },
    });
    expect(generateCustomerId().startsWith("cus:")).toBe(true);
  });

  it("allows two customers with the same display name", () => {
    const first = createCustomer("Client Demo", { customerId: "cus:one" });
    const second = createCustomer("Client Demo", { customerId: "cus:two" });
    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }
    expect(first.customer.displayName).toBe(second.customer.displayName);
    expect(first.customer.customerId).not.toBe(second.customer.customerId);
  });

  it("retires a customer without deleting identity", () => {
    const created = createCustomer("Client retras");
    if (!created.ok) {
      throw new Error("expected customer");
    }
    const retired = retireCustomer(created.customer, "2026-08-17T10:00:00.000Z");
    expect(retired.ok).toBe(true);
    if (!retired.ok) {
      return;
    }
    expect(retired.customer.customerId).toBe(created.customer.customerId);
    expect(retired.customer.status).toBe("RETIRED");
    expect(retired.customer.retiredAt).toBe("2026-08-17T10:00:00.000Z");
    expect(retired.customer.updatedAt).toBe("2026-08-17T10:00:00.000Z");
    expect(retireCustomer(retired.customer, "2026-08-17T11:00:00.000Z")).toEqual({
      ok: true,
      alreadyApplied: true,
      customer: retired.customer,
    });
  });

  it("rejects an empty or oversized name", () => {
    expect(createCustomer("   ")).toEqual({ ok: false, error: "invalid_name" });
    expect(createCustomer("x".repeat(81))).toEqual({ ok: false, error: "invalid_name" });
  });
});
