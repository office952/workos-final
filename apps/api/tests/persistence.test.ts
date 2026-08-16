import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  compileAggregate,
  compileDefinition,
  compileEic,
  composeProductProcessesFromTruth,
  confirmReviewedDefinition,
  freezeAcceptedProductionSnapshot,
  freezeQuoteSnapshot,
  projectCommercialPrice,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06Template,
  materializeExecutionPlanFromSnapshot,
  MCH_CNC_4020_ID,
  PLACE_LED_MODULES_ID,
  seedDisplayLabelRecords,
  WC_LED_ASSEMBLY_ID,
} from "@workos-final/domain";
import { applyMigrations, openSqliteDatabase } from "../src/persistence/sqlite.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempSqlitePath(): string {
  const dir = mkdtempSync(join(tmpdir(), "workos-ps-"));
  temps.push(dir);
  return join(dir, "product-system.sqlite");
}

describe("product system persistence", () => {
  it("bootstraps seeds on an empty store and does not overwrite edits on reopen", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    expect(first.present().admin.families[0]?.label).toBe(
      seedDisplayLabelRecords().find((item) => item.entityKind === "PRODUCT_FAMILY")
        ?.displayLabel,
    );
    const written = first.updateDisplayLabel(
      "PRODUCT_FAMILY",
      "LIGHTED_VOLUMETRIC_SIGNS",
      "Familie persistată",
      1,
    );
    expect(written.ok).toBe(true);
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    expect(second.present().admin.families[0]?.label).toBe("Familie persistată");
    expect(second.present().admin.families[0]?.id).toBe("LIGHTED_VOLUMETRIC_SIGNS");
    expect(second.present().admin.families[0]?.displayRevision).toBe(2);
    second.close();
  });

  it("applies migrations from empty and again without drift", () => {
    const sqlitePath = tempSqlitePath();
    const first = openSqliteDatabase(sqlitePath);
    applyMigrations(first);
    const count = first
      .prepare("SELECT COUNT(*) AS count FROM schema_migrations")
      .get() as { count: number };
    expect(count.count).toBe(9);
    first.close();

    const second = openSqliteDatabase(sqlitePath);
    applyMigrations(second);
    const again = second
      .prepare("SELECT COUNT(*) AS count FROM schema_migrations")
      .get() as { count: number };
    expect(again.count).toBe(9);
    second.close();
  });

  it("persists an accepted production snapshot without an update path", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    );
    const truth = confirmReviewedDefinition(definition, definition.reviewId);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      first.labels(),
    );
    const composition = composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template);
    const snapshot = freezeAcceptedProductionSnapshot(
      truth,
      aggregate,
      composition,
      compileEic(aggregate, composition),
      { createdAt: "2026-08-15T14:00:00.000Z" },
    );
    const created = first.acceptProductionSnapshot(snapshot);
    const again = first.acceptProductionSnapshot({
      ...snapshot,
      createdAt: "2026-08-15T18:00:00.000Z",
    });
    expect(created.created).toBe(true);
    expect(again.created).toBe(false);
    expect(again.snapshot.createdAt).toBe("2026-08-15T14:00:00.000Z");
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    const stored = second.readProductionSnapshot(snapshot.snapshotId);
    expect(stored?.eic.total).toBe(382.5);
    expect(stored?.usedTechnicalSettings.find((item) => item.id === "ledPitchMm")?.value).toBe(
      100,
    );
    expect(stored?.createdAt).toBe("2026-08-15T14:00:00.000Z");
    expect(second).not.toHaveProperty("updateProductionSnapshot");
    second.close();
  });

  it("persists a quote snapshot without rewriting historical commercial values", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    );
    const truth = confirmReviewedDefinition(definition, definition.reviewId);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      first.labels(),
    );
    const eic = compileEic(
      aggregate,
      composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template),
    );
    const frozen = freezeQuoteSnapshot(
      truth,
      aggregate,
      eic,
      projectCommercialPrice(eic),
      { createdAt: "2026-08-17T00:00:00.000Z" },
    );
    expect(frozen.ok).toBe(true);
    if (!frozen.ok) {
      return;
    }
    const created = first.persistQuoteSnapshot(frozen.snapshot);
    const again = first.persistQuoteSnapshot({
      ...frozen.snapshot,
      createdAt: "2026-08-17T12:00:00.000Z",
    });
    expect(created.created).toBe(true);
    expect(again.created).toBe(false);
    expect(again.snapshot.createdAt).toBe("2026-08-17T00:00:00.000Z");
    expect(first.readExecutionPlanBySnapshot("missing")).toBeNull();
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    const stored = second.readQuoteSnapshot(frozen.snapshot.quoteSnapshotId);
    expect(stored?.eic.total).toBe(382.5);
    expect(stored?.commercial.grossPrice).toBe(624.82);
    expect(stored?.commercial.policyVersion).toBe(1);
    expect(stored?.createdAt).toBe("2026-08-17T00:00:00.000Z");
    expect(second).not.toHaveProperty("updateQuoteSnapshot");
    second.close();
  });

  it("persists an execution plan atomically and returns the same plan for one snapshot", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    );
    const truth = confirmReviewedDefinition(definition, definition.reviewId);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      first.labels(),
    );
    const composition = composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template);
    const snapshot = freezeAcceptedProductionSnapshot(
      truth,
      aggregate,
      composition,
      compileEic(aggregate, composition),
      { createdAt: "2026-08-15T14:00:00.000Z" },
    );
    first.acceptProductionSnapshot(snapshot);
    const created = first.persistExecutionPlan(
      materializeExecutionPlanFromSnapshot(snapshot, {
        createdAt: "2026-08-15T15:00:00.000Z",
      }),
    );
    const again = first.persistExecutionPlan(
      materializeExecutionPlanFromSnapshot(snapshot, {
        createdAt: "2026-08-15T18:00:00.000Z",
      }),
    );
    expect(created.created).toBe(true);
    expect(created.record.tasks).toHaveLength(12);
    expect(again.created).toBe(false);
    expect(again.record.plan.planId).toBe(created.record.plan.planId);
    expect(again.record.plan.createdAt).toBe("2026-08-15T15:00:00.000Z");
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    const stored = second.readExecutionPlan(created.record.plan.planId);
    expect(stored?.tasks).toHaveLength(12);
    expect(stored?.plan.sourceSnapshotHash).toBe(snapshot.contentHash);
    expect(stored?.tasks.every((item) => item.assignedProvider === null)).toBe(true);
    expect(second).not.toHaveProperty("updateExecutionPlan");
    second.close();
  });

  it("persists provider assignment and start/complete timestamps", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    );
    const truth = confirmReviewedDefinition(definition, definition.reviewId);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      first.labels(),
    );
    const composition = composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template);
    const snapshot = freezeAcceptedProductionSnapshot(
      truth,
      aggregate,
      composition,
      compileEic(aggregate, composition),
      { createdAt: "2026-08-15T14:00:00.000Z" },
    );
    first.acceptProductionSnapshot(snapshot);
    const created = first.persistExecutionPlan(
      materializeExecutionPlanFromSnapshot(snapshot, {
        createdAt: "2026-08-15T15:00:00.000Z",
      }),
    );
    const backCnc = created.record.tasks.find(
      (item) => item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Spate",
    );
    if (!backCnc) {
      throw new Error("missing back cnc task");
    }
    const person = first.createPerson("Executor test");
    expect(person.ok).toBe(true);
    if (!person.ok) {
      throw new Error("expected person");
    }
    const assigned = first.assignExecutionTaskProvider(backCnc.taskId, MCH_CNC_4020_ID);
    expect(assigned.ok).toBe(true);
    const executor = first.assignExecutionTaskExecutor(backCnc.taskId, person.person.personId);
    expect(executor.ok).toBe(true);
    const started = first.startExecutionTask(backCnc.taskId);
    expect(started.ok).toBe(true);
    const completed = first.completeExecutionTask(backCnc.taskId, {
      completedQuantity: 12.5,
      note: "Executat conform fișei",
      actualConsumption: backCnc.resourceDemands.map((demand) => ({
        resourceId: demand.resourceId,
        actualQuantity: demand.quantity + 0.2,
      })),
    });
    expect(completed.ok).toBe(true);
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    const stored = second.readExecutionPlan(created.record.plan.planId);
    const task = stored?.tasks.find((item) => item.taskId === backCnc.taskId);
    expect(task?.assignedProvider?.label).toBe("CNC 4020");
    expect(task?.assignedExecutor?.label).toBe("Executor test");
    expect(task?.status).toBe("COMPLETED");
    expect(task?.startedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(task?.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(task?.completion).toEqual({
      outcome: "COMPLETED_AS_PLANNED",
      completedQuantity: 12.5,
      completedQuantityUnit: "m",
      note: "Executat conform fișei",
    });
    expect(task?.quantities[0]?.value).toBe(12.5);
    expect(task?.resourceDemands[0]?.quantity).toBe(backCnc.resourceDemands[0]?.quantity);
    expect(task?.actualConsumption).toEqual(
      backCnc.resourceDemands.map((demand) => ({
        entryId: `act:${backCnc.taskId}:${demand.resourceId}`,
        taskId: backCnc.taskId,
        resourceId: demand.resourceId,
        resourceLabel: demand.label,
        actualQuantity: demand.quantity + 0.2,
        unit: demand.unit,
        recordedAt: task?.completedAt,
        note: null,
      })),
    );
    expect(stored?.plan.eicTotal).toBe(382.5);
    expect(stored?.plan.sourceSnapshotHash).toBe(snapshot.contentHash);
    const afterService = second.readInventory().items.find(
      (item) => item.resourceId === "MAT-LED-MODULE",
    );
    expect(afterService?.movementCount).toBe(0);
    expect(afterService?.status).toBe("NO_MOVEMENTS");
    second.close();
  });

  it("writes one inventory OUT from LED actual consumption and keeps it after reopen and retry", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
      },
    );
    const truth = confirmReviewedDefinition(definition, definition.reviewId);
    if ("ok" in truth) {
      throw new Error("expected confirmed truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      first.labels(),
    );
    const composition = composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template);
    const snapshot = freezeAcceptedProductionSnapshot(
      truth,
      aggregate,
      composition,
      compileEic(aggregate, composition),
      { createdAt: "2026-08-15T14:00:00.000Z" },
    );
    first.acceptProductionSnapshot(snapshot);
    const created = first.persistExecutionPlan(
      materializeExecutionPlanFromSnapshot(snapshot, {
        createdAt: "2026-08-15T15:00:00.000Z",
      }),
    );
    const backCnc = created.record.tasks.find(
      (item) => item.processLabel === "Debitare foaie CNC" && item.scopeLabel === "Spate",
    );
    const lighting = created.record.tasks.find((item) => item.processId === PLACE_LED_MODULES_ID);
    if (!backCnc || !lighting) {
      throw new Error("missing tasks");
    }
    const person = first.createPerson("Executor test");
    if (!person.ok) {
      throw new Error("expected person");
    }
    first.assignExecutionTaskProvider(backCnc.taskId, MCH_CNC_4020_ID);
    first.assignExecutionTaskExecutor(backCnc.taskId, person.person.personId);
    first.startExecutionTask(backCnc.taskId);
    first.completeExecutionTask(backCnc.taskId, { completedQuantity: 12.5 });
    first.assignExecutionTaskProvider(lighting.taskId, WC_LED_ASSEMBLY_ID);
    first.assignExecutionTaskExecutor(lighting.taskId, person.person.personId);
    first.startExecutionTask(lighting.taskId);
    const completed = first.completeExecutionTask(lighting.taskId, {
      completedQuantity: 125,
      actualConsumption: [{ resourceId: "MAT-LED-MODULE", actualQuantity: 127 }],
    });
    expect(completed.ok).toBe(true);
    const retry = first.completeExecutionTask(lighting.taskId, {
      completedQuantity: 125,
      actualConsumption: [{ resourceId: "MAT-LED-MODULE", actualQuantity: 200 }],
    });
    expect(retry.ok).toBe(true);
    if (retry.ok) {
      expect(retry.alreadyApplied).toBe(true);
    }
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    const led = second.readInventoryItem("MAT-LED-MODULE");
    expect(led?.item.balance).toBe(-127);
    expect(led?.item.status).toBe("NEGATIVE");
    expect(led?.movements).toHaveLength(1);
    expect(led?.movements[0]).toMatchObject({
      resourceId: "MAT-LED-MODULE",
      quantityDelta: -127,
      unit: "buc",
      movementType: "OUT",
      sourceType: "EXECUTION_ACTUAL_CONSUMPTION",
      movementTypeLabel: "Consum producție",
    });
    const storedTask = second
      .readExecutionPlan(created.record.plan.planId)
      ?.tasks.find((item) => item.taskId === lighting.taskId);
    expect(storedTask?.actualConsumption[0]?.actualQuantity).toBe(127);
    expect(storedTask?.quantities[0]?.value).toBe(125);
    expect(second.readExecutionPlan(created.record.plan.planId)?.plan.eicTotal).toBe(382.5);
    second.close();
  });
});
