# WorkOS Final — system domain and administration map

Canonical current architecture for cross-system ownership and future administration.
Runtime wins if this document disagrees with implemented code.
This document does not store adjustable runtime values.

Related current canons:

- `docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md` — technical settings single-truth
- `docs/architecture/RESOURCES_AND_COST_CANON.md` — resource identity and cost evidence
- `docs/architecture/SERVICE_AND_LABOR_RECIPES_CANON.md` — service / labor recipe layer
- `docs/architecture/OPERATIONAL_PROCESSES_CANON.md` — process definition and capability class
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — operator/admin visual and interaction grammar
- `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` — construction order and finalization status
- `packages/domain/src/capabilities.ts` — frozen capability IDs (kernel status remains PLANNED by design)
- `packages/domain/src/governance/projection.ts` — honest implemented vs planned runtime projection

## Purpose

WorkOS Final already has a product spine. The next risk is fragmentation: Product System, People, Machines, Pontaj, and Execution each inventing a different administration model.

This map defines shared principles and domain boundaries **before** CRUD systems are built.

## Cross-system administration law

Every administrable business entity must answer:

- What is it?
- Who owns it?
- Where is it configured?
- What is its stable ID?
- What is its display label?
- What is its lifecycle?
- Who may edit it?
- Can it be retired?
- Can it be deleted?
- What references it?
- What settings belong to it?
- What calculations consume it?
- What becomes frozen or versioned?
- What is history vs active truth?

Entities need not share one schema. They must share these principles.

## Shared principles

**One active truth.** One active configurable value or entity definition has one authority.

**Stable identity.** Stable ID is distinct from the editable display label.

**Lifecycle.** Default future vocabulary where suitable: `DRAFT` → `ACTIVE` → `RETIRED`. A domain may use another lifecycle if the domain requires it.

**Delete is exceptional.** Referenced business entities normally `RETIRE`. Hard delete only when genuinely unused and unreferenced.

**Settings are owned.** Settings live with the system or entity that owns them. There is no global Settings table that owns all truth.

**Documentation is not runtime authority.** Docs explain architecture and history.

**UI admin projects canonical truth.** React does not create a second configuration authority.

**Future freeze / versioning.** Accepted or frozen truth must become protected and version-aware. No freeze engine in this build.

**Retirement of old sources.** When a canonical system replaces old active truth: migrate consumers, remove the duplicate authority, keep history only as evidence, update canonical docs, no “just in case” compatibility.

## System map

```text
WorkOS Final
├── Product System                          IMPLEMENTED_CURRENT (typed structure + persisted display labels)
│   ├── ProductFamily / ProductCategory
│   ├── ProductTemplate
│   ├── ComponentRole / ComponentVariant
│   ├── Component technical settings
│   ├── Form schema
│   ├── ProductDefinition / ProductTruth
│   └── ProductAggregate
├── Resources / Cost                        FOUNDATION_ONLY (catalog + EIC)
│   ├── Resource identity
│   ├── Cost evidence / rates
│   └── Labor / service recipes             FOUNDATION_ONLY
├── Operational Processes                   FOUNDATION_ONLY (typed catalog + Letters technological route)
│   ├── Process definition
│   ├── Production capability class
│   ├── Component process requirements
│   └── Product process composition         FOUNDATION_ONLY (deterministic, not ExecutionPlan)
├── Governance / owner projections          IMPLEMENTED_CURRENT (read-only)
├── Analyzer                                NOT_IMPLEMENTED (separate app; proposal only)
├── Customer / identitate comercială        IMPLEMENTED_CURRENT / BASIC
│   ├── Customer registry                   IMPLEMENTED_CURRENT / BASIC
├── Seller / identitate vânzător            IMPLEMENTED_CURRENT / BASIC
│   ├── Company profile (Date firmă)        IMPLEMENTED_CURRENT / BASIC
│   └── CRM / contacts / billing            NOT_IMPLEMENTED
├── Commercial                              IMPLEMENTED_CURRENT / BASIC
│   ├── Commercial Request (Cerere)         IMPLEMENTED_CURRENT / BASIC
│   ├── Commercial rules / customer price   IMPLEMENTED_CURRENT / BASIC
│   ├── Quote Snapshot                      IMPLEMENTED_CURRENT / BASIC
│   ├── Quote registry (Oferte projection)  IMPLEMENTED_CURRENT / BASIC
│   ├── Frozen customer identity            IMPLEMENTED_CURRENT / BASIC
│   ├── Quote Document PDF                  IMPLEMENTED_CURRENT / BASIC
│   ├── Quote acceptance                    IMPLEMENTED_CURRENT / BASIC
│   ├── Order Snapshot                      IMPLEMENTED_CURRENT / BASIC
│   └── Frozen production input             IMPLEMENTED_CURRENT / BASIC
├── Execution                               IMPLEMENTED_CURRENT / BASIC
│   ├── Execution Plan Preview              IMPLEMENTED_CURRENT
│   ├── Accepted Production Snapshot        IMPLEMENTED_CURRENT
│   ├── Production Release from Order       IMPLEMENTED_CURRENT / BASIC
│   ├── Execution from Order Release        IMPLEMENTED_CURRENT / BASIC
│   ├── Execution workspace                 IMPLEMENTED_CURRENT / BASIC
│   ├── ExecutionPlan                       IMPLEMENTED_CURRENT
│   ├── ExecutionTasks                      IMPLEMENTED_CURRENT
│   ├── Provider assignment                 IMPLEMENTED_CURRENT / BASIC
│   ├── Task lifecycle                      IMPLEMENTED_CURRENT / BASIC
│   ├── Completion evidence                 IMPLEMENTED_CURRENT / BASIC
│   ├── Task executor assignment            IMPLEMENTED_CURRENT / BASIC
│   ├── Actual resource consumption         IMPLEMENTED_CURRENT / BASIC
│   ├── Actual internal cost projection     IMPLEMENTED_CURRENT / BASIC
│   └── MachineRun                          NOT_IMPLEMENTED
├── Inventory                               IMPLEMENTED_CURRENT / BASIC
│   ├── Stock identity (Resources MATERIAL) IMPLEMENTED_CURRENT / BASIC
│   ├── Movements + derived balance         IMPLEMENTED_CURRENT / BASIC
│   ├── Reservations                        NOT_IMPLEMENTED
│   └── Purchasing / valuation              NOT_IMPLEMENTED
├── People / identitate operațională        IMPLEMENTED_CURRENT / BASIC
│   ├── Person registry                     IMPLEMENTED_CURRENT / BASIC
│   ├── Skills catalog + assignments        IMPLEMENTED_CURRENT / BASIC
│   ├── Operational availability            IMPLEMENTED_CURRENT / BASIC
│   ├── Current eligibility resolver        IMPLEMENTED_CURRENT / BASIC
│   ├── Employee master / HR                NOT_IMPLEMENTED
│   └── Attendance / Pontaj                 NOT_IMPLEMENTED
├── Machines / Utilaje                      FOUNDATION
│   ├── Machine / machine type              FOUNDATION (live catalog empty)
│   ├── Workcenter                          FOUNDATION (2 assembly tables live)
│   └── Capacity / availability             NOT_IMPLEMENTED
├── Reporting                               PLANNED (projection only)
└── Documents
    ├── Quote Document PDF                  IMPLEMENTED_CURRENT / BASIC
    └── Order / invoice / production docs   PLANNED
```

Capability kernel IDs stay frozen and `PLANNED`. That does not mean the first product is missing. Governance projection is the honest operational status for what the pilot actually does.

## Domain ownership matrix

| Domain | Owns | Does not own |
|---|---|---|
| Product System | Family, category, template, composition, variants, component technical settings, allowed configuration | Purchase rates, commercial price, execution actuals, attendance |
| Form / Intake | Schema, fields, visibility, order-specific operator input | System technical settings, formulas, rates, Product Truth |
| Truth compiler | ProductDefinition, confirmation of the reviewed definition, ProductTruth, ProductAggregate | Resource catalogs, commercial price, actuals |
| Resources / Cost | Resource identity, material family/spec, cost evidence, EIC | Process identity, customer price, stock, Product Truth, attendance |
| Operational Processes | Process definition, required capability class, type applicability, product/component process composition | Resource price, ExecutionTask, machine identity, employee |
| Customer | Current reusable commercial identity (`displayName`, ACTIVE/RETIRED). Minimal catalog only. | Quote/Order historical identity, CRM, contacts, billing, invoices, Product Truth, seller identity, Request office status |
| Commercial Request | Mutable incoming request: customerId, title, description, office status, Request↔Quote link. | Product Truth, EIC, pricing, Quote/Acceptance/Order status, CRM, People, documents |
| Seller | Current company / vânzător identity for new Quotes. Owner-confirmed HUB MEDIA PRODUCTION profile. | Customer catalog, CRM, invoices, global Settings, ProductTemplate |
| Commercial | Customer price rules, current-policy projection, Quote Snapshot freeze including frozen customer and seller identities, customer Quote Document PDF projection, Quote Acceptance, and Order Snapshot. Quote/Order carry frozen production-input evidence; they do not own production composition or Production Release. The PDF does not reprice. CommercialRequest is the incoming office object and may link to Quotes without entering Quote content. | EIC authority, ProductTemplate, execution actuals, resource rates, production composition, Production Release, live Customer catalog, live seller profile, CRM, Product Truth |
| Execution | Plan, tasks, assignments, MachineRun, operational actuals | Attendance truth, rewriting Product Truth, historical commercial reprice, stock balance |
| Inventory | Stock movements and derived balance for stockable materials | Resource identity, reservations, purchasing, warehouses, valuation, actual cost |
| People | Operational person identity, skills, availability and current eligibility. Future: employee master, attendance / Pontaj, payments | Provider capability, labor recipe / cost basis, Product Truth, authenticated user |
| Machines / Workcenters | Machine identity, workcenter identity, capability-provider mapping | Process definition, commercial hourly price, capacity calendar, Execution selection |
| Reporting | Read-only projections | Underlying business truth |
| Documentation | Explanation, history, architecture | Active configurable values |
| Analyzer | Geometric proposals after operator confirmation | Product Truth, settings, price |

## Product System

Administrable later: family, category, template identity/composition, form schema, component variant metadata, technical settings.

Remains code/contract: quantity formulas, compiler semantics, reviewId confirmation, component calculation contracts.

Owner will edit: catalog organization, which variants a template composes, resolved technical settings, form fields that are truly product-configurable.

Needs persistence before real editing: yes. Until then, typed domain configuration is the canonical active configuration.

Lifecycle: `DRAFT` / `ACTIVE` / `RETIRED` for catalog and settings versions. Templates referenced by confirmed truth must not hard-delete.

`/products` consumes the catalog and template as operator workflow. Components are reused by variant ID, not by copying formulas into each product.

## Resources / Cost

Canonical law: `docs/architecture/RESOURCES_AND_COST_CANON.md`.

Separate facts:

1. Resource identity
2. Material family vs purchasable specification
3. Resource cost evidence
4. Component applicability (which component demands the resource)
5. Quantity demand (owned by the component calculation)

Do not merge internal cost with Commercial. Do not put stock here.

Admin inspection lives under `/admin` → Resurse și cost intern. No resource write yet.

Current live catalog: Plexiglas 3 mm opal, Forex 10 mm, aluminium return profile 0.6 mm, forming service. Labor recipes remain planned. Operational processes are a separate foundation.

## Inventory

Canonical law: `docs/architecture/INVENTORY_STOCK_AND_MOVEMENTS_CANON.md`.

Stock identity is the canonical Resources MATERIAL. Movements are append-only. Balance is derived. Actual consumption of a stockable material creates one OUT. Owner adjustment is a bounded write. Negative balances are honest. Inventory does not block execution.

Admin: `/admin` → Stoc → `/admin/stock`.

Reservations, purchasing, warehouses, FIFO, and valuation remain NOT_IMPLEMENTED.

## People / identitate operațională

Person registry, skills and operational availability are IMPLEMENTED_CURRENT / BASIC.
Canonical law: `docs/architecture/PEOPLE_OPERATIONAL_IDENTITY_CANON.md` and `docs/architecture/PEOPLE_SKILLS_OPERATIONAL_TRUTH_CANON.md`.

Admin: `/admin` → Persoane → `/admin/people` and `/admin/people/skills`.

Person supplies operational identity. Skills supply human qualification. Availability supplies current considerability. Eligibility is derived.

## Customer / identitate comercială

Customer current profile is IMPLEMENTED_CURRENT / BASIC. Canonical law: `docs/architecture/CUSTOMER_IDENTITY_CANON.md`.
Client Workspace is IMPLEMENTED_CURRENT / BASIC. Canonical law: `docs/architecture/CLIENT_WORKSPACE_CANON.md`.

Daily work: Comercial → Clienți → `/clients` and `/clients/:customerId`.
Admin: `/admin` → Comercial → Clienți → `/admin/customers` remains lifecycle only.
Seller admin: `/admin` → Comercial → Date firmă → `/admin/seller`.

Customer supplies the current reusable profile. Client Workspace projects that profile plus existing Cereri, Oferte and Lucrări by `customerId`. Quote/Order freeze the name used by that job.

```text
Customer catalog  ≠  Quote customer snapshot  ≠  CRM
```

```text
Person  ≠  Provider  ≠  OperatorSession actor
OperatorSession  ≠  Pontaj
PIN  ≠  RBAC
Skill  ≠  permission
```

HR, Pontaj, payroll and scheduling remain NOT_IMPLEMENTED.
Skills and operational availability are implemented as current operational truth, not as Pontaj or RBAC.
Operator Identity (PIN + session) and Claim-on-Start are IMPLEMENTED_CURRENT / BASIC.
See `docs/architecture/OPERATOR_IDENTITY_CLAIM_ON_START_CANON.md`.

Likely later entities: Employee master, employment/cost profile, Pontaj, full auth platform.

Clarify later:

- employee internal cost profile
- Pontaj / attendance
- permissions (auth role ≠ skill)
- actual work (Execution sessions)

Do not put named employees on product templates. Templates may require a skill or station class.

## Machines / Utilaje

Foundation implemented. See `docs/architecture/WORKCENTERS_AND_MACHINES_CANON.md`.

Processes must require a **capability class**, not a hardcoded machine identity. The live shop-floor map includes the accepted assembly tables plus real welding, metal-cutting, CNC, forming, electrical, print and related stations. Those real capabilities now have reusable Operational Processes. Capacity planning is not implemented.

```text
OperationalProcess → requires Capability class
Workcenter / Machine → provides Capability class
Execution (later) → may pin a concrete provider
```

Do not put machine SKU on ProductTemplate or EIC.

Architectural `capabilities.ts` IDs are **system ownership**, not shop-floor machine capabilities. Do not conflate the two.

## Pontaj

Not implemented. Pontaj must not become isolated timesheet data that prices products.

```text
Employee
→ Execution task / operation
→ time actual
→ optional Machine / Workcenter
→ actual labor cost signal (internal)
```

Distinguish planned duration from actual worked time.

Time is not the default technical or commercial pricing authority. Labor recipes stay in Resources / Cost. Attendance stays in People. Task sessions stay in Execution.

## Execution

Read-only preview, Accepted Production Snapshot, persisted ExecutionPlan / ExecutionTasks, provider assignment, the minimal task lifecycle, minimal completion evidence, explicit task executor assignment, actual resource consumption, and actual internal cost projection are IMPLEMENTED_CURRENT. Inventory stock identity and movements are IMPLEMENTED_CURRENT / BASIC. Scheduling, capacity, reservations, purchasing, and MachineRun remain NOT_IMPLEMENTED.

Preview feed:

```text
Confirmed Product Truth
→ ProductAggregate
→ Process Composition
→ Execution Plan Preview
```

Accepted freeze:

```text
Confirmed Product Truth
→ Accepted Production Snapshot
```

Future persisted feed:

```text
Accepted Production Snapshot
→ ExecutionPlan
→ Tasks / Operations
→ Employee assignment
→ Machine / Workcenter allocation
→ Pontaj / actuals
→ actual cost
→ Reporting
```

The preview consumes current confirmed Product Truth because it is deterministic and non-persistent. Persisted Execution must consume the accepted production snapshot. It does not rebuild Product Truth and does not reprice accepted commercial totals. This snapshot is not a customer Order.

## Commercial

Price rules, Quote Snapshot, Quote Acceptance, Order Snapshot, frozen production-input alignment, Production Release from Order, and ExecutionPlan from that Release are implemented. Plan creation remains a separate operator action after Release. CommercialRequest records the incoming ask before Product Truth exists and may link to frozen Quotes without changing them. See `docs/architecture/COMMERCIAL_REQUEST_CANON.md`.

```text
CommercialRequest
→ choose Product
→ confirmed Product Truth
→ Aggregate
→ planned EIC
→ Commercial Price Rules
→ customer price projection
→ Quote Snapshot + FrozenProductionInput
→ Request↔Quote link
→ Quote Acceptance Decision
→ Order Snapshot copies FrozenProductionInput
→ Production Release Snapshot
→ ExecutionPlan
```

Quote Snapshot does not require Production Snapshot.
Company policy V1: EUR, markup 35%, VAT 21%, rounding 0.01. Discount and adjustment reserved at 0.
Commercial consumes only planned EIC `{ total, currency, completeness }`.
PARTIAL EIC keeps Commercial PARTIAL and cannot freeze a quote.
The live projection is current-policy output. The Quote Snapshot is frozen historical evidence.

EIC ≠ customer price. Product Truth confirmation ≠ Quote Snapshot. `reviewId` ≠ commercial freeze.
See `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md` and `docs/architecture/QUOTE_SNAPSHOT_CANON.md`.

## Reporting

Reporting is projection only. Likely later views: production status, employee productivity, machine utilization, internal cost, order profitability, work-in-progress.

Reports must not write business truth, reprice quotes, or become a second calculator.

## Cross-system relationship graph

```text
ProductTemplate
  → ComponentVariant
    → TechnicalSettings
    → calculate()
      → ResourceRequirements
        → Resources
          → Cost evidence
            → EIC

ProductTemplate + FormSchema
  → ProductDefinition
    → ProductTruth
      → ProductAggregate
        → EIC

ProductTruth + planned EIC + Commercial rules
  → customer price projection
  → Quote Snapshot + FrozenProductionInput
  → Quote Acceptance Decision
    → Order Snapshot copies FrozenProductionInput
      → Production Release Snapshot
        → ExecutionPlan
        → Tasks / Operations
          → Employee assignment
          → Machine / Workcenter allocation
            → Pontaj / Execution actuals
              → actual cost
                → Reporting
```

Ownership arrows: Product System owns composition and settings; component contracts own calculation; Resources own rates; Commercial owns customer price; Execution owns plan and actuals; People own attendance; Reporting owns none of those facts.

## Administration model

Do not add a top-nav link per domain.

Current primary nav stays small so later domains do not accumulate in the header:

- Lucrări
- Comercial
- Produse
- Administrare

Brand `WorkOS Final` and **Lucrări** return to the operational job overview (`/`). **Comercial** is active on `/requests`, `/quotes` and `/clients`, with secondary Cereri / Oferte / Clienți. Stare sistem is `/system`, reached from Administrare. Inspection surfaces stay reachable from Administrare, not from the top bar. Lucrări is a read-only projection: Order Snapshot is the commercial job root. Cereri is mutable office truth about what the client asked. Oferte is a read-only projection of Quote Snapshots. Clienți / Client Workspace project current Customer plus those existing records by `customerId`. None of these owns a second Quote or Order status table.

Inside Administrare, group only real current pages:

```text
Administrare
├── Comercial
│   ├── Date firmă
│   └── Clienți
├── Operațiuni
│   └── Persoane
├── Atelier
│   ├── Resurse și cost intern
│   ├── Stoc
│   ├── Procese operaționale
│   └── Utilaje și zone
└── Sistem
    ├── Sistem produs
    ├── Module și componente
    ├── Guvernanța sistemului
    └── Stare sistem
```

Do not add an empty Producție page or an Execution top-nav item. Lucrări is the operator landing for real commercial jobs. The job workspace is `/execution/:planId`, reached from Lucrări or the product path via **Deschide execuția**. Pontaj and platform Settings stay off this catalog until they have real truth. Utilaje și zone is present because the capability-provider model exists. Do not invent machines to fill the catalog.

## Operator vs admin surfaces

| Kind | Use | Current / future example |
|---|---|---|
| Operator | Daily workflow | `/` Lucrări → product continue or `/execution/:planId` |
| Owner projection | System honesty / inspection | `/components`, `/governance` |
| Admin | Configure or inspect system truth | `/admin` — Product System display-label write; Resources, Stoc, Processes and Workcenters inspection |

Do not mix system configuration into daily workflow.

Pontaj entry is operator. People definitions are admin.
Product configuration is operator. Template and LED pitch are admin.
Task board is operator. Execution planning policy is admin.

## Settings ownership strategy

Each domain owns its settings.

| Example | Owner |
|---|---|
| LED pitch, PSU reserve | Product System / component variant |
| Waste / tolerance later | Product System / that component variant |
| Purchase rates | Resources / Cost |
| Machine capacity parameters | Machines / Workcenters |
| Employee cost profile / availability rules | People |
| Planning policy parameters | Execution |
| Pontaj rounding / allowed rules | People / Pontaj |
| Commercial markup / VAT | Commercial company policy |

A higher-level Administrare area may **navigate** these settings. It must not **own** them.

Do not create one gigantic Settings page.

## Lifecycle / retire / delete

Default: `DRAFT` → `ACTIVE` → `RETIRED`.

Hard delete only if no ProductTruth, Order Snapshot, ExecutionPlan, or other business record references the entity.

Settings versions: keep previous active values as history after a new version is saved. Do not silently mutate a value already frozen into a snapshot.

## Current / foundation / planned / rejected

| System | Classification |
|---|---|
| Product catalog, first template, form, compiler, aggregate | IMPLEMENTED_CURRENT |
| Second product ACM cassette vertical slice | IMPLEMENTED_CURRENT / BASIC / EIC COMPLETE / QUOTE READY |
| Component-first FACE / VOLUME / BACK / LIGHTING roles + constructive types | IMPLEMENTED_CURRENT |
| Product System component configuration law (role / type / configuration) | IMPLEMENTED_CURRENT |
| Component technical settings (typed, read-only projection) | IMPLEMENTED_CURRENT |
| Owner surfaces `/components`, `/governance` | IMPLEMENTED_CURRENT |
| Product System administration foundation (inspection on `/components`) | IMPLEMENTED_CURRENT |
| Product System persisted display-label write + `/admin` | IMPLEMENTED_CURRENT |
| Pilot resource catalog + partial EIC | FOUNDATION_ONLY |
| Settings edit / persistence / versioning | PLANNED |
| Global Administrare nav / display-label write | IMPLEMENTED_CURRENT |
| Operational Processes foundation (typed catalog + capability class) | DONE / FOUNDATION |
| Process admin write, labor recipes | PLANNED / NOT_IMPLEMENTED |
| Workcenters / Machines capability-provider foundation | DONE / FOUNDATION |
| Capacity planning, scheduling, MachineRun | NOT_IMPLEMENTED |
| Execution Plan Preview | IMPLEMENTED_CURRENT |
| Accepted Production Snapshot | IMPLEMENTED_CURRENT |
| Persisted ExecutionPlan / ExecutionTasks | IMPLEMENTED_CURRENT |
| Provider assignment + minimal task lifecycle | IMPLEMENTED_CURRENT / BASIC |
| Completion evidence | IMPLEMENTED_CURRENT / BASIC |
| People operational identity + task executor | IMPLEMENTED_CURRENT / BASIC |
| People skills + operational availability + eligibility | IMPLEMENTED_CURRENT / BASIC |
| LETTERS reachable execution DAG | IMPLEMENTED_CURRENT / 12 of 12 executable path |
| Actual resource consumption | IMPLEMENTED_CURRENT / BASIC |
| Inventory stock identity and movements | IMPLEMENTED_CURRENT / BASIC |
| Actual internal cost projection | IMPLEMENTED_CURRENT / BASIC |
| HR, Pontaj, reservations, purchasing | PLANNED |
| Commercial price rules | IMPLEMENTED_CURRENT / BASIC |
| Quote Snapshot | IMPLEMENTED_CURRENT / BASIC |
| Commercial Request (Cereri de ofertă) | IMPLEMENTED_CURRENT / BASIC |
| Client Workspace | IMPLEMENTED_CURRENT / BASIC |
| Quote Document PDF | IMPLEMENTED_CURRENT / BASIC |
| Quote Acceptance | IMPLEMENTED_CURRENT / BASIC |
| Order Snapshot | IMPLEMENTED_CURRENT / BASIC |
| Frozen production input | IMPLEMENTED_CURRENT / BASIC |
| Production Release from Order | IMPLEMENTED_CURRENT / BASIC |
| Execution from Order Release | IMPLEMENTED_CURRENT / BASIC |
| Execution workspace | IMPLEMENTED_CURRENT / BASIC |
| Quote Document PDF (Ofertă) | IMPLEMENTED_CURRENT / BASIC |
| Reporting, Order/invoice/production documents | PLANNED |
| Analyzer runtime | PLANNED / NOT_IMPLEMENTED |
| Capability kernel promotion to ACTIVE | FOUNDATION_ONLY (IDs frozen) |
| CostEngine / QuoteOrchestrator / unified Pricing UI | REJECTED_LEGACY_PATTERN |
| Parallel product calculators / Intake V2–V6 quote paths | REJECTED_LEGACY_PATTERN |
| Docs-owned adjustable values | REJECTED_LEGACY_PATTERN |
| Dossier as technical authority | REJECTED_LEGACY_PATTERN |
| HR hourly or pontaj as commercial price | REJECTED_LEGACY_PATTERN |
| Machine SKU on product / process | REJECTED_LEGACY_PATTERN |
| Giant Settings page owning all domains | REJECTED_LEGACY_PATTERN |
| Intake task dry-run as ExecutionPlan | REJECTED_LEGACY_PATTERN |
| Fake admin Edit/Save without persistence | REJECTED_LEGACY_PATTERN |

## Legacy lessons — do not recreate

Evidence from `office952/workos-vscode` and `office952/workflow-adv` contracts:

- Duplicate pricing authorities (CostEngine, QuoteOrchestrator, intake quote bridges, pricing registry)
- Hardcoded dropdown / template-local business truth
- Parallel product calculators and frontend business math
- Docs or dossier as runtime authority
- Disconnected HR / Pontaj used as price
- Machine-specific process coupling and `machine_code ?? machine_type` coalescing
- Three parallel task sources (V3 catalog, dossier rules, product graph)
- 24-item sidebar and a multi-thousand-line Settings page mixing company, cost engine, and integrations

Useful legacy workflows to keep as **concepts**: explicit Product Truth confirm; material price provenance; capability-class assignment; Quote/Order snapshot freeze; operational reports as read-only GET.

## Next implementation order

This map does **not** authorize the next build. Owner GO is still required.

Recommended rank:

1. **Versioned technical-setting write**
   Display-label persistence exists. Settings writes need versioning. Do not treat LED pitch or PSU reserve as automatic.

2. **Lighting Resources / Cost completion**
   PSU reserve is resolved. Lighting quantity uses confirmed volume perimeter. Remaining Lighting gaps are workshop rate calibration, not missing Analyzer geometry.

3. **Lifecycle retire** later, when more live entities exist.

Do not start HR, Pontaj, or Commercial from this operational identity. Persisted Execution now assigns a provider and an executor, then runs a minimal task lifecycle. Capacity planning does not.

## Owner decisions

### Blocking now

1. Authorize the next write: versioned technical settings, Resources foundation, or another Product System metadata field. Do not treat LED pitch as automatic.
2. Persistence is now bounded Product System display metadata. Do not grow it into a universal business database without Owner GO.

### Can defer

- LED module wattage, geometric basis for module quantity, and PSU catalog policy
- HR / Pontaj after operational identity exists
- Attendance model (exception calendar vs daily grid)
- Confirmed live workcenter / machine identities, if any
- Capacity model after provider identities exist
- Commercial measurement rules and snapshot schema
- When to promote capability kernel statuses from PLANNED to ACTIVE
