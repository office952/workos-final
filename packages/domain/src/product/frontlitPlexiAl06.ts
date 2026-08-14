import {
  FRONT_LIT_VOLUMETRIC_LETTERS_CATEGORY_ID,
  LIGHTED_VOLUMETRIC_SIGNS_FAMILY_ID,
} from "./catalog.js";
import type { FormSchema, ProductTemplate } from "./types.js";

export const CANONICAL_PRODUCT_CODE = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";

export const frontlitPlexiAl06Template: ProductTemplate = {
  code: CANONICAL_PRODUCT_CODE,
  version: "1",
  familyId: LIGHTED_VOLUMETRIC_SIGNS_FAMILY_ID,
  categoryId: FRONT_LIT_VOLUMETRIC_LETTERS_CATEGORY_ID,
  label: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
  description:
    "Litere volumetrice luminoase cu iluminare față, față din plexiglas și volum din aluminiu 0,6 mm.",
  legacyReference: "TPL-VOLUMETRIC-LETTERS_v2",
  identityFacts: [
    { id: "lighting", label: "Iluminare", value: "Iluminare frontală" },
    { id: "face.material", label: "Material față", value: "Plexiglas" },
    { id: "returnCant.material", label: "Material volum", value: "Aluminiu 0,6 mm" },
    { id: "back.material", label: "Material spate", value: "Forex" },
  ],
  fixedValues: {
    "face.material": "plexiglas",
    "returnCant.material": "aluminum_0_6",
    "back.material": "forex",
    "lighting.mode": "front_lit",
  },
  formSchemaId: "prd-letters-frontlit-plexi-al06-form-v1",
  status: "PILOT",
  components: [
    { id: "FACE", label: "Față", required: true },
    { id: "RETURN_CANT", label: "Cant", required: true },
    { id: "BACK", label: "Spate", required: true },
    { id: "LIGHTING", label: "Iluminare", required: true },
  ],
};

export const frontlitPlexiAl06FormSchema: FormSchema = {
  id: "prd-letters-frontlit-plexi-al06-form-v1",
  templateCode: CANONICAL_PRODUCT_CODE,
  sections: [
    {
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
    },
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
      ],
    },
    {
      id: "return-cant",
      title: "Cant",
      componentId: "RETURN_CANT",
      fields: [
        {
          id: "returnCant.depthMm",
          componentId: "RETURN_CANT",
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
          id: "returnCant.finish",
          componentId: "RETURN_CANT",
          label: "Finisaj cant",
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
          id: "returnCant.color",
          componentId: "RETURN_CANT",
          label: "Culoare cant",
          type: "text",
          required: true,
          visibleWhen: {
            kind: "fieldIn",
            fieldId: "returnCant.finish",
            values: ["vinyl", "painted"],
          },
        },
        {
          id: "returnCant.confirmedPerimeterMm",
          componentId: "RETURN_CANT",
          label: "Perimetru confirmat (mm)",
          type: "number",
          required: true,
          min: 1,
          visibleWhen: { kind: "always" },
        },
      ],
    },
  ],
};

export const productTemplates: readonly ProductTemplate[] = [frontlitPlexiAl06Template];
export const formSchemas: readonly FormSchema[] = [frontlitPlexiAl06FormSchema];

export function getProductTemplate(code: string): ProductTemplate | undefined {
  return productTemplates.find((item) => item.code === code);
}

export function getFormSchema(id: string): FormSchema | undefined {
  return formSchemas.find((item) => item.id === id);
}

export function getFormSchemaForTemplate(code: string): FormSchema | undefined {
  const template = getProductTemplate(code);
  return template ? getFormSchema(template.formSchemaId) : undefined;
}
