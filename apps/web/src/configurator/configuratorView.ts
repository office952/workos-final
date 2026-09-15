import {
  compileDefinition,
  formatLettersFaceField,
  formatLettersVolumeField,
  isFieldVisible,
  projectProductConfigurationOptions,
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
  complete: boolean;
};

export type ConfiguratorScope = {
  id: ConfiguratorScopeId;
  label: string;
  complete: boolean;
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
  LIGHTING: "Iluminare",
};

const ACM_SECTION_LABEL: Record<string, string> = {
  ROOT: "PRODUS",
  FACE: "Corp casetat",
  BACK: "Cadru intern",
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
): Array<Pick<ConfiguratorScope, "id" | "label">> {
  const kind = configuratorProductKind(template);
  const scopes: Array<Pick<ConfiguratorScope, "id" | "label">> = [];
  if (kind === "acm") {
    scopes.push({ id: "panou-acm", label: SCOPE_LABEL["panou-acm"] });
  }
  if (kind === "letters") {
    scopes.push({ id: "litere", label: SCOPE_LABEL.litere });
  }
  scopes.push({ id: "compozitie", label: SCOPE_LABEL.compozitie });
  return scopes;
}

export function attachConfiguratorScopeCompletion(
  scopes: ReadonlyArray<Pick<ConfiguratorScope, "id" | "label">>,
  contributingComplete: Readonly<Partial<Record<ConfiguratorScopeId, boolean>>>,
): ConfiguratorScope[] {
  const contributing = scopes.filter((scope) => scope.id !== "compozitie");
  const compositionComplete =
    contributing.length > 0 &&
    contributing.every((scope) => contributingComplete[scope.id] === true);

  return scopes.map((scope) => {
    if (scope.id === "compozitie") {
      return { ...scope, complete: compositionComplete };
    }
    return { ...scope, complete: contributingComplete[scope.id] === true };
  });
}

export function resolveActiveScope(
  scopes: ReadonlyArray<Pick<ConfiguratorScope, "id">>,
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
  values: DraftValues = {},
  template?: ProductTemplate,
): string | null {
  if (isEmpty(value)) {
    return null;
  }
  const options = template ? projectProductConfigurationOptions(template, values) : null;
  const volumeLabel = formatLettersVolumeField(field.id, value, values, options);
  if (volumeLabel) {
    return volumeLabel;
  }
  const faceLabel = formatLettersFaceField(field.id, value, values, options);
  if (faceLabel) {
    return faceLabel;
  }
  if (field.type === "boolean") {
    return value === true ? field.label : null;
  }
  if (field.type === "select" && field.options && typeof value === "string") {
    return field.options.find((option) => option.value === value)?.label ?? value;
  }
  if (field.type === "catalog_color" || field.type === "catalog_roll") {
    return null;
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

function productComponentIds(template: ProductTemplate): readonly string[] {
  return ["ROOT", ...template.components.map((component) => component.id)];
}

function identityComponentId(factId: string, template: ProductTemplate): string {
  const mapped =
    factId === "lighting" || factId.startsWith("lighting.")
      ? "LIGHTING"
      : factId.startsWith("face.")
        ? "FACE"
        : factId.startsWith("volume.")
          ? "VOLUME"
          : factId.startsWith("back.")
            ? "BACK"
            : "ROOT";
  return productComponentIds(template).includes(mapped) ? mapped : "ROOT";
}

export function selectedConfigurationFacts(
  template: ProductTemplate,
  schema: FormSchema,
  values: DraftValues,
): string[] {
  const selectedIds = selectedComponentIds(template, values);
  return schema.sections.flatMap((section) =>
    section.fields.flatMap((field) => {
      if (!isFieldVisible(field, values, selectedIds)) {
        return [];
      }
      const raw = values[field.id];
      if (raw === undefined || raw === null || raw === "") {
        return [];
      }
      if (field.type === "boolean") {
        return raw === true ? [field.label] : [];
      }
      const formatted = formatConfiguratorValue(field, raw, values, template);
      if (!formatted) {
        return [];
      }
      return [`${field.label}: ${formatted}`];
    }),
  );
}

export function configuratorStatusLabel(input: {
  readiness: ProductDefinition["readiness"];
  modulesValidated: number;
  modulesTotal: number;
  missingCount: number;
}): string {
  if (input.readiness === "ready") {
    return "Configurare completă";
  }
  const modules = `${input.modulesValidated} din ${input.modulesTotal} module validate`;
  if (input.modulesValidated === input.modulesTotal && input.missingCount > 0) {
    const fields =
      input.missingCount === 1
        ? "1 câmp obligatoriu lipsă"
        : `${input.missingCount} câmpuri obligatorii lipsă`;
    return `${modules} · ${fields}`;
  }
  return modules;
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

function measurementDisplay(value: number, unit: "mm" | "mm2"): string {
  return unit === "mm2" ? `${value} mm²` : `${value} ${unit}`;
}

function inheritedAreaFacts(
  template: ProductTemplate,
  componentId: string,
  authority: ProductDefinition,
): BlueprintFact[] {
  return template.components
    .filter(
      (component) =>
        component.id === componentId &&
        component.inputMapping?.confirmedAreaMm2FromComponentId,
    )
    .flatMap((component) => {
      const sourceId = component.inputMapping?.confirmedAreaMm2FromComponentId;
      if (!sourceId) {
        return [];
      }
      const sourceArea = authority.measurements.find(
        (measurement) =>
          measurement.componentId === sourceId && measurement.unit === "mm2",
      );
      if (!sourceArea) {
        return [];
      }
      return [
        {
          id: `inherited:${component.id}:${sourceArea.fieldId}`,
          label: "Suprafață",
          display: measurementDisplay(sourceArea.value, sourceArea.unit),
          kind: "inherited" as const,
          required: false,
        },
      ];
    });
}

function blueprintSectionsFor(
  kind: ConfiguratorProductKind,
  template: ProductTemplate,
  values: DraftValues,
  fields: readonly FormField[],
  authority: ProductDefinition,
): BlueprintSection[] {
  const missingFieldIds = new Set(authority.missing.map((item) => item.fieldId));
  const componentOrder = productComponentIds(template);

  return componentOrder.flatMap((componentId) => {
    const facts: BlueprintFact[] = [];

    for (const identity of template.identityFacts) {
      if (identityComponentId(identity.id, template) !== componentId) {
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
      const display = formatConfiguratorValue(field, values[field.id], values, template);
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

    facts.push(...inheritedAreaFacts(template, componentId, authority));

    for (const measurement of authority.measurements) {
      if (measurement.componentId !== componentId || !measurement.label) {
        continue;
      }
      if (facts.some((fact) => fact.id === measurement.fieldId)) {
        continue;
      }
      if (measurement.fieldId in template.fixedValues) {
        continue;
      }
      facts.push({
        id: `derived:${measurement.fieldId}`,
        label: measurement.label,
        display: measurementDisplay(measurement.value, measurement.unit),
        kind: "derived",
        required: false,
      });
    }

    if (facts.length === 0) {
      return [];
    }

    const incomplete = facts.some((fact) => fact.kind === "missing");
    return [
      {
        id: componentId,
        label: editorSectionLabel(kind, componentId),
        facts,
        incomplete,
        complete: !incomplete,
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
  const contributingComplete: Partial<Record<ConfiguratorScopeId, boolean>> = {};
  for (const scope of scopes) {
    if (scope.id !== "compozitie") {
      contributingComplete[scope.id] = complete;
    }
  }
  const scopesWithCompletion = attachConfiguratorScopeCompletion(
    scopes,
    contributingComplete,
  );
  const sections = blueprintSectionsFor(kind, template, values, fields, compiled);
  const productSectionIds = new Set(productComponentIds(template));
  const contributing = scopesWithCompletion.filter((scope) => scope.id !== "compozitie");
  const compositionItems: CompositionReviewItem[] = contributing.map((scope) => {
    const scopeSections = sections.filter((section) => productSectionIds.has(section.id));
    return {
      scopeId: scope.id,
      label: scope.label,
      complete: scope.complete,
      summary: compositionSummary(scopeSections),
      editLabel: `Editează în ${scope.label}`,
    };
  });

  const editorComponentIds = [...productComponentIds(template)];

  return {
    title: template.label,
    statusLabel: configuratorStatusLabel({
      readiness: compiled.readiness,
      modulesValidated,
      modulesTotal: modules.length,
      missingCount: compiled.missing.length,
    }),
    complete,
    modulesValidated,
    modulesTotal: modules.length,
    productKind: kind,
    scopes: scopesWithCompletion,
    activeScopeId,
    targets: [],
    activeTargetId: input.activeTargetId ?? null,
    blueprintTitle:
      activeScopeId === "compozitie"
        ? complete
          ? "Compoziție completă detaliată"
          : "Compoziție"
        : kind === "acm"
          ? "Construcție cadru & corp"
          : kind === "letters"
            ? "Anatomie fizică litere"
            : "Adevăr de produs",
    blueprintIncomplete: sections.some((section) => section.incomplete),
    sections,
    editorTitle:
      kind === "acm"
        ? "Configurare Panou ACM"
        : kind === "letters"
          ? "Configurare litere"
          : "Configurare produs",
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
