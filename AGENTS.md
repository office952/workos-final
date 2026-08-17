# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Current position

Hierarchical product catalog plus two live products: LETTERS and Panou ACM casetat.
FACE / VOLUME / BACK / LIGHTING are stable component roles. Constructive types and product configuration are separate. See `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`.
Owner-facing projections: Module și componente, Guvernanța sistemului, Administrare.
Primary nav is Lucrări + Comercial + Produse + Administrare. Comercial groups Cereri + Oferte + Clienți. `/` is the operational job overview. `/requests` is the incoming Cerere de ofertă queue. `/quotes` is the frozen-offer registry. `/clients` is the Client registry and `/clients/:customerId` is the Client Workspace. Inspection surfaces live under Administrare. See `docs/architecture/UI_UX_FOUNDATION_CANON.md`.
`/components` is the Product System inspection surface. `/admin` is the owner surface: Product System display-label write, Resources / Cost owner inspection including Service / Labor Recipes, Stoc inspection of derived inventory balances, Operational Processes inspection including Letters process composition and the reusable shop-floor process catalog, Workcenters / Machines capability-provider inspection, People operational identity, minimal Customer commercial identity, and owner-confirmed seller / Date firmă. Live shop-floor map includes the accepted assembly tables plus real welding, metal-cutting, CNC, forming, electrical, print and related stations, each with a canonical Operational Process where evidence supports one. The first persisted write is display-label only.
Cross-system domain and administration map is canonical; do not invent a second admin model per domain.
ProductTemplate composes roles/types and owns allowed/fixed configuration. ProductAggregate orchestrates. EIC is generic.
LIGHTING calculation is IMPLEMENTED_CURRENT / functional V1: confirmed volume perimeter → module quantity → load → multi-PSU selection → generic EIC. `ledPitchMm`, `ledModulePowerW` and `psuReservePercent` are configurable technical settings. LETTERS Service/Labor recipes are functional V1. Canonical none/none at 60 mm is 382.50 EUR COMPLETE on owner-confirmed workshop evidence. Canonical ACM none (1000 × 500 × 40 mm, Cornier oțel) is 72.644 EUR COMPLETE on classified AI_DECISION rates plus existing packing 10 EUR/m²; Commercial 118.66 EUR gross; generic Quote freeze works. Process-composition cost completeness projects that same EIC evidence, it does not keep a hardcoded PARTIAL. Aluminium profile keeps one resource identity; 3 EUR/m is confirmed only for 60 mm. 30 / 80 / 100 mm stay PARTIAL until owner confirms those depths. Forming is 5 EUR/m. Vinyl / RAL remain development evidence. Historical 595 snapshots stay frozen. Analyzer remains a future external proposal source. Commercial V1 projects customer price from planned EIC and one company cost-plus policy (35% markup, 21% VAT, EUR). A COMPLETE offer can freeze an immutable Quote Snapshot with frozen Customer and seller identities. That frozen Quote can project a customer Ofertă PDF without repricing or rereading the live Customer. That snapshot can receive one immutable Quote Acceptance decision. An accepted Quote can freeze an immutable Order Snapshot. Quote freeze also freezes generic production-input evidence that Order copies. An accepted Order can freeze a Production Release Snapshot from that input. That Release can materialize the existing ExecutionPlan / ExecutionTasks as a separate operator action.

```text
FIRST CANONICAL PRODUCT = TECHNICAL_PARTIAL
PHASE 6 = PILOT_VALIDATED
PHASE 7 = PILOT_VALIDATED
PHASE 8 = PILOT_VALIDATED
COMMERCIAL PRICE RULES = IMPLEMENTED_CURRENT / BASIC
QUOTE SNAPSHOT = IMPLEMENTED_CURRENT / BASIC
QUOTE DOCUMENT PDF = IMPLEMENTED_CURRENT / BASIC
CUSTOMER IDENTITY = IMPLEMENTED_CURRENT / BASIC
SELLER IDENTITY = IMPLEMENTED_CURRENT / BASIC
COMMERCIAL EXPERIENCE = IMPLEMENTED_CURRENT / BASIC
QUOTE ACCEPTANCE = IMPLEMENTED_CURRENT / BASIC
ORDER SNAPSHOT = IMPLEMENTED_CURRENT / BASIC
FROZEN PRODUCTION INPUT = IMPLEMENTED_CURRENT / BASIC
PRODUCTION RELEASE FROM ORDER = IMPLEMENTED_CURRENT / BASIC
EXECUTION FROM ORDER RELEASE = IMPLEMENTED_CURRENT / BASIC
COMMERCIAL EXECUTION WORKSPACE = IMPLEMENTED_CURRENT / BASIC
OPERATIONAL JOB OVERVIEW = IMPLEMENTED_CURRENT / BASIC
QUOTE REGISTRY = IMPLEMENTED_CURRENT / BASIC
COMMERCIAL REQUEST = IMPLEMENTED_CURRENT / BASIC
CLIENT WORKSPACE = IMPLEMENTED_CURRENT / BASIC
ACM CASSETTE SECOND PRODUCT = IMPLEMENTED_CURRENT / BASIC / EIC COMPLETE / QUOTE READY
MANUAL OPERATION PROVIDER OPTIONAL = IMPLEMENTED_CURRENT / BASIC
EXECUTION PLAN PREVIEW = IMPLEMENTED_CURRENT
ACCEPTED PRODUCTION SNAPSHOT = IMPLEMENTED_CURRENT
PERSISTED EXECUTION PLAN / TASKS = IMPLEMENTED_CURRENT
PROVIDER ASSIGNMENT = IMPLEMENTED_CURRENT / BASIC
TASK LIFECYCLE = IMPLEMENTED_CURRENT / BASIC
COMPLETION EVIDENCE = IMPLEMENTED_CURRENT / BASIC
PEOPLE REGISTRY = IMPLEMENTED_CURRENT / BASIC OPERATIONAL IDENTITY
PEOPLE SKILLS = IMPLEMENTED_CURRENT / BASIC
OPERATIONAL AVAILABILITY = IMPLEMENTED_CURRENT / BASIC
OPERATOR IDENTITY + CLAIM-ON-START = IMPLEMENTED_CURRENT / BASIC
TASK EXECUTOR ASSIGNMENT = IMPLEMENTED_CURRENT / BASIC (compatibility; primary path is Claim-on-Start)
UI UX FOUNDATION = IMPLEMENTED_CURRENT / BASIC
PRODUCT CONFIGURATION UX = IMPLEMENTED_CURRENT / BASIC
ADMIN RESOURCES UX = IMPLEMENTED_CURRENT / BASIC
ADMIN OPERATIONAL PROCESSES UX = IMPLEMENTED_CURRENT / BASIC
ADMIN WORKCENTERS UX = IMPLEMENTED_CURRENT / BASIC
ACTUAL RESOURCE CONSUMPTION = IMPLEMENTED_CURRENT / BASIC
INVENTORY STOCK MOVEMENTS = IMPLEMENTED_CURRENT / BASIC
ACTUAL INTERNAL COST = IMPLEMENTED_CURRENT / BASIC
INVENTORY RESERVATION / PURCHASING = NOT_IMPLEMENTED
HR = NOT_IMPLEMENTED
PAYROLL = NOT_IMPLEMENTED
PONTAJ = NOT_IMPLEMENTED
SKILLS = IMPLEMENTED_CURRENT / BASIC
SCHEDULING = NOT_IMPLEMENTED
CAPACITY = NOT_IMPLEMENTED
```

Do not implement full ACM, illuminated ACM, Analyzer runtime, or the next product phase without an explicit Owner GO.

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

The current app has a platform shell with Lucrări + Comercial + Produse + Administrare navigation, Cereri / Oferte / Clienți under Comercial, a real health check on `/system`, a product catalog, Product System inspection on `/components`, persisted display-label administration on `/admin`, Resources / Cost inspection under `/admin/resources` including LETTERS Service / Labor Recipes, Operational Processes inspection under `/admin/processes` including Letters process composition and reusable shop-floor operations for welding, print, lamination, plotter, laser, styro and metal cutting, Workcenters / Machines inspection under `/admin/workcenters` with the accepted assembly tables and the real shop-floor equipment map, owner-facing governance, one canonical front-lit plexi/aluminium letters product, a second non-illuminated ACM cassette product (`PRD-ACM-CASSETTE-NONE`) on the same generic spine, component-owned FACE / VOLUME / BACK / LIGHTING calculations plus reusable ACM cassette and steel-frame types, functional LETTERS internal-cost recipes through generic EIC, a reusable material-family/specification catalog, a typed operational-process catalog with shop-floor capability classes, a deterministic Letters process-composition compiler with vinyl, RAL, electrical, closure, QC and packing nodes, a derived capability-provider join, and canonical component technical settings. A read-only LETTERS Execution Plan Preview is available on the confirmed product result. An accepted production snapshot can freeze that technical truth. A persisted ExecutionPlan and ExecutionTasks can be materialized from that snapshot. An operator identifies with a personal PIN (OperatorSession), then claims a ready task with one atomic Start that sets the executor. Manual executor assignment remains compatibility only. Start requires completed dependencies, a currently eligible session Person, and a valid provider only when the frozen operation requires one. The People catalog starts from a one-time trusted legacy bootstrap; after `PEOPLE_TRUSTED_WORKFORCE_V1_APPLIED`, database truth wins and restart does not restore retired skills. Add, retire, assign skills, mark temporarily unavailable, configure/reset PIN. Eligibility is current operational truth. A PLANNED Claim/Start revalidates that truth; after Start the executor is execution fact and only that Person may Complete. Unmapped capability ≠ any person. On Complete, the operator may also record actual resource consumption against the task's frozen planned resources. Planned quantity is never overwritten. Empty actuals stay honest. When a consumed resource is a stockable material, Complete also appends exactly one inventory OUT movement. Balance is derived from movements and may be negative. The canonical none/none LETTERS DAG has a truthful path for all 12 operations. Probă uniformitate, Control calitate final and Ambalare are manual: eligible Person required via Claim-on-Start, no Machine/Workcenter. Do not invent QC or packaging stations. People cannot substitute a missing provider on a provider-required task. When actual consumption exists, the execution plan also projects actual internal cost from those quantities and the frozen snapshot rates. Missing labor or sheet-material actuals keep the job PARTIAL. HR, Pontaj, scheduling, capacity, reservations and purchasing remain outside this path. Planned EIC for canonical 60 mm none/none is owner-confirmed workshop truth; other aluminium depths and vinyl/RAL remain unconfirmed. Confirmed COMPLETE planned EIC projects a customer price from one company Commercial policy: 35% markup, 21% VAT, EUR, rounding 0.01. Canonical 382.50 EUR becomes 624.82 EUR gross. PARTIAL EIC stays commercially PARTIAL. The live projection is current-policy output. A COMPLETE commercial offer requires an ACTIVE Customer and freezes a Quote Snapshot (`qts:{productCode}:{hash}`) with EIC 382.50, gross 624.82, and `{ customerId, displayName }`. The same generic freeze works for canonical ACM none at 118.66 EUR gross. A frozen Quote can download a customer Ofertă PDF projected only from that snapshot, including the frozen Client name. Renaming the live Customer does not rewrite historical Quotes or PDFs. That frozen offer can receive one immutable Quote Acceptance decision (`qad:{quoteSnapshotId}`) bound to the persisted content hash. An accepted Quote can freeze an Order Snapshot (`ord:{acceptanceId}:{hash}`) that copies those frozen facts plus the generic frozen production input (operations, requirements, used settings, used recipes). Order does not recompile, reprice, mutate Quote or Acceptance, or create Production / Execution / Inventory side effects. An Order can be released to production (`Eliberează pentru producție`) from that frozen input. Release does not start tasks or auto-create an ExecutionPlan. The next explicit action (`Creează planul de execuție`) reuses the existing planner against the Release: 12 PLANNED tasks, no assignment, no start, no inventory. After the plan exists, **Deschide execuția** opens the generic job workspace `/execution/:planId` for assignment, start, complete and actuals. Lucrări (`/`) lists commercial Orders as jobs, shows the frozen Client name, and routes into the product continue surface or that workspace. Cereri (`/requests`) records what the client asked, opens the existing Product workspace with `?request=`, and links the frozen Quote without changing Quote content. Oferte (`/quotes`) lists frozen Quote Snapshots and continues them with `?quote=` without recompiling. Clienți (`/clients`) lists current Customers. Client Workspace (`/clients/:customerId`) projects that client's current profile plus their Cereri, Oferte and Lucrări by `customerId` without becoming a second commercial engine. The product page no longer carries the full task board. Discount and manual adjustment remain reserved at 0. No FX, no Commercial admin write, no frontend formula, no CRM.
