import type { FormSchema, ProductTemplate } from "./types.js";

export const LETTERS_FAMILY = {
  id: "LETTERS",
  label: "Litere volumetrice",
} as const;

export const lettersTemplate: ProductTemplate = {
  code: "letters",
  version: "1",
  family: LETTERS_FAMILY,
  label: "Litere volumetrice",
  description: "Configurare tehnică minimă pentru litere volumetrice.",
  formSchemaId: "letters-form-v1",
  status: "PILOT",
  components: [
    { id: "FACE", label: "Față", required: true },
    { id: "RETURN_CANT", label: "Cant", required: true },
    { id: "BACK", label: "Spate", required: true },
    {
      id: "LIGHTING",
      label: "Iluminare",
      required: false,
      selectionFieldId: "lighting.selected",
    },
  ],
};

export const lettersFormSchema: FormSchema = {
  id: "letters-form-v1",
  templateCode: "letters",
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
          id: "face.material",
          componentId: "FACE",
          label: "Material față",
          type: "select",
          required: true,
          options: [{ value: "plexiglas", label: "Plexiglas" }],
          visibleWhen: { kind: "always" },
        },
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
          id: "returnCant.material",
          componentId: "RETURN_CANT",
          label: "Material cant",
          type: "select",
          required: true,
          options: [{ value: "aluminum", label: "Aluminiu" }],
          visibleWhen: { kind: "always" },
        },
        {
          id: "returnCant.depthMm",
          componentId: "RETURN_CANT",
          label: "Adâncime cant (mm)",
          type: "number",
          required: true,
          min: 1,
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
      ],
    },
    {
      id: "back",
      title: "Spate",
      componentId: "BACK",
      fields: [
        {
          id: "back.material",
          componentId: "BACK",
          label: "Material spate",
          type: "select",
          required: true,
          options: [{ value: "forex", label: "Forex" }],
          visibleWhen: { kind: "always" },
        },
      ],
    },
    {
      id: "lighting",
      title: "Iluminare",
      componentId: "LIGHTING",
      fields: [
        {
          id: "lighting.selected",
          componentId: "LIGHTING",
          label: "Include iluminare",
          type: "boolean",
          required: false,
          visibleWhen: { kind: "always" },
        },
        {
          id: "lighting.mode",
          componentId: "LIGHTING",
          label: "Tip iluminare",
          type: "select",
          required: true,
          options: [{ value: "front_lit", label: "Iluminare frontală" }],
          visibleWhen: { kind: "componentSelected", componentId: "LIGHTING" },
        },
      ],
    },
  ],
};

export const productTemplates: readonly ProductTemplate[] = [lettersTemplate];
export const formSchemas: readonly FormSchema[] = [lettersFormSchema];

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
