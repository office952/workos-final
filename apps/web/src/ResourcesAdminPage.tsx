import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SVC_SITE_INSTALL_SUBCONTRACT_ID,
  type ResourcesAdminProjection,
} from "@workos-final/domain";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { CostEvidenceEditor } from "./CostEvidenceEditor";
import { formatDateTime } from "./formatDisplay";
import { OWNER_WRITE_HINT } from "./organizationAccess";
import { RegistrySearchField } from "./RegistrySearchField";
import { fetchResourcesAdministration } from "./systemApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";
import {
  costRowId,
  costRowsForProduct,
  costStatusDisplay,
  costVariantDisplay,
  isConfirmedCost,
  filterCostRows,
  filterRecipeRows,
  filterResourceRows,
  formatProductUsageSummary,
  listWorkspaceRecipes,
  listWorkspaceResources,
  parseProductTemplateFilter,
  parseResourcesKindFilter,
  parseResourcesStatusFilter,
  parseResourcesWorkspaceView,
  recipeRowsForProduct,
  resolveProductUsage,
  resolveSelectedCostRow,
  resourceRowsForProduct,
  splitCreateTariffResources,
  tariffAmountDisplay,
  type CostWorkspaceRow,
  type RecipeWorkspaceRow,
  type ResourceWorkspaceRow,
  type ResourcesKindFilter,
  type ResourcesStatusFilter,
  type ResourcesWorkspaceView,
} from "./resourcesWorkspace";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; admin: ResourcesAdminProjection };

export function ResourcesAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = parseResourcesWorkspaceView(searchParams.get("view"));
  const query = searchParams.get("q") ?? "";
  const kind = parseResourcesKindFilter(searchParams.get("tip"));
  const status = parseResourcesStatusFilter(searchParams.get("stare"));
  const selected = searchParams.get("selected");
  const adding = searchParams.get("adauga") === "1";
  const inventoryId = searchParams.get("resursa");
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [createResourceId, setCreateResourceId] = useState("");

  const patchParams = useCallback((mutate: (next: URLSearchParams) => void) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        mutate(next);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

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
    const rawProduct = searchParams.get("product");
    const knownProduct = parseProductTemplateFilter(rawProduct, page.admin.templateUsages);
    if (rawProduct && !knownProduct) {
      patchParams((params) => {
        params.delete("product");
      });
      return;
    }
    const usage = resolveProductUsage(page.admin, knownProduct);
    const currentSelected = resolveSelectedCostRow(page.admin, selected);
    if (
      selected &&
      (!currentSelected || (usage && !usage.resourceIds.includes(currentSelected.resourceId)))
    ) {
      patchParams((params) => {
        params.delete("selected");
      });
      return;
    }
    if (inventoryId && usage && !usage.resourceIds.includes(inventoryId)) {
      patchParams((params) => {
        params.delete("resursa");
      });
    }
  }, [inventoryId, page, patchParams, searchParams, selected]);

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

  function setView(next: ResourcesWorkspaceView) {
    patchParams((params) => {
      if (next === "costuri") {
        params.delete("view");
      } else {
        params.set("view", next);
      }
      params.delete("selected");
      params.delete("adauga");
      params.delete("resursa");
    });
  }

  function setProduct(next: string) {
    setCreateResourceId("");
    patchParams((params) => {
      if (next) {
        params.set("product", next);
      } else {
        params.delete("product");
      }
      params.delete("selected");
      params.delete("resursa");
    });
  }

  const chrome = (
    <>
      <nav className="admin-breadcrumb" aria-label="Context">
        <Link to="/admin">Administrare</Link>
        <span aria-hidden="true"> › </span>
        <span>Resurse și costuri</span>
      </nav>
    </>
  );

  if (page.kind === "loading") {
    return (
      <section className="resources-workspace">
        {chrome}
        <PageHeader
          title="Resurse și costuri"
          lead="Materiale, servicii, manoperă și tarifele folosite în calculul costului intern."
        />
        <PageStatus kind="loading">Se încarcă catalogul de resurse…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section className="resources-workspace">
        {chrome}
        <PageHeader
          title="Resurse și costuri"
          lead="Materiale, servicii, manoperă și tarifele folosite în calculul costului intern."
        />
        <PageStatus kind="error">Nu s-a putut încărca catalogul de resurse.</PageStatus>
        <button type="button" className="page-status-retry" onClick={retryLoad}>
          Reîncearcă
        </button>
      </section>
    );
  }

  const writable = page.admin.writeState === "READY" && canAdminister;
  const product = parseProductTemplateFilter(searchParams.get("product"), page.admin.templateUsages);
  const productUsage = resolveProductUsage(page.admin, product);
  const selectedCost = resolveSelectedCostRow(page.admin, selected);
  const selectedCostVisible =
    selectedCost &&
    (!productUsage || productUsage.resourceIds.includes(selectedCost.resourceId))
      ? selectedCost
      : undefined;
  const resources = resourceRowsForProduct(listWorkspaceResources(page.admin), productUsage);
  const allResources = listWorkspaceResources(page.admin);
  const recipes = recipeRowsForProduct(listWorkspaceRecipes(page.admin), productUsage);
  const visibleCosts = filterCostRows(
    costRowsForProduct(page.admin.costEvidence, productUsage),
    query,
    kind,
    status,
  );
  const visibleResources = filterResourceRows(resources, query, kind);
  const visibleRecipes = filterRecipeRows(recipes, query, kind);
  const createChoices = splitCreateTariffResources(allResources, productUsage);
  const createResource = allResources.find((item) => item.id === createResourceId);
  const selectedResource = resources.find((item) => item.id === inventoryId);

  return (
    <section className="resources-workspace">
      {chrome}
      <PageHeader
        title="Resurse și costuri"
        lead="Materiale, servicii, manoperă și tarifele folosite în calculul costului intern."
        actions={
          view === "costuri" && writable ? (
            <button
              type="button"
              onClick={() => {
                setCreateResourceId("");
                patchParams((params) => {
                  params.set("adauga", "1");
                  params.delete("selected");
                });
              }}
            >
              Adaugă tarif
            </button>
          ) : null
        }
      />
      <p className="resources-workspace-hint">
        {!canAdminister
          ? OWNER_WRITE_HINT
          : writable
            ? "Un tarif salvat este confirmat pentru calcule noi. Ofertele și lucrările înghețate nu se schimbă."
            : "Tarifele sunt folosite pentru cost intern. Editarea nu este disponibilă în această etapă."}
      </p>
      <div className="resources-workspace-context">
        <div className="form-row">
          <label htmlFor="resources-product-filter">Produs</label>
          <select
            id="resources-product-filter"
            value={product ?? ""}
            onChange={(event) => setProduct(event.target.value)}
          >
            <option value="">Toate produsele</option>
            {page.admin.templateUsages.map((item) => (
              <option key={item.templateCode} value={item.templateCode}>
                {item.templateLabel}
              </option>
            ))}
          </select>
        </div>
        {productUsage ? (
          <p className="resources-workspace-context-summary">
            {formatProductUsageSummary(productUsage)}
          </p>
        ) : null}
      </div>
      <nav className="resources-workspace-nav" aria-label="Lucru pe pagină">
        <WorkspaceTab
          current={view}
          id="costuri"
          label="Costuri interne"
          onSelect={setView}
        />
        <WorkspaceTab
          current={view}
          id="resurse"
          label="Resurse"
          onSelect={setView}
        />
        <WorkspaceTab
          current={view}
          id="retete"
          label="Rețete"
          onSelect={setView}
        />
      </nav>
      <div className="resources-workspace-toolbar">
        <RegistrySearchField
          label="Caută"
          placeholder="Caută..."
          value={query}
          onChange={(value) =>
            patchParams((params) => {
              if (value) {
                params.set("q", value);
              } else {
                params.delete("q");
              }
            })
          }
        />
        <div className="form-row">
          <label htmlFor="resources-kind-filter">Tip</label>
          <select
            id="resources-kind-filter"
            value={kind}
            onChange={(event) =>
              patchParams((params) => {
                const next = event.target.value as ResourcesKindFilter;
                if (next === "all") {
                  params.delete("tip");
                } else {
                  params.set("tip", next);
                }
              })
            }
          >
            <option value="all">Toate</option>
            <option value="Material">Materiale</option>
            <option value="Serviciu">Servicii</option>
            <option value="Manoperă">Manoperă</option>
          </select>
        </div>
        {view === "costuri" ? (
          <div className="form-row">
            <label htmlFor="resources-status-filter">Stare</label>
            <select
              id="resources-status-filter"
              value={status}
              onChange={(event) =>
                patchParams((params) => {
                  const next = event.target.value as ResourcesStatusFilter;
                  if (next === "all") {
                    params.delete("stare");
                  } else {
                    params.set("stare", next);
                  }
                })
              }
            >
              <option value="all">Toate</option>
              <option value="confirmed">Confirmate</option>
              <option value="needs_setup">Neconfirmate</option>
            </select>
          </div>
        ) : null}
      </div>
      {view === "costuri" ? (
        <CostRegistry
          rows={visibleCosts}
          selectedId={selectedCostVisible ? costRowId(selectedCostVisible) : null}
          onSelect={(row) =>
            patchParams((params) => {
              params.set("selected", costRowId(row));
              params.delete("adauga");
            })
          }
        />
      ) : null}
      {view === "resurse" ? (
        <ResourceRegistry
          rows={visibleResources}
          selectedId={selectedResource?.id ?? null}
          onSelect={(row) =>
            patchParams((params) => {
              params.set("resursa", row.id);
            })
          }
        />
      ) : null}
      {view === "retete" ? <RecipeRegistry rows={visibleRecipes} /> : null}
      <ActionDrawer
        title="Adaugă tarif"
        open={adding && writable}
        onClose={() =>
          patchParams((params) => {
            params.delete("adauga");
          })
        }
      >
        <div className="form-stack">
          <div className="form-row">
            <label htmlFor="add-tariff-resource">Resursă</label>
            <select
              id="add-tariff-resource"
              value={createResourceId}
              onChange={(event) => setCreateResourceId(event.target.value)}
            >
              <option value="">Alege resursa</option>
              {createChoices.other.length > 0 ? (
                <>
                  <optgroup label="Folosite de produs">
                    {createChoices.preferred.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Toate resursele">
                    {createChoices.other.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                </>
              ) : (
                createChoices.preferred.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))
              )}
            </select>
          </div>
          {createResource ? (
            <CostEvidenceEditor
              createFor={{
                resourceId: createResource.id,
                unitLabel: createResource.unitLabel,
                requiresSupplier: createResource.id === SVC_SITE_INSTALL_SUBCONTRACT_ID,
                qualifierFields: createResource.costEvidenceQualifiers ?? [],
              }}
              onCancel={() =>
                patchParams((params) => {
                  params.delete("adauga");
                })
              }
              onSaved={(admin) => {
                const previous = new Set(page.admin.costEvidence.map((row) => costRowId(row)));
                const created = admin.costEvidence.find((row) => !previous.has(costRowId(row)));
                setPage({ kind: "ready", admin });
                patchParams((params) => {
                  params.delete("adauga");
                  if (created) {
                    params.set("selected", costRowId(created));
                  }
                });
              }}
            />
          ) : null}
        </div>
      </ActionDrawer>
      <ActionDrawer
        title={selectedCostVisible?.resourceLabel ?? "Tarif intern"}
        open={Boolean(selectedCostVisible)}
        onClose={() =>
          patchParams((params) => {
            params.delete("selected");
          })
        }
      >
        {selectedCostVisible ? (
          <CostRowDetail
            row={selectedCostVisible}
            writable={writable}
            onSaved={(admin) => {
              setPage({ kind: "ready", admin });
            }}
          />
        ) : null}
      </ActionDrawer>
      <ActionDrawer
        title={selectedResource?.label ?? "Resursă"}
        open={Boolean(selectedResource) && view === "resurse"}
        onClose={() =>
          patchParams((params) => {
            params.delete("resursa");
          })
        }
      >
        {selectedResource ? <ResourceRowDetail row={selectedResource} /> : null}
      </ActionDrawer>
    </section>
  );
}

function WorkspaceTab({
  current,
  id,
  label,
  onSelect,
}: {
  current: ResourcesWorkspaceView;
  id: ResourcesWorkspaceView;
  label: string;
  onSelect: (view: ResourcesWorkspaceView) => void;
}) {
  return (
    <button
      type="button"
      aria-current={current === id ? "page" : undefined}
      onClick={() => onSelect(id)}
    >
      {label}
    </button>
  );
}

function CostRegistry({
  rows,
  selectedId,
  onSelect,
}: {
  rows: readonly CostWorkspaceRow[];
  selectedId: string | null;
  onSelect: (row: CostWorkspaceRow) => void;
}) {
  if (rows.length === 0) {
    return <p className="resources-workspace-empty">Niciun tarif intern nu corespunde filtrelor.</p>;
  }
  return (
    <table className="resources-rate-table" aria-label="Costuri interne">
      <thead>
        <tr className="resources-rate-head">
          <th>Resursă</th>
          <th>Variantă</th>
          <th>Tarif</th>
          <th>Stare</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const id = costRowId(row);
          return (
            <tr
              key={id}
              className="resources-rate-row"
              tabIndex={0}
              aria-current={selectedId === id ? "true" : undefined}
              onClick={() => onSelect(row)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(row);
                }
              }}
            >
              <td>{row.resourceLabel}</td>
              <td>{costVariantDisplay(row)}</td>
              <td className="resources-rate-amount">{tariffAmountDisplay(row)}</td>
              <td>
                <StatusChip
                  label={costStatusDisplay(row)}
                  tone={
                    row.validityState === "expired" ? "warn" : isConfirmedCost(row) ? "ok" : "warn"
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ResourceRegistry({
  rows,
  selectedId,
  onSelect,
}: {
  rows: readonly ResourceWorkspaceRow[];
  selectedId: string | null;
  onSelect: (row: ResourceWorkspaceRow) => void;
}) {
  if (rows.length === 0) {
    return <p className="resources-workspace-empty">Nicio resursă nu corespunde filtrelor.</p>;
  }
  return (
    <ul className="resources-inventory-list">
      {rows.map((row) => (
        <li key={row.id}>
          <button
            type="button"
            className="resources-inventory-row"
            aria-current={selectedId === row.id ? "true" : undefined}
            onClick={() => onSelect(row)}
          >
            <p className="resources-inventory-name">{row.label}</p>
            <p className="resources-inventory-meta">
              {row.kindLabel}
              {row.familyLabel ? ` · ${row.familyLabel}` : ""}
              {row.thicknessLabel ? ` · ${row.thicknessLabel}` : ""}
              {` · ${row.unitLabel}`}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}

function RecipeRegistry({ rows }: { rows: readonly RecipeWorkspaceRow[] }) {
  if (rows.length === 0) {
    return <p className="resources-workspace-empty">Nicio rețetă nu corespunde filtrelor.</p>;
  }
  return (
    <ul className="resources-inventory-list">
      {rows.map((row) => (
        <li key={row.id} className="resources-inventory-row">
          <p className="resources-inventory-name">{row.label}</p>
          <p className="resources-inventory-meta">
            {row.kindLabel}
            {` · ${row.quantityBasisLabel}`}
            {` · ${row.completenessLabel}`}
            {row.usedWhere ? ` · ${row.usedWhere}` : ""}
            {row.costAmountDisplay ? ` · ${row.costAmountDisplay}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

function CostRowDetail({
  row,
  writable,
  onSaved,
}: {
  row: CostWorkspaceRow;
  writable: boolean;
  onSaved: (admin: ResourcesAdminProjection) => void;
}) {
  return (
    <div className="form-stack">
      <dl className="owner-catalog-facts">
        <div>
          <dt>Resursă</dt>
          <dd>{row.resourceLabel}</dd>
        </div>
        <div>
          <dt>Variantă</dt>
          <dd>{costVariantDisplay(row)}</dd>
        </div>
        <div>
          <dt>Sursă</dt>
          <dd>{row.sourceLabel}</dd>
        </div>
        <div>
          <dt>Stare</dt>
          <dd>
            <StatusChip
              label={costStatusDisplay(row)}
              tone={row.validityState === "expired" ? "warn" : isConfirmedCost(row) ? "ok" : "warn"}
            />
          </dd>
        </div>
        {row.lastChangedAt ? (
          <div>
            <dt>Ultima modificare</dt>
            <dd>{formatDateTime(row.lastChangedAt)}</dd>
          </div>
        ) : null}
        {row.supplierLabel ? (
          <div>
            <dt>Furnizor</dt>
            <dd>{row.supplierLabel}</dd>
          </div>
        ) : null}
        {row.validUntil ? (
          <div>
            <dt>Valid până la</dt>
            <dd>{row.validUntil}</dd>
          </div>
        ) : null}
      </dl>
      {writable && row.evidenceRowId ? (
        <CostEvidenceEditor evidence={row} onSaved={onSaved} />
      ) : null}
    </div>
  );
}

function ResourceRowDetail({ row }: { row: ResourceWorkspaceRow }) {
  return (
    <dl className="owner-catalog-facts">
      <div>
        <dt>Tip</dt>
        <dd>{row.kindLabel}</dd>
      </div>
      {row.familyLabel ? (
        <div>
          <dt>Familie</dt>
          <dd>{row.familyLabel}</dd>
        </div>
      ) : null}
      {row.thicknessLabel ? (
        <div>
          <dt>Grosime</dt>
          <dd>{row.thicknessLabel}</dd>
        </div>
      ) : null}
      <div>
        <dt>Unitate</dt>
        <dd>{row.unitLabel}</dd>
      </div>
      {row.cost ? (
        <div>
          <dt>Tarif intern</dt>
          <dd>{row.cost.amountDisplay}</dd>
        </div>
      ) : null}
    </dl>
  );
}
