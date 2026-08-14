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
  → later provides the capability and may be selected
EMPLOYEE
  → later says WHO performs or assists
```

Do not collapse these layers.

## Process definition

A process has a stable ID, a Romanian display label, a category, one required capability class, applicable constructive types, a semantic outcome, optional resource/service references, lifecycle, and readiness.

It does not have: machine ID, employee ID, order ID, actual time, assignment, or a global sequence number.

## Capability class

Shop-floor capability is not the architectural kernel in `capabilities.ts`.

```text
OperationalProcess → requires CapabilityClass
Workcenter / Machine → later provides CapabilityClass
Execution → later selects the concrete provider
```

Kinds in this foundation: MACHINE, WORKSTATION, HUMAN_SKILL.

## Applicability and composition

A process is reusable. `CUT_SHEET_CNC` applies to FACE and BACK.

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

`APPLY_SURFACE_FINISH` means vinyl/folie only. Painted volume is not this process.

## Resource / cost boundary

A process may reference a Resource/Service. Forming references `return_cant_forming`.

The process is not the price row. Resources / Cost remains monetary authority.
EIC stays on ResourceRequirements. This foundation does not rewrite EIC.

`return_cant_forming` is both:

- a costable SERVICE resource
- referenced by process `FORM_ALUMINIUM_PROFILE`

They are linked, not merged.

## Current live / known set

| Process | Category | Capability | Types | Readiness |
|---|---|---|---|---|
| `CUT_SHEET_CNC` | CUTTING | CNC_ROUTING | FACE, BACK | KNOWN_PROCESS |
| `FORM_ALUMINIUM_PROFILE` | FORMING | PROFILE_FORMING | VOLUME | IMPLEMENTED_PROCESS_FOUNDATION |
| `APPLY_SURFACE_FINISH` | FINISHING | VINYL_APPLICATION | FACE, VOLUME | PLANNED |
| `BOND_LETTER_BODY` | ASSEMBLY | MANUAL_ASSEMBLY | FACE, VOLUME | PLANNED |
| `PLACE_LED_MODULES` | ELECTRICAL | ELECTRICAL_ASSEMBLY | LIGHTING | BLOCKED |

QC, packing, closure, electrical wiring, PSU installation, and paint remain missing-process gaps, not silent omissions.

Letters composition completeness is currently BLOCKED (lighting required but technically blocked; CNC/finish/bond incomplete).

## Persistence and administration

Typed catalog and typed composition compiler are authority. No process write. No composition graph DB. No SQLite process table.

`/admin` → Procese operaționale is inspection: Categorii, Procese, Compoziții produse, Capabilități necesare.
`GET /api/products/:productCode/process-composition` is read-only.
`/components` shows the type process-requirement contract, not the full product graph.
`/products` does not administer processes.

## Reserved, not implemented

- ExecutionPlan / ExecutionTask
- Workcenters / Machines / capacity
- Labor recipes / employee wage
- CNC pricing / geometry
- Process CRUD
