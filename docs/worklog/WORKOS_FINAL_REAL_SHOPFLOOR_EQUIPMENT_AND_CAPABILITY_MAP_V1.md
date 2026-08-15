# WORKOS_FINAL_REAL_SHOPFLOOR_EQUIPMENT_AND_CAPABILITY_MAP_V1

Baseline: `9019e2a2ed4131ffba5113faffdeffe70a18214c`

## Purpose

Recover the real shop-floor map without recreating the already accepted assembly tables and without copying legacy architecture.

```text
Workcenter → Machine → Capability → Operational Process → Resource / Labor / Service Recipe
```

## Existing accepted truth preserved

| ID | Label | Lifecycle | Capability |
|---|---|---|---|
| `WC_ASSEMBLY_01` | Masă asamblare 1 | ACTIVE | `MANUAL_ASSEMBLY` |
| `WC_ASSEMBLY_02` | Masă asamblare 2 | ACTIVE | `MANUAL_ASSEMBLY` |

No generic `WC_ASSEMBLY`. No extra capabilities on the assembly tables.

## Classification rule

Owner confirmed that genuine legacy workshop machines/stations physically exist. That confirmation is existence only.

| Class | Migrated as asset? |
|---|---|
| `REAL_MACHINE` / `REAL_WORKCENTER` | Yes, after semantic normalization |
| `ROUTING_CODE` / `RATE_CODE` / `SERVICE_CODE` / `PROCESS_CODE` | No |
| `TEST_FIXTURE` / `MOCK_ONLY` / `DUPLICATE_ALIAS` | No |

## Live topology after this build

12 Workcenters, 11 Machines.

Welding: `WC_WELDING` + `MCH-WELD-STEEL` (`WELD_STEEL`) + `MCH-WELD-ALU` (`WELD_ALUMINIUM`).
`WA-WELD-TABLE` is the Workcenter, not a third Machine.

Metal cutting: `WC_METAL_CUTTING` + `MCH-METAL-CUTTER-AUTO`. Legacy catch-all `WC_METAL_FAB` was split, not imported.

CNC: `WC_CNC_ROUTING` + `MCH-CNC-4020` (`CNC_ROUTING`) + `MCH-STYRO-CUTTER` (`STYRO_CUTTING`).

Forming: `WC_LETTER_FORMING` + `MCH-CNC-CANT-LITERE` (`PROFILE_FORMING`).

Electrical: `WC_LED_ASSEMBLY` provides `ELECTRICAL_ASSEMBLY` without a fake Machine.

Vinyl: `WC_VINYL_APPLICATION` provides `VINYL_APPLICATION`. `MCH-RIGID-FILM-LAMINATOR` provides `RIGID_FILM_LAMINATION` only.

Print / laminate / plotter / laser are live Machines on their own Workcenters.

Not migrated: painting booth, QC station, packing station, field installation, rate codes (`CNC_ROUTER`, `PAINTING`, `PACKAGING`, `LED_ASSEMBLY`, `WELDING_BANNER`), routing aliases (`WC_PAINT`, `WC_PACK`, `WC_QC`, `WC_OUTPUT`, `WC_ASSEMBLY`), test fixtures (`CNC-ALPHA`, `MCH-CNC-01`, `CNC-1`).

## Letters coverage

Before: `MANUAL_ASSEMBLY` COVERED; 7 missing.

After, caused by real providers of already-required capabilities:

| Capability | After | Provider |
|---|---|---|
| `MANUAL_ASSEMBLY` | COVERED | `WC_ASSEMBLY_01`, `WC_ASSEMBLY_02` |
| `CNC_ROUTING` | COVERED | `MCH-CNC-4020` |
| `PROFILE_FORMING` | COVERED | `MCH-CNC-CANT-LITERE` |
| `VINYL_APPLICATION` | COVERED | `WC_VINYL_APPLICATION` |
| `ELECTRICAL_ASSEMBLY` | COVERED | `WC_LED_ASSEMBLY` |
| `PAINTING` | NO_PROVIDER | none |
| `QUALITY_CONTROL` | NO_PROVIDER | none |
| `PACKAGING` | NO_PROVIDER | none |

Welding, metal cutting, print, lamination, laser, styro, plotter, and rigid-film lamination did not become Letters requirements.

## Recipe / cost gaps

Read-only. No prices added.

`FORM_ALUMINIUM_PROFILE` = `CANONICAL_COST_EXISTS` via `return_cant_forming`.
CNC and other machine processes = `SERVICE_RECIPE_MISSING`.
Manual / vinyl / QC = `LABOR_RECIPE_MISSING`.
Welding and other new capabilities without Operational Processes = `NOT_APPLICABLE`.

## Boundaries kept

Capacity, People, Execution, machine-hour rates, ProductTemplate machine selection, and Letters demand contamination remain out.

## Screenshots

See `docs/worklog/screenshots/workcenters-*.png` from the real `/admin/workcenters` path.
