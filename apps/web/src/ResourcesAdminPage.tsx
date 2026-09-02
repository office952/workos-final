import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SVC_SITE_INSTALL_SUBCONTRACT_ID,
  type ResourcesAdminProjection,
} from "@workos-final/domain";
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

type DrawerId = "picker";

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

  useEffect(() => {
    if (page.kind !== "ready") {
      return;
    }
    const catalog = buildResourcesCatalog(page.admin);
    const resolved = resolveResourcesSelection(catalog, page.admin, selected);
    if (!resolved.redirectTo || resolved.redirectTo === selected) {
      return;
    }
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("selected", resolved.redirectTo ?? "");
        return next;
      },
      { replace: true },
    );
  }, [page, selected, setSearchParams]);

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
      <section>
        {chrome}
        <PageStatus kind="loading">Se încarcă catalogul de resurse…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        {chrome}
        <PageStatus kind="error">Nu s-a putut încărca catalogul de resurse.</PageStatus>
        <button type="button" className="page-status-retry" onClick={retryLoad}>
          Reîncearcă
        </button>
      </section>
    );
  }

  const summary = resourcesAdminSummary(page.admin);
  const writable = page.admin.writeState === "READY" && canAdminister;
  const catalog = buildResourcesCatalog(page.admin);
  const resolved = resolveResourcesSelection(catalog, page.admin, selected);
  const selectedItem = resolved.item;

  return (
    <section>
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
                  ? renderCostAction(page.admin, selectedItem.id, (admin) => {
                      setPage({ kind: "ready", admin });
                      if (selectedItem.id.startsWith("resource:")) {
                        const resourceId = selectedItem.id.slice("resource:".length);
                        const created = admin.costEvidence.find(
                          (row) => row.resourceId === resourceId,
                        );
                        if (created) {
                          selectItem(costEvidenceItemId(created));
                        }
                      }
                    })
                  : null
              }
            />
          )}
        </div>
      </div>
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
  if (itemId.startsWith("resource:")) {
    const resourceId = itemId.slice("resource:".length);
    const resource =
      admin.labor.find((item) => item.id === resourceId) ??
      admin.services.find((item) => item.id === resourceId);
    if (!resource) {
      return null;
    }
    return (
      <CostEvidenceEditor
        key={itemId}
        createFor={{
          resourceId: resource.id,
          unitLabel: resource.unitLabel,
          requiresSupplier: resource.id === SVC_SITE_INSTALL_SUBCONTRACT_ID,
        }}
        onSaved={onSaved}
      />
    );
  }
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

function resolveResourcesSelection(
  catalog: ReturnType<typeof buildResourcesCatalog>,
  admin: ResourcesAdminProjection,
  selected: string | null,
): { item: ReturnType<typeof findCatalogItem>; redirectTo: string | null } {
  if (!selected) {
    return { item: undefined, redirectTo: null };
  }
  const item = findCatalogItem(catalog, selected);
  if (item) {
    return { item, redirectTo: null };
  }
  if (selected.startsWith("resource:")) {
    const resourceId = selected.slice("resource:".length);
    const evidence = admin.costEvidence.find((row) => row.resourceId === resourceId);
    if (evidence) {
      const redirectTo = costEvidenceItemId(evidence);
      return {
        item: findCatalogItem(catalog, redirectTo),
        redirectTo,
      };
    }
  }
  return { item: undefined, redirectTo: null };
}
