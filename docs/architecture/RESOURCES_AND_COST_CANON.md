# Resources and Cost canon

Canonical current law for resource identity, material specification, and internal cost evidence.
Runtime wins if this document disagrees.
Do not treat this file as the active price list.

## Permanent separation

```text
RESOURCE IDENTITY
≠ RESOURCE VARIANT / SPECIFICATION
≠ COST EVIDENCE
≠ COMPONENT APPLICABILITY
≠ QUANTITY DEMAND
≠ COMMERCIAL PRICE
≠ INVENTORY STOCK
```

Resources / Cost owns identity, technical/procurement specification, and internal/purchase cost evidence.

Product / component owns whether a resource applies and the required quantity.

Commercial owns customer price. See `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md`.

Inventory owns stock movement and derived balance. It does not own resource identity, lot, reservation, or valuation.

Actual Internal Cost consumes the same cost evidence identity, using rates frozen on the accepted production snapshot. It does not create a second rate table.

## Resource kind

Live kinds:

- `MATERIAL` — physical purchasable/costable material
- `SERVICE` — operational/process cost consumed, not a physical material
- `LABOR` — manual / human-skill internal cost, not a second copy of the material

Do not force labor recipes, operational processes, workcenters, or machines into the same entity.
Operational Processes now have their own canon: `docs/architecture/OPERATIONAL_PROCESSES_CANON.md`.
Service / Labor Recipes now have their own canon: `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md`.

## Material family vs specification

```text
MATERIAL FAMILY
  Plexiglas / Forex / Aluminium / LED / Folie / ACM / Oțel
    → RESOURCE SPECIFICATION
      current purchasable/costable row
        → COST EVIDENCE
          one active internal/purchase row
```

A family is not a purchasable row.
A specification is live only when it is a real current resource.
Do not invent manufacturer SKUs or fill the catalog with future thicknesses.

Current live specifications:

- Plexiglas 3 mm opal — sheet, m²
- Forex 10 mm — sheet, m²
- Aluminium return profile 0.6 mm — profile, m
- Modul LED 12V — buc
- Sursă LED 12V 60 / 100 / 160 / 200 W — buc
- Folie Oracal 651 — sheet, m² — only when vinyl is selected
- ACM 3 mm — sheet, m² — identity only; no owner-confirmed rate yet
- Profil oțel cadru intern — profile, m — identity only; no owner-confirmed rate yet

Typed units currently used: `m`, `m²`, `buc`.
`buc` is the piece-count unit for LED modules and PSU units. It is not a generic arbitrary-unit engine.

LED module power is a Product System technical setting, not a resource SKU variant.
PSU capacity and cost live on the resource. 150 W is not a live catalog row.

Plexiglas 5 mm opal and Forex 5 mm are representable by the same matcher. They are not live catalog rows.

## Component resolution

```text
COMPONENT CONFIGURATION
  → resolveResourcesForType(type, configuration)
    → RESOURCE REQUIREMENT (component-owned quantity)
      → RESOURCE SPECIFICATION
        → COST EVIDENCE
          → generic EIC
```

There is one resolver. Calculators and UI do not branch on thickness.

Component role does not leak into resource identity.
`plexiglas_3mm_opal` is reusable Plexiglas, not a FACE-only material.

## Current identity decisions

| Previous ID | Decision | Current ID |
|---|---|---|
| `plexiglas_face_3mm` | MIGRATE | `plexiglas_3mm_opal` |
| `forex_back_10mm` | MIGRATE | `forex_10mm` |
| `aluminium_return_profile` | KEEP | same; family/spec attached |
| `return_cant_forming` | KEEP ID, RECLASSIFY | same; kind `SERVICE` |

No compatibility aliases.

## Cost evidence

One active typed row per live resource: amount, currency, unit, source, classification.
A row may carry an optional configuration qualifier. Aluminium profile keeps one resource identity; the owner-confirmed 3 EUR/m purchase applies only at 60 mm depth. 30 / 80 / 100 mm have no confirmed profile rate.
Unqualified lookup must not inherit a qualified rate.

Owner-confirmed workshop rates use `OWNER_CONFIRMED_WORKSHOP`. Purchase rates use `OWNER_CONFIRMED_PURCHASE`.
Used `PILOT_INTERNAL_EVIDENCE` or `LEGACY_EVIDENCE` keeps planned EIC PARTIAL.

Not a procurement ledger. Future need: effective date, supplier/provenance, history.
Do not overwrite destructively when that slice arrives.

No customer price, markup, or VAT inside Resources.
Those belong to Commercial.
No hourly or elapsed-time costing.

## Persistence

Resources remain a typed catalog.
SQLite is not an authority for resource identity or cost in this foundation.
A persistent table becomes authority only when a specific field is writable.

Resource admin write is `NOT_IMPLEMENTED`.

## Administration

`/admin` → Resurse și cost intern is inspection:

- Materiale
- Servicii
- Manoperă
- Dovezi de cost

Servicii and Manoperă present reusable recipes. Resource identity and rates remain the same catalog facts. The page does not write.

Where-used is derived from live type resolution and product composition.
`/products` does not administer the catalog.

## Boundaries reserved, not implemented

- Inventory / stock / availability
- Supplier / purchase orders
- Operational process identity (owned by Operational Processes)
- Workcenters
- Machines
- Labor / service recipes — see `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md`
- Commercial price
