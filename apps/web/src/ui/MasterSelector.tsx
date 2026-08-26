import { useMemo, useState } from "react";
import type { CatalogCategory, CatalogItem, OwnerCatalog } from "../ownerCatalog";
import { findCatalogCategoryId, itemMatchesQuery } from "../catalogQuery";
import { Field } from "./Field";

export function MasterSelector({
  catalog,
  selectedItemId,
  onSelect,
}: {
  catalog: OwnerCatalog;
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const visibleCategories = useMemo(
    () =>
      catalog.categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => itemMatchesQuery(item, query)),
        }))
        .filter((category) => category.items.length > 0),
    [catalog, query],
  );
  const selectedCategoryId = selectedItemId
    ? findCatalogCategoryId(catalog, selectedItemId)
    : undefined;
  const [browseCategoryId, setBrowseCategoryId] = useState(
    selectedCategoryId ?? visibleCategories[0]?.id ?? "",
  );
  const selectedCategory =
    visibleCategories.find((item) => item.id === browseCategoryId) ??
    visibleCategories.find((item) => item.id === selectedCategoryId) ??
    visibleCategories[0];

  if (!selectedCategory) {
    return (
      <div className="master-selector">
        <div className="owner-catalog-search">
          <Field label="Caută">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nume, tip sau stare"
            />
          </Field>
        </div>
        <p className="page-lead">
          {query.trim()
            ? "Nicio potrivire pentru căutare."
            : "Nu există încă categorii cu date reale."}
        </p>
      </div>
    );
  }

  return (
    <div className="master-selector">
      <div className="owner-catalog-search">
        <Field label="Caută">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nume, tip sau stare"
          />
        </Field>
      </div>
      <p className="catalog-kind">Categorii</p>
      <nav aria-label="Categorii catalog">
        {visibleCategories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            selected={category.id === selectedCategory.id}
            onSelect={() => setBrowseCategoryId(category.id)}
          />
        ))}
      </nav>
      <p className="catalog-kind owner-catalog-items-label">{selectedCategory.label}</p>
      <nav aria-label="Elemente catalog">
        {selectedCategory.items.map((item) => (
          <ItemButton
            key={item.id}
            item={item}
            selected={item.id === selectedItemId}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </nav>
    </div>
  );
}

function CategoryButton({
  category,
  selected,
  onSelect,
}: {
  category: CatalogCategory;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={selected ? "owner-catalog-category is-current" : "owner-catalog-category"}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
    >
      {category.label}
    </button>
  );
}

function ItemButton({
  item,
  selected,
  onSelect,
}: {
  item: CatalogItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={selected ? "owner-catalog-item is-current" : "owner-catalog-item"}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
    >
      <span className="owner-catalog-item-label">
        <span className="owner-catalog-item-kind">{item.kindLabel}</span>
        <span>{item.label}</span>
      </span>
      {item.listHint ? (
        <span className="owner-catalog-item-hint">{item.listHint}</span>
      ) : null}
    </button>
  );
}
