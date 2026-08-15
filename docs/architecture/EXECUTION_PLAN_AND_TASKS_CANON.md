# Execution Plan and Tasks canon

Canonical current law for persisted planned production work.
Runtime wins if this document disagrees.

## Permanent separation

```text
AcceptedProductionSnapshot
  → ExecutionPlan
    → ExecutionTasks
```

Persisted Execution consumes only the frozen snapshot.
It does not reread ProductTemplate, current settings, current recipe rates, or regenerate process composition.

## Frozen vs live vs future

```text
Frozen:   required capability, quantities, resources, dependencies
Live:     eligible-provider projection
Future:   selected provider + Start/Complete actuals
```

Eligible providers may change. That must not mutate a persisted task.

## What this is

Durable planned work: one task per frozen operation, same dependencies, same display sequence.

Status is `PLANNED` only.

## What this is not

Not task execution.
Not provider assignment.
Not People, scheduling, capacity, or Commercial.
Not cost authority. Snapshot EIC remains the accepted cost reference.

## Identity

`planId = exp:{snapshotId}`
`taskId = task:{planId}:{sourceOperationId}`

Same snapshot → same plan. Preview IDs are not task IDs.
