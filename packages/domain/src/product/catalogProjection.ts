import {
  buildCatalogTree,
  productCategories,
  productFamilies,
} from "./catalog.js";
import { productTemplates } from "./frontlitPlexiAl06.js";
import type { CatalogTreeNode } from "./types.js";

export function projectProductCatalog(): CatalogTreeNode[] {
  return buildCatalogTree(productFamilies, productCategories, productTemplates);
}
