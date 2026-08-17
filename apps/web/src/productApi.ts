import type {
  AcceptedProductionSnapshot,
  CatalogTreeNode,
  CommercialPriceProjection,
  DraftValues,
  EicResult,
  ExecutionPlanPreview,
  ExecutionPlanView,
  FormSchema,
  ProductAggregate,
  ProductDefinition,
  ProductTemplate,
  ProductTruth,
  OrderSnapshot,
  QuoteAcceptanceDecision,
  QuoteSnapshot,
} from "@workos-final/domain";

export type TemplateProjection = {
  template: ProductTemplate;
  formSchema: FormSchema;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export function quoteDocumentUrl(productCode: string, quoteSnapshotId: string): string {
  return `${baseUrl}/api/products/${productCode}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}/document`;
}

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
      commercialPrice: CommercialPriceProjection;
      executionPlanPreview: ExecutionPlanPreview;
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
    commercialPrice?: CommercialPriceProjection;
    executionPlanPreview?: ExecutionPlanPreview;
    definition?: ProductDefinition;
    error?: string;
  }>(response);

  if (response.status === 409 && body.definition) {
    return { ok: false, reason: "review_mismatch", definition: body.definition };
  }
  if (response.status === 422 && body.definition) {
    return { ok: false, reason: "not_ready", definition: body.definition };
  }
  if (
    !response.ok ||
    !body.truth ||
    !body.aggregate ||
    !body.eic ||
    !body.commercialPrice ||
    !body.executionPlanPreview
  ) {
    throw new Error("confirm_unavailable");
  }
  return {
    ok: true,
    truth: body.truth,
    aggregate: body.aggregate,
    eic: body.eic,
    commercialPrice: body.commercialPrice,
    executionPlanPreview: body.executionPlanPreview,
  };
}

export async function acceptProductionSnapshot(
  productCode: string,
  definition: ProductDefinition,
): Promise<
  | { ok: true; created: boolean; snapshot: AcceptedProductionSnapshot }
  | { ok: false; reason: "not_ready" | "review_mismatch"; definition: ProductDefinition }
> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/accepted-production-snapshot`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition,
        reviewId: definition.reviewId,
      }),
    },
  );
  const body = await readJson<{
    created?: boolean;
    snapshot?: AcceptedProductionSnapshot;
    definition?: ProductDefinition;
    error?: string;
  }>(response);

  if (response.status === 409 && body.definition) {
    return { ok: false, reason: "review_mismatch", definition: body.definition };
  }
  if (response.status === 422 && body.definition) {
    return { ok: false, reason: "not_ready", definition: body.definition };
  }
  if (!response.ok || !body.snapshot) {
    throw new Error("snapshot_unavailable");
  }
  return {
    ok: true,
    created: Boolean(body.created),
    snapshot: body.snapshot,
  };
}

export async function createQuoteSnapshot(
  productCode: string,
  definition: ProductDefinition,
  customerId: string,
): Promise<
  | { ok: true; created: boolean; quoteSnapshot: QuoteSnapshot }
  | {
      ok: false;
      reason:
        | "not_ready"
        | "review_mismatch"
        | "incomplete_offer"
        | "unavailable_offer"
        | "missing_customer"
        | "customer_unavailable"
        | "invalid_customer"
        | "invalid_seller";
      definition?: ProductDefinition;
      message?: string;
    }
> {
  const response = await fetch(`${baseUrl}/api/products/${productCode}/quote-snapshots`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      definition,
      reviewId: definition.reviewId,
      customerId,
    }),
  });
  const body = await readJson<{
    created?: boolean;
    quoteSnapshot?: QuoteSnapshot;
    definition?: ProductDefinition;
    error?: string;
    reasons?: string[];
  }>(response);

  if (response.status === 409 && body.definition) {
    return { ok: false, reason: "review_mismatch", definition: body.definition };
  }
  if (response.status === 422 && body.definition) {
    return { ok: false, reason: "not_ready", definition: body.definition };
  }
  if (
    response.status === 422 &&
    (body.error === "incomplete_offer" ||
      body.error === "unavailable_offer" ||
      body.error === "missing_customer" ||
      body.error === "customer_unavailable" ||
      body.error === "invalid_customer" ||
      body.error === "invalid_seller")
  ) {
    return {
      ok: false,
      reason: body.error,
      message: body.reasons?.[0],
    };
  }
  if (!response.ok || !body.quoteSnapshot) {
    throw new Error("quote_unavailable");
  }
  return {
    ok: true,
    created: Boolean(body.created),
    quoteSnapshot: body.quoteSnapshot,
  };
}

export async function readQuoteAcceptance(
  productCode: string,
  quoteSnapshotId: string,
): Promise<QuoteAcceptanceDecision | null> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}/acceptance`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ acceptanceDecision?: QuoteAcceptanceDecision }>(response);
  if (!response.ok || !body.acceptanceDecision) {
    throw new Error("quote_acceptance_unavailable");
  }
  return body.acceptanceDecision;
}

export async function acceptQuoteSnapshot(
  productCode: string,
  quoteSnapshotId: string,
): Promise<
  | { ok: true; created: boolean; acceptance: QuoteAcceptanceDecision; quoteSnapshot: QuoteSnapshot }
  | { ok: false; reason: "not_found" | "quote_not_acceptable" | "incompatible_quote"; message?: string }
> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}/acceptance`,
    { method: "POST" },
  );
  const body = await readJson<{
    created?: boolean;
    acceptanceDecision?: QuoteAcceptanceDecision;
    quoteSnapshot?: QuoteSnapshot;
    error?: string;
    reasons?: string[];
  }>(response);
  if (response.status === 404) {
    return { ok: false, reason: "not_found" };
  }
  if (
    response.status === 422 &&
    (body.error === "quote_not_acceptable" || body.error === "incompatible_quote")
  ) {
    return {
      ok: false,
      reason: body.error,
      message: body.reasons?.[0],
    };
  }
  if (!response.ok || !body.acceptanceDecision || !body.quoteSnapshot) {
    throw new Error("quote_acceptance_unavailable");
  }
  return {
    ok: true,
    created: Boolean(body.created),
    acceptance: body.acceptanceDecision,
    quoteSnapshot: body.quoteSnapshot,
  };
}

export async function readOrderSnapshotById(
  productCode: string,
  orderSnapshotId: string,
): Promise<OrderSnapshot | null> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/orders/${encodeURIComponent(orderSnapshotId)}`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ orderSnapshot?: OrderSnapshot }>(response);
  if (!response.ok || !body.orderSnapshot) {
    throw new Error("order_unavailable");
  }
  return body.orderSnapshot;
}

export async function readOrderSnapshot(
  productCode: string,
  quoteSnapshotId: string,
): Promise<OrderSnapshot | null> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}/order`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ orderSnapshot?: OrderSnapshot }>(response);
  if (!response.ok || !body.orderSnapshot) {
    throw new Error("order_unavailable");
  }
  return body.orderSnapshot;
}

export async function readProductionRelease(
  productCode: string,
  orderSnapshotId: string,
): Promise<AcceptedProductionSnapshot | null> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/orders/${encodeURIComponent(orderSnapshotId)}/production-release`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ snapshot?: AcceptedProductionSnapshot }>(response);
  if (!response.ok || !body.snapshot) {
    throw new Error("production_release_unavailable");
  }
  return body.snapshot;
}

export async function createProductionRelease(
  productCode: string,
  orderSnapshotId: string,
): Promise<
  | {
      ok: true;
      created: boolean;
      snapshot: AcceptedProductionSnapshot;
      orderSnapshot: OrderSnapshot;
    }
  | {
      ok: false;
      reason: "not_found" | "incompatible_order_source" | "missing_production_input";
      message?: string;
    }
> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/orders/${encodeURIComponent(orderSnapshotId)}/production-release`,
    { method: "POST" },
  );
  const body = await readJson<{
    created?: boolean;
    snapshot?: AcceptedProductionSnapshot;
    orderSnapshot?: OrderSnapshot;
    error?: string;
    reasons?: string[];
  }>(response);
  if (response.status === 404) {
    return { ok: false, reason: "not_found" };
  }
  if (
    response.status === 422 &&
    (body.error === "incompatible_order_source" || body.error === "missing_production_input")
  ) {
    return {
      ok: false,
      reason: body.error,
      message: body.reasons?.[0],
    };
  }
  if (!response.ok || !body.snapshot || !body.orderSnapshot) {
    throw new Error("production_release_unavailable");
  }
  return {
    ok: true,
    created: Boolean(body.created),
    snapshot: body.snapshot,
    orderSnapshot: body.orderSnapshot,
  };
}

export async function createOrderSnapshot(
  productCode: string,
  quoteSnapshotId: string,
): Promise<
  | {
      ok: true;
      created: boolean;
      orderSnapshot: OrderSnapshot;
      quoteSnapshot: QuoteSnapshot;
      acceptance: QuoteAcceptanceDecision;
    }
  | {
      ok: false;
      reason: "not_found" | "quote_not_accepted" | "acceptance_mismatch" | "incompatible_order_source";
      message?: string;
    }
> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}/order`,
    { method: "POST" },
  );
  const body = await readJson<{
    created?: boolean;
    orderSnapshot?: OrderSnapshot;
    quoteSnapshot?: QuoteSnapshot;
    acceptanceDecision?: QuoteAcceptanceDecision;
    error?: string;
    reasons?: string[];
  }>(response);
  if (response.status === 404) {
    return { ok: false, reason: "not_found" };
  }
  if (
    response.status === 422 &&
    (body.error === "quote_not_accepted" ||
      body.error === "acceptance_mismatch" ||
      body.error === "incompatible_order_source")
  ) {
    return {
      ok: false,
      reason: body.error,
      message: body.reasons?.[0],
    };
  }
  if (!response.ok || !body.orderSnapshot || !body.quoteSnapshot || !body.acceptanceDecision) {
    throw new Error("order_unavailable");
  }
  return {
    ok: true,
    created: Boolean(body.created),
    orderSnapshot: body.orderSnapshot,
    quoteSnapshot: body.quoteSnapshot,
    acceptance: body.acceptanceDecision,
  };
}

export async function readExecutionPlanById(
  planId: string,
): Promise<ExecutionPlanView | null> {
  const response = await fetch(`${baseUrl}/api/execution-plans/${planId}`);
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ executionPlan?: ExecutionPlanView }>(response);
  if (!response.ok || !body.executionPlan) {
    throw new Error("execution_plan_unavailable");
  }
  return body.executionPlan;
}

export async function readExecutionPlan(
  productCode: string,
  snapshotId: string,
): Promise<ExecutionPlanView | null> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/accepted-production-snapshots/${snapshotId}/execution-plan`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ executionPlan?: ExecutionPlanView }>(response);
  if (!response.ok || !body.executionPlan) {
    throw new Error("execution_plan_unavailable");
  }
  return body.executionPlan;
}

export async function createExecutionPlan(
  productCode: string,
  snapshotId: string,
): Promise<{ created: boolean; executionPlan: ExecutionPlanView }> {
  const response = await fetch(
    `${baseUrl}/api/products/${productCode}/accepted-production-snapshots/${snapshotId}/execution-plan`,
    { method: "POST" },
  );
  const body = await readJson<{
    created?: boolean;
    executionPlan?: ExecutionPlanView;
  }>(response);
  if (!response.ok || !body.executionPlan) {
    throw new Error("execution_plan_unavailable");
  }
  return {
    created: Boolean(body.created),
    executionPlan: body.executionPlan,
  };
}

export type TaskMutationFailure = {
  ok: false;
  error: string;
};

export async function assignExecutionTaskProvider(
  taskId: string,
  providerId: string,
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  return postTaskMutation(`/api/execution-tasks/${taskId}/provider`, { providerId });
}

export async function assignExecutionTaskExecutor(
  taskId: string,
  personId: string,
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  return postTaskMutation(`/api/execution-tasks/${taskId}/executor`, { personId });
}

export async function startExecutionTask(
  taskId: string,
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  return postTaskMutation(`/api/execution-tasks/${taskId}/start`);
}

export async function completeExecutionTask(
  taskId: string,
  input: {
    completedQuantity?: number;
    note?: string;
    actualConsumption?: readonly { resourceId: string; actualQuantity: number; note?: string }[];
  } = {},
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  return postTaskMutation(`/api/execution-tasks/${taskId}/complete`, input);
}

async function postTaskMutation(
  path: string,
  body?: {
    providerId?: string;
    personId?: string;
    completedQuantity?: number;
    note?: string;
    actualConsumption?: readonly { resourceId: string; actualQuantity: number; note?: string }[];
  },
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await readJson<{
    executionPlan?: ExecutionPlanView;
    error?: string;
  }>(response);
  if (!response.ok || !payload.executionPlan) {
    return { ok: false, error: payload.error ?? "action_unavailable" };
  }
  return { ok: true, executionPlan: payload.executionPlan };
}
