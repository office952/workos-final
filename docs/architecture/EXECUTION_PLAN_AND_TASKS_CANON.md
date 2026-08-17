# Execution Plan and Tasks canon

Canonical current law for persisted planned production work and the first executable task lifecycle.
Runtime wins if this document disagrees.

## Permanent separation

```text
Pilot:
AcceptedProductionSnapshot
  → ExecutionPlan
  → ExecutionTasks

Commercial:
Production Release Snapshot (ORDER-sourced APS)
  → ExecutionPlan
  → ExecutionTasks
```

One ExecutionPlan / ExecutionTask model. Source differs. Downstream assignment, start, complete, actuals, and inventory do not.

The operator surface is the generic job workspace `/execution/:planId`.
It is a projection and control surface over the persisted plan. It is not a second source of truth, not a dashboard, and not a LETTERS-specific page.

Commercial plans may be created only from a persisted Production Release whose `releaseSource = ORDER` and whose Order provenance is valid.
`sourceSnapshotId` / `sourceSnapshotHash` point at that Release. Upstream Order → Acceptance → Quote is transitive through the Release.

Persisted Execution consumes only the frozen snapshot.
It does not reread ProductTemplate, current settings, current recipe rates, Commercial policy, or regenerate process composition.
Plan creation does not assign, start, complete, or move inventory.

## Frozen vs live vs assigned

```text
Frozen:     required capability, quantities, resources, dependencies
Live:       eligible-provider projection
Assigned:   persisted operator choice of one eligible provider and one ACTIVE person
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

## Executor assignment

A task may have `assignedProvider` and `assignedExecutor` independently.

```text
Provider  = Machine / Workcenter that can perform the required capability
Person    = human executor / operator
```

Assignment persists `assignedExecutor` (`id`, `label`) only after an explicit operator action.

Backend validates the person against the People registry. Only `ACTIVE` people may be newly assigned. Unknown and `RETIRED` people are rejected.

Reassignment is allowed while the task is `PLANNED`. After `IN_PROGRESS`, executor reassignment is rejected.

People cannot substitute a missing capability provider. A QC or Packaging task with an executor and no eligible provider still cannot Start.

Preview, snapshot and plan materialization do not require People.

## Start and complete

A task may Start only if:

- status is `PLANNED`
- every persisted dependency task is `COMPLETED`
- an assigned provider exists and is still eligible for the frozen capability
- an assigned executor exists and is still `ACTIVE`

Root tasks (no dependencies) may Start once assigned. SEQ is display order, not a start gate.

On Start: `PLANNED → IN_PROGRESS`, server `startedAt`, and freeze of the then-current executor display label on the task. The persisted `personId` stays the identity. Later rename or retirement does not erase historical attribution. A retired person may still Complete a task already started.

A task may Complete only if status is `IN_PROGRESS`.

On Complete: `IN_PROGRESS → COMPLETED`, server `completedAt`, minimal completion evidence, and optional actual resource consumption.

```text
planned quantity  ≠  completed quantity
planned resource  ≠  actual consumption
```

Frozen planned quantities and frozen `resourceDemands` stay on the task. Completed quantity and actual consumption are separate execution facts.

When the task has exactly one measurable planned quantity, Complete requires `completedQuantity`. The unit comes from that frozen quantity, never from the frontend. Outcome is derived by exact comparison:

```text
actual == planned  →  COMPLETED_AS_PLANNED
actual != planned  →  COMPLETED_WITH_VARIANCE
```

When there is no single useful quantity, Complete records outcome + timestamp + optional note. Do not invent `1 buc`.

Electrical-finish operations (`Cablare`, `Pregătire sursă`, `Probă aprindere`) carry a frozen PRODUCT_UNIT recipe quantity of 1 buc. That is cost-recipe identity, not a useful operator-confirmed production count. Inspection-like operations have no quantity. All of these complete without a numeric actual.

Variance does not block Complete, reopen the snapshot, reprice EIC, or keep the task `IN_PROGRESS`. `COMPLETED_WITH_VARIANCE` is still `COMPLETED`.

A completed task cannot be completed again. Completion evidence and actual consumption are immutable in V1. The first Complete wins, including an empty actuals set.

Completing a task does not reprice EIC, mutate the snapshot, or change frozen planned quantities. If actual consumption includes a stockable material, Inventory appends exactly one OUT movement in the same transaction.

## Plan progress

The plan row stays `PLANNED`. UI progress is derived from tasks:

```text
total / completed / inProgress / planned
waitingDependencies
noProvider
noExecutor
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

Process output stays on the task row:

```text
completion_outcome
completed_quantity
completed_quantity_unit
completion_note
completed_at
```

Optional note is free text, max 280 characters. It is not parsed.

One measurable quantity is exposed only when `quantities.length === 1`. That is process output (CNC metres, LED count), not material consumption.

## Actual resource consumption V1

Actual consumption belongs to the executed `ExecutionTask`. It is recorded only as part of Complete, only from `IN_PROGRESS`.

```text
ExecutionTask
  → execution_task_actual_consumption
```

Each row is one canonical planned resource actually used:

```text
entry_id = act:{taskId}:{resourceId}
task_id
plan_id
resource_id          frozen planned identity
resource_label       frozen display
actual_quantity
unit                 frozen planned unit
recorded_at
note                 optional
```

V1 rules:

- Only identities already present on the task's frozen `resourceDemands` may be recorded.
- Unit comes from that frozen demand. The client does not own the unit. No conversion.
- Quantity must be a finite number `>= 0`.
- Actual lines are optional. Empty Complete is honest `Fără consum înregistrat`.
- Planned quantity is never copied into actual without an explicit operator value.
- Tasks with no planned resources reject any actuals payload and show no material form.
- Plexiglas / other aggregate materials are not invented onto a task that does not already carry them.

This is quantity reality for Inventory and for Actual Internal Cost. Inventory consumes the immutable actual entry and may append one OUT movement. Actual Internal Cost multiplies that quantity by the frozen snapshot rate. Execution does not own stock balance, reservation, or commercial reprice.

## Actual internal cost

Planned EIC and actual internal cost stay separate.

```text
actual consumption quantity
× frozen snapshot EIC rate
= actual internal cost line
```

No completedQuantity proxy. No Start→Complete duration. No live catalog rate after accept. Missing contributors stay UNAVAILABLE, never 0. Job status is usually PARTIAL.

Read path: the existing plan/task view. Write path: `POST /api/execution-tasks/:taskId/complete`. No generic actuals CRUD.

## Historical attribution

Completed tasks show `Executant: <frozen label>`. That is the assigned executor, not an authenticated user who clicked Complete. This build has no auth system.

## What this is not

Not HR, Pontaj, payroll, skills, availability, or scheduling.
Not automatic executor assignment.
Not a substitute for missing QC / pack providers.
Not reservation, purchasing, valuation, payroll, or Commercial. Stock movements are owned by Inventory. Actual internal cost is a read projection, not a second cost engine.
Not labor time, machine runtime, scrap, or rework.
Not a generic actuals engine, correction workflow, or second material catalog.
