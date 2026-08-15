# WORKOS_FINAL_REAL_SHOPFLOOR_OPERATIONAL_PROCESS_COMPLETION_V1

Baseline: `59a211d28f0c1662895ea5df10566054ce727539`

## Purpose

Complete the reusable Operational Process catalog for already-mapped real shop-floor equipment, before filling recipe or rate coverage.

## Law preserved

```text
Workcenter → Machine → Capability → Operational Process → Recipe → Cost → EIC
```

Recipes were not attached to Machines. Letters composition was not expanded. No prices were added.

## New catalog processes

These are catalog-only. `applicableTypeIds` is empty. They are not Letters demand.

| Process | Capability | Derived provider |
|---|---|---|
| `WELD_STEEL_JOIN` | `WELD_STEEL` | `MCH-WELD-STEEL` |
| `WELD_ALUMINIUM_JOIN` | `WELD_ALUMINIUM` | `MCH-WELD-ALU` |
| `CUT_METAL_STOCK` | `METAL_CUTTING` | `MCH-METAL-CUTTER-AUTO` |
| `PRINT_WIDE_FORMAT` | `PRINTING` | `MCH-EPSON-60800` |
| `LAMINATE_WIDE_FORMAT` | `LAMINATION` | `MCH-LAMINATOR-XPRO` |
| `LAMINATE_RIGID_PLATE` | `RIGID_FILM_LAMINATION` | `MCH-RIGID-FILM-LAMINATOR` |
| `CUT_CONTOUR_PLOTTER` | `PLOTTER_CUTTING` | `MCH-CUTTER-PLOTTER` |
| `CUT_LASER_SHEET` | `LASER_CUTTING` | `MCH-LASER-CNC` |
| `CUT_STYROFOAM` | `STYRO_CUTTING` | `MCH-STYRO-CUTTER` |

Steel and aluminium welding stay distinct. Plotter cutting is not vinyl application. Roll lamination is not rigid-plate film application. `CUT_SHEET_CNC` and `FORM_ALUMINIUM_PROFILE` / `RCP_PROFILE_FORMING` were not duplicated.

## Recipe state

New processes project `SERVICE_RECIPE_MISSING`. No fake recipe rows. `RCP_PROFILE_FORMING` unchanged.

## Letters / EIC

Letters process composition unchanged. EIC remains `320.50 EUR PARTIAL`. Lighting remains PARTIAL.

Painting, QC and packing still have processes and still lack dedicated physical stations. Those provider gaps were not fabricated.
