import { useEffect, useState } from "react";
import type { OperationalProcessesAdminProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { buildProcessesCatalog } from "./processesCatalog";
import { fetchOperationalProcessesAdministration } from "./systemApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: OperationalProcessesAdminProjection };

export function ProcessesAdminPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchOperationalProcessesAdministration()
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
    return <p>Se încarcă procesele operaționale…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca procesele operaționale.</p>;
  }

  return (
    <OwnerCatalogView
      catalog={buildProcessesCatalog(page.admin)}
      title="Procese operaționale"
      lead="Inspecție a felului în care se lucrează și a traseului tehnologic Letters. Folie și vopsire RAL sunt trasee diferite. Compunerea nu este un plan de execuție. Nu se editează aici."
    />
  );
}
