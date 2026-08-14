import {
  compileAggregate,
  compileDefinition,
  compileEic,
  confirmReviewedDefinition,
  getFormSchemaForTemplate,
  getProductTemplate,
  projectProductCatalog,
  type DraftConfiguration,
  type DraftValue,
  type DraftValues,
  type ProductDefinition,
} from "@workos-final/domain";
import type { Hono } from "hono";

function asDraftValues(value: unknown): DraftValues {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const values: DraftValues = {};
  for (const [key, entry] of Object.entries(value)) {
    if (
      entry === null ||
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean"
    ) {
      values[key] = entry as DraftValue;
    }
  }
  return values;
}

function readDraft(templateCode: string, body: unknown): DraftConfiguration {
  const values =
    typeof body === "object" && body !== null && "values" in body
      ? asDraftValues((body as { values: unknown }).values)
      : {};
  return { templateCode, values };
}

function readReviewedDefinition(body: unknown): {
  definition: ProductDefinition | null;
  reviewId: string;
} {
  if (typeof body !== "object" || body === null) {
    return { definition: null, reviewId: "" };
  }
  const payload = body as { definition?: ProductDefinition; reviewId?: string };
  return {
    definition: payload.definition ?? null,
    reviewId: typeof payload.reviewId === "string" ? payload.reviewId : "",
  };
}

export function registerProductRoutes(app: Hono): void {
  app.get("/api/product-catalog", (c) => {
    return c.json({ tree: projectProductCatalog() });
  });

  app.get("/api/products/:productCode", (c) => {
    const productCode = c.req.param("productCode");
    const template = getProductTemplate(productCode);
    const formSchema = getFormSchemaForTemplate(productCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ template, formSchema });
  });

  app.post("/api/products/:productCode/compile", async (c) => {
    const productCode = c.req.param("productCode");
    const template = getProductTemplate(productCode);
    const formSchema = getFormSchemaForTemplate(productCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }

    const definition = compileDefinition(
      template,
      formSchema,
      readDraft(productCode, await c.req.json()),
    );
    return c.json({ definition, reviewId: definition.reviewId });
  });

  app.post("/api/products/:productCode/confirm", async (c) => {
    const productCode = c.req.param("productCode");
    const template = getProductTemplate(productCode);
    const formSchema = getFormSchemaForTemplate(productCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }

    const { definition, reviewId } = readReviewedDefinition(await c.req.json());
    if (!definition || definition.templateCode !== productCode) {
      return c.json({ error: "review_required" }, 400);
    }

    const confirmed = confirmReviewedDefinition(definition, reviewId);
    if ("ok" in confirmed) {
      const status = confirmed.reason === "review_mismatch" ? 409 : 422;
      return c.json(
        { error: confirmed.reason, definition: confirmed.definition },
        status,
      );
    }

    const aggregate = compileAggregate(confirmed, template, formSchema);
    return c.json({
      truth: confirmed,
      aggregate,
      eic: compileEic(aggregate),
    });
  });
}
