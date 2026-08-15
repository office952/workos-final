import {
  presentProductSystem,
  type AcceptedProductionSnapshot,
  type DisplayLabelCatalog,
} from "@workos-final/domain";
import {
  openSqliteDatabase,
  resolveProductSystemSqlitePath,
  type SqliteDatabase,
} from "../persistence/sqlite.js";
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
    close() {
      db.close();
    },
  };
}
