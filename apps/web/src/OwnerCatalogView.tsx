import { useEffect, useState } from "react";
import type { CatalogCategory, CatalogItem, OwnerCatalog } from "./ownerCatalog";
import { StatePill } from "./StatePill";

type OwnerCatalogViewProps = {
  catalog: OwnerCatalog;
  title: string;
  lead: string;
};

export function OwnerCatalogView({ catalog, title, lead }: OwnerCatalogViewProps) {
  const firstCategory = catalog.categories[0];
  const [categoryId, setCategoryId] = useState(firstCategory?.id ?? "");
  const selectedCategory =
    catalog.categories.find((item) => item.id === categoryId) ?? firstCategory;
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
        <h1>{title}</h1>
        <p className="page-lead">{lead}</p>
        <p>Nu există încă categorii cu date reale.</p>
      </section>
    );
  }

  const selectedItem =
    selectedCategory.items.find((item) => item.id === itemId) ??
    selectedCategory.items[0];

  return (
    <section>
      <h1>{title}</h1>
      <p className="page-lead">{lead}</p>
      <div className="owner-catalog">
        <aside className="owner-catalog-nav">
          <p className="catalog-kind">Catalog</p>
          <nav aria-label="Categorii catalog">
            {catalog.categories.map((category) => (
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
          <p className="catalog-kind owner-catalog-items-label">Elemente</p>
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
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        {selectedItem ? <CatalogDetail item={selectedItem} /> : null}
      </div>
    </section>
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

function CatalogDetail({ item }: { item: CatalogItem }) {
  return (
    <article className="owner-catalog-detail">
      <p className="catalog-kind">{item.kindLabel}</p>
      <h2>{item.label}</h2>
      {item.summary ? <p className="page-lead">{item.summary}</p> : null}
      {item.groups.map((group) => {
        const hideChrome = group.title === item.label;
        return (
          <div
            key={group.id}
            className={hideChrome ? "owner-catalog-group is-inline" : "owner-catalog-group"}
          >
            {hideChrome ? null : (
              <>
                <p className="catalog-kind">{group.kindLabel}</p>
                <h3>{group.title}</h3>
              </>
            )}
            {group.sections.map((section) =>
              section.technical ? (
                <details key={section.id}>
                  <summary>{section.title}</summary>
                  <SectionBody section={section} />
                </details>
              ) : (
                <div key={section.id} className="owner-catalog-section">
                  <h4>{section.title}</h4>
                  <SectionBody section={section} />
                </div>
              ),
            )}
          </div>
        );
      })}
    </article>
  );
}

function SectionBody({
  section,
}: {
  section: CatalogItem["groups"][number]["sections"][number];
}) {
  return (
    <>
      {section.facts ? (
        <dl className="owner-catalog-facts">
          {section.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {section.lines ? (
        <ul>
          {section.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {section.statusLines ? (
        <ul className="authority-list">
          {section.statusLines.map((line) => (
            <li key={line.label}>
              <div className="authority-head">
                <strong>{line.label}</strong>
                {line.state ? <StatePill state={line.state} /> : null}
              </div>
              {line.note ? <p>{line.note}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
