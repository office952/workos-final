import { useEffect, useState, type ReactNode } from "react";
import type { CatalogCategory, CatalogItem, OwnerCatalog } from "./ownerCatalog";
import { itemMatchesQuery } from "./catalogQuery";
import { CatalogItemDetail } from "./ui/CatalogItemDetail";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";

type OwnerCatalogViewProps = {
  catalog: OwnerCatalog;
  title: string;
  lead: string;
  notice?: ReactNode;
  summary?: ReactNode;
  renderItemActions?: (item: CatalogItem) => ReactNode;
};

export function OwnerCatalogView({
  catalog,
  title,
  lead,
  notice,
  summary,
  renderItemActions,
}: OwnerCatalogViewProps) {
  const [query, setQuery] = useState("");
  const visibleCategories = catalog.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => itemMatchesQuery(item, query)),
    }))
    .filter((category) => category.items.length > 0);
  const firstCategory = visibleCategories[0];
  const [categoryId, setCategoryId] = useState(firstCategory?.id ?? "");
  const selectedCategory =
    visibleCategories.find((item) => item.id === categoryId) ?? firstCategory;
  const [itemId, setItemId] = useState(selectedCategory?.items[0]?.id ?? "");

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }
    if (!selectedCategory.items.some((item) => item.id === itemId)) {
      setItemId(selectedCategory.items[0]?.id ?? "");
    }
  }, [itemId, selectedCategory]);

  if (!selectedCategory) {
    return (
      <section>
        <PageHeader title={title} lead={lead} meta={headerMeta(summary, notice)} />
        <EmptyState
          title={
            query.trim()
              ? "Nicio potrivire pentru căutare."
              : "Nu există încă categorii cu date reale."
          }
        />
      </section>
    );
  }

  const selectedItem =
    selectedCategory.items.find((item) => item.id === itemId) ??
    selectedCategory.items[0];

  return (
    <section>
      <PageHeader title={title} lead={lead} meta={headerMeta(summary, notice)} />
      <div className="owner-catalog">
        <aside className="owner-catalog-nav">
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
                onSelect={() => {
                  setCategoryId(category.id);
                  setItemId(category.items[0]?.id ?? "");
                }}
              />
            ))}
          </nav>
          <p className="catalog-kind owner-catalog-items-label">{selectedCategory.label}</p>
          <nav aria-label="Elemente catalog">
            {selectedCategory.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  item.id === selectedItem?.id
                    ? "owner-catalog-item is-current"
                    : "owner-catalog-item"
                }
                aria-current={item.id === selectedItem?.id ? "true" : undefined}
                onClick={() => setItemId(item.id)}
              >
                <span className="owner-catalog-item-label">
                  <span className="owner-catalog-item-kind">{item.kindLabel}</span>
                  <span>{item.label}</span>
                </span>
                {item.listHint ? (
                  <span className="owner-catalog-item-hint">{item.listHint}</span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>
        {selectedItem ? (
          <CatalogItemDetail
            item={selectedItem}
            actions={renderItemActions?.(selectedItem)}
          />
        ) : (
          <EmptyState title="Nu există elemente în această categorie." />
        )}
      </div>
    </section>
  );
}

function headerMeta(summary?: ReactNode, notice?: ReactNode): ReactNode {
  if (!summary && !notice) {
    return undefined;
  }
  return (
    <>
      {summary}
      {notice}
    </>
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
