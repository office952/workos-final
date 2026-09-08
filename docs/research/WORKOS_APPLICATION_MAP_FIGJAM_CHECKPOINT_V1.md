# WorkOS — Application Map FigJam Checkpoint V1

**Status:** `ACTIVE_RESEARCH_EVIDENCE / VISUAL_MAP_CANDIDATE`  
**Date:** 2026-09-09  
**Authority:** none. Requires Owner review before final Application Map acceptance.  
**Implementation authorization:** `NO`

## FigJam identity

```text
FIGJAM_FILE_KEY = YjHSYiqb2VLrrCGaxjVD3k
DIAGRAM_ID = 95e5e8f0-59aa-46c2-99a5-f29daaffeb18
NAME = WorkOS Application Map — Synthesis V1
ROOT = 0:1
```

The map was generated from `WORKOS_APPLICATION_MAP_SYNTHESIS_V1.md` after the Design Bible foundation gate was independently reviewed as sufficient for Application Map synthesis.

## Verified sections

The FigJam file was read back after generation and contains four explicit sections:

```text
1:39  APPLICATION MAP — DAILY WORK
1:82  SYSTEM LIFECYCLE — NOT ALL ARE PAGES
1:122 ADMINISTRATION — LOCAL DOMAIN NAVIGATION
1:150 NEXT / LATER / OPTIONAL — DO NOT BLOCK FIRST PRODUCT-ONLY JOB
```

## Daily-work page nodes present

```text
PAGE: Clienți
PAGE: Client
PAGE: Cereri
PAGE: Cerere
PAGE: Catalog
PAGE: Configurator
PAGE: Oferte
PAGE: Ofertă
PAGE: Lucrări
PAGE: Lucrare
PAGE: Atelier
PAGE: Execuție
```

Journey connectors include:

```text
Client → Cerere
Cerere → Catalog
Catalog → Configurator
Configurator → Ofertă
Ofertă → Lucrare
Lucrare → Atelier
Atelier → Execuție
Execuție → Lucrare
```

## Lifecycle nodes present

```text
CommercialRequest
Product Truth
ProductAggregate
EIC / internal estimate
Commercial Price
Quote Snapshot
Acceptance
Order Snapshot
Production Release
ExecutionPlan
Tasks
Actuals
Planned vs Actual
Profitability [future]
```

Dashed/contextual connections map these truths back to their human-facing pages rather than presenting every lifecycle node as a screen.

## Administration nodes present

```text
Administrare
Date firmă
Oameni
Persoană
Competențe
Resurse și cost intern
Procese operaționale — read-only now
Utilaje și zone — read-only now
Servicii operaționale
Sistem produs — partial self-service
Stoc — NEXT
Guvernanță — internal
Stare sistem — internal
```

## Future / optional nodes present

```text
Shop Floor overview
Supplier master
Field execution + service actuals
Inventory Advanced / Purchasing / Reservations
HR / Pontaj / Payments
Employee Mobile / kiosk presentation
Reporting / Profitability
Global DMS / Invoicing
Home / Control Tower
```

## Verification verdict

```text
FIGJAM_GENERATION = SUCCESS
READBACK_VERIFIED = YES
PAGE_VS_STATE_SEPARATION = VISIBLE
ADMIN_LOCAL_NAVIGATION = VISIBLE
FUTURE_CAPABILITY_SCOPE = VISIBLE
MINIMUM_USEFUL_PATH = VISIBLE
CURSOR_IMPLEMENTATION = HOLD
FIGMA_APPLICATION_SCREEN_BUILD = HOLD
```

## Known visual advisory

The generated FigJam is a **semantic architecture map**, not a polished presentation artifact. Mermaid auto-layout prioritizes connectivity over final board composition. Manual spatial cleanup may be useful after Owner accepts the information architecture, but should not become another design-polish loop before the map decision is closed.

## Owner review gate

Review only the structural decisions:

```text
A. Daily L1 candidate = Clienți / Cereri / Oferte / Catalog / Lucrări / Atelier
B. Comenzi is absorbed into Lucrări; Order remains domain truth
C. Configurator and Execuție are contextual, not global L1 destinations
D. Admin uses local domain navigation; no global L1 sidebar
E. Customer lifecycle should converge into Clienți/Client rather than a duplicate Admin door
F. CORE/NEXT/LATER split prevents horizontal expansion before first real E2E use
```

Do not review icon polish, screen layout, exact responsive behavior, or application styling at this gate.

## Curation

```text
CANONICAL / CURRENT
= living roadmap + canons + runtime

ACTIVE EVIDENCE
= Application Map Synthesis V1
= this FigJam candidate/checkpoint
= prior research chain

HISTORICAL / SUPERSEDED
= OLD app architecture and old UI paths

ARCHIVE
= wait for Owner Application Map decision

DELETE
= none
```
