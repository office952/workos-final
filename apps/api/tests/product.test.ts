import { describe, expect, it } from "vitest";
import {
  BOND_LETTER_BODY_ID,
  CANONICAL_PRODUCT_CODE,
  MCH_CNC_4020_ID,
  MCH_CNC_CANT_LITERE_ID,
  PLACE_LED_MODULES_ID,
  WC_ASSEMBLY_01_ID,
  WC_ASSEMBLY_02_ID,
  WC_LED_ASSEMBLY_ID,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const readyValues = {
  "root.inscription": "WORKOS",
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

async function compileReady() {
  const response = await createApp().request(
    `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values: readyValues }),
    },
  );
  const body = await readBody(response);
  return {
    definition: body.definition as JsonObject,
    reviewId: body.reviewId as string,
  };
}

describe("product catalog API", () => {
  it("projects the family, front-lit category, and canonical product", async () => {
    const response = await createApp().request("/api/product-catalog");
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const tree = JSON.stringify(body.tree);
    expect(tree).toContain("Litere și semne volumetrice luminoase");
    expect(tree).toContain("Litere volumetrice luminoase cu iluminare față");
    expect(tree).toContain(CANONICAL_PRODUCT_CODE);
    expect(tree).not.toContain('"code":"letters"');
  });
});

describe("product configuration API", () => {
  it("returns the canonical product and form schema", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}`,
    );
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const template = body.template as JsonObject;
    expect(template.code).toBe(CANONICAL_PRODUCT_CODE);
    expect(template.legacyReference).toBe("TPL-VOLUMETRIC-LETTERS_v2");
  });

  it("compiles a valid draft to a ready definition", async () => {
    const compiled = await compileReady();
    expect(compiled.definition.readiness).toBe("ready");
    expect(compiled.reviewId).toBe(compiled.definition.reviewId);
    expect(compiled.definition.templateCode).toBe(CANONICAL_PRODUCT_CODE);
  });

  it("rejects confirmation while the reviewed definition is blocked", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: { ...readyValues, "root.inscription": "" },
        }),
      },
    );
    const body = await readBody(response);
    const confirm = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: body.definition,
          reviewId: body.reviewId,
        }),
      },
    );
    expect(confirm.status).toBe(422);
  });

  it("rejects confirmation of a different definition than the one reviewed", async () => {
    const reviewed = await compileReady();
    const changed = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: { ...readyValues, "root.inscription": "CHANGED" },
        }),
      },
    );
    const changedBody = await readBody(changed);
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: changedBody.definition,
          reviewId: reviewed.reviewId,
        }),
      },
    );
    expect(response.status).toBe(409);
  });

  it("confirms the reviewed definition and returns partial EIC", async () => {
    const reviewed = await compileReady();
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: reviewed.definition,
          reviewId: reviewed.reviewId,
        }),
      },
    );
    expect(response.status).toBe(200);
    const body = await readBody(response);
    const truth = body.truth as JsonObject;
    const aggregate = body.aggregate as JsonObject;
    const eic = body.eic as JsonObject;
    expect(truth.status).toBe("CONFIRMED_IN_RUNTIME");
    const quantities = aggregate.quantities as Array<{
      componentId: string;
      value: number;
    }>;
    expect(quantities.find((item) => item.componentId === "VOLUME")?.value).toBe(12.5);
    expect(quantities.find((item) => item.componentId === "FACE")?.value).toBe(0.25);
    expect(quantities.find((item) => item.componentId === "BACK")?.value).toBe(0.25);
    expect(eic.completeness).toBe("PARTIAL");
    expect(eic.total).toBe(595);
    expect(eic.currency).toBe("EUR");
    expect((eic.excludedComponentLabels as string[])).toEqual([]);
    const preview = body.executionPlanPreview as JsonObject;
    expect(preview.status).toBe("PREVIEW");
    expect(preview.operationCount).toBeGreaterThan(0);
    expect(preview.summary).toEqual(
      expect.objectContaining({
        internalCostTotal: 595,
        internalCostCompleteness: "PARTIAL",
      }),
    );
    expect(JSON.stringify(preview)).not.toMatch(/ExecutionTask|startTask|assignedTo/);
  });

  it("does not let a draft override product-fixed identity", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/compile`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          values: {
            ...readyValues,
            "face.materialFamily": "aluminum",
            "face.opticalType": "transparent",
            "lighting.mode": "halo",
          },
        }),
      },
    );
    const body = await readBody(response);
    const definition = body.definition as { values: Record<string, unknown> };
    expect(definition.values["face.materialFamily"]).toBe("plexiglas");
    expect(definition.values["face.opticalType"]).toBe("opal");
    expect(definition.values["lighting.mode"]).toBe("front_lit");
  });

  it("freezes an accepted production snapshot idempotently without tasks", async () => {
    const reviewed = await compileReady();
    const app = createApp();
    const payload = {
      definition: reviewed.definition,
      reviewId: reviewed.reviewId,
    };
    const first = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const firstBody = await readBody(first);
    const snapshot = firstBody.snapshot as JsonObject;
    expect(first.status).toBe(200);
    expect(firstBody.created).toBe(true);
    expect(snapshot.status).toBe("ACCEPTED");
    expect(snapshot.eic).toEqual(
      expect.objectContaining({ total: 595, completeness: "PARTIAL" }),
    );
    expect((snapshot.operations as unknown[]).length).toBe(12);
    expect(JSON.stringify(snapshot)).not.toMatch(
      /ExecutionTask|eligibleProviders|assignedProvider|startTask/,
    );

    const second = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const secondBody = await readBody(second);
    expect(second.status).toBe(200);
    expect(secondBody.created).toBe(false);
    expect((secondBody.snapshot as JsonObject).snapshotId).toBe(snapshot.snapshotId);
    expect((secondBody.snapshot as JsonObject).createdAt).toBe(snapshot.createdAt);

    const read = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}`,
    );
    expect(read.status).toBe(200);
    const readBodyJson = await readBody(read);
    expect((readBodyJson.snapshot as JsonObject).contentHash).toBe(snapshot.contentHash);

    const mutate = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}`,
      { method: "PATCH", headers: { "content-type": "application/json" }, body: "{}" },
    );
    expect(mutate.status).toBe(404);
  });

  it("materializes an idempotent planned execution plan from the frozen snapshot", async () => {
    const reviewed = await compileReady();
    const app = createApp();
    const payload = {
      definition: reviewed.definition,
      reviewId: reviewed.reviewId,
    };
    const accepted = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const snapshot = (await readBody(accepted)).snapshot as JsonObject;
    const first = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}/execution-plan`,
      { method: "POST" },
    );
    const firstBody = await readBody(first);
    const view = firstBody.executionPlan as {
      plan: JsonObject;
      tasks: Array<JsonObject>;
    };
    expect(first.status).toBe(200);
    expect(firstBody.created).toBe(true);
    expect(view.plan.status).toBe("PLANNED");
    expect(view.plan.sourceSnapshotId).toBe(snapshot.snapshotId);
    expect(view.plan.eicTotal).toBe(595);
    expect(view.tasks).toHaveLength(12);
    expect(view.tasks.every((item) => item.assignedProvider === null)).toBe(true);
    expect(JSON.stringify(view)).not.toMatch(/startTask|employeeId|plannedStart|capacity/);

    const second = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}/execution-plan`,
      { method: "POST" },
    );
    const secondBody = await readBody(second);
    expect(secondBody.created).toBe(false);
    expect((secondBody.executionPlan as { plan: JsonObject }).plan.planId).toBe(
      view.plan.planId,
    );

    const read = await app.request(`/api/execution-plans/${view.plan.planId}`);
    expect(read.status).toBe(200);
    const readView = (await readBody(read)).executionPlan as { tasks: Array<JsonObject> };
    expect(readView.tasks).toHaveLength(12);
    expect(
      readView.tasks.some((item) =>
        JSON.stringify(item.eligibleProviders).includes("CNC 4020"),
      ),
    ).toBe(true);
  });

  it("assigns a provider and starts/completes a root task without mutating cost", async () => {
    const reviewed = await compileReady();
    const app = createApp();
    const payload = {
      definition: reviewed.definition,
      reviewId: reviewed.reviewId,
    };
    const accepted = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const snapshot = (await readBody(accepted)).snapshot as JsonObject;
    const created = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}/execution-plan`,
      { method: "POST" },
    );
    const view = (await readBody(created)).executionPlan as {
      plan: JsonObject;
      progressStatus: string;
      tasks: Array<JsonObject>;
    };
    const backCnc = view.tasks.find(
      (item) =>
        item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Spate",
    ) as JsonObject;
    const lighting = view.tasks.find(
      (item) => item.processId === PLACE_LED_MODULES_ID,
    ) as JsonObject;
    const bond = view.tasks.find((item) => item.processId === BOND_LETTER_BODY_ID) as JsonObject;
    const inspect = view.tasks.find(
      (item) => item.processLabel === "Control calitate final",
    ) as JsonObject;
    const faceCnc = view.tasks.find(
      (item) =>
        item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Față",
    ) as JsonObject;

    const ineligible = await app.request(`/api/execution-tasks/${backCnc.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: WC_ASSEMBLY_01_ID }),
    });
    expect(ineligible.status).toBe(422);
    expect((await readBody(ineligible)).error).toBe("ineligible_provider");

    const noProvider = await app.request(`/api/execution-tasks/${inspect.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
    });
    expect(noProvider.status).toBe(422);

    const assignCnc = await app.request(`/api/execution-tasks/${backCnc.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
    });
    expect(assignCnc.status).toBe(200);
    const assignedView = (await readBody(assignCnc)).executionPlan as {
      tasks: Array<JsonObject>;
    };
    expect(
      (assignedView.tasks.find((item) => item.taskId === backCnc.taskId)?.assignedProvider as JsonObject)
        .label,
    ).toBe("CNC 4020");

    const blockedLighting = await app.request(`/api/execution-tasks/${lighting.taskId}/start`, {
      method: "POST",
    });
    expect(blockedLighting.status).toBe(422);

    const assignLighting = await app.request(`/api/execution-tasks/${lighting.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: "WC_LED_ASSEMBLY" }),
    });
    expect(assignLighting.status).toBe(200);
    const lightingStartBefore = await app.request(
      `/api/execution-tasks/${lighting.taskId}/start`,
      { method: "POST" },
    );
    expect(lightingStartBefore.status).toBe(409);
    expect((await readBody(lightingStartBefore)).error).toBe("dependencies_incomplete");

    const completeBeforeStart = await app.request(
      `/api/execution-tasks/${backCnc.taskId}/complete`,
      { method: "POST" },
    );
    expect(completeBeforeStart.status).toBe(409);

    const beforeStart = Date.now();
    const started = await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, {
      method: "POST",
    });
    const startedBody = await readBody(started);
    const startedView = startedBody.executionPlan as {
      progressStatus: string;
      plan: JsonObject;
      tasks: Array<JsonObject>;
    };
    const startedTask = startedView.tasks.find((item) => item.taskId === backCnc.taskId) as JsonObject;
    expect(started.status).toBe(200);
    expect(startedTask.status).toBe("IN_PROGRESS");
    expect(typeof startedTask.startedAt).toBe("string");
    expect(Date.parse(startedTask.startedAt as string)).toBeGreaterThanOrEqual(beforeStart - 1000);
    expect(startedView.progressStatus).toBe("IN_PROGRESS");
    expect(startedView.plan.eicTotal).toBe(595);
    expect(startedView.plan.sourceSnapshotHash).toBe(snapshot.contentHash);

    const reassignAfterStart = await app.request(
      `/api/execution-tasks/${backCnc.taskId}/provider`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
      },
    );
    expect(reassignAfterStart.status).toBe(409);

    const assignFace = await app.request(`/api/execution-tasks/${faceCnc.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
    });
    expect(assignFace.status).toBe(200);
    const startFace = await app.request(`/api/execution-tasks/${faceCnc.taskId}/start`, {
      method: "POST",
    });
    const parallel = (await readBody(startFace)).executionPlan as { tasks: Array<JsonObject> };
    expect(
      parallel.tasks.filter(
        (item) =>
          (item.taskId === backCnc.taskId || item.taskId === faceCnc.taskId) &&
          item.status === "IN_PROGRESS",
      ),
    ).toHaveLength(2);

    const completed = await app.request(`/api/execution-tasks/${backCnc.taskId}/complete`, {
      method: "POST",
    });
    const completedView = (await readBody(completed)).executionPlan as {
      tasks: Array<JsonObject>;
    };
    const done = completedView.tasks.find((item) => item.taskId === backCnc.taskId) as JsonObject;
    const released = completedView.tasks.find((item) => item.taskId === lighting.taskId) as JsonObject;
    expect(done.status).toBe("COMPLETED");
    expect(typeof done.completedAt).toBe("string");
    expect(released.canStart).toBe(true);
    expect(released.waitingFor).toEqual([]);

    const restart = await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, {
      method: "POST",
    });
    expect(restart.status).toBe(409);

    const firstAssembly = await app.request(`/api/execution-tasks/${bond.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: WC_ASSEMBLY_01_ID }),
    });
    expect(firstAssembly.status).toBe(200);
    const secondAssembly = await app.request(`/api/execution-tasks/${bond.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: WC_ASSEMBLY_02_ID }),
    });
    const assemblyView = (await readBody(secondAssembly)).executionPlan as {
      tasks: Array<JsonObject>;
    };
    expect(
      (assemblyView.tasks.find((item) => item.taskId === bond.taskId)?.assignedProvider as JsonObject)
        .label,
    ).toBe("Masă asamblare 2");
    expect(JSON.stringify(assemblyView)).not.toMatch(/employeeId|plannedStart|capacity|pontaj/);
  });

  it("executes the reachable LETTERS DAG and does not complete the plan with open tasks", async () => {
    const reviewed = await compileReady();
    const app = createApp();
    const accepted = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: reviewed.definition,
          reviewId: reviewed.reviewId,
        }),
      },
    );
    const snapshot = (await readBody(accepted)).snapshot as JsonObject;
    const created = await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}/execution-plan`,
      { method: "POST" },
    );
    const initial = (await readBody(created)).executionPlan as {
      progress: JsonObject;
      tasks: Array<JsonObject>;
    };
    expect(initial.progress).toMatchObject({
      total: 12,
      completed: 0,
      planned: 12,
      noProvider: 3,
      status: "PLANNED",
    });

    const task = (label: string, scope: string) =>
      initial.tasks.find((item) => item.processLabel === label && item.scopeLabel === scope) as JsonObject;

    async function execute(taskId: unknown, providerId: string) {
      const assigned = await app.request(`/api/execution-tasks/${taskId}/provider`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ providerId }),
      });
      expect(assigned.status).toBe(200);
      const started = await app.request(`/api/execution-tasks/${taskId}/start`, { method: "POST" });
      expect(started.status).toBe(200);
      const completed = await app.request(`/api/execution-tasks/${taskId}/complete`, {
        method: "POST",
      });
      expect(completed.status).toBe(200);
      return (await readBody(completed)).executionPlan as {
        progress: JsonObject;
        plan: JsonObject;
        tasks: Array<JsonObject>;
      };
    }

    await execute(task("Debitare foaie CNC", "Față").taskId, MCH_CNC_4020_ID);
    await execute(task("Debitare foaie CNC", "Spate").taskId, MCH_CNC_4020_ID);
    await execute(task("Formare profil aluminiu", "Volum").taskId, MCH_CNC_CANT_LITERE_ID);
    await execute(task("Montare module LED", "Iluminare").taskId, WC_LED_ASSEMBLY_ID);
    await execute(task("Cablare electrică", "Iluminare").taskId, WC_LED_ASSEMBLY_ID);
    await execute(task("Pregătire sursă de alimentare", "Iluminare").taskId, WC_LED_ASSEMBLY_ID);
    await execute(task("Probă aprindere", "Iluminare").taskId, WC_LED_ASSEMBLY_ID);
    await execute(task("Lipire față-volum", "Corp").taskId, WC_ASSEMBLY_01_ID);
    const finalView = await execute(task("Închidere corp", "Corp").taskId, WC_ASSEMBLY_01_ID);

    expect(finalView.progress).toEqual({
      total: 12,
      completed: 9,
      inProgress: 0,
      planned: 3,
      waitingDependencies: 2,
      noProvider: 3,
      status: "IN_PROGRESS",
    });
    expect(finalView.plan.eicTotal).toBe(595);
    expect(finalView.plan.sourceSnapshotHash).toBe(snapshot.contentHash);
    expect(
      finalView.tasks.filter(
        (item) =>
          item.status === "PLANNED" &&
          (item.processLabel === "Probă uniformitate" ||
            item.processLabel === "Control calitate final" ||
            item.processLabel === "Ambalare"),
      ),
    ).toHaveLength(3);
    expect(JSON.stringify(finalView)).not.toMatch(/employeeId|actualQty|scrap|schedule|capacity/);
  });
});
