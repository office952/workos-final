# Operational Processes canon

Canonical current law for reusable operational process definitions, shop-floor capability classes, and product/component process composition.
Runtime wins if this document disagrees.

## Permanent separation

```text
PRODUCT / COMPONENT
  → says WHAT must exist
PRODUCT AGGREGATE
  → says WHAT quantities are required
RESOURCE
  → says WHAT is consumed and what it costs internally
OPERATIONAL PROCESS
  → says HOW work is performed
CAPABILITY CLASS
  → says WHAT kind of station / machine / skill can perform it
EXECUTION TASK
  → later says THIS job must perform THIS process
MACHINE / WORKCENTER
  → provides the capability; Execution later selects the provider
EMPLOYEE
  → later says WHO performs or assists
```

Do not collapse these layers.

## Process definition

A process has a stable ID, a Romanian display label, a category, one required capability class, applicable constructive types, a semantic outcome, optional resource/service references, lifecycle, readiness, and whether execution requires a Machine/Workcenter provider.

```text
REQUIRED      → machine/workcenter-dependent work; Start needs provider + executor
NOT_REQUIRED  → manual work; Start needs executor only
```

The process owns this requirement. ExecutionTask consumes the frozen value. Historical records without the field stay REQUIRED.

Provider-not-required does not mean free, no recipe, or no planned cost. Cost stays in Resources / Cost.

It does not have: machine ID, employee ID, order ID, actual time, assignment, or a global sequence number.

## Capability class

Shop-floor capability is not the architectural kernel in `capabilities.ts`.

```text
OperationalProcess → requires CapabilityClass
Workcenter / Machine → provides CapabilityClass
Execution → later selects the concrete provider

See `docs/architecture/WORKCENTERS_AND_MACHINES_CANON.md`. The process definition does not store provider IDs. The join is derived.
```

Kinds in this foundation: MACHINE, WORKSTATION, HUMAN_SKILL.

## Applicability and composition

A process is reusable. `CUT_SHEET_CNC` applies to Plexiglas face, Forex back, and ACM cassette body.

```text
PROCESS DEFINITION
  ≠ PROCESS COMPOSITION
  ≠ EXECUTION INSTANCE
```

Process definition says HOW work can be performed.
Process composition says which processes a resolved product/component configuration requires, under what conditions, and what depends on what.
ExecutionPlan is a later instance for a frozen concrete order. It is not implemented.

There is exactly one composition authority: the typed compiler in `packages/domain/src/processes/`.
Rejected parallel authorities: dossier task rules, Intake dry-run tasks, frontend task arrays, ProductTemplate local operation lists, separate product-graph task lists.

Ownership:

```text
Component type
  → process requirement contract (same standalone and in a product)
Product process composition
  → collects selected type requirements
  → adds cross-component nodes and dependency edges
```

`BOND_LETTER_BODY` is a product-level BODY node. It is not a FACE or VOLUME type requirement.
Node identity is `scope:processId` (example: `FACE:CUT_SHEET_CNC` and `BACK:CUT_SHEET_CNC`). `processId` alone is not unique.

Dependencies are explicit edges. A derived topological order may be shown for readability. Global `sequence: 1,2,3` is not authority.

`APPLY_SURFACE_FINISH` means vinyl/folie only. Painted volume uses `PAINT_RAL` after body closure, not before forming.

`CLOSE_LETTER_BODY` is a product-level BODY node: removable mechanical back fastening after internal electrical work.

Final inspection and packing are PRODUCT-scope nodes.

## Resource / cost boundary

A process may reference a Resource/Service. Forming references `return_cant_forming`.

The process is not the price row. Resources / Cost remains monetary authority.
EIC stays generic. Required LETTERS processes now emit recipe requirements from existing Aggregate quantities. EIC does not branch on process or product.

`return_cant_forming` is both:

- a costable SERVICE resource
- referenced by process `FORM_ALUMINIUM_PROFILE`

They are linked, not merged.

## Current live / known set

Letters-used processes:

| Process | Category | Capability | Types | Readiness |
|---|---|---|---|---|
| `CUT_SHEET_CNC` | CUTTING | CNC_ROUTING | Plexiglas face, Forex back, ACM cassette | KNOWN_PROCESS |
| `FORM_ALUMINIUM_PROFILE` | FORMING | PROFILE_FORMING | VOLUME | IMPLEMENTED_PROCESS_FOUNDATION |
| `APPLY_SURFACE_FINISH` | FINISHING | VINYL_APPLICATION | FACE, VOLUME | PLANNED |
| `BOND_LETTER_BODY` | ASSEMBLY | MANUAL_ASSEMBLY | FACE, VOLUME | PLANNED |
| `PLACE_LED_MODULES` | ELECTRICAL | ELECTRICAL_ASSEMBLY | LIGHTING | KNOWN_PROCESS |
| `WIRE_LIGHTING` | ELECTRICAL | ELECTRICAL_ASSEMBLY | LIGHTING | PLANNED |
| `INSTALL_OR_CONNECT_PSU` | ELECTRICAL | ELECTRICAL_ASSEMBLY | LIGHTING | KNOWN_PROCESS |
| `TEST_LIGHTING_IGNITION` | ELECTRICAL | ELECTRICAL_ASSEMBLY | LIGHTING | PLANNED |
| `PAINT_RAL` | FINISHING | PAINTING | VOLUME | PLANNED |
| `CLOSE_LETTER_BODY` | ASSEMBLY | MANUAL_ASSEMBLY | BACK | PLANNED |
| `TEST_ILLUMINATION_UNIFORMITY` | QUALITY_CONTROL | QUALITY_CONTROL | LIGHTING | PLANNED |
| `INSPECT_FINISHED_LETTER` | QUALITY_CONTROL | QUALITY_CONTROL | product | PLANNED |
| `PACK_PRODUCT` | PACKING | PACKAGING | product | PLANNED |

ACM cassette extras, type-driven, not LETTERS role forks:

| Process | Category | Capability | Types | Readiness |
|---|---|---|---|---|
| `CUT_METAL_STOCK` | CUTTING | METAL_CUTTING | steel internal frame | KNOWN_PROCESS |
| `FORM_SHEET_CASSETTE` | FORMING | MANUAL_ASSEMBLY | ACM cassette body | KNOWN_PROCESS |
| `ATTACH_INTERNAL_FRAME` | ASSEMBLY | MANUAL_ASSEMBLY | ACM cassette + steel frame | KNOWN_PROCESS |

Product extras are selected by constructive type ids. FACE+VOLUME roles alone do not create letter bond/close/inspect. Lighting readiness may be `NOT_APPLICABLE` when no LIGHTING component is selected.

Reusable shop-floor processes. They exist because real equipment and operations exist. They are not Letters demand:

| Process | Category | Capability | Current provider (derived) | Recipe |
|---|---|---|---|---|
| `WELD_STEEL_JOIN` | WELDING | WELD_STEEL | `MCH-WELD-STEEL` | SERVICE missing |
| `WELD_ALUMINIUM_JOIN` | WELDING | WELD_ALUMINIUM | `MCH-WELD-ALU` | SERVICE missing |
| `CUT_METAL_STOCK` | CUTTING | METAL_CUTTING | `MCH-METAL-CUTTER-AUTO` | `RCP_CUT_METAL_STOCK` |
| `PRINT_WIDE_FORMAT` | PRINTING | PRINTING | `MCH-EPSON-60800` | SERVICE missing |
| `LAMINATE_WIDE_FORMAT` | PRINTING | LAMINATION | `MCH-LAMINATOR-XPRO` | SERVICE missing |
| `LAMINATE_RIGID_PLATE` | FINISHING | RIGID_FILM_LAMINATION | `MCH-RIGID-FILM-LAMINATOR` | SERVICE missing |
| `CUT_CONTOUR_PLOTTER` | CUTTING | PLOTTER_CUTTING | `MCH-CUTTER-PLOTTER` | SERVICE missing |
| `CUT_LASER_SHEET` | CUTTING | LASER_CUTTING | `MCH-LASER-CNC` | SERVICE missing |
| `CUT_STYROFOAM` | CUTTING | STYRO_CUTTING | `MCH-STYRO-CUTTER` | SERVICE missing |

```text
CATALOG OF POSSIBLE OPERATIONS
  ≠ PRODUCT PROCESS COMPOSITION
```

Steel and aluminium welding stay distinct. Plotter cutting is not vinyl application. Roll lamination is not rigid-plate film application. `CUT_SHEET_CNC` remains the only CNC process. ACM uses the same process with a panel-blank recipe that covers contour plus V-groove on CNC 4020. Manual fold after CNC is `FORM_SHEET_CASSETTE`, not a bending machine.

Letters Lighting calculation is CALCULATED on the confirmed-perimeter path. LETTERS CNC, assembly, vinyl, electrical, paint and packing now have functional recipes. Unrelated shop-floor processes still have no recipes.
Confirmed manual FACE area and VOLUME perimeter are valid Product Truth. Canonical 60 mm none/none planned EIC is COMPLETE on owner-confirmed workshop rates. Other aluminium depths stay PARTIAL until those rates are confirmed. Analyzer is not the planned-EIC blocker.

Recipe completeness is owned by `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md`. A new process does not invent a recipe.

Readiness is reported separately:

- TECHNOLOGICAL_PROCESS_COMPLETENESS — process-graph readiness. Independent of cost.
- LIGHTING_CALCULATION_READINESS — Lighting calculation status.
- COST_COMPLETENESS — projection of EIC / cost-evidence completeness for the selected configuration. Not a second cost authority. Canonical 60 mm none/none is COMPLETE. 30 / 80 / 100 mm, vinyl and RAL stay PARTIAL while their evidence is unconfirmed.
- EXECUTION_READINESS — reserved inspection slot. Still labeled unimplemented on this surface. Execution itself is implemented elsewhere and is not owned by process composition.

## Persistence and administration

Typed catalog and typed composition compiler are authority. No process write. No composition graph DB. No SQLite process table.

`/admin` → Procese operaționale is inspection: Debitare, Formare, Sudură, Print / finisare, Finisare, Asamblare, Electric, Control calitate, Ambalare, then Compoziții produse. Capability and provider coverage are shown on each process. The page does not write.
`GET /api/products/:productCode/process-composition` is read-only.
`/components` shows the type process-requirement contract, not the full product graph.
`/products` does not administer processes.

## Reserved, not implemented

- ExecutionPlan / ExecutionTask
- Capacity planning / scheduling / MachineRun
- Recipe prices, machine-hour rates, employee wages
- CNC quantity / pricing
- Process CRUD
