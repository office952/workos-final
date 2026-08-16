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
  type TaskMutationError,
  type TaskMutationResult,
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
        executionPlan: projectExecutionPlanView(stored.record, runtime.listPeople()),
      });
    },
  );

  app.get("/api/execution-plans/:planId", (c) => {
    const record = runtime.readExecutionPlan(c.req.param("planId"));
    if (!record) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ executionPlan: projectExecutionPlanView(record, runtime.listPeople()) });
  });

  app.post("/api/execution-tasks/:taskId/provider", async (c) => {
    const providerId = readProviderId(await c.req.json());
    if (!providerId) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    return respondTaskMutation(
      c,
      runtime,
      runtime.assignExecutionTaskProvider(c.req.param("taskId"), providerId),
    );
  });

  app.post("/api/execution-tasks/:taskId/executor", async (c) => {
    const personId = readPersonId(await c.req.json().catch(() => null));
    if (!personId) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    return respondTaskMutation(
      c,
      runtime,
      runtime.assignExecutionTaskExecutor(c.req.param("taskId"), personId),
    );
  });

  app.post("/api/execution-tasks/:taskId/start", (c) => {
    return respondTaskMutation(c, runtime, runtime.startExecutionTask(c.req.param("taskId")));
  });

  app.post("/api/execution-tasks/:taskId/complete", async (c) => {
    const input = readCompletionInput(await c.req.json().catch(() => ({})));
    if (!input) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    return respondTaskMutation(
      c,
      runtime,
      runtime.completeExecutionTask(c.req.param("taskId"), input),
    );
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

function readCompletionInput(body: unknown): { completedQuantity?: number; note?: string } | null {
  if (body === undefined || body === null) {
    return {};
  }
  if (typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const record = body as { completedQuantity?: unknown; note?: unknown };
  if (
    "completedQuantity" in record &&
    record.completedQuantity !== undefined &&
    typeof record.completedQuantity !== "number"
  ) {
    return null;
  }
  if ("note" in record && record.note !== undefined && typeof record.note !== "string") {
    return null;
  }
  return {
    ...(typeof record.completedQuantity === "number"
      ? { completedQuantity: record.completedQuantity }
      : {}),
    ...(typeof record.note === "string" ? { note: record.note } : {}),
  };
}

function readProviderId(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("providerId" in body)) {
    return null;
  }
  const value = (body as { providerId: unknown }).providerId;
  if (typeof value !== "string") {
    return null;
  }
  const providerId = value.trim();
  return providerId.length > 0 ? providerId : null;
}

function mutationHttpStatus(error: TaskMutationError): 404 | 409 | 422 {
  switch (error) {
    case "not_found":
      return 404;
    case "ineligible_provider":
    case "missing_assignment":
    case "missing_executor":
    case "provider_unavailable":
    case "executor_unavailable":
    case "unknown_person":
    case "retired_person":
    case "invalid_quantity":
    case "invalid_note":
      return 422;
    case "reassignment_locked":
    case "dependencies_incomplete":
    case "invalid_transition":
      return 409;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}

function readPersonId(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("personId" in body)) {
    return null;
  }
  const value = (body as { personId: unknown }).personId;
  if (typeof value !== "string") {
    return null;
  }
  const personId = value.trim();
  return personId.length > 0 ? personId : null;
}

function respondTaskMutation(
  c: { json: (body: unknown, status?: 200 | 404 | 409 | 422) => Response },
  runtime: ProductSystemRuntime,
  result: TaskMutationResult,
) {
  if (!result.ok) {
    return c.json({ error: result.error }, mutationHttpStatus(result.error));
  }
  return c.json({
    alreadyApplied: result.alreadyApplied,
    executionPlan: projectExecutionPlanView(result.record, runtime.listPeople()),
  });
}
