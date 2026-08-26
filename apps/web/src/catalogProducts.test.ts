import { describe, expect, it } from "vitest";
import type { CatalogTreeNode } from "@workos-final/domain";
import { catalogFamilyFilters, flattenCatalogProducts } from "./catalogProducts";

const tree: CatalogTreeNode[] = [
  {
    kind: "family",
    id: "F1",
    label: "Litere",
    description: "",
    children: [
      {
        kind: "category",
        id: "C1",
        label: "Volumetrice",
        children: [
          {
            kind: "product",
            code: "P1",
            label: "Litere volumetrice",
            description: "Configurabil",
          },
        ],
      },
    ],
  },
];

describe("catalogProducts", () => {
  it("flattens nested catalog trees without product-system language", () => {
    const products = flattenCatalogProducts(tree);
    expect(products).toEqual([
      {
        code: "P1",
        label: "Litere volumetrice",
        description: "Configurabil",
        familyId: "F1",
        familyLabel: "Litere",
        categoryLabel: "Volumetrice",
      },
    ]);
    expect(catalogFamilyFilters(products)).toEqual([{ id: "F1", label: "Litere" }]);
  });
});
