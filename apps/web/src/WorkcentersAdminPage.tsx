import { useEffect, useState } from "react";
import type { WorkcentersAdminProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { fetchWorkcentersAdministration } from "./systemApi";
import { buildWorkcentersCatalog } from "./workcentersCatalog";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: WorkcentersAdminProjection };

export function WorkcentersAdminPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchWorkcentersAdministration()
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
    return <p>Se încarcă utilajele și zonele…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca utilajele și zonele.</p>;
  }

  return (
    <OwnerCatalogView
      catalog={buildWorkcentersCatalog(page.admin)}
      title="Utilaje și capacitate"
      lead="Inspecție a hărții reale de atelier: zone, utilaje, capabilități și goluri de rețetă. Planificarea de capacitate nu este implementată. Nu se editează aici."
    />
  );
}
