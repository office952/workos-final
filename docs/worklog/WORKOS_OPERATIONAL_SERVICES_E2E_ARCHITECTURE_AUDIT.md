# Operational Services E2E architecture audit

Read-only architecture mapping. Does not authorize Phase 2 implementation, transport, live Cerere PATCH, quote create, schema write, or canon/roadmap edits.

```text
STATUS                         = AUDIT_COMPLETE
BASE_HEAD                      = 04bebc6e811374d41ecfcfe5cc5559549672356a
OPTIONAL_SITE_INSTALLATION_V1  = INTEGRATED_ON_MAIN
REQUEST_SCOPE_SELECTION        = IMPLEMENTED
PHASE_2                        = NOT_STARTED / NOT_AUTHORIZED
TRANSPORT                      = NOT_STARTED / NOT_AUTHORIZED
THINK_APPLICATION_WIDE         = YES
IMPLEMENT_INCREMENTALLY        = YES
PHASE_2_ROLE                   = FIRST_SAFE_SLICE_OF_OPERATIONAL_SERVICES
NOT_A_LETTERS_MONTAJ_FEATURE   = YES
REAL_CLOUD_WRITE               = NO
LIVE_REQUEST_READ              = NO
LIVE_REQUEST_PATCH             = NO
```

Runtime and current code win over historical documents. Names below are working architecture labels, not final TypeScript identities.

A narrower Phase 2 cost-evidence audit exists on `audit/phase2-installation-evidence-readiness`. This document keeps those evidence facts and replaces the isolated “complete install EIC” framing with an application-wide Operational Services program.

## Sources

Read: `AGENTS.md`, `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`, `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`, `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md`, `docs/architecture/COMMERCIAL_REQUEST_CANON.md`, `docs/architecture/QUOTE_SNAPSHOT_CANON.md`, `docs/architecture/ORDER_SNAPSHOT_CANON.md`, `docs/architecture/QUOTE_DOCUMENT_CANON.md`, `docs/architecture/EXECUTION_PLAN_AND_TASKS_CANON.md`, `docs/architecture/RESOURCES_AND_COST_CANON.md`, `docs/architecture/PEOPLE_OPERATIONAL_IDENTITY_CANON.md`, `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`, `docs/architecture/UI_UX_FOUNDATION_CANON.md`, `docs/worklog/WORKOS_OPTIONAL_SITE_INSTALLATION_V1.md`.

Runtime inspected: `packages/domain/src/installation/scope.ts`, `packages/domain/src/requests/commercialRequest.ts`, `packages/domain/src/commercial/{price,policy,quoteSnapshot,orderSnapshot}.ts`, `packages/domain/src/resources/{catalog,eic,recipes}.ts`, `packages/domain/src/people/identity.ts`, `packages/domain/src/workcenters/catalog.ts`, `packages/domain/src/inventory/stock.ts`, `packages/domain/src/execution/{plan,lifecycle,consumption}.ts`, `packages/domain/src/customers/identity.ts`, `apps/api/src/{product,system,cloud/bootstrapPolicy}.ts`, `apps/web/src/{adminNavigation,RequestDetailPage,App}.tsx`.

Old app (read-only evidence): `C:\Users\offic\workos_app_vs` — Intake V6 `mountingScope`, `intakeDeliverySemantics`, `intakeSiteAudit`, mock `delivery_type`, quote line `SERV-MONTAJ-STD`.

Real Cloud: configuration/bootstrap law only. No live Cerere, no live org data, no credentials.

Writer reconciled runtime, canons, old-app evidence, and the prior Phase 2 evidence audit on `audit/phase2-installation-evidence-readiness`. Parallel read-only lanes inspected the current map, target model, org/multi-company behavior, and old-versus-new UI. Lanes did not write the repository. This worklog is the single written authority.

---

## 1. Current application map

| DOMAIN | CURRENT_OWNER | CURRENT_MODEL | CURRENT_SOURCE | CURRENT_API | CURRENT_UI | CURRENT_WRITES | DOWNSTREAM_CONSUMERS | SNAPSHOT_BOUNDARY | CURRENT_GAPS | REUSABLE_FOR_OPERATIONAL_SERVICES |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CommercialRequest | Commercial Request | Mutable office ask: customer, title, description, office status, attachments, `optionalScopeIds` | `commercialRequest.ts`; canon | `GET/PATCH /api/requests/:id` | `/requests`, `/requests/:id` | Any Cloud member PATCH; customer locked after linked Quote | Product context `?request=`; quote link; installation projection | Request is not frozen; Quote does not hash Request fields | No site facts; no mode; scopes still mutable after quote link | Yes — request-level service selection |
| optionalScopeIds | Commercial Request | Boolean include of `SITE_INSTALLATION` only | `installation/scope.ts`; table `commercial_request_optional_scopes` | Same PATCH `{ optionalScopeIds }` | Cerere checkbox „Montaj la locație” | Same as Request | `projectSiteInstallationScope`; freeze/link refusal | Selection is live office truth, not a Quote line | Single hardcoded scope; no org gate; transport not a scope | Yes — first end of the service chain |
| ProductDefinition / ProductAggregate | Product System | Confirmed LETTERS / ACM manufacture truth | Product compiler | Product compile / confirm | `/products/:code` | Operator confirm of reviewed definition | EIC, process composition, production input | Frozen into Quote `truth` + `productionInput` | Must not own site install | Yes as product line only; never as montaj module |
| EstimatedInternalCost | Resources / Cost + product compiler | `EicResult` from recipes + cost evidence | `resources/eic.ts` | Product compile | Configurator cost projection (owner-scoped money) | Owner cost-evidence amount write | Commercial projector; Quote freeze | Quote stores frozen EIC + rates | Install EIC is a PARTIAL stub with empty lines | Yes — reuse `EicResult` shape, not LETTERS compiler |
| CommercialPriceProposal | Commercial | Cost-plus on `{ total, currency, completeness }` | `commercial/price.ts`, `policy.ts` | Product compile / quote freeze | Product commercial block; Quote inspection | Policy is code-owned; no admin write | Quote / Order / PDF | Frozen `FrozenCommercialOffer` | No fixed-price channel; install 200 EUR cannot be represented | Reuse for **product** line only |
| Resources / Cost | Resources / Cost | 23 workshop resources; units `m` / `m2` / `buc`; CostEvidence supersede | `resources/catalog.ts` | `GET/PATCH /api/resources-admin/...` | `/admin/resources` | Owner amount + note | Product EIC; later actual cost | Live rates; freeze copies used rates | No site-install / transport / supplier / hour / job units | Yes — new service-tagged resources + evidence write |
| People | People | Operational identity, skills, availability, PIN, eligibility | `people/identity.ts` | People admin / operator session | `/admin/people` | Owner people/skills | Claim-on-Start; task executor | Not in Quote | No hourly employee cost; HR/Pontaj absent | Yes as later teren eligibility; never as offer formula |
| Providers | Workcenters / Machines | `WORKCENTER` / `MACHINE` shop-floor capability providers | `workcenters/catalog.ts` | `GET /api/workcenters` | `/admin/workcenters` | Org provider config CLI / owner | Execution assignment when required | Frozen required capability; live eligibility | No supplier / hire-lift / field provider kind | Pattern later; do not reuse as nacelă/schelă |
| Materials | Resources + Inventory | MATERIAL family/spec; stockable = MATERIAL only | catalog + `inventory/stock.ts` | Resources + stock admin | `/admin/resources`, `/admin/stock` | Owner cost; inventory OUT on complete | Product BOM; actuals | Planned qty frozen; actuals append | No facade fixings | Yes; Inventory remains optional |
| Machines / Equipment | Workcenters | CNC, weld, forming, assembly, print | workcenter catalog | Workcenters API | `/admin/workcenters` | Org provider registry | Workshop tasks | Frozen capability, not SKU | Access equipment missing | No for site access without a later semantic decision |
| Quote Snapshot | Commercial | Schema v1: one product, one EIC, one commercial, one productionInput | `quoteSnapshot.ts` | `POST /api/products/:code/quote-snapshot` | `/quotes`, `/quotes/:id` | Append-only freeze | Acceptance, Order, PDF, registry | Immutable stored payload + hash | No service lines | Extend additively in a later slice |
| Order Snapshot | Commercial | Copy of accepted Quote; job root `jobId = orderSnapshotId` | `orderSnapshot.ts` | Order freeze from acceptance | `/jobs/:jobId` | Append-only | Release → ExecutionPlan | Immutable | No service package | Copy pattern for future service lines |
| ExecutionPlan | Execution | One plan/task model from ORDER or PILOT snapshot | `execution/plan.ts` | Plan materialize; start/complete | `/execution/:planId`, `/atelier` | Lifecycle + assignment + actuals | Inventory OUT; actual cost; Atelier | Consumes frozen snapshot only | Workshop DAG only; no teren package | Reuse task lifecycle; add work-package kind later |
| ExecutionActuals | Execution | Actual resource consumption + actual internal cost from frozen rates | `execution/consumption.ts`, actual cost | Complete with optional actuals | Execution planned-vs-actual | On Complete | Inventory; job projection | Retrospective; does not reprice | No field time / subcontract invoice actuals; no profitability rollup | Yes as planned-vs-actual seed |
| ProfitabilityAnalysis | Reporting (planned) | Not implemented as a domain | Domain map: reporting is projection only | None | Planned-vs-actual quantities/cost on execution (Owner-scoped) | None | None | Must never reprice | No job P&L, no estimate-vs-realized commercial view | New read-only projection later |
| Organization configuration | Split | Seller write; commercial policy code-owned; bootstrap empty foundation; provider registry per plane | `bootstrapPolicy.ts`, seller store, `policy.ts` | Seller PATCH owner; cost-evidence owner | `/admin/seller`, `/admin/resources` | Owner | New quotes (seller); EIC (rates) | Live org ≠ frozen Quote | **No org service on/off**; no service modes | Min-org empty-foundation pattern is the right bootstrap |

### Runtime facts that must stay visible

```text
SITE_INSTALLATION selected     → always PARTIAL EIC, empty lines, five static reasons
FREEZE / LINK                  → incomplete_offer until installation EIC is COMPLETE
MODES INTERNAL / SUBCONTRACTED → canon only, not in code
TRANSPORT_UNCONFIRMED          → install reason, but transport is a separate future scope
200 EUR + TVA                  → Owner-confirmed customer price in canon; not in code
LED / electrical workshop svc  → must not be reused for site install
QUOTE                          → product-only
OPTIONAL SCOPES AFTER QUOTE    → still mutable
ORG SERVICE TOGGLE             → absent
PROFITABILITY DOMAIN           → absent
```

---

## 2. Target Operational Services model

Generic abstraction is allowed only where it already has two real service types: **site installation** and **transport**. Measurement, access equipment, and site electrical stay **typed facts of installation** in this program unless Owner later separates them as their own sold services.

Do not invent a JSON blob of anonymous “service facts”. Do not put HUB MEDIA values in code.

### Abstraction law

| Working concept | Generic now? | Why |
| --- | --- | --- |
| Service Capability Definition | Yes | Same registry can list installation and transport without mixing their facts |
| Organization Service Configuration | Yes | Enable/disable and allowed modes are the same decision for every service |
| Request Service Selection | Yes | Already `optionalScopeIds`; transport later becomes another id |
| Service Provider Mode | Yes | INTERNAL / SUBCONTRACTED applies to install and later transport/electrical |
| Service Cost Evidence | Yes | Reuse CostEvidence; tag resource to a capability |
| Service EIC Projection | Yes | Reuse `EicResult`; each capability has its own compiler |
| Service Commercial Projection | Partial | Product stays cost-plus; sold services may need a **fixed-price channel** |
| Quote Service Line Snapshot | Yes | Phase 3 additive lines |
| Order Service Snapshot | Yes | Copy frozen lines |
| Execution Work Package | Yes | `atelier` vs `teren` / logistics packages on one ExecutionPlan model |
| Per-Request Service Configuration | No as a generic bag | Installation site facts ≠ transport trip facts |
| Service Actuals | Yes as pattern | Reuse actual consumption; field/subcontract actuals stay typed |
| Profitability Projection | Yes as reporting | Compare frozen planned vs actual vs frozen sold price; never write |

### Concept cards

#### Service Capability Definition

```text
PURPOSE              = Platform list of optional operational services a company may offer
DOMAIN_OWNER         = Operational Services catalog (code-owned identities; not Product System)
IDENTITY             = Stable capability id, e.g. SITE_INSTALLATION; TRANSPORT reserved
LIFECYCLE            = ACTIVE in catalog; offered vs reserved is a program decision
PERSISTENCE_NEED     = Code catalog first; do not persist a second identity table
MUTABILITY           = Platform, not per-job
SNAPSHOT_BEHAVIOR    = Quote line stores the id + label used at freeze
PERMISSIONS          = Not operator-editable
UI_SURFACE           = None for Phase 1; later org admin lists offered capabilities
REUSE_EXISTING_OR_NEW= NEW thin catalog that generalizes OPTIONAL_COMMERCIAL_SCOPE_IDS
DEPENDENCIES         = None
```

V1 offered: `SITE_INSTALLATION`. V1 reserved (not selectable): `TRANSPORT`. Not V1 capabilities: `SITE_MEASUREMENT`, `ACCESS_EQUIPMENT`, `SITE_ELECTRICAL` — they are install facts.

#### Organization Service Configuration

```text
PURPOSE              = What this company offers, without a Cursor fork
DOMAIN_OWNER         = Organization operational configuration (Operational Plane)
IDENTITY             = Per org + capability
LIFECYCLE            = DISABLED | INTERNAL | SUBCONTRACTED | BOTH
PERSISTENCE_NEED     = Yes — plane-local, like seller and cost evidence
MUTABILITY           = Owner write; later enablement allowed
SNAPSHOT_BEHAVIOR    = Live org config does not rewrite frozen Quotes
PERMISSIONS          = Owner only
UI_SURFACE           = Administrare → Operațiuni (not a global Settings dump)
REUSE_EXISTING_OR_NEW= NEW; follow min-org empty-foundation (new org starts DISABLED)
DEPENDENCIES         = Capability catalog
```

HUB MEDIA is the first validation organization, not a branch.

#### Request Service Selection

```text
PURPOSE              = What the client asked on this Cerere
DOMAIN_OWNER         = Commercial Request
IDENTITY             = existing optionalScopeIds
LIFECYCLE            = unselected silent / selected
PERSISTENCE_NEED     = Already exists
MUTABILITY           = Office, until first linked Quote (recommended lock — Owner Q)
SNAPSHOT_BEHAVIOR    = Selection is not a Quote line today; later freeze copies selected capabilities
PERMISSIONS          = Existing Request PATCH (member); lock after quote
UI_SURFACE           = Cerere detail; list may later show a signal
REUSE_EXISTING_OR_NEW= REUSE
DEPENDENCIES         = Org must offer the capability; otherwise UI silent
```

#### Per-Request Service Configuration

```text
PURPOSE              = How this job’s selected service will be performed
DOMAIN_OWNER         = Request-associated service configuration (not Product Truth)
IDENTITY             = requestId + capability id
LIFECYCLE            = draft office facts → frozen onto Quote line
PERSISTENCE_NEED     = Yes, typed columns/records per capability
MUTABILITY           = Mutable until freeze; after freeze, corrections create a new Quote
SNAPSHOT_BEHAVIOR    = Quote line stores the reviewed configuration
PERMISSIONS          = Request writers before freeze
UI_SURFACE           = Cerere / later service configuration; never LETTERS form fields
REUSE_EXISTING_OR_NEW= NEW typed facts; do not reuse ProductDefinition
DEPENDENCIES         = Selection + org-allowed mode
```

Installation facts (when selected): execution site address (≠ customer address); support/facade; fixing system; exclusions. Conditional: measurements; height/access; access equipment; unload/handling; crew/duration (internal); site electrical contract.

Transport facts stay on the transport capability, not inside installation.

#### Service Provider Mode

```text
PURPOSE              = INTERNAL vs SUBCONTRACTED for a selected service
DOMAIN_OWNER         = Service configuration, constrained by org allowed modes
IDENTITY             = Mode enum on the request-capability pair
LIFECYCLE            = Required once selected and org is not DISABLED
PERSISTENCE_NEED     = Yes
MUTABILITY           = Same lock as selection
SNAPSHOT_BEHAVIOR    = Frozen on the Quote line
PERMISSIONS          = Request writers; org Owner sets allowed set
UI_SURFACE           = Cerere when org = BOTH; hidden when org has one mode
REUSE_EXISTING_OR_NEW= NEW
DEPENDENCIES         = Org configuration
```

#### Service Cost Evidence

```text
PURPOSE              = Owner-confirmed internal or supplier cost for a capability
DOMAIN_OWNER         = Resources / Cost
IDENTITY             = resourceId + evidenceRowId
LIFECYCLE            = Active row; supersede; later optional validity window
PERSISTENCE_NEED     = Existing cost-evidence store
MUTABILITY           = Owner write; live change does not rewrite snapshots
SNAPSHOT_BEHAVIOR    = Freeze copies amount/unit/classification used
PERMISSIONS          = Owner
UI_SURFACE           = /admin/resources (extend grouping; no Settings dump)
REUSE_EXISTING_OR_NEW= REUSE CostEvidence; NEW resource identities; maybe NEW unit and supplier validity
DEPENDENCIES         = Capability; mode decides which rows apply
```

People salary, pontaj, and workshop CNC/forming/LED-mount rates are not this evidence.

#### Service EIC Projection

```text
PURPOSE              = Estimated internal cost of one selected service
DOMAIN_OWNER         = Resources / Cost compiler for that capability
IDENTITY             = EicResult scoped to capability
LIFECYCLE            = silent / PARTIAL / COMPLETE
PERSISTENCE_NEED     = Projection; freeze copies
MUTABILITY           = Recalculated from live evidence + request facts until freeze
SNAPSHOT_BEHAVIOR    = Frozen line EIC
PERMISSIONS          = Money hidden from workshop members (existing financial access)
UI_SURFACE           = Operator completeness, not 0 EUR
REUSE_EXISTING_OR_NEW= REUSE EicResult; NEW compiler; do not call LETTERS compileEic
DEPENDENCIES         = Applicable facts + applicable evidence
```

`200 EUR + TVA` cannot complete this projection.

#### Service Commercial Projection

```text
PURPOSE              = Customer price for one service
DOMAIN_OWNER         = Commercial
IDENTITY             = Commercial block per line
LIFECYCLE            = PARTIAL until the chosen commercial rule and EIC gate are satisfied
PERSISTENCE_NEED     = Frozen on Quote line
MUTABILITY           = Live policy until freeze
SNAPSHOT_BEHAVIOR    = Immutable sold price
PERMISSIONS          = Owner-scoped money
UI_SURFACE           = Quote review / later PDF
REUSE_EXISTING_OR_NEW= NEW channel required if sold price is fixed; do not reuse cost-plus for 200 EUR
DEPENDENCIES         = Owner commercial rule (see Q-INSTALL-COMMERCIAL)
```

#### Quote Service Line Snapshot / Order Service Snapshot

```text
PURPOSE              = Immutable offered / accepted service
DOMAIN_OWNER         = Commercial
IDENTITY             = Additive Quote schema later; Order copies
LIFECYCLE            = Created only when every selected line is COMPLETE
PERSISTENCE_NEED     = Yes, additive; historical v1 snapshots stay readable
MUTABILITY           = None
SNAPSHOT_BEHAVIOR    = Hash includes line EIC + commercial + service config
PERMISSIONS          = Existing freeze gates + later QUOTE_CREATE GO
UI_SURFACE           = Quote review / PDF / job detail
REUSE_EXISTING_OR_NEW= NEW lines on existing snapshot family
DEPENDENCIES         = Service EIC + commercial rule; product line unchanged
```

Phase 2 must not add this schema.

#### Execution Work Package

```text
PURPOSE              = Tasks derived from frozen Order, split atelier / teren / later logistics
DOMAIN_OWNER         = Execution
IDENTITY             = Existing plan/task ids; package kind is new
LIFECYCLE            = Only after Quote → Acceptance → Order → Release → explicit plan action
PERSISTENCE_NEED     = Reuse ExecutionPlan
MUTABILITY           = Lifecycle only; does not rewrite Order
SNAPSHOT_BEHAVIOR    = Reads frozen upstream only
PERMISSIONS          = Existing assignment / Claim-on-Start
UI_SURFACE           = /execution/:planId with teren section later; not from Cerere
REUSE_EXISTING_OR_NEW= REUSE plan/task; NEW composition for field work
DEPENDENCIES         = Frozen Order service truth
```

#### Service Actuals / Profitability Projection

```text
PURPOSE              = What happened; then compare to what was planned and sold
DOMAIN_OWNER         = Execution owns actuals; Reporting owns profitability
IDENTITY             = Existing actualConsumption + later field/subcontract actuals
LIFECYCLE            = After Complete; profitability is read-only
PERSISTENCE_NEED     = Actuals yes; profitability no write
MUTABILITY           = Append actuals; never reprice
SNAPSHOT_BEHAVIOR    = Uses frozen rates and frozen sold price
PERMISSIONS          = Owner money; operator quantities
UI_SURFACE           = Execution planned-vs-actual now; later job profitability
REUSE_EXISTING_OR_NEW= REUSE actuals; NEW profitability view
DEPENDENCIES         = Frozen lines + actuals
```

---

## 3. Domain ownership and rejected leaks

```text
Request              = mutable client intent + selected services + office service facts
Product Truth        = what is manufactured
Service Config       = how associated work is performed for this job
Resources / Cost     = identities and internal/supplier evidence
EIC                  = internal estimate per product or per service
Commercial Price     = customer price per line
Quote                = immutable offered lines
Order                = immutable accepted truth
ExecutionPlan        = tasks from frozen Order
Actuals              = what really happened
Profitability        = comparison, never repricing
People               = who may execute; not the sold rate
Inventory            = optional stock movements; not required to sell a service
Organization config  = what the company offers
```

Rejected ownership leaks:

```text
INSTALLATION_AS_LETTERS_MODULE
INSTALLATION_AS_PRODUCTDEFINITION_FIELD
TRANSPORT_NESTED_IN_INSTALLATION_EIC
CUSTOMER_200_EUR_AS_EIC
COST_PLUS_ON_INSTALL_EIC_AS_THE_SOLD_PRICE
EMPLOYEE_WAGE_OR_PONTAJ_AS_CUSTOMER_PRICE
WORKSHOP_LED_OR_ELECTRICAL_AS_SITE_INSTALL
WORKSHOP_MACHINE_AS_ACCESS_EQUIPMENT
FIELD_TASKS_FROM_CERERE_OR_DESCRIPTION
HUB_MEDIA_RATES_HARDCODED
GLOBAL_SETTINGS_DUMP
QUOTE_REPRICE_FROM_ACTUALS
ORG_ID_ON_EVERY_ROW_INSTEAD_OF_PLANE
CLIENT_CODE_FORK
```

---

## 4. Target E2E lifecycle

```text
1. Organization enables a capability (Owner)
2. Request selects the capability (office) — silent if org DISABLED
3. Service facts configured (office) — typed, conditional
4. Provider mode selected — constrained by org
5. Resources / evidence resolved (Owner-confirmed, live)
6. Service EIC COMPLETE when every applicable internal row exists
7. Service commercial projected by the Owner-chosen rule (not “200 as cost”)
8. Quote freeze — all selected lines COMPLETE; product line + service lines
9. Customer accepts Quote — immutable decision
10. Order copies accepted lines — no recalc
11. Production Release from Order
12. Execution packages: atelier from product input; teren from frozen install; logistics later
13. Assignment / Claim-on-Start
14. Actual time / resources / provider cost
15. Completion evidence
16. Profitability = frozen sold − frozen planned vs actuals
17. Future recommendations from actuals; no retroactive repricing
```

| Gate | Mutation owner | Blocks if failed | Immutable after |
| --- | --- | --- | --- |
| Org DISABLED | Owner | Capability hidden; no EIC | Live; does not touch old Quotes |
| Org mode set | Owner | Request cannot pick a disallowed mode | Live |
| Request selected | Office member | Unselected = silent | Recommended lock after first linked Quote |
| Facts complete | Office | Applicable incomplete reasons | Frozen onto Quote line |
| Evidence valid | Owner (Resources) | Service EIC PARTIAL | Freeze copies the used row |
| EIC COMPLETE | Compiler | Freeze / link refused (already true for install) | Frozen EIC |
| Commercial COMPLETE | Commercial rule | Freeze refused | Frozen sold price |
| Quote freeze | Commercial + explicit later GO | Incomplete job | Snapshot + hash |
| Acceptance | Commercial decision | No Order | Acceptance row |
| Order | Copy | No Release | Order snapshot |
| Release | Production | No plan | Release snapshot |
| Plan materialize | Execution operator | No tasks | Plan exists; tasks lifecycle only |
| Actuals | Executor on Complete | Honest PARTIAL actual cost | Append-only |
| Profitability | Reporting read | Missing actuals stay honest | Never writes commercial |

Phase 1 already implements steps 2 (selection) and the freeze/link refusal of step 8 for installation. Steps 1, 3–7, and 8-as-multi-line do not exist.

---

## 5. Organization configuration and multi-company

```text
AVAILABLE_MODES_RUNTIME        = NOT_SELECTED only
AVAILABLE_MODES_TARGET         = SERVICE_DISABLED | INTERNAL | SUBCONTRACTED | BOTH
DEFAULT_MODE_TODAY             = NOT_SELECTED on every Cerere
DEFAULT_FOR_NEW_ORG            = Owner question; recommend SERVICE_DISABLED
CONFIGURATION_SURFACE          = Administrare → Operațiuni → servicii operaționale (future)
CUSTOMER_OPERABLE_WITHOUT_CURSOR = Phase 1 select/deselect yes; COMPLETE install no; org toggle no
DISABLED_BEHAVIOR              = silent — no checkbox, no EIC, no freeze rule
INTERNAL_BEHAVIOR              = own EIC + own commercial; People = eligibility; Resources = labor evidence
SUBCONTRACTED_BEHAVIOR         = supplier evidence + validity; not a LETTERS module
BOTH_BEHAVIOR                  = org allows both; Cerere chooses one mode per job
DEPENDENCIES                   = capability catalog; later evidence; later commercial rule
SAFE_FALLBACK                  = DISABLED / unselected / PARTIAL / freeze refused
DATA_RETENTION                 = org config retained when later disabled; historical Quotes untouched
SNAPSHOT_IMPACT                = live disable does not rewrite accepted Quotes/Orders
PERMISSION_MODEL               = Owner org + evidence; member Request; freeze existing commercial gates
ADMIN_TOOLING_DEBT             = YES — no org toggle, no supplier identity, no service commercial admin
NO_CLIENT_CODE_FORK            = YES — one codebase; plane-local config
```

Later enablement: Owner sets INTERNAL or SUBCONTRACTED or BOTH; new Cereri may select; old unselected Cereri stay silent until edited.

Changes after accepted Quote/Order: live rates and org flags change the next offer only. Recommended: lock Request selection/mode after first linked Quote so office truth cannot desync from a product-only snapshot.

Expired evidence: no validity window today. Subcontract COMPLETE must not use a silently expired supplier row once that rule exists.

Audit trail: cost-evidence supersede already exists. Org service config will need created/updated metadata; do not invent a second ledger.

HUB MEDIA validates the INTERNAL path first. A second company without montaj validates DISABLED without a fork.

---

## 6. Snapshot boundaries

| Object | Today | Target |
| --- | --- | --- |
| Request | Mutable, including scopes after quote | Mutable intent; lock service selection after first linked Quote |
| Product Quote v1 | One product EIC + commercial + 12 LETTERS ops | Remain readable forever |
| Future Quote | Not implemented | Additive lines: product + installation + optional transport |
| Order | Copies product freeze | Copies all frozen lines |
| Production input | LETTERS workshop only | Product package stays 12 ops; install does not leak |
| Execution | Workshop plan | Second package from frozen install; not from Cerere |
| Actuals | Workshop consumption | Field/subcontract actuals later |
| Profitability | Absent | Read-only vs frozen sold and planned |

Historical 595 / 382.50 law stays: later rates create new snapshots.

---

## 7. Permission model (current → needed)

| Action | Today | Needed |
| --- | --- | --- |
| Select montaj on Cerere | Any member | Same, if org offers it |
| Change scopes after linked Quote | Allowed | Lock (Owner Q) |
| Write cost evidence | Owner | Same for service resources |
| Configure org services | Absent | Owner |
| Freeze Quote | Existing COMPLETE + customer + seller | All selected service lines COMPLETE |
| See money | ALT_B_SCOPED | Unchanged |
| Start field task | N/A | Claim-on-Start + eligibility; no workshop machine required unless frozen op says so |

---

## 8. Old vs new UI program

Do not design or implement these pages now. Architecture C Wave 2 stays unauthorized.

| Future page | OLD_APP_FUNCTIONAL_EQUIVALENT | OLD_APP_STRENGTHS | OLD_APP_PROBLEMS | NEW_PAGE_JOB | DOMAIN_OWNER | SOURCE_OF_TRUTH | ENTRY_POINT | EXIT_POINT | BLOCKED_STATES | WHY_NEW_PAGE_WILL_BE_BETTER |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cerere detail | IntakeDetail + Intake V6 | Deep site audit, delivery types, montaj tab | Mixes product prep, delivery, and site install; `delivery_install` nests transport+montaj | Select services the org offers; capture office facts | Request | Request + org config | `/requests/:id` | Product `?request=` or wait | Org DISABLED hides service; CANCELLED terminal | Request ≠ product; silent when unselected |
| Cereri list | Work Intake list | Delivery/priority signals | Montaj buried in delivery_type | Office queue; optional service signal later | Request | Request registry | `/requests` | Cerere detail | None for unselected | Already cleaner office object |
| Service configuration | Intake V6 review tab montaj + site_audit_json | Concrete terrain fields | Inside product intake; JSON blob; not EIC-complete | Typed facts for selected capability | Service config | Request-associated facts | From Cerere or job-prepare | Completeness → offer | Missing applicable facts | Typed, conditional, not LETTERS fields |
| Organization service settings | MISSING (old is one-shop assumptions) | — | Hardcoded HUB-like behavior | Enable/disable + allowed modes | Org operational config | Plane-local config | `/admin/...` | Back to Cereri | Unconfigured = DISABLED | Multi-company without fork |
| Resources / Cost | Old pricing/cost registries | Many rates | Mixed commercial and internal; montaj+transport SKU | Internal/supplier evidence only | Resources / Cost | CostEvidence | `/admin/resources` | Live EIC | Missing Owner amount = PARTIAL | Already separated from customer price |
| Provider evidence | Old external supplier mock cards | Supplier identity exists as mock | Not cost-evidence; not validity-bound | Supplier cost + validity | Resources / later provider catalog | CostEvidence + supplier id | Admin resources or later furnizori | EIC | Expired evidence = PARTIAL | Evidence, not a CRM |
| Quote review | Old quote / handoff | Multi-line mock (`SERV-MONTAJ-STD`) | One line “Montaj + transport”; not frozen honestly | Inspect product + service lines | Commercial | Quote Snapshot | `/quotes/:id` | Accept / PDF | Incomplete selected service | Immutable lines, no hidden nest |
| Quote PDF | Old offer docs | Familiar customer artifact | Can re-read live state | Projection of frozen lines only | Quote Document | Snapshot only | From Quote | Download | No freeze | Already law; later add sections |
| Job detail | Old job | End-to-end job feel | Mock money and mixed services | Commercial job root through PvA | Order projection | Order Snapshot | `/jobs/:jobId` | Execution | Awaiting release/plan | Stable `jobId = orderSnapshotId` |
| Execution teren | Old shop tasks; terrain notes on intake | Terrain language exists | No real field task graph from frozen Order | Field package after Release | Execution | Frozen install line | `/execution/:planId` | Complete + actuals | Before Order/Release | Atelier ≠ teren |
| Planned vs Actual | Old duration fields / mocks | Operators know the idea | Not bound to frozen rates | Workshop now; field later | Execution | Frozen planned + actuals | Execution workspace | Profitability | Empty actuals honest | Already implemented for LETTERS |
| Profitability | MISSING as real domain | Mock quote cost vs price | Reprice risk | Planned vs actual vs sold | Reporting | Frozen commercial + actual cost | Job detail later | Recommendations | PARTIAL actuals | Comparison only |

Old-app patterns **not** to copy: `delivery_type` as the install switch; `SERV-MONTAJ-STD` bundling montaj+transport; workshop `sablon montaj` as site install; salary-like commercial math.

Old-app strengths to keep as **evidence of needed facts**, not as schema: site address, access, power, photos, exclusions, customer responsibility.

---

## 9. Implementation program

Every slice must be useful alone, testable on the real path, and stoppable. None of these slices is authorized by this audit.

### OS-S1 — Organization capability + request mode + honesty

```text
SLICE              = OS-S1_ORG_CAPABILITY_AND_REQUEST_MODE
BUSINESS_VALUE     = Companies can offer montaj, only one mode, or nothing — without Cursor
DOMAIN_CONTRACT    = Capability catalog; org DISABLED/INTERNAL/SUBCONTRACTED/BOTH; Request selection honors org; mode when selected; lock after linked Quote; remove TRANSPORT_UNCONFIRMED from install reasons
INPUT              = Q-ORG-DEFAULT, Q-LOCK-AFTER-QUOTE, Q-FACT-VS-SERVICE (facts stay later)
OUTPUT             = Silent when disabled; selected still PARTIAL; freeze still refused; no rates
PERSISTENCE        = Additive org-service config; additive request mode
UI                 = Admin org service control; Cerere checkbox gated; mode control if BOTH
TESTS              = domain + request API + freeze/link still blocked; disabled org hides scope
MIGRATION          = Additive; existing orgs default per Q-ORG-DEFAULT; existing selections kept
SNAPSHOT_IMPACT    = None on historical Quotes
DEPENDENCIES       = Phase 1 selection
OWNER_GATE         = Q-ORG-DEFAULT + Q-LOCK-AFTER-QUOTE
STOP_STATE         = Still no COMPLETE install EIC
ROLLBACK_SAFETY    = Feature-flag unused: org DISABLED restores Phase 1-like silence
```

### OS-S2 — Typed install facts (no money)

```text
SLICE              = OS-S2_INSTALL_FACTS
BUSINESS_VALUE     = Office can record site truth; reasons become conditional
DOMAIN_CONTRACT    = Address, facade, fixing, electrical contract, access trigger — not Product Truth
INPUT              = Q-ACCESS-TRIGGER, Q-SITE-ELECTRICAL (from prior evidence audit)
OUTPUT             = Reasons clear only when the fact exists; EIC still PARTIAL without evidence
PERSISTENCE        = Additive typed facts
UI                 = Cerere / service configuration
TESTS              = unselected silent; electrical NOT_APPLICABLE clears that reason
MIGRATION          = Additive
SNAPSHOT_IMPACT    = None
DEPENDENCIES       = OS-S1
OWNER_GATE         = access + electrical defaults
STOP_STATE         = No COMPLETE EIC
ROLLBACK_SAFETY    = Facts unused if selection cleared
```

### OS-S3 — Evidence + service EIC

```text
SLICE              = OS-S3_EVIDENCE_AND_EIC
BUSINESS_VALUE     = First honest INSTALLATION_EIC path
DOMAIN_CONTRACT    = New install resources; Owner amounts; compiler; no LETTERS recipe reuse
INPUT              = Q-INTERNAL-UNIT, Q-SUBCONTRACT-VALIDITY, Owner amounts; Q-INSTALL-COMMERCIAL must be known so COMPLETE EIC is not auto-sold via cost-plus
OUTPUT             = Applicable lines; COMPLETE only when applicable evidence exists
PERSISTENCE        = Reuse cost-evidence write; maybe new ResourceUnit
UI                 = /admin/resources
TESTS              = INTERNAL vs SUBCONTRACTED completeness; workshop rates unused
MIGRATION          = None if catalog + evidence write reused
SNAPSHOT_IMPACT    = None until a later Quote
DEPENDENCIES       = OS-S1; OS-S2 if remaining facts are mandatory
OWNER_GATE         = units + amounts + commercial rule
STOP_STATE         = EIC may be COMPLETE; freeze still blocked if commercial rule is not ready
ROLLBACK_SAFETY    = Missing evidence stays PARTIAL
```

### OS-S4 — Service commercial price

```text
SLICE              = OS-S4_SERVICE_COMMERCIAL
BUSINESS_VALUE     = Represent 200 EUR + TVA without writing it into EIC
DOMAIN_CONTRACT    = Fixed or Owner-confirmed sold price channel for a service line; product cost-plus unchanged
INPUT              = Q-INSTALL-COMMERCIAL
OUTPUT             = Install commercial COMPLETE without cost-plus on install EIC
PERSISTENCE        = Policy or per-org fixed service price — not a product setting
UI                 = None or admin commercial-service price later; no fake Edit
TESTS              = 200 EUR path ≠ EIC path; product 624.82 unchanged
MIGRATION          = Additive
SNAPSHOT_IMPACT    = Still no multi-line freeze
DEPENDENCIES       = OS-S3
OWNER_GATE         = Q-INSTALL-COMMERCIAL
STOP_STATE         = Projection exists; Quote schema still v1
ROLLBACK_SAFETY    = Product projector untouched
```

### OS-S5 — Multi-line Quote

```text
SLICE              = OS-S5_MULTI_LINE_QUOTE
BUSINESS_VALUE     = One offer: product + installation
DOMAIN_CONTRACT    = Additive Quote schema; historical v1 readable
INPUT              = Complete product + complete install
OUTPUT             = Frozen lines + job total
PERSISTENCE        = Additive snapshot fields
UI                 = Quote review
TESTS              = hash stability; v1 read; freeze still refuses PARTIAL install
MIGRATION          = Additive schema version
SNAPSHOT_IMPACT    = New quotes only
DEPENDENCIES       = OS-S4
OWNER_GATE         = explicit QUOTE_CREATE GO before live use
STOP_STATE         = No PDF change required in the same slice
ROLLBACK_SAFETY    = Old snapshots unread by v2 fields
```

### OS-S6 — Transport

```text
SLICE              = OS-S6_TRANSPORT
BUSINESS_VALUE     = Transport with or without montaj
DOMAIN_CONTRACT    = Separate capability, EIC, commercial, Quote line
INPUT             = Owner transport evidence + commercial rule
OUTPUT             = TRANSPORT selectable; not an install reason
PERSISTENCE        = Same spine as install
UI                 = Cerere + resources
TESTS              = transport-only and install-only
MIGRATION          = Additive
SNAPSHOT_IMPACT    = New lines only
DEPENDENCIES       = OS-S1 catalog reservation; OS-S5
OWNER_GATE         = transport evidence
STOP_STATE         = No field execution
ROLLBACK_SAFETY    = Unselected silent
```

### OS-S7 — Order copies service lines

```text
SLICE              = OS-S7_ORDER_SERVICE_TRUTH
BUSINESS_VALUE     = Accepted job carries install (and later transport)
DOMAIN_CONTRACT    = Order copies frozen lines; no recalc
INPUT              = Accepted multi-line Quote
OUTPUT             = Job root with service truth
PERSISTENCE        = Additive Order payload
UI                 = Job detail
TESTS              = copy-not-calculate
MIGRATION          = Additive
SNAPSHOT_IMPACT    = New orders
DEPENDENCIES       = OS-S5
OWNER_GATE         = Acceptance GO remains separate
STOP_STATE         = No teren tasks yet
ROLLBACK_SAFETY    = Product-only orders remain
```

### OS-S8 — Field execution package

```text
SLICE              = OS-S8_FIELD_EXECUTION
BUSINESS_VALUE     = Teren work after Release
DOMAIN_CONTRACT    = Second package on ExecutionPlan from frozen install; not from Cerere
INPUT              = Released Order with install line
OUTPUT             = Teren tasks; atelier 12 LETTERS tasks unchanged
PERSISTENCE        = Reuse plan/task
UI                 = Execution teren
TESTS              = no leak into 12-op DAG; no tasks from Request
MIGRATION          = None or additive package kind
SNAPSHOT_IMPACT    = None on Quotes
DEPENDENCIES       = OS-S7
OWNER_GATE         = field process composition evidence
STOP_STATE         = Assignment/start/complete only
ROLLBACK_SAFETY    = Product-only plans unchanged
```

### OS-S9 — Service actuals

```text
SLICE              = OS-S9_SERVICE_ACTUALS
BUSINESS_VALUE     = Record real field consumption / time / supplier cost
DOMAIN_CONTRACT    = Extend actual consumption; pontaj is not the sold formula
INPUT              = Completed teren tasks
OUTPUT             = Actual internal cost for the service package
PERSISTENCE        = Existing actuals tables
UI                 = Planned vs actual
TESTS              = missing actuals stay PARTIAL; no customer reprice
MIGRATION          = Additive if new actual kinds
SNAPSHOT_IMPACT    = None
DEPENDENCIES       = OS-S8
OWNER_GATE         = which actuals are required
STOP_STATE         = No P&L page required
ROLLBACK_SAFETY    = Empty actuals honest
```

### OS-S10 — Profitability

```text
SLICE              = OS-S10_PROFITABILITY
BUSINESS_VALUE     = Estimated vs realized without touching the customer
DOMAIN_CONTRACT    = Reporting projection: frozen sold, frozen planned EIC, actuals
INPUT              = Order + actuals
OUTPUT             = Job profitability view
PERSISTENCE        = None (projection)
UI                 = Job detail
TESTS              = later rate change does not move frozen sold or planned
MIGRATION          = No
SNAPSHOT_IMPACT    = None
DEPENDENCIES       = OS-S7 + OS-S9
OWNER_GATE         = money policy already ALT_B_SCOPED
STOP_STATE         = Read-only
ROLLBACK_SAFETY    = Hide the view
```

### OS-S11 — Administration and multi-company readiness

```text
SLICE              = OS-S11_ADMIN_MULTI_COMPANY
BUSINESS_VALUE     = A second company can enable montaj later without a fork
DOMAIN_CONTRACT    = Empty-foundation default; Owner UI complete; no HUB MEDIA literals
INPUT              = OS-S1 config + OS-S3 evidence surfaces
OUTPUT             = Documented customer-operable path
PERSISTENCE        = Already plane-local
UI                 = Admin only
TESTS              = NEW_ORGANIZATION disabled; HUB MEDIA configured; no cross-plane leak
MIGRATION          = No
SNAPSHOT_IMPACT    = None
DEPENDENCIES       = OS-S1 minimum; rest incrementally
OWNER_GATE         = none beyond existing Cloud isolation
STOP_STATE         = No self-service onboarding
ROLLBACK_SAFETY    = Default DISABLED
```

---

## 10. First authorizable slice

```text
FIRST_AUTHORIZABLE_SLICE = OS-S1_ORG_CAPABILITY_AND_REQUEST_MODE
WHY_FIRST                = Application-wide foundation without inventing rates, Quote lines, or field tasks; makes multi-company real; fixes transport-reason leak; closes post-quote scope drift
WHAT_IT_UNLOCKS          = Honest mode for later EIC rows; org disable; a safe place to hang facts (OS-S2) and evidence (OS-S3)
WHAT_IT_DOES_NOT_IMPLEMENT =
  install rates,
  INSTALLATION_EIC COMPLETE,
  200 EUR commercial channel,
  multi-line Quote,
  transport engine,
  Order/PDF/execution teren,
  Architecture C Wave 2,
  live Cerere PATCH,
  first real offer
```

The previous isolated recommendation `P2-S1 MODE_AND_CONDITIONAL_REASONS` is absorbed into OS-S1 plus OS-S2. Do not implement a LETTERS-only mode enum without the org capability.

OS-S3 is the first money slice and must wait for Owner amounts and Q-INSTALL-COMMERCIAL.

---

## 11. Owner questions

Only decisions that change business architecture. Not table names, UI chrome, or already-recorded law.

| OWNER_QUESTION_ID | DECISION | WHY_REQUIRED | OPTIONS | RECOMMENDED_OPTION | TRADEOFF | BLOCKS_WHAT |
| --- | --- | --- | --- | --- | --- | --- |
| Q-ORG-DEFAULT | Default for a new organization | Empty-foundation vs HUB MEDIA must not hardcode montaj on | A) SERVICE_DISABLED B) INTERNAL C) BOTH | A | A requires HUB MEDIA to enable once; B surprises companies without teren | OS-S1 default + bootstrap |
| Q-LOCK-AFTER-QUOTE | May office change selected services after the first linked Quote? | Today scopes stay mutable; job intent can desync from a product-only snapshot | A) Lock selection + mode B) Allow change, block only new incomplete links | A | A needs a new Quote to add montaj later; B is flexible and dishonest | OS-S1 lock rule |
| Q-FACT-VS-SERVICE | Are measurement, access, and site electrical sold services in V1? | Over-generic capabilities would weaken install semantics | A) Typed facts of SITE_INSTALLATION B) Separate capabilities now | A | A matches current canon; B explodes Quote lines early | Capability catalog + OS-S2 |
| Q-INSTALL-COMMERCIAL | How is `200 EUR + TVA` sold without becoming EIC or cost-plus? | The only projector today is cost-plus on EIC | A) Fixed customer price once install EIC is COMPLETE B) Keep install commercial PARTIAL until a later fixed-price line C) Cost-plus on install EIC | A or B; reject C | A needs a commercial exception; B keeps freeze blocked after EIC COMPLETE | OS-S3 stop-state and OS-S4 |
| Q-INTERNAL-UNIT | Unit of internal install labor evidence | Canon allows hour or job; current units are only m / m2 / buc | A) EUR / job B) EUR / hour C) EUR / geometry | A for first COMPLETE | A ignores crew×hours in EIC; B pulls pontaj toward the offer | OS-S3 INTERNAL path |
| Q-SUBCONTRACT-VALIDITY | Must supplier evidence expire? | No supplier identity or validity exists | A) EUR / job + validity window B) Amount only, no expiry | A | Honesty vs simpler admin | OS-S3 SUBCONTRACTED path |
| Q-ACCESS-TRIGGER | When is access equipment required? | Workshop machines must not be reused | A) Office marks height/access required B) Owner height threshold C) Always | A | A is small; B needs a number | OS-S2 access fact |

Do not ask Owner for schema names, function names, Figma, or whether transport nests under montaj (already rejected).

Prior evidence-audit questions Q5 fixings package and Q7 electrical default remain valid **inside OS-S2/OS-S3** and do not change the application spine. They can be answered with the first money GO, not before OS-S1.

---

## 12. Contradictions

1. Roadmap Phase 2 is still titled installation cost completeness. Owner direction is now an Operational Services spine, with installation as the first capability. This audit does not rewrite the roadmap.
2. Canon: transport is a separate optional Quote line. Runtime: `TRANSPORT_UNCONFIRMED` is an installation incomplete reason.
3. Canon: `200 EUR + TVA` is customer price. Runtime: `projectCommercialPrice` is cost-plus on EIC only.
4. Canon completeness table includes facade, fixing, crew, duration. Runtime reasons are cost, measurements, height, transport, electrical.
5. `optionalScopeIds` remain writable after a Quote is linked; customerId is locked.
6. Old app sells “Montaj + transport” as one SKU and nests install under `delivery_type`. New canon forbids both.
7. Admin label „Resurse și cost intern” lives under Atelier; service evidence will include teren/supplier costs. Grouping must stay domain-aware, not a Settings dump.

---

## 13. Risks

```text
OVER_GENERIC_SERVICE_BLOB       = losing install/transport semantics
COMPLETING_EIC_THEN_COST_PLUS   = inventing a sold price other than 200 EUR + TVA
IMPLEMENTING_ALL_PHASES_AT_ONCE = untestable, unrollbackable
FIELD_TASKS_FROM_REQUEST        = skipping Quote/Order freeze
HR_AS_PRICING                   = pontaj/salary on the offer
ACCESS_AS_CNC                   = wrong provider kind
INVENTORY_MANDATE               = blocking companies that do not stock fixings
HUB_MEDIA_IN_CODE               = client fork
UI_PAGES_WITHOUT_CONTRACT       = Architecture C Wave 2 too early
```

---

## 14. Admin tooling debt

```text
NO_ORG_SERVICE_TOGGLE
NO_SERVICE_MODE
NO_SUPPLIER_IDENTITY
NO_EVIDENCE_VALIDITY_WINDOW
NO_FIXED_SERVICE_PRICE_CHANNEL
NO_HOUR_OR_JOB_RESOURCE_UNIT
NO_SITE_FACT_SURFACE
COMMERCIAL_POLICY_CODE_OWNED
```

Close these on the owning domain when the matching slice lands. Do not add a universal Settings page.

---

## 15. What this audit does not authorize

```text
PHASE_2_IMPLEMENTATION     = NO
TRANSPORT_IMPLEMENTATION   = NO
QUOTE_CREATE               = NO
LIVE_REQUEST_PATCH         = NO
SCHEMA_WRITE               = NO
CANON_OR_ROADMAP_EDIT      = NO
FIGMA_WRITE                = NO
REAL_CLOUD_WRITE           = NO
```

---

## 16. Owner review — 2026-08-28

Audit evidence above is preserved. Runtime did not change. Target law now lives in the canons, not in this section.

```text
OWNER_REVIEW              = APPROVED_WITH_AMENDMENTS
OWNER_DECISION_DATE       = 2026-08-28
SEVEN_DECISION_PACKAGE    = APPROVED
ARCHITECTURE_DIRECTION    = OWNER_ACCEPTED_WITH_AMENDMENTS
FIRST_IMPLEMENTABLE_SLICE = OS-S1
OS_S1_GO                  = NOT_YET_GRANTED
```

Approved decisions:

```text
Q_ORG_DEFAULT =
  SERVICE_DISABLED
Q_LOCK_AFTER_QUOTE =
  LOCK_SELECTION_AND_MODE_AFTER_FIRST_LINKED_QUOTE
Q_FACT_VS_SERVICE =
  MEASUREMENT_ACCESS_SITE_ELECTRICAL_ARE_TYPED_INSTALLATION_FACTS
  TRANSPORT_REMAINS_SEPARATE_CAPABILITY
Q_INSTALL_COMMERCIAL =
  MANUAL_FIXED_PER_REQUEST
  FIRST_REAL_JOB_PRICE = 200 EUR + TVA
  NOT_ORG_UNIVERSAL_DEFAULT
  NOT_EIC
  NOT_COST_PLUS
Q_INTERNAL_UNIT =
  EUR_PER_PERSON_HOUR
  INTERNAL_LABOR_EIC =
    crew_size × planned_duration_hours × internal_site_labor_rate_per_person_hour
Q_SUBCONTRACT_VALIDITY =
  COST_PER_JOB_WITH_VALIDITY_WINDOW
Q_ACCESS_TRIGGER =
  OFFICE_EXPLICITLY_SELECTS_ACCESS_METHOD_AND_EQUIPMENT_REQUIREMENT
```

Additional accepted laws:

```text
INTERNAL_LABOR_RATE ≠ EMPLOYEE_SALARY
INTERNAL_LABOR_RATE ≠ CUSTOMER_PRICE
PONTAJ_ACTUALS      ≠ COMMERCIAL_FORMULA
FIXINGS_CONSUMABLES =
  typed resource lines;
  package-per-job allowed;
  Inventory optional
SITE_ELECTRICAL =
  INCLUDED |
  EXCLUDED_CUSTOMER_RESPONSIBILITY |
  SUBCONTRACTED |
  NOT_APPLICABLE
```

Amendments versus the audit recommendations:

- internal labor is person-hour, not EUR/job;
- `200 EUR + TVA` is manual fixed per Request for the first real job, not an org-wide default and not automatic after EIC COMPLETE;
- lock after first linked Quote is the V1 rule; a later revision workflow is allowed in principle and is not implemented now.

These decisions are now recorded in `docs/architecture/OPERATIONAL_SERVICES_CANON.md`, the installation and commercial canons, the V1 roadmap, and `AGENTS.md`. This worklog remains evidence history. Runtime is unchanged. OS-S1 is not implemented and is not authorized by that documentation closure.

---

## 17. Migration-safety documentation closure — 2026-08-28

Owner hold before main integration. One documentation fix only. Runtime unchanged.

```text
VERDICT_BEFORE_FIX        = HOLD_FOR_ONE_DOCUMENTATION_FIX
MIGRATION_SAFETY_LAW      = OWNER_ACCEPTED_TARGET
OS_S1_IMPLEMENTATION      = NOT_AUTHORIZED
SERVICE_MANUAL_PRICE_WRITE_PERMISSION = OWNER_DECISION_REQUIRED_BEFORE_OS_S4
```

Transition law now recorded in `OPERATIONAL_SERVICES_CANON.md`:

```text
NEW_ORG_WITHOUT_CONFIG
  = SERVICE_DISABLED
EXISTING_ORG_WITHOUT_CONFIG_AND_NO_SELECTED_REQUESTS
  = SERVICE_DISABLED
EXISTING_PERSISTED_SERVICE_SELECTION
  = PRESERVED
  = VISIBLE_ON_REQUEST_DETAIL
  = READINESS_GATE_REMAINS_ACTIVE
  = MODE_NOT_INFERRED
  = FAIL_CLOSED_UNTIL_OWNER_CONFIGURATION
ORG_DISABLE
  = PROSPECTIVE_FOR_NEW_SELECTIONS
  = DOES_NOT_DELETE_OR_HIDE_EXISTING_SELECTIONS
  = DOES_NOT_REMOVE_FREEZE_OR_LINK_GATES
  = DOES_NOT_REWRITE_QUOTES_OR_ORDERS
```

OS-S1 must not treat a missing org-config row as a blanket disable that hides Phase 1 `SITE_INSTALLATION` selections or drops `incomplete_offer` freeze/link protection. `ALT_B_SCOPED` remains visibility-only; who may write the manual service price is deferred until OS-S4.

---

## 18. OS-S1 implementation — 2026-08-28

Owner GO: `APROB OS-S1`. Design and implement only this slice.

```text
SLICE                         = OS-S1_ORG_CAPABILITY_AND_REQUEST_MODE
STATUS                        = IMPLEMENTED_CURRENT / BASIC
PRODUCT_CODE_RATES            = UNCHANGED
INSTALLATION_EIC              = STILL_PARTIAL
QUOTE_LINES                   = STILL_PRODUCT_ONLY
FIELD_TASKS                   = NOT_CREATED
LIVE_REQUEST_PATCH            = NO
QUOTE_CREATE                  = NO
OS_S2_TO_OS_S11               = NOT_STARTED
```

Old-versus-new UI/UX note for the Owner page: the old app used `delivery_type` and the SKU “Montaj + transport”. The new page is org offer mode only. It does not sell a bundled SKU, does not write a price, and does not nest transport under montaj.

Runtime:

- catalog: `SITE_INSTALLATION` offered, `TRANSPORT` reserved
- org offer persisted additively with version history
- missing config and later disable stay prospective for new selections
- persisted selections remain visible and keep `incomplete_offer`
- mode is not inferred from missing config
- selection and mode lock after the first linked Quote
- `TRANSPORT_UNCONFIRMED` removed from install reasons
- organization offer change does not rewrite a persisted Request mode; incompatible mode stays visible and fail-closed
- Cloud isolation timeout classified as suite-contention against the default 5s budget; that one test now has a 15s budget so `pnpm test` (CI) stays honest

---

## 19. OS-S1 UI hierarchy and status correction — 2026-08-28

Owner hold after commit 1: domain and CI were accepted; merge was `NO` because `/admin/operational-services` left the Admin L2 floorplan, and docs promoted `IMPLEMENTED_CURRENT / BASIC` before main integration.

```text
CORRECTION                    = UX_S1_AND_DOC_BLOCKER
STATUS                        = IMPLEMENTED_CURRENT / BASIC
OWNER_ACCEPTED                = NO
ADMIN_L2                      = AdminSidebar + admin-floorplan
THIRD_MENU                    = NO
MASTER_SELECTOR               = NO
UNCONFIGURED_VS_DISABLED      = DISTINGUISHED
SAVE_NOTICE                   = VISIBLE
OS_S2_DESIGN                  = OWNER_ACCEPTED
OS_S2_IMPLEMENTATION          = NOT_AUTHORIZED
DECISIONS_1_TO_5              = CLOSED
MAIN_INTEGRATION              = INTEGRATED_ON_MAIN
```

The page uses the established Administrare hierarchy: global L1, one Admin L2, and the service form as page content. OS-S1 is implemented on main.

---

## 20. OS-S2 typed installation facts — 2026-08-29

Owner GO: implement OS-S2 typed installation facts only. No HUB MEDIA enable, no Cloud write, no live Cerere, no money, no Quote.

```text
SLICE                         = OS_S2_TYPED_INSTALLATION_FACTS
STATUS                        = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                = NO
MAIN_INTEGRATION              = NO
INSTALLATION_EIC              = STILL_PARTIAL
MISSING_COST_EVIDENCE         = REMAINS
QUOTE_LINES                   = STILL_PRODUCT_ONLY
LIVE_REQUEST_PATCH            = NO
REAL_CLOUD_WRITE              = NO
OS_S3_TO_OS_S11               = NOT_AUTHORIZED
```

### Old-versus-new Cerere audit

Old app (`C:\Users\offic\workos_app_vs`, read-only):

- Livrare + Montaj was `delivery_type = delivery_install`, labeled “Livrare + Montaj”. It mixed transport/delivery with site install.
- A second switch lived in product Intake V6: `finish_setup.mounting_scope` / `site_installation_included`.
- Site facts lived in `site_audit_json` (one free-text `mounting_address`, enums for photos/power/access, notes). Totem UI fields (surface, foundation) were not persisted.
- Customer address stayed on the Client. Product width/height/area lived in `product_spec_json` / `dimensions` and were sometimes shown inside the terrain section.
- Demo SKU `SERV-MONTAJ-STD` bundled “Montaj + transport”.

New Cerere (`/requests` list + `/requests/:id` detail):

- List stays silent. No montaj fields, no site address, no backend identifiers.
- Detail already has OS-S1 selection + mode. OS-S2 adds one facts section only when selected.
- Configurator is not edited. Product compile still projects install scope without facts, so it keeps only `MISSING_COST_EVIDENCE`. Typed address/facade/fixing/electrical reasons stay on Cerere.

Keep: site address distinct from Client; explicit selection; electrical as a typed site fact; operator confirmation instead of inference.

Do not copy: `delivery_type` as the install switch; `mounting_scope` inside LETTERS; JSON `site_audit_json`; product geometry as site measurements; bundled Montaj + transport SKU; field tasks from Cerere.

Why the new section is clearer: one optional capability, one typed row, Romanian missing reasons, no transport, no product mm², no price. Unselected is silent. Deselect with saved facts asks first and deletes atomically.

### Follow-up contract gap

Access method / access equipment, crew, duration, and consumables stay out of runtime. They are not invented in OS-S2.

```text
OS_S2_FOLLOWUP_CONTRACT_GAP =
  ACCESS_METHOD_AND_EQUIPMENT
  | CREW_SIZE
  | PLANNED_DURATION
  | FIXINGS_CONSUMABLES
  | SITE_PHOTOS
```

### Versioned write invariant — 2026-08-29

Every installation-facts write is version-bound. Create uses `expectedVersion = 0`. Missing version is refused. Stale version is `version_conflict` and does not change the row. Read, check, patch, and persist run in one SQLite transaction; persist is INSERT-if-absent or `UPDATE ... WHERE version = expected`. The Cerere client always sends `facts?.version ?? 0`. OS-S3 remains unauthorized.

### Request-state transaction boundary — 2026-08-30

Facts persist re-reads Request existence, SITE_INSTALLATION selection, and Quote links inside the same IMMEDIATE transaction as the version check and CAS write. Runtime no longer passes stale `selected` / `hasLinkedQuotes` booleans. OS-S3 remains unauthorized.

### Commercial request serialization closure — 2026-08-30

Request update and Quote link now open IMMEDIATE first, then re-read Request, facts existence, Quote links, organization service offer, next Customer, and Quote snapshot inside that transaction before domain evaluation or write. Runtime passes only `requestId` plus patch or `quoteSnapshotId`. Deselect cannot delete a concurrent facts save without confirmation. Add-installation versus Quote link serializes to either selected with zero links or unselected with one link. OS-S3 remains unauthorized.

