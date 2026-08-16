# Execution Plan and Tasks canon

Canonical current law for persisted planned production work and the first executable task lifecycle.
Runtime wins if this document disagrees.

## Permanent separation

```text
AcceptedProductionSnapshot
  → ExecutionPlan
  → ExecutionTasks
```

Persisted Execution consumes only the frozen snapshot.
It does not reread ProductTemplate, current settings, current recipe rates, or regenerate process composition.

## Frozen vs live vs assigned

```text
Frozen:     required capability, quantities, resources, dependencies
Live:       eligible-provider projection
Assigned:   persisted operator choice of one eligible provider
Lifecycle:  PLANNED → IN_PROGRESS → COMPLETED
```

Eligible providers may change. That must not silently change a persisted assignment.

## Identity

`planId = exp:{snapshotId}`
`taskId = task:{planId}:{sourceOperationId}`

Same snapshot → same plan. Preview IDs are not task IDs.

## Provider assignment

Assignment persists `assignedProvider` (`id`, `kind`, `label`) only after an explicit operator action.

Backend validates the provider against the task's frozen `requiredCapabilityId` and the current eligible-provider registry.

Do not assign a random provider, a provider from another capability, or a fabricated station.

Reassignment is allowed while the task is `PLANNED`. After `IN_PROGRESS`, reassignment is rejected.

If no eligible provider exists, the task stays unassigned. The plan still exists.

## Start and complete

A task may Start only if:

- status is `PLANNED`
- every persisted dependency task is `COMPLETED`
- an assigned provider exists and is still eligible for the frozen capability

Root tasks (no dependencies) may Start once assigned. SEQ is display order, not a start gate.

On Start: `PLANNED → IN_PROGRESS` and server `startedAt`.

A task may Complete only if status is `IN_PROGRESS`.

On Complete: `IN_PROGRESS → COMPLETED`, server `completedAt`, and minimal completion evidence.

```text
planned quantity  ≠  completed quantity
```

Frozen planned quantities stay on the task. Completed quantity is a separate execution fact.

When the task has exactly one measurable planned quantity, Complete requires `completedQuantity`. The unit comes from that frozen quantity, never from the frontend. Outcome is derived by exact comparison:

```text
actual == planned  →  COMPLETED_AS_PLANNED
actual != planned  →  COMPLETED_WITH_VARIANCE
```

When there is no single useful quantity, Complete records outcome + timestamp + optional note. Do not invent `1 buc`.

Electrical-finish operations (`Cablare`, `Pregătire sursă`, `Probă aprindere`) carry a frozen PRODUCT_UNIT recipe quantity of 1 buc. That is cost-recipe identity, not a useful operator-confirmed production count. Inspection-like operations have no quantity. All of these complete without a numeric actual.

Variance does not block Complete, reopen the snapshot, reprice EIC, or keep the task `IN_PROGRESS`. `COMPLETED_WITH_VARIANCE` is still `COMPLETED`.

A completed task cannot be completed again. Completion evidence is immutable in V1.

Completing a task does not reprice EIC, mutate the snapshot, consume inventory, or change frozen quantities.

## Plan progress

The plan row stays `PLANNED`. UI progress is derived from tasks:

```text
total / completed / inProgress / planned
waitingDependencies
noProvider
varianceCount
```

Derived status:

```text
all PLANNED → Planificat
any started or mixed → În lucru
all COMPLETED → Finalizat
```

A plan is Finalizat only when every task is COMPLETED.
Executable work finishing while QC / pack remain without provider keeps the plan În lucru.

## LETTERS none/none coverage

Canonical WORKOS none/none has 12 tasks.

Currently executable with the live registry:

```text
FACE CNC, BACK CNC          → CNC 4020
VOLUME forming              → CNC Cant Litere
PLACE LED, WIRE, PSU, IGNITION → Montaj LED / electric
BOND, CLOSE                 → Masă asamblare 1 or 2
```

Honest current gaps, no fabricated stations:

```text
Probă uniformitate     QUALITY_CONTROL  NO_PROVIDER
Control calitate final QUALITY_CONTROL  NO_PROVIDER
Ambalare               PACKAGING        NO_PROVIDER
```

Reachable end state: 9 completed, 3 planned, plan remains În lucru.

## Completion evidence V1

Persisted on the task row, not a separate actuals table:

```text
completion_outcome
completed_quantity
completed_quantity_unit
completion_note
completed_at
```

Optional note is free text, max 280 characters. It is not parsed.

One measurable quantity is exposed only when `quantities.length === 1`. Multiple frozen resources do not get a generic actual-resource form in this V1.

## What this is not

Not People / employee assignment.
Not scheduling, capacity, pause/cancel, inventory deduction, or actual cost.
Not labor time, machine runtime, scrap, or rework.
Not a generic actuals engine or workflow engine.
