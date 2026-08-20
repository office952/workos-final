import { useEffect, useState } from "react";
import type { ResourcesAdminProjection } from "@workos-final/domain";
import { CostEvidenceEditor } from "./CostEvidenceEditor";
import { OwnerCatalogView } from "./OwnerCatalogView";
import {
  buildResourcesCatalog,
  costEvidenceItemId,
  formatResourcesAdminSummary,
  resourcesAdminSummary,
} from "./resourcesCatalog";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import { fetchResourcesAdministration } from "./systemApi";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: ResourcesAdminProjection };

export function ResourcesAdminPage() {
  const canAdminister = useCanAdministerOrganization();
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
    return (
      <section>
        <PageHeader
          title="Resurse și cost intern"
          lead="Ce materiale, servicii și manoperă folosim acum la costul intern. Nu este stoc și nu este preț client."
        />
        <p>Se încarcă catalogul de resurse…</p>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader
          title="Resurse și cost intern"
          lead="Ce materiale, servicii și manoperă folosim acum la costul intern. Nu este stoc și nu este preț client."
        />
        <p>Nu s-a putut încărca catalogul de resurse.</p>
      </section>
    );
  }

  const summary = resourcesAdminSummary(page.admin);
  const writable = page.admin.writeState === "READY" && canAdminister;

  return (
    <OwnerCatalogView
      catalog={buildResourcesCatalog(page.admin)}
      title="Resurse și cost intern"
      lead="Ce materiale, servicii și manoperă folosim acum la costul intern. Nu este stoc și nu este preț client."
      summary={<p className="page-summary">{formatResourcesAdminSummary(summary)}</p>}
      notice={
        <Notice compact>
          {!canAdminister ? (
            <OwnerWriteHint />
          ) : writable ? (
            <p>
              Valorile implicite de platformă nu sunt cost confirmat. Salvezi un
              tarif = confirmat de owner pentru calcule noi. Ofertele și lucrările
              înghețate nu se schimbă.
            </p>
          ) : (
            <p>
              Valorile sunt folosite pentru cost intern. Editarea tarifelor nu este
              disponibilă în această etapă.
            </p>
          )}
        </Notice>
      }
      renderItemActions={(item) => {
        if (!writable) {
          return null;
        }
        const evidence = page.admin.costEvidence.find(
          (row) => costEvidenceItemId(row) === item.id,
        );
        if (!evidence?.evidenceRowId) {
          return null;
        }
        return (
          <CostEvidenceEditor
            key={costEvidenceItemId(evidence)}
            evidence={evidence}
            onSaved={(admin) => setPage({ kind: "ready", admin })}
          />
        );
      }}
    />
  );
}
