import type { CatalogItem, OwnerCatalog } from "./ownerCatalog";

export function itemMatchesQuery(item: CatalogItem, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  const haystack = [
    item.label,
    item.kindLabel,
    item.summary ?? "",
    item.listHint ?? "",
    ...(item.chips ?? []).map((chip) => chip.label),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function findCatalogItem(
  catalog: OwnerCatalog,
  itemId: string,
): CatalogItem | undefined {
  for (const category of catalog.categories) {
    const match = category.items.find((item) => item.id === itemId);
    if (match) {
      return match;
    }
  }
  return undefined;
}

export function findCatalogCategoryId(
  catalog: OwnerCatalog,
  itemId: string,
): string | undefined {
  return catalog.categories.find((category) =>
    category.items.some((item) => item.id === itemId),
  )?.id;
}
