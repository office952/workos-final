# LETTERS minimal task execution V1

Provider assignment plus `PLANNED → IN_PROGRESS → COMPLETED` on persisted ExecutionTasks.

## What landed

An operator can assign one eligible Machine/Workcenter, Start a ready task, and Complete it.

Assignment is validated against the frozen required capability and the live eligible-provider registry. Reassignment is allowed only before Start. Dependencies gate Start from persisted task IDs, not SEQ.

Start and Complete store server timestamps. They do not change snapshot quantities, resources, recipes, or EIC.

Plan progress is derived from tasks. The plan row stays `PLANNED`.

QC / packing stay honest: no provider, no fake assignment, no Start.

## Proof

Canonical LETTERS none/none: BACK CNC → CNC 4020 → Start → Complete. Lighting then becomes startable after assignment. Assembly offers both tables. No-provider tasks remain unassigned.

## Outside this build

People, scheduling, capacity, pause/cancel, actual quantities, and actual cost.
