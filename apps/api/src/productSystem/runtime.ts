import {
  presentProductSystem,
  type AcceptedProductionSnapshot,
  type DisplayLabelCatalog,
  type ExecutionPlanRecord,
  type InventoryItemDetail,
  type InventoryStockProjection,
  type Customer,
  type CustomerMutationResult,
  type SellerMutationResult,
  type SellerProfile,
  type SellerProfileInput,
  type Person,
  type PersonMutationResult,
  projectExecutionPlanView,
  projectJobOverview,
  projectJobOverviewItem,
  projectQuoteOverview,
  projectQuoteOverviewItem,
  projectRequestDetail,
  projectRequestOverview,
  projectRequestOverviewItem,
  type CommercialRequest,
  type CommercialRequestLinkResult,
  type CommercialRequestMutationResult,
  type CommercialRequestStatus,
  type JobOverviewProjection,
  type QuoteOverviewProjection,
  type RequestDetailProjection,
  type RequestOverviewProjection,
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
  getCustomer,
  listCustomers,
  persistCreatedCustomer,
  persistRenamedCustomer,
  persistRetiredCustomer,
} from "../customers/store.js";
import { getSellerProfile, persistUpdatedSeller } from "../seller/store.js";
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
  listOrderSnapshots,
  listQuoteSnapshots,
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
  getCommercialRequest,
  listCommercialRequestQuoteLinks,
  listCommercialRequests,
  persistCommercialRequestQuoteLink,
  persistCreatedCommercialRequest,
  persistUpdatedCommercialRequest,
} from "../requests/store.js";
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
  listCustomers(): Customer[];
  getCustomer(customerId: string): Customer | null;
  getSellerProfile(): SellerProfile;
  updateSellerProfile(input: SellerProfileInput): SellerMutationResult;
  listJobOverview(): JobOverviewProjection;
  listQuoteOverview(): QuoteOverviewProjection;
  listRequestOverview(): RequestOverviewProjection;
  readCommercialRequest(requestId: string): CommercialRequest | null;
  readRequestDetail(requestId: string): RequestDetailProjection | null;
  createCommercialRequest(
    customerId: string,
    title: string,
    description: string,
  ): CommercialRequestMutationResult;
  updateCommercialRequest(
    requestId: string,
    patch: {
      title?: string;
      description?: string;
      status?: CommercialRequestStatus;
      customerId?: string;
    },
  ): CommercialRequestMutationResult;
  linkRequestQuote(
    requestId: string,
    quoteSnapshotId: string,
  ): CommercialRequestLinkResult;
  createPerson(displayName: string): PersonMutationResult;
  renamePerson(personId: string, displayName: string): PersonMutationResult;
  retirePerson(personId: string): PersonMutationResult;
  createCustomer(displayName: string): CustomerMutationResult;
  renameCustomer(customerId: string, displayName: string): CustomerMutationResult;
  retireCustomer(customerId: string): CustomerMutationResult;
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
    listCustomers() {
      return listCustomers(db);
    },
    getCustomer(customerId) {
      return getCustomer(db, customerId);
    },
    getSellerProfile() {
      return getSellerProfile(db);
    },
    updateSellerProfile(input) {
      return persistUpdatedSeller(db, input);
    },
    listJobOverview() {
      const people = listPeople(db);
      const jobs = listOrderSnapshots(db).map((order) => {
        const release = getAcceptedProductionSnapshotByOrder(db, order.orderSnapshotId);
        const record = release
          ? getExecutionPlanBySnapshotId(db, release.snapshotId)
          : null;
        return projectJobOverviewItem({
          order,
          release,
          planView: record ? projectExecutionPlanView(record, people, release) : null,
        });
      });
      return projectJobOverview(jobs);
    },
    listQuoteOverview() {
      const quotes = listQuoteSnapshots(db).map((quote) => {
        const acceptance = getQuoteAcceptanceBySnapshotId(db, quote.quoteSnapshotId);
        const order = getOrderSnapshotByQuoteSnapshotId(db, quote.quoteSnapshotId);
        return projectQuoteOverviewItem({
          quote,
          acceptance,
          order,
        });
      });
      return projectQuoteOverview(quotes);
    },
    listRequestOverview() {
      const requests = listCommercialRequests(db).map((request) =>
        projectRequestOverviewItem({
          request,
          customerDisplayName: getCustomer(db, request.customerId)?.displayName ?? null,
          quotes: linkedQuoteOverviewItems(db, request.requestId),
        }),
      );
      return projectRequestOverview(requests);
    },
    readCommercialRequest(requestId) {
      return getCommercialRequest(db, requestId);
    },
    readRequestDetail(requestId) {
      const request = getCommercialRequest(db, requestId);
      if (!request) {
        return null;
      }
      return projectRequestDetail({
        request,
        customerDisplayName: getCustomer(db, request.customerId)?.displayName ?? null,
        quotes: linkedQuoteOverviewItems(db, request.requestId),
      });
    },
    createCommercialRequest(customerId, title, description) {
      const customer = getCustomer(db, customerId);
      if (!customer) {
        return { ok: false, error: "customer_unavailable" };
      }
      return persistCreatedCommercialRequest(db, customer, title, description);
    },
    updateCommercialRequest(requestId, patch) {
      return persistUpdatedCommercialRequest(db, requestId, patch, {
        hasLinkedQuotes: listCommercialRequestQuoteLinks(db, requestId).length > 0,
        nextCustomer: patch.customerId ? getCustomer(db, patch.customerId) : undefined,
      });
    },
    linkRequestQuote(requestId, quoteSnapshotId) {
      const request = getCommercialRequest(db, requestId);
      if (!request) {
        return { ok: false, error: "not_found" };
      }
      const quote = getQuoteSnapshot(db, quoteSnapshotId);
      if (!quote) {
        return { ok: false, error: "quote_unavailable" };
      }
      return persistCommercialRequestQuoteLink(
        db,
        request,
        quoteSnapshotId,
        quote.customer?.customerId,
      );
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
    createCustomer(displayName) {
      return persistCreatedCustomer(db, displayName);
    },
    renameCustomer(customerId, displayName) {
      return persistRenamedCustomer(db, customerId, displayName);
    },
    retireCustomer(customerId) {
      return persistRetiredCustomer(db, customerId, new Date().toISOString());
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

function linkedQuoteOverviewItems(db: SqliteDatabase, requestId: string) {
  return listCommercialRequestQuoteLinks(db, requestId).flatMap((link) => {
    const quote = getQuoteSnapshot(db, link.quoteSnapshotId);
    if (!quote) {
      return [];
    }
    return [
      projectQuoteOverviewItem({
        quote,
        acceptance: getQuoteAcceptanceBySnapshotId(db, quote.quoteSnapshotId),
        order: getOrderSnapshotByQuoteSnapshotId(db, quote.quoteSnapshotId),
      }),
    ];
  });
}
