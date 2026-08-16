# Accepted Production Snapshot canon

Canonical current law for the frozen technical production snapshot.
Runtime wins if this document disagrees.

## Permanent separation

```text
Pilot:
Confirmed Product Truth
  → Accepted Production Snapshot    PILOT
  → ExecutionPlan

Commercial:
Order Snapshot + FrozenProductionInput
  → Production Release Snapshot     ORDER-sourced APS
  → ExecutionPlan
```

Conceptually, Production Release Snapshot = Accepted Production Snapshot.
Commercial release adds Order lineage. It does not create a second snapshot family.

Confirmation validates truth.
Pilot accept freezes workshop technical truth from live confirmed Product Truth.
Commercial release freezes workshop authorization from the persisted Order.
They are not the same action.

## What this is

An immutable technical snapshot of the accepted LETTERS production truth:

- product identity and confirmed configuration
- operator-confirmed geometry
- aggregate quantities and resource requirements
- process composition, dependencies, required capabilities
- technical-setting values actually used
- recipe / cost-evidence identities and rates used for the accepted EIC

Future persisted Execution must consume this snapshot. It must not reread mutable ProductTemplate, current settings, current recipe rates, or regenerate composition for already-accepted work.

## What this is not

Not a customer Order.
Not Commercial or Quote.
The commercial job root is Order Snapshot.
Commercial production uses `freezeProductionReleaseFromOrder(order)` and copies frozen production input. It does not reread ProductTemplate, settings, recipes, EIC, or Commercial.
Pilot workshop accept remains available only when no commercial Order exists, labeled Atelier / test tehnic.
Quote/Order carry the same generic `FrozenProductionInput` arrays. That does not make Quote or Order a Production Snapshot.
Not an ExecutionPlan or ExecutionTask by itself.
Not machine / people assignment.
Not a workflow engine.

## Identity

`snapshotId = aps:{productCode}:{contentHash}`

Content hash is SHA-256 of the canonical accepted content.
It excludes `snapshotId`, `createdAt`, and `sourceConfirmedAt`.
Pilot hash stays the existing production-content hash.
Commercial release hash also includes `releaseSource`, `sourceOrderSnapshotId`, `sourceOrderContentHash`, and `sourceProductionInputHash`.
One Order produces one Release. A retry returns the existing row and `created: false`.

A correction creates a new snapshot. There is no update endpoint.

## Providers

The snapshot freezes the required capability.
It does not assign a Machine or Workcenter.
Provider eligibility stays a live concern until Execution materialization.

## Cost

The snapshot stores the accepted EIC reference and the rates used that day.
New canonical none/none at 60 mm freezes 382.50 EUR COMPLETE. Historical snapshots that froze 595.00 EUR PARTIAL stay unchanged. Operator-confirmed geometry is valid Product Truth. Analyzer provenance is not required.
Later calibration does not rewrite an old snapshot.
