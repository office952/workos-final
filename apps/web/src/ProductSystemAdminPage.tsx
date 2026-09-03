import { useCallback, useEffect, useState } from "react";
import type { ProductSystemAdminProjection } from "@workos-final/domain";
import { DisplayLabelEditor } from "./DisplayLabelEditor";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { buildProductSystemAdministrationCatalog } from "./ownerCatalog";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import { fetchProductSystemAdministration } from "./systemApi";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: ProductSystemAdminProjection };

export function ProductSystemAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  const load = useCallback(async () => {
    const admin = await fetchProductSystemAdministration();
    setPage({ kind: "ready", admin });
  }, []);

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
    return (
      <section>
        <PageHeader
          title="Sistem produs"
          lead="Editează eticheta afișată. Identitatea tehnică, compoziția și setările tehnice rămân neschimbate."
        />
        <PageStatus kind="loading">Se încarcă administrarea sistemului de produs…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader
          title="Sistem produs"
          lead="Editează eticheta afișată. Identitatea tehnică, compoziția și setările tehnice rămân neschimbate."
        />
        <PageStatus kind="error">Nu s-a putut încărca administrarea sistemului de produs.</PageStatus>
      </section>
    );
  }

  return (
    <OwnerCatalogView
      catalog={buildProductSystemAdministrationCatalog(page.admin)}
      title="Sistem produs"
      lead="Editează eticheta afișată. Identitatea tehnică, compoziția și setările tehnice rămân neschimbate."
      summary={!canAdminister ? <OwnerWriteHint /> : null}
      renderItemActions={(item) =>
        canAdminister && item.editTarget ? (
          <DisplayLabelEditor
            key={`${item.editTarget.entityKind}:${item.editTarget.entityId}:${item.editTarget.revision}`}
            target={item.editTarget}
            onSaved={load}
          />
        ) : null
      }
    />
  );
}
