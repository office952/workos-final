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
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06Template,
  materializeExecutionPlanFromSnapshot,
  MCH_CNC_4020_ID,
  seedDisplayLabelRecords,
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
    expect(count.count).toBe(5);
    first.close();

    const second = openSqliteDatabase(sqlitePath);
    applyMigrations(second);
    const again = second
      .prepare("SELECT COUNT(*) AS count FROM schema_migrations")
      .get() as { count: number };
    expect(again.count).toBe(5);
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
    expect(stored?.eic.total).toBe(595);
    expect(stored?.usedTechnicalSettings.find((item) => item.id === "ledPitchMm")?.value).toBe(
      100,
    );
    expect(stored?.createdAt).toBe("2026-08-15T14:00:00.000Z");
    expect(second).not.toHaveProperty("updateProductionSnapshot");
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
    const assigned = first.assignExecutionTaskProvider(backCnc.taskId, MCH_CNC_4020_ID);
    expect(assigned.ok).toBe(true);
    const started = first.startExecutionTask(backCnc.taskId);
    expect(started.ok).toBe(true);
    const completed = first.completeExecutionTask(backCnc.taskId, {
      completedQuantity: 12.5,
      note: "Executat conform fișei",
    });
    expect(completed.ok).toBe(true);
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    const stored = second.readExecutionPlan(created.record.plan.planId);
    const task = stored?.tasks.find((item) => item.taskId === backCnc.taskId);
    expect(task?.assignedProvider?.label).toBe("CNC 4020");
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
    expect(stored?.plan.eicTotal).toBe(595);
    expect(stored?.plan.sourceSnapshotHash).toBe(snapshot.contentHash);
    second.close();
  });
});
