# Accepted Production Snapshot canon

Canonical current law for the frozen technical production snapshot.
Runtime wins if this document disagrees.

## Permanent separation

```text
Confirmed Product Truth
  → ProductAggregate
  → Process Composition
  → Execution Plan Preview          live, read-only

Accepted Production Snapshot        frozen, persisted
  → ExecutionPlan
    → ExecutionTasks
```

Confirmation validates truth.
Acceptance freezes production truth.
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
Not an ExecutionPlan or ExecutionTask by itself.
Not machine / people assignment.
Not a workflow engine.

## Identity

`snapshotId = aps:{productCode}:{contentHash}`

Content hash is SHA-256 of the canonical accepted content.
It excludes `snapshotId`, `createdAt`, and `sourceConfirmedAt`.
Same accepted configuration → same snapshot. A second accept returns the existing row.

A correction creates a new snapshot. There is no update endpoint.

## Providers

The snapshot freezes the required capability.
It does not assign a Machine or Workcenter.
Provider eligibility stays a live concern until Execution materialization.

## Cost

The snapshot stores the accepted EIC reference and the rates used that day.
Canonical none/none remains 595.00 EUR PARTIAL because Analyzer provenance is still missing.
Calibration later does not rewrite an old snapshot.
