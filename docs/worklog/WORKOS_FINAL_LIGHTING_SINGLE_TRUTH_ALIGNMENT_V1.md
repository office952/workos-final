# WORKOS_FINAL_LIGHTING_SINGLE_TRUTH_ALIGNMENT_V1

## Baseline

`78a19cf63ff6190ac4809462ce564baf49e2d5f3`

## Correction

One `evaluateProductComponents()` path now feeds ProductAggregate and Process Composition.

Process Composition no longer calls `lightingFrontLedContract.calculate` with empty `shared`.

`totalLedLoadW` is removed from `SharedCalculationContext`. `requiredPsuCapacityW(load, reserve)` stays as a pure helper.

Governance now splits:

- Fundație calcul iluminare = IMPLEMENTED
- Calcul complet iluminare = PLANNED

Setting `source` for pitch and reserve is `OWNER_CONFIRMED`. User-visible labels unchanged.

Lighting remains PARTIAL. EIC remains 320.50 EUR PARTIAL.
