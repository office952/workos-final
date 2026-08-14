import { useEffect, useState } from "react";
import type { ComponentRoleProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { buildComponentCatalog } from "./ownerCatalog";
import { fetchComponentArchitecture } from "./systemApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; roles: ComponentRoleProjection[] };

export function ComponentsPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchComponentArchitecture()
      .then((roles) => {
        if (!cancelled) {
          setPage({ kind: "ready", roles });
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
    return <p>Se încarcă componentele…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca componentele.</p>;
  }

  return (
    <OwnerCatalogView
      catalog={buildComponentCatalog(page.roles)}
      title="Module și componente"
      lead="Catalogul componentelor de produs. Proiectează contractele existente; nu le editează."
    />
  );
}
