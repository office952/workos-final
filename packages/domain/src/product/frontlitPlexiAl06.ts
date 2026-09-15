import { LETTERS_FACE_V2_ALLOWED_APPLICATIONS } from "../finishes/lettersFace.js";
import { LETTERS_VOLUME_V2_ALLOWED_APPLICATIONS } from "../finishes/lettersVolume.js";
import {
  FRONT_LIT_VOLUMETRIC_LETTERS_CATEGORY_ID,
  LIGHTED_VOLUMETRIC_SIGNS_FAMILY_ID,
} from "./catalog.js";
import type { FormSchema, ProductTemplate } from "./types.js";

export const CANONICAL_PRODUCT_CODE = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";
export const LETTERS_FORM_SCHEMA_V1_ID = "prd-letters-frontlit-plexi-al06-form-v1";
export const LETTERS_FORM_SCHEMA_V2_ID = "prd-letters-frontlit-plexi-al06-form-v2";

const lettersIdentity = {
  code: CANONICAL_PRODUCT_CODE,
  familyId: LIGHTED_VOLUMETRIC_SIGNS_FAMILY_ID,
  categoryId: FRONT_LIT_VOLUMETRIC_LETTERS_CATEGORY_ID,
  label: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
  description:
    "Litere volumetrice luminoase cu iluminare față, față din plexiglas 3 mm opal și volum din aluminiu 0,6 mm.",
  legacyReference: "TPL-VOLUMETRIC-LETTERS_v2",
  identityFacts: [
    { id: "lighting", label: "Iluminare", value: "Iluminare frontală" },
    { id: "face.material", label: "Material față", value: "Plexiglas 3 mm opal" },
    { id: "volume.material", label: "Material volum", value: "Aluminiu 0,6 mm" },
    { id: "back.material", label: "Material spate", value: "Forex 10 mm" },
  ],
  fixedValues: {
    "face.materialFamily": "plexiglas",
    "face.thicknessMm": 3,
    "face.opticalType": "opal",
    "volume.materialFamily": "aluminium",
    "volume.thicknessMm": 0.6,
    "back.materialFamily": "forex",
    "back.thicknessMm": 10,
    "lighting.mode": "front_lit",
  },
  status: "PILOT" as const,
  components: [
    { id: "FACE" as const, label: "Față", required: true, typeId: "PLEXIGLAS_FACE" as const },
    {
      id: "VOLUME" as const,
      label: "Volum",
      required: true,
      typeId: "ALUMINIUM_VOLUME" as const,
    },
    {
      id: "BACK" as const,
      label: "Spate",
      required: true,
      typeId: "FOREX_BACK" as const,
      inputMapping: { confirmedAreaMm2FromComponentId: "FACE" },
    },
    {
      id: "LIGHTING" as const,
      label: "Iluminare",
      required: true,
      typeId: "LIGHTING_FRONT_LED" as const,
    },
  ],
};

const volumeSectionV1: FormSchema["sections"][number] = {
  id: "volume",
  title: "Volum",
  componentId: "VOLUME",
  fields: [
    {
      id: "volume.depthMm",
      componentId: "VOLUME",
      label: "Adâncime volum (mm)",
      type: "select",
      required: true,
      options: [
        { value: "30", label: "30 mm" },
        { value: "60", label: "60 mm" },
        { value: "80", label: "80 mm" },
        { value: "100", label: "100 mm" },
      ],
      visibleWhen: { kind: "always" },
    },
    {
      id: "volume.finish",
      componentId: "VOLUME",
      label: "Finisaj volum",
      type: "select",
      required: true,
      options: [
        { value: "none", label: "Fără finisaj" },
        { value: "vinyl", label: "Colantat" },
        { value: "painted", label: "Vopsit" },
      ],
      visibleWhen: { kind: "always" },
    },
    {
      id: "volume.color",
      componentId: "VOLUME",
      label: "Culoare volum",
      type: "text",
      required: true,
      visibleWhen: {
        kind: "fieldIn",
        fieldId: "volume.finish",
        values: ["vinyl", "painted"],
      },
    },
    {
      id: "volume.confirmedPerimeterMm",
      componentId: "VOLUME",
      label: "Perimetru confirmat (mm)",
      type: "number",
      required: true,
      min: 1,
      visibleWhen: { kind: "always" },
      hint: "Valoare confirmată de operator. Nu este geometrie calculată de WorkOS.",
    },
  ],
};

const productSection: FormSchema["sections"][number] = {
  id: "product",
  title: "Produs",
  componentId: "ROOT",
  fields: [
    {
      id: "root.inscription",
      componentId: "ROOT",
      label: "Textul literelor",
      type: "text",
      required: true,
      visibleWhen: { kind: "always" },
    },
  ],
};

export const frontlitPlexiAl06FormSchemaV1: FormSchema = {
  id: LETTERS_FORM_SCHEMA_V1_ID,
  templateCode: CANONICAL_PRODUCT_CODE,
  sections: [
    productSection,
    {
      id: "face",
      title: "Față",
      componentId: "FACE",
      fields: [
        {
          id: "face.finish",
          componentId: "FACE",
          label: "Finisaj față",
          type: "select",
          required: true,
          options: [
            { value: "none", label: "Fără finisaj" },
            { value: "vinyl", label: "Colantat" },
          ],
          visibleWhen: { kind: "always" },
        },
        {
          id: "face.color",
          componentId: "FACE",
          label: "Culoare față",
          type: "text",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "face.finish", value: "vinyl" },
        },
        {
          id: "face.confirmedAreaMm2",
          componentId: "FACE",
          label: "Suprafață confirmată (mm²)",
          type: "number",
          required: true,
          min: 1,
          visibleWhen: { kind: "always" },
          hint: "Valoare confirmată de operator. Nu este geometrie calculată de WorkOS. Spatele folosește aceeași suprafață.",
        },
      ],
    },
    volumeSectionV1,
  ],
};

export const frontlitPlexiAl06TemplateV1: ProductTemplate = {
  ...lettersIdentity,
  version: "1",
  formSchemaId: LETTERS_FORM_SCHEMA_V1_ID,
};

export const frontlitPlexiAl06FormSchema: FormSchema = {
  id: LETTERS_FORM_SCHEMA_V2_ID,
  templateCode: CANONICAL_PRODUCT_CODE,
  sections: [
    productSection,
    {
      id: "face",
      title: "Față",
      componentId: "FACE",
      fields: [
        {
          id: "face.finish",
          componentId: "FACE",
          label: "Finisaj față",
          type: "select",
          required: true,
          options: [
            { value: "none", label: "Fără finisaj" },
            { value: "oracal", label: "Oracal" },
            { value: "print", label: "Print" },
          ],
          visibleWhen: { kind: "always" },
        },
        {
          id: "face.vinylSeries",
          componentId: "FACE",
          label: "Serie Oracal",
          type: "select",
          required: true,
          options: [
            { value: "641", label: "Oracal 641" },
            { value: "651", label: "Oracal 651" },
            { value: "8500", label: "Oracal 8500" },
          ],
          visibleWhen: { kind: "fieldEquals", fieldId: "face.finish", value: "oracal" },
        },
        {
          id: "face.colorId",
          componentId: "FACE",
          label: "Culoare",
          type: "catalog_color",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "face.finish", value: "oracal" },
        },
        {
          id: "face.rollProfileId",
          componentId: "FACE",
          label: "Rolă",
          type: "catalog_roll",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "face.finish", value: "oracal" },
        },
        {
          id: "face.printRollProfileId",
          componentId: "FACE",
          label: "Rolă print",
          type: "catalog_roll",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "face.finish", value: "print" },
        },
        {
          id: "face.lamination",
          componentId: "FACE",
          label: "Laminare",
          type: "select",
          required: true,
          options: [
            { value: "none", label: "Fără laminare" },
            { value: "laminated", label: "Cu laminare" },
          ],
          visibleWhen: { kind: "fieldEquals", fieldId: "face.finish", value: "print" },
        },
        {
          id: "face.confirmedAreaMm2",
          componentId: "FACE",
          label: "Suprafață confirmată (mm²)",
          type: "number",
          required: true,
          min: 1,
          visibleWhen: { kind: "always" },
          hint: "Valoare confirmată de operator. Nu este geometrie calculată de WorkOS. Spatele folosește aceeași suprafață.",
        },
      ],
    },
    {
      id: "volume",
      title: "Volum",
      componentId: "VOLUME",
      fields: [
        {
          id: "volume.depthMm",
          componentId: "VOLUME",
          label: "Adâncime volum (mm)",
          type: "select",
          required: true,
          options: [
            { value: "30", label: "30 mm" },
            { value: "60", label: "60 mm" },
            { value: "80", label: "80 mm" },
            { value: "100", label: "100 mm" },
          ],
          visibleWhen: { kind: "always" },
        },
        {
          id: "volume.finish",
          componentId: "VOLUME",
          label: "Finisaj volum",
          type: "select",
          required: true,
          options: [
            { value: "stock", label: "Stoc" },
            { value: "oracal", label: "Oracal" },
            { value: "painted", label: "Vopsit RAL" },
          ],
          visibleWhen: { kind: "always" },
        },
        {
          id: "volume.stockColor",
          componentId: "VOLUME",
          label: "Culoare / descriere stoc",
          type: "text",
          required: false,
          visibleWhen: { kind: "fieldEquals", fieldId: "volume.finish", value: "stock" },
        },
        {
          id: "volume.vinylSeries",
          componentId: "VOLUME",
          label: "Serie Oracal",
          type: "select",
          required: true,
          options: [
            { value: "641", label: "Oracal 641" },
            { value: "651", label: "Oracal 651" },
          ],
          visibleWhen: { kind: "fieldEquals", fieldId: "volume.finish", value: "oracal" },
        },
        {
          id: "volume.colorId",
          componentId: "VOLUME",
          label: "Culoare",
          type: "catalog_color",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "volume.finish", value: "oracal" },
        },
        {
          id: "volume.rollProfileId",
          componentId: "VOLUME",
          label: "Rolă",
          type: "catalog_roll",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "volume.finish", value: "oracal" },
        },
        {
          id: "volume.ralColorId",
          componentId: "VOLUME",
          label: "Culoare RAL",
          type: "catalog_color",
          required: true,
          visibleWhen: { kind: "fieldEquals", fieldId: "volume.finish", value: "painted" },
        },
        {
          id: "volume.confirmedPerimeterMm",
          componentId: "VOLUME",
          label: "Perimetru confirmat (mm)",
          type: "number",
          required: true,
          min: 1,
          visibleWhen: { kind: "always" },
          hint: "Valoare confirmată de operator. Nu este geometrie calculată de WorkOS.",
        },
      ],
    },
  ],
};

export const frontlitPlexiAl06Template: ProductTemplate = {
  ...lettersIdentity,
  version: "2",
  formSchemaId: LETTERS_FORM_SCHEMA_V2_ID,
  slotFinishAllowances: [
    {
      slot: "FACE",
      allowedApplicationIds: LETTERS_FACE_V2_ALLOWED_APPLICATIONS,
    },
    {
      slot: "VOLUME",
      allowedApplicationIds: LETTERS_VOLUME_V2_ALLOWED_APPLICATIONS,
    },
  ],
};
