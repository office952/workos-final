import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ResourcesAdminProjection } from "@workos-final/domain";
import { findCatalogItem } from "./catalogQuery";
import { CostEvidenceEditor } from "./CostEvidenceEditor";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import {
  buildResourcesCatalog,
  costEvidenceItemId,
  formatResourcesAdminSummary,
  resourcesAdminSummary,
} from "./resourcesCatalog";
import { fetchResourcesAdministration } from "./systemApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { AdminSidebar } from "./ui/AdminSidebar";
import { CatalogItemDetail } from "./ui/CatalogItemDetail";
import { EmptyState } from "./ui/EmptyState";
import { MasterSelector } from "./ui/MasterSelector";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: ResourcesAdminProjection };

type DrawerId = "sections" | "picker";

export function ResourcesAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("selected");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [drawer, setDrawer] = useState<DrawerId | null>(null);

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

  function retryLoad() {
    setPage({ kind: "loading" });
    void fetchResourcesAdministration()
      .then((admin) => {
        setPage({ kind: "ready", admin });
      })
      .catch(() => {
        setPage({ kind: "error" });
      });
  }

  function selectItem(itemId: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("selected", itemId);
        return next;
      },
      { replace: false },
    );
    setDrawer(null);
  }

  function openDrawer(next: DrawerId) {
    setDrawer(next);
  }

  const chrome = (
    <>
      <nav className="admin-breadcrumb" aria-label="Context">
        <Link to="/admin">Administrare</Link>
        <span aria-hidden="true"> › </span>
        <span>Resurse și cost intern</span>
      </nav>
      <PageHeader
        title="Resurse și cost intern"
        lead="Ce materiale, servicii și manoperă folosim acum la costul intern. Nu este stoc și nu este preț client."
      />
    </>
  );

  if (page.kind === "loading") {
    return (
      <section className="admin-floorplan">
        <aside className="admin-floorplan-sidebar">
          <AdminSidebar current="resources" />
        </aside>
        <div className="admin-floorplan-main">
          {chrome}
          <PageStatus kind="loading">Se încarcă catalogul de resurse…</PageStatus>
        </div>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section className="admin-floorplan">
        <aside className="admin-floorplan-sidebar">
          <AdminSidebar current="resources" />
        </aside>
        <div className="admin-floorplan-main">
          {chrome}
          <PageStatus kind="error">Nu s-a putut încărca catalogul de resurse.</PageStatus>
          <button type="button" className="page-status-retry" onClick={retryLoad}>
            Reîncearcă
          </button>
        </div>
      </section>
    );
  }

  const summary = resourcesAdminSummary(page.admin);
  const writable = page.admin.writeState === "READY" && canAdminister;
  const catalog = buildResourcesCatalog(page.admin);
  const selectedItem = selected ? findCatalogItem(catalog, selected) : undefined;

  return (
    <section className="admin-floorplan">
      <aside className="admin-floorplan-sidebar">
        <AdminSidebar current="resources" />
      </aside>
      <div className="admin-floorplan-main">
        {chrome}
        <p className="page-summary">{formatResourcesAdminSummary(summary)}</p>
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
        <div className="admin-compact-triggers">
          <button type="button" onClick={() => openDrawer("sections")}>
            Secțiuni
          </button>
          <button type="button" onClick={() => openDrawer("picker")}>
            Alege elementul
          </button>
        </div>
        <div className="admin-master-detail">
          <div className="admin-master-detail-selector">
            <MasterSelector
              catalog={catalog}
              selectedItemId={selected}
              onSelect={selectItem}
            />
          </div>
          <div className="admin-master-detail-panel">
            {!selected ? (
              <EmptyState title="Alege un element" />
            ) : !selectedItem ? (
              <PageStatus kind="missing">Element inexistent</PageStatus>
            ) : (
              <CatalogItemDetail
                item={selectedItem}
                actions={
                  writable
                    ? renderCostAction(page.admin, selectedItem.id, (admin) =>
                        setPage({ kind: "ready", admin }),
                      )
                    : null
                }
              />
            )}
          </div>
        </div>
      </div>
      <ActionDrawer
        title="Secțiuni"
        open={drawer === "sections"}
        onClose={() => setDrawer(null)}
      >
        <AdminSidebar current="resources" onNavigate={() => setDrawer(null)} />
      </ActionDrawer>
      <ActionDrawer
        title="Alege elementul"
        open={drawer === "picker"}
        onClose={() => setDrawer(null)}
      >
        <MasterSelector
          catalog={catalog}
          selectedItemId={selected}
          onSelect={selectItem}
        />
      </ActionDrawer>
    </section>
  );
}

function renderCostAction(
  admin: ResourcesAdminProjection,
  itemId: string,
  onSaved: (admin: ResourcesAdminProjection) => void,
) {
  const evidence = admin.costEvidence.find(
    (row) => costEvidenceItemId(row) === itemId,
  );
  if (!evidence?.evidenceRowId) {
    return null;
  }
  return (
    <CostEvidenceEditor
      key={costEvidenceItemId(evidence)}
      evidence={evidence}
      onSaved={onSaved}
    />
  );
}
