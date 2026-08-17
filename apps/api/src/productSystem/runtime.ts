import {
  presentProductSystem,
  type AcceptedProductionSnapshot,
  type DisplayLabelCatalog,
  type ExecutionPlanRecord,
  type InventoryItemDetail,
  type InventoryStockProjection,
  type Customer,
  type CustomerMutationResult,
  type CustomerProfilePatch,
  type CustomerRegistryProjection,
  type CustomerWorkspaceProjection,
  jobsForCustomer,
  projectCustomerRegistry,
  projectCustomerRegistryItem,
  projectCustomerWorkspace,
  quotesForCustomer,
  requestsForCustomer,
  type SellerMutationResult,
  type SellerProfile,
  type SellerProfileInput,
  diagnoseEligibility,
  type PeopleEligibilityContext,
  type PeopleRegistryProjection,
  type Person,
  type PersonEligibilityDiagnosis,
  type PersonMutationResult,
  type PersonProfilePatch,
  type PersonSkillMutationResult,
  resolveEligiblePeople,
  type Skill,
  type SkillMutationResult,
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
  persistUpdatedCustomer,
} from "../customers/store.js";
import { getSellerProfile, persistUpdatedSeller } from "../seller/store.js";
import {
  ensureTrustedWorkforce,
  getPerson,
  listPeople,
  persistAssignedPersonSkill,
  persistCreatedPerson,
  persistCreatedSkill,
  persistRenamedPerson,
  persistRenamedSkill,
  persistRetiredPerson,
  persistRetiredPersonSkill,
  persistRetiredSkill,
  persistUpdatedPerson,
  readPeopleEligibilityContext,
  readPeopleRegistry,
  listSkills,
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
  getPerson(personId: string): Person | null;
  listPeopleRegistry(): PeopleRegistryProjection;
  listSkills(): Skill[];
  peopleEligibilityContext(): PeopleEligibilityContext;
  readEligibility(capabilityId: string): {
    eligiblePeople: Array<{ personId: string; displayName: string }>;
    diagnoses: readonly PersonEligibilityDiagnosis[];
  };
  createSkill(input: {
    code: string;
    displayLabel: string;
    description?: string | null;
  }): SkillMutationResult;
  renameSkill(skillId: string, displayLabel: string): SkillMutationResult;
  retireSkill(skillId: string): SkillMutationResult;
  assignPersonSkill(personId: string, skillId: string): PersonSkillMutationResult;
  retirePersonSkill(personId: string, skillId: string): PersonSkillMutationResult;
  updatePerson(personId: string, patch: PersonProfilePatch): PersonMutationResult;
  materializeTrustedWorkforce(): void;
  listCustomers(): Customer[];
  getCustomer(customerId: string): Customer | null;
  listCustomerRegistry(): CustomerRegistryProjection;
  readCustomerWorkspace(customerId: string): CustomerWorkspaceProjection | null;
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
  createPerson(
    displayName: string,
    options?: { roleLabel?: string | null },
  ): PersonMutationResult;
  renamePerson(personId: string, displayName: string): PersonMutationResult;
  retirePerson(personId: string): PersonMutationResult;
  createCustomer(
    displayName: string,
    profile?: CustomerProfilePatch,
  ): CustomerMutationResult;
  updateCustomer(
    customerId: string,
    patch: CustomerProfilePatch,
  ): CustomerMutationResult;
  renameCustomer(customerId: string, displayName: string): CustomerMutationResult;
  retireCustomer(customerId: string): CustomerMutationResult;
  close(): void;
};

export function createProductSystemRuntime(
  sqlitePath = resolveProductSystemSqlitePath(),
): ProductSystemRuntime {
  const db: SqliteDatabase = openSqliteDatabase(sqlitePath);
  bootstrapProductSystemDisplayStore(db);
  if (!process.env.VITEST) {
    ensureTrustedWorkforce(db);
  }
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
      return persistAssignedExecutor(
        db,
        taskId,
        personId,
        listPeople(db),
        readPeopleEligibilityContext(db),
      );
    },
    startExecutionTask(taskId) {
      return persistTaskStart(db, taskId, new Date().toISOString(), listPeople(db));
    },
    listPeople() {
      return listPeople(db);
    },
    getPerson(personId) {
      return getPerson(db, personId);
    },
    listPeopleRegistry() {
      return readPeopleRegistry(db);
    },
    listSkills() {
      return listSkills(db);
    },
    peopleEligibilityContext() {
      return readPeopleEligibilityContext(db);
    },
    readEligibility(capabilityId) {
      const context = readPeopleEligibilityContext(db);
      const input = {
        capabilityId: capabilityId as Parameters<
          typeof resolveEligiblePeople
        >[0]["capabilityId"],
        people: listPeople(db),
        ...context,
      };
      return {
        eligiblePeople: resolveEligiblePeople(input),
        diagnoses: diagnoseEligibility(input),
      };
    },
    createSkill(input) {
      return persistCreatedSkill(db, input);
    },
    renameSkill(skillId, displayLabel) {
      return persistRenamedSkill(db, skillId, displayLabel);
    },
    retireSkill(skillId) {
      return persistRetiredSkill(db, skillId, new Date().toISOString());
    },
    assignPersonSkill(personId, skillId) {
      return persistAssignedPersonSkill(db, personId, skillId);
    },
    retirePersonSkill(personId, skillId) {
      return persistRetiredPersonSkill(db, personId, skillId, new Date().toISOString());
    },
    updatePerson(personId, patch) {
      return persistUpdatedPerson(db, personId, patch);
    },
    materializeTrustedWorkforce() {
      ensureTrustedWorkforce(db);
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
      return projectJobOverview(jobOverviewItems(db));
    },
    listQuoteOverview() {
      return projectQuoteOverview(quoteOverviewItems(db));
    },
    listRequestOverview() {
      return projectRequestOverview(requestOverviewItems(db));
    },
    listCustomerRegistry() {
      const requests = requestOverviewItems(db);
      const quotes = quoteOverviewItems(db);
      const jobs = jobOverviewItems(db);
      return projectCustomerRegistry(
        listCustomers(db).map((customer) =>
          projectCustomerRegistryItem({
            customer,
            requests: requestsForCustomer(requests, customer.customerId),
            quotes: quotesForCustomer(quotes, customer.customerId),
            jobs: jobsForCustomer(jobs, customer.customerId),
          }),
        ),
      );
    },
    readCustomerWorkspace(customerId) {
      const customer = getCustomer(db, customerId);
      if (!customer) {
        return null;
      }
      return projectCustomerWorkspace({
        customer,
        requests: requestsForCustomer(requestOverviewItems(db), customerId),
        quotes: quotesForCustomer(quoteOverviewItems(db), customerId),
        jobs: jobsForCustomer(jobOverviewItems(db), customerId),
      });
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
    createPerson(displayName, options) {
      return persistCreatedPerson(db, displayName, options);
    },
    renamePerson(personId, displayName) {
      return persistRenamedPerson(db, personId, displayName);
    },
    retirePerson(personId) {
      return persistRetiredPerson(db, personId, new Date().toISOString());
    },
    createCustomer(displayName, profile) {
      return persistCreatedCustomer(db, displayName, profile);
    },
    updateCustomer(customerId, patch) {
      return persistUpdatedCustomer(db, customerId, patch);
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

function requestOverviewItems(db: SqliteDatabase) {
  return listCommercialRequests(db).map((request) =>
    projectRequestOverviewItem({
      request,
      customerDisplayName: getCustomer(db, request.customerId)?.displayName ?? null,
      quotes: linkedQuoteOverviewItems(db, request.requestId),
    }),
  );
}

function quoteOverviewItems(db: SqliteDatabase) {
  return listQuoteSnapshots(db).map((quote) =>
    projectQuoteOverviewItem({
      quote,
      acceptance: getQuoteAcceptanceBySnapshotId(db, quote.quoteSnapshotId),
      order: getOrderSnapshotByQuoteSnapshotId(db, quote.quoteSnapshotId),
    }),
  );
}

function jobOverviewItems(db: SqliteDatabase) {
  const people = listPeople(db);
  return listOrderSnapshots(db).map((order) => {
    const release = getAcceptedProductionSnapshotByOrder(db, order.orderSnapshotId);
    const record = release
      ? getExecutionPlanBySnapshotId(db, release.snapshotId)
      : null;
    return projectJobOverviewItem({
      order,
      release,
      planView: record
        ? projectExecutionPlanView(
            record,
            people,
            release,
            readPeopleEligibilityContext(db),
          )
        : null,
    });
  });
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
