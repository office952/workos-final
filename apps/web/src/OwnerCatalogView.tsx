import { useEffect, useState, type ReactNode } from "react";
import type {
  CatalogCategory,
  CatalogChip,
  CatalogItem,
  OwnerCatalog,
} from "./ownerCatalog";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip } from "./ui/StatusChip";
import { StatePill } from "./StatePill";

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
          <CatalogDetail
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

function itemMatchesQuery(item: CatalogItem, query: string): boolean {
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

function CatalogDetail({
  item,
  actions,
}: {
  item: CatalogItem;
  actions?: ReactNode;
}) {
  return (
    <article className="owner-catalog-detail">
      <p className="catalog-kind">{item.kindLabel}</p>
      <h2>{item.label}</h2>
      <ChipRow chips={item.chips} />
      {item.summary ? <p className="page-lead">{item.summary}</p> : null}
      {actions}
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
                <ChipRow chips={group.chips} />
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

function ChipRow({ chips }: { chips?: readonly CatalogChip[] }) {
  if (!chips || chips.length === 0) {
    return null;
  }
  return (
    <p className="owner-catalog-chips">
      {chips.map((chip) => (
        <StatusChip key={chip.label} label={chip.label} tone={chip.tone} />
      ))}
    </p>
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
              <dd className={fact.emphasize ? "is-emphasis" : undefined}>{fact.value}</dd>
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
      {section.settingLines ? (
        <ul className="authority-list">
          {section.settingLines.map((line) => (
            <li key={line.label}>
              <div className="authority-head">
                <strong>{line.label}</strong>
                <span
                  className={
                    line.statusLabel === "Setat"
                      ? "state-pill state-implemented"
                      : "state-pill state-planned"
                  }
                >
                  {line.statusLabel}
                </span>
              </div>
              <p className="owner-catalog-setting-value">{line.valueDisplay}</p>
              <p>
                {line.sourceLabel}. {line.administrationLabel}.
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
