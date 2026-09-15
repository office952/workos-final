# Configurator Form Completeness FC2D — implemented locally, in review

```text
AUTHORITY                      = WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2D
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = FC2D_RESOURCE_IDENTITIES_AND_FUNCTIONAL_PROVISIONAL_COSTING
IMPLEMENTATION                 = YES
OWNER_ACCEPTED                 = NO
MERGE                          = NO
FORM_SCHEMA_CHANGED            = NO
PRODUCT_TEMPLATE_CHANGED       = NO
LIVE_NEW_FINISH_ACTIVATED      = NO
SUPPLIER_OPTIMIZATION          = NO
RAL_DETAILED_PRICING           = NO
NESTING                        = NO
FIGMA_WRITE                    = NO
REAL_CLOUD_WRITE               = NO
REAL_DB_WRITE                  = NO
DB_SCHEMA_MIGRATION            = NO
SYNTHETIC_DB_WRITE             = YES
BASE_HEAD                      = 6f1a6f1fc7833a21c672667f3a76a8d3f248117b
ORIGIN_MAIN                    = 8c2223b3a7853e6c0ebb788e44046401985d7f1f
NEXT_RECOMMENDED_SLICE         = FC2B_LETTERS_FACE_FORM_AND_RESOLVER_INTEGRATION
```

This worklog records the FC2D resource-identity and functional provisional-costing slice. It is not Owner acceptance. Do not start FC2B, live finish activation, or a real-Cloud backfill from this file.

## Owner law

```text
PRICE_ACCURACY_IS_NOT_A_WORKFLOW_GATE = YES
PRICE_CALIBRATION_DOES_NOT_BLOCK_WORKFLOW = YES
PRICE_CONFIDENCE_BLOCKS_EIC = NO
```

Configuration → resource resolution → quantity → usable editable rate → EIC → commercial must return a valid number. The first commercial result is not an accuracy target. Owner can edit the rate later in `/admin/resources` → Costuri interne.

Do not block because a supplier is unknown, a rate is approximate, a rate is `LEGACY_EVIDENCE` / `PLATFORM_DEFAULT` / `DEVELOPMENT_DEFAULT`, or Owner has not calibrated it. Do not silently use zero for a missing rate.

## Resource identities

Added:

- `MAT-VINYL-ORACAL-641`
- `MAT-VINYL-ORACAL-8500`
- `MAT-VINYL-PRINT`
- `MAT-VINYL-LAMINATE`
- `SVC-LARGE-FORMAT-PRINT`

Reused:

- `MAT-VINYL-ORACAL-651`
- `LAB-VINYL-FACE`
- `LAB-VINYL-VOLUME`
- `SVC-PAINT-RAL`

`SVC-LAMINATE` is deferred. Print plus laminate is print media + large-format print + laminate material + shared FACE apply. `MAT-VINYL-PRINT-LAMINATED` is not a canonical identity.

Application labor stays one shared FACE identity across Oracal series.

## Provisional rates

Seed rows are usable, non-zero, and not `OWNER_CONFIRMED`. Exact starting amounts are functional defaults, not acceptance targets.

## Additive backfill

Live compile still reads SQLite active evidence. Adding seed rows alone is not enough for organizations that already have `RESOURCE_COST_EVIDENCE_V1_APPLIED`.

`RESOURCE_COST_EVIDENCE_FC2D_V1_APPLIED` is an additive, idempotent backfill:

- inserts only missing FC2D cost-evidence slots
- never overwrites an existing active rate
- never supersedes an Owner-edited rate
- never restores a provisional amount after Owner edit
- marks its own bootstrap state
- skips `ADOPT_EXISTING`

The mechanism is implemented and tested on synthetic SQLite only. Real Cloud / real database execution remains a later explicit gate.

No schema migration. Existing `resource_cost_evidence` and `runtime_bootstrap_markers` tables are reused.

## Out of scope

- supplier-management system
- multi-supplier comparison
- detailed historical RAL pricing (generic `SVC-PAINT-RAL` remains the functional path)
- roll nesting
- VOLUME finish form / return-wrap +10 mm
- live LETTERS FormSchema or ProductTemplate activation
- new selectable finishes in runtime

## Mapping capability

`faceFinishCostRequirements` / `compileFaceFinishCost` resolve FACE applications for later FC2B use. They are not wired to the live eight-field form.

FACE V1 quantity is confirmed face area m².

## Tests

- Domain: 77 files, 486 passed, including FC2D finish-cost mapping and LETTERS eight-field regression
- API: 49 files, 309 passed, including synthetic fresh/V1-upgrade/owner-preserve/idempotent/restart/isolation/admin-edit backfill tests and existing quote/freeze coverage
- Web unit: 64 files, 282 passed
- `pnpm docs:check` PASS
- `pnpm typecheck` PASS
- `pnpm lint` 0 errors
- `git diff --check` clean

Full Playwright was not run. Real Cloud write and real database mutation were not executed.
