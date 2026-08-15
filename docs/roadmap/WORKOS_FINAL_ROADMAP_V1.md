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
Letters now has one deterministic technological process composition. That composition is not an ExecutionPlan.
LIGHTING resource calculation is IMPLEMENTED_CURRENT / functional V1: confirmed perimeter → modules → load → multi-PSU → generic EIC.
LETTERS Service/Labor recipes are functional V1. Canonical none/none EIC is 595.00 EUR PARTIAL because Analyzer geometry is still missing. Values are calibratable development configuration, not final workshop rates.
A read-only Execution Plan Preview now projects confirmed LETTERS truth into production operations. An accepted production snapshot can freeze that technical truth. Persisted ExecutionPlan and ExecutionTasks can be materialized from that snapshot. Provider assignment and a minimal task lifecycle (`PLANNED → IN_PROGRESS → COMPLETED`) are IMPLEMENTED_CURRENT. People, scheduling and capacity remain NOT_IMPLEMENTED.
VOLUME EIC regression preserved (formerly RETURN_CANT).

```text
FIRST CANONICAL PRODUCT = TECHNICAL_PARTIAL
```

- PHASE 6 = PILOT_VALIDATED
- PHASE 7 = PILOT_VALIDATED
- PHASE 8 = PILOT_VALIDATED

These phases are not universally COMPLETE.
COMMERCIAL, Quote, ACM, Analyzer runtime, resource admin write, and Inventory remain NOT_COMPLETE.

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
| Capacity planning, scheduling, MachineRun | NOT_IMPLEMENTED |
| People, Pontaj, actual consumption / costing | LATER |
| Commercial, Quote Snapshot, Order Snapshot | LATER |
| Reporting, Documents, ACM, Logo | LATER |

Do not add a top-nav item per later domain. Future admin grows under one Administrare catalog.
