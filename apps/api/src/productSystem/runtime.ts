import {
  presentProductSystem,
  type AcceptedProductionSnapshot,
  type DisplayLabelCatalog,
  type ExecutionPlanRecord,
  type TaskCompletionInput,
  type TaskMutationResult,
} from "@workos-final/domain";
import {
  openSqliteDatabase,
  resolveProductSystemSqlitePath,
  type SqliteDatabase,
} from "../persistence/sqlite.js";
import {
  getExecutionPlanBySnapshotId,
  getExecutionPlanRecord,
  insertExecutionPlanRecord,
  persistAssignedProvider,
  persistTaskComplete,
  persistTaskStart,
} from "../execution/store.js";
import {
  getAcceptedProductionSnapshot,
  insertAcceptedProductionSnapshot,
} from "../production/store.js";
import {
  bootstrapProductSystemDisplayStore,
  loadDisplayLabelCatalog,
  updateDisplayLabel,
  type DisplayLabelWriteResult,
} from "./store.js";

export type ProductSystemRuntime = {
  sqlitePath: string;
  labels(): DisplayLabelCatalog;
  present(): ReturnType<typeof presentProductSystem>;
  updateDisplayLabel(
    entityKind: string,
    entityId: string,
    displayLabel: unknown,
    expectedRevision?: number,
  ): DisplayLabelWriteResult;
  acceptProductionSnapshot(snapshot: AcceptedProductionSnapshot): {
    created: boolean;
    snapshot: AcceptedProductionSnapshot;
  };
  readProductionSnapshot(snapshotId: string): AcceptedProductionSnapshot | null;
  persistExecutionPlan(record: ExecutionPlanRecord): {
    created: boolean;
    record: ExecutionPlanRecord;
  };
  readExecutionPlan(planId: string): ExecutionPlanRecord | null;
  readExecutionPlanBySnapshot(snapshotId: string): ExecutionPlanRecord | null;
  assignExecutionTaskProvider(taskId: string, providerId: string): TaskMutationResult;
  startExecutionTask(taskId: string): TaskMutationResult;
  completeExecutionTask(taskId: string, input?: TaskCompletionInput): TaskMutationResult;
  close(): void;
};

export function createProductSystemRuntime(
  sqlitePath = resolveProductSystemSqlitePath(),
): ProductSystemRuntime {
  const db: SqliteDatabase = openSqliteDatabase(sqlitePath);
  bootstrapProductSystemDisplayStore(db);
  return {
    sqlitePath,
    labels() {
      return loadDisplayLabelCatalog(db);
    },
    present() {
      return presentProductSystem(loadDisplayLabelCatalog(db));
    },
    updateDisplayLabel(entityKind, entityId, displayLabel, expectedRevision) {
      return updateDisplayLabel(
        db,
        entityKind,
        entityId,
        displayLabel,
        expectedRevision,
      );
    },
    acceptProductionSnapshot(snapshot) {
      return insertAcceptedProductionSnapshot(db, snapshot);
    },
    readProductionSnapshot(snapshotId) {
      return getAcceptedProductionSnapshot(db, snapshotId);
    },
    persistExecutionPlan(record) {
      return insertExecutionPlanRecord(db, record);
    },
    readExecutionPlan(planId) {
      return getExecutionPlanRecord(db, planId);
    },
    readExecutionPlanBySnapshot(snapshotId) {
      return getExecutionPlanBySnapshotId(db, snapshotId);
    },
    assignExecutionTaskProvider(taskId, providerId) {
      return persistAssignedProvider(db, taskId, providerId);
    },
    startExecutionTask(taskId) {
      return persistTaskStart(db, taskId, new Date().toISOString());
    },
    completeExecutionTask(taskId, input) {
      return persistTaskComplete(db, taskId, new Date().toISOString(), input);
    },
    close() {
      db.close();
    },
  };
}
