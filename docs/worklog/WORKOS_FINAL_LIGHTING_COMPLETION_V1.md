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

| Fact | Classification | Evidence |
|---|---|---|
| LED pitch = 100 mm | OWNER_CONFIRMED / CURRENT_CANON | Current technical setting |
| PSU reserve = 25% | OWNER_CONFIRMED / CURRENT_CANON | This GO |
| Legacy PSU reserve 15 / 30 | REJECTED_LEGACY | Superseded by owner 25% |
| Other legacy pitch values | REJECTED_LEGACY | Superseded by owner 100 mm |
| Pitch applies to perimeter / 100 | NOT PROVEN / MISSING | Current setting text is “approximate distance between modules”; no confirmed geometric basis |
| LED watts / module | MISSING | No canonical resource specification |
| LED module SKU / brand / cost | MISSING | Do not invent |
| PSU catalog 60/100/150/200 W | MISSING | No canonical PSU resource |
| PSU count / model selection | MISSING | Capacity ≠ selection |
| Confirmed face area / volume perimeter | CURRENT_CANON | Existing intake measurements; not authorized as LED geometry |

Do not treat old WorkOS formulas as correct. Current owner truth wins for pitch and reserve.

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

Only if a materially correct Lighting quantity/load is required next:

1. Geometric basis for LED module quantity
2. LED module wattage / resource identity
3. PSU catalog / selection policy

Technical-settings write/versioning remains NOT_IMPLEMENTED.

## Forbidden scope held

No settings persistence/write/versioning. No Workcenters, Machines, Execution, People, Pontaj, Inventory, Commercial, Analyzer, second product, or invented LED/PSU SKUs or costs.
