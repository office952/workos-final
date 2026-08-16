# Execution actual consumption foundation V1

A planned task already knows what it expected to use. After real execution, WorkOS can now record what was actually consumed.

## Contract

```text
planned resource  ≠  actual consumption
```

Actual consumption belongs to the executed `ExecutionTask`. It is recorded only as part of Complete, only from `IN_PROGRESS`. The first Complete freezes both completion evidence and actuals. A second Complete is `alreadyApplied`.

Identity comes from the task's frozen `resourceDemands`. Unit comes from that same frozen demand. No conversion. No free-text materials. No second catalog.

Actual lines are optional. An empty Complete is honest `Fără consum înregistrat`. Planned quantity is never copied into actual without an operator value.

## Persistence

Additive table `execution_task_actual_consumption`. Not a JSON blob. Future Inventory can consume these rows. This slice does not deduct stock.

## API

`POST /api/execution-tasks/:taskId/complete` accepts optional `actualConsumption`. The plan/task view returns the frozen rows. No generic actuals CRUD.

## Outside this build

Inventory ledger, reservation, purchase order, warehouse, actual cost, commercial reprice, EIC mutation, snapshot mutation, correction workflow, QC/Pack provider invention.
