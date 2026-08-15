# WORKOS_FINAL_LETTERS_LIGHTING_CALCULATION_COMPLETION_V1

## Baseline

- Repo: `office952/workos-final`
- Branch: `main`
- Expected baseline: `00f1769335be67878c281461a05123b54e2f65f9`

## Verdict

Letters Lighting resource calculation is **IMPLEMENTED_CURRENT / functional V1**.

This is a functional golden-path build, not final workshop calibration.
`ledModulePowerW = 0.75` and the LED / PSU cost evidence are current development configuration. They can be calibrated later by changing settings and resource evidence, without rewriting the calculator or the architecture.

## Accepted decisions applied

| Decision | Implementation |
|---|---|
| LED quantity basis | `ceil(volume.confirmedPerimeterMm / ledPitchMm)` |
| Module power | technical setting `ledModulePowerW = 0.75` |
| Module resource | `MAT-LED-MODULE`, buc, 0.50 EUR development evidence |
| PSU catalog | 60 / 100 / 160 / 200 W, 12 V; no 150 W |
| PSU reserve | existing `psuReservePercent = 25` |
| Multi-PSU | min units → min surplus → larger max capacity tie-break, max 6 units |

## Fixture

```text
12500 mm / 100 mm → 125 modules
125 × 0.75 W → 93.75 W
93.75 × 1.25 → 117.1875 W
selection → 1 × MAT-LED-PSU-12V-160W
EIC → 403.00 EUR PARTIAL
```

## Ownership

- LIGHTING owns quantity, load, required capacity and selected PSU demand.
- Resources / Cost owns LED and PSU identity, capacity and cost evidence.
- ProductAggregate consumes the single component evaluation path.
- EIC stays generic over resource demands.
- Process catalog is not redesigned. `PLACE_LED_MODULES` and `INSTALL_OR_CONNECT_PSU` are `KNOWN_PROCESS` and remain incomplete without labor recipes.

## Remaining Letters gaps that still matter

- CNC geometry / CNC price
- Labor and remaining service recipes
- Capacity, People, Execution
- Final workshop calibration of 0.75 W and resource costs
