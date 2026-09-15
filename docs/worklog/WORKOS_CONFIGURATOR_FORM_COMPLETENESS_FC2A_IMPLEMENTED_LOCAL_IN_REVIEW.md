# Configurator Form Completeness FC2A — implemented locally, in review

```text
AUTHORITY                      = WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2A
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = FC2A_SHARED_FINISH_COLOR_ROLL_FOUNDATION
IMPLEMENTATION                 = YES
OWNER_ACCEPTED                 = NO
MERGE                          = NO
PRODUCT_TRUTH_EXPANSION        = NO
FORM_SCHEMA_CHANGED            = NO
PRODUCT_TEMPLATE_CHANGED       = NO
COMPILER_BEHAVIOR_CHANGED      = NO
RESOURCE_RATE_CHANGED          = NO
RAL_COSTING_IMPLEMENTED        = NO
RAL_COSTING_DEFERRED_TO        = FC2D
NEW_PRICE_STATUS_FIELD_ADDED   = NO
APP_RUNTIME_UI_WRITE           = NO
FIGMA_WRITE                    = NO
DB_WRITE                       = NO
REAL_CLOUD_WRITE               = NO
ORIGIN_MAIN                    = 8c2223b3a7853e6c0ebb788e44046401985d7f1f
FORM_COMPLETENESS_AUDIT_V1     = ACCEPTED
FC2_DECISION_PACK              = ACCEPTED_WITH_TARGETED_AMENDMENTS
NEXT_RECOMMENDED_SLICE         = FC2D_RESOURCE_IDENTITIES_AND_EDITABLE_COSTING
```

This worklog records local FC2A foundation implementation. It is not Owner acceptance.

## Decision pack

FC2 recovery / integration decision pack is accepted with targeted amendments:

- Shared Finish Catalog, Color Registry, and Roll Registry are reusable current-domain contracts. Legacy `workos-vscode` remains read-only reference.
- Oracal 641 uses the proven 651 palette projection. 641 identity, series, and future resource/price identity stay 641. Unknown 641 codes use `OPERATOR_MANUAL` + `needsReview`.
- HUB MEDIA print roll widths 1050 / 1370 are organization configuration, not universal Product Truth.
- Do not add a parallel persisted `pricingStatus`. Future presentation may derive review state from existing CostEvidence `source` / `classification`.
- RAL depth + labor + 100 RON minimum costing is deferred to FC2D. Do not silently keep only `SVC-PAINT-RAL` 4 EUR/m when that slice lands. Do not double-charge generic + detailed paths. Historical snapshots remain historical.

## Scope

Domain-only foundation under `packages/domain/src/finishes/`.

Not in this slice:

- LETTERS FormSchema / ProductTemplate / `compileDefinition` behavior
- Configurator runtime fields (`face.vinylSeries`, color/roll ids, laminate)
- Resource rates (641, 8500, print, laminate, RAL depth)
- Color / Roll admin UI
- Quote mutation
- Figma
- Database / Cloud

## Contracts

| Contract | Current name |
|---|---|
| Finish catalog item | `FinishCatalogItem` |
| Color catalog item | `ColorCatalogItem` |
| Roll profile | `RollProfile` |
| Selection / snapshot | `FinishSelection` / `FinishSelectionSnapshot` |
| Compatibility | `resolveFinishCompatibility` |

Typed failures: `MISSING_REQUIRED_CONFIGURATION`, `INVALID_CATALOG_REFERENCE`, `NO_RESOLVABLE_RESOURCE`, `PRODUCT_TRUTH_CONFLICT`.

Price-needs-review, another organization roll width, a later-added color, and uncalibrated legacy price are not resolver failures.

## Data

- RAL Classic 213, Oracal 651 79, Oracal 8500 55, normalized from proven legacy internal registries. No internet scrape.
- Shared Oracal rolls: 1000 (default), 1260.
- HUB MEDIA print overlay: 1050 (default), 1370.
- Finish applications exist as catalog metadata only. They are not bound to the live LETTERS template.

## Files

- `packages/domain/src/finishes/**`
- `packages/domain/src/index.ts` (exports only)
- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` (living current-state flags only)
- `docs/continuity/WORKOS_SESSION_CURRENT.md`
- `docs/plans/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC0_PLAN.md` (status pointer only)
- `scripts/verify-workos-docs-continuity.mjs` (living-flag pins after FC2A)
- this worklog

## Tests

Focused domain tests for color counts and unique ids, RAL / 651 / 8500 lookup, 641 projection and manual fallback, roll precedence / inactive filter / organization overlay / shared fallback, finish-color and finish-roll compatibility, snapshot stability, typed invalid-catalog failure, HUB MEDIA / small-company / no-print / enable-later modularity, and unchanged LETTERS eight-field FormSchema.

`pnpm --filter @workos-final/domain test`: 76 files, 472 passed, including 19 finish-foundation tests. Domain `tsc --noEmit` passed. `pnpm docs:check` passed. `pnpm lint` has 0 errors on FC2A files; remaining warnings are pre-existing web Fast Refresh / hook deps.

Playwright was not run. Runtime UI was not affected.

## Smart modularity

Same foundation contracts for HUB MEDIA, a 651-only small company, and a company without print. Enabling print later does not rewrite a frozen Oracal snapshot. No client-code fork. Customer operation without Cursor remains a FC2E target, not an FC2A claim.

## FC2A1 correction

Owner later corrected two living semantics before FC2D. Details live in `docs/worklog/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2A1_IMPLEMENTED_LOCAL_IN_REVIEW.md`.

- Price provenance no longer keeps EIC PARTIAL.
- An organization-disabled finish is `ORG_CAPABILITY_DISABLED`, not Product Truth conflict.
