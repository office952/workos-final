import {
  FORM_ALUMINIUM_PROFILE_ID,
  getOperationalProcess,
  getProductionCapability,
  operationalProcesses,
} from "../processes/catalog.js";
import {
  getCostEvidence,
  getResource,
  RETURN_CANT_FORMING_ID,
  type ResourceUnit,
} from "./catalog.js";

export const RECIPE_KINDS = ["SERVICE", "LABOR"] as const;
export type RecipeKind = (typeof RECIPE_KINDS)[number];

export const RECIPE_LIFECYCLES = ["ACTIVE", "PARTIAL"] as const;
export type RecipeLifecycle = (typeof RECIPE_LIFECYCLES)[number];

export const RECIPE_QUANTITY_BASES = ["VOLUME_PERIMETER_M"] as const;
export type RecipeQuantityBasis = (typeof RECIPE_QUANTITY_BASES)[number];

export const RCP_PROFILE_FORMING_ID = "RCP_PROFILE_FORMING";

export type CostRecipe = {
  readonly id: string;
  readonly kind: RecipeKind;
  readonly label: string;
  readonly description: string;
  readonly lifecycle: RecipeLifecycle;
  readonly processIds: readonly string[];
  readonly quantityBasis: RecipeQuantityBasis;
  readonly unit: ResourceUnit;
  readonly costEvidenceId: string;
};

export type RecipeCostResolution =
  | {
      status: "RESOLVED";
      recipeId: string;
      resourceId: string;
      quantity: number;
      unit: ResourceUnit;
      rate: number;
      currency: "EUR";
      cost: number;
    }
  | {
      status: "INCOMPLETE";
      recipeId: string;
      reason: string;
    };

export const costRecipes: readonly CostRecipe[] = [
  {
    id: RCP_PROFILE_FORMING_ID,
    kind: "SERVICE",
    label: "Formare profil aluminiu",
    description:
      "Rețetă de serviciu pentru formarea cantului. Consumă evidența existentă return_cant_forming. Cantitatea vine din perimetrul de volum, nu din rețetă.",
    lifecycle: "ACTIVE",
    processIds: [FORM_ALUMINIUM_PROFILE_ID],
    quantityBasis: "VOLUME_PERIMETER_M",
    unit: "m",
    costEvidenceId: RETURN_CANT_FORMING_ID,
  },
];

export function getCostRecipe(id: string): CostRecipe | undefined {
  return costRecipes.find((item) => item.id === id);
}

export function recipeForProcess(processId: string): CostRecipe | undefined {
  return costRecipes.find((item) => item.processIds.includes(processId));
}

export function recipesOfKind(kind: RecipeKind): readonly CostRecipe[] {
  return costRecipes.filter((item) => item.kind === kind);
}

export function expectedRecipeKindForProcess(processId: string): RecipeKind | null {
  const process = getOperationalProcess(processId);
  if (!process) {
    return null;
  }
  const capability = getProductionCapability(process.requiredCapabilityId);
  if (!capability) {
    return null;
  }
  switch (capability.kind) {
    case "HUMAN_SKILL":
      return "LABOR";
    case "MACHINE":
    case "WORKSTATION":
      return "SERVICE";
    default: {
      const _exhaustive: never = capability.kind;
      return _exhaustive;
    }
  }
}

export function processesMissingRecipe(kind: RecipeKind): readonly string[] {
  return operationalProcesses
    .filter((process) => expectedRecipeKindForProcess(process.id) === kind)
    .filter((process) => !recipeForProcess(process.id))
    .map((process) => process.id);
}

export function recipeQuantityBasisLabel(basis: RecipeQuantityBasis): string {
  switch (basis) {
    case "VOLUME_PERIMETER_M":
      return "Perimetru volum (m)";
    default: {
      const _exhaustive: never = basis;
      return _exhaustive;
    }
  }
}

export function recipeKindLabel(kind: RecipeKind): string {
  switch (kind) {
    case "SERVICE":
      return "Rețetă serviciu";
    case "LABOR":
      return "Rețetă manoperă";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function recipeLifecycleLabel(lifecycle: RecipeLifecycle): string {
  switch (lifecycle) {
    case "ACTIVE":
      return "Activă";
    case "PARTIAL":
      return "Parțială";
    default: {
      const _exhaustive: never = lifecycle;
      return _exhaustive;
    }
  }
}

export function resolveRecipeInternalCost(
  recipeId: string,
  quantity: number,
): RecipeCostResolution {
  const recipe = getCostRecipe(recipeId);
  if (!recipe) {
    return { status: "INCOMPLETE", recipeId, reason: "Rețeta nu există." };
  }
  const resource = getResource(recipe.costEvidenceId);
  const evidence = getCostEvidence(recipe.costEvidenceId);
  if (!resource || !evidence) {
    return {
      status: "INCOMPLETE",
      recipeId,
      reason: "Evidența de cost lipsește.",
    };
  }
  if (recipe.unit !== resource.unit || recipe.unit !== evidence.perUnit) {
    return {
      status: "INCOMPLETE",
      recipeId,
      reason: "Unitatea rețetei nu coincide cu evidența de cost.",
    };
  }
  return {
    status: "RESOLVED",
    recipeId: recipe.id,
    resourceId: recipe.costEvidenceId,
    quantity,
    unit: recipe.unit,
    rate: evidence.amount,
    currency: evidence.currency,
    cost: quantity * evidence.amount,
  };
}

export function assertCostRecipeRegistry(): void {
  const ids = new Set<string>();
  const ownedProcesses = new Set<string>();
  for (const recipe of costRecipes) {
    if (ids.has(recipe.id)) {
      throw new Error(`Duplicate recipe: ${recipe.id}`);
    }
    ids.add(recipe.id);
    if (!getCostEvidence(recipe.costEvidenceId)) {
      throw new Error(`Unknown cost evidence ${recipe.costEvidenceId} on ${recipe.id}`);
    }
    const resource = getResource(recipe.costEvidenceId);
    if (!resource) {
      throw new Error(`Unknown resource ${recipe.costEvidenceId} on ${recipe.id}`);
    }
    if (recipe.unit !== resource.unit) {
      throw new Error(`Unit mismatch on ${recipe.id}`);
    }
    for (const processId of recipe.processIds) {
      if (!getOperationalProcess(processId)) {
        throw new Error(`Unknown process ${processId} on ${recipe.id}`);
      }
      if (ownedProcesses.has(processId)) {
        throw new Error(`Duplicate recipe ownership for ${processId}`);
      }
      ownedProcesses.add(processId);
      const expectedKind = expectedRecipeKindForProcess(processId);
      if (expectedKind && expectedKind !== recipe.kind) {
        throw new Error(`Recipe kind mismatch for ${processId}`);
      }
    }
  }
}

assertCostRecipeRegistry();
