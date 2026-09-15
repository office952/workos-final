# Configurator Form Completeness FC1 — implemented locally, in review

```text
AUTHORITY                      = WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC1
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = FC1_CURRENT_TRUTH_PROJECTION_REPAIRS
IMPLEMENTATION                 = YES
OWNER_ACCEPTED                 = NO
MERGE                          = NO
PRODUCT_TRUTH_EXPANSION        = NO
NEW_PRODUCT_FIELDS             = 0
REAL_CLOUD_WRITE               = NO
DB_WRITE                       = NO
FIGMA_WRITE                    = NO
ORIGIN_MAIN                    = 756b9f6f537cf5ee571583577ef2552d28a0923b
FORM_COMPLETENESS_AUDIT_V1     = ACCEPTED
CONFIGURATOR_UI_UX_FRAMEWORK   = FROZEN_V1
CURSOR_WORKOS_HARNESS_V2       = INTEGRATED_ON_MAIN
```

This worklog records local FC1 implementation. It is not Owner acceptance.

## Scope

Projection-only repairs for accepted FC0 findings B1–B5. Frozen Configurator V1 chrome is unchanged. LETTERS stays 8 FormSchema fields. ACM stays 6. No ProductTemplate, FormSchema, compiler, domain, API, DB, or Cloud writes.

Persisted accepted FC0 inventory: `docs/plans/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC0_PLAN.md`.

## B1–B5 outcome

- **B1** `selectedConfigurationFacts(template, schema, values)` uses `selectedComponentIds` + `isFieldVisible`. Vinyl color remains in draft after finish=none, but Editor, summary, review, and `compileDefinition` exclude it.
- **B2** LETTERS BACK projects FACE `confirmedAreaMm2` as `BlueprintFactKind=inherited` from existing `inputMapping.confirmedAreaMm2FromComponentId`. No second TechnicalMeasurement. Generic/Figma inheritance remains prohibited.
- **B3** ACM Blueprint has no LIGHTING component section. Identity `Fără iluminare` stays visible on ROOT.
- **B4** ACM `face.thicknessMm=3` is shown as fixed identity (`ACM 3 mm`). Blueprint skips duplicate derived/operator thickness. Confirm summary filters `template.fixedValues` measurements so “Grosime ACM: 3 mm (introdus de operator)” is absent. Calculation still consumes the compiled measurement.
- **B5** `Configurare completă` only when `compileDefinition.readiness === "ready"`. When all modules validate and ROOT still blocks: `N din M module validate · K câmp(uri) obligatoriu/obligatorii lipsă`. Composition incomplete copy no longer implies modules alone complete the product.

## Files

Presentation / projection / tests / docs only:

- `apps/web/src/configurator/configuratorView.ts`
- `apps/web/src/configurator/configuratorView.test.ts`
- `apps/web/src/configurator/ConfiguratorWorkspace.tsx`
- `apps/web/src/ProductConfigurationPage.tsx`
- `apps/web/src/ProductConfigurationViews.tsx`
- `apps/web/src/ProductConfigurationViews.test.tsx`
- `e2e/configurator-final.spec.ts`
- `e2e/acm-cassette.spec.ts`
- `docs/plans/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC0_PLAN.md`
- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` (living current-state block only)
- this worklog

## Tests

Required pins: exact 8 LETTERS field ids, exact 6 ACM field ids, B1–B5 unit cases, updated anti-inherited test (canonical `inputMapping` allowed; generic fake inheritance still forbidden).

Harness unit tests under `.cursor/` plus `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

Isolated E2E: `node .cursor/run-isolated-e2e.mjs` (full Playwright suite, including `e2e/configurator-final.spec.ts` and `e2e/acm-cassette.spec.ts`). Isolated local runtime only. Two local runs after B1–B5 projection and after confirm-path residual closes: both 119 passed, 5 skipped, 0 failed.

## Browser evidence

Playwright isolated E2E covers 1440 / 1280 / 768 geometry, rail, Editor-before-Blueprint at 768, and FC1 LETTERS/ACM assertions including vinyl→none confirm (no stale color) and ACM confirm (no operator thickness copy). Live Browser Agent against a non-isolated `pnpm --filter api start` is harness-denied. Isolated E2E is the authorized runtime.

## Red team

`workos-red-team` after writer. First pass HIGH: leftover B4 confirm copy (`Grosime ACM … introdus de operator`) and composition wording that could imply module-only completeness. Both closed in presentation only.

Second pass: no CRITICAL/HIGH. LOW residuals reconciled before commit:

- `ConfirmedSummary` now resolves `template.fixedValues` from `truth.templateCode` even if the caller omits `fixedFieldIds`
- LETTERS E2E now confirms after vinyl→none and asserts stale color remains absent
- ACM Blueprint no longer keeps a dead LIGHTING section label
- fixed-value measurements are omitted from Blueprint rather than matched by substring

## Product Truth boundaries

- No new fields, options, measurements, components, readiness engine, pricing, internal cost, or production planning.
- Hidden draft values are not destructively cleared.
- ACM ProductTemplate still FACE + BACK only.
- `TechnicalMeasurement` union and calculation contracts unchanged.

## Cloud isolation

No real Cloud writes. Isolated E2E uses local test/runtime data only.

## Smart modularity

Same current template/schema for ADVANCED_COMPANY and SMALL_COMPANY. Unused templates do not block this path. Richer future config requires explicit Product Truth/version. Historical snapshots unchanged. Customer operable without Cursor. No client-code fork.

## Remaining C / D / E

Deferred exactly as accepted FC0 inventory. Not implemented in FC1:

- C: ACM `face.finish=none` identity gap; `projectConfiguratorView` recompilation architecture; paint material/resource semantics; BACK second measurement
- D: Owner-decision catalogs and richer construction facts
- E: composite / multi-product / ANSAMBLARE / persistence expansion
