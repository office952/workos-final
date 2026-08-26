import { describe, expect, it } from "vitest";
import {
  findCatalogCategoryId,
  findCatalogItem,
  itemMatchesQuery,
} from "./catalogQuery";
import type { OwnerCatalog } from "./ownerCatalog";

const catalog: OwnerCatalog = {
  categories: [
    {
      id: "materials",
      label: "Materiale",
      kindLabel: "Categorie",
      items: [
        {
          id: "family:PLEXIGLAS",
          label: "Plexiglas",
          kindLabel: "Familie",
          groups: [],
        },
        {
          id: "family:FOREX",
          label: "Forex",
          kindLabel: "Familie",
          groups: [],
        },
      ],
    },
  ],
};

describe("catalogQuery", () => {
  it("resolves a stable catalog id and its category", () => {
    expect(findCatalogItem(catalog, "family:PLEXIGLAS")?.label).toBe("Plexiglas");
    expect(findCatalogCategoryId(catalog, "family:PLEXIGLAS")).toBe("materials");
    expect(findCatalogItem(catalog, "nu-exista")).toBeUndefined();
  });

  it("filters by label without inventing a new id", () => {
    expect(itemMatchesQuery(catalog.categories[0].items[0], "plexi")).toBe(true);
    expect(itemMatchesQuery(catalog.categories[0].items[0], "forex")).toBe(false);
  });
});
