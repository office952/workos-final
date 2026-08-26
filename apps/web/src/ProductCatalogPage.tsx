import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  catalogFamilyFilters,
  flattenCatalogProducts,
  type CatalogProductItem,
} from "./catalogProducts";
import { pageErrorKind } from "./fetchAccess";
import { fetchProductCatalog } from "./productApi";
import {
  RegistrySearchField,
  registrySearchResultSummary,
} from "./RegistrySearchField";
import { EmptyState } from "./ui/EmptyState";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "ready"; products: CatalogProductItem[] };

export function ProductCatalogPage() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [query, setQuery] = useRegistrySearchQuery();
  const [familyId, setFamilyId] = useState("ALL");
  const [selectedCode, setSelectedCode] = useState<string | null>(
    searchParams.get("product"),
  );

  useEffect(() => {
    let cancelled = false;
    void fetchProductCatalog()
      .then((tree) => {
        if (!cancelled) {
          setPage({ kind: "ready", products: flattenCatalogProducts(tree) });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPage({ kind: pageErrorKind(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const families = page.kind === "ready" ? catalogFamilyFilters(page.products) : [];
  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    const needle = query.trim().toLocaleLowerCase("ro-RO");
    return page.products.filter((product) => {
      if (familyId !== "ALL" && product.familyId !== familyId) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [product.label, product.description, product.familyLabel, product.categoryLabel]
        .filter(Boolean)
        .some((part) => part!.toLocaleLowerCase("ro-RO").includes(needle));
    });
  }, [familyId, page, query]);

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; products: CatalogProductItem[] }>();
    for (const product of visible) {
      const key = product.familyId ?? "other";
      const label = product.familyLabel ?? "Produse";
      const current = map.get(key) ?? { label, products: [] };
      current.products.push(product);
      map.set(key, current);
    }
    return [...map.values()];
  }, [visible]);

  const selected =
    visible.find((product) => product.code === selectedCode) ?? visible[0] ?? null;

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă catalogul…</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la catalog.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Nu s-a putut încărca catalogul de produse.</PageStatus>;
  }

  const empty = page.products.length === 0;
  const configureHref = selected
    ? requestId
      ? `/products/${encodeURIComponent(selected.code)}?request=${encodeURIComponent(requestId)}`
      : `/products/${encodeURIComponent(selected.code)}`
    : "/products";

  return (
    <section className="catalog-workspace">
      <PageHeader
        title="Catalog"
        lead={
          requestId
            ? "Alege produsul, apoi configurează pentru cererea curentă."
            : "Produsele din catalog. Alegeți un produs."
        }
      />

      {empty ? (
        <EmptyState title="Nu există încă produse în catalog." />
      ) : (
        <>
          <div className="catalog-toolbar">
            <RegistrySearchField
              label="Caută produs"
              placeholder="Caută produs..."
              value={query}
              onChange={setQuery}
              resultSummary={registrySearchResultSummary({
                visibleCount: visible.length,
                poolCount:
                  familyId === "ALL"
                    ? page.products.length
                    : page.products.filter((item) => item.familyId === familyId).length,
                totalCount: page.products.length,
                query,
                nounPlural: "produse",
              })}
            />
            <div className="filter-row" role="group" aria-label="Filtre familie">
              <button
                type="button"
                className={familyId === "ALL" ? "button-quiet is-selected" : "button-quiet"}
                aria-pressed={familyId === "ALL"}
                onClick={() => setFamilyId("ALL")}
              >
                Toate familiile
              </button>
              {families.map((family) => (
                <button
                  key={family.id}
                  type="button"
                  className={familyId === family.id ? "button-quiet is-selected" : "button-quiet"}
                  aria-pressed={familyId === family.id}
                  onClick={() => setFamilyId(family.id)}
                >
                  {family.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState title="Niciun produs nu corespunde căutării." />
          ) : (
            <div className="catalog-split">
              <div className="catalog-collection">
                {groups.map((group) => (
                  <section key={group.label} className="catalog-family-group">
                    <p className="catalog-kind">Familie</p>
                    <h2>{group.label}</h2>
                    <ul className="catalog-product-list">
                      {group.products.map((product) => {
                        const active = selected?.code === product.code;
                        const href = requestId
                          ? `/products/${encodeURIComponent(product.code)}?request=${encodeURIComponent(requestId)}`
                          : `/products/${encodeURIComponent(product.code)}`;
                        return (
                          <li key={product.code}>
                            <div
                              className={
                                active
                                  ? "catalog-product-row is-selected"
                                  : "catalog-product-row"
                              }
                            >
                              <p className="catalog-kind">Produs</p>
                              <Link
                                className="catalog-product-link"
                                to={href}
                                onFocus={() => setSelectedCode(product.code)}
                                onClick={() => setSelectedCode(product.code)}
                              >
                                {product.label}
                              </Link>
                              <span>
                                {product.familyLabel
                                  ? `${product.familyLabel} · configurabil`
                                  : "configurabil"}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
              {selected ? (
                <article className="catalog-product-detail" aria-live="polite">
                  <p className="catalog-kind">Produs</p>
                  <h2>{selected.label}</h2>
                  <p>
                    {requestId
                      ? "Produs vandabil. Alege produsul, apoi configurează."
                      : selected.description ||
                        "Produs vandabil. Configurează pentru o cerere sau o ofertă."}
                  </p>
                  <div className="action-row">
                    <Link className="button-link" to={configureHref}>
                      Configurează
                    </Link>
                  </div>
                </article>
              ) : null}
            </div>
          )}
        </>
      )}
    </section>
  );
}
