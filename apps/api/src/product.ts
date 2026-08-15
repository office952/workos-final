import {
  compileAggregate,
  compileDefinition,
  compileEic,
  compileExecutionPlanPreview,
  composeProductProcesses,
  composeProductProcessesFromTruth,
  confirmReviewedDefinition,
  freezeAcceptedProductionSnapshot,
  lettersProcessCompositionInspections,
  materializeExecutionPlanFromSnapshot,
  projectExecutionPlanView,
  type DraftConfiguration,
  type DraftValue,
  type DraftValues,
  type ProductDefinition,
} from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "./productSystem/runtime.js";

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

export function registerProductRoutes(
  app: Hono,
  runtime: ProductSystemRuntime,
): void {
  app.get("/api/product-catalog", (c) => {
    return c.json({ tree: runtime.present().catalog });
  });

  app.get("/api/products/:productCode", (c) => {
    const productCode = c.req.param("productCode");
    const presented = runtime.present();
    const template = presented.template(productCode);
    const formSchema = presented.formSchema(productCode);
    if (!template || !formSchema) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ template, formSchema });
  });

  app.get("/api/products/:productCode/process-composition", (c) => {
    const productCode = c.req.param("productCode");
    const template = runtime.present().template(productCode);
    if (!template) {
      return c.json({ error: "not_found" }, 404);
    }
    const faceFinish = c.req.query("faceFinish");
    const volumeFinish = c.req.query("volumeFinish");
    const values: DraftValues = {
      ...(faceFinish ? { "face.finish": faceFinish } : {}),
      ...(volumeFinish ? { "volume.finish": volumeFinish } : {}),
    };
    return c.json({
      composition: composeProductProcesses(template, values),
      inspections: lettersProcessCompositionInspections(template),
    });
  });

  app.post("/api/products/:productCode/compile", async (c) => {
    const productCode = c.req.param("productCode");
    const presented = runtime.present();
    const template = presented.template(productCode);
    const formSchema = presented.formSchema(productCode);
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
    const compiled = compileAcceptedProduct(
      runtime,
      c.req.param("productCode"),
      await c.req.json(),
    );
    if (!compiled.ok) {
      return c.json(compiled.body, compiled.status);
    }
    return c.json({
      truth: compiled.truth,
      aggregate: compiled.aggregate,
      eic: compiled.eic,
      executionPlanPreview: compileExecutionPlanPreview(
        compiled.truth,
        compiled.aggregate,
        compiled.template,
        compiled.eic,
      ),
    });
  });

  app.post("/api/products/:productCode/accepted-production-snapshot", async (c) => {
    const compiled = compileAcceptedProduct(
      runtime,
      c.req.param("productCode"),
      await c.req.json(),
    );
    if (!compiled.ok) {
      return c.json(compiled.body, compiled.status);
    }
    const frozen = freezeAcceptedProductionSnapshot(
      compiled.truth,
      compiled.aggregate,
      compiled.composition,
      compiled.eic,
    );
    const stored = runtime.acceptProductionSnapshot(frozen);
    return c.json({
      created: stored.created,
      snapshot: stored.snapshot,
    });
  });

  app.get(
    "/api/products/:productCode/accepted-production-snapshots/:snapshotId",
    (c) => {
      const snapshot = runtime.readProductionSnapshot(c.req.param("snapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      return c.json({ snapshot });
    },
  );

  app.post(
    "/api/products/:productCode/accepted-production-snapshots/:snapshotId/execution-plan",
    (c) => {
      const snapshot = runtime.readProductionSnapshot(c.req.param("snapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const stored = runtime.persistExecutionPlan(
        materializeExecutionPlanFromSnapshot(snapshot),
      );
      return c.json({
        created: stored.created,
        executionPlan: projectExecutionPlanView(stored.record),
      });
    },
  );

  app.get("/api/execution-plans/:planId", (c) => {
    const record = runtime.readExecutionPlan(c.req.param("planId"));
    if (!record) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ executionPlan: projectExecutionPlanView(record) });
  });
}

function compileAcceptedProduct(
  runtime: ProductSystemRuntime,
  productCode: string,
  body: unknown,
) {
  const presented = runtime.present();
  const template = presented.template(productCode);
  const formSchema = presented.formSchema(productCode);
  if (!template || !formSchema) {
    return { ok: false as const, status: 404 as const, body: { error: "not_found" } };
  }

  const { definition, reviewId } = readReviewedDefinition(body);
  if (!definition || definition.templateCode !== productCode) {
    return {
      ok: false as const,
      status: 400 as const,
      body: { error: "review_required" },
    };
  }

  const confirmed = confirmReviewedDefinition(definition, reviewId);
  if ("ok" in confirmed) {
    return {
      ok: false as const,
      status: (confirmed.reason === "review_mismatch" ? 409 : 422) as 409 | 422,
      body: { error: confirmed.reason, definition: confirmed.definition },
    };
  }

  const aggregate = compileAggregate(
    confirmed,
    template,
    formSchema,
    runtime.labels(),
  );
  const composition = composeProductProcessesFromTruth(confirmed, template);
  const eic = compileEic(aggregate, composition);
  return {
    ok: true as const,
    template,
    truth: confirmed,
    aggregate,
    composition,
    eic,
  };
}
