# WorkOS V1 — PERF_1 single product evaluation

```text
PROGRAM = WORKOS_PERFORMANCE_AND_LOGIC_EFFICIENCY_V1
SLICE = PERF_1_SINGLE_PRODUCT_EVALUATION
BASE_HEAD = e7634e6b0b86ddadfedc16c43a61b4ba91920ea8
BRANCH = perf/single-product-evaluation-v1
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
REAL_CLOUD_WRITE = NO
```

Request-scoped accepted-product evaluation. Canonical component truth is calculated once and reused by Aggregate, Process Composition, and EIC. The result is in-memory only. It is not a cache, not a persisted truth source, and not commercial pricing authority.

Living roadmap status is unchanged until this branch is accepted.

## Call counts

Successful accepted compile (`compileAcceptedProduct` / `compileAcceptedProductEvaluation`):

```text
COMPONENT_EVALUATION_CALLS_BEFORE = 2
COMPONENT_EVALUATION_CALLS_AFTER  = 1
EIC_COMPILE_CALLS_BEFORE          = 2
EIC_COMPILE_CALLS_AFTER           = 1
COST_EVIDENCE_READS_BEFORE        = 1
COST_EVIDENCE_READS_AFTER         = 1
PRESENTATION_READS_BEFORE         = 1
PRESENTATION_READS_AFTER          = 1
LABEL_READS_BEFORE                = 1
LABEL_READS_AFTER                 = 1
```

Baseline was proven on the current `compileAcceptedProduct` sequence before the orchestration landed:

1. `compileAggregate` → `evaluateProductComponents`
2. `composeProductProcessesFromTruth` → `evaluateProductComponents` again
3. `composeProductProcesses` → `compileEic` for cost completeness
4. `compileAcceptedProduct` → `compileEic` again

Confirm now projects the execution-plan preview from the same composition and EIC. It does not recompose.

Generic `composeProductProcesses(template, values)` remains independently usable and still compiles its own EIC once.

## Benchmark

```text
METHOD     = same-process LETTERS none/none 60 mm
WARMUP     = 25
ITERATIONS = 100
MEDIAN_BEFORE = 0.079 ms
MEDIAN_AFTER  = 0.054 ms
```

Wall-clock is informative only. The acceptance gate is the 1 / 1 call-count contract. Sub-millisecond samples are noisy.

## Architecture

Chosen: one request-scoped `compileAcceptedProductEvaluation` plus optional precomputed evaluations on `compileAggregate`, and a topology primitive that does not compile EIC.

Rejected as larger than needed: a persisted/cached evaluation object, a second aggregate model, or moving EIC ownership into Product / API presentation.

## Files changed

- `packages/domain/src/product/acceptedEvaluation.ts`
- `packages/domain/src/product/evaluationTrace.ts`
- `packages/domain/src/product/compiler.ts`
- `packages/domain/src/product/componentEvaluation.ts`
- `packages/domain/src/processes/composition.ts`
- `packages/domain/src/resources/eic.ts`
- `packages/domain/src/product/index.ts`
- `packages/domain/src/processes/index.ts`
- `packages/domain/src/index.ts`
- `apps/api/src/product.ts`
- `packages/domain/src/product/acceptedEvaluation.test.ts`
- `packages/domain/src/product/acceptedEvaluation.baseline.test.ts`
- `apps/api/tests/accepted-evaluation.test.ts`
- `docs/worklog/WORKOS_V1_PERF_1_SINGLE_PRODUCT_EVALUATION.md`

The evaluation-trace seam is test-only. Production calls are no-ops unless a test starts a trace.

## Tests

- domain accepted-evaluation + baseline
- domain EIC / composition / price / quote snapshot / production snapshot / ACM
- API accepted-evaluation gates and confirm counts
- existing product API confirm / quote pins

## Regression pins

```text
LETTERS_30  EIC=370.00  commercial=604.40
LETTERS_60  EIC=382.50  commercial=624.82
LETTERS_80  EIC=395.00  commercial=645.23
LETTERS_100 EIC=407.50  commercial=665.66
QUOTE_HASH_PIN = 35e562617d45f4caabb4f582b9c6385e6be5c1edc345c1dd31d688b25add2f27
SNAPSHOT_HASH_STATUS = UNCHANGED
ACM_REGRESSION = SAME_GENERIC_PIPELINE
```

## Smart modularity

```text
CAPABILITY_NAME = PRODUCT_EVALUATION_PIPELINE
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES
NO_CLIENT_CODE_FORK = YES
SNAPSHOT_IMPACT = NONE
```

Shared infrastructure, not an organization-configurable feature. LETTERS and ACM use the same evaluator. Unused modules stay silent. Frozen Quote / Order / Production records remain immutable.
