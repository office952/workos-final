# WorkOS V1 — PERF_3 Resources mutation delta

```text
PROGRAM = WORKOS_PERFORMANCE_AND_LOGIC_EFFICIENCY_V1
SLICE = PERF_3_RESOURCES_MUTATION_DELTA
BASE_HEAD = e14912a63dc008aaea33673b4d45e341bd542cce
BRANCH = perf/resources-mutation-delta-v1
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
REAL_CLOUD_WRITE = NO
HTTP_CONTRACT_CHANGE = NO
SNAPSHOT_IMPACT = NONE
DATABASE_SCHEMA_CHANGE = NO
UI_CHANGE = NO
```

Runtime-local reuse of the active CostEvidence list and the Resources/Cost admin projection built from it. After one successful CostEvidence write, only the affected evidence slot, resource record, recipes that use that resource, and consuming ProductTemplate usages are rebuilt. A failed write changes nothing. This is not persisted business truth, not Product System presentation, not Quote / EIC authority, and not a browser or distributed cache.

Living roadmap status is unchanged until this branch is accepted.

## BEFORE call counts

Current mutation path on `e14912a`, proven from `GET /api/resources-admin` plus `PATCH` / `POST` `/api/resources-admin/cost-evidence`:

```text
GET admin
  ACTIVE_COST_EVIDENCE_LOADS = 1
  RESOURCES_ADMIN_FULL_BUILDS = 1

GET admin; successful CostEvidence write
  ACTIVE_COST_EVIDENCE_LOADS = 2
  RESOURCES_ADMIN_FULL_BUILDS = 2

GET admin; failed CostEvidence write
  ACTIVE_COST_EVIDENCE_LOADS = 1
  RESOURCES_ADMIN_FULL_BUILDS = 1
  then a later GET would load and rebuild again if the first generation was not kept
```

Successful write always re-listed every active row and rebuilt the entire administration projection, including unrelated materials, recipes, and the other ProductTemplate usage.

Wall-clock timing is not the acceptance gate.

## AFTER call counts

```text
GET admin; GET admin
  ACTIVE_COST_EVIDENCE_LOADS = 1
  RESOURCES_ADMIN_FULL_BUILDS = 1

GET admin; successful unqualified plexi write
  ACTIVE_COST_EVIDENCE_LOADS = 1
  RESOURCES_ADMIN_FULL_BUILDS = 1
  RESOURCES_ADMIN_DELTAS = 1
  costEvidenceRowsRebuilt = 1
  resourceRecordsRebuilt = 1
  recipeRecordsRebuilt = 0
  templateUsagesRebuilt = 1   # LETTERS only

GET admin; successful aluminium 60 mm write
  ACTIVE_COST_EVIDENCE_LOADS = 1
  RESOURCES_ADMIN_FULL_BUILDS = 1
  RESOURCES_ADMIN_DELTAS = 1
  costEvidenceRowsRebuilt = 1
  30 / 80 / 100 mm slots kept by identity
  ACM usage kept by identity

GET admin; successful shared pack write
  templateUsagesRebuilt = 2   # LETTERS + ACM, no productCode fork

GET admin; failed write
  ACTIVE_COST_EVIDENCE_LOADS = 1
  RESOURCES_ADMIN_FULL_BUILDS = 1
  RESOURCES_ADMIN_DELTAS = 0
```

Cold write with no prior generation still loads evidence once and builds the full admin once, then returns the same HTTP `{ evidence, admin }` body.

## CACHE_SCOPE

```text
CACHE_SCOPE = ONE_PRODUCT_SYSTEM_RUNTIME_INSTANCE
GLOBAL_CACHE = NO
CROSS_ORG_ISOLATION = INSTANCE_LOCAL
RUNTIME_EVICTION_BEHAVIOR = CLOSE_DISCARDS_GENERATION
```

Same scope as PERF_2. `createRuntimeRegistry()` keeps one open `ProductSystemRuntime` per `organizationId`. Close discards the generation.

CostEvidence writes are not Product System presentation inputs. Successful CostEvidence mutation does not invalidate presentation reuse.

## INVALIDATION_MATRIX

| Path | Effect on resources admin | Cache action |
|---|---|---|
| `listActiveCostEvidence` / `resourcesAdministration` cold | fills generation | load + full project |
| successful `supersedeCostEvidence` | one slot + affected records | apply in-memory delta |
| successful `createInitialCostEvidence` | insert slot + affected records | apply in-memory delta |
| failed amount / note / qualifier / stale / already_exists | no write | keep current generation |
| `updateDisplayLabel` success or failure | not a CostEvidence input | none |
| Quote / Order / Production / Request / execution writes | not resources admin inputs | none |

Unsupported direct-DB edits are not a customer operation and are not given a distributed coherence layer.

## PERF_1_REGRESSION

```text
COMPONENT_EVALUATION_CALLS = 1
EIC_COMPILE_CALLS = 1
LETTERS_30  EIC=370.00  commercial=604.40
LETTERS_60  after aluminium 60 mm 3→4 EUR/m  EIC=395.00
LETTERS_80  EIC=395.00
LETTERS_100 EIC=407.50
ACM_COMMERCIAL = 118.66
QUOTE_SNAPSHOT = immutable after a later live rate edit
```

Virgin canonical LETTERS 60 mm none/none remains 382.50 / 624.82 until an owner write.

## SMART_MODULARITY_REVIEW

```text
CAPABILITY_NAME = RESOURCES_MUTATION_DELTA
AVAILABLE_MODES = N/A_SHARED_INFRASTRUCTURE
DEFAULT_MODE = TRANSPARENT
CONFIGURATION_SURFACE = NONE_REQUIRED
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES
OTHER_COMPANY_SCENARIOS = PASS_IF_SEMANTICS_IDENTICAL
NO_CLIENT_CODE_FORK = YES
SNAPSHOT_IMPACT = NONE
```

Not an organization feature toggle. Shared resources refresh every consuming ProductTemplate usage. Qualifier slots stay distinct. Unused families stay silent.

## PLUGIN_USE

```text
COMPOUND_ENGINEERING = NO
VERIFY_THIS = CALL_COUNTS_AND_REGRESSION
CHECK_COMPILER_ERRORS = TYPECHECK_PASS
DESLOP = DIFF_CLEANED
CONTEXT7_USED = NO
FIGMA = NOT_USED
21ST = NOT_USED
SHADCN = NOT_USED
REACT_DOCTOR = NOT_USED
BROWSERSTACK = NOT_USED
SUBTEXT = NOT_USED
```

## DATE_SENSITIVE_GENERATION

```text
RESOURCES_ADMIN_PROJECTION_DEPENDS_ON_UTC_CALENDAR_DATE = YES
ACTIVE_COST_EVIDENCE_CACHE_LAW = ROWS_ARE_PERSISTED_FACTS
RESOURCES_ADMIN_CACHE_LAW = REUSABLE_ONLY_ON_SAME_UTC_CALENDAR_DATE
UTC_DATE_ROLLOVER = ONE_ADMIN_REBUILD_FROM_CACHED_EVIDENCE
EVIDENCE_DB_RELOAD_ON_DATE_CHANGE = NO
TIMER / TTL / REDIS / EVENT_BUS = NO
MUTATION_AFTER_ROLLOVER = COHERENT_DAY_B_PROJECTION_NO_MIXED_SLICES
```

`validUntil=YYYY-MM-DD` is inclusive for that whole UTC calendar date and expires the next UTC day. The admin generation stores that date. A later GET or write on a new UTC date rebuilds the full projection once from the already-cached evidence list, then reuses it for the rest of that date.

Deterministic rollover evidence:

```text
GET at 2026-09-04T23:59:00Z  validityState=current   loads=1 builds=1
GET at 2026-09-05T00:01:00Z  validityState=expired   loads=1 builds=2
GET again on 2026-09-05      reuse                   loads=1 builds=2
validFrom=2026-09-05         not current before UTC date, current after
mutation after rollover      full day-B rebuild from cached evidence, no mixed slices
```

## Architecture

Chosen: a small runtime-local accessor with injected loader / projector, plus a domain delta that patches only affected administration slices.

Rejected as larger than needed: Redis / TTL / global cache / event bus / CQRS, a second resources calculator, or a `productCode === LETTERS` fork.

Optional observe hooks exist only so tests can count loads, full builds, and delta stats without production global state.

## Files changed

- `packages/domain/src/resources/catalog.ts`
- `packages/domain/src/resources/projection.ts`
- `packages/domain/src/resources/productTemplateUsage.ts`
- `packages/domain/src/resources/index.ts`
- `packages/domain/src/index.ts`
- `packages/domain/src/resources/mutationDelta.test.ts`
- `apps/api/src/resources/store.ts`
- `apps/api/src/productSystem/resourcesAdministrationReuse.ts`
- `apps/api/src/productSystem/runtime.ts`
- `apps/api/src/system.ts`
- `apps/api/tests/resources-mutation-delta.test.ts`
- `docs/worklog/WORKOS_V1_PERF_3_RESOURCES_MUTATION_DELTA.md`
