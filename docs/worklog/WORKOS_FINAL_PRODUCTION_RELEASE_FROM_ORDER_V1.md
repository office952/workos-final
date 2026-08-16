# Production Release from Order V1

Closes the commercial Order → workshop authorization boundary.
Does not auto-create ExecutionPlan or start tasks.

## Decision

Reuse `AcceptedProductionSnapshot` as the Production Release Snapshot.
Commercial releases add Order lineage and a distinct content hash.
Pilot workshop accept remains a separate PILOT path.

```text
Order Snapshot + FrozenProductionInput
  → freezeProductionReleaseFromOrder
  → AcceptedProductionSnapshot (releaseSource = ORDER)
  → [later] Creează planul de execuție
```

Option A: Release authorizes production. ExecutionPlan stays a separate operator action.

## Law

Release is created only from a persisted Order.
It copies frozen operations, requirements, settings, recipes, and planned EIC.
It does not reread ProductTemplate, settings, recipes, EIC, or Commercial.

One Order → one Release. Retry returns the same row.

## UI

Commercial next action: **Eliberează pentru producție**.
After release: **Eliberată pentru producție**.
**Acceptă pentru producție** remains only Atelier / test tehnic when no Order exists.

## Golden

60 mm none/none keeps EIC 382.50 and Commercial 624.82.
Release has 12 operations and used lighting settings 100 mm / 0.75 W / 25%.
