import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  catalogFamilyFilters,
  flattenCatalogProducts,
  type CatalogProductItem,
} from "../../../catalogProducts";
import { fetchProductCatalog } from "../../../productApi";
import { useRegistrySearchQuery } from "../../../useRegistrySearchQuery";
import { useContinuityFacts } from "../../shell/ObjectContinuity";
import { Ui20FilterChip, Ui20RegistryToolbar } from "../shared/Ui20RegistryControls";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; products: CatalogProductItem[] };

export function CatalogBrowse() {
  useContinuityFacts({});
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [query, setQuery] = useRegistrySearchQuery();

  useEffect(() => {
    let cancelled = false;
    void fetchProductCatalog()
      .then((tree) => {
        if (!cancelled) {
          setPage({ kind: "ready", products: flattenCatalogProducts(tree) });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const families = useMemo(
    () => (page.kind === "ready" ? catalogFamilyFilters(page.products) : []),
    [page],
  );

  const visible = useMemo(() => {
    if (page.kind !== "ready") {
      return [];
    }
    const needle = query.trim().toLocaleLowerCase("ro-RO");
    return page.products.filter((product) => {
      if (familyId && product.familyId !== familyId) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = [product.label, product.description, product.familyLabel, product.categoryLabel]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ro-RO");
      return haystack.includes(needle);
    });
  }, [familyId, page, query]);

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă catalogul…</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Catalogul nu a putut fi încărcat.</p>;
  }

  return (
    <article className="ui20-surface" data-surface="catalog" data-floorplan="registry">
      <header className="ui20-registry-head">
        <h1>Catalog produse</h1>
        <p className="ui20-kicker">
          Explorează șabloanele de produs disponibile. Selectarea pe o cerere rămâne pe traseul
          „Alege produsul”.
        </p>
      </header>

      <Ui20RegistryToolbar
        filterLabel="Familii catalog"
        filters={
          <>
            <Ui20FilterChip pressed={familyId === null} onClick={() => setFamilyId(null)}>
              Toate familiile
            </Ui20FilterChip>
            {families.map((family) => (
              <Ui20FilterChip
                key={family.id}
                pressed={familyId === family.id}
                onClick={() => setFamilyId(family.id)}
              >
                {family.label}
              </Ui20FilterChip>
            ))}
          </>
        }
        searchLabel="Caută produs"
        searchPlaceholder="Caută produs, familie sau categorie."
        query={query}
        onQueryChange={setQuery}
        countLabel={
          visible.length === 1 ? "1 produs" : `${visible.length} produse`
        }
      />

      {visible.length === 0 ? (
        <p>Niciun produs nu corespunde filtrelor.</p>
      ) : (
        <table className="ui20-worklist">
          <caption className="visually-hidden">Catalog produse</caption>
          <thead>
            <tr>
              <th scope="col">Produs</th>
              <th scope="col">Familie</th>
              <th scope="col">Categorie</th>
              <th scope="col">Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => {
              const href = productConfigureHref(product.code, searchParams);
              return (
                <tr key={product.code} className="ui20-work-row" data-product-code={product.code}>
                  <td>
                    <span className="ui20-v">{product.label}</span>
                    <span className="ui20-k">{product.description}</span>
                  </td>
                  <td>{product.familyLabel ?? "—"}</td>
                  <td>{product.categoryLabel ?? "—"}</td>
                  <td>
                    <Link className="ui20-link-button" to={href}>
                      Configurează
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </article>
  );
}

function productConfigureHref(productCode: string, searchParams: URLSearchParams): string {
  const params = new URLSearchParams();
  const requestId = searchParams.get("request");
  if (requestId) {
    params.set("request", requestId);
  }
  const query = params.toString();
  return query
    ? `/products/${encodeURIComponent(productCode)}?${query}`
    : `/products/${encodeURIComponent(productCode)}`;
}
