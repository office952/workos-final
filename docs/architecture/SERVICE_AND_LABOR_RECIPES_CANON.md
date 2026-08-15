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

One active recipe:

- `RCP_PROFILE_FORMING` — Service Recipe
- process: `FORM_ALUMINIUM_PROFILE`
- quantity basis: volume perimeter (m)
- cost evidence: existing `return_cant_forming`

Quantity is consumed, not invented. Volume calculation remains the geometry authority.

Missing recipes stay explicit. CNC, assembly, vinyl, QC, packing, welding, print, lamination, plotter, laser, styro, and metal cutting have no activated recipe in this foundation.

Those shop-floor operations now have Operational Processes. The recipe gap is `SERVICE_RECIPE_MISSING` or `LABOR_RECIPE_MISSING`, not `NOT_APPLICABLE`.

## Completeness vs providers

Recipe completeness and provider coverage are independent.

A Machine may exist while its process recipe is missing.
A process may later have a recipe while no provider exists.

## EIC

EIC may consume a resolved recipe only when the process is required, quantity exists, the recipe is canonical, and cost evidence is active.

Current Letters EIC still comes from component resource requirements. The forming recipe reuses the same `return_cant_forming` evidence. It does not add a second line.

## Boundaries

No machine-hour default. No employee wage. No People/Pontaj. No Commercial price. No recipe CRUD. No capacity or Execution.
