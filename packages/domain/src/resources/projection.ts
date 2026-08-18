import type { ComponentRole } from "../product/types.js";
import { getComponentType } from "../product/componentTypes.js";
import {
  costClassificationLabel,
  costEvidence,
  costSourceLabel,
  getMaterialFamily,
  getResource,
  listCostEvidenceFrom,
  listLaborResources,
  listServiceResources,
  lookupCostEvidence,
  materialFamilies,
  resourceCatalog,
  resourceKindLabel,
  resourceUnitLabel,
  type CostEvidence,
  type MaterialFamily,
  type ResourceDefinition,
} from "./catalog.js";
import { getOperationalProcess } from "../processes/catalog.js";
import {
  expectedRecipeKindForProcess,
  processesMissingRecipe,
  recipeKindLabel,
  recipeLifecycleLabel,
  recipeQuantityBasisLabel,
  recipesOfKind,
  type CostRecipe,
  type RecipeKind,
} from "./recipes.js";
import { resourceWhereUsed, type ResourceUse } from "./whereUsed.js";

export type ResourceUseProjection = ResourceUse & {
  roleLabel: string;
  typeLabel: string;
  displayLine: string;
};

export type ResourceCostProjection = {
  amount: number;
  currency: CostEvidence["currency"];
  unitLabel: string;
  sourceLabel: string;
  classificationLabel: string;
  note: string;
  amountDisplay: string;
};

export type ResourceAdminRecord = {
  id: string;
  label: string;
  kind: ResourceDefinition["kind"];
  kindLabel: string;
  unit: ResourceDefinition["unit"];
  unitLabel: string;
  familyId: string | null;
  familyLabel: string | null;
  formLabel: string | null;
  thicknessLabel: string | null;
  opticalLabel: string | null;
  voltageLabel: string | null;
  capacityLabel: string | null;
  usedBy: readonly ResourceUseProjection[];
  cost: ResourceCostProjection | null;
};

export type RecipeAdminRecord = {
  id: string;
  kind: RecipeKind;
  kindLabel: string;
  label: string;
  description: string;
  lifecycleLabel: string;
  completenessLabel: string;
  processLabels: readonly string[];
  quantityBasisLabel: string;
  unitLabel: string;
  costEvidenceId: string;
  costEvidenceLabel: string;
  cost: ResourceCostProjection | null;
};

export type MissingRecipeAdminRecord = {
  processId: string;
  processLabel: string;
  kind: RecipeKind;
  kindLabel: string;
  completenessLabel: string;
};

export type ResourcesAdminProjection = {
  families: readonly (MaterialFamily & {
    specifications: readonly ResourceAdminRecord[];
  })[];
  materials: readonly ResourceAdminRecord[];
  services: readonly ResourceAdminRecord[];
  labor: readonly ResourceAdminRecord[];
  serviceRecipes: readonly RecipeAdminRecord[];
  laborRecipes: readonly RecipeAdminRecord[];
  missingServiceRecipes: readonly MissingRecipeAdminRecord[];
  missingLaborRecipes: readonly MissingRecipeAdminRecord[];
  costEvidence: readonly (ResourceCostProjection & {
    resourceId: string;
    resourceLabel: string;
    kindLabel: string;
    evidenceRowId: string | null;
    lastChangedAt: string | null;
    qualifierLabel: string | null;
    usedBy: readonly ResourceUseProjection[];
  })[];
  writeState: "READY" | "NOT_IMPLEMENTED";
};

export function projectResourcesAdministration(
  evidenceRows: readonly CostEvidence[] = costEvidence,
): ResourcesAdminProjection {
  const materials = resourceCatalog
    .filter((item) => item.kind === "MATERIAL")
    .map((item) => toAdminRecord(item, evidenceRows));
  const services = listServiceResources().map((item) => toAdminRecord(item, evidenceRows));
  const labor = listLaborResources().map((item) => toAdminRecord(item, evidenceRows));
  const writable = evidenceRows.every((item) => Boolean(item.evidenceRowId));
  return {
    families: materialFamilies.map((family) => ({
      ...family,
      specifications: materials.filter((item) => item.familyId === family.id),
    })),
    materials,
    services,
    labor,
    serviceRecipes: recipesOfKind("SERVICE").map((recipe) =>
      toRecipeRecord(recipe, evidenceRows),
    ),
    laborRecipes: recipesOfKind("LABOR").map((recipe) => toRecipeRecord(recipe, evidenceRows)),
    missingServiceRecipes: processesMissingRecipe("SERVICE").map(toMissingRecipe),
    missingLaborRecipes: processesMissingRecipe("LABOR").map(toMissingRecipe),
    costEvidence: evidenceRows.map((item) => {
      const resource = resourceCatalog.find((entry) => entry.id === item.resourceId);
      const projected = toCostProjection(item);
      return {
        resourceId: item.resourceId,
        resourceLabel: resource?.label ?? item.resourceId,
        kindLabel: resource ? resourceKindLabel(resource.kind) : item.resourceId,
        evidenceRowId: item.evidenceRowId ?? null,
        lastChangedAt: item.createdAt ?? null,
        qualifierLabel:
          item.when?.volumeDepthMm !== undefined
            ? `adâncime ${item.when.volumeDepthMm} mm`
            : null,
        usedBy: projectUses(item.resourceId),
        ...projected,
      };
    }),
    writeState: writable && evidenceRows.length > 0 ? "READY" : "NOT_IMPLEMENTED",
  };
}

function toRecipeRecord(
  recipe: CostRecipe,
  evidenceRows: readonly CostEvidence[],
): RecipeAdminRecord {
  const evidence = lookupCostEvidence(evidenceRows, recipe.costEvidenceId);
  const resource = getResource(recipe.costEvidenceId);
  return {
    id: recipe.id,
    kind: recipe.kind,
    kindLabel: recipeKindLabel(recipe.kind),
    label: recipe.label,
    description: recipe.description,
    lifecycleLabel: recipeLifecycleLabel(recipe.lifecycle),
    completenessLabel: evidence ? "Configurată" : "Parțială",
    processLabels: recipe.processIds.map(
      (processId) => getOperationalProcess(processId)?.label ?? processId,
    ),
    quantityBasisLabel: recipeQuantityBasisLabel(recipe.quantityBasis),
    unitLabel: resourceUnitLabel(recipe.unit),
    costEvidenceId: recipe.costEvidenceId,
    costEvidenceLabel: resource?.label ?? recipe.costEvidenceId,
    cost: evidence ? toCostProjection(evidence) : null,
  };
}

function toMissingRecipe(processId: string): MissingRecipeAdminRecord {
  const kind = expectedRecipeKindForProcess(processId) ?? "SERVICE";
  return {
    processId,
    processLabel: getOperationalProcess(processId)?.label ?? processId,
    kind,
    kindLabel: recipeKindLabel(kind),
    completenessLabel: "Lipsă",
  };
}

function toAdminRecord(
  resource: ResourceDefinition,
  evidenceRows: readonly CostEvidence[],
): ResourceAdminRecord {
  const family = resource.familyId ? getMaterialFamily(resource.familyId) : undefined;
  const spec = resource.specification;
  const evidence =
    lookupCostEvidence(evidenceRows, resource.id) ??
    listCostEvidenceFrom(evidenceRows, resource.id)[0];
  return {
    id: resource.id,
    label: resource.label,
    kind: resource.kind,
    kindLabel: resourceKindLabel(resource.kind),
    unit: resource.unit,
    unitLabel: resourceUnitLabel(resource.unit),
    familyId: resource.familyId ?? null,
    familyLabel: family?.label ?? null,
    formLabel: spec ? formLabel(spec.form) : null,
    thicknessLabel:
      spec?.thicknessMm !== undefined ? `${spec.thicknessMm} mm` : null,
    opticalLabel: spec?.opticalType === "opal" ? "Opal" : null,
    voltageLabel:
      resource.electrical?.voltageV !== undefined
        ? `${resource.electrical.voltageV} V`
        : null,
    capacityLabel:
      resource.electrical?.capacityW !== undefined
        ? `${resource.electrical.capacityW} W`
        : null,
    usedBy: projectUses(resource.id),
    cost: evidence ? toCostProjection(evidence) : null,
  };
}

function toCostProjection(evidence: CostEvidence): ResourceCostProjection {
  const unitLabel = resourceUnitLabel(evidence.perUnit);
  const qualifier =
    evidence.when?.volumeDepthMm !== undefined
      ? `adâncime ${evidence.when.volumeDepthMm} mm`
      : null;
  return {
    amount: evidence.amount,
    currency: evidence.currency,
    unitLabel,
    sourceLabel: costSourceLabel(evidence.source),
    classificationLabel: costClassificationLabel(evidence.classification),
    note: evidence.note,
    amountDisplay: qualifier
      ? `${formatAmount(evidence.amount)} ${evidence.currency} / ${unitLabel} · ${qualifier}`
      : `${formatAmount(evidence.amount)} ${evidence.currency} / ${unitLabel}`,
  };
}

function projectUses(resourceId: string): ResourceUseProjection[] {
  return resourceWhereUsed(resourceId).map((use) => {
    const roleLabel = componentRoleLabel(use.role);
    const typeLabel = getComponentType(use.typeId).label;
    return {
      ...use,
      roleLabel,
      typeLabel,
      displayLine: `${use.productLabel} — ${roleLabel} / ${typeLabel}`,
    };
  });
}

function componentRoleLabel(role: ComponentRole): string {
  switch (role) {
    case "FACE":
      return "Față";
    case "VOLUME":
      return "Volum";
    case "BACK":
      return "Spate";
    case "LIGHTING":
      return "Iluminare";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

function formLabel(form: "sheet" | "profile"): string {
  switch (form) {
    case "sheet":
      return "Foaie";
    case "profile":
      return "Profil";
    default: {
      const _exhaustive: never = form;
      return _exhaustive;
    }
  }
}

function formatAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}
