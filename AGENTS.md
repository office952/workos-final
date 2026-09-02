# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Canonical direction

Active V1 delivery authority: `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.
Active UI/UX direction authority: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
`docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` is construction history.
`docs/architecture/UI_UX_FOUNDATION_CANON.md` is the current implemented presentation law.

Before any implementation:
- read `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`

Before any UI/UX change:
- read `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- read `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`

Any agent must report:

```text
ROADMAP_READ
UI_UX_CANON_READ
DIRECTION_CONFLICT
```

Implementation reports also include the V1 roadmap checkpoint. UI changes also include the UI canon change-governance fields.

## Current position

Hierarchical product catalog plus two live products: LETTERS and Panou ACM casetat.
FACE / VOLUME / BACK / LIGHTING are stable component roles. Constructive types and product configuration are separate. See `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`.
Owner-facing projections: Module și componente, Guvernanța sistemului, Administrare.
Accepted navigation direction is V3: one stable sidebar, six categories, twenty pages. See `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`. Wave 1 implementation is `INTEGRATED_ON_MAIN`. Page-content transformation is `IN_PROGRESS`. Clients V3 registry is `INTEGRATED_ON_MAIN`. Client Hub is `INTEGRATED_ON_MAIN`. Cereri V3 Figma is `OWNER_ACCEPTED`. Cereri V3 runtime is `IMPLEMENTED_LOCAL_IN_REVIEW`. Oferte and Lucrări page-content transformations remain unaccepted. Next program priority is `UI_V3_COMMERCIAL_PAGE_REORGANIZATION`. Visible destinations project existing routes only. Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, and Politici stay hidden. `/` remains Lucrări, not Acasă. `/jobs` is an additive alias of the same list. `/atelier` is the operator task inbox (Munca mea). `/requests` is the incoming Cerere de ofertă queue. `/quotes` is the frozen-offer registry. `/clients` is the Client registry and `/clients/:customerId` is the Client Workspace. Inspection surfaces stay reachable; they are no longer a second persistent menu. See `docs/architecture/UI_UX_FOUNDATION_CANON.md`.
`/components` is the Product System inspection surface. `/admin` is the owner surface: Product System display-label write, Resources / Cost including owner write of active cost-evidence amounts, Stoc inspection of derived inventory balances, Operational Processes inspection including Letters process composition and the reusable shop-floor process catalog, Workcenters / Machines capability-provider inspection, People operational identity, minimal Customer commercial identity, and owner-confirmed seller / Date firmă. Cloud Foundation V1 is complete on the feature branch: shared Control Plane, verified Operational Plane per Organization, bootstrap honesty, provider isolation, synthetic two-organization hostile isolation, and adopt source-fingerprint closure. Single-plane DEV stays the default. `WORKOS_CLOUD_ROOT` starts Cloud-only: email/password, HttpOnly `workos_cloud_session`, active org on the session, owner/member gates, login wall, and org name in the shell. The recovered HUB MEDIA Cloud organization is Owner-accepted configured. The first real LETTERS job remains later and still requires a new Owner GO. Live shop-floor map includes the accepted assembly tables plus real welding, metal-cutting, CNC, forming, electrical, print and related stations, each with a canonical Operational Process where evidence supports one. Display-label and active cost-evidence amount are persisted writes.
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
COMMERCIAL FINDABILITY + RETURN FLOW = IMPLEMENTED_CURRENT / BASIC
DOCUMENTS V1 / REQUEST ATTACHMENTS = IMPLEMENTED_CURRENT / BASIC
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
OPERATOR TASK INBOX / ATELIER = IMPLEMENTED_CURRENT / BASIC
TASK EXECUTOR ASSIGNMENT = IMPLEMENTED_CURRENT / BASIC (compatibility; primary path is Claim-on-Start)
UI UX FOUNDATION = IMPLEMENTED_CURRENT / BASIC
PRODUCT CONFIGURATION UX = IMPLEMENTED_CURRENT / BASIC
ADMIN RESOURCES UX = IMPLEMENTED_CURRENT / BASIC
RESOURCE COST EVIDENCE ADMIN WRITE = IMPLEMENTED_CURRENT / BASIC
WORKOS CLOUD FOUNDATION V1 = IMPLEMENTED_CURRENT / BASIC
WORKOS CLOUD FOUNDATION V1 SLICE 1+2 = IMPLEMENTED_CURRENT / BASIC
WORKOS CLOUD FOUNDATION V1 SLICE 3 = IMPLEMENTED_CURRENT / BASIC
WORKOS CLOUD FOUNDATION V1 SLICE 4 = IMPLEMENTED_CURRENT / BASIC
MIN ORG OPERATIONAL CONFIGURATION V1 = IMPLEMENTED_CURRENT / BASIC
CLOUD PROVISIONING ATOMIC RESUME V1 = IMPLEMENTED_CURRENT / BASIC
MULTI-ORG HOSTILE ISOLATION = VERIFIED_SYNTHETIC
HUB_MEDIA_ORGANIZATION_CONFIGURATION = OWNER_ACCEPTED
REAL HUB MEDIA CLOUD PILOT = ORGANIZATION_CONFIGURED
FIRST_REAL_LETTERS_JOB = BLOCKED_BEFORE_QUOTE
OPTIONAL_SITE_INSTALLATION_V1 = INTEGRATED_ON_MAIN
OPERATIONAL_SERVICES_ARCHITECTURE = OWNER_ACCEPTED
OS_S1 = IMPLEMENTED_CURRENT / BASIC
OS_S1_INTEGRATION = INTEGRATED_ON_MAIN
OS_S2 = INTEGRATED_ON_MAIN
OS_S2_DESIGN = OWNER_ACCEPTED
OS_S2_TYPED_FACTS = IMPLEMENTED_CURRENT / BASIC
OS_S2_IMPLEMENTATION = INTEGRATED_ON_MAIN
OS_S2_TRANSACTION_SAFETY = CLOSED
OS_S3 = NOT_STARTED / NOT_AUTHORIZED
UI_UX_NAVIGATION_V3_DESIGN = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION = IN_PROGRESS
CLIENTS_V3 = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION = OWNER_ACCEPTED
CLIENTS_RUNTIME = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE = CLOSED
CLIENT_HUB_FIGMA_FINAL = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE = CLOSED
CLIENT_HUB = INTEGRATED_ON_MAIN
CERERI_V3_FIGMA_FINAL = OWNER_ACCEPTED
REQUESTS_DIRECTION = OWNER_ACCEPTED
REQUESTS_RUNTIME = IMPLEMENTED_LOCAL_IN_REVIEW
NEXT_PROGRAM_PRIORITY = UI_V3_COMMERCIAL_PAGE_REORGANIZATION
SELF-SERVICE ONBOARDING = NOT_IMPLEMENTED
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
- Each domain owns its settings and entities. Do not create a global Settings dump or a new V3 category to place a future system. See `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`.
- Confirm the exact reviewed definition. Do not recompile a later draft at confirm time.
- Catalog organization (family / recursive category) is not product technical truth.
- ProductTemplate is the configurable product. Do not invent a parallel Product entity without Owner GO.
- SVG Analyzer is a separate application. Its output is evidence/proposal, not final truth, until an operator confirms it.
- Owner gates: no business DB, migrations, seeds, or destructive data work without Owner GO.
- Runtime is required. Do not claim PASS from mocks, screenshots, or hardcoded UI states.
- Keep a persistent worklog under `docs/worklog/`.
- Default: one implementation owner. No parallel implementation agents or speculative architecture.
- Operational services that span Request → Quote → Order → Execution follow `docs/architecture/OPERATIONAL_SERVICES_CANON.md`. Installation-specific law is `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.
- Do not implement installation as a LETTERS module or ProductDefinition field.
- Product cost-plus must not price operational services. Service commercial is a separate future channel.
- Transport remains a separate capability. Do not nest it under montaj.
- Do not create operational-service tasks before a frozen Order / Production Release.
- OS-S1 is implemented on main. OS-S2 typed facts are implemented on main. Transaction safety is closed. OS-S3 and later slices require a separate Owner GO. This file does not authorize them. Follow-up facts remain unimplemented: ACCESS_METHOD_AND_EQUIPMENT, CREW_SIZE, PLANNED_DURATION, FIXINGS_CONSUMABLES, SITE_PHOTOS. V3 navigation design is Owner-accepted. Wave 1 sidebar implementation is `INTEGRATED_ON_MAIN`. Cereri V3 Figma is Owner-accepted. Cereri V3 React is `IMPLEMENTED_LOCAL_IN_REVIEW`. This file does not accept runtime or authorize merge. Do not start Wave 2, page-content reorganization, missing pages, Home, or OS-S3 from this file.
- Every future Owner-facing page requires an old-versus-new UI/UX/code audit before implementation.

## Bootstrap proof

The current app has a V3 stable sidebar shell integrated on main. Visible destinations project existing routes: Clienți, Cereri, Oferte, Catalog, Lucrări, Atelier, Resurse și costuri, Stoc, Utilaje, Angajați, Firmă, Servicii operaționale, Sistem produs, Guvernanță. Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, and Politici stay hidden. A real health check exists on `/system`, a product catalog, Product System inspection on `/components`, persisted display-label administration on `/admin`, Resources / Cost under `/admin/resources` with owner write of active cost-evidence amounts, Operational Processes inspection under `/admin/processes` including Letters process composition and reusable shop-floor operations for welding, print, lamination, plotter, laser, styro and metal cutting, Workcenters / Machines inspection under `/admin/workcenters` with the accepted assembly tables and the real shop-floor equipment map, owner-facing governance, one canonical front-lit plexi/aluminium letters product, a second non-illuminated ACM cassette product (`PRD-ACM-CASSETTE-NONE`) on the same generic spine, component-owned FACE / VOLUME / BACK / LIGHTING calculations plus reusable ACM cassette and steel-frame types, functional LETTERS internal-cost recipes through generic EIC, a reusable material-family/specification catalog, a typed operational-process catalog with shop-floor capability classes, a deterministic Letters process-composition compiler with vinyl, RAL, electrical, closure, QC and packing nodes, a derived capability-provider join, and canonical component technical settings. A read-only LETTERS Execution Plan Preview is available on the confirmed product result. An accepted production snapshot can freeze that technical truth. A persisted ExecutionPlan and ExecutionTasks can be materialized from that snapshot. An operator identifies with a personal PIN (OperatorSession), then opens **Atelier** (`/atelier`) to discover cross-job ready work and claim with one atomic Start that sets the executor. Manual executor assignment remains compatibility only. Start requires completed dependencies, a currently eligible session Person, and a valid provider only when the frozen operation requires one. The People catalog starts from a one-time trusted legacy bootstrap; after `PEOPLE_TRUSTED_WORKFORCE_V1_APPLIED`, database truth wins and restart does not restore retired skills. Add, retire, assign skills, mark temporarily unavailable, configure/reset PIN. Eligibility is current operational truth. A PLANNED Claim/Start revalidates that truth; after Start the executor is execution fact and only that Person may Complete. Unmapped capability ≠ any person. On Complete, the operator may also record actual resource consumption against the task's frozen planned resources. Planned quantity is never overwritten. Empty actuals stay honest. When a consumed resource is a stockable material, Complete also appends exactly one inventory OUT movement. Balance is derived from movements and may be negative. The canonical none/none LETTERS DAG has a truthful path for all 12 operations. FACE CNC, BACK CNC and forming require a dedicated machine. The other nine operations are manual work areas: eligible Person required via Claim-on-Start, no Machine/Workcenter assignment. Do not invent QC or packaging stations. People cannot substitute a missing provider on a provider-required task. When actual consumption exists, the execution plan also projects actual internal cost from those quantities and the frozen snapshot rates. Missing labor or sheet-material actuals keep the job PARTIAL. HR, Pontaj, scheduling, capacity, reservations and purchasing remain outside this path. Planned EIC for canonical 60 mm none/none is owner-confirmed workshop truth; other aluminium depths and vinyl/RAL remain unconfirmed. Confirmed COMPLETE planned EIC projects a customer price from one company Commercial policy: 35% markup, 21% VAT, EUR, rounding 0.01. Canonical 382.50 EUR becomes 624.82 EUR gross. PARTIAL EIC stays commercially PARTIAL. The live projection is current-policy output. A COMPLETE commercial offer requires an ACTIVE Customer and freezes a Quote Snapshot (`qts:{productCode}:{hash}`) with EIC 382.50, gross 624.82, and `{ customerId, displayName }`. The same generic freeze works for canonical ACM none at 118.66 EUR gross. A frozen Quote can download a customer Ofertă PDF projected only from that snapshot, including the frozen Client name. Renaming the live Customer does not rewrite historical Quotes or PDFs. That frozen offer can receive one immutable Quote Acceptance decision (`qad:{quoteSnapshotId}`) bound to the persisted content hash. An accepted Quote can freeze an Order Snapshot (`ord:{acceptanceId}:{hash}`) that copies those frozen facts plus the generic frozen production input (operations, requirements, used settings, used recipes). Order does not recompile, reprice, mutate Quote or Acceptance, or create Production / Execution / Inventory side effects. An Order can be released to production (`Eliberează pentru producție`) from that frozen input. Release does not start tasks or auto-create an ExecutionPlan. The next explicit action (`Creează planul de execuție`) reuses the existing planner against the Release: 12 PLANNED tasks, no assignment, no start, no inventory. After the plan exists, **Deschide execuția** opens the generic job workspace `/execution/:planId` for assignment, start, complete and actuals. Lucrări (`/`) lists commercial Orders as jobs, shows the frozen Client name, and opens `/jobs/:jobId` (`jobId` = `orderSnapshotId`). Configurator continue still accepts `?order=`. Cereri (`/requests`) records what the client asked, can attach client files under **Fișiere client** (metadata in SQLite, bytes under `WORKOS_DATA_DIR/documents/`), opens the existing Product workspace with `?request=`, and links the frozen Quote without changing Quote content. Oferte (`/quotes`) lists frozen Quote Snapshots and opens `/quotes/:quoteSnapshotId`. Configurator continue still accepts `?quote=`. Clienți (`/clients`) lists current Customers. Client Workspace (`/clients/:customerId`) projects that client's current profile plus their Cereri, Oferte and Lucrări by `customerId` without becoming a second commercial engine. The product page no longer carries the full task board. Discount and manual adjustment remain reserved at 0. No FX, no Commercial admin write, no frontend formula, no CRM.
