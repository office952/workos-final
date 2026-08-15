# Workcenters and Machines canon

Canonical current law for production capability providers.
Runtime wins if this document disagrees.

This is not a manufacturing master document and not a capacity or Execution spec.

## Permanent separation

```text
WORKCENTER
  → physical / organizational production area
MACHINE
  → concrete technical equipment in a Workcenter
CAPABILITY
  → technical eligibility a provider can offer
OPERATIONAL PROCESS
  → reusable production operation that requires a Capability
RESOURCE / LABOR / SERVICE RECIPE
  → internal cost basis, owned elsewhere
```

Do not collapse these layers.

A process never requires `machineId`, `machineCode`, or a machine model.

A Workcenter is not another name for a Machine. A Workcenter may contain machines, represent a station without one unique machine, or provide human/workstation capabilities directly.

A Machine is not a process. One Machine may support multiple Operational Processes through its capabilities. One Capability may have multiple providers.

## Capability catalog

Shop-floor capability IDs live only in Operational Processes.

Letters-required capabilities remain:

`CNC_ROUTING`, `PROFILE_FORMING`, `VINYL_APPLICATION`, `MANUAL_ASSEMBLY`, `ELECTRICAL_ASSEMBLY`, `PAINTING`, `QUALITY_CONTROL`, `PACKAGING`.

Additional workshop capabilities exist because real equipment exists. They are not Letters demand:

`WELD_STEEL`, `WELD_ALUMINIUM`, `METAL_CUTTING`, `PRINTING`, `LAMINATION`, `LASER_CUTTING`, `STYRO_CUTTING`, `RIGID_FILM_LAMINATION`, `PLOTTER_CUTTING`.

Each of those capabilities now has a reusable Operational Process. See `docs/architecture/OPERATIONAL_PROCESSES_CANON.md`. Provider coverage and recipe completeness remain independent.

Workcenters / Machines consume those IDs. They do not recreate the capability catalog.

Available shop-floor capability ≠ Letters-required capability. Welding machines do not add welding to Letters composition.

## Legacy evidence rule

Genuine physical machine and workcenter entries in the legacy WorkOS application correspond to real workshop assets. That confirmation is physical existence only.

It does not approve legacy architecture, rates, routing, capacity, scheduling, or Execution coupling.

Classify every legacy identity before migration:

`REAL_MACHINE` | `REAL_WORKCENTER` | `ROUTING_CODE` | `RATE_CODE` | `SERVICE_CODE` | `PROCESS_CODE` | `TEST_FIXTURE` | `MOCK_ONLY` | `DUPLICATE_ALIAS` | `UNKNOWN`

Only `REAL_MACHINE` and `REAL_WORKCENTER` become live assets, and only after semantic normalization.

Do not restore generic `WC_ASSEMBLY` as a live Workcenter. Do not migrate `WA-ASSEMBLY-01` / `WA-ASSEMBLY-02` as Machines; they are already `WC_ASSEMBLY_01` / `WC_ASSEMBLY_02`. Do not migrate `WA-WELD-TABLE` as a Machine; it is `WC_WELDING`.

## Current live topology

The typed catalog is the authority. There is no write path and no SQLite persistence for this domain.

Owner-confirmed assembly foundation, unchanged:

- `WC_ASSEMBLY_01` — Masă asamblare 1 — ACTIVE — `MANUAL_ASSEMBLY` only
- `WC_ASSEMBLY_02` — Masă asamblare 2 — ACTIVE — `MANUAL_ASSEMBLY` only

They are two large assembly tables / canonical organizational reference areas. They are not catch-alls for vinyl, electrical, QC, packing, or painting.

Additional live Workcenters:

| ID | Label | Direct capabilities | Machines |
|---|---|---|---|
| `WC_WELDING` | Stație sudură | none | `MCH-WELD-STEEL`, `MCH-WELD-ALU` |
| `WC_METAL_CUTTING` | Stație debitare metale | none | `MCH-METAL-CUTTER-AUTO` |
| `WC_CNC_ROUTING` | Zonă CNC | none | `MCH-CNC-4020`, `MCH-STYRO-CUTTER` |
| `WC_LETTER_FORMING` | Zonă formare cant | none | `MCH-CNC-CANT-LITERE` |
| `WC_LED_ASSEMBLY` | Montaj LED / electric | `ELECTRICAL_ASSEMBLY` | none |
| `WC_PRINT` | Zonă print | none | `MCH-EPSON-60800` |
| `WC_LAMINATE` | Zonă laminare | none | `MCH-LAMINATOR-XPRO` |
| `WC_VINYL_APPLICATION` | Zonă aplicare folie | `VINYL_APPLICATION` | `MCH-RIGID-FILM-LAMINATOR` |
| `WC_CUT` | Zonă decupare plotter | none | `MCH-CUTTER-PLOTTER` |
| `WC_LASER_CUTTING` | Zonă laser | none | `MCH-LASER-CNC` |

Machine capabilities stay on the Machine when eligibility is equipment-specific. Steel and aluminium welding remain distinct. The CNC router and the styro cutter share a Workcenter but not a capability.

Do not encode `Infinity`, unlimited task counts, or employee limits. Capacity, task concurrency, and employee limits remain `NOT_MODELED`.

Coverage statuses:

- `COVERED` — at least one ACTIVE provider exists in the catalog
- `PROVIDER_PLANNED` — only PLANNED providers exist
- `NO_PROVIDER` — no provider exists

Coverage means the catalog has a provider. It does not mean a job can be executed now.

## Cost / recipe boundary

No machine-hour rates, labor recipes, or commercial money live on Machine or Workcenter identity.

Resources / Cost remains the monetary authority.

Recipe completeness is owned by the Service / Labor Recipe registry. See `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md`.

The shop-floor map may project a read-only recipe/cost gap:

`CANONICAL_COST_EXISTS` | `SERVICE_RECIPE_MISSING` | `LABOR_RECIPE_MISSING` | `RESOURCE_COST_MISSING` | `NOT_APPLICABLE` | `UNKNOWN`

This projection does not fill missing costs.

## People boundary

A Workcenter may declare that the station supports a `HUMAN_SKILL` capability.

Employee qualification, certification, and assignment remain future People truth. No employee records live here.

## Capacity boundary

Machine / Workcenter will later own the technical capacity and availability model.

Execution / Scheduling will consume it.

Product System and Operational Processes do not own capacity.

This map does not implement capacity planning, calendars, free/busy, online/offline state, task concurrency limits, or employee limits. Lifecycle (`ACTIVE` / `PLANNED` / `RETIRED`) is structural only.

## Execution boundary

No ExecutionPlan, ExecutionTask, assignment, or MachineRun.

A future ExecutionTask can choose a provider without mutating the OperationalProcess definition.

The machine catalog does not store actual order runs.

## Product boundary

No Machine or Workcenter IDs in ProductTemplate, Form, ProductDefinition, ProductTruth, ProductAggregate, or component calculators.

Product configuration does not select a machine.

## Administration

Owner inspection lives under Administrare → Utilaje și capacitate.

Categories: Prezentare, Zone / Workcenters, Utilaje, Capabilități, Acoperire procese, Hartă procese / rețete.

The label names the domain destination. Capacity planning is not implemented.
