import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE, MCH_CNC_4020_ID } from "@workos-final/domain";
import { createApp } from "../src/app.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";

type JsonObject = Record<string, unknown>;

const readyValues = {
  "root.inscription": "WORKOS",
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

function createIsolatedApp() {
  const dir = mkdtempSync(join(tmpdir(), "workos-start-"));
  temps.push(dir);
  const runtime = createProductSystemRuntime(join(dir, "product-system.sqlite"));
  runtime.materializeTrustedWorkforce();
  return { app: createApp({ productSystem: runtime }), runtime };
}

async function createBackCncPlan(app: ReturnType<typeof createApp>) {
  const compiled = await readBody(
    await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values: readyValues }),
    }),
  );
  const accepted = await readBody(
    await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshot`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: compiled.definition,
        reviewId: compiled.reviewId,
      }),
    }),
  );
  const snapshot = accepted.snapshot as JsonObject;
  const created = await readBody(
    await app.request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/accepted-production-snapshots/${snapshot.snapshotId}/execution-plan`,
      { method: "POST" },
    ),
  );
  const view = created.executionPlan as { plan: JsonObject; tasks: Array<JsonObject> };
  const backCnc = view.tasks.find(
    (item) => item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Spate",
  ) as JsonObject;
  return { planId: view.plan.planId as string, backCnc };
}

async function readTask(app: ReturnType<typeof createApp>, planId: string, taskId: unknown) {
  const body = await readBody(await app.request(`/api/execution-plans/${planId}`));
  const view = body.executionPlan as { tasks: Array<JsonObject> };
  return view.tasks.find((item) => item.taskId === taskId) as JsonObject;
}

describe("planned start current eligibility API", () => {
  it("blocks start when the assigned executor becomes unavailable, then restores", async () => {
    const { app, runtime } = createIsolatedApp();
    const { planId, backCnc } = await createBackCncPlan(app);
    const florin = runtime.listPeople().find((item) => item.displayName === "Florin CNC");
    expect(florin).toBeTruthy();
    if (!florin) {
      return;
    }

    expect(
      (
        await app.request(`/api/execution-tasks/${backCnc.taskId}/provider`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
        })
      ).status,
    ).toBe(200);
    expect(
      (
        await app.request(`/api/execution-tasks/${backCnc.taskId}/executor`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ personId: florin.personId }),
        })
      ).status,
    ).toBe(200);

    const assigned = await readTask(app, planId, backCnc.taskId);
    expect((assigned.assignedExecutor as JsonObject).label).toBe("Florin CNC");
    expect(assigned.canStart).toBe(true);

    await app.request(`/api/people/${florin.personId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        availability: "TEMPORARILY_UNAVAILABLE",
        unavailableReason: "Concediu",
      }),
    });
    const blocked = await readTask(app, planId, backCnc.taskId);
    expect((blocked.assignedExecutor as JsonObject).label).toBe("Florin CNC");
    expect(blocked.status).toBe("PLANNED");
    expect(blocked.canStart).toBe(false);
    expect(blocked.startBlockReason).toBe("unavailable_person");
    const startBlocked = await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, {
      method: "POST",
    });
    expect(startBlocked.status).toBe(422);
    expect((await readBody(startBlocked)).error).toBe("unavailable_person");

    await app.request(`/api/people/${florin.personId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ availability: "AVAILABLE" }),
    });
    const restored = await readTask(app, planId, backCnc.taskId);
    expect(restored.canStart).toBe(true);
    expect(restored.startBlockReason).toBeNull();
    expect((await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, { method: "POST" })).status).toBe(
      200,
    );
    runtime.close();
  });

  it("blocks start when the assigned executor loses the required skill", async () => {
    const { app, runtime } = createIsolatedApp();
    const { planId, backCnc } = await createBackCncPlan(app);
    const andrei = runtime.listPeople().find((item) => item.displayName === "Andrei Goghi");
    const cnc = runtime.listSkills().find((item) => item.code === "SK_CNC_OPERATOR");
    expect(andrei && cnc).toBeTruthy();
    if (!andrei || !cnc) {
      return;
    }

    expect(
      (
        await app.request(`/api/execution-tasks/${backCnc.taskId}/provider`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
        })
      ).status,
    ).toBe(200);
    expect(
      (
        await app.request(`/api/execution-tasks/${backCnc.taskId}/executor`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ personId: andrei.personId }),
        })
      ).status,
    ).toBe(200);

    expect(runtime.retirePersonSkill(andrei.personId, cnc.skillId).ok).toBe(true);
    const blocked = await readTask(app, planId, backCnc.taskId);
    expect((blocked.assignedExecutor as JsonObject).label).toBe("Andrei Goghi");
    expect(blocked.canStart).toBe(false);
    expect(blocked.startBlockReason).toBe("ineligible_executor");
    const startBlocked = await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, {
      method: "POST",
    });
    expect(startBlocked.status).toBe(422);
    expect((await readBody(startBlocked)).error).toBe("ineligible_executor");
    runtime.close();
  });

  it("keeps IN_PROGRESS history after later unavailability and still allows complete", async () => {
    const { app, runtime } = createIsolatedApp();
    const { planId, backCnc } = await createBackCncPlan(app);
    const florin = runtime.listPeople().find((item) => item.displayName === "Florin CNC");
    expect(florin).toBeTruthy();
    if (!florin) {
      return;
    }
    await app.request(`/api/execution-tasks/${backCnc.taskId}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: MCH_CNC_4020_ID }),
    });
    await app.request(`/api/execution-tasks/${backCnc.taskId}/executor`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ personId: florin.personId }),
    });
    const started = await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, {
      method: "POST",
    });
    expect(started.status).toBe(200);
    const startedTask = await readTask(app, planId, backCnc.taskId);
    const startedAt = startedTask.startedAt;

    await app.request(`/api/people/${florin.personId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        availability: "TEMPORARILY_UNAVAILABLE",
        unavailableReason: "Concediu",
      }),
    });
    const after = await readTask(app, planId, backCnc.taskId);
    expect(after.status).toBe("IN_PROGRESS");
    expect((after.assignedExecutor as JsonObject).id).toBe(florin.personId);
    expect(after.startedAt).toBe(startedAt);
    expect(after.canComplete).toBe(true);

    const completed = await app.request(`/api/execution-tasks/${backCnc.taskId}/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ completedQuantity: after.measurableQuantity ? (after.measurableQuantity as JsonObject).value : undefined }),
    });
    expect(completed.status).toBe(200);
    runtime.close();
  });

  it("still requires a provider when the person is skill-eligible", async () => {
    const { app, runtime } = createIsolatedApp();
    const { planId, backCnc } = await createBackCncPlan(app);
    const florin = runtime.listPeople().find((item) => item.displayName === "Florin CNC");
    expect(florin).toBeTruthy();
    if (!florin) {
      return;
    }
    expect(
      (
        await app.request(`/api/execution-tasks/${backCnc.taskId}/executor`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ personId: florin.personId }),
        })
      ).status,
    ).toBe(200);
    const task = await readTask(app, planId, backCnc.taskId);
    expect(task.requiresProvider).toBe(true);
    expect(task.canStart).toBe(false);
    const started = await app.request(`/api/execution-tasks/${backCnc.taskId}/start`, {
      method: "POST",
    });
    expect(started.status).toBe(422);
    expect((await readBody(started)).error).toBe("missing_assignment");
    runtime.close();
  });
});
