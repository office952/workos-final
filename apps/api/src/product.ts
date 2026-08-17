import {
  compileAggregate,
  compileDefinition,
  compileEic,
  compileExecutionPlanPreview,
  freezeOrderSnapshot,
  freezeQuoteSnapshot,
  projectQuoteDocument,
  projectCommercialPrice,
  recordQuoteAcceptance,
  composeProductProcesses,
  composeProductProcessesFromTruth,
  confirmReviewedDefinition,
  assertOrderReleaseReadyForExecution,
  freezeAcceptedProductionSnapshot,
  freezeProductionReleaseFromOrder,
  lettersProcessCompositionInspections,
  materializeExecutionPlanFromSnapshot,
  projectExecutionPlanView,
  type ActualConsumptionLineInput,
  type ExecutionPlanRecord,
  type TaskCompletionInput,
  type TaskMutationError,
  type TaskMutationResult,
  type DraftConfiguration,
  type DraftValue,
  type DraftValues,
  type ProductDefinition,
} from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "./productSystem/runtime.js";
import { renderQuoteDocumentPdf } from "./quoteDocument/renderQuoteDocumentPdf.js";


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

function readRequestId(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("requestId" in body)) {
    return null;
  }
  const value = (body as { requestId: unknown }).requestId;
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readCustomerId(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("customerId" in body)) {
    return null;
  }
  const value = (body as { customerId: unknown }).customerId;
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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
      commercialPrice: projectCommercialPrice(compiled.eic),
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

  app.post("/api/products/:productCode/quote-snapshots", async (c) => {
    const body = await c.req.json().catch(() => null);
    const compiled = compileAcceptedProduct(
      runtime,
      c.req.param("productCode"),
      body,
    );
    if (!compiled.ok) {
      return c.json(compiled.body, compiled.status);
    }
    const customerId = readCustomerId(body);
    if (!customerId) {
      return c.json(
        {
          error: "missing_customer",
          reasons: ["Oferta comercială necesită un client înainte de înghețare."],
        },
        422,
      );
    }
    const customer = runtime.getCustomer(customerId);
    if (!customer || customer.status !== "ACTIVE") {
      return c.json(
        {
          error: "customer_unavailable",
          reasons: ["Clientul selectat nu poate fi folosit pentru o ofertă nouă."],
        },
        422,
      );
    }
    const requestId = readRequestId(body);
    if (requestId) {
      const request = runtime.readCommercialRequest(requestId);
      if (!request) {
        return c.json(
          {
            error: "request_unavailable",
            reasons: ["Cererea de ofertă nu este disponibilă."],
          },
          422,
        );
      }
      if (request.status === "CANCELLED") {
        return c.json(
          {
            error: "request_cancelled",
            reasons: ["Cererea anulată nu poate primi o ofertă nouă."],
          },
          422,
        );
      }
      if (request.customerId !== customerId) {
        return c.json(
          {
            error: "request_customer_mismatch",
            reasons: ["Oferta trebuie să folosească același client ca cererea."],
          },
          422,
        );
      }
    }
    const commercialPrice = projectCommercialPrice(compiled.eic);
    const seller = runtime.getSellerProfile();
    const frozen = freezeQuoteSnapshot(
      compiled.truth,
      compiled.aggregate,
      compiled.composition,
      compiled.eic,
      commercialPrice,
      {
        customer: {
          customerId: customer.customerId,
          displayName: customer.displayName,
        },
        seller,
      },
    );
    if (!frozen.ok) {
      return c.json(
        { error: frozen.error, reasons: frozen.reasons },
        422,
      );
    }
    const stored = runtime.persistQuoteSnapshot(frozen.snapshot);
    if (!requestId) {
      return c.json({
        created: stored.created,
        quoteSnapshot: stored.snapshot,
      });
    }
    const linked = runtime.linkRequestQuote(requestId, stored.snapshot.quoteSnapshotId);
    if (!linked.ok) {
      return c.json({
        created: stored.created,
        quoteSnapshot: stored.snapshot,
        requestLinkError: linked.error,
        reasons: ["Oferta a fost creată, dar nu s-a legat de cerere."],
      });
    }
    return c.json({
      created: stored.created,
      quoteSnapshot: stored.snapshot,
      requestLink: linked.link,
    });
  });

  app.get("/api/products/:productCode/quote-snapshots/:quoteSnapshotId", (c) => {
    const snapshot = runtime.readQuoteSnapshot(c.req.param("quoteSnapshotId"));
    if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ quoteSnapshot: snapshot });
  });

  app.get(
    "/api/products/:productCode/quote-snapshots/:quoteSnapshotId/document",
    async (c) => {
      const snapshot = runtime.readQuoteSnapshot(c.req.param("quoteSnapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const model = projectQuoteDocument(snapshot);
      const bytes = await renderQuoteDocumentPdf(model);
      return c.body(Buffer.from(bytes), 200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${model.filename}"`,
      });
    },
  );

  app.post(
    "/api/products/:productCode/quote-snapshots/:quoteSnapshotId/acceptance",
    (c) => {
      const snapshot = runtime.readQuoteSnapshot(c.req.param("quoteSnapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const recorded = recordQuoteAcceptance(snapshot);
      if (!recorded.ok) {
        return c.json(
          { error: recorded.error, reasons: recorded.reasons },
          422,
        );
      }
      const stored = runtime.persistQuoteAcceptance(recorded.decision);
      return c.json({
        created: stored.created,
        acceptanceDecision: stored.decision,
        quoteSnapshot: snapshot,
      });
    },
  );

  app.get(
    "/api/products/:productCode/quote-snapshots/:quoteSnapshotId/acceptance",
    (c) => {
      const snapshot = runtime.readQuoteSnapshot(c.req.param("quoteSnapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const decision = runtime.readQuoteAcceptance(snapshot.quoteSnapshotId);
      if (!decision) {
        return c.json({ error: "not_found" }, 404);
      }
      return c.json({
        acceptanceDecision: decision,
        quoteSnapshot: snapshot,
      });
    },
  );

  app.post(
    "/api/products/:productCode/quote-snapshots/:quoteSnapshotId/order",
    (c) => {
      const snapshot = runtime.readQuoteSnapshot(c.req.param("quoteSnapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const acceptance = runtime.readQuoteAcceptance(snapshot.quoteSnapshotId);
      if (!acceptance) {
        return c.json(
          {
            error: "quote_not_accepted",
            reasons: ["Comanda poate fi creată doar dintr-o ofertă acceptată."],
          },
          422,
        );
      }
      const frozen = freezeOrderSnapshot(snapshot, acceptance);
      if (!frozen.ok) {
        return c.json(
          { error: frozen.error, reasons: frozen.reasons },
          422,
        );
      }
      const stored = runtime.persistOrderSnapshot(frozen.snapshot);
      return c.json({
        created: stored.created,
        orderSnapshot: stored.snapshot,
        quoteSnapshot: snapshot,
        acceptanceDecision: acceptance,
      });
    },
  );

  app.get(
    "/api/products/:productCode/quote-snapshots/:quoteSnapshotId/order",
    (c) => {
      const snapshot = runtime.readQuoteSnapshot(c.req.param("quoteSnapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const orderSnapshot = runtime.readOrderSnapshotByQuote(snapshot.quoteSnapshotId);
      if (!orderSnapshot) {
        return c.json({ error: "not_found" }, 404);
      }
      return c.json({
        orderSnapshot,
        quoteSnapshot: snapshot,
        acceptanceDecision: runtime.readQuoteAcceptance(snapshot.quoteSnapshotId),
      });
    },
  );

  app.get("/api/products/:productCode/orders/:orderSnapshotId", (c) => {
    const orderSnapshot = runtime.readOrderSnapshot(c.req.param("orderSnapshotId"));
    if (!orderSnapshot || orderSnapshot.productCode !== c.req.param("productCode")) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ orderSnapshot });
  });

  app.post(
    "/api/products/:productCode/orders/:orderSnapshotId/production-release",
    (c) => {
      const orderSnapshot = runtime.readOrderSnapshot(c.req.param("orderSnapshotId"));
      if (!orderSnapshot || orderSnapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const frozen = freezeProductionReleaseFromOrder(orderSnapshot);
      if (!frozen.ok) {
        return c.json(
          { error: frozen.error, reasons: frozen.reasons },
          422,
        );
      }
      const stored = runtime.acceptProductionSnapshot(frozen.snapshot);
      return c.json({
        created: stored.created,
        snapshot: stored.snapshot,
        orderSnapshot,
      });
    },
  );

  app.get(
    "/api/products/:productCode/orders/:orderSnapshotId/production-release",
    (c) => {
      const orderSnapshot = runtime.readOrderSnapshot(c.req.param("orderSnapshotId"));
      if (!orderSnapshot || orderSnapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const snapshot = runtime.readProductionReleaseByOrder(orderSnapshot.orderSnapshotId);
      if (!snapshot) {
        return c.json({ error: "not_found" }, 404);
      }
      return c.json({
        snapshot,
        orderSnapshot,
      });
    },
  );

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
      const order = snapshot.sourceOrderSnapshotId
        ? runtime.readOrderSnapshot(snapshot.sourceOrderSnapshotId)
        : null;
      const gate = assertOrderReleaseReadyForExecution(snapshot, order);
      if (!gate.ok) {
        return c.json(
          { error: gate.error, reasons: gate.reasons },
          422,
        );
      }
      const stored = runtime.persistExecutionPlan(
        materializeExecutionPlanFromSnapshot(snapshot),
      );
      return c.json({
        created: stored.created,
        executionPlan: projectPlanView(runtime, stored.record),
      });
    },
  );

  app.get(
    "/api/products/:productCode/accepted-production-snapshots/:snapshotId/execution-plan",
    (c) => {
      const snapshot = runtime.readProductionSnapshot(c.req.param("snapshotId"));
      if (!snapshot || snapshot.productCode !== c.req.param("productCode")) {
        return c.json({ error: "not_found" }, 404);
      }
      const record = runtime.readExecutionPlanBySnapshot(snapshot.snapshotId);
      if (!record) {
        return c.json({ error: "not_found" }, 404);
      }
      return c.json({
        executionPlan: projectPlanView(runtime, record),
      });
    },
  );

  app.get("/api/execution-plans/:planId", (c) => {
    const record = runtime.readExecutionPlan(c.req.param("planId"));
    if (!record) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ executionPlan: projectPlanView(runtime, record) });
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

function readCompletionInput(body: unknown): TaskCompletionInput | null {
  if (body === undefined || body === null) {
    return {};
  }
  if (typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const record = body as {
    completedQuantity?: unknown;
    note?: unknown;
    actualConsumption?: unknown;
  };
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
  const actualConsumption =
    "actualConsumption" in record && record.actualConsumption !== undefined
      ? readActualConsumption(record.actualConsumption)
      : undefined;
  if (actualConsumption === null) {
    return null;
  }
  return {
    ...(typeof record.completedQuantity === "number"
      ? { completedQuantity: record.completedQuantity }
      : {}),
    ...(typeof record.note === "string" ? { note: record.note } : {}),
    ...(actualConsumption ? { actualConsumption } : {}),
  };
}

function readActualConsumption(value: unknown): ActualConsumptionLineInput[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const lines: ActualConsumptionLineInput[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return null;
    }
    const row = item as {
      resourceId?: unknown;
      actualQuantity?: unknown;
      unit?: unknown;
      note?: unknown;
    };
    if (typeof row.resourceId !== "string" || row.resourceId.trim().length === 0) {
      return null;
    }
    if (typeof row.actualQuantity !== "number") {
      return null;
    }
    if (row.unit !== undefined && typeof row.unit !== "string") {
      return null;
    }
    if (row.note !== undefined && typeof row.note !== "string") {
      return null;
    }
    lines.push({
      resourceId: row.resourceId,
      actualQuantity: row.actualQuantity,
      ...(typeof row.unit === "string" ? { unit: row.unit } : {}),
      ...(typeof row.note === "string" ? { note: row.note } : {}),
    });
  }
  return lines;
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
    case "unavailable_person":
    case "ineligible_executor":
    case "invalid_quantity":
    case "invalid_unit":
    case "invalid_resource":
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

function projectPlanView(runtime: ProductSystemRuntime, record: ExecutionPlanRecord) {
  return projectExecutionPlanView(
    record,
    runtime.listPeople(),
    runtime.readProductionSnapshot(record.plan.sourceSnapshotId),
    runtime.peopleEligibilityContext(),
  );
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
    executionPlan: projectPlanView(runtime, result.record),
  });
}
