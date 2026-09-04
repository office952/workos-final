# WorkOS V1 — PERF_2 Product System presentation reuse

```text
PROGRAM = WORKOS_PERFORMANCE_AND_LOGIC_EFFICIENCY_V1
SLICE = PERF_2_PRODUCT_SYSTEM_PRESENTATION_REUSE
BASE_HEAD = aed8c3c741a06e78546f45d7cf096200e4006020
BRANCH = perf/product-system-presentation-reuse-v1
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
REAL_CLOUD_WRITE = NO
HTTP_CONTRACT_CHANGE = NO
SNAPSHOT_IMPACT = NONE
```

Runtime-local reuse of the current display-label catalog and the Product System presentation built from it. One generation stays current until a successful presentation-affecting write invalidates both. This is not persisted business truth, not ProductDefinition, not Quote / EIC / cost authority, and not a browser or distributed cache.

Living roadmap status is unchanged until this branch is accepted.

## BEFORE call counts

Current `ProductSystemRuntime` algorithm on `aed8c3c`, proven from source plus a deterministic replica of `labels()` / `present()`:

```text
labels()  = loadDisplayLabelCatalog(db)                         every call
present() = presentProductSystem(loadDisplayLabelCatalog(db))   every call
```

```text
CASE_A present(); present()
  DISPLAY_LABEL_CATALOG_LOADS = 2
  PRODUCT_SYSTEM_PRESENTATION_BUILDS = 2

CASE_B present(); labels()   # accepted-product path
  DISPLAY_LABEL_CATALOG_LOADS = 2
  PRODUCT_SYSTEM_PRESENTATION_BUILDS = 1

CASE_C labels(); labels(); present(); present()
  DISPLAY_LABEL_CATALOG_LOADS = 4
  PRODUCT_SYSTEM_PRESENTATION_BUILDS = 2
```

Accepted LETTERS confirm on a cold runtime therefore loaded the display-label catalog twice: `runtime.present()` then `runtime.labels()`.

Wall-clock timing is not the acceptance gate.

## AFTER call counts

```text
CASE_A present(); present()
  DISPLAY_LABEL_CATALOG_LOADS = 1
  PRODUCT_SYSTEM_PRESENTATION_BUILDS = 1

CASE_B present(); labels()
  DISPLAY_LABEL_CATALOG_LOADS = 1
  PRODUCT_SYSTEM_PRESENTATION_BUILDS = 1

CASE_C labels(); labels(); present(); present()
  DISPLAY_LABEL_CATALOG_LOADS = 1
  PRODUCT_SYSTEM_PRESENTATION_BUILDS = 1
  labels-only access does not construct presentation
```

Cold accepted LETTERS confirm on one runtime:

```text
DISPLAY_LABEL_CATALOG_LOADS = 1
PRODUCT_SYSTEM_PRESENTATION_BUILDS = 1
COMPONENT_EVALUATION_CALLS = 1
EIC_COMPILE_CALLS = 1
```

Second accepted confirm on the same still-current runtime, before any display-label mutation:

```text
ADDITIONAL_DISPLAY_LABEL_CATALOG_LOADS = 0
ADDITIONAL_PRODUCT_SYSTEM_PRESENTATION_BUILDS = 0
COMPONENT_EVALUATION_CALLS = 1
EIC_COMPILE_CALLS = 1
```

Accepted-product evaluation stays request-scoped. PERF_1 and PERF_2 optimize different layers.

## CACHE_SCOPE

```text
CACHE_SCOPE = ONE_PRODUCT_SYSTEM_RUNTIME_INSTANCE
GLOBAL_CACHE = NO
CROSS_ORG_ISOLATION = INSTANCE_LOCAL
RUNTIME_EVICTION_BEHAVIOR = CLOSE_DISCARDS_GENERATION
```

`createRuntimeRegistry()` keeps one open `ProductSystemRuntime` per `organizationId`. Evict / `closeAll` close that instance. A later `getOrOpen` builds a new runtime and therefore a new generation.

No current supported production path opens two live `ProductSystemRuntime` instances against the same operational plane. Unsupported direct-DB edits are not a customer operation and are not given a distributed coherence layer.

## INVALIDATION_MATRIX

Repository search of `product_system_display_metadata` writers:

| Path | Effect on presentation | Cache action |
|---|---|---|
| `bootstrapProductSystemDisplayStore` `INSERT OR IGNORE` | seeds missing labels at runtime open | happens before first cache fill |
| `updateDisplayLabel` success | label + revision change | invalidate catalog + presentation after write |
| `updateDisplayLabel` failure (`invalid_kind`, `unknown_entity`, `invalid_label`, `revision_conflict`) | no write | keep current generation |
| people `renameSkill` / person writes | not Product System presentation | none |
| CostEvidence / Quote / Order / Production / Request / execution writes | not `presentProductSystem` inputs | none |

`presentProductSystem` projects catalog, components, admin, presented-template lookup, and form-schema lookup from the current label catalog plus code contracts. The only supported runtime mutation of that label catalog is `runtime.updateDisplayLabel(...)`.

Successful PATCH `/api/admin/product-system/entities/:kind/:id/display-label` still returns a fresh `admin` projection because the route calls `runtime.present()` after the write.

## PERF_1_REGRESSION

```text
COMPONENT_EVALUATION_CALLS = 1
EIC_COMPILE_CALLS = 1
LETTERS_30  EIC=370.00  commercial=604.40
LETTERS_60  EIC=382.50  commercial=624.82
LETTERS_80  EIC=395.00  commercial=645.23
LETTERS_100 EIC=407.50  commercial=665.66
ACM_COMMERCIAL = 118.66
QUOTE_HASH_PIN = 35e562617d45f4caabb4f582b9c6385e6be5c1edc345c1dd31d688b25add2f27
```

## SMART_MODULARITY_REVIEW

```text
CAPABILITY_NAME = PRODUCT_SYSTEM_PRESENTATION_REUSE
AVAILABLE_MODES = N/A_SHARED_INFRASTRUCTURE
DEFAULT_MODE = TRANSPARENT
CONFIGURATION_SURFACE = NONE_REQUIRED
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES
OTHER_COMPANY_SCENARIOS = PASS_IF_SEMANTICS_IDENTICAL
NO_CLIENT_CODE_FORK = YES
SNAPSHOT_IMPACT = NONE
```

Not an organization feature toggle. Advanced and small companies see the same Product System truth, with fewer repeated presentation rebuilds. Unused families stay silent. Historical accepted records stay immutable.

## PLUGIN_USE

```text
COMPOUND_ENGINEERING = PLAN_ONLY_NO_DOCS_PLANS_ARTIFACT
VERIFY_THIS = BASELINE_AND_AFTER_CALL_COUNTS
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

ce-plan produced the implementation approach in-session. No `docs/plans/`, `STRATEGY.md`, or `docs/solutions/` file was written. Product authority stays in the Owner GO, canons, and this worklog.

## Architecture

Chosen: a small runtime-local accessor with injected loader / projector, owned by one `ProductSystemRuntime`.

Rejected as larger than needed: a generic CacheManager, TTL / timers, Redis, a persisted cache table, module-global counters, or extending PERF_1's evaluation-trace global into presentation observability.

Optional `observeDisplayLabelCatalogLoad` / `observeProductSystemPresentationBuild` hooks exist only so tests can count loads without production global state.

## Files changed

- `apps/api/src/productSystem/presentationReuse.ts`
- `apps/api/src/productSystem/runtime.ts`
- `apps/api/tests/presentation-reuse.test.ts`
- `docs/worklog/WORKOS_V1_PERF_2_PRODUCT_SYSTEM_PRESENTATION_REUSE.md`
