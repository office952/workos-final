import type {
  CatalogTreeNode,
  DraftValues,
  EicResult,
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

export async function fetchProductCatalog(): Promise<CatalogTreeNode[]> {
  const response = await fetch(`${baseUrl}/api/product-catalog`);
  if (!response.ok) {
    throw new Error("catalog_unavailable");
  }
  const body = await readJson<{ tree: CatalogTreeNode[] }>(response);
  return body.tree;
}

export async function fetchTemplateProjection(
  productCode: string,
): Promise<TemplateProjection | null> {
  const response = await fetch(`${baseUrl}/api/products/${productCode}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("template_unavailable");
  }
  return readJson<TemplateProjection>(response);
}

export async function compileConfiguration(
  productCode: string,
  values: DraftValues,
): Promise<ProductDefinition> {
  const response = await fetch(`${baseUrl}/api/products/${productCode}/compile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ values }),
  });
  if (!response.ok) {
    throw new Error("compile_unavailable");
  }
  const body = await readJson<{ definition: ProductDefinition }>(response);
  return body.definition;
}

export async function confirmReviewedConfiguration(
  productCode: string,
  definition: ProductDefinition,
): Promise<
  | {
      ok: true;
      truth: ProductTruth;
      aggregate: ProductAggregate;
      eic: EicResult;
    }
  | { ok: false; reason: "not_ready" | "review_mismatch"; definition: ProductDefinition }
> {
  const response = await fetch(`${baseUrl}/api/products/${productCode}/confirm`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      definition,
      reviewId: definition.reviewId,
    }),
  });
  const body = await readJson<{
    truth?: ProductTruth;
    aggregate?: ProductAggregate;
    eic?: EicResult;
    definition?: ProductDefinition;
    error?: string;
  }>(response);

  if (response.status === 409 && body.definition) {
    return { ok: false, reason: "review_mismatch", definition: body.definition };
  }
  if (response.status === 422 && body.definition) {
    return { ok: false, reason: "not_ready", definition: body.definition };
  }
  if (!response.ok || !body.truth || !body.aggregate || !body.eic) {
    throw new Error("confirm_unavailable");
  }
  return {
    ok: true,
    truth: body.truth,
    aggregate: body.aggregate,
    eic: body.eic,
  };
}
