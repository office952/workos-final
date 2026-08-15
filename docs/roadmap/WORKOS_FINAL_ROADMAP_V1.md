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
Workcenters / Machines now say WHO / WHERE can provide a required CapabilityClass. Live provider rows are empty until identities are owner-confirmed. Capacity planning is not implemented.
Letters now has one deterministic technological process composition. That composition is not an ExecutionPlan.
LIGHTING calculation is PARTIAL: LED pitch 100 mm and PSU reserve 25% are owner-confirmed configurable technical settings. Module quantity, LED load, and physical PSU selection remain unavailable.
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
| Resources admin write / process admin write | NOT_IMPLEMENTED |
| Lighting calculation | V1 REQUIRED after PSU owner decision |
| Capacity planning, scheduling, MachineRun | NOT_IMPLEMENTED |
| People, Pontaj, Execution | LATER |
| Commercial, Quote Snapshot, Order Snapshot | LATER |
| Reporting, Documents, ACM, Logo | LATER |

Do not add a top-nav item per later domain. Future admin grows under one Administrare catalog.
