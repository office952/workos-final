# WorkOS — Page × Actor × Floorplan × Lifecycle × Priority Matrix V1

**Status:** `ACTIVE_RESEARCH_EVIDENCE / RECONCILED_WORKING_MATRIX`  
**Date:** 2026-09-09  
**Authority:** none. Current runtime, living roadmap, current canons, and explicit Owner decisions win.  
**Research parents:**

- `WORKOS_OLD_NEW_POSTMORTEM_AND_MINIMUM_USEFUL_V1.md`
- `WORKOS_APPLICATION_INVENTORY_DRAFT_V1.md`
- `WORKOS_APPLICATION_MAP_OPEN_QUESTIONS_CHECKPOINT_V1.md`

This matrix is the working bridge to the final Application Map. It does **not** authorize Cursor product implementation, Figma application-screen construction, real Cloud mutation, a new domain, or a route migration.

---

# 0. Current decision frame

```text
PRODUCT_GOAL
= shortest honest route to a useful WorkOS

FIRST_PROOF
= one real product-only job end-to-end

FULL_APPLICATION_MAP
= complete enough to prevent architectural drift

FIRST_IMPLEMENTATION_SCOPE
!= full application map

GLOBAL_L1_SIDEBAR
= NO

CURRENT_RUNTIME_UI
= reference + constraint

CURRENT_PAGE_COMPOSITION
= not mandatory migration base
```

Current WorkOS Final is a clean reconstruction. OLD remains forensic/business evidence; it is not an architecture to recreate. Current source exposes the signed-in route families `Clienți`, `Cereri`, `Oferte`, `Catalog/Configurator`, `Lucrări`, `Atelier/Execuție`, plus Administration. `/` is currently an alias of `Lucrări`; there is no accepted Home page contract.

---

# 1. Truth and actor model used by this matrix

## Actors

```text
OWNER
= Cloud membership owner
= commercial + internal economics + administration

COMMERCIAL_MEMBER
= Cloud membership member used in commercial/job read models
= customer commercial value, no internal economics

PRODUCTION_COORDINATOR
= authenticated operational/commercial user using Lucrare
= not a new Cloud role in V1

OPERATOR
= operational Person identified by OperatorSession/PIN
= orthogonal to Cloud membership
= no financial payload in Atelier/Execution

SUPPORT_INTERNAL
= Owner/support inspection of Governance/System
= not a new persisted business role
```

Do not invent a `seller` user role. Seller is company identity, not user authorization.

## Evidence classes

- `CANONICAL` — current domain/route/access contract.
- `RUNTIME_SOURCE` — current source behavior.
- `OWNER_DIRECTION` — explicit accepted direction in the active program.
- `INFERRED_PRODUCT_DECISION` — independent synthesis; must remain amendable until Application Map acceptance.
- `FUTURE_TARGET` — valid target not implemented now.

---

# 2. Small floorplan vocabulary

The final UI should use a small family rather than one layout per route.

| Floorplan | Purpose | Typical examples |
|---|---|---|
| `AUTH_GATE` | enter/recover session with minimal chrome | Login |
| `REGISTRY_WORKLIST` | compare many objects, filter, search, see next action | Clienți, Cereri, Oferte, Lucrări |
| `OBJECT_WORKSPACE` | understand one business object, state, lineage, next action | Client, Cerere, Ofertă, Lucrare |
| `SELECTION_CATALOG` | choose an available commercial/product option | Catalog |
| `CONFIGURATION_WORKSPACE` | make bounded configuration decisions and review compiled truth | Configurator |
| `DISPATCH_INBOX` | see executable/blocked/waiting work by operator relevance | Atelier |
| `FOCUSED_EXECUTION` | execute one plan/task safely with reduced chrome | Execuție |
| `ADMIN_COLLECTION` | domain-owned configuration/registry with local Admin navigation | Seller, People, Skills, Resources, Stock, Services |
| `ADMIN_INSPECTION` | read canonical structure/configuration that is not yet generally writable | Processes, Workcenters, parts of Product System |
| `PROJECTION_REPORT` | read-only cross-object projection built only from canonical facts | future Shop Floor, Reports, Profitability |
| `SYSTEM_INSPECTION` | platform authority/health, not daily business work | Governance, System |

Subtypes may create page character, but they must not create a second global layout system.

---

# 3. Core page matrix — first useful WorkOS

`FIGMA_A` is the first screen-design program after Design Bible + Application Map acceptance. It is intentionally much smaller than the whole product.

| ID | Final surface | Current route | Node type | Primary actor | Primary user job | Lifecycle lane | Floorplan | Delivery class | Page decision | Global placement | First real E2E | Figma priority | General-customer dependency |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C01 | Autentificare | AppGate / `LoginPage` | PAGE | OWNER / COMMERCIAL_MEMBER | enter the correct organization safely | Foundation | AUTH_GATE | SUPPORT_CORE | KEEP, polish later | pre-shell | YES | `FIGMA_A5_SUPPORT` | auth/org provisioning |
| C02 | Clienți | `/clients` | PAGE | COMMERCIAL_MEMBER / OWNER | find customer, create customer, see activity/attention | Commercial | REGISTRY_WORKLIST | CORE_NOW | KEEP + REDESIGN | DAILY_GLOBAL_CANDIDATE | YES | `FIGMA_A1_REGISTRIES` | customer read/write policy |
| C03 | Client | `/clients/*` | PAGE | COMMERCIAL_MEMBER / OWNER | maintain current profile and continue Cereri/Oferte/Lucrări | Commercial | OBJECT_WORKSPACE | CORE_NOW | KEEP + REDESIGN; absorb lifecycle actions over time | contextual under Clienți | YES | `FIGMA_A2_OBJECTS` | immutable historical snapshots stay separate |
| C04 | Cereri | `/requests` | PAGE | COMMERCIAL_MEMBER / OWNER | work incoming demand and next action | Commercial | REGISTRY_WORKLIST | CORE_NOW | KEEP + REDESIGN | DAILY_GLOBAL_CANDIDATE | YES | `FIGMA_A1_REGISTRIES` | CommercialRequest |
| C05 | Cerere | `/requests/*` | PAGE | COMMERCIAL_MEMBER / OWNER | capture mutable customer intent, files, service facts; route to configuration | Commercial | OBJECT_WORKSPACE | CORE_NOW | KEEP + REDESIGN | contextual under Cereri | YES | `FIGMA_A2_OBJECTS` | selected facts lock after linked Quote |
| C06 | Catalog | `/products` | PAGE | COMMERCIAL_MEMBER / OWNER | choose product/template to configure | Commercial | SELECTION_CATALOG | CORE_NOW | KEEP + REDESIGN | DAILY_GLOBAL_CANDIDATE | YES | `FIGMA_A3_COMMERCIAL_SPECIAL` | catalog availability only; not Product System admin |
| C07 | Configurator | `/products/:productCode` + continuation query | PAGE | COMMERCIAL_MEMBER / OWNER | transform request/order context into reviewed Product Truth and commercial continuation | Commercial → Product truth | CONFIGURATION_WORKSPACE | CORE_NOW | KEEP + REDESIGN | contextual from Cerere/Catalog/Lucrare | YES | `FIGMA_A3_COMMERCIAL_SPECIAL` | canonical compiler, current template, required cost evidence |
| C08 | Oferte | `/quotes` | PAGE | COMMERCIAL_MEMBER / OWNER | find frozen offers and see commercial next action | Commercial | REGISTRY_WORKLIST | CORE_NOW | KEEP + REDESIGN | DAILY_GLOBAL_CANDIDATE | YES | `FIGMA_A1_REGISTRIES` | immutable Quote Snapshot |
| C09 | Ofertă | `/quotes/*` | PAGE | COMMERCIAL_MEMBER / OWNER | inspect frozen offer, accept, create Order, open resulting Lucrare | Commercial | OBJECT_WORKSPACE | CORE_NOW | KEEP + REDESIGN | contextual under Oferte | YES | `FIGMA_A2_OBJECTS` | scoped money payload; no repricing |
| C10 | Lucrări | `/`, `/jobs` | PAGE | PRODUCTION_COORDINATOR / OWNER / COMMERCIAL_MEMBER | find accepted work, attention and next action | Order / Work | REGISTRY_WORKLIST | CORE_NOW | KEEP + REDESIGN | DAILY_GLOBAL_CANDIDATE; `/` remains alias | YES | `FIGMA_A1_REGISTRIES` | Order-rooted job projection |
| C11 | Lucrare | `/jobs/*` | PAGE | PRODUCTION_COORDINATOR / OWNER | understand lineage, readiness, progress, blockers and operational next action | Order / Work / Operations bridge | OBJECT_WORKSPACE | CORE_NOW | KEEP + REDESIGN; central operational workspace | contextual under Lucrări | YES | `FIGMA_A2_OBJECTS` | Order Snapshot + optional Release/Plan/Actuals |
| C12 | Atelier | `/atelier` | PAGE | OPERATOR | identify and see blocked/startable/in-progress/waiting work | Operations | DISPATCH_INBOX | CORE_NOW | KEEP DIRECTION + REDESIGN VISUAL | DAILY_GLOBAL_CANDIDATE | YES | `FIGMA_A4_OPERATIONS` | People/skills/availability + plan/task truth |
| C13 | Execuție | `/execution/*` | PAGE | OPERATOR | work the focused plan/task; assign where allowed; start/complete; capture actuals | Operations | FOCUSED_EXECUTION | CORE_NOW | KEEP DIRECTION + REDESIGN VISUAL | contextual from Atelier/Lucrare | YES | `FIGMA_A4_OPERATIONS` | ExecutionPlan + operator session + machine gate where required |

## Working daily-global hypothesis

Until the final Application Map is Owner-accepted, the strongest daily destination set is:

```text
Clienți
Cereri
Oferte
Catalog
Lucrări
Atelier
```

`Execuție` is contextual, not an independent global destination. `Configurator` is contextual. `Client`, `Cerere`, `Ofertă`, `Lucrare` are object destinations. `Administrare` is a quiet utility/domain entry with local navigation, not a global L1 sidebar.

This is a **working Application Map decision**, not authorization to change current navigation.

---

# 4. Lifecycle nodes/sub-surfaces — important truth, not primary pages

| ID | Domain/state node | User-facing home | Node kind | Primary actor | Lifecycle | First useful V1 | Dedicated global page? | Decision |
|---|---|---|---|---|---|---|---|---|
| L01 | ProductDefinition / Product Truth | Configurator; lineage in Lucrare | DOMAIN_OBJECT | COMMERCIAL_MEMBER / OWNER | configuration | YES | NO | compiled truth, not navigation |
| L02 | ProductAggregate | Configurator/Admin inspection | DOMAIN_OBJECT | OWNER / product admin | technical compile | YES | NO | orchestration/read model only |
| L03 | EIC / planned internal estimate | Configurator Owner view; frozen snapshots | DOMAIN_OBJECT | OWNER | cost | YES | NO | internal economics, never customer-price owner |
| L04 | Commercial Price result | Configurator / Ofertă | DOMAIN_OBJECT | COMMERCIAL_MEMBER / OWNER | commercial | YES | NO | commercial output, no unified Pricing page |
| L05 | Quote Acceptance Decision | Ofertă | STATE_TRANSITION | COMMERCIAL_MEMBER / OWNER according to existing gate | commercial | YES | NO | explicit consequence on frozen Quote |
| L06 | Order Snapshot | Lucrare | DOMAIN_OBJECT | PRODUCTION_COORDINATOR / OWNER | order | YES | NO separate `Comenzi` L1 | frozen root; `jobId = orderSnapshotId` |
| L07 | Production Release | Lucrare | STATE_TRANSITION / SNAPSHOT | PRODUCTION_COORDINATOR | production | YES | NO | next-action control |
| L08 | ExecutionPlan | Lucrare + Execuție | DOMAIN_OBJECT | PRODUCTION_COORDINATOR / OPERATOR | operations | YES | NO global L1 | tasks only after frozen Order/Release |
| L09 | Task assignment / provider gate | Execuție | SUBSURFACE | OPERATOR / coordinator | operations | CONDITIONAL | NO | strict only where capability requires it |
| L10 | Actuals | Execuție; summary in Lucrare | DOMAIN_OBJECT | OPERATOR / OWNER | operations | YES minimal | NO | reality capture, never Quote repricing |
| L11 | Planned vs Actual | Execuție/Lucrare | SUBSURFACE / PROJECTION | OWNER / coordinator; operator only nonfinancial operational facts | feedback | YES minimal | NO | first feedback loop |
| L12 | Profitability | future Reporting | PROJECTION | OWNER | feedback | NO | FUTURE | frozen sold value vs planned EIC vs actual cost; read-only |

Application Map must draw these with a different node style from clickable pages.

---

# 5. Support-core Administration matrix

These surfaces support the first vertical. High-fidelity daily-core polish does not require redesigning all of them before first use.

| ID | Surface | Current route | Primary actor | Job | Floorplan | Current mutability | Class | First product-only job | General customer | Working decision |
|---|---|---|---|---|---|---|---|---|---|---|
| A01 | Administrare | `/admin` | OWNER | find domain-owned configuration | ADMIN_COLLECTION index | navigation | SUPPORT_CORE | YES access | YES | KEEP + REDESIGN local Admin navigation only |
| A02 | Date firmă | `/admin/seller` | OWNER | maintain seller identity for new Quotes | ADMIN_COLLECTION | WRITE | SUPPORT_CORE | YES | YES | KEEP; historical Quotes unaffected |
| A03 | Oameni | `/admin/people` | OWNER | create/manage operational people | ADMIN_COLLECTION | WRITE | SUPPORT_CORE | YES if named operator needed | YES | KEEP; final label `Oameni`, not HR-like `Angajați` |
| A04 | Persoană | `/admin/people/*` | OWNER | name, PIN, availability, skills, retire | ADMIN_COLLECTION detail | WRITE | SUPPORT_CORE | YES if named operator needed | YES | KEEP; PIN ≠ account ≠ pontaj |
| A05 | Competențe | `/admin/people/skills` | OWNER | create/retire skills; eligibility support | ADMIN_COLLECTION | WRITE | SUPPORT_CORE | CONDITIONAL | YES | KEEP; skill ≠ permission |
| A06 | Resurse și cost intern | `/admin/resources` | OWNER | maintain resources view and confirmed internal cost evidence | ADMIN_COLLECTION / master-detail | COST WRITE; resource/recipe authoring incomplete | SUPPORT_CORE | YES for used EIC | PARTIAL | KEEP + REDESIGN; never commercial pricing hub |
| A07 | Procese operaționale | `/admin/processes` | OWNER | inspect canonical processes/capability needs | ADMIN_INSPECTION | READ_ONLY | SUPPORT_CORE | YES as truth, not edit | PARTIAL/BLOCKER if org-specific editing needed | KEEP read-only now; authoring NEXT only if variability is real |
| A08 | Utilaje și zone | `/admin/workcenters` | OWNER | inspect capability providers/work areas | ADMIN_INSPECTION | READ_ONLY | SUPPORT_CORE | CONDITIONAL machine-strict | PARTIAL/BLOCKER for new-org setup | KEEP; general configuration NEXT |
| A09 | Servicii operaționale | `/admin/operational-services` | OWNER | configure what organization offers: disabled/internal/subcontracted/both | ADMIN_COLLECTION | WRITE | OPTIONAL_SUPPORT_CORE | NO for product-only | YES for installation org | KEEP; disabled silent for unrelated work |
| A10 | Sistem produs | `/admin/product-system` | OWNER / product admin | inspect catalog/product authority; edit supported labels | ADMIN_INSPECTION → future ADMIN_COLLECTION | display-label WRITE; technical authoring incomplete | SUPPORT_CORE engine / NEXT editor | existing pilot truth sufficient | GENERAL_CUSTOMER_BLOCKER | KEEP + progressive disclosure; rich authoring NEXT |

## General-customer configuration debt

The critical debt discovered by this audit is:

```text
PRODUCT_SYSTEM controlled authoring/versioning
+
MACHINE / WORK-AREA organization setup where strict capability exists
+
PROCESS configuration only where organization variability is proven
```

This does **not** justify blocking the first HUB MEDIA product-only E2E when the necessary canonical truth already exists.

It **does** block calling WorkOS generally self-configurable for arbitrary new production organizations.

---

# 6. Current pages that should not remain independent final product destinations

| ID | Current surface | Current route | Current useful behavior | Decision | Timing | Rationale |
|---|---|---|---|---|---|---|
| M01 | Clienți admin | `/admin/customers` | create/rename/retire reusable customer | `MERGE → Clienți/Client`, then retire duplicate door | NEXT after core | daily `/clients` already creates and Client edits profile; lifecycle management belongs with Customer, not a duplicate Admin product |
| M02 | Module și componente | `/components` | inspect roles/component types/settings projection | `MERGE AS LOCAL PRODUCT SYSTEM INSPECTION` | NEXT | avoid second owner catalog competing with Product System |
| M03 | Guvernanță | `/governance` | authority/maturity/limits | `INTERNAL SYSTEM INSPECTION` | LATER/INTERNAL | not daily business navigation |
| M04 | Stare sistem | `/system` | health/support inspection | `INTERNAL SYSTEM INSPECTION` | LATER/INTERNAL | platform support, not business workflow |
| M05 | Stoc | `/admin/stock` | balance + movements + manual adjustments | KEEP capability, not first high-fidelity core | NEXT | Inventory BASIC is useful but must not gate quote/execution |
| M06 | Stock material detail | `/admin/stock/:resourceId` | item movements/adjustments | KEEP contextual under Stoc | NEXT | no need in first product-only UI wave |

### Customer duplicate-door note

Current `/clients` already supports `Client nou`, and `/clients/:id` edits the current customer profile. `/admin/customers` still owns lifecycle rename/retire behavior. The final product should converge on **one Customer ownership surface** rather than two equal user doors. Until the merge is safely implemented, current routes may remain; this research does not authorize removal.

---

# 7. Current navigation placeholders — do not surface as empty final navigation

Current source contains `not_implemented` navigation registry identities for several future areas. Smart modularity requires unused/unimplemented modules to remain silent in normal navigation.

| Placeholder | Final research class | Decision |
|---|---|---|
| Acasă | LATER / UNACCEPTED | `/` remains Lucrări until a proven cross-domain Home job exists |
| Furnizori | NEXT / OPTIONAL | create only when supplier identity gains reusable cross-domain lifecycle |
| Achiziții | LATER / OPTIONAL | Inventory Advanced, not first-use gate |
| Pontaj | LATER / OPTIONAL | separate from task sessions/actuals |
| Plăți și avansuri | LATER / OPTIONAL | HR/finance extension |
| Politici | UNDECIDED / domain-owned | do not create a generic policies/settings dump; specific policy stays with owning domain |

No empty future destination should be visible merely because an enum already contains its identity.

---

# 8. OLD capability recovery matrix

| OLD capability | User job worth keeping? | Final form | Priority | Separate business truth? | Decision |
|---|---|---|---|---|---|
| Dashboard / Control Tower | YES, eventually | PROJECTION_REPORT | LATER | NO | build only after repeated cross-domain management question appears |
| Shop Floor | YES | cross-job workshop projection | NEXT_CONDITIONAL | NO | distinct from Atelier; only after coordination pain is demonstrated |
| Operator | YES | Atelier → Execuție | CORE_NOW | NO | MERGED |
| Tablet | YES presentation | responsive/kiosk Execuție | NEXT_CONDITIONAL | NO | same routes/state/API; no separate authority |
| Employee Mobile | YES for some orgs | optional Execution client | LATER/OPTIONAL | NO | same task/actual truth |
| Orders | YES domain truth | Order Snapshot inside Lucrare | CORE_NOW | YES domain object; NO separate L1 | MERGED |
| Execution Dashboard | PARTIAL | contextual job/workshop projection | NEXT_CONDITIONAL | NO | no separate daily authority now |
| Reality Review | YES as evidence | Actuals / PvA contextual | CORE/NEXT | NO | MERGED |
| Documents Center | YES future cross-doc job | domain-owned docs now; global DMS later | LATER/OPTIONAL | YES if later domain created | old synthetic page RETIRED |
| Inventory advanced / OC | YES for advanced orgs | Inventory Advanced | LATER/OPTIONAL | YES | split from BASIC stock |
| Unified Pricing Registry | NO as one authority | Resources/EIC + Commercial + Reporting split | RETIRE | — | never recreate |
| Colaboratori | YES supplier job | Supplier master when cross-domain reuse exists | NEXT/OPTIONAL | YES if justified | do not recreate merely from OLD |
| Reports | YES | read-only projections | LATER | NO new truth | wait for real history |
| HR master | YES optional | HR module | LATER/OPTIONAL | YES | separate from operational People |
| Pontaj | YES optional | attendance module | LATER/OPTIONAL | YES | separate from task sessions and customer price |
| Employee payments/advances | YES optional | HR/finance extension | LATER/OPTIONAL | YES | not first-use scope |
| Module Chain | support only | System inspection | INTERNAL | NO | retire from business navigation |
| Global Settings | NO | domain-owned Admin | RETIRE | — | never recreate |
| Legacy Intake V3/V4/V5 | NO | current Cerere → Configurator path | RETIRE | — | preserve history only |
| legacy `/price` cost-plus hub | NO | current separated price/cost ownership | RETIRE | — | preserve history only |

---

# 9. Installation-inclusive extension — not part of shortest product-only proof

Installation is the first Operational Services capability, not a LETTERS module and not a second execution product.

## Additional lifecycle

```text
Cerere selects SITE_INSTALLATION
→ typed site/service facts
→ service EIC
→ Owner-written service commercial line
→ multi-line frozen Quote
→ accepted Order service truth
→ Production Release
→ ExecutionPlan package kind = teren
→ field tasks
→ field/service actuals
→ optional later profitability
```

## Page impact

No mandatory new global daily page is required.

| Need | Page home |
|---|---|
| organization service mode | Admin → Servicii operaționale |
| request selection + facts | Cerere |
| service commercial line | Ofertă |
| frozen service continuity | Lucrare |
| terrain task dispatch | Atelier |
| field work | Execuție with `teren` context |
| field actuals | Execuție / Lucrare |

`OS-S8 + minimum OS-S9` are enough at architecture level to call an installation-inclusive job operationally complete. Profitability is not required for that gate.

Known future facts such as site photos, access-equipment depth and fixings must not silently become universal blockers without separate Owner business truth.

---

# 10. Figma build order after Application Map acceptance

The smallest useful screen-design program is not route-by-route implementation of every current page.

```text
FIGMA_A1 — REGISTRY FAMILY
Clienți
Cereri
Oferte
Lucrări

FIGMA_A2 — OBJECT FAMILY
Client
Cerere
Ofertă
Lucrare

FIGMA_A3 — COMMERCIAL SPECIAL
Catalog
Configurator

FIGMA_A4 — OPERATIONS SPECIAL
Atelier
Execuție

FIGMA_A5 — SUPPORT
Login
Admin local navigation + only required setup states
```

Only after CORE runtime proof:

```text
FIGMA_B — Product System self-service / workcenter setup gaps
FIGMA_C — Inventory / supplier / field-service extensions when needed
FIGMA_D — projections: Shop Floor / Reporting / Control Tower when evidence exists
```

This order deliberately puts reusable floorplans before page-specific polish while preserving business semantics.

---

# 11. Shortest honest implementation/use sequence

After Design Bible and Application Map gates close:

```text
1. implement accepted CORE shell/floorplans vertically
2. preserve current domain/API; no domain rebuild
3. verify admin prerequisites for selected real product
4. run a naturally product-only real job

Client
→ Cerere
→ Catalog
→ Configurator
→ Quote
→ Acceptance
→ Lucrare
→ Release / Plan
→ Atelier
→ Execution
→ Complete
→ Planned vs Actual

5. record every forced escape from WorkOS
6. fix only demonstrated blockers/friction
7. run a second real job
8. expand capabilities from evidence
```

A real job must not require Cursor, SQL, direct DB edits, private seed changes, or source modification as part of normal processing.

Bootstrap/recovery mechanisms may exist, but if the same configuration is normal customer operation it creates `ADMIN_TOOLING_DEBT`.

---

# 12. Contradiction register

## CR-01 — People naming

```text
SUBJECT = People domain label
SOURCE_A = current navigation registry label `Angajați`
SOURCE_B = Admin + People UI explicitly says `Oameni`, not HR/pontaj/salary
DECISION_AUTHORITY = current domain boundary + Owner smart-modularity direction
RESOLUTION = final Application Map uses `Oameni`; HR remains future optional module
SEVERITY = UX-S2 naming drift
BLOCKS_WHAT = no architecture block; fix during final navigation design
```

## CR-02 — global sidebar artifacts

```text
SUBJECT = L1 navigation geometry
SOURCE_A = current navigation registry still contains historical sidebar constants/categories
SOURCE_B = Owner + current UI direction: GLOBAL_L1_SIDEBAR = NO
DECISION_AUTHORITY = newer Owner/UI20 direction
RESOLUTION = constants/current implementation are reference only; final Application Map does not revive permanent L1 sidebar
SEVERITY = historical implementation artifact
BLOCKS_WHAT = nothing while Cursor implementation is HOLD
```

## CR-03 — Customer duplicate doors

```text
SUBJECT = reusable Customer lifecycle
SOURCE_A = `/clients` creates + Client workspace edits current customer
SOURCE_B = `/admin/customers` creates/renames/retires same Customer aggregate
DECISION_AUTHORITY = business-domain ownership + shortest useful product
RESOLUTION = converge lifecycle into Clienți/Client; Admin duplicate becomes migration/retire candidate
SEVERITY = UX-S1 duplicated user door, not domain corruption
BLOCKS_WHAT = final IA cleanliness; does not block first job
```

## CR-04 — Product System says configurable but major settings are not owner-writable yet

```text
SUBJECT = general customer self-configuration
SOURCE_A = Product System is canonical owner of reusable technical settings
SOURCE_B = current Admin persists labels; technical setting lifecycle is not implemented; Processes/Workcenters are read-only
DECISION_AUTHORITY = Product System technical-settings canon + smart modularity
RESOLUTION = pilot may use existing canonical truth; general customer gate requires supported persistent/versioned authoring for legitimate adjustable config
SEVERITY = ADMIN_TOOLING_DEBT
BLOCKS_WHAT = general customer readiness, not necessarily HUB MEDIA pilot
```

## CR-05 — historical UI visual authorities vs new zero-base Design Bible

```text
SUBJECT = future presentation authority
SOURCE_A = repository contains accepted historical HF/UI20 visual records
SOURCE_B = current Owner program builds a new zero-base Design Bible and keeps Cursor UI implementation on HOLD
DECISION_AUTHORITY = newer explicit Owner direction
RESOLUTION = old Figma/runtime visuals are evidence/constraint only; Design Bible + future Application Map drive new screens
SEVERITY = none if status labels remain honest
BLOCKS_WHAT = prevents accidental resume of stale implementation sequence
```

---

# 13. Readiness verdict from the reconciled matrix

```text
CORE_ROUTE_FAMILIES_IDENTIFIED = YES
CORE_FLOORPLANS_IDENTIFIED = YES
CORE_ACTORS_IDENTIFIED = YES
LIFECYCLE_PAGE_VS_STATE_SEPARATION = YES
OLD_CAPABILITY_DISPOSITION = SUBSTANTIALLY_COMPLETE
GENERAL_CUSTOMER_ADMIN_DEBT = IDENTIFIED
FIRST_PRODUCT_ONLY_SCOPE_NEEDS_EXPANSION = NO
APPLICATION_MAP_INPUT = READY_FOR_SYNTHESIS
FINAL_FLOWCHART_DRAWING = WAIT_FOR_DESIGN_BIBLE_GATE
FIGMA_APPLICATION_SCREENS = HOLD
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
REAL_CLOUD_MUTATION = OWNER_GATE_ONLY
```

The current research is strong enough to synthesize the final Application Map structure. The remaining gate is not another broad OLD-vs-NEW research loop; it is Design Bible closure/reconciliation plus final Owner acceptance of the map.

---

# 14. Curation / organization

```text
CANONICAL / CURRENT
= living roadmap + current architecture canons + current runtime only

ACTIVE EVIDENCE
= research continuity dossier
= application inventory draft
= open-questions checkpoint
= this reconciled matrix

HISTORICAL / SUPERSEDED
= OLD application architecture and routes
= stale HF/UI sequences where newer Owner direction supersedes them

ARCHIVE
= not performed in this research write

DELETE
= none

UNKNOWN
= do not touch
```

Do not create competing `FINAL_APPLICATION_MAP` or `FINAL_ROADMAP` documents before the actual Application Map gate. When that gate closes, consolidate the research chain and archive superseded drafts rather than leaving multiple documents labeled final/current.
