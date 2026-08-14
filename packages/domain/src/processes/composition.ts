import { getComponentType } from "../product/componentTypes.js";
import { CANONICAL_PRODUCT_CODE } from "../product/frontlitPlexiAl06.js";
import type {
  ComponentRole,
  ComponentTypeId,
  DraftValues,
  ProductTemplate,
  ProductTruth,
} from "../product/types.js";
import {
  APPLY_SURFACE_FINISH_ID,
  BOND_LETTER_BODY_ID,
  CUT_SHEET_CNC_ID,
  FORM_ALUMINIUM_PROFILE_ID,
  PLACE_LED_MODULES_ID,
  getOperationalProcess,
  type OperationalProcess,
} from "./catalog.js";
import {
  processConditionLabel,
  resolvedProcessRequirementsForType,
  type ProcessRequirementCondition,
} from "./requirements.js";

export const PROCESS_COMPOSITION_SCOPES = [
  "FACE",
  "VOLUME",
  "BACK",
  "LIGHTING",
  "BODY",
] as const;
export type ProcessCompositionScope = (typeof PROCESS_COMPOSITION_SCOPES)[number];

export const COMPOSITION_NODE_READINESS = [
  "REQUIRED",
  "REQUIRED_INCOMPLETE",
  "REQUIRED_BLOCKED",
] as const;
export type CompositionNodeReadiness = (typeof COMPOSITION_NODE_READINESS)[number];

export const COMPOSITION_COMPLETENESS = ["READY", "PARTIAL", "BLOCKED"] as const;
export type CompositionCompleteness = (typeof COMPOSITION_COMPLETENESS)[number];

export const MISSING_PROCESS_CLASSIFICATIONS = [
  "REQUIRED_FOR_V1",
  "LATER",
  "BLOCKED",
  "UNKNOWN_OWNER_DECISION",
] as const;
export type MissingProcessClassification =
  (typeof MISSING_PROCESS_CLASSIFICATIONS)[number];

export type ProcessCompositionNode = {
  id: string;
  processId: string;
  processLabel: string;
  scope: ProcessCompositionScope;
  scopeLabel: string;
  typeId: ComponentTypeId | null;
  typeLabel: string | null;
  required: true;
  condition: ProcessRequirementCondition;
  conditionLabel: string | null;
  dependsOn: readonly string[];
  nodeReadiness: CompositionNodeReadiness;
  nodeReadinessLabel: string;
  blockers: readonly string[];
  reason: string;
};

export type MissingProcessGap = {
  id: string;
  label: string;
  classification: MissingProcessClassification;
  classificationLabel: string;
  note: string;
};

export type ProductProcessComposition = {
  productCode: string;
  productLabel: string;
  completeness: CompositionCompleteness;
  completenessLabel: string;
  completenessReasons: readonly string[];
  nodes: readonly ProcessCompositionNode[];
  derivedOrder: readonly string[];
  missingProcesses: readonly MissingProcessGap[];
};

export type ProcessCompositionInspection = {
  id: string;
  label: string;
  summary: string;
  values: DraftValues;
  composition: ProductProcessComposition;
};

export function compositionNodeId(
  scope: ProcessCompositionScope,
  processId: string,
): string {
  return `${scope}:${processId}`;
}

export function composeTypeProcessNodes(
  scope: ComponentRole,
  typeId: ComponentTypeId,
  values: DraftValues,
): ProcessCompositionNode[] {
  return resolvedProcessRequirementsForType(typeId, values).map((requirement) =>
    toNode({
      scope,
      typeId,
      processId: requirement.processId,
      condition: requirement.condition,
      reason: requirement.reason,
      dependsOn: [],
    }),
  );
}

export function composeProductProcesses(
  template: ProductTemplate,
  values: DraftValues,
): ProductProcessComposition {
  const merged: DraftValues = { ...template.fixedValues, ...values };
  const nodes = template.components.flatMap((component) =>
    composeTypeProcessNodes(component.id as ComponentRole, component.typeId, merged),
  );
  const withProduct = addProductComposition(
    nodes,
    template.components.map((item) => item.id),
  );
  const connected = applyProductDependencies(withProduct);
  const derivedOrder = topologicalOrder(connected);
  const missingProcesses = missingProcessesFor(merged);
  const { completeness, completenessReasons } = compositionCompleteness(
    connected,
    missingProcesses,
  );
  return {
    productCode: template.code,
    productLabel: template.label,
    completeness,
    completenessLabel: completenessLabel(completeness),
    completenessReasons,
    nodes: sortNodes(connected),
    derivedOrder,
    missingProcesses,
  };
}

export function composeProductProcessesFromTruth(
  truth: ProductTruth,
  template: ProductTemplate,
): ProductProcessComposition {
  if (truth.templateCode !== template.code) {
    throw new Error(`process_composition_template_mismatch:${truth.templateCode}`);
  }
  return composeProductProcesses(template, truth.values);
}

export function lettersProcessCompositionInspections(
  template: ProductTemplate,
): ProcessCompositionInspection[] {
  if (template.code !== CANONICAL_PRODUCT_CODE) {
    return [];
  }
  return [
    {
      id: "letters-finish-none",
      label: "Fără finisaj",
      summary: "Față și volum fără finisaj aplicat.",
      values: { "face.finish": "none", "volume.finish": "none" },
    },
    {
      id: "letters-finish-vinyl",
      label: "Colantat față și volum",
      summary: "Folie pe față după debitare. Folie pe volum înainte de formare.",
      values: { "face.finish": "vinyl", "volume.finish": "vinyl" },
    },
    {
      id: "letters-volume-painted",
      label: "Volum vopsit",
      summary: "Vopsirea nu este același proces cu aplicarea de folie.",
      values: { "face.finish": "none", "volume.finish": "painted" },
    },
  ].map((branch) => ({
    ...branch,
    composition: composeProductProcesses(template, branch.values),
  }));
}

function addProductComposition(
  nodes: ProcessCompositionNode[],
  selectedComponentIds: readonly string[],
): ProcessCompositionNode[] {
  if (
    !selectedComponentIds.includes("FACE") ||
    !selectedComponentIds.includes("VOLUME")
  ) {
    return nodes;
  }
  return [
    ...nodes,
    toNode({
      scope: "BODY",
      typeId: null,
      processId: BOND_LETTER_BODY_ID,
      condition: { kind: "always" },
      reason: "Corpul se lipește după fața pregătită și volumul format.",
      dependsOn: [],
    }),
  ];
}

function applyProductDependencies(
  nodes: ProcessCompositionNode[],
): ProcessCompositionNode[] {
  const ids = new Set(nodes.map((item) => item.id));
  return nodes.map((node) => {
    const dependsOn = explicitDependencies(node, ids);
    return { ...node, dependsOn };
  });
}

function explicitDependencies(
  node: ProcessCompositionNode,
  ids: ReadonlySet<string>,
): string[] {
  const deps: string[] = [];
  const faceCut = compositionNodeId("FACE", CUT_SHEET_CNC_ID);
  const faceVinyl = compositionNodeId("FACE", APPLY_SURFACE_FINISH_ID);
  const volumeVinyl = compositionNodeId("VOLUME", APPLY_SURFACE_FINISH_ID);
  const volumeForm = compositionNodeId("VOLUME", FORM_ALUMINIUM_PROFILE_ID);

  if (node.id === faceVinyl && ids.has(faceCut)) {
    deps.push(faceCut);
  }
  if (node.id === volumeForm && ids.has(volumeVinyl)) {
    deps.push(volumeVinyl);
  }
  if (node.id === compositionNodeId("BODY", BOND_LETTER_BODY_ID)) {
    if (ids.has(faceCut)) {
      deps.push(faceCut);
    }
    if (ids.has(faceVinyl)) {
      deps.push(faceVinyl);
    }
    if (ids.has(volumeForm)) {
      deps.push(volumeForm);
    }
  }
  return deps;
}

function toNode(input: {
  scope: ProcessCompositionScope;
  typeId: ComponentTypeId | null;
  processId: string;
  condition: ProcessRequirementCondition;
  reason: string;
  dependsOn: readonly string[];
}): ProcessCompositionNode {
  const process = getOperationalProcess(input.processId);
  if (!process) {
    throw new Error(`unknown_process:${input.processId}`);
  }
  const nodeReadiness = nodeReadinessFor(process);
  return {
    id: compositionNodeId(input.scope, input.processId),
    processId: process.id,
    processLabel: process.label,
    scope: input.scope,
    scopeLabel: scopeLabel(input.scope),
    typeId: input.typeId,
    typeLabel: input.typeId ? getComponentType(input.typeId).label : null,
    required: true,
    condition: input.condition,
    conditionLabel: processConditionLabel(input.condition),
    dependsOn: input.dependsOn,
    nodeReadiness,
    nodeReadinessLabel: nodeReadinessLabel(nodeReadiness),
    blockers: nodeBlockers(process, nodeReadiness),
    reason: input.reason,
  };
}

function nodeReadinessFor(process: OperationalProcess): CompositionNodeReadiness {
  switch (process.readiness) {
    case "BLOCKED":
      return "REQUIRED_BLOCKED";
    case "IMPLEMENTED_PROCESS_FOUNDATION":
      return "REQUIRED";
    case "KNOWN_PROCESS":
    case "PLANNED":
      return "REQUIRED_INCOMPLETE";
    default: {
      const _exhaustive: never = process.readiness;
      return _exhaustive;
    }
  }
}

function nodeBlockers(
  process: OperationalProcess,
  readiness: CompositionNodeReadiness,
): string[] {
  if (readiness === "REQUIRED") {
    return [];
  }
  if (process.id === CUT_SHEET_CNC_ID) {
    return [
      "Geometria de debitare CNC nu este disponibilă.",
      "Prețul CNC nu este modelat.",
    ];
  }
  if (process.id === PLACE_LED_MODULES_ID) {
    return [
      "Iluminarea nu este calculabilă.",
      "Regula de rezervă PSU nu este stabilită.",
    ];
  }
  return [process.readinessNote];
}

function missingProcessesFor(values: DraftValues): MissingProcessGap[] {
  const gaps: MissingProcessGap[] = [
    {
      id: "electrical-wiring",
      label: "Cablare electrică",
      classification: "LATER",
      classificationLabel: missingClassificationLabel("LATER"),
      note: "Nu este necesară pentru fundația de compunere. Rămâne după iluminarea calculabilă.",
    },
    {
      id: "psu-installation",
      label: "Montare sursă de alimentare",
      classification: "BLOCKED",
      classificationLabel: missingClassificationLabel("BLOCKED"),
      note: "Blocat de aceeași decizie PSU ca iluminarea.",
    },
    {
      id: "body-closure",
      label: "Închidere corp / prindere spate",
      classification: "LATER",
      classificationLabel: missingClassificationLabel("LATER"),
      note: "Nu există încă proces de închidere. Spatele este debitat, nu prins în graf.",
    },
    {
      id: "functional-test",
      label: "Probă funcțională",
      classification: "LATER",
      classificationLabel: missingClassificationLabel("LATER"),
      note: "Nu este modelată în V1.",
    },
    {
      id: "quality-control",
      label: "Control calitate",
      classification: "LATER",
      classificationLabel: missingClassificationLabel("LATER"),
      note: "Nu este modelată în V1.",
    },
    {
      id: "packing",
      label: "Ambalare",
      classification: "LATER",
      classificationLabel: missingClassificationLabel("LATER"),
      note: "Nu este modelată în V1.",
    },
  ];
  if (values["volume.finish"] === "painted") {
    gaps.unshift({
      id: "paint-volume",
      label: "Vopsire volum",
      classification: "UNKNOWN_OWNER_DECISION",
      classificationLabel: missingClassificationLabel("UNKNOWN_OWNER_DECISION"),
      note: "Vopsirea nu este Aplicare folie. Ordinea față de formare nu este decisă canonic.",
    });
  }
  return gaps;
}

function compositionCompleteness(
  nodes: readonly ProcessCompositionNode[],
  missing: readonly MissingProcessGap[],
): {
  completeness: CompositionCompleteness;
  completenessReasons: string[];
} {
  const reasons: string[] = [];
  if (nodes.some((item) => item.nodeReadiness === "REQUIRED_BLOCKED")) {
    reasons.push("Cel puțin un proces necesar este blocat.");
  }
  if (nodes.some((item) => item.nodeReadiness === "REQUIRED_INCOMPLETE")) {
    reasons.push("Cel puțin un proces necesar este incomplet (fără geometrie, cost sau rețetă).");
  }
  if (missing.some((item) => item.classification === "UNKNOWN_OWNER_DECISION")) {
    reasons.push("Există o ramură tehnologică fără proces compus.");
  }
  if (missing.some((item) => item.classification === "BLOCKED")) {
    reasons.push("Există procese lipsă blocate.");
  }
  if (reasons.some((item) => item.includes("blocat") || item.includes("blocate"))) {
    return { completeness: "BLOCKED", completenessReasons: reasons };
  }
  if (reasons.length > 0) {
    return { completeness: "PARTIAL", completenessReasons: reasons };
  }
  return {
    completeness: "READY",
    completenessReasons: ["Toate procesele necesare sunt pregătite."],
  };
}

export function topologicalOrder(nodes: readonly ProcessCompositionNode[]): string[] {
  const ids = [...new Set(nodes.map((item) => item.id))].sort();
  const incoming = new Map(ids.map((id) => [id, 0]));
  const outgoing = new Map(ids.map((id) => [id, [] as string[]]));
  for (const node of nodes) {
    for (const dep of node.dependsOn) {
      if (!incoming.has(dep)) {
        throw new Error(`unknown_process_dependency:${node.id}->${dep}`);
      }
      incoming.set(node.id, (incoming.get(node.id) ?? 0) + 1);
      outgoing.get(dep)?.push(node.id);
    }
  }
  for (const [id, targets] of outgoing) {
    outgoing.set(id, [...targets].sort());
  }
  const ready = ids.filter((id) => incoming.get(id) === 0);
  const ordered: string[] = [];
  while (ready.length > 0) {
    const current = ready.shift();
    if (!current) {
      break;
    }
    ordered.push(current);
    for (const next of outgoing.get(current) ?? []) {
      const remaining = (incoming.get(next) ?? 0) - 1;
      incoming.set(next, remaining);
      if (remaining === 0) {
        ready.push(next);
        ready.sort();
      }
    }
  }
  if (ordered.length !== ids.length) {
    throw new Error("cyclic_process_composition");
  }
  return ordered;
}

function sortNodes(
  nodes: readonly ProcessCompositionNode[],
): ProcessCompositionNode[] {
  return [...nodes].sort((left, right) => left.id.localeCompare(right.id));
}

function scopeLabel(scope: ProcessCompositionScope): string {
  switch (scope) {
    case "FACE":
      return "Față";
    case "VOLUME":
      return "Volum";
    case "BACK":
      return "Spate";
    case "LIGHTING":
      return "Iluminare";
    case "BODY":
      return "Corp";
    default: {
      const _exhaustive: never = scope;
      return _exhaustive;
    }
  }
}

function nodeReadinessLabel(readiness: CompositionNodeReadiness): string {
  switch (readiness) {
    case "REQUIRED":
      return "Necesar";
    case "REQUIRED_INCOMPLETE":
      return "Necesar, incomplet";
    case "REQUIRED_BLOCKED":
      return "Necesar, blocat";
    default: {
      const _exhaustive: never = readiness;
      return _exhaustive;
    }
  }
}

function completenessLabel(completeness: CompositionCompleteness): string {
  switch (completeness) {
    case "READY":
      return "Pregătită";
    case "PARTIAL":
      return "Parțială";
    case "BLOCKED":
      return "Blocat";
    default: {
      const _exhaustive: never = completeness;
      return _exhaustive;
    }
  }
}

function missingClassificationLabel(
  classification: MissingProcessClassification,
): string {
  switch (classification) {
    case "REQUIRED_FOR_V1":
      return "Necesar pentru V1";
    case "LATER":
      return "Mai târziu";
    case "BLOCKED":
      return "Blocat";
    case "UNKNOWN_OWNER_DECISION":
      return "Decizie owner";
    default: {
      const _exhaustive: never = classification;
      return _exhaustive;
    }
  }
}
