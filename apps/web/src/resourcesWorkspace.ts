import {
  usageForProductTemplate,
  type ProductTemplateResourceUsage,
  type ResourcesAdminProjection,
} from "@workos-final/domain";
import { formatCalendarDate } from "./formatDisplay";
import { costEvidenceItemId } from "./resourcesCatalog";

export type ResourcesWorkspaceView = "costuri" | "resurse" | "retete";
export type ResourcesKindFilter = "all" | "Material" | "Serviciu" | "Manoperă";
export type ResourcesStatusFilter = "all" | "confirmed" | "needs_setup";

export type CostWorkspaceRow = ResourcesAdminProjection["costEvidence"][number];
export type ResourceWorkspaceRow = ResourcesAdminProjection["materials"][number];
export type RecipeWorkspaceRow = {
  id: string;
  label: string;
  kindLabel: string;
  quantityBasisLabel: string;
  completenessLabel: string;
  usedWhere: string;
  costAmountDisplay: string | null;
};

export function parseResourcesWorkspaceView(
  value: string | null,
): ResourcesWorkspaceView {
  if (value === "resurse" || value === "retete") {
    return value;
  }
  return "costuri";
}

export function parseResourcesKindFilter(value: string | null): ResourcesKindFilter {
  if (value === "Material" || value === "Serviciu" || value === "Manoperă") {
    return value;
  }
  return "all";
}

export function parseResourcesStatusFilter(
  value: string | null,
): ResourcesStatusFilter {
  if (value === "confirmed" || value === "needs_setup") {
    return value;
  }
  return "all";
}

export function parseProductTemplateFilter(
  value: string | null,
  usages: readonly ProductTemplateResourceUsage[],
): string | null {
  if (!value) {
    return null;
  }
  return usages.some((item) => item.templateCode === value) ? value : null;
}

export function resolveProductUsage(
  admin: ResourcesAdminProjection,
  product: string | null,
): ProductTemplateResourceUsage | null {
  return usageForProductTemplate(admin.templateUsages, product);
}

export function formatProductUsageSummary(usage: ProductTemplateResourceUsage): string {
  const parts = [
    `${usage.resourceCount} resurse relevante`,
    `${usage.confirmedTariffCount} tarife confirmate`,
  ];
  if (usage.resourcesWithoutConfirmedTariffCount > 0) {
    parts.push(
      `${usage.resourcesWithoutConfirmedTariffCount} resurse fără tarif confirmat`,
    );
  }
  return parts.join(" · ");
}

export function costRowsForProduct(
  rows: readonly CostWorkspaceRow[],
  usage: ProductTemplateResourceUsage | null,
): readonly CostWorkspaceRow[] {
  if (!usage) {
    return rows;
  }
  const allowed = new Set(usage.resourceIds);
  return rows.filter((row) => allowed.has(row.resourceId));
}

export function resourceRowsForProduct(
  rows: readonly ResourceWorkspaceRow[],
  usage: ProductTemplateResourceUsage | null,
): readonly ResourceWorkspaceRow[] {
  if (!usage) {
    return rows;
  }
  const allowed = new Set(usage.resourceIds);
  return rows.filter((row) => allowed.has(row.id));
}

export function recipeRowsForProduct(
  rows: readonly RecipeWorkspaceRow[],
  usage: ProductTemplateResourceUsage | null,
): readonly RecipeWorkspaceRow[] {
  if (!usage) {
    return rows;
  }
  const recipes = new Set(usage.recipeIds);
  const processes = new Set(usage.processIds);
  return rows.filter((row) => {
    if (row.id.startsWith("missing:")) {
      return processes.has(row.id.slice("missing:".length));
    }
    return recipes.has(row.id);
  });
}

export function splitCreateTariffResources(
  resources: readonly ResourceWorkspaceRow[],
  usage: ProductTemplateResourceUsage | null,
): {
  preferred: readonly ResourceWorkspaceRow[];
  other: readonly ResourceWorkspaceRow[];
} {
  if (!usage) {
    return { preferred: resources, other: [] };
  }
  const allowed = new Set(usage.resourceIds);
  return {
    preferred: resources.filter((row) => allowed.has(row.id)),
    other: resources.filter((row) => !allowed.has(row.id)),
  };
}

export function costRowId(row: Pick<CostWorkspaceRow, "resourceId" | "qualifierIdentity">): string {
  return costEvidenceItemId(row);
}

export function tariffAmountDisplay(row: Pick<CostWorkspaceRow, "amount" | "currency" | "unitLabel">): string {
  return `${row.amount.toFixed(2).replace(".", ",")} ${row.currency} / ${row.unitLabel}`;
}

export function costVariantDisplay(row: Pick<CostWorkspaceRow, "qualifier">): string {
  if (!row.qualifier) {
    return "—";
  }
  return `${row.qualifier.value} ${row.qualifier.unitLabel}`;
}

export function costStatusDisplay(
  row: Pick<CostWorkspaceRow, "classificationLabel" | "validityState" | "validUntil">,
): string {
  if (row.validityState === "expired" && row.validUntil) {
    return `Expirat · ${formatCalendarDate(row.validUntil)}`;
  }
  return row.classificationLabel === "Confirmat de owner"
    ? "Confirmat"
    : row.classificationLabel;
}

export function isConfirmedCost(row: Pick<CostWorkspaceRow, "classificationLabel">): boolean {
  return row.classificationLabel === "Confirmat de owner";
}

export function listWorkspaceResources(
  admin: ResourcesAdminProjection,
): readonly ResourceWorkspaceRow[] {
  return [...admin.materials, ...admin.services, ...admin.labor].sort((left, right) =>
    left.label.localeCompare(right.label, "ro"),
  );
}

export function listWorkspaceRecipes(
  admin: ResourcesAdminProjection,
): readonly RecipeWorkspaceRow[] {
  const configured = [...admin.serviceRecipes, ...admin.laborRecipes].map((row) => ({
    id: row.id,
    label: row.label,
    kindLabel: row.kindLabel,
    quantityBasisLabel: row.quantityBasisLabel,
    completenessLabel: row.completenessLabel,
    usedWhere: row.processLabels.join(", "),
    costAmountDisplay: row.cost?.amountDisplay ?? null,
  }));
  const missing = [...admin.missingServiceRecipes, ...admin.missingLaborRecipes].map((row) => ({
    id: `missing:${row.processId}`,
    label: row.processLabel,
    kindLabel: row.kindLabel,
    quantityBasisLabel: "—",
    completenessLabel: row.completenessLabel,
    usedWhere: row.processLabel,
    costAmountDisplay: null,
  }));
  return [...configured, ...missing];
}

export function filterCostRows(
  rows: readonly CostWorkspaceRow[],
  query: string,
  kind: ResourcesKindFilter,
  status: ResourcesStatusFilter,
): CostWorkspaceRow[] {
  const needle = query.trim().toLowerCase();
  return rows.filter((row) => {
    if (kind !== "all" && row.kindLabel !== kind) {
      return false;
    }
    if (status === "confirmed" && !isConfirmedCost(row)) {
      return false;
    }
    if (status === "needs_setup" && isConfirmedCost(row)) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return [
      row.resourceLabel,
      row.kindLabel,
      costVariantDisplay(row),
      tariffAmountDisplay(row),
      costStatusDisplay(row),
      row.sourceLabel,
    ]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

export function filterResourceRows(
  rows: readonly ResourceWorkspaceRow[],
  query: string,
  kind: ResourcesKindFilter,
): ResourceWorkspaceRow[] {
  const needle = query.trim().toLowerCase();
  return rows.filter((row) => {
    if (kind !== "all" && row.kindLabel !== kind) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return [row.label, row.kindLabel, row.familyLabel ?? "", row.unitLabel]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

export function filterRecipeRows(
  rows: readonly RecipeWorkspaceRow[],
  query: string,
  kind: ResourcesKindFilter,
): RecipeWorkspaceRow[] {
  const needle = query.trim().toLowerCase();
  const kindLabel =
    kind === "Serviciu" ? "Rețetă serviciu" : kind === "Manoperă" ? "Rețetă manoperă" : null;
  return rows.filter((row) => {
    if (kindLabel && row.kindLabel !== kindLabel) {
      return false;
    }
    if (kind === "Material") {
      return false;
    }
    if (!needle) {
      return true;
    }
    return [
      row.label,
      row.kindLabel,
      row.completenessLabel,
      row.quantityBasisLabel,
      row.usedWhere,
      row.costAmountDisplay ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

export function resolveSelectedCostRow(
  admin: ResourcesAdminProjection,
  selected: string | null,
): CostWorkspaceRow | undefined {
  if (!selected) {
    return undefined;
  }
  if (selected.startsWith("cost:")) {
    return admin.costEvidence.find((row) => costRowId(row) === selected);
  }
  if (selected.startsWith("resource:")) {
    const resourceId = selected.slice("resource:".length);
    return admin.costEvidence.find((row) => row.resourceId === resourceId);
  }
  return undefined;
}
