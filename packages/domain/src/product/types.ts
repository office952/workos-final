export type ProductFamilyId = "LETTERS";

export type ComponentId = "FACE" | "RETURN_CANT" | "BACK" | "LIGHTING" | "ROOT";

export type FieldType = "text" | "number" | "select" | "boolean";

export type VisibilityRule =
  | { kind: "always" }
  | { kind: "componentSelected"; componentId: string }
  | { kind: "fieldEquals"; fieldId: string; value: string }
  | { kind: "fieldIn"; fieldId: string; values: readonly string[] };

export type FieldOption = {
  value: string;
  label: string;
};

export type FormField = {
  id: string;
  componentId: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: readonly FieldOption[];
  visibleWhen: VisibilityRule;
  min?: number;
};

export type FormSection = {
  id: string;
  title: string;
  componentId: string;
  fields: readonly FormField[];
};

export type FormSchema = {
  id: string;
  templateCode: string;
  sections: readonly FormSection[];
};

export type ProductComponent = {
  id: string;
  label: string;
  required: boolean;
  selectionFieldId?: string;
};

export type ProductFamily = {
  id: ProductFamilyId;
  label: string;
};

export type ProductTemplate = {
  code: string;
  version: string;
  family: ProductFamily;
  label: string;
  description: string;
  components: readonly ProductComponent[];
  formSchemaId: string;
  status: "PILOT";
};

export type DraftValue = string | number | boolean | null;
export type DraftValues = Record<string, DraftValue>;

export type DraftConfiguration = {
  templateCode: string;
  values: DraftValues;
};

export type MissingInput = {
  fieldId: string;
  label: string;
  componentId: string;
};

export type TechnicalMeasurement = {
  componentId: string;
  fieldId: string;
  value: number;
  unit: "mm";
  source: "OPERATOR_MANUAL";
  confirmed: true;
};

export type ProductDefinition = {
  templateCode: string;
  templateVersion: string;
  familyId: ProductFamilyId;
  selectedComponentIds: readonly string[];
  values: DraftValues;
  measurements: readonly TechnicalMeasurement[];
  reviewId: string;
  readiness: "ready" | "blocked";
  missing: readonly MissingInput[];
};

export type ProductTruth = {
  status: "CONFIRMED_IN_RUNTIME";
  templateCode: string;
  templateVersion: string;
  familyId: ProductFamilyId;
  selectedComponentIds: readonly string[];
  values: DraftValues;
  measurements: readonly TechnicalMeasurement[];
  reviewId: string;
  confirmedAt: string;
};

export type ComponentSummary = {
  id: string;
  label: string;
  details: readonly string[];
};

export type TechnicalQuantity = {
  componentId: string;
  id: string;
  label: string;
  value: number;
  unit: "m";
  basis: "confirmed_perimeter";
};

export type ProductAggregate = {
  derivedFrom: "ProductTruth";
  productLabel: string;
  familyLabel: string;
  inscription: string;
  components: readonly ComponentSummary[];
  quantities: readonly TechnicalQuantity[];
  unavailable: readonly string[];
};
