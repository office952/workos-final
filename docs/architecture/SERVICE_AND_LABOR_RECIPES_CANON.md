# Service and Labor Recipes canon

Canonical current law for reusable internal-cost recipes.
Runtime wins if this document disagrees.
This is not a price list.

## Permanent separation

```text
OPERATIONAL PROCESS
  → technological HOW
RECIPE
  → how a process creates internal cost from a technical quantity
RESOURCE / COST EVIDENCE
  → WHAT is consumed and the active internal rate
EIC
  → sums resolved internal-cost requirements
MACHINE / WORKCENTER
  → provider identity, not money
PEOPLE
  → later who is qualified
COMMERCIAL
  → later customer price
```

Do not collapse these layers.

A Recipe is not a Resource. Vinyl material ≠ vinyl application labor.
A Recipe is not a Process. The process does not own rate, currency, or formula.
A Recipe is not a Machine. No `hourlyRate` on equipment.

## Kinds

- `SERVICE` — production service cost, typically machine or workstation work
- `LABOR` — manual / human-skill internal cost

Vinyl application is labor, not a second material cost.

## Current live catalog

Typed registry is the authority. No write path.

LETTERS functional V1 recipes consume ProductAggregate quantities. They do not recalculate geometry.

Service recipes:

- `RCP_PROFILE_FORMING` — `FORM_ALUMINIUM_PROFILE` — volume perimeter (m) — existing `return_cant_forming`
- `RCP_CNC_FACE` / `RCP_CNC_BACK` — `CUT_SHEET_CNC` scoped FACE / BACK — volume perimeter (m)
- `RCP_PLACE_LED_MODULES` — `PLACE_LED_MODULES` — LED module quantity (buc)
- `RCP_ELECTRICAL_FINISH` — `WIRE_LIGHTING` + `INSTALL_OR_CONNECT_PSU` + `TEST_LIGHTING_IGNITION` — 1 product
- `RCP_PAINT_RAL` — `PAINT_RAL` when painted — volume perimeter (m)
- `RCP_PACK_PRODUCT` — `PACK_PRODUCT` — face area (m²)

Labor recipes:

- `RCP_VINYL_FACE_LABOR` / `RCP_VINYL_VOLUME_LABOR` — `APPLY_SURFACE_FINISH` scoped FACE / VOLUME
- `RCP_BOND_LETTER_BODY` — `BOND_LETTER_BODY` — volume perimeter (m)
- `RCP_CLOSE_LETTER_BODY` — `CLOSE_LETTER_BODY` — volume perimeter (m)

Quantity is consumed, not invented. Volume / FACE / Lighting calculation remain the geometry authority.

Unrelated shop-floor operations stay without recipes: welding, print, lamination, plotter, laser, styro, metal cutting.
QC inspection has no cost recipe. Legacy treated it as internal-only / 0 EUR.

## Completeness vs providers

Recipe completeness and provider coverage are independent.

A Machine may exist while its process recipe is missing.
A process may later have a recipe while no provider exists.

## EIC

EIC may consume a resolved recipe only when the process is required, quantity exists, the recipe is canonical, and cost evidence is active.

EIC is generic. When process composition is supplied, it merges recipe requirements with component resource requirements.
The forming recipe reuses the same `return_cant_forming` evidence. It does not add a second line.
Canonical none/none fixture: 595.00 EUR PARTIAL. Analyzer geometry remains the honest PARTIAL reason.
Final workshop calibration is later. Development rates are replaceable cost evidence, not OWNER_CONFIRMED.

## Boundaries

No machine-hour default. No employee wage. No People/Pontaj. No Commercial price. No recipe CRUD. No capacity or Execution.
