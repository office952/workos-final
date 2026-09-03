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
- `RCP_CNC_SHEET_PANEL` — `CUT_SHEET_CNC` scoped FACE + `ACM_CASSETTE_BODY` — developed blank area (m²)
- `RCP_CUT_METAL_STOCK` — `CUT_METAL_STOCK` — frame perimeter (m)

Labor recipes:

- `RCP_VINYL_FACE_LABOR` / `RCP_VINYL_VOLUME_LABOR` — `APPLY_SURFACE_FINISH` scoped FACE / VOLUME
- `RCP_BOND_LETTER_BODY` — `BOND_LETTER_BODY` — volume perimeter (m)
- `RCP_CLOSE_LETTER_BODY` — `CLOSE_LETTER_BODY` — volume perimeter (m)
- `RCP_FORM_SHEET_CASSETTE` — `FORM_SHEET_CASSETTE` — 1 product
- `RCP_ATTACH_INTERNAL_FRAME` — `ATTACH_INTERNAL_FRAME` — 1 product

Quantity is consumed, not invented. Volume / FACE / Lighting / ACM blank / frame calculation remain the geometry authority.

Unrelated shop-floor operations stay without recipes: welding, print, lamination, plotter, laser, styro.
QC inspection has no cost recipe. Legacy treated it as internal-only / 0 EUR.

## Completeness vs providers

Recipe completeness and provider coverage are independent.

A Machine may exist while its process recipe is missing.
A process may later have a recipe while no provider exists.

## EIC

EIC may consume a resolved recipe only when the process is required, quantity exists, the recipe is canonical, and cost evidence is active.

EIC is generic. When process composition is supplied, it merges recipe requirements with component resource requirements.
The forming recipe reuses the same `return_cant_forming` evidence. It does not add a second line.
Configured depths 30 / 60 / 80 / 100 mm are COMPLETE on owner-confirmed return-profile purchase rates. Canonical none/none at 60 mm remains 382.50 EUR. Forming is 5 EUR/m. CNC face 3 EUR/m, CNC back 4.5 EUR/m, bonding 5 EUR/m, body closure 2 EUR/m, LED install 0.05 EUR/buc, electrical 2 EUR/product, packing 10 EUR/m². Vinyl / RAL remain development evidence and keep those configurations PARTIAL. Operator-confirmed FACE area and VOLUME perimeter are valid Product Truth.

## Boundaries

No machine-hour default. No employee wage. No People/Pontaj. No Commercial price. No recipe CRUD. No capacity or Execution.
