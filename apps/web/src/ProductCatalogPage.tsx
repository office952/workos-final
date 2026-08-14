import { useEffect, useState } from "react";
import type { CatalogTreeNode } from "@workos-final/domain";
import { CatalogTree } from "./CatalogTree";
import { fetchProductCatalog } from "./productApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; tree: CatalogTreeNode[] };

export function ProductCatalogPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchProductCatalog()
      .then((tree) => {
        if (!cancelled) {
          setPage({ kind: "ready", tree });
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

  if (page.kind === "loading") {
    return <p>Se încarcă catalogul…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-a putut încărca catalogul de produse.</p>;
  }

  return (
    <section>
      <h1>Produse</h1>
      <p className="page-lead">Alegeți un produs din catalog.</p>
      <CatalogTree nodes={page.tree} />
    </section>
  );
}
