import type {
  AcceptedProductionSnapshot,
  CatalogTreeNode,
  DraftValues,
  EicResult,
  ExecutionPlanPreview,
  ExecutionPlanView,
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
    !body.executionPlanPreview
  ) {
    throw new Error("confirm_unavailable");
  }
  return {
    ok: true,
    truth: body.truth,
    aggregate: body.aggregate,
    eic: body.eic,
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

export async function startExecutionTask(
  taskId: string,
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  return postTaskMutation(`/api/execution-tasks/${taskId}/start`);
}

export async function completeExecutionTask(
  taskId: string,
): Promise<{ ok: true; executionPlan: ExecutionPlanView } | TaskMutationFailure> {
  return postTaskMutation(`/api/execution-tasks/${taskId}/complete`);
}

async function postTaskMutation(
  path: string,
  body?: { providerId: string },
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
