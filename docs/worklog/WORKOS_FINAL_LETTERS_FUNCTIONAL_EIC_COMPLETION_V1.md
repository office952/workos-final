# WORKOS_FINAL_LETTERS_FUNCTIONAL_EIC_COMPLETION_V1

Baseline: `98ba7ffe17d0bbe9ec2fdd2e2fcb77c0280f4e88`

Close the LETTERS internal-cost vertical. Not a new architecture phase. Not final workshop calibration.

## Cost gap before

Canonical none/none fixture was 403.00 EUR PARTIAL: materials + forming + Lighting resources only.
Missing functional cost: CNC, bond, close, Lighting labor/service, packing. Vinyl and RAL only when selected.
QC stays without a cost line. Legacy treated inspection as internal-only / 0 EUR.

## Quantity bases

All recipe quantities come from ProductAggregate. Recipes do not recalculate geometry.

| Basis | Aggregate quantity | Used by |
|---|---|---|
| Volume perimeter | `volume_linear` 12.5 m | CNC, forming, bond, close, volume vinyl labor, RAL |
| Face area | `face_area` 0.25 m² | pack, face vinyl material/labor |
| Volume lateral | `volume_lateral` = perimeter × depth | volume vinyl material |
| LED modules | `ledModuleQuantity` 125 buc | place LED |
| Product unit | 1 | electrical finish |

## Development values

Classification: `LEGACY_EVIDENCE` + `DEVELOPMENT_DEFAULT`. Not `OWNER_CONFIRMED`.

| Evidence | Rate | Provenance |
|---|---|---|
| CNC face | 3.00 EUR/m | legacy 1.5 × 2 passes |
| CNC back | 4.50 EUR/m | legacy 1.5 × 3 passes |
| Bond | 5.00 EUR/m | legacy face–volume labor |
| Close | 2.00 EUR/m | development default; legacy had no internal close rate |
| Place LED | 0.05 EUR/buc | not the 0.50 module material |
| Electrical finish | 2.00 EUR/product | wire + PSU + ignition |
| Pack | 10.00 EUR/m² | face area |
| Vinyl material | 9.00 EUR/m² | Oracal 651 |
| Vinyl face labor | 5.00 EUR/m² | not the film |
| Vinyl volume labor | 1.00 EUR/m | not the film |
| Paint RAL | 4.00 EUR/m | only when painted |

## EIC

none/none: 595.00 EUR PARTIAL
vinyl face / volume none: 598.50 EUR PARTIAL
none / painted: 645.00 EUR PARTIAL

Lighting resources stay 82.50 EUR on the current fixture.
Forming is not double-counted.
PARTIAL reason: Geometrie din Analyzer. Do not fake COMPLETE.

## Deferred to final calibration

CNC pass rates, labor rates, paint, pack, vinyl film, close-body rate, machine efficiency, payroll, timing, capacity, People, Execution.

## Not done

Unrelated shop-floor recipes. QC cost. Capacity. People. ExecutionPlan. Commercial.
