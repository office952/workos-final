import { useEffect, useState } from "react";
import type { WorkcentersAdminProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import { fetchWorkcentersAdministration } from "./systemApi";
import {
  buildWorkcentersCatalog,
  formatWorkcentersAdminSummary,
  workcentersAdminSummary,
} from "./workcentersCatalog";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

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
    return (
      <section>
        <PageHeader
          title="Utilaje și zone"
          lead="Unde și cu ce se poate lucra în atelier. Zonele și utilajele furnizează capabilități pentru procesele operaționale."
        />
        <PageStatus kind="loading">Se încarcă utilajele și zonele…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader
          title="Utilaje și zone"
          lead="Unde și cu ce se poate lucra în atelier. Zonele și utilajele furnizează capabilități pentru procesele operaționale."
        />
        <PageStatus kind="error">Nu s-au putut încărca utilajele și zonele.</PageStatus>
      </section>
    );
  }

  const summary = workcentersAdminSummary(page.admin);

  return (
    <OwnerCatalogView
      catalog={buildWorkcentersCatalog(page.admin)}
      title="Utilaje și zone"
      lead="Unde și cu ce se poate lucra în atelier. Zonele și utilajele furnizează capabilități pentru procesele operaționale."
      summary={<p className="page-summary">{formatWorkcentersAdminSummary(summary)}</p>}
      notice={
        <Notice compact>
          <p>
            Această pagină descrie zonele și utilajele disponibile. Programarea și
            capacitatea nu sunt implementate aici.
          </p>
          <p>
            Utilajul obligatoriu blochează startul. Zona manuală nu. Oamenii și
            calificările se administrează separat.
          </p>
        </Notice>
      }
    />
  );
}
