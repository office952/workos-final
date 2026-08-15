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

Commercial later owns customer price.

Inventory later owns stock, lot, availability, and movement.

## Resource kind

Live kinds:

- `MATERIAL` — physical purchasable/costable material
- `SERVICE` — operational/process cost consumed, not a physical material

Do not force labor recipes, operational processes, workcenters, or machines into the same entity.
Operational Processes now have their own canon: `docs/architecture/OPERATIONAL_PROCESSES_CANON.md`.
Service / Labor Recipes now have their own canon: `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md`.

## Material family vs specification

```text
MATERIAL FAMILY
  Plexiglas / Forex / Aluminium
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

Not a procurement ledger. Future need: effective date, supplier/provenance, history.
Do not overwrite destructively when that slice arrives.

No customer price, markup, or VAT.

## Persistence

Resources remain a typed catalog.
SQLite is not an authority for resource identity or cost in this foundation.
A persistent table becomes authority only when a specific field is writable.

Resource admin write is `NOT_IMPLEMENTED`.

## Administration

`/admin` → Resurse și cost intern is inspection:

- Materiale
- Servicii / cost operațional
- Dovezi de cost

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
