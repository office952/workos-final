import { describe, expect, it } from "vitest";
import type { CustomerRegistryItem } from "@workos-final/domain";
import {
  applyClientsAttentionFilter,
  clientIdentityMeta,
  clientsResultCountLabel,
  sortCustomersByDisplayName,
  visibleClients,
} from "./clientsRegistryView";

function item(
  overrides: Partial<CustomerRegistryItem> & Pick<CustomerRegistryItem, "customerId" | "displayName">,
): CustomerRegistryItem {
  return {
    cui: null,
    contactName: null,
    phone: null,
    email: null,
    city: null,
    status: "ACTIVE",
    statusLabel: "Activ",
    openRequestCount: 0,
    quoteCount: 0,
    jobCount: 0,
    needsAttention: false,
    attentionLabel: null,
    href: `/clients/${encodeURIComponent(overrides.customerId)}`,
    ...overrides,
  };
}

describe("clientsRegistryView", () => {
  it("sorts by displayName A–Z without promoting attention", () => {
    const sorted = sortCustomersByDisplayName([
      item({ customerId: "cus:z", displayName: "Zulu SRL", needsAttention: true }),
      item({ customerId: "cus:a", displayName: "Alpha SRL", needsAttention: false }),
      item({ customerId: "cus:m", displayName: "Mid SRL", needsAttention: true }),
    ]);
    expect(sorted.map((row) => row.displayName)).toEqual(["Alpha SRL", "Mid SRL", "Zulu SRL"]);
  });

  it("filters attention from needsAttention, not from attention text", () => {
    const rows = [
      item({
        customerId: "cus:true",
        displayName: "True",
        needsAttention: true,
        attentionLabel: "1 cerere necesită acțiune",
      }),
      item({
        customerId: "cus:false",
        displayName: "False",
        needsAttention: false,
        attentionLabel: "1 cerere necesită acțiune",
      }),
    ];
    expect(applyClientsAttentionFilter(rows, true).map((row) => row.customerId)).toEqual([
      "cus:true",
    ]);
  });

  it("keeps A–Z after the attention filter", () => {
    const visible = visibleClients(
      [
        item({ customerId: "cus:z", displayName: "Zulu", needsAttention: true }),
        item({ customerId: "cus:a", displayName: "Alpha", needsAttention: true }),
        item({ customerId: "cus:quiet", displayName: "Quiet", needsAttention: false }),
      ],
      true,
    );
    expect(visible.map((row) => row.displayName)).toEqual(["Alpha", "Zulu"]);
  });

  it("uses Romanian plural for the result count", () => {
    expect(clientsResultCountLabel(0)).toBe("0 clienți");
    expect(clientsResultCountLabel(1)).toBe("1 client");
    expect(clientsResultCountLabel(27)).toBe("27 clienți");
  });

  it("joins available identity facts and falls back honestly", () => {
    expect(
      clientIdentityMeta(
        item({
          customerId: "cus:1",
          displayName: "Alpha",
          contactName: "Ana",
          cui: "RO1",
          city: "Cluj",
        }),
      ),
    ).toBe("Ana · RO1 · Cluj");
    expect(clientIdentityMeta(item({ customerId: "cus:2", displayName: "Beta" }))).toBe(
      "Fără CUI sau contact",
    );
  });
});
