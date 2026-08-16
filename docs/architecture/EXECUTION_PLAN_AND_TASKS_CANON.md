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

On Complete: `IN_PROGRESS → COMPLETED` and server `completedAt`.

Completing a task does not reprice EIC, mutate the snapshot, consume inventory, or change frozen quantities.

## Plan progress

The plan row stays `PLANNED`. UI progress is derived from tasks:

```text
total / completed / inProgress / planned
waitingDependencies
noProvider
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

## What this is not

Not People / employee assignment.
Not scheduling, capacity, pause/cancel, actual quantities, or actual cost.
Not a generic workflow engine.
