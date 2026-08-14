# WORKOS_FINAL_RESOURCES_AND_COST_CATALOG_FOUNDATION_V1

## Baseline

- Repo: `office952/workos-final`
- Branch: `main`
- Expected baseline: `6397192c067a738a7abec23d81a91b4529bbf694`

## Current resource audit

| Previous ID | Old kind | Rate | Classification |
|---|---|---|---|
| `plexiglas_face_3mm` | material | 16 EUR/m² | MIGRATE — FACE leaked into identity |
| `forex_back_10mm` | material | 16 EUR/m² | MIGRATE — BACK leaked into identity |
| `aluminium_return_profile` | material | 10 EUR/m | KEEP — profile form is real; attach family/spec |
| `return_cant_forming` | operation | 15 EUR/m | KEEP ID, RECLASSIFY → SERVICE |

No live labor recipe, process, workcenter, or machine rows existed. Those remain planned.

## Resource ID decisions

- `plexiglas_3mm_opal` — purchasable Plexiglas 3 mm opal, reusable
- `forex_10mm` — purchasable Forex 10 mm, reusable
- `aluminium_return_profile` — kept; 0.6 mm profile spec attached
- `return_cant_forming` — kept; kind SERVICE; not a material

No compatibility aliases. Rates unchanged.

## Material family / spec model

```text
PLEXIGLAS → plexiglas_3mm_opal (live)
FOREX → forex_10mm (live)
ALUMINIUM → aluminium_return_profile (live)
```

5 mm Plexiglas opal and 5 mm Forex are fixture-only proofs of the same matcher. Not live catalog rows.

Typed properties only: family, form, thickness, optical type, unit.

## Service classification

`return_cant_forming` is a forming/process cost, not a physical material.
CNC/machine operations remain future Operational Processes. This row is only honest classification.

## Cost evidence

One active typed row per live resource. Separate from identity.
No procurement ledger, effective dates, or supplier records yet.
No resource write. Persistence stays typed.

## Resolver

Single `resolveResourcesForType`. FACE/BACK/VOLUME calculators consume it.
No thickness switches in UI or calculators.

## EIC

Unchanged generic path. Canonical product remains 320.50 EUR PARTIAL.
No Commercial output.

## UI / admin

`/admin` → Resurse și cost intern:

- Materiale (by family)
- Servicii / cost operațional
- Dovezi de cost

Inspection only. Where-used is derived.
`/products` does not administer resources.

## Persistence decision

No Resources SQLite table. Typed catalog remains authority because nothing is writable.

## Cleanup

Removed FACE/BACK leakage from live IDs and labels.
Removed parallel FACE/BACK resolvers from `componentTypes`.
VOLUME now uses the same resolver.
No aliases.

## Tests

- `pnpm lint` PASS
- `pnpm typecheck` PASS
- `pnpm test` PASS (domain 78, api 16, web 16)
- `pnpm build` PASS
- `pnpm e2e` PASS (5)
- `git diff --check` PASS

Canonical product EIC remains 320.50 EUR PARTIAL.

## Remaining gaps

- Resource admin write
- Cost history / provenance / effective date
- Inventory
- Operational Processes
- Lighting resources
- PSU reserve owner decision

## Next step

Re-evaluate among: first Resources write, versioned technical-setting write, Lighting after PSU, Operational Processes foundation. Do not auto-pick.
