# Execution Plan Preview canon

Canonical current law for the read-only production-plan preview.
Runtime wins if this document disagrees.

## Permanent separation

```text
Confirmed Product Truth
  → ProductAggregate
    → Process Composition
      → Execution Plan Preview

Accepted Production Snapshot
  → ExecutionPlan
    → ExecutionTasks
```

The preview consumes current confirmed Product Truth because it is deterministic and non-persistent.
Persisted Execution must consume an Accepted Production Snapshot or commercial Production Release, not live mutable configuration.
After a persisted plan exists, the preview remains an estimate. It is not a second plan.
Operator wording: **Previzualizare producție** — estimare orientativă, nu planul de execuție.
See `docs/architecture/ACCEPTED_PRODUCTION_SNAPSHOT_CANON.md`.

## What this is

A production-facing projection:

- what work exists
- what depends on what
- what capability is required
- which providers are eligible
- which known quantities/resources accompany the work

## What this is not

Not a persisted ExecutionPlan.
Not ExecutionTask, MachineRun, assignment, schedule, or capacity.
Not cost authority. EIC remains the internal-cost sum.
Not a second process route.

## Identity

Preview operation IDs reuse composition node IDs.
They are preview identities only. They are not future frozen task IDs.
Same confirmed truth → same preview IDs and display sequence.

## Dependencies

Dependencies come from process composition.
Display sequence is a deterministic topological projection of that DAG.
Independent operations stay independent.

## Providers

```text
OperationalProcess
  → required Capability
    → provider registry
      → eligible providers
```

Eligible ≠ assigned.
Missing providers stay honest. They do not invent stations and do not delete the operation.

## Quantities

ProductAggregate and existing recipes supply quantities.
Preview does not recalculate geometry or Lighting.

## Administration

No Execution write path.
No Start / Complete actions.
No new persistence schema.
