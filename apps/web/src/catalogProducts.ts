import type { CatalogTreeNode } from "@workos-final/domain";

export type CatalogProductItem = {
  code: string;
  label: string;
  description: string;
  familyId: string | null;
  familyLabel: string | null;
  categoryLabel: string | null;
};

export function flattenCatalogProducts(
  nodes: readonly CatalogTreeNode[],
  context: { familyId?: string; familyLabel?: string; categoryLabel?: string } = {},
): CatalogProductItem[] {
  return nodes.flatMap((node) => {
    switch (node.kind) {
      case "family":
        return flattenCatalogProducts(node.children, {
          familyId: node.id,
          familyLabel: node.label,
        });
      case "category":
        return flattenCatalogProducts(node.children, {
          ...context,
          categoryLabel: node.label,
        });
      case "product":
        return [
          {
            code: node.code,
            label: node.label,
            description: node.description,
            familyId: context.familyId ?? null,
            familyLabel: context.familyLabel ?? null,
            categoryLabel: context.categoryLabel ?? null,
          },
        ];
      default: {
        const _exhaustive: never = node;
        return _exhaustive;
      }
    }
  });
}

export function catalogFamilyFilters(products: readonly CatalogProductItem[]): Array<{
  id: string;
  label: string;
}> {
  const seen = new Map<string, string>();
  for (const product of products) {
    if (product.familyId && product.familyLabel && !seen.has(product.familyId)) {
      seen.set(product.familyId, product.familyLabel);
    }
  }
  return [...seen.entries()].map(([id, label]) => ({ id, label }));
}
