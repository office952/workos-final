import { useEffect, useState } from "react";
import type { OperationalProcessesAdminProjection } from "@workos-final/domain";
import { OwnerCatalogView } from "./OwnerCatalogView";
import {
  buildProcessesCatalog,
  formatProcessesAdminSummary,
  processesAdminSummary,
} from "./processesCatalog";
import { fetchOperationalProcessesAdministration } from "./systemApi";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

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
    return (
      <section>
        <PageHeader
          title="Procese operaționale"
          lead="Cum se lucrează în atelier. Nu spune ce utilaj se alocă, cine execută sau când se programează."
        />
        <PageStatus kind="loading">Se încarcă procesele operaționale…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader
          title="Procese operaționale"
          lead="Cum se lucrează în atelier. Nu spune ce utilaj se alocă, cine execută sau când se programează."
        />
        <PageStatus kind="error">Nu s-au putut încărca procesele operaționale.</PageStatus>
      </section>
    );
  }

  const summary = processesAdminSummary(page.admin);

  return (
    <OwnerCatalogView
      catalog={buildProcessesCatalog(page.admin)}
      title="Procese operaționale"
      lead="Cum se lucrează în atelier. Nu spune ce utilaj se alocă, cine execută sau când se programează."
      summary={<p className="page-summary">{formatProcessesAdminSummary(summary)}</p>}
      notice={
        <Notice compact>
          <p>
            Procesele descriu cum se lucrează. Editarea lor nu este disponibilă în
            această etapă.
          </p>
        </Notice>
      }
    />
  );
}
