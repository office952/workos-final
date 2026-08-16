# LETTERS minimal execution actuals V1

Complete now records what the operator confirmed, not only a status change.

## Contract

```text
planned quantity  ≠  completed quantity
```

Frozen planned quantities stay on the task. Completed quantity, unit, outcome and optional note are separate execution facts.

Outcomes: `COMPLETED_AS_PLANNED` | `COMPLETED_WITH_VARIANCE`. Exact comparison. Variance does not block Complete, reprice EIC, or mutate the snapshot.

One measurable quantity is accepted only when the task has exactly one useful frozen planned quantity (CNC metres, LED module count, forming metres, vinyl/pack area, assembly length). Electrical-finish PRODUCT_UNIT 1 buc and inspection-like tasks take outcome + timestamp + optional note. No invented `1 buc`.

## Outside this build

Inventory deduction, actual costing, labor time, machine runtime, scrap, rework, People, scheduling, capacity. No fabricated QC / PACKAGING providers.
