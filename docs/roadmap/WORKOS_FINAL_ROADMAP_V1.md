# WorkOS Final roadmap v1

Direction, not dogma. If implementation proves a change is needed, propose an amendment. Do not deviate silently.

## Construction order

- PHASE 0 — Repository Foundation
- PHASE 1 — Platform Shell + capability boundaries
- PHASE 2 — Product Template foundation
- PHASE 3 — Schema-driven Form System
- PHASE 4 — ProductDefinition
- PHASE 5 — Product Truth
- PHASE 6 — ProductAggregate
- PHASE 7 — Resource Catalogs: Materials, Pricing evidence, Operational Processes, Labor recipes, Service recipes, Workcenters; machines only when needed
- PHASE 8 — EIC
- PHASE 9 — Letters Golden Path
- PHASE 10 — ACM Generalization
- PHASE 11 — Logo Completion

## Later

Commercial → Quote Snapshot → Order Snapshot → Execution → People → Reports → Documents → Integrations

## Initial finish line

Product configuration → Product Truth → Product Aggregate → Resources → EIC

## Generalization

Do not build a universal framework before real products exist.

Letters is the first golden path. ACM tests generalization. Extract generic truth only after that. Logo follows a stable model.

Generalize from real products, not from theory.

## Current position

Product catalog hierarchy established.
First canonical product established.
FACE / VOLUME / BACK / LIGHTING are component roles with reusable constructive types.
Owner-facing projections exist for components, governance, Product System administration, and Resources / Cost inspection. Display labels are persisted.
ProductAggregate orchestrates. EIC consumes generic requirements.
Resources now separate material family, specification, service, and cost evidence.
Operational Processes now separate HOW work is done from WHAT is consumed.
Workcenters / Machines now say WHO / WHERE can provide a required CapabilityClass. Two owner-confirmed assembly tables provide `MANUAL_ASSEMBLY`. Live machines remain empty. Capacity planning is not implemented.
Letters now has one deterministic technological process composition. That composition is not an ExecutionPlan. Composition cost completeness is a projection of EIC / cost-evidence completeness, not a hardcoded PARTIAL.
LIGHTING resource calculation is IMPLEMENTED_CURRENT / functional V1: confirmed perimeter → modules → load → multi-PSU → generic EIC.
LETTERS Service/Labor recipes are functional V1. Canonical none/none at 60 mm is 382.50 EUR COMPLETE on owner-confirmed workshop evidence. Aluminium 3 EUR/m is confirmed only for 60 mm; 30 / 80 / 100 mm stay PARTIAL. Forming is 5 EUR/m. Vinyl / RAL remain development evidence. Historical 595 snapshots stay frozen. Analyzer handoff is deferred; it is not the current planned-EIC blocker.
Confirmed COMPLETE planned EIC now projects a customer price from one company Commercial policy. Canonical 60 mm none/none is 382.50 EUR internal → 624.82 EUR gross. That COMPLETE offer can be frozen as an immutable Quote Snapshot without Production Snapshot or execution. Quote freeze also freezes generic production-input evidence. An accepted Quote can freeze an Order Snapshot that copies those facts and that evidence. An Order can be released to production from that frozen input. That Release can materialize the existing ExecutionPlan / ExecutionTasks without a second planner.
A read-only Execution Plan Preview now projects confirmed LETTERS truth into production operations. An accepted production snapshot can freeze that technical truth. Persisted ExecutionPlan and ExecutionTasks can be materialized from that snapshot. Provider assignment, a minimal task lifecycle (`PLANNED → IN_PROGRESS → COMPLETED`), minimal completion evidence, explicit task executor assignment, actual resource consumption, inventory stock movements, and actual internal cost projection are IMPLEMENTED_CURRENT. The first UI/UX foundation is now proven on Execution, People, Product configuration / result, Admin Resources, Operational Processes, and Stoc. The operator landing is Lucrări (`/`), a read-only projection of commercial Orders. HR, Pontaj, scheduling, capacity, reservations and purchasing remain NOT_IMPLEMENTED.
VOLUME EIC regression preserved (formerly RETURN_CANT).

```text
FIRST CANONICAL PRODUCT = TECHNICAL_PARTIAL
```

- PHASE 6 = PILOT_VALIDATED
- PHASE 7 = PILOT_VALIDATED
- PHASE 8 = PILOT_VALIDATED

These phases are not universally COMPLETE.
Commercial price rules, Quote Snapshot, Quote Acceptance, Order Snapshot, frozen production-input alignment, Production Release from Order, and Execution from Order Release are IMPLEMENTED_CURRENT / BASIC. The commercial spine now reaches persisted ExecutionPlan. The ACM cassette vertical slice is IMPLEMENTED_CURRENT / BASIC with EIC COMPLETE and generic Quote on AI_DECISION rates. QC / pack provider gaps, full ACM, Analyzer runtime, and resource admin write remain NOT_COMPLETE. Inventory stock movements are IMPLEMENTED_CURRENT / BASIC.

## Finalization map

Cross-system ownership: `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`.

| Area | Status |
|---|---|
| Product System spine (catalog, template, form, truth, aggregate) | DONE / FOUNDATION |
| Component-first calculation + technical settings law | DONE / FOUNDATION |
| Component role / type / configuration law | DONE / FOUNDATION |
| Owner projections (components, governance) | DONE / FOUNDATION |
| Cross-system administration map | DONE / FOUNDATION |
| Product System administration foundation (inspection) | DONE / FOUNDATION |
| Product System first real admin write path (display label) | DONE / FOUNDATION |
| Resources / Cost catalog foundation (identity, family/spec, service, cost evidence) | DONE / FOUNDATION |
| Operational Processes foundation (process + capability class) | DONE / FOUNDATION |
| Letters process composition (requirements, conditions, dependencies) | DONE / FOUNDATION |
| Letters critical technological process completion | DONE / FOUNDATION |
| Workcenters / Machines capability-provider foundation | DONE / FOUNDATION |
| Live assembly workcenters (`WC_ASSEMBLY_01`, `WC_ASSEMBLY_02`) | DONE / FOUNDATION |
| Real shop-floor equipment and capability map | DONE / FOUNDATION |
| Service / Labor Recipe foundation | DONE / FOUNDATION |
| Real shop-floor Operational Process completion | DONE / FOUNDATION |
| Resources admin write / process admin write | NOT_IMPLEMENTED |
| Lighting resource calculation | IMPLEMENTED_CURRENT / functional V1 |
| Letters functional internal-cost recipes / EIC | IMPLEMENTED_CURRENT / functional V1 |
| Letters Execution Plan Preview | IMPLEMENTED_CURRENT |
| Accepted Production Snapshot | IMPLEMENTED_CURRENT |
| Persisted ExecutionPlan / ExecutionTasks | IMPLEMENTED_CURRENT |
| Provider assignment + minimal task lifecycle | IMPLEMENTED_CURRENT / BASIC |
| Completion evidence | IMPLEMENTED_CURRENT / BASIC |
| People operational identity + task executor | IMPLEMENTED_CURRENT / BASIC |
| Actual resource consumption | IMPLEMENTED_CURRENT / BASIC |
| Inventory stock identity and movements | IMPLEMENTED_CURRENT / BASIC |
| Actual internal cost projection | IMPLEMENTED_CURRENT / BASIC |
| LETTERS reachable execution DAG | IMPLEMENTED_CURRENT / 12 of 12 executable path |
| Capacity planning, scheduling, MachineRun | NOT_IMPLEMENTED |
| HR, Pontaj, reservations, purchasing | LATER |
| Commercial price rules foundation | IMPLEMENTED_CURRENT / BASIC |
| Quote Snapshot | IMPLEMENTED_CURRENT / BASIC |
| Quote Document PDF | IMPLEMENTED_CURRENT / BASIC |
| Quote Acceptance | IMPLEMENTED_CURRENT / BASIC |
| Order Snapshot | IMPLEMENTED_CURRENT / BASIC |
| Frozen production input alignment | IMPLEMENTED_CURRENT / BASIC |
| Production Release from Order | IMPLEMENTED_CURRENT / BASIC |
| Execution from Order Release | IMPLEMENTED_CURRENT / BASIC |
| Commercial Execution workspace | IMPLEMENTED_CURRENT / BASIC |
| Operational job overview | IMPLEMENTED_CURRENT / BASIC |
| ACM cassette second-product vertical slice | IMPLEMENTED_CURRENT / BASIC / EIC COMPLETE / QUOTE READY |
| Quote Document PDF (Ofertă) | IMPLEMENTED_CURRENT / BASIC |
| Reporting, Order/invoice/production documents, full ACM, Logo | LATER |

Do not add a top-nav item per later domain. Future admin grows under one Administrare catalog.
