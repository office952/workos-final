# WORKOS_FINAL_COMPONENT_TECHNICAL_SETTINGS_CANONICAL_FOUNDATION_V1

TASK = Canonical component technical settings foundation + permanent single-truth law

BASELINE = f36ce61fba87c18036973c4c204bc8172ea0a3b1

## Permanent law

Active technical values live in canonical settings.
Documentation explains them.
Calculation code consumes them.
Intake does not administer them.

## Ownership

| Kind | Owner |
|---|---|
| Adjustable reusable technical parameter | Product System / component variant settings |
| Formula | Component calculation contract |
| Order-specific input | Intake / ProductTruth |
| Resource rate | Resources / Cost |
| Product identity | ProductTemplate |

## LED pitch

CANONICAL SOURCE = `packages/domain/src/product/technicalSettings.ts` → `ledPitchMm` on `LIGHTING_FRONT_LED`

Value 100 mm. Owner-confirmed. Configurable. Not an immutable law.

## PSU reserve

`psuReservePercent` exists, unresolved, no numeric default.

## Intake

`ledPitchMm` and `psuReservePercent` are not form fields.

## UI

Module și componente → Componente de produs → Iluminare → Iluminare frontală → Setări tehnice

Read-only. No Edit / Save.

## Governance

Authority `COMPONENT_TECHNICAL_SETTINGS` under Autoritate și adevăr.
Intake and documentation boundaries under Limite și protecții.

## Docs canon

`docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md`

## Cleanup

Retired the confirm-page sentence that treated LED pitch as unresolved.
Historical worklogs left as evidence.

## Tests

Generic registry lookup, validation, duplicate-id rejection, unresolved status.
Lighting consumes settings and stays UNAVAILABLE.
Projection and API expose settings.
E2E covers catalog, lighting settings, governance, and product configure/review/confirm.

## Limitations

No admin editing, persistence, versioning, or lighting quantity formula.
PSU reserve still blocks LIGHTING.

## Next

Owner decides PSU reserve, or the next V1 domain with real E2E value. Do not enable fake settings editing.
