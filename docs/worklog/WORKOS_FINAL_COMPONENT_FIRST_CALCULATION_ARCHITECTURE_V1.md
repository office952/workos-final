# WORKOS_FINAL_COMPONENT_FIRST_CALCULATION_ARCHITECTURE_V1

Current correction: LED pitch and PSU reserve are canonical `LIGHTING_FRONT_LED` technical settings. Lighting calculation is PARTIAL. See `docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md` and `docs/worklog/WORKOS_FINAL_LIGHTING_COMPLETION_V1.md`.

TASK = Realign first canonical product to reusable component-first calculation

BASELINE = ecaf70f8c0bb58e59f2dc8eb3b35a8f433333cc0

## Ownership problem

`compileAggregate()` owned FACE / RETURN_CANT / BACK quantity formulas.
`resourceRequirements()` owned FACE / RETURN_CANT / BACK resource mappings.
`compileEic()` hardcoded `["FACE", "RETURN_CANT", "BACK", "LIGHTING"]`.
`back.ts` was only `BACK_COMPONENT_ID`.

## Component contract

Minimal typed contract, no plugin/DI/DSL:

```text
collectMeasurements(values)
calculate({ values, measurements, shared })
→ status, quantities, requirements, unavailable
```

Variants (role + material contract, not mega-if):

```text
FACE_PLEXIGLAS_3MM
VOLUME_ALUMINIUM_06
BACK_FOREX_10MM
LIGHTING_FRONT_LED
```

ProductTemplate composes variants and may map FACE area → BACK input.
ProductAggregate orchestrates. EIC consumes generic requirements + component statuses.

## FACE

Independent: 250000 mm² → 0.25 m² → Plexiglas 3 mm.

## VOLUME

Renamed from RETURN_CANT. Independent: 12500 mm → 12.5 m → profile + forming.
One conversion path: `volumeLinearMeters` → `linearMetersFromMm`.

## BACK

Owns supplied-area → quantity → Forex. Does not assume FACE globally.
This product maps FACE confirmed area into BACK shared input.

## LIGHTING

Real contract. Status UNAVAILABLE. Reasons: LED pitch unresolved, PSU reserve unresolved.
No 0 quantities. No pitch/PSU formula.

## RETURN_CANT → VOLUME

| Kind | Action |
|---|---|
| Component ID | RETURN_CANT → VOLUME |
| Operator label | Cant → Volum |
| Quantity label | Lungime cant → Lungime volum |
| Field paths | returnCant.* → volume.* |
| Form section | Cant → Volum |
| Resource IDs | retained: `aluminium_return_profile`, `return_cant_forming` |
| Resource labels | Profil/Formare volum |
| Files | `returnCant.ts` deleted; `volume.ts` owns calculation |
| Historical worklogs | left as history |

No transitional alias in active code. No external consumer required RETURN_CANT.

## EIC

Generic: requirements × CostEvidence. Completeness from `componentStatuses`.
Canonical product total still **320.50 EUR PARTIAL**. Line order now follows composition (FACE, VOLUME, BACK).

## Reuse proof

Same `FACE_PLEXIGLAS_3MM` contract invoked independently and from the product.
Test-only FACE+VOLUME composition compiles without changing component formulas.

## UI

Naming only. Screenshots:

- `docs/worklog/screenshots/component-first-catalog.png`
- `docs/worklog/screenshots/component-first-configure.png`
- `docs/worklog/screenshots/component-first-review.png`
- `docs/worklog/screenshots/component-first-confirm.png`

## Limitations

- LIGHTING still blocked on owner pitch/reserve decision.
- CNC not implemented.
- `return_cant_forming` resource id retained as identity.
- Review page still stacks form + summary (no redesign).
