# WorkOS — Application Map Synthesis V1

**Status:** `ACTIVE_RESEARCH_EVIDENCE / APPLICATION_MAP_CANDIDATE`  
**Date:** 2026-09-09  
**Authority:** none. Requires Owner acceptance before it can become final application IA.  
**Implementation authorization:** `NO`

## Inputs

This synthesis reconciles:

- current `main` routes and current Admin/navigation source;
- current living roadmap and current domain/UI canons;
- the zero-base Design Bible through Page 06;
- OLD WorkOS forensic evidence;
- the Owner-approved postmortem direction;
- Minimum Useful WorkOS;
- the application inventory;
- the open-question checkpoint;
- the Page × Actor × Floorplan × Lifecycle × Priority matrix.

## Core principle

WorkOS has two simultaneous maps that must not be confused:

```text
APPLICATION MAP
= where a human goes to do a job

SYSTEM LIFECYCLE MAP
= which immutable/mutable truths and transitions exist underneath
```

A backend/domain object does not automatically become a page.

---

# 1. Final application map candidate

## Daily global destinations — candidate

```text
Clienți
Cereri
Oferte
Catalog
Lucrări
Atelier
```

These are the strongest candidates for stable daily L1 access.

Rules:

- no permanent global L1 left sidebar;
- `Execuție` is contextual from Atelier/Lucrare;
- `Configurator` is contextual from Cerere/Catalog/Lucrare;
- Client/Cerere/Ofertă/Lucrare are object routes, not independent L1 categories;
- Administration is a quiet utility/domain entry with local navigation;
- `/` remains `Lucrări` until a real `Acasă` job is accepted;
- disabled/not-implemented modules remain silent in normal navigation.

## Primary application hierarchy

```text
WORKOS
├── Clienți
│   └── Client
│       ├── Cereri client
│       ├── Oferte client
│       └── Lucrări client
│
├── Cereri
│   └── Cerere
│       ├── Fișiere / client intent
│       ├── Servicii operaționale selectate, dacă există
│       └── Continuă în Catalog / Configurator
│
├── Oferte
│   └── Ofertă
│       ├── Valoare comercială
│       ├── Owner-only internal economics
│       ├── Acceptare
│       └── Creează / deschide Lucrare
│
├── Catalog
│   └── Configurator
│       ├── ProductDefinition / Product Truth
│       ├── EIC owner-only
│       ├── Commercial Price
│       └── continuare spre Cerere / Ofertă / Lucrare
│
├── Lucrări
│   └── Lucrare
│       ├── Commercial lineage
│       ├── Order Snapshot
│       ├── Production readiness / Release
│       ├── ExecutionPlan / progress
│       ├── Actuals / Planned vs Actual
│       └── Deschide Execuția
│
├── Atelier
│   └── Execuție
│       ├── Task focus
│       ├── assignment/provider gate
│       ├── Start / Complete
│       └── Actuals
│
└── Administrare
    ├── Comercial
    │   └── Date firmă
    ├── Operațiuni
    │   ├── Oameni
    │   │   ├── Persoană
    │   │   └── Competențe
    │   └── Servicii operaționale
    ├── Atelier
    │   ├── Resurse și cost intern
    │   ├── Stoc
    │   │   └── Material stoc
    │   ├── Procese operaționale
    │   └── Utilaje și zone
    └── Sistem
        ├── Sistem produs
        ├── Module și componente — merge/inspection candidate
        ├── Guvernanță — internal
        └── Stare sistem — internal
```

### Customer lifecycle convergence

`/admin/customers` is not included as a permanent independent destination in the candidate map. Its create/rename/retire capability should converge into `Clienți/Client` so there is one Customer user door. Current route removal is **not authorized** by this document.

---

# 2. System lifecycle map

```text
Customer
   ↓
CommercialRequest
   ↓
ProductTemplate selection
   ↓
ProductDefinition
   ↓
ProductTruth
   ↓
ProductAggregate
   ↓
EIC / internal estimate
   ↓
CommercialPrice
   ↓
QuoteSnapshot
   ↓
QuoteAcceptanceDecision
   ↓
OrderSnapshot
   ↓
ProductionRelease
   ↓
ExecutionPlan
   ↓
ExecutionTasks
   ↓
Actuals
   ↓
PlannedVsActual
   ↓
ProfitabilityAnalysis [LATER]
```

Object/state nodes above are not all pages.

## Page ownership of lifecycle truth

| Lifecycle truth | Human home |
|---|---|
| Customer | Client |
| CommercialRequest | Cerere |
| ProductTemplate selection | Catalog |
| ProductDefinition / ProductTruth | Configurator |
| ProductAggregate | Configurator/Admin inspection |
| EIC | Configurator Owner context / frozen lineage |
| CommercialPrice | Configurator / Ofertă |
| QuoteSnapshot | Ofertă |
| Acceptance | Ofertă |
| OrderSnapshot | Lucrare |
| ProductionRelease | Lucrare |
| ExecutionPlan | Lucrare / Execuție |
| Tasks | Atelier / Execuție |
| Actuals | Execuție / Lucrare |
| Planned vs Actual | Execuție / Lucrare |
| Profitability | future Owner Reporting |

---

# 3. Minimum Useful WorkOS path

Shortest honest product-only path:

```text
Login
→ Client
→ Cerere
→ Catalog
→ Configurator
→ Ofertă
→ Acceptare
→ Lucrare
→ Production Release / Plan
→ Atelier
→ Execuție
→ Complete
→ Planned vs Actual
```

This is the first design/implementation/use priority.

Required support only when actually used by the selected job:

```text
Seller identity
People/operator identity
Skills
Product System current truth
Processes current truth
Machine/work-area capability where operation is machine-strict
Resource/internal-cost evidence required by the selected product
```

Not required before first product-only proof:

```text
HR
Pontaj
Payments/advances
Employee Mobile
Supplier master
Purchasing
Reservations
Warehouses
Inventory valuation
advanced capacity planning
Global DMS
Reporting Center
Profitability
Control Tower
```

---

# 4. Installation-inclusive extension

Installation does not create a parallel application spine.

```text
Cerere
  selects SITE_INSTALLATION
     ↓
service facts
     ↓
service EIC
     ↓
Owner-written customer service price
     ↓
Quote service line
     ↓
Order service truth
     ↓
Production Release
     ↓
ExecutionPlan / package kind=teren
     ↓
Atelier
     ↓
Execuție teren
     ↓
service actuals
```

Page homes remain:

```text
org capability        → Admin / Servicii operaționale
request facts         → Cerere
commercial service    → Ofertă
order continuity      → Lucrare
field dispatch        → Atelier
field work/actuals    → Execuție
```

No separate `Montaj` product universe and no separate field-execution backend.

---

# 5. Capability maturity lanes

## CORE_NOW

```text
Clienți / Client
Cereri / Cerere
Catalog / Configurator
Oferte / Ofertă
Lucrări / Lucrare
Atelier / Execuție
```

## SUPPORT_CORE

```text
Login
Administrare
Date firmă
Oameni / Persoană / Competențe
Resurse și cost intern
Procese current truth
Utilaje/zone current truth when strict machinery is needed
Product System current truth
Operational Services when selected
```

## NEXT_CONDITIONAL

```text
Product System customer self-service authoring/versioning
machine/work-area organization setup
process editing only where real organization variability exists
Shop Floor managerial projection
Supplier master when identity becomes cross-domain
field execution + service actuals for installation companies
richer Inventory BASIC UX
responsive/kiosk Execution presentation
```

## LATER / OPTIONAL

```text
HR
Pontaj
Employee payments/advances
Employee Mobile
Purchasing
Reservations
Warehouses
Valuation
advanced capacity scheduling
maintenance
Reporting Center
Profitability
Global DMS
Invoicing
Control Tower / Home
```

## INTERNAL

```text
Governance
System status
component/module inspection where needed for product administration/support
```

## RETIRE / DO NOT REBUILD

```text
OLD global sidebar architecture
OLD global Settings dump
OLD unified Pricing hub
OLD separate Comenzi as primary daily destination
OLD synthetic Document Center
parallel Operator/Tablet/Mobile task authorities
legacy Intake V3/V4/V5 paths
legacy mixed `/price` authority
mock/demo surfaces as business truth
```

---

# 6. Floorplan assignment

| Surface | Floorplan |
|---|---|
| Login | AUTH_GATE |
| Clienți | REGISTRY_WORKLIST |
| Client | OBJECT_WORKSPACE |
| Cereri | REGISTRY_WORKLIST |
| Cerere | OBJECT_WORKSPACE with journey/readiness emphasis |
| Catalog | SELECTION_CATALOG |
| Configurator | CONFIGURATION_WORKSPACE |
| Oferte | REGISTRY_WORKLIST |
| Ofertă | OBJECT_WORKSPACE with commercial decision emphasis |
| Lucrări | REGISTRY_WORKLIST |
| Lucrare | OBJECT_WORKSPACE with operational continuity emphasis |
| Atelier | DISPATCH_INBOX |
| Execuție | FOCUSED_EXECUTION |
| Admin writable registries | ADMIN_COLLECTION |
| Admin read-only canonical views | ADMIN_INSPECTION |
| future Shop Floor / Reporting | PROJECTION_REPORT |
| Governance/System | SYSTEM_INSPECTION |

One shell, small floorplan family, business-semantic variation inside each family.

---

# 7. Figma screen-build program after map acceptance

```text
A1 — REGISTRY FAMILY
Clienți
Cereri
Oferte
Lucrări

A2 — OBJECT FAMILY
Client
Cerere
Ofertă
Lucrare

A3 — COMMERCIAL SPECIAL
Catalog
Configurator

A4 — OPERATIONS SPECIAL
Atelier
Execuție

A5 — SUPPORT
Login
Admin local navigation + only setup states required by first E2E
```

Do not draw every future/optional module before the first real job.

---

# 8. Responsive questions deliberately left for screen phase

The map does not pretend to resolve visual behavior that requires application-level evidence.

Open for screen/prototype phase:

```text
768 L1 compression/overflow behavior
768 registry/ledger column priority per domain
exact mobile/tablet execution shell
exact object-workspace section navigation on narrow widths
exact Admin local-navigation collapse behavior
```

These are UI-prototype questions, not Application Map blockers.

---

# 9. Anti-repeat guardrails inherited from the OLD postmortem

```text
ONE canonical lifecycle path
ONE active truth per domain
preview/mock/synthetic visibly non-final
no page merely because a backend object exists
Advanced is not a Basic prerequisite
no future module without demonstrated E2E value
major loops close with runtime proof
compatibility is transitional
normal operation requires no Cursor/SQL/direct DB/source edit
no global Settings dump
no unified Pricing authority
no global L1 sidebar
```

---

# 10. Application Map verdict

```text
APPLICATION_MAP_STRUCTURE = SYNTHESIZED
APPLICATION_MAP_STATUS = CANDIDATE_FOR_OWNER_REVIEW
DAILY_L1_CANDIDATE = Clienți / Cereri / Oferte / Catalog / Lucrări / Atelier
CONTEXTUAL_CORE = Client / Cerere / Configurator / Ofertă / Lucrare / Execuție
ADMIN_MODEL = DOMAIN_OWNED_LOCAL_NAVIGATION
PAGE_VS_STATE_SEPARATION = CLOSED
MINIMUM_USEFUL_PATH = CLOSED
FUTURE_CAPABILITY_LANES = CLOSED_ENOUGH_FOR_V1
FINAL_OWNER_ACCEPTANCE = NOT_RECORDED_BY_THIS DOCUMENT
FIGMA_APPLICATION_SCREENS = HOLD_UNTIL_MAP_ACCEPTANCE
CURSOR_PRODUCT_IMPLEMENTATION = HOLD
```

## Proposed acceptance gate

Owner review should focus on only four product questions:

1. Are the six daily L1 destinations correct?
2. Is `Comenzi` correctly absorbed into `Lucrări`?
3. Is Customer lifecycle correctly converged into `Clienți/Client` rather than duplicate Admin doors?
4. Is the CORE/NEXT/LATER cut strict enough to force first real E2E use before horizontal expansion?

If these four are accepted, the map is stable enough to enter Figma application-screen work.

---

# 11. Curation

```text
CANONICAL / CURRENT
= living roadmap + current canons + current runtime

ACTIVE EVIDENCE
= Research Continuity Dossier
= Application Inventory Draft
= Open Questions Checkpoint
= Page × Actor × Floorplan × Lifecycle × Priority Matrix
= Design Bible Gate Review
= this Application Map Synthesis

HISTORICAL / SUPERSEDED
= OLD application architecture
= stale horizontal UI implementation sequences
= historical brand/icon research according to existing Figma page status

ARCHIVE
= defer until Owner accepts this map

DELETE
= none
```

Do not create a competing `FINAL_APPLICATION_MAP` document until Owner acceptance closes the gate. After acceptance, consolidate and archive superseded research drafts while preserving traceability.
