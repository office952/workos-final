import type {
  DraftConfiguration,
  DraftValue,
  DraftValues,
  FormField,
  FormSchema,
  MissingInput,
  ProductAggregate,
  ProductDefinition,
  ProductTemplate,
  ProductTruth,
  VisibilityRule,
} from "./types.js";

export function selectedComponentIds(
  template: ProductTemplate,
  values: DraftValues,
): string[] {
  return template.components
    .filter((component) => {
      if (component.required) {
        return true;
      }
      if (!component.selectionFieldId) {
        return false;
      }
      return values[component.selectionFieldId] === true;
    })
    .map((component) => component.id);
}

export function isFieldVisible(
  field: FormField,
  values: DraftValues,
  selectedIds: readonly string[],
): boolean {
  return matchesVisibility(field.visibleWhen, values, selectedIds);
}

function matchesVisibility(
  rule: VisibilityRule,
  values: DraftValues,
  selectedIds: readonly string[],
): boolean {
  switch (rule.kind) {
    case "always":
      return true;
    case "componentSelected":
      return selectedIds.includes(rule.componentId);
    case "fieldEquals":
      return values[rule.fieldId] === rule.value;
    case "fieldIn":
      return rule.values.includes(String(values[rule.fieldId] ?? ""));
    default: {
      const _exhaustive: never = rule;
      return _exhaustive;
    }
  }
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

function isValidValue(field: FormField, value: DraftValue | undefined): boolean {
  if (isEmpty(value)) {
    return false;
  }
  if (field.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return false;
    }
    if (field.min !== undefined && value < field.min) {
      return false;
    }
  }
  if (field.type === "select" && field.options) {
    return field.options.some((option) => option.value === value);
  }
  if (field.type === "boolean") {
    return typeof value === "boolean";
  }
  return true;
}

function allFields(schema: FormSchema): FormField[] {
  return schema.sections.flatMap((section) => [...section.fields]);
}

export function compileDefinition(
  template: ProductTemplate,
  schema: FormSchema,
  draft: DraftConfiguration,
): ProductDefinition {
  const selectedIds = selectedComponentIds(template, draft.values);
  const missing: MissingInput[] = [];
  const values: DraftValues = {};

  for (const field of allFields(schema)) {
    const belongsToSelected =
      field.componentId === "ROOT" || selectedIds.includes(field.componentId);
    if (!belongsToSelected) {
      continue;
    }
    if (!isFieldVisible(field, draft.values, selectedIds)) {
      continue;
    }

    const value = draft.values[field.id];
    if (field.required && !isValidValue(field, value)) {
      missing.push({
        fieldId: field.id,
        label: field.label,
        componentId: field.componentId,
      });
      continue;
    }
    if (!isEmpty(value) && isValidValue(field, value)) {
      values[field.id] = value as DraftValue;
    }
  }

  return {
    templateCode: template.code,
    templateVersion: template.version,
    familyId: template.family.id,
    selectedComponentIds: selectedIds,
    values,
    readiness: missing.length === 0 ? "ready" : "blocked",
    missing,
  };
}

export function confirmTruth(
  definition: ProductDefinition,
  confirmedAt = new Date().toISOString(),
): ProductTruth | { ok: false; definition: ProductDefinition } {
  if (definition.readiness !== "ready") {
    return { ok: false, definition };
  }

  return {
    status: "CONFIRMED_IN_RUNTIME",
    templateCode: definition.templateCode,
    templateVersion: definition.templateVersion,
    familyId: definition.familyId,
    selectedComponentIds: definition.selectedComponentIds,
    values: definition.values,
    confirmedAt,
  };
}

function optionLabel(schema: FormSchema, fieldId: string, value: DraftValue): string {
  const field = allFields(schema).find((item) => item.id === fieldId);
  if (!field?.options || typeof value !== "string") {
    return String(value ?? "");
  }
  return field.options.find((option) => option.value === value)?.label ?? value;
}

export function compileAggregate(
  truth: ProductTruth,
  template: ProductTemplate,
  schema: FormSchema,
): ProductAggregate {
  const inscription =
    typeof truth.values["root.inscription"] === "string"
      ? truth.values["root.inscription"]
      : "";

  const components = template.components
    .filter((component) => truth.selectedComponentIds.includes(component.id))
    .map((component) => {
      const details = allFields(schema)
        .filter(
          (field) =>
            field.componentId === component.id &&
            field.id !== component.selectionFieldId &&
            truth.values[field.id] !== undefined,
        )
        .map((field) => `${field.label}: ${optionLabel(schema, field.id, truth.values[field.id])}`);

      return {
        id: component.id,
        label: component.label,
        details,
      };
    });

  return {
    derivedFrom: "ProductTruth",
    productLabel: template.label,
    familyLabel: template.family.label,
    inscription,
    components,
    unavailable: [
      "Geometrie din Analyzer",
      "Consumuri de material",
      "Preț și cost",
    ],
  };
}
