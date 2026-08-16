import {
  presentProductSystem,
  type AcceptedProductionSnapshot,
  type DisplayLabelCatalog,
  type ExecutionPlanRecord,
  type InventoryItemDetail,
  type InventoryStockProjection,
  type Person,
  type PersonMutationResult,
  type OrderSnapshot,
  type QuoteAcceptanceDecision,
  type QuoteSnapshot,
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
  persistAssignedExecutor,
  persistAssignedProvider,
  persistTaskComplete,
  persistTaskStart,
} from "../execution/store.js";
import {
  persistInventoryAdjustment,
  readInventoryItem,
  readInventoryProjection,
  type InventoryAdjustmentResult,
} from "../inventory/store.js";
import {
  listPeople,
  persistCreatedPerson,
  persistRenamedPerson,
  persistRetiredPerson,
} from "../people/store.js";
import {
  getOrderSnapshot,
  getOrderSnapshotByQuoteSnapshotId,
  getQuoteAcceptanceBySnapshotId,
  getQuoteSnapshot,
  insertOrderSnapshot,
  insertQuoteAcceptance,
  insertQuoteSnapshot,
} from "../commercial/store.js";
import {
  getAcceptedProductionSnapshot,
  getAcceptedProductionSnapshotByOrder,
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
  readProductionReleaseByOrder(orderSnapshotId: string): AcceptedProductionSnapshot | null;
  persistQuoteSnapshot(snapshot: QuoteSnapshot): {
    created: boolean;
    snapshot: QuoteSnapshot;
  };
  readQuoteSnapshot(quoteSnapshotId: string): QuoteSnapshot | null;
  persistQuoteAcceptance(decision: QuoteAcceptanceDecision): {
    created: boolean;
    decision: QuoteAcceptanceDecision;
  };
  readQuoteAcceptance(quoteSnapshotId: string): QuoteAcceptanceDecision | null;
  persistOrderSnapshot(snapshot: OrderSnapshot): {
    created: boolean;
    snapshot: OrderSnapshot;
  };
  readOrderSnapshot(orderSnapshotId: string): OrderSnapshot | null;
  readOrderSnapshotByQuote(quoteSnapshotId: string): OrderSnapshot | null;
  persistExecutionPlan(record: ExecutionPlanRecord): {
    created: boolean;
    record: ExecutionPlanRecord;
  };
  readExecutionPlan(planId: string): ExecutionPlanRecord | null;
  readExecutionPlanBySnapshot(snapshotId: string): ExecutionPlanRecord | null;
  assignExecutionTaskProvider(taskId: string, providerId: string): TaskMutationResult;
  assignExecutionTaskExecutor(taskId: string, personId: string): TaskMutationResult;
  startExecutionTask(taskId: string): TaskMutationResult;
  completeExecutionTask(taskId: string, input?: TaskCompletionInput): TaskMutationResult;
  readInventory(): InventoryStockProjection;
  readInventoryItem(resourceId: string): InventoryItemDetail | null;
  recordInventoryAdjustment(
    resourceId: string,
    quantityDelta: number,
    note?: string,
  ): InventoryAdjustmentResult;
  listPeople(): Person[];
  createPerson(displayName: string): PersonMutationResult;
  renamePerson(personId: string, displayName: string): PersonMutationResult;
  retirePerson(personId: string): PersonMutationResult;
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
    readProductionReleaseByOrder(orderSnapshotId) {
      return getAcceptedProductionSnapshotByOrder(db, orderSnapshotId);
    },
    persistQuoteSnapshot(snapshot) {
      return insertQuoteSnapshot(db, snapshot);
    },
    readQuoteSnapshot(quoteSnapshotId) {
      return getQuoteSnapshot(db, quoteSnapshotId);
    },
    persistQuoteAcceptance(decision) {
      return insertQuoteAcceptance(db, decision);
    },
    readQuoteAcceptance(quoteSnapshotId) {
      return getQuoteAcceptanceBySnapshotId(db, quoteSnapshotId);
    },
    persistOrderSnapshot(snapshot) {
      return insertOrderSnapshot(db, snapshot);
    },
    readOrderSnapshot(orderSnapshotId) {
      return getOrderSnapshot(db, orderSnapshotId);
    },
    readOrderSnapshotByQuote(quoteSnapshotId) {
      return getOrderSnapshotByQuoteSnapshotId(db, quoteSnapshotId);
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
    assignExecutionTaskExecutor(taskId, personId) {
      return persistAssignedExecutor(db, taskId, personId, listPeople(db));
    },
    startExecutionTask(taskId) {
      return persistTaskStart(db, taskId, new Date().toISOString(), listPeople(db));
    },
    listPeople() {
      return listPeople(db);
    },
    createPerson(displayName) {
      return persistCreatedPerson(db, displayName);
    },
    renamePerson(personId, displayName) {
      return persistRenamedPerson(db, personId, displayName);
    },
    retirePerson(personId) {
      return persistRetiredPerson(db, personId, new Date().toISOString());
    },
    completeExecutionTask(taskId, input) {
      return persistTaskComplete(db, taskId, new Date().toISOString(), input);
    },
    readInventory() {
      return readInventoryProjection(db);
    },
    readInventoryItem(resourceId) {
      return readInventoryItem(db, resourceId);
    },
    recordInventoryAdjustment(resourceId, quantityDelta, note) {
      return persistInventoryAdjustment(
        db,
        resourceId,
        quantityDelta,
        new Date().toISOString(),
        note,
      );
    },
    close() {
      db.close();
    },
  };
}
