# Operational Processes canon

Canonical current law for reusable operational process definitions and shop-floor capability classes.
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

ProductTemplate / component composition will later choose required processes.
Dependencies belong to that composition, not to a global 1/2/3 sequence.

There must be exactly one future process-composition source. It compiles into ExecutionPlan.
Rejected parallel authorities: dossier task rules, Intake dry-run tasks, separate product-graph task lists.

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

QC, packing, installation prep, and a full Letters DAG are not modelled.

## Persistence and administration

Typed catalog is authority. No process write. No SQLite process table.

`/admin` → Procese operaționale is inspection: Categorii, Procese, Capabilități necesare.
`/products` does not administer processes.

## Reserved, not implemented

- ExecutionPlan / ExecutionTask
- Workcenters / Machines / capacity
- Labor recipes / employee wage
- CNC pricing / geometry
- Process CRUD
