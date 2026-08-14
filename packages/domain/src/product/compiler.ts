import { BACK_COMPONENT_ID } from "./back.js";
import { getProductFamily } from "./catalog.js";
import {
  FACE_AREA_FIELD,
  FACE_COMPONENT_ID,
  faceAreaSquareMeters,
} from "./face.js";
import {
  RETURN_CANT_COMPONENT_ID,
  RETURN_CANT_PERIMETER_FIELD,
  returnCantLinearMeters,
} from "./returnCant.js";
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
  TechnicalMeasurement,
  TechnicalQuantity,
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
  const values: DraftValues = { ...template.fixedValues };

  for (const field of allFields(schema)) {
    if (field.id in template.fixedValues) {
      continue;
    }
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

  const measurements = collectMeasurements(selectedIds, values);
  const compiled: ProductDefinition = {
    templateCode: template.code,
    templateVersion: template.version,
    familyId: template.familyId,
    selectedComponentIds: selectedIds,
    values,
    measurements,
    reviewId: "",
    readiness: missing.length === 0 ? "ready" : "blocked",
    missing,
  };
  compiled.reviewId = definitionReviewId(compiled);
  return compiled;
}

export function definitionReviewId(definition: ProductDefinition): string {
  const canonical = JSON.stringify({
    templateCode: definition.templateCode,
    templateVersion: definition.templateVersion,
    selectedComponentIds: [...definition.selectedComponentIds],
    values: Object.fromEntries(
      Object.entries(definition.values).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
    measurements: definition.measurements,
  });
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function collectMeasurements(
  selectedIds: readonly string[],
  values: DraftValues,
): TechnicalMeasurement[] {
  const measurements: TechnicalMeasurement[] = [];
  const perimeter = values[RETURN_CANT_PERIMETER_FIELD];
  if (selectedIds.includes(RETURN_CANT_COMPONENT_ID) && typeof perimeter === "number") {
    measurements.push({
      componentId: RETURN_CANT_COMPONENT_ID,
      fieldId: RETURN_CANT_PERIMETER_FIELD,
      value: perimeter,
      unit: "mm",
      source: "OPERATOR_MANUAL",
      confirmed: true,
    });
  }
  const area = values[FACE_AREA_FIELD];
  if (selectedIds.includes(FACE_COMPONENT_ID) && typeof area === "number") {
    measurements.push({
      componentId: FACE_COMPONENT_ID,
      fieldId: FACE_AREA_FIELD,
      value: area,
      unit: "mm2",
      source: "OPERATOR_MANUAL",
      confirmed: true,
    });
  }
  return measurements;
}

export function confirmReviewedDefinition(
  reviewed: ProductDefinition,
  reviewId: string,
  confirmedAt = new Date().toISOString(),
):
  | ProductTruth
  | {
      ok: false;
      reason: "not_ready" | "review_mismatch";
      definition: ProductDefinition;
    } {
  if (definitionReviewId(reviewed) !== reviewId) {
    return { ok: false, reason: "review_mismatch", definition: reviewed };
  }
  if (reviewed.readiness !== "ready") {
    return { ok: false, reason: "not_ready", definition: reviewed };
  }

  return {
    status: "CONFIRMED_IN_RUNTIME",
    templateCode: reviewed.templateCode,
    templateVersion: reviewed.templateVersion,
    familyId: reviewed.familyId,
    selectedComponentIds: reviewed.selectedComponentIds,
    values: reviewed.values,
    measurements: reviewed.measurements,
    reviewId,
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
    familyLabel: getProductFamily(template.familyId)?.label ?? "",
    inscription,
    components,
    quantities: technicalQuantities(truth),
    unavailable: [
      "Geometrie din Analyzer",
      "Debitare CNC",
      "Cost intern iluminare",
    ],
  };
}

function technicalQuantities(truth: ProductTruth): TechnicalQuantity[] {
  const quantities: TechnicalQuantity[] = [];
  if (truth.selectedComponentIds.includes(RETURN_CANT_COMPONENT_ID)) {
    const perimeter = truth.measurements.find(
      (item) => item.fieldId === RETURN_CANT_PERIMETER_FIELD,
    );
    if (perimeter) {
      quantities.push({
        componentId: RETURN_CANT_COMPONENT_ID,
        id: "return_cant_linear",
        label: "Lungime cant",
        value: returnCantLinearMeters(perimeter.value),
        unit: "m",
        basis: "confirmed_perimeter",
      });
    }
  }

  const area = truth.measurements.find((item) => item.fieldId === FACE_AREA_FIELD);
  if (area) {
    const squareMeters = faceAreaSquareMeters(area.value);
    if (truth.selectedComponentIds.includes(FACE_COMPONENT_ID)) {
      quantities.push({
        componentId: FACE_COMPONENT_ID,
        id: "face_area",
        label: "Suprafață față",
        value: squareMeters,
        unit: "m2",
        basis: "confirmed_area",
      });
    }
    if (truth.selectedComponentIds.includes(BACK_COMPONENT_ID)) {
      quantities.push({
        componentId: BACK_COMPONENT_ID,
        id: "back_area",
        label: "Suprafață spate",
        value: squareMeters,
        unit: "m2",
        basis: "confirmed_area",
      });
    }
  }
  return quantities;
}
