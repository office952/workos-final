# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Current position

Hierarchical product catalog plus first canonical LETTERS product.
FACE / VOLUME / BACK / LIGHTING are stable component roles. Constructive types and product configuration are separate. See `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`.
Owner-facing projections: Module și componente, Guvernanța sistemului, Administrare.
Primary nav is Produse + Administrare. Inspection surfaces live under Administrare. See `docs/architecture/UI_UX_FOUNDATION_CANON.md`.
`/components` is the Product System inspection surface. `/admin` is the owner surface: Product System display-label write, Resources / Cost owner inspection including Service / Labor Recipes, Stoc inspection of derived inventory balances, Operational Processes inspection including Letters process composition and the reusable shop-floor process catalog, Workcenters / Machines capability-provider inspection, and People operational identity. Live shop-floor map includes the accepted assembly tables plus real welding, metal-cutting, CNC, forming, electrical, print and related stations, each with a canonical Operational Process where evidence supports one. The first persisted write is display-label only.
Cross-system domain and administration map is canonical; do not invent a second admin model per domain.
ProductTemplate composes roles/types and owns allowed/fixed configuration. ProductAggregate orchestrates. EIC is generic.
LIGHTING calculation is IMPLEMENTED_CURRENT / functional V1: confirmed volume perimeter → module quantity → load → multi-PSU selection → generic EIC. `ledPitchMm`, `ledModulePowerW` and `psuReservePercent` are configurable technical settings. LETTERS Service/Labor recipes are functional V1. Canonical none/none EIC is 595.00 EUR PARTIAL because Analyzer geometry is still missing. Values are development configuration, not final workshop calibration.

```text
FIRST CANONICAL PRODUCT = TECHNICAL_PARTIAL
PHASE 6 = PILOT_VALIDATED
PHASE 7 = PILOT_VALIDATED
PHASE 8 = PILOT_VALIDATED
COMMERCIAL = NOT_COMPLETE
EXECUTION PLAN PREVIEW = IMPLEMENTED_CURRENT
ACCEPTED PRODUCTION SNAPSHOT = IMPLEMENTED_CURRENT
PERSISTED EXECUTION PLAN / TASKS = IMPLEMENTED_CURRENT
PROVIDER ASSIGNMENT = IMPLEMENTED_CURRENT / BASIC
TASK LIFECYCLE = IMPLEMENTED_CURRENT / BASIC
COMPLETION EVIDENCE = IMPLEMENTED_CURRENT / BASIC
PEOPLE REGISTRY = IMPLEMENTED_CURRENT / BASIC OPERATIONAL IDENTITY
TASK EXECUTOR ASSIGNMENT = IMPLEMENTED_CURRENT / BASIC
UI UX FOUNDATION = IMPLEMENTED_CURRENT / BASIC
PRODUCT CONFIGURATION UX = IMPLEMENTED_CURRENT / BASIC
ADMIN RESOURCES UX = IMPLEMENTED_CURRENT / BASIC
ADMIN OPERATIONAL PROCESSES UX = IMPLEMENTED_CURRENT / BASIC
ADMIN WORKCENTERS UX = IMPLEMENTED_CURRENT / BASIC
ACTUAL RESOURCE CONSUMPTION = IMPLEMENTED_CURRENT / BASIC
INVENTORY STOCK MOVEMENTS = IMPLEMENTED_CURRENT / BASIC
ACTUAL COST = NOT_IMPLEMENTED
INVENTORY RESERVATION / PURCHASING = NOT_IMPLEMENTED
HR = NOT_IMPLEMENTED
PAYROLL = NOT_IMPLEMENTED
PONTAJ = NOT_IMPLEMENTED
SKILLS = NOT_IMPLEMENTED
SCHEDULING = NOT_IMPLEMENTED
CAPACITY = NOT_IMPLEMENTED
```

Do not implement Commercial, Quote, ACM, Analyzer runtime, a second catalog product, or the next product phase without an explicit Owner GO.

## Working rules

- E2E first. A green unit test is not enough. A feature is done when source of truth, contract, backend, API, UI projection, operator interaction, runtime, and tests stay coherent.
- Current WorkOS and other previous repos are read-only reference/evidence. Do not write there. Do not copy architecture or wholesale code.
- UI may code experience. UI must not code business truth: fields, materials, formulas, pricing, readiness, statuses, totals, or Product Truth.
- Operator-facing UI is in Romanian. Internal code and contracts may stay in English.
- Modular product law: an unselected module is silent. A selected module is independently validatable and calculable. Complete product is composition of the same contracts. No hidden parallel calculators.
- Technical quantity, resource identity, internal cost evidence, EIC, and commercial price stay separate. Rates live only in Resources/Cost.
- Adjustable technical values live in canonical Product System component settings. Documentation explains them. Calculation code consumes them. Intake does not administer them.
- Each domain owns its settings and entities. Do not create a global Settings dump or a top-nav link per future system. See `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`.
- Confirm the exact reviewed definition. Do not recompile a later draft at confirm time.
- Catalog organization (family / recursive category) is not product technical truth.
- ProductTemplate is the configurable product. Do not invent a parallel Product entity without Owner GO.
- SVG Analyzer is a separate application. Its output is evidence/proposal, not final truth, until an operator confirms it.
- Owner gates: no business DB, migrations, seeds, or destructive data work without Owner GO.
- Runtime is required. Do not claim PASS from mocks, screenshots, or hardcoded UI states.
- Keep a persistent worklog under `docs/worklog/`.
- Default: one implementation owner. No parallel implementation agents or speculative architecture.

## Bootstrap proof

The current app has a platform shell with Produse + Administrare navigation, a real health check, a product catalog, Product System inspection on `/components`, persisted display-label administration on `/admin`, Resources / Cost inspection under `/admin/resources` including LETTERS Service / Labor Recipes, Operational Processes inspection under `/admin/processes` including Letters process composition and reusable shop-floor operations for welding, print, lamination, plotter, laser, styro and metal cutting, Workcenters / Machines inspection under `/admin/workcenters` with the accepted assembly tables and the real shop-floor equipment map, owner-facing governance, one canonical front-lit plexi/aluminium letters product, component-owned FACE / VOLUME / BACK / LIGHTING calculations, functional LETTERS internal-cost recipes through generic EIC, a reusable material-family/specification catalog, a typed operational-process catalog with shop-floor capability classes, a deterministic Letters process-composition compiler with vinyl, RAL, electrical, closure, QC and packing nodes, a derived capability-provider join, and canonical component technical settings. A read-only LETTERS Execution Plan Preview is available on the confirmed product result. An accepted production snapshot can freeze that technical truth. A persisted ExecutionPlan and ExecutionTasks can be materialized from that snapshot. An operator can assign an eligible Machine/Workcenter and an ACTIVE person as executor, then Start and Complete a task (`PLANNED → IN_PROGRESS → COMPLETED`) with minimal completion evidence (planned quantity stays frozen; completed quantity, outcome and optional note are separate execution facts). On Complete, the operator may also record actual resource consumption against the task's frozen planned resources. Planned quantity is never overwritten. Empty actuals stay honest. When a consumed resource is a stockable material, Complete also appends exactly one inventory OUT movement. Balance is derived from movements and may be negative. Start requires provider + executor + completed dependencies. The canonical none/none LETTERS DAG can run through all currently covered operations (9 of 12). QC, illumination uniformity and packing remain honest no-provider gaps. People cannot substitute those missing providers. HR, Pontaj, scheduling, capacity, reservations, purchasing and actual costing remain outside this path. Final workshop calibration remains later.
