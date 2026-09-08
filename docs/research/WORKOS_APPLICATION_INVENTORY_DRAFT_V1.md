# WorkOS — Application Inventory Draft V1

**Status:** `ACTIVE_RESEARCH_EVIDENCE / DRAFT_FOR_APPLICATION_MAP`  
**Date:** 2026-09-09  
**Authority:** none. This is research evidence only. Current runtime, living roadmap and current canons win.  
**Parent research:** `docs/research/WORKOS_OLD_NEW_POSTMORTEM_AND_MINIMUM_USEFUL_V1.md`

## Purpose

This inventory is the bridge between:

```text
OLD forensic evidence
+ CURRENT WorkOS Final routes/runtime
+ CURRENT domain canon
+ Owner-approved Minimum Useful WorkOS direction
↓
FINAL APPLICATION MAP / FLOWCHART
```

It does **not** authorize Cursor implementation, Figma screen construction, Cloud mutation or new domains.

## Classification vocabulary

### Delivery class

- `CORE_NOW` — daily surface in the first useful vertical slice.
- `SUPPORT_CORE` — must work/configure the vertical slice but does not need first-wave high-fidelity priority.
- `NEXT` — valuable after the first real job proves the core.
- `LATER` — valid future product area, not required for first useful WorkOS.
- `OPTIONAL` — organization-dependent capability/module.
- `RETIRE` — do not recreate the OLD page/authority as-is.

### Page decision

- `KEEP` — current page job remains valid.
- `REDESIGN` — job remains, current composition is not final.
- `MERGE` — preserve capability but absorb it into another destination/workspace.
- `SPLIT` — old surface mixed jobs that need separate domain ownership.
- `NEW_LATER` — no current page; future page only when evidence justifies it.
- `NO_PAGE` — technical object/state exists without a dedicated destination.
- `RETIRE` — old surface/authority should not return.

## Canonical first useful spine

```text
AUTH
→ CLIENT
→ CERERE
→ CATALOG
→ CONFIGURATOR
→ PRODUCT TRUTH
→ COMMERCIAL PRICE
→ QUOTE SNAPSHOT
→ ACCEPTANCE
→ LUCRARE / ORDER CONTINUITY
→ PRODUCTION RELEASE
→ EXECUTION PLAN
→ ATELIER
→ EXECUTION
→ COMPLETE
→ PLANNED VS ACTUAL
```

Important: `Product Truth`, `Quote Acceptance`, `Order Snapshot`, `Production Release`, `ExecutionPlan` and `Planned vs Actual` are lifecycle/domain objects or sub-surfaces; they do not automatically deserve primary pages.

---

# A. Daily commercial + operational core

| Final destination | OLD source | NEW route | Actor | Job to be done | Domain owner | Class | Page decision | Floorplan | V1 E2E | Key dependency / note |
|---|---|---|---|---|---|---|---|---|---|---|
| Autentificare | OLD auth/login gates | pre-shell `LoginPage` | User | enter authenticated organization safely | Cloud Foundation | SUPPORT_CORE | KEEP / polish later | AUTH | YES | Organization/session truth |
| Clienți | `/clients` | `/clients` | Commercial / Owner | find reusable customer identity and open context | Customer | CORE_NOW | REDESIGN | REGISTRY | YES | Customer identity only; not CRM mega-suite |
| Client | `/clients/:name` | `/clients/*` | Commercial / Owner | see customer + Cereri/Oferte/Lucrări continuity | Customer projection | CORE_NOW | REDESIGN | OBJECT_WORKSPACE | YES | Current reusable customer ≠ frozen quote/order identity |
| Cereri | OLD `/intake` hub | `/requests` | Commercial | work incoming demand and next action | CommercialRequest | CORE_NOW | REDESIGN | REGISTRY / WORKLIST | YES | Replace OLD Intake hub semantics with clear request registry |
| Cerere | OLD `/intake/:id`, Intake V6 context | `/requests/*` | Commercial / Owner | capture mutable customer intent, files, optional service facts and route to configuration | CommercialRequest | CORE_NOW | REDESIGN | OBJECT + JOURNEY | YES | Locks selected facts after first linked Quote per canon |
| Catalog | OLD Product System / Intake product selection | `/products` | Commercial | choose a product/template to configure | Product catalog projection | CORE_NOW | REDESIGN | SELECTION / REGISTRY | YES | Catalog organization ≠ Product technical truth |
| Configurator | OLD Intake V6 operator workspace | `/products/:productCode` | Commercial / technical operator | turn request facts into reviewed ProductDefinition/ProductTruth | Product System + Truth compiler | CORE_NOW | REDESIGN | CONFIGURATOR | YES | Must consume one compiler path; UI never owns formulas |
| Oferte | `/quotes` | `/quotes` | Commercial / Owner | find frozen commercial offers and states | Commercial | CORE_NOW | REDESIGN | REGISTRY / WORKLIST | YES | Snapshot registry, not live repricing hub |
| Ofertă | `/quotes/:id` | `/quotes/*` | Commercial / Owner | inspect frozen offer, acceptance state, customer document and next action | Commercial | CORE_NOW | REDESIGN | OBJECT_WORKSPACE | YES | Customer price and internal economics must remain visually/permission separated |
| Lucrări | OLD `/orders` + execution overview | `/`, `/jobs` | Owner / production | orient around accepted jobs and operational next action | Order-rooted operational projection | CORE_NOW | REDESIGN | REGISTRY / WORKLIST | YES | This replaces separate primary `Comenzi` navigation |
| Lucrare | OLD `/orders/:id` + parts of ExecutionDetail | `/jobs/*` | Owner / production | see commercial lineage, production readiness, operational progress, blockers and actuals | Order-rooted workspace | CORE_NOW | REDESIGN | OBJECT_WORKSPACE | YES | Central continuity workspace; avoid long generic section stack |
| Atelier | OLD `/operator`, parts of Shop Floor/Tablet | `/atelier` | Operator | see eligible/available work and claim/start safe task | Execution projection | CORE_NOW | KEEP DIRECTION / REDESIGN VISUAL | DISPATCH / INBOX | YES | Task inbox, not generic Kanban and not factory map |
| Execuție | OLD `/execution/:id`, `/operator`, `/tablet/*` | `/execution/*` | Operator | work current operation, start/complete, capture quantity/note/actuals | Execution | CORE_NOW | KEEP DIRECTION / REDESIGN VISUAL | FOCUSED_EXECUTION | YES | Same truth for desktop/tablet; no device-specific state machine |

## Core page-count implication

The first high-fidelity daily experience is roughly **12 signed-in surfaces plus authentication**, not the full current 28-composition set and not the OLD route universe.

---

# B. Lifecycle/domain objects that must exist but should not become primary destinations

| Object / state | OLD source | NEW/current truth | Class | Page decision | User-facing home |
|---|---|---|---|---|---|
| ProductDefinition / ProductTruth | Intake V6 + ProductDefinition builder | current compiler/domain | SUPPORT_CORE | NO_PAGE | Configurator / Lucrare lineage |
| ProductAggregate | OLD aggregate/cost-BOM paths | current technical graph/read model | SUPPORT_CORE | NO_PAGE | Configurator/Admin inspection only |
| CommercialPrice result | OLD mixed `/price` | current Commercial domain | CORE_NOW capability | NO_PAGE as separate L1 | Configurator / Ofertă |
| Quote Acceptance Decision | OLD quote actions | current immutable acceptance | CORE_NOW capability | NO_PAGE | Ofertă |
| Order Snapshot | OLD `/orders` | current frozen accepted truth | CORE_NOW capability | NO separate primary page | Lucrare |
| Production Release | OLD execution transition | current Execution domain | CORE_NOW capability | NO_PAGE | Lucrare / next-action control |
| ExecutionPlan | OLD `/execution` planning pages | current plan + tasks | CORE_NOW capability | NO global L1 | Lucrare / Execuție; optional admin/debug projection |
| Actuals | OLD reality review / sessions | current execution actuals | CORE_NOW capability | NO global L1 | Execuție / Lucrare |
| Planned vs Actual | OLD reports/observability | current operational comparison | CORE_NOW minimal | MERGE | Lucrare / execution completion view |
| ProfitabilityAnalysis | OLD target/partial reports | not current full domain | LATER | NEW_LATER | Reporting, Owner-only projection |

---

# C. Administration / configuration surfaces

| Destination | OLD source | NEW route | Actor | Job | Class | Page decision | V1 E2E | Notes |
|---|---|---|---|---|---|---|---|---|
| Administrare | OLD Settings + many registry links | `/admin` | Owner/Admin | find real domain-owned configuration | SUPPORT_CORE | REDESIGN | YES | Local admin navigation allowed; no global Settings dump |
| Date firmă | OLD Settings/Societate | `/admin/seller` | Owner | edit seller identity used by future Quotes | SUPPORT_CORE | KEEP / polish later | YES | Current profile ≠ frozen historical seller |
| Clienți admin | OLD client admin mixed with daily clients | `/admin/customers` | Owner | lifecycle create/rename/retire reusable customer | NEXT / SUPPORT depending setup | REDESIGN / clarify dual door | CONDITIONAL | Daily client work stays `/clients` |
| Oameni | OLD `/employees` | `/admin/people` | Owner/ops admin | manage operational people | SUPPORT_CORE | REDESIGN | YES if execution uses named operators | Operational people ≠ HR employee master |
| Persoană | OLD employee/profile pages | `/admin/people/*` | Owner/ops admin | inspect/update operational identity, assignments | SUPPORT_CORE | REDESIGN | CONDITIONAL | Keep HR fields out until HR module exists |
| Competențe | OLD employee/skill registries | `/admin/people/skills` | Owner/ops admin | manage skill catalog/assignments | SUPPORT_CORE | KEEP / redesign later | CONDITIONAL | Skill ≠ permission; qualification only |
| Resurse și cost intern | OLD Pricing + inventory material cost | `/admin/resources` | Owner | maintain internal resource identity/cost evidence | SUPPORT_CORE | REDESIGN | YES where chosen product/service needs EIC | Never client pricing hub |
| Stoc | OLD `/inventory` | `/admin/stock` | Owner/stock admin | view movements/balance, bounded adjustment | NEXT | KEEP direction / redesign later | NO for first product-only proof | Inventory does not block execution |
| Material stock detail | OLD inventory details | `/admin/stock/:resourceId` | Owner/stock admin | inspect one material balance/history | NEXT | KEEP | NO | Basic stock only |
| Procese operaționale | OLD ProductSystem operational / execution config | `/admin/processes` | Owner/admin | inspect process definitions and capability requirements | SUPPORT_CORE | KEEP direction / redesign later | YES only insofar as product route needs canonical process truth | Process ≠ task instance |
| Utilaje și zone | OLD `/utilaje` + workcenters | `/admin/workcenters` | Owner/ops admin | configure/inspect where work can happen and capability coverage | SUPPORT_CORE | REDESIGN | CONDITIONAL | Machine-strict only; manual areas remain flexible |
| Servicii operaționale | OLD montaj/colaboratori fragments | `/admin/operational-services` | Owner | enable/disable organization service capability/mode | SUPPORT_CORE for service jobs / OPTIONAL generally | KEEP direction | CONDITIONAL | Disabled must not block unrelated product-only jobs |
| Sistem produs | OLD `/product-system/*` studio | `/admin/product-system` | Owner/product admin | manage catalog/template/configuration authority | SUPPORT_CORE engine; NEXT for rich editor | REDESIGN / progressive disclosure | CONDITIONAL | First pilot may not require universal authoring studio |
| Module și componente | OLD Product System modules/blueprints | `/components` | Owner/product admin | inspect component roles/types/contracts | NEXT / INTERNAL | MERGE or keep as inspection | NO | Avoid competing owner catalog with Product System |
| Guvernanță | OLD `/governance` docs UI | `/governance` | Owner/internal | inspect authority, maturity and limits | INTERNAL / LATER | KEEP INTERNAL | NO | Not daily business navigation |
| Stare sistem | OLD modules/health | `/system` | Owner/support | platform health/support inspection | INTERNAL / LATER | KEEP INTERNAL | NO | Low daily priority |

---

# D. OLD-only capability disposition

| OLD capability | OLD routes / evidence | Valuable job | Final decision | Class | Future surface rule |
|---|---|---|---|---|---|
| Control Tower / Dashboard | `/dashboard` | management overview, alerts, throughput | NEW_LATER | LATER | Only after real metrics/history; never mock KPI authority |
| Shop Floor overview | `/shop-floor` | manager sees factory/workcenter state | NEW_LATER | NEXT/LATER | Distinct from Atelier; projection only when execution truth is rich enough |
| Operator page | `/operator` | run assigned/eligible tasks | MERGE | CORE_NOW capability | absorbed by Atelier → Execution |
| Tablet mode | `/tablet/*` | station queue/task execution | MERGE | NEXT presentation | same Execution truth; responsive/kiosk floorplan only |
| Employee Mobile v1/v2 | `/employee-app/*`, `/employee-app-v2/*` | personal task/session client | NEW_LATER / OPTIONAL | LATER/OPTIONAL | same task lifecycle and actuals; no separate backend/state machine |
| Comenzi | `/orders`, `/orders/:id` | accepted work continuity | MERGE | CORE_NOW capability | user-facing home is Lucrări/Lucrare; Order remains domain object |
| Execution dashboard | `/execution` | planning/observability | MERGE / INTERNAL projection | NEXT | job/workshop context should carry daily actions; optional overview later |
| Reality review | `/execution/reality-review` | inspect execution evidence | MERGE / INTERNAL | NEXT/LATER | projection from actuals; not primary daily destination |
| Document Center | `/documents` synthetic list | cross-document discovery | RETIRE old implementation | LATER/OPTIONAL | domain-owned docs now; global DMS only after real cross-domain use case |
| Inventar & OC advanced ideas | `/inventory` mock/real mix | stock/purchasing | SPLIT | NEXT + LATER | Basic stock first; purchasing/reservations/valuation later capabilities |
| Unified Pricing | `/inventory/pricing` | administer materials/rates/markup | RETIRE authority | — | split Resources/Internal Cost vs Commercial rules vs analytics |
| Colaboratori | `/colaboratori` | supplier/subcontractor registry | NEW_LATER | NEXT/OPTIONAL | create when repeated supplier relationship needs a master registry |
| Reports | `/reports` | management summaries | NEW_LATER | LATER | only from real truth; no fallback-as-authority |
| Operational Reports | `/reports/operational` | production completion/task/material metrics | NEW_LATER | NEXT/LATER | projection after enough completed work |
| Employee HR master | `/employees-records/*` | contracts/personnel records | NEW_LATER optional module | LATER/OPTIONAL | distinct from operational Person |
| Pontaj | `/attendance`, effects | attendance/leave/payroll-adjacent | NEW_LATER optional module | LATER/OPTIONAL | never pricing input; distinct from execution sessions |
| Employee payments | `/employee-payments` | salary installment tracking | NEW_LATER optional module | LATER/OPTIONAL | HR/finance module only |
| Employee advances | `/employee-advances` | employee balance ledger | NEW_LATER optional module | LATER/OPTIONAL | HR/finance module only |
| Module Chain | `/modules` | system health/debug | RETIRE as business nav | INTERNAL | platform/support diagnostics only |
| Global Settings | `/settings` | miscellaneous config | RETIRE concept | — | configuration stays with owning domains |
| Demo routes | `/demo/*` | development proof | RETIRE from application map | INTERNAL | evidence/dev only, never user IA |
| Legacy Intake V3/V4/V5 | parallel intake routes | compatibility | RETIRE | — | keep only historical evidence after canonical path proven |
| Legacy `/price` / mixed cost-plus | old quote pricing paths | compatibility | RETIRE | — | no new canonical quote path may depend on it |

---

# E. Future capability map — present in canon or justified by OLD evidence, but not current daily pages

| Capability | Current status direction | Class | Page strategy |
|---|---|---|---|
| CRM contacts / billing profile | not implemented | LATER/OPTIONAL | extend Client only when real CRM job emerges; avoid empty tabs |
| Supplier master | no canonical full registry | NEXT/OPTIONAL | Admin/Resources or dedicated supplier registry only when repeated use requires lifecycle |
| Purchasing | not implemented | LATER/OPTIONAL | Inventory Advanced; not required to quote/execute |
| Reservations | not implemented | LATER/OPTIONAL | Inventory Advanced |
| Warehouses | not implemented | LATER/OPTIONAL | Inventory Advanced |
| Inventory valuation/FIFO | not implemented | LATER/OPTIONAL | Finance/Inventory projection |
| Machine capacity calendar | not implemented | LATER/OPTIONAL | Machines Advanced; warnings/planning, not commercial blocker |
| Maintenance | not implemented as full product | LATER/OPTIONAL | Machines Advanced |
| HR employee master | not implemented in Final | LATER/OPTIONAL | People-side optional module |
| Pontaj / attendance | not implemented in Final | LATER/OPTIONAL | separate from execution sessions |
| Payroll/payments/advances | not implemented | LATER/OPTIONAL | optional HR/finance extension |
| Employee Mobile | not implemented in Final | LATER/OPTIONAL | execution client only after task/session model stable |
| Field execution | operational services OS-S8 direction | NEXT for installation companies | same Execution model with package kind/site context; not separate product universe |
| Service actuals | OS-S9 direction | NEXT after field execution | Execution actuals extension |
| Profitability | planned / not complete | LATER | Reporting projection; never reprices Quote |
| Reporting Center | planned | LATER | projections over canonical facts only |
| Global DMS | not implemented | LATER/OPTIONAL | only after real cross-domain document need |
| Invoice system | not implemented | LATER/OPTIONAL | Commercial/finance domain, not Quote PDF renamed |
| Home / Control Tower | no accepted current Home contract | LATER | build only with proven daily cross-domain job; `/` remains Lucrări until explicit contract |

---

# F. First-use scope gates

## Product-only real job — shortest honest proof

Required:

```text
Login
→ Client
→ Cerere
→ Catalog
→ Configurator
→ Commercial Price
→ Quote
→ Acceptance
→ Lucrare
→ Release/Plan
→ Atelier
→ Execution
→ Complete
→ Planned vs Actual
```

Required admin truth is only the subset used by the selected product: seller, people/operator identity, product truth, required processes, required machine/work-area capability, and required resource/cost evidence.

Not required before this proof:

```text
HR
Pontaj
Payments
Employee Mobile
Purchasing
Reservations
Warehouse
Valuation
Global DMS
Reporting Center
Profitability
Control Tower
advanced capacity scheduling
```

## Installation-inclusive real job — richer proof

Adds:

```text
organization operational-service mode
→ Request service selection/facts
→ service EIC
→ service commercial line
→ multi-line frozen Quote
→ Order service truth
→ field execution package
→ field/service actuals
```

Do not remove real installation truth from an existing request merely to shorten the test.

---

# G. Application-map lanes to draw after Design Bible closure

Recommended FigJam/application-map lanes:

```text
COMMERCIAL
Client → Cerere → Catalog → Configurator → Ofertă → Acceptare

ORDER / WORK
Order Snapshot → Lucrare → Production Release → ExecutionPlan

OPERATIONS
Atelier → Execuție → Actuals → Planned vs Actual

FOUNDATION / ADMIN
Seller
Customer admin
Product System
Resources / internal cost
Stock
Processes
Machines / workcenters
People / skills
Operational services
Governance / system support

FUTURE / OPTIONAL
Shop Floor overview
Supplier master
Inventory Advanced
Field execution
HR / Pontaj
Employee Mobile
Reporting / Profitability
Documents / Invoicing
Control Tower
```

The visual map must distinguish **page nodes** from **domain/state nodes**. Do not draw every box as a clickable screen.

---

# H. Remaining unresolved research before flowchart is final

1. Exact owner/member/internal-cost visibility rules on `Ofertă` and `Lucrare`.
2. Which current Admin mutations are complete enough for general-customer self-operation versus remaining `ADMIN_TOOLING_DEBT`.
3. How much Product System authoring must exist for a second/third organization without source edits.
4. Exact field execution minimum for installation-inclusive completion.
5. Whether Shop Floor overview earns `NEXT` immediately after first real job or stays `LATER`.
6. Tablet/kiosk breakpoints and context after observation in the real workshop.
7. Supplier master trigger: number/repetition of subcontract relationships that justifies a first-class registry.
8. Final route/name choice for any future Reporting surface.

## Stop rule

Until Design Bible + this inventory + final Application Map are accepted:

```text
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
FIGMA_APPLICATION_SCREENS = HOLD
NEW_DOMAIN = HOLD
REAL_CLOUD_MUTATION = OWNER_GATE_ONLY
```

Research/documentation may continue.