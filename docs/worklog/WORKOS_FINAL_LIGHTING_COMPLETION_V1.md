# WORKOS_FINAL_LIGHTING_COMPLETION_V1

## Baseline

- Repo: `office952/workos-final`
- Branch: `main`
- Expected baseline: `df24c9e4db976127b0f518b94630528546465277`

## Owner PSU decision

`psuReservePercent = 25`

- OWNER_CONFIRMED
- CONFIGURABLE technical setting on `LIGHTING_FRONT_LED`
- unit = percent
- not hardcoded in the Lighting calculator
- not an Intake / order field
- not a commercial rule

The calculator receives the active setting. A test fixture of 30% changes required PSU capacity from 125 W to 130 W for a 100 W load without changing calculator code. 30% is not runtime truth.

## Legacy Lighting audit

Read-only recovery after implementation, from current WorkOS Final plus `office952/workos-vscode` / `C:\w\psiso`. No legacy code copied. No catalog rows added. No EIC change.

| Fact | Classification | Evidence |
|---|---|---|
| LED pitch = 100 mm | OWNER_CONFIRMED / CURRENT_CANON | Current technical setting |
| PSU reserve = 25% | OWNER_CONFIRMED / CURRENT_CANON | This GO |
| Legacy PSU reserve 15% (V2) / 30% (V3–V6) | REJECTED_LEGACY | Superseded by owner 25% |
| Legacy pitch 250 mm (V4/V6 Intake) | REJECTED_LEGACY as active Final value | Superseded by owner 100 mm; remains a formula-basis conflict |
| Legacy letters quantity `ceil(perimeter_m × 1000 / pitch_mm)` | SUPPORTED_LEGACY_EVIDENCE | Multiple V2/V4/V6 paths; pitch applies to exterior letter / LED path, not area |
| Apply that formula in Final from `ledPitchMm` + VOLUME perimeter | NOT PROVEN / REJECTED for this build | Final setting does not name the divisor; 100 vs 250 never settled; prior Final worklog rejected a fake pitch heuristic |
| Emblem/casetă `area × 60 / m²` | REJECTED_LEGACY for this product | Separate product family, not volumetric letters |
| `MAT-LED-MODULE` / „Modul LED 12V“ | SUPPORTED_LEGACY_EVIDENCE | Legacy owner identity; not in Final Resources |
| Module watts 0.75 / 1.00 / 1.44 W | CONFLICT | V4 default 0.75 W vs V2 default 1.44 W; no Final setting |
| `MAT-LED-MODULE` cost 0.5 EUR/buc | SUPPORTED_LEGACY_EVIDENCE | Legacy display lock; conflicts with older 1.4 RON/buc fill |
| PSU selector `MAT-LED-PSU-12V` + SKUs 60/100/160/200 W | SUPPORTED_LEGACY_EVIDENCE | Legacy owner catalog; **no 150 W** in production (150 W is mock-only) |
| PSU prices 12 / 16 / 20 / 40 EUR | SUPPORTED_LEGACY_EVIDENCE | Legacy 2026-06-04 lock; not migrated |
| Multi-PSU allocation over `{60,100,160,200}` | SUPPORTED_LEGACY_EVIDENCE | Capacity calculation ≠ selection policy; not adopted |
| Confirmed face area / volume perimeter | CURRENT_CANON | Existing intake measurements; not wired as LED geometry |

Do not treat old WorkOS formulas as correct. Current owner truth wins for pitch (100 mm) and reserve (25%). Legacy LED/PSU identity and cost were reported, not migrated: no silent repricing.

## Calculation contract

Implemented outputs:

- Settings consumed: `ledPitchMm`, `psuReservePercent`
- `requiredPsuCapacityW(load, reservePercent) = load × (1 + reservePercent / 100)`
- Minimum PSU capacity emitted only when LED load is known
- Explicit UNAVAILABLE reasons when geometry, load, or PSU catalog are missing
- No fake zero quantities
- No LED/PSU resource requirements
- No EIC Lighting lines

Golden-path status: **PARTIAL**

Not CALCULATED: module quantity, load, and physical PSU selection are still missing.

## Process impact

Readiness derives from the Lighting calculation result.

| Process | Node readiness | Reason |
|---|---|---|
| PLACE_LED_MODULES | REQUIRED_BLOCKED | Missing confirmed geometric basis for module quantity |
| WIRE_LIGHTING | REQUIRED_INCOMPLETE | Known process; no labor recipe. Cost does not block it. |
| INSTALL_OR_CONNECT_PSU | REQUIRED_BLOCKED | Capacity unknown (no LED load) and physical PSU selection unavailable |
| TEST_LIGHTING_IGNITION | REQUIRED_INCOMPLETE | Known process; no telemetry |
| TEST_ILLUMINATION_UNIFORMITY | REQUIRED_INCOMPLETE | Known process; no instrumental measure |

Overall composition remains BLOCKED. Lighting calculation readiness is PARTIAL. Cost remains PARTIAL (EIC 320.50 EUR). Execution remains NOT_IMPLEMENTED.

## Cleanliness

- HARDCODED_PSU_RESERVE = NONE
- DUPLICATE_PSU_RESERVE_TRUTH = NONE
- LIGHTING_FORMULA_DUPLICATES = NONE
- LED_GEOMETRY_ASSUMPTIONS_WITHOUT_EVIDENCE = NONE
- RESOURCE_IDENTITY_IN_LIGHTING_FORMULA = NONE
- ORDER_CONFIG_TECH_SETTING_LEAK = NONE
- FAKE_ZERO_LIGHTING_OUTPUTS = NONE
- STALE_LIGHTING_BLOCKERS = NONE
- EIC_LIGHTING_PRODUCT_BRANCHES = NONE
- DEAD_LIGHTING_CODE = NONE
- STALE_LIGHTING_DOCS = historical worklogs only

## Remaining owner decisions

Only if a materially correct Lighting quantity/load/cost is required next. Not a questionnaire — three unresolved choices:

1. **Geometric basis for module quantity.** Legacy used exterior letter / LED path perimeter with `ceil(perim_m × 1000 / pitch_mm)`. Final has operator VOLUME perimeter, but not a confirmed Lighting contour, and 100 vs 250 mm was never settled as the divisor rule.
2. **LED module wattage / resource.** Legacy identity `MAT-LED-MODULE` (12V) is clear; default watts (0.75 vs 1.44) and cost (0.5 EUR vs 1.4 RON) are not.
3. **PSU catalog / selection policy.** Legacy concrete tiers are 60/100/160/200 W, not 150 W. Single-PSU vs multi-PSU allocation is a separate policy.

Technical-settings write/versioning remains NOT_IMPLEMENTED.

## Forbidden scope held

No settings persistence/write/versioning. No Workcenters, Machines, Execution, People, Pontaj, Inventory, Commercial, Analyzer, second product, or invented LED/PSU SKUs or costs.
