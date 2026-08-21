import { randomBytes } from "node:crypto";
import type { APIRequestContext } from "@playwright/test";

export const CANONICAL_PRODUCT_CODE = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";

const readyValues = {
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

type JsonObject = Record<string, unknown>;

export type CreatedJob = {
  inscription: string;
  orderSnapshotId: string;
  productCode: string;
  releaseSnapshotId?: string;
  planId?: string;
};

export function uniqueJobInscription(prefix: string) {
  return `${prefix}${randomBytes(2).toString("hex")}`.toUpperCase();
}

async function readJson(response: { json: () => Promise<unknown> }): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

export async function createCommercialOrder(
  request: APIRequestContext,
  inscription: string,
): Promise<CreatedJob> {
  const compiled = await request.post(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
    data: { values: { ...readyValues, "root.inscription": inscription } },
  });
  const compiledBody = await readJson(compiled);
  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${inscription}` },
  });
  const customerId = ((await readJson(customer)).customer as JsonObject).customerId as string;
  const quote = await request.post(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
    data: {
      definition: compiledBody.definition,
      reviewId: compiledBody.reviewId,
      customerId,
    },
  });
  const quoteId = ((await readJson(quote)).quoteSnapshot as JsonObject).quoteSnapshotId as string;
  await request.post(
    `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${quoteId}/acceptance`,
  );
  const order = await request.post(
    `/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots/${quoteId}/order`,
  );
  const orderSnapshot = (await readJson(order)).orderSnapshot as JsonObject;
  return {
    inscription,
    orderSnapshotId: orderSnapshot.orderSnapshotId as string,
    productCode: orderSnapshot.productCode as string,
  };
}

export async function releaseCommercialOrder(
  request: APIRequestContext,
  job: CreatedJob,
): Promise<CreatedJob> {
  const released = await request.post(
    `/api/products/${job.productCode}/orders/${job.orderSnapshotId}/production-release`,
  );
  const snapshot = (await readJson(released)).snapshot as JsonObject;
  return {
    ...job,
    releaseSnapshotId: snapshot.snapshotId as string,
  };
}

export async function createCommercialPlan(
  request: APIRequestContext,
  job: CreatedJob,
): Promise<CreatedJob> {
  if (!job.releaseSnapshotId) {
    throw new Error("release_required");
  }
  const created = await request.post(
    `/api/products/${job.productCode}/accepted-production-snapshots/${job.releaseSnapshotId}/execution-plan`,
  );
  const plan = (await readJson(created)).executionPlan as { plan: JsonObject };
  return {
    ...job,
    planId: plan.plan.planId as string,
  };
}

const MACHINE_STEPS: Array<[string, string, string]> = [
  ["Debitare foaie CNC", "Față", "MCH-CNC-4020"],
  ["Debitare foaie CNC", "Spate", "MCH-CNC-4020"],
  ["Formare profil aluminiu", "Volum", "MCH-CNC-CANT-LITERE"],
];

const MANUAL_STEPS: Array<[string, string]> = [
  ["Montare module LED", "Iluminare"],
  ["Cablare electrică", "Iluminare"],
  ["Pregătire sursă de alimentare", "Iluminare"],
  ["Probă aprindere", "Iluminare"],
  ["Lipire față-volum", "Corp"],
  ["Închidere corp", "Corp"],
  ["Probă uniformitate", "Iluminare"],
  ["Control calitate final", "Produs"],
  ["Ambalare", "Produs"],
];

export async function completeCanonicalLettersPlan(
  request: APIRequestContext,
  job: CreatedJob,
  personId: string,
): Promise<void> {
  if (!job.releaseSnapshotId) {
    throw new Error("release_required");
  }
  for (const [label, scope, providerId] of MACHINE_STEPS) {
    await executeNamedTask(request, job, personId, label, scope, providerId);
  }
  for (const [label, scope] of MANUAL_STEPS) {
    await executeNamedTask(request, job, personId, label, scope);
  }
}

async function executeNamedTask(
  request: APIRequestContext,
  job: CreatedJob,
  personId: string,
  label: string,
  scope: string,
  providerId?: string,
) {
  const read = await request.get(
    `/api/products/${job.productCode}/accepted-production-snapshots/${job.releaseSnapshotId}/execution-plan`,
  );
  const plan = (await readJson(read)).executionPlan as { tasks: Array<JsonObject> };
  const task = plan.tasks.find((item) => item.processLabel === label && item.scopeLabel === scope);
  if (!task) {
    throw new Error(`task_missing:${label}:${scope}`);
  }
  if (providerId) {
    await request.post(`/api/execution-tasks/${task.taskId}/provider`, {
      data: { providerId },
    });
  }
  await request.post(`/api/execution-tasks/${task.taskId}/executor`, {
    data: { personId },
  });
  const started = await request.post(`/api/execution-tasks/${task.taskId}/start`);
  const startedPlan = (await readJson(started)).executionPlan as { tasks: Array<JsonObject> };
  const current = startedPlan.tasks.find((item) => item.taskId === task.taskId);
  const measurable = current?.measurableQuantity as JsonObject | undefined;
  await request.post(`/api/execution-tasks/${task.taskId}/complete`, {
    data: measurable ? { completedQuantity: measurable.value } : {},
  });
}

export async function startFirstExecutableTask(
  request: APIRequestContext,
  job: CreatedJob,
  personId: string,
): Promise<void> {
  if (!job.releaseSnapshotId) {
    throw new Error("release_required");
  }
  const read = await request.get(
    `/api/products/${job.productCode}/accepted-production-snapshots/${job.releaseSnapshotId}/execution-plan`,
  );
  const tasks = ((await readJson(read)).executionPlan as { tasks: Array<JsonObject> }).tasks;
  const task = tasks.find(
    (item) => item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Față",
  );
  if (!task) {
    throw new Error("task_missing");
  }
  await request.post(`/api/execution-tasks/${task.taskId}/provider`, {
    data: { providerId: "MCH-CNC-4020" },
  });
  await request.post(`/api/execution-tasks/${task.taskId}/executor`, {
    data: { personId },
  });
  await request.post(`/api/execution-tasks/${task.taskId}/start`);
}
