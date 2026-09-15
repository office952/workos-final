import { acmCassetteNoneFormSchema, acmCassetteNoneTemplate } from "./acmCassetteNone.js";
import {
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06FormSchemaV1,
  frontlitPlexiAl06Template,
  frontlitPlexiAl06TemplateV1,
} from "./frontlitPlexiAl06.js";
import type { FormSchema, ProductTemplate } from "./types.js";

export const productTemplates: readonly ProductTemplate[] = [
  frontlitPlexiAl06Template,
  acmCassetteNoneTemplate,
];

export const historicalProductTemplates: readonly ProductTemplate[] = [
  frontlitPlexiAl06TemplateV1,
];

export const formSchemas: readonly FormSchema[] = [
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06FormSchemaV1,
  acmCassetteNoneFormSchema,
];

const allTemplates: readonly ProductTemplate[] = [
  ...productTemplates,
  ...historicalProductTemplates,
];

export function getProductTemplate(code: string, version?: string): ProductTemplate | undefined {
  if (version) {
    return allTemplates.find((item) => item.code === code && item.version === version);
  }
  return productTemplates.find((item) => item.code === code);
}

export function getFormSchema(id: string): FormSchema | undefined {
  return formSchemas.find((item) => item.id === id);
}

export function getFormSchemaForTemplate(code: string, version?: string): FormSchema | undefined {
  const template = getProductTemplate(code, version);
  return template ? getFormSchema(template.formSchemaId) : undefined;
}
