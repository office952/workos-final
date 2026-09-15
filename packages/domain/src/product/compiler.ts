import type { OrganizationFinishOverlay } from "../finishes/types.js";
import {
  formatLettersFaceField,
  isLettersFaceV2Template,
  normalizeLettersFaceDraft,
  projectLettersFaceOptions,
  resolveLettersFaceDraft,
} from "../finishes/lettersFace.js";
import {
  VOLUME_RETURN_WRAP_ALLOWANCE_FIELD,
  formatLettersVolumeField,
  normalizeLettersVolumeDraft,
  projectLettersVolumeOptions,
  resolveLettersVolumeDraft,
} from "../finishes/lettersVolume.js";
import {
  RETURN_WRAP_ALLOWANCE_SETTING_ID,
  listTypeTechnicalSettings,
  resolvedSettingValue,
} from "./technicalSettings.js";
import {
  collectComponentMeasurements,
  evaluateProductComponents,
  type ComponentEvaluation,
} from "./componentEvaluation.js";
import type { DisplayLabelCatalog } from "./displayMetadata.js";
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

export type CompileDefinitionContext = {
  organization?: OrganizationFinishOverlay;
};

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
  switch (field.type) {
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return false;
      }
      if (field.min !== undefined && value < field.min) {
        return false;
      }
      return true;
    case "select":
      return Boolean(field.options?.some((option) => option.value === value));
    case "boolean":
      return typeof value === "boolean";
    case "text":
      return typeof value === "string" && value.trim().length > 0;
    case "catalog_color":
    case "catalog_roll":
      return typeof value === "string" && value.trim().length > 0;
    default: {
      const _exhaustive: never = field.type;
      return _exhaustive;
    }
  }
}

function allFields(schema: FormSchema): FormField[] {
  return schema.sections.flatMap((section) => [...section.fields]);
}

export function compileDefinition(
  template: ProductTemplate,
  schema: FormSchema,
  draft: DraftConfiguration,
  context: CompileDefinitionContext = {},
): ProductDefinition {
  const draftValues = isLettersFaceV2Template(template)
    ? normalizeLettersVolumeDraft(normalizeLettersFaceDraft(draft.values))
    : draft.values;
  const selectedIds = selectedComponentIds(template, draftValues);
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
    if (!isFieldVisible(field, draftValues, selectedIds)) {
      continue;
    }

    const value = draftValues[field.id];
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

  if (isLettersFaceV2Template(template)) {
    const resolved = resolveLettersFaceDraft({
      template,
      values,
      organization: context.organization,
    });
    if (!resolved.ok) {
      for (const item of resolved.issues) {
        if (missing.some((entry) => entry.fieldId === item.fieldId)) {
          continue;
        }
        missing.push({
          fieldId: item.fieldId,
          label: item.fieldLabel,
          componentId: "FACE",
        });
      }
    } else {
      Object.assign(values, resolved.snapshotValues);
    }
    const resolvedVolume = resolveLettersVolumeDraft({
      template,
      values,
      organization: context.organization,
    });
    if (!resolvedVolume.ok) {
      for (const item of resolvedVolume.issues) {
        if (missing.some((entry) => entry.fieldId === item.fieldId)) {
          continue;
        }
        missing.push({
          fieldId: item.fieldId,
          label: item.fieldLabel,
          componentId: "VOLUME",
        });
      }
    } else {
      Object.assign(values, resolvedVolume.snapshotValues);
      if (
        resolvedVolume.applicationId === "return_letters_standard" ||
        resolvedVolume.applicationId === "return_cant_volum_wrapping"
      ) {
        const allowance = resolvedSettingValue(
          listTypeTechnicalSettings("ALUMINIUM_VOLUME"),
          RETURN_WRAP_ALLOWANCE_SETTING_ID,
        );
        if (allowance !== undefined) {
          values[VOLUME_RETURN_WRAP_ALLOWANCE_FIELD] = allowance;
        }
      }
    }
  }

  const measurements = collectComponentMeasurements(template, selectedIds, values);
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

function uniqueUnavailable(values: readonly string[]): string[] {
  return [...new Set(values)];
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

function optionLabel(
  schema: FormSchema,
  fieldId: string,
  value: DraftValue,
  values: DraftValues,
  template: ProductTemplate,
): string {
  const options = isLettersFaceV2Template(template)
    ? {
        face: projectLettersFaceOptions({ template, values }),
        volume: projectLettersVolumeOptions({ template, values }),
      }
    : null;
  const volumeLabel = formatLettersVolumeField(
    fieldId,
    value,
    values,
    options?.volume ?? null,
  );
  if (volumeLabel) {
    return volumeLabel;
  }
  const faceLabel = formatLettersFaceField(
    fieldId,
    value,
    values,
    options?.face ?? null,
  );
  if (faceLabel) {
    return faceLabel;
  }
  const field = allFields(schema).find((item) => item.id === fieldId);
  if (!field?.options || typeof value !== "string") {
    return String(value ?? "");
  }
  return field.options.find((option) => option.value === value)?.label ?? value;
}

export type CompileAggregateOptions = {
  readonly evaluations?: readonly ComponentEvaluation[];
};

export function compileAggregate(
  truth: ProductTruth,
  template: ProductTemplate,
  schema: FormSchema,
  labels: DisplayLabelCatalog,
  options: CompileAggregateOptions = {},
): ProductAggregate {
  const inscription =
    typeof truth.values["root.inscription"] === "string"
      ? truth.values["root.inscription"]
      : "";

  const rootDetails = allFields(schema)
    .filter(
      (field) =>
        field.componentId === "ROOT" &&
        field.id !== "root.inscription" &&
        truth.values[field.id] !== undefined,
    )
    .map(
      (field) =>
        `${field.label}: ${optionLabel(schema, field.id, truth.values[field.id], truth.values, template)}`,
    );
  const components = [
    ...(rootDetails.length > 0
      ? [{ id: "ROOT", label: "Produs", details: rootDetails }]
      : []),
    ...template.components
      .filter((component) => truth.selectedComponentIds.includes(component.id))
      .map((component) => {
        const details = allFields(schema)
          .filter(
            (field) =>
              field.componentId === component.id &&
              field.id !== component.selectionFieldId &&
              truth.values[field.id] !== undefined,
          )
          .map(
            (field) =>
              `${field.label}: ${optionLabel(schema, field.id, truth.values[field.id], truth.values, template)}`,
          );

        return {
          id: component.id,
          label: component.label,
          details,
        };
      }),
  ];

  const calculations =
    options.evaluations ??
    evaluateProductComponents({
      template,
      selectedComponentIds: truth.selectedComponentIds,
      values: truth.values,
      measurements: truth.measurements,
    });

  return {
    derivedFrom: "ProductTruth",
    productLabel: template.label,
    familyLabel: labels.label("PRODUCT_FAMILY", template.familyId),
    inscription,
    components,
    quantities: calculations.flatMap((item) => item.result.quantities),
    requirements: calculations.flatMap((item) => item.result.requirements),
    componentStatuses: calculations.map(({ component, result }) => ({
      id: component.id,
      label: component.label,
      typeId: result.typeId,
      status: result.status,
      unavailable: result.unavailable,
    })),
    unavailable: uniqueUnavailable(
      calculations.flatMap((item) => item.result.unavailable),
    ),
  };
}
