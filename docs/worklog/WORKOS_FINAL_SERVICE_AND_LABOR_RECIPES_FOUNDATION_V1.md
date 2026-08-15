# WORKOS_FINAL_SERVICE_AND_LABOR_RECIPES_FOUNDATION_V1

Baseline: `db57f1e460849c487ed9bda67cea709fc2e12a8c`

## Purpose

Add the reusable Service / Labor Recipe layer between Operational Process and Resources / Cost, without putting money on Machines and without filling every missing price.

## Live recipe

`RCP_PROFILE_FORMING` → `FORM_ALUMINIUM_PROFILE` → existing `return_cant_forming` evidence.
Quantity basis: volume perimeter (m). Geometry stays on Volume.

## Explicit gaps

CNC and other machine/workstation processes: `SERVICE_RECIPE_MISSING`.
Manual assembly, vinyl, QC: `LABOR_RECIPE_MISSING`.
Welding and other capabilities without a process: `NOT_APPLICABLE`.

Provider coverage is unchanged and independent.

## EIC

Letters EIC remains `320.50 EUR PARTIAL`. The forming recipe reuses the already-consumed service evidence. No second line.

## Admin

`/admin/resources` now inspects Rețete servicii and Rețete manoperă.
Process and workcenter views derive recipe state from the registry, not from inferred resourceIds.
