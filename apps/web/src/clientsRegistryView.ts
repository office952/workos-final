import type { CustomerRegistryItem } from "@workos-final/domain";

export function sortCustomersByDisplayName(
  items: readonly CustomerRegistryItem[],
): CustomerRegistryItem[] {
  return [...items].sort((left, right) => {
    const byName = left.displayName.localeCompare(right.displayName, "ro", {
      sensitivity: "base",
      numeric: true,
    });
    if (byName !== 0) {
      return byName;
    }
    return left.customerId.localeCompare(right.customerId);
  });
}

export function applyClientsAttentionFilter(
  items: readonly CustomerRegistryItem[],
  attentionOnly: boolean,
): readonly CustomerRegistryItem[] {
  return attentionOnly ? items.filter((item) => item.needsAttention) : items;
}

export function visibleClients(
  items: readonly CustomerRegistryItem[],
  attentionOnly: boolean,
): CustomerRegistryItem[] {
  return sortCustomersByDisplayName(applyClientsAttentionFilter(items, attentionOnly));
}

export function clientsResultCountLabel(count: number): string {
  return count === 1 ? "1 client" : `${count} clienți`;
}

export function clientIdentityMeta(item: CustomerRegistryItem): string {
  const parts = [item.contactName, item.cui, item.city].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(" · ") : "Fără CUI sau contact";
}
