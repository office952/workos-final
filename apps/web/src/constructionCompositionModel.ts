import {
  getComponentContract,
  selectedComponentIds,
  type ComponentTypeId,
  type DraftValues,
  type FormSchema,
  type ProductIdentityFact,
  type ProductTemplate,
} from "@workos-final/domain";

type ComponentRole = ReturnType<typeof getComponentContract>["role"];

function constructiveTypeLabel(typeId: ComponentTypeId): string {
  switch (typeId) {
    case "PLEXIGLAS_FACE":
      return "Plexiglas";
    case "ALUMINIUM_VOLUME":
      return "Aluminiu";
    case "FOREX_BACK":
      return "Forex";
    case "LIGHTING_FRONT_LED":
      return "LED frontal";
    case "ACM_CASSETTE_BODY":
      return "ACM";
    case "STEEL_INTERNAL_FRAME":
      return "Profil oțel";
    default: {
      const _exhaustive: never = typeId;
      return _exhaustive;
    }
  }
}

export type ConstructionNodeKind = "product" | "role";

export type ConstructionCompositionNode = {
  id: string;
  kind: ConstructionNodeKind;
  label: string;
  role: ComponentRole | null;
  roleLabel: string | null;
  typeLabel: string | null;
  required: boolean;
  selected: boolean;
  identityFacts: readonly ProductIdentityFact[];
  attachesToId: string | null;
};

function constructionRoleLabel(role: ComponentRole): string {
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

function factsForRole(
  facts: readonly ProductIdentityFact[],
  role: ComponentRole | null,
  nodeId: string,
): ProductIdentityFact[] {
  if (!role) {
    return [];
  }
  const prefix = `${role.toLowerCase()}.`;
  const roleKey = role.toLowerCase();
  return facts.filter(
    (fact) =>
      fact.id === roleKey ||
      fact.id.startsWith(prefix) ||
      fact.id.startsWith(`${nodeId.toLowerCase()}.`),
  );
}

function lightingAnchorId(nodes: readonly ConstructionCompositionNode[]): string | null {
  const volume = nodes.find((node) => node.role === "VOLUME");
  if (volume) {
    return volume.id;
  }
  const face = nodes.find((node) => node.role === "FACE");
  if (face) {
    return face.id;
  }
  const previous = [...nodes]
    .reverse()
    .find((node) => node.role !== "LIGHTING" && node.kind === "role");
  return previous?.id ?? null;
}

export function projectConstructionComposition(
  template: ProductTemplate,
  schema: FormSchema,
  values: DraftValues,
): ConstructionCompositionNode[] {
  const selectedIds = selectedComponentIds(template, values);
  const nodes: ConstructionCompositionNode[] = [];

  if (schema.sections.some((section) => section.componentId === "ROOT")) {
    nodes.push({
      id: "ROOT",
      kind: "product",
      label: "Produs",
      role: null,
      roleLabel: null,
      typeLabel: null,
      required: true,
      selected: true,
      identityFacts: [],
      attachesToId: null,
    });
  }

  for (const component of template.components) {
    if (!selectedIds.includes(component.id)) {
      continue;
    }
    const contract = getComponentContract(component.typeId);
    nodes.push({
      id: component.id,
      kind: "role",
      label: component.label,
      role: contract.role,
      roleLabel: constructionRoleLabel(contract.role),
      typeLabel: constructiveTypeLabel(component.typeId),
      required: component.required,
      selected: true,
      identityFacts: factsForRole(template.identityFacts, contract.role, component.id),
      attachesToId: null,
    });
  }

  const lightingAnchor = lightingAnchorId(nodes);
  return nodes.map((node) =>
    node.role === "LIGHTING"
      ? { ...node, attachesToId: lightingAnchor }
      : node,
  );
}

export function constructionRowNodes(
  nodes: readonly ConstructionCompositionNode[],
): ConstructionCompositionNode[] {
  return nodes.filter((node) => node.role !== "LIGHTING");
}

export function constructionBranchFor(
  nodes: readonly ConstructionCompositionNode[],
  anchorId: string,
): ConstructionCompositionNode[] {
  return nodes.filter((node) => node.attachesToId === anchorId);
}
