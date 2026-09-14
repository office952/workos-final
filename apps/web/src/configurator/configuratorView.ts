import {
  compileDefinition,
  isFieldVisible,
  selectedComponentIds,
  type DraftValue,
  type DraftValues,
  type FormField,
  type FormSchema,
  type ProductDefinition,
  type ProductTemplate,
} from "@workos-final/domain";

export const CONFIGURATOR_SCOPE_IDS = [
  "panou-acm",
  "litere",
  "ansamblare",
  "compozitie",
] as const;

export type ConfiguratorScopeId = (typeof CONFIGURATOR_SCOPE_IDS)[number];

export type ConfiguratorProductKind = "letters" | "acm" | "unknown";

export type BlueprintFactKind =
  | "fixed"
  | "configured"
  | "inherited"
  | "personalized"
  | "derived"
  | "missing";

export type BlueprintFact = {
  id: string;
  label: string;
  display: string;
  kind: BlueprintFactKind;
  required: boolean;
};

export type BlueprintSection = {
  id: string;
  label: string;
  facts: readonly BlueprintFact[];
  incomplete: boolean;
};

export type ConfiguratorScope = {
  id: ConfiguratorScopeId;
  label: string;
};

export type ConfiguratorTarget = {
  id: string;
  label: string;
  kind: "common" | "group" | "layer";
};

export type EditorSection = {
  id: string;
  label: string;
  componentId: string;
};

export type CompositionReviewItem = {
  scopeId: ConfiguratorScopeId;
  label: string;
  complete: boolean;
  summary: string;
  editLabel: string;
};

export type ConfiguratorObjectContext = {
  returnHref: string;
  returnLabel: string;
  requestReference: string | null;
  clientName: string | null;
  objectLabel: string | null;
};

export type ConfiguratorView = {
  title: string;
  statusLabel: string;
  complete: boolean;
  modulesValidated: number;
  modulesTotal: number;
  productKind: ConfiguratorProductKind;
  scopes: readonly ConfiguratorScope[];
  activeScopeId: ConfiguratorScopeId;
  targets: readonly ConfiguratorTarget[];
  activeTargetId: string | null;
  blueprintTitle: string;
  blueprintIncomplete: boolean;
  sections: readonly BlueprintSection[];
  editorTitle: string;
  editorLead: string;
  editorSections: readonly EditorSection[];
  editorComponentIds: readonly string[];
  compositionItems: readonly CompositionReviewItem[];
  context: ConfiguratorObjectContext;
};

export type ProjectConfiguratorViewInput = {
  template: ProductTemplate;
  schema: FormSchema;
  values: DraftValues;
  definition?: ProductDefinition | null;
  context: ConfiguratorObjectContext;
  activeScopeId?: ConfiguratorScopeId | null;
  activeTargetId?: string | null;
};

const SCOPE_LABEL: Record<ConfiguratorScopeId, string> = {
  "panou-acm": "PANOU ACM",
  litere: "LITERE",
  ansamblare: "ANSAMBLARE",
  compozitie: "COMPOZIȚIE",
};

const LETTERS_SECTION_LABEL: Record<string, string> = {
  ROOT: "PRODUS",
  FACE: "FAȚĂ",
  VOLUME: "CANT",
  BACK: "SPATE",
  LIGHTING: "ILUMINARE",
};

const ACM_SECTION_LABEL: Record<string, string> = {
  ROOT: "PRODUS",
  FACE: "CORP CASETAT",
  BACK: "CADRU INTERN",
  LIGHTING: "ILUMINARE",
};

export function configuratorProductKind(
  template: ProductTemplate,
): ConfiguratorProductKind {
  if (template.components.some((component) => component.typeId === "ACM_CASSETTE_BODY")) {
    return "acm";
  }
  if (
    template.components.some(
      (component) =>
        component.typeId === "PLEXIGLAS_FACE" ||
        component.typeId === "ALUMINIUM_VOLUME" ||
        component.typeId === "LIGHTING_FRONT_LED",
    )
  ) {
    return "letters";
  }
  return "unknown";
}

export function availableConfiguratorScopes(
  template: ProductTemplate,
): ConfiguratorScope[] {
  const kind = configuratorProductKind(template);
  const scopes: ConfiguratorScope[] = [];
  if (kind === "acm") {
    scopes.push({ id: "panou-acm", label: SCOPE_LABEL["panou-acm"] });
  }
  if (kind === "letters") {
    scopes.push({ id: "litere", label: SCOPE_LABEL.litere });
  }
  scopes.push({ id: "compozitie", label: SCOPE_LABEL.compozitie });
  return scopes;
}

export function resolveActiveScope(
  scopes: readonly ConfiguratorScope[],
  requested: ConfiguratorScopeId | null | undefined,
): ConfiguratorScopeId {
  if (requested && scopes.some((scope) => scope.id === requested)) {
    return requested;
  }
  const firstEditable = scopes.find((scope) => scope.id !== "compozitie");
  return firstEditable?.id ?? scopes[0]?.id ?? "compozitie";
}

export function editorSectionLabel(
  kind: ConfiguratorProductKind,
  componentId: string,
): string {
  if (kind === "acm") {
    return ACM_SECTION_LABEL[componentId] ?? componentId;
  }
  if (kind === "letters") {
    return LETTERS_SECTION_LABEL[componentId] ?? componentId;
  }
  return componentId;
}

function isEmpty(value: DraftValue | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  return false;
}

export function formatConfiguratorValue(
  field: FormField,
  value: DraftValue | undefined,
): string | null {
  if (isEmpty(value)) {
    return null;
  }
  if (field.type === "boolean") {
    return value === true ? field.label : null;
  }
  if (field.type === "select" && field.options && typeof value === "string") {
    return field.options.find((option) => option.value === value)?.label ?? value;
  }
  if (field.type === "number" && typeof value === "number") {
    const unit = field.label.includes("mm²")
      ? "mm²"
      : field.label.includes("(mm)")
        ? "mm"
        : "";
    return unit ? `${value} ${unit}` : String(value);
  }
  return String(value);
}

function identityComponentId(factId: string): string {
  if (factId === "lighting" || factId.startsWith("lighting.")) {
    return "LIGHTING";
  }
  if (factId.startsWith("face.")) {
    return "FACE";
  }
  if (factId.startsWith("volume.")) {
    return "VOLUME";
  }
  if (factId.startsWith("back.")) {
    return "BACK";
  }
  return "ROOT";
}

function visibleFields(
  schema: FormSchema,
  values: DraftValues,
  selectedIds: readonly string[],
): FormField[] {
  return schema.sections.flatMap((section) =>
    section.fields.filter((field) => isFieldVisible(field, values, selectedIds)),
  );
}

function compositionSummary(
  sections: readonly BlueprintSection[],
): string {
  const displays = sections.flatMap((section) =>
    section.facts
      .filter((fact) => fact.kind !== "missing")
      .slice(0, 3)
      .map((fact) => fact.display),
  );
  return displays.slice(0, 4).join(" · ");
}

function blueprintSectionsFor(
  kind: ConfiguratorProductKind,
  template: ProductTemplate,
  values: DraftValues,
  fields: readonly FormField[],
  authority: ProductDefinition,
): BlueprintSection[] {
  const missingFieldIds = new Set(authority.missing.map((item) => item.fieldId));
  const componentOrder =
    kind === "acm"
      ? ["ROOT", "FACE", "BACK", "LIGHTING"]
      : kind === "letters"
        ? ["ROOT", "FACE", "VOLUME", "BACK", "LIGHTING"]
        : ["ROOT", ...template.components.map((component) => component.id)];

  return componentOrder.flatMap((componentId) => {
    const facts: BlueprintFact[] = [];

    for (const identity of template.identityFacts) {
      if (identityComponentId(identity.id) !== componentId) {
        continue;
      }
      facts.push({
        id: `identity:${identity.id}`,
        label: identity.label,
        display: identity.value,
        kind: "fixed",
        required: true,
      });
    }

    for (const field of fields) {
      if (field.componentId !== componentId) {
        continue;
      }
      if (missingFieldIds.has(field.id)) {
        facts.push({
          id: field.id,
          label: field.label,
          display: "NECONFIGURAT",
          kind: "missing",
          required: true,
        });
        continue;
      }
      const display = formatConfiguratorValue(field, values[field.id]);
      if (display === null) {
        continue;
      }
      facts.push({
        id: field.id,
        label: field.label,
        display,
        kind: "configured",
        required: field.required,
      });
    }

    for (const measurement of authority.measurements) {
      if (measurement.componentId !== componentId || !measurement.label) {
        continue;
      }
      if (facts.some((fact) => fact.id === measurement.fieldId)) {
        continue;
      }
      const unit = measurement.unit === "mm2" ? "mm²" : measurement.unit;
      facts.push({
        id: `derived:${measurement.fieldId}`,
        label: measurement.label,
        display: `${measurement.value} ${unit}`,
        kind: "derived",
        required: false,
      });
    }

    if (facts.length === 0) {
      return [];
    }

    return [
      {
        id: componentId,
        label: editorSectionLabel(kind, componentId),
        facts,
        incomplete: facts.some((fact) => fact.kind === "missing"),
      },
    ];
  });
}

export function projectConfiguratorView(
  input: ProjectConfiguratorViewInput,
): ConfiguratorView {
  const { template, schema, values, context } = input;
  const kind = configuratorProductKind(template);
  const selectedIds = selectedComponentIds(template, values);
  const fields = visibleFields(schema, values, selectedIds);
  const scopes = availableConfiguratorScopes(template);
  const activeScopeId = resolveActiveScope(scopes, input.activeScopeId);
  const compiled = compileDefinition(template, schema, {
    templateCode: template.code,
    values,
  });
  const modules = template.components.filter(
    (component) => component.required || selectedIds.includes(component.id),
  );
  const missingComponentIds = new Set(
    compiled.missing.map((item) => item.componentId),
  );
  const modulesValidated = modules.filter(
    (component) => !missingComponentIds.has(component.id),
  ).length;
  const complete = compiled.readiness === "ready";
  const sections = blueprintSectionsFor(kind, template, values, fields, compiled);
  const contributing = scopes.filter((scope) => scope.id !== "compozitie");
  const compositionItems: CompositionReviewItem[] = contributing.map((scope) => {
    const scopeSections = sections.filter((section) => {
      if (scope.id === "panou-acm") {
        return (
          section.id === "ROOT" ||
          section.id === "FACE" ||
          section.id === "BACK" ||
          section.id === "LIGHTING"
        );
      }
      if (scope.id === "litere") {
        return (
          section.id === "ROOT" ||
          section.id === "FACE" ||
          section.id === "VOLUME" ||
          section.id === "BACK" ||
          section.id === "LIGHTING"
        );
      }
      return false;
    });
    return {
      scopeId: scope.id,
      label: scope.label,
      complete,
      summary: compositionSummary(scopeSections),
      editLabel: `Editează în ${scope.label}`,
    };
  });

  const editorComponentIds =
    kind === "acm"
      ? ["ROOT", "FACE", "BACK"]
      : kind === "letters"
        ? ["ROOT", "FACE", "VOLUME", "BACK", "LIGHTING"]
        : schema.sections.map((section) => section.componentId);

  return {
    title: template.label,
    statusLabel: complete
      ? "Configurare completă"
      : `${modulesValidated} din ${modules.length} module validate`,
    complete,
    modulesValidated,
    modulesTotal: modules.length,
    productKind: kind,
    scopes,
    activeScopeId,
    targets: [],
    activeTargetId: input.activeTargetId ?? null,
    blueprintTitle:
      kind === "acm"
        ? "Construcție cadru și corp"
        : kind === "letters"
          ? "Anatomie fizică litere"
          : "Adevăr de produs",
    blueprintIncomplete: sections.some((section) => section.incomplete),
    sections,
    editorTitle:
      kind === "acm"
        ? "Configurezi panoul ACM"
        : kind === "letters"
          ? "Configurezi literele"
          : "Configurezi produsul",
    editorLead:
      kind === "acm"
        ? "Dimensiunile, adâncimea și construcția casetei rămân la corpul casetat. Cadrul intern arată doar faptele contractate."
        : kind === "letters"
          ? "Față, cant, spate și iluminare rămân la componentele lor. Nu se inventează grupuri sau suprascrieri."
          : "Completează faptele cerute de produs.",
    editorSections: editorComponentIds.map((componentId) => ({
      id: componentId,
      label: editorSectionLabel(kind, componentId),
      componentId,
    })),
    editorComponentIds,
    compositionItems,
    context,
  };
}

export function sectionTitleForView(
  view: ConfiguratorView,
  componentId: string,
): string {
  return editorSectionLabel(view.productKind, componentId);
}
