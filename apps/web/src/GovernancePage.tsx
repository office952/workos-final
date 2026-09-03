import { useEffect, useState } from "react";
import type { GovernanceProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { buildGovernanceCatalog } from "./ownerCatalog";
import { fetchSystemGovernance } from "./systemApi";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; governance: GovernanceProjection };

export function GovernancePage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchSystemGovernance()
      .then((governance) => {
        if (!cancelled) {
          setPage({ kind: "ready", governance });
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
    return (
      <section>
        <PageHeader
          title="Guvernanța sistemului"
          lead="Catalogul limitelor de autoritate. Proiectează regulile din domeniu; nu le rescrie."
        />
        <PageStatus kind="loading">Se încarcă guvernanța…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader
          title="Guvernanța sistemului"
          lead="Catalogul limitelor de autoritate. Proiectează regulile din domeniu; nu le rescrie."
        />
        <PageStatus kind="error">Nu s-a putut încărca guvernanța sistemului.</PageStatus>
      </section>
    );
  }

  return (
    <OwnerCatalogView
      catalog={buildGovernanceCatalog(page.governance)}
      title="Guvernanța sistemului"
      lead="Catalogul limitelor de autoritate. Proiectează regulile din domeniu; nu le rescrie."
    />
  );
}
