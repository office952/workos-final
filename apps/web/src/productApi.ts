import type {
  DraftValues,
  FormSchema,
  ProductAggregate,
  ProductDefinition,
  ProductTemplate,
  ProductTruth,
} from "@workos-final/domain";

export type TemplateProjection = {
  template: ProductTemplate;
  formSchema: FormSchema;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchTemplateProjection(
  templateCode: string,
): Promise<TemplateProjection | null> {
  const response = await fetch(`${baseUrl}/api/product-templates/${templateCode}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("template_unavailable");
  }
  return readJson<TemplateProjection>(response);
}

export async function compileConfiguration(
  templateCode: string,
  values: DraftValues,
): Promise<ProductDefinition> {
  const response = await fetch(
    `${baseUrl}/api/product-templates/${templateCode}/compile`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values }),
    },
  );
  if (!response.ok) {
    throw new Error("compile_unavailable");
  }
  const body = await readJson<{ definition: ProductDefinition }>(response);
  return body.definition;
}

export async function confirmConfiguration(
  templateCode: string,
  values: DraftValues,
): Promise<
  | { ok: true; truth: ProductTruth; aggregate: ProductAggregate }
  | { ok: false; definition: ProductDefinition }
> {
  const response = await fetch(
    `${baseUrl}/api/product-templates/${templateCode}/confirm`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values }),
    },
  );
  const body = await readJson<{
    truth?: ProductTruth;
    aggregate?: ProductAggregate;
    definition?: ProductDefinition;
  }>(response);

  if (response.status === 422 && body.definition) {
    return { ok: false, definition: body.definition };
  }
  if (!response.ok || !body.truth || !body.aggregate) {
    throw new Error("confirm_unavailable");
  }
  return { ok: true, truth: body.truth, aggregate: body.aggregate };
}
