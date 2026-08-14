import { useEffect, useState } from "react";
import type { ProductSystemAdminProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { buildProductSystemAdminCatalog } from "./ownerCatalog";
import { fetchProductSystemAdministration } from "./systemApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: ProductSystemAdminProjection };

export function ComponentsPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchProductSystemAdministration()
      .then((admin) => {
        if (!cancelled) {
          setPage({ kind: "ready", admin });
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
    return <p>Se încarcă sistemul de produs…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-a putut încărca fundația sistemului de produs.</p>;
  }

  return (
    <OwnerCatalogView
      catalog={buildProductSystemAdminCatalog(page.admin)}
      title="Module și componente"
      lead="Proiecție de inspecție a sistemului de produs. Editarea etichetelor se face în Administrare."
    />
  );
}
