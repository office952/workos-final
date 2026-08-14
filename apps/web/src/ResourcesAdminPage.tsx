import { useEffect, useState } from "react";
import type { ResourcesAdminProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { buildResourcesCatalog } from "./resourcesCatalog";
import { fetchResourcesAdministration } from "./systemApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: ResourcesAdminProjection };

export function ResourcesAdminPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchResourcesAdministration()
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
    return <p>Se încarcă catalogul de resurse…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-a putut încărca catalogul de resurse.</p>;
  }

  return (
    <OwnerCatalogView
      catalog={buildResourcesCatalog(page.admin)}
      title="Resurse și cost intern"
      lead="Inspecție a identității de resursă, a specificației și a dovezii de cost intern. Nu se editează aici. Prețul client nu aparține acestui catalog."
    />
  );
}
