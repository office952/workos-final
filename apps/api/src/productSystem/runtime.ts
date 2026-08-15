import {
  presentProductSystem,
  type AcceptedProductionSnapshot,
  type DisplayLabelCatalog,
  type ExecutionPlanRecord,
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
    close() {
      db.close();
    },
  };
}
