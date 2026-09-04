# WorkOS V1 — OS-S7 Order service truth

```text
PROGRAM = OPERATIONAL_SERVICES_E2E
SLICE = OS_S7_ORDER_SERVICE_TRUTH_V1
BASE_HEAD = 274c9dc6fcb21cea1d974d3031d976037c7b03fa
BRANCH = feat/os-s7-order-service-truth-v1
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_SELECTION = OS_S7_SELECTED_AFTER_PERF3
OWNER_ACCEPTED = NO
INDEPENDENT_REVIEW = CHANGES_REQUIRED
P2 = OS_S7_QUOTE_V2_INTEGRITY_AT_ORDER_BOUNDARY
CORRECTION = CLOSED
SNAPSHOT_HASH_INTEGRITY = PASS
V2_SEMANTIC_MIRROR = PASS
```

```text
OS_S6_TRANSPORT = DEFERRED_NO_INVENTION
OS_S6_BLOCKER = TRANSPORT_EIC_QUANTITY_POLICY_NOT_SELECTED
TRANSPORT_EIC_QUANTITY_POLICY = EUR_PER_TRIP_OR_EUR_PER_KM_NOT_YET_SELECTED
```

A valid frozen Quote v2 with PRODUCT + SITE_INSTALLATION copies into an immutable Order v2. Copy, do not recalculate. Live v2 Quote freeze, acceptance, PDF, and Production Release stay refused.

```text
QUOTE_V1_REGRESSION = PASS
ORDER_V1_REGRESSION = PASS
ORDER_V1_SCHEMA = 1
ORDER_V2_SCHEMA = 2
ORDER_V2_LINES = COPIED_FROM_FROZEN_QUOTE
ORDER_V2_JOB_COMMERCIAL = COPIED_FROM_FROZEN_QUOTE
ORDER_V2_IMMUTABILITY = YES
ACCEPTANCE_LIVE_GATE = REFUSED
QUOTE_FREEZE_LIVE_GATE = REFUSED
PDF_LIVE_GATE = REFUSED
PRODUCTION_RELEASE_V2_GATE = REFUSED
FINANCIAL_ACCESS = ALT_B_SCOPED_REUSED
DB_SCHEMA_CHANGE = NO
MIGRATION = NO
REAL_CLOUD_WRITE = NO
TESTS = PASS
TYPECHECK = PASS
LINT = PASS_FOR_SLICE_FILES
BUILD = PASS
E2E = PASS
```

```text
SMART_MODULARITY_REVIEW
CAPABILITY_NAME = ORDER_SERVICE_TRUTH
ADVANCED_COMPANY = can freeze/copy selected supported operational-service lines once prior gates are available
SIMPLE_COMPANY = product-only Quote v1 → Order v1 unchanged
SERVICE_DISABLED_COMPANY = no service line, no extra Order complexity
LATER_ENABLEMENT = later service enablement does not rewrite historical Order v1/v2
CONFIG_CHANGE_AFTER_ORDER = no historical repricing or rewrite
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES
NO_CLIENT_CODE_FORK = YES
ORG_ISOLATION = RUNTIME_STORE_PLANE_ISOLATION
SNAPSHOT_IMPACT = ADDITIVE_NEW_ORDER_SCHEMA_ONLY
```

## Order-boundary Quote v2 integrity

Independent review required a P2 close at the Order v2 boundary: a structurally supported Quote v2 must also still match its `contentHash` / identity, and PRODUCT / SITE_INSTALLATION facts must stay internally coherent. The check reconstructs the same hashed payload as `freezeQuoteSnapshot` and does not load live Resources, CostEvidence, ProductTemplate, Request, or commercial policy. Historical Quote v1 hashes stay unchanged. `isSupportedQuoteSnapshot()` is unchanged.

```text
ORDER_V2_TRUST_SEAM = isTrustedFrozenQuoteV2ForOrder
HASH_LAW = sha256Hex(stableStringify(quoteSnapshotHashedPayload))
V1_HASH_FIXTURE = 35e562617d45f4caabb4f582b9c6385e6be5c1edc345c1dd31d688b25add2f27
COPY_DONT_RECALCULATE = YES
LIVE_RECOMPILE = NO
```
