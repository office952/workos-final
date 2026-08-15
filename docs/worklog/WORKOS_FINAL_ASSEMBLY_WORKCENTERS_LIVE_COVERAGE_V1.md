# WorkOS Final — Assembly workcenters live coverage v1

Owner GO: `WORKOS_FINAL_ASSEMBLY_WORKCENTERS_LIVE_COVERAGE_V1`.

## Owner-confirmed truth

| ID | Label | Lifecycle | Capability |
|---|---|---|---|
| `WC_ASSEMBLY_01` | Masă asamblare 1 | ACTIVE | `MANUAL_ASSEMBLY` |
| `WC_ASSEMBLY_02` | Masă asamblare 2 | ACTIVE | `MANUAL_ASSEMBLY` |

These are two large assembly tables / canonical organizational areas. They are not the only physical places in the hall where manual work can occur. Ad-hoc hall space is not modeled.

Capacity, task concurrency, and employee limits are `NOT_MODELED`. No `Infinity` literals.

## Coverage

Before: 8 `NO_PROVIDER`.
After: `MANUAL_ASSEMBLY` = `COVERED` (two providers). Remaining seven capabilities stay `NO_PROVIDER`.

Machines live count: 0.

No generic `WC_ASSEMBLY` row. Legacy `WC_ASSEMBLY` remains historical evidence.

## Boundaries kept out

Electrical, vinyl, QC, packaging, painting assignment. CNC/forming machines. Capacity, scheduling, Execution, People.

## Screenshots

See `docs/worklog/screenshots/workcenters-*.png` from this build, including assembly table details and MANUAL_ASSEMBLY providers.
