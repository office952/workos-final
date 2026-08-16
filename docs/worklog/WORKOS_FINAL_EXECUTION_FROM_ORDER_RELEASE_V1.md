# Execution from Order Release V1

Connects the existing ExecutionPlan / ExecutionTask machinery to the commercial Production Release created from Order.

## Decision

Reuse `materializeExecutionPlanFromSnapshot` and the existing snapshot → execution-plan route.
Do not invent a second planner, task model, or production snapshot family.

```text
Order Snapshot
  → Production Release Snapshot
  → Creează planul de execuție
  → ExecutionPlan / ExecutionTasks
```

Release stays authorization. Plan creation stays a separate operator action.

## Law

Commercial plans accept only a persisted ORDER-sourced Release with valid Order provenance.
`sourceSnapshotId` / `sourceSnapshotHash` point at the Release.
No live Product Truth, process recomposition, EIC recompile, or Commercial reprice.

One Release → one ExecutionPlan. Retry returns the existing plan.
Plan creation starts 0 tasks and causes 0 inventory movements.

## UI

After **Eliberată pentru producție**: **Creează planul de execuție**.
After creation: **Plan de execuție creat** and the existing Execution workspace.
**Previzualizare producție** remains an estimate, not a second plan.
**Acceptă pentru producție** remains only Atelier / test tehnic when no Order exists.

## Golden

60 mm none/none keeps Quote/Order 624.82 and Release EIC 382.50.
The commercial plan has 12 PLANNED tasks and does not start work.
QC, illumination uniformity, and packing remain honest no-provider gaps.
