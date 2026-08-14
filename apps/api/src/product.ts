import {
  compileAggregate,
  compileDefinition,
  confirmTruth,
  getFormSchemaForTemplate,
  getProductTemplate,
  type DraftConfiguration,
  type DraftValue,
  type DraftValues,
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

export function registerProductRoutes(app: Hono): void {
  app.get("/api/product-templates/:templateCode", (c) => {
    const templateCode = c.req.param("templateCode");
    const template = getProductTemplate(templateCode);
    const formSchema = getFormSchemaForTemplate(templateCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ template, formSchema });
  });

  app.post("/api/product-templates/:templateCode/compile", async (c) => {
    const templateCode = c.req.param("templateCode");
    const template = getProductTemplate(templateCode);
    const formSchema = getFormSchemaForTemplate(templateCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }

    const definition = compileDefinition(
      template,
      formSchema,
      readDraft(templateCode, await c.req.json()),
    );
    return c.json({ definition });
  });

  app.post("/api/product-templates/:templateCode/confirm", async (c) => {
    const templateCode = c.req.param("templateCode");
    const template = getProductTemplate(templateCode);
    const formSchema = getFormSchemaForTemplate(templateCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }

    const definition = compileDefinition(
      template,
      formSchema,
      readDraft(templateCode, await c.req.json()),
    );
    const confirmed = confirmTruth(definition);
    if ("ok" in confirmed) {
      return c.json({ error: "not_ready", definition }, 422);
    }

    return c.json({
      truth: confirmed,
      aggregate: compileAggregate(confirmed, template, formSchema),
    });
  });
}
