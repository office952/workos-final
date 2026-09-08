# WorkOS — OLD/NEW postmortem + Minimum Useful V1

**Status:** `ACTIVE_RESEARCH_EVIDENCE`  
**Date:** 2026-09-09  
**Scope:** preserve Owner-approved research continuity for the Design Bible → Application Map → Figma page-by-page program.  
**Not authority:** this file is not a second roadmap and does not supersede current canons. Runtime and living authority win.

## Read this first

Current authority remains:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`
- domain-specific canons referenced there

This dossier exists so the reasoning behind the next Design Bible / application-map decisions is not lost between ChatGPT sessions, Cursor sessions, or future implementation waves.

## Owner-approved research direction

The Owner approved a broader audit before the final application flowchart and Figma screen construction.

The required sequence is:

```text
FINISH DESIGN BIBLE
→ OLD + NEW + CANON forensic audit
→ OLD WorkOS postmortem
→ Minimum Useful WorkOS contract
→ complete page / capability inventory
→ final application flowchart
→ CORE / SUPPORT / NEXT / LATER classification
→ Figma CORE vertical slice first
→ Owner acceptance
→ implementation
→ first real E2E job
→ expand only from demonstrated needs
```

Important: a complete flowchart does **not** mean all pages must be implemented before WorkOS becomes useful.

## Evidence hierarchy

Use evidence in this order:

1. current WorkOS Final source/runtime and current canonical documents;
2. deterministic tests / API evidence;
3. fresh runtime interaction;
4. accepted screenshot / forensic packs;
5. OLD WorkOS source/runtime and historical worklogs;
6. remembered conversation context.

OLD is business and operational evidence, **not** the architecture to copy.

## Why OLD WorkOS required reconstruction — current cause model

### Explicitly documented facts

Historical audits classified OLD WorkOS as `HIGH_RISK_DEVIATED` in important commercial areas. Strong subsystems existed, especially Product Truth and Execution, but the commercial path had drifted:

- commercial price and estimated internal cost became coupled;
- `total internal cost × margin` acted as a universal commercial path;
- hourly/minute-driven cost paths could leak upstream into quoting;
- Pricing Registry mixed materials, workcenter rates, markup and commercial readiness;
- `CommercialPriceProposal` was missing as a clean runtime owner;
- several legacy / compatibility paths remained active in parallel;
- some mock, preview or synthetic surfaces could look more operational than their underlying truth.

Historical route and UI audits also showed a very large surface area, with OLD navigation mixing operations, production, people, resources, management, administration and developer/debug concerns.

### Strongly supported causal synthesis

The reconstruction was not necessary because OLD lacked functionality. The stronger interpretation is:

```text
GOOD SUBSYSTEMS
+
HORIZONTAL EXPANSION BEFORE A NARROW REAL E2E LOOP WAS ROUTINE
+
PARALLEL LEGACY PATHS KEPT ALIVE
+
DOMAIN-OWNERSHIP DRIFT IN CRITICAL AREAS
+
UI OCCASIONALLY OUTRUNNING RUNTIME MATURITY
+
TOO MANY PARTIAL MODULES BEFORE DAILY REAL USE
=
SYSTEM TOO EXPENSIVE TO REASON ABOUT AND CHANGE SAFELY
```

This synthesis is an independent product/architecture conclusion from the evidence. Do not rewrite it later as an Owner historical quote unless the Owner explicitly confirms that wording.

## What OLD did well and must not be lost

OLD contained useful business knowledge that remains valuable evidence:

- strong product-capture / configuration thinking;
- ProductDefinition / ProductAggregate concepts;
- production execution, task start/stop and actuals;
- operator/tablet/mobile execution ideas;
- master-detail patterns for customers / quotes;
- shop-floor overview ideas;
- HR / attendance / employee-payment workflows as optional business modules;
- reporting and operational-review concepts;
- supplier/subcontractor concepts;
- production administration depth.

The rule is:

> Recover the **job to be done**, not the OLD page.

## Permanent anti-repeat rules

1. **One canonical lifecycle path.** Do not keep V1/V2/V3/V4 active indefinitely for the same business operation.
2. **One active truth per domain.** Product Truth, Commercial Price, EIC, Inventory, People, Machines and Execution remain distinct.
3. **Preview is visibly preview.** Mock / simulation / forecast / diagnostic / read-only projection must never masquerade as final business truth.
4. **Backend object ≠ required page.** Important technical objects do not automatically become global destinations.
5. **Advanced capability is not a Basic prerequisite.** Small/manual companies must be able to use the smallest complete workflow.
6. **No future module before demonstrated E2E value.** A module enters `CORE NOW` only if it helps complete the next real job or is required configuration for it.
7. **Runtime closes the loop.** Tests and docs are insufficient without real user flow proof at major gates.
8. **Compatibility is transitional.** Once replacement is proven, duplicate authorities must retire; no permanent “just in case” parallel truth.
9. **Customer-operable without Cursor.** Normal configuration cannot require source edits, terminal commands, direct DB writes or client code forks.
10. **No global Settings dump.** Each domain owns its configuration.
11. **No unified Pricing hub.** Internal cost, commercial pricing, execution actuals and later profitability stay separate.
12. **No permanent global L1 sidebar.** Global shell stays quiet; local side navigation is only for legitimate Admin/master-detail contexts.

## Current WorkOS Final architectural advantage

WorkOS Final is intentionally a clean reconstruction. Current project law is E2E-first and keeps domain ownership separated.

Current user-facing core is much smaller than OLD. The current FC0 page matrix contains roughly 28 unique signed-in/login compositions rather than the very large OLD route surface.

The key implication is:

> WorkOS can become useful before every current or future admin page reaches final high-fidelity quality.

## Minimum Useful WorkOS — working contract

`MINIMUM_USEFUL_WORKOS = YES` only when a normal user, without Cursor/SQL/private seeds/code edits, can take a **real customer request** through a complete operational cycle while WorkOS preserves correct lineage and historical truth.

Target spine:

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

Not every item above requires its own page. Acceptance, Production Release, ExecutionPlan and Planned-vs-Actual may be states/sub-surfaces inside larger workspaces.

### Required supporting truth only

Before first useful job, support only what the chosen job genuinely needs:

- Seller identity;
- Customer identity;
- Product System truth for the chosen product;
- Commercial pricing strategy and frozen quote;
- minimum People / Skills / operator identity required by execution;
- required machine/work-area capability only where the operation is machine-strict;
- required resource / internal cost evidence only where the product or service needs it;
- organization-level capability configuration through supported UI.

## CORE / SUPPORT / NEXT / LATER working classification

### CORE NOW — daily surfaces

These are the main high-fidelity targets after the Application Map:

1. Clienți
2. Client
3. Cereri
4. Cerere
5. Catalog
6. Configurator
7. Oferte
8. Ofertă
9. Lucrări
10. Lucrare
11. Atelier
12. Execuție

These are not twelve unrelated pages. They are one business continuity system with a small floorplan vocabulary.

### SUPPORT CORE — must work, but not all need first-class redesign before first job

- Login / organization access
- Date firmă / Seller
- Oameni
- Competențe
- Persoană / operational identity
- required Utilaje / zone / workcenters
- required Procese
- required Resurse și cost intern
- Administrare hub
- Servicii operaționale when the real job selects such a service

### NEXT

- Stoc richer UX
- supplier/subcontractor master when repeated usage proves the need
- richer Product System editor / owner studio
- wider admin polish
- secondary operational overview / Shop Floor
- tablet-specific layout where workshop evidence proves value

### LATER / OPTIONAL

- HR employee master
- Pontaj / attendance
- employee payments / advances
- Employee Mobile
- purchasing
- reservations
- warehouses
- valuation
- advanced capacity scheduling
- reporting center
- profitability analysis
- global DMS
- invoice system
- advanced management dashboards / Control Tower

### RETIRE / DO NOT REBUILD AS-IS

- OLD unified Pricing Registry / quote-calculation hub
- OLD global Settings mega-page
- OLD Orders as a separate primary destination when the user-facing continuity is Lucrare
- OLD synthetic Document Center implementation
- duplicate Operator / Tablet / Mobile task authorities
- parallel legacy Intake / Pricing / Execution paths

## OLD capability recovery matrix — current direction

### Operator / Tablet / Employee Mobile

Preserve task-execution semantics, but converge on **one task truth and lifecycle**:

```text
Desktop / normal
Atelier → Execution

Tablet / kiosk
same Execution truth, responsive/attention-focused presentation

Employee Mobile
future optional client of the same task truth
```

No separate backends or state machines per device.

### Shop Floor

Keep as future managerial/operations projection only if enough real execution data exists.

- Atelier answers: “What can/should I do now?”
- Shop Floor overview would answer: “What is happening across the workshop now?”

Different user jobs; do not merge conceptually and do not make Shop Floor a prerequisite for basic execution.

### HR / Pontaj / Payments

Preserve as optional future modules. Keep these identities distinct:

```text
Person
≠ Employee HR record
≠ Skill
≠ Availability
≠ Operator identity
≠ Execution session
≠ Pontaj
```

Pontaj or salary must never become the commercial-price formula.

### Documents

Current correct direction is domain-owned documents:

- Cerere owns customer attachments;
- Ofertă owns Quote PDF / commercial document projection;
- later Order / production / invoice documents should be added by their owning domains.

A global DMS should exist only when a genuine cross-domain document-management job is demonstrated.

### Reports / Dashboard

Build projections from real truth, not the other way around.

Order:

```text
real jobs
→ actuals
→ enough history
→ proven metric
→ report/dashboard
```

`Planned vs Actual` is sufficient as the first operational feedback loop.

### Inventory

Inventory is optional capability, not universal blocker.

Suggested maturity:

```text
DISABLED
→ no stock UI / no unrelated blocker

BASIC
→ quantities, movements, manual adjustment, actual-consumption projection

ADVANCED
→ reservations, purchasing, warehouses, valuation, stricter controls
```

### Pricing

Permanent separation:

```text
RESOURCES / COST
→ internal resource identity + cost evidence

COMMERCIAL
→ customer pricing rules / manual or calculated commercial price

EXECUTION
→ actual consumption / actual work

REPORTING
→ later profitability comparison
```

Never recreate the OLD unified Pricing hub.

## Product-only E2E vs installation-inclusive E2E

There are two legitimate validation tracks.

### Fastest honest E2E proof

A **real product-only LETTERS job** is the shortest route because the core commercial/production/execution spine already exists without requiring field-service completion.

Target:

```text
REAL CUSTOMER
→ REAL REQUEST
→ REAL CONFIGURATION
→ REAL QUOTE
→ REAL ACCEPTANCE
→ REAL JOB
→ REAL WORKSHOP
→ REAL EXECUTION
→ REAL COMPLETION
```

### Richer current pilot

The existing real pilot that includes site installation is valid and must not have its business truth simplified merely to obtain a PASS.

However, installation-inclusive completion adds real scope: live service Quote/Acceptance/Release, field execution, service actuals and later profitability are separate maturity steps.

Therefore:

```text
FASTEST_PROOF = PRODUCT_ONLY_REAL_JOB
RICHER_PROOF  = PRODUCT + SITE_INSTALLATION
```

Do not falsify a real Request by removing installation. Use the next naturally product-only real job for the fast proof if one exists.

## Design Bible and application-map program

After Design Bible closure, do **not** immediately draw every screen.

Required mapping phase:

```text
OLD APP forensic inventory
+
CURRENT NEW routes / runtime
+
CURRENT CANON
+
OWNER decisions
↓
FINAL APPLICATION INVENTORY
↓
KEEP / REDESIGN / MERGE / SPLIT / NEW / RETIRE / RESERVE
↓
APPLICATION FLOWCHART
↓
PAGE × FLOORPLAN × PRIORITY matrix
↓
Owner acceptance
```

The flowchart must distinguish:

- user-facing page;
- technical/domain object;
- state transition;
- registry;
- configuration/admin surface;
- operational workspace;
- optional capability;
- future/reserve capability.

Do not turn every backend object into a page.

## Figma construction strategy after the map

Recommended sequence:

```text
1. List / Report family
2. Object Detail family
3. Cerere / Configurator
4. Ofertă
5. Lucrare
6. Atelier
7. Execuție
8. required Admin / configuration
9. secondary pages
10. responsive / states / prototypes
```

Build the CORE vertical slice first, obtain Owner acceptance, implement it, run a real E2E job, then expand using evidence from actual use.

## Definition of useful after first real job

After the first real completion, record every place where the team had to leave WorkOS:

- Excel
- WhatsApp
- paper
- manual duplicate entry
- Cursor
- SQL / CLI
- external calculation
- ambiguous next step
- missing configuration UI
- advanced module blocking a simple job

Those become evidence-ranked next steps.

## Current open questions to resolve during the remaining audit

1. exact final page inventory after OLD/New cross-classification;
2. which current admin writes are genuinely customer-operable vs remaining `ADMIN_TOOLING_DEBT`;
3. final money-visibility rules on Ofertă and Lucrare;
4. exact Product System admin depth required for general-customer readiness vs first pilot;
5. exact field-service scope required before an installation-inclusive real job can close;
6. what, if anything, deserves a future Home / Control Tower destination;
7. which OLD reports or shop-floor projections become useful only after real operational history exists;
8. final tablet/mobile strategy after observing actual workshop use.

## Stop rules

Until this audit and the Design Bible / Application Map gates close:

```text
NO CURSOR PRODUCT IMPLEMENTATION
NO NEW DOMAIN
NO NEW PAGE JUST BECAUSE OLD HAD ONE
NO FIGMA SCREEN-BY-SCREEN BUILD BEFORE MAP
NO ICON-CREATION RESEARCH LOOP
NO REAL CLOUD MUTATION WITHOUT OWNER GATE
```

Research/documentation work may continue.

## Next research deliverable

Produce a complete OLD + NEW + FUTURE inventory where every destination/capability receives:

```text
NAME
OLD ROUTE / SOURCE
NEW ROUTE / SOURCE
ACTOR
JOB TO BE DONE
DOMAIN OWNER
INCOMING / OUTGOING RELATIONSHIPS
FINAL CLASS = CORE NOW / SUPPORT CORE / NEXT / LATER / OPTIONAL / RETIRE
PAGE DECISION = KEEP / REDESIGN / MERGE / SPLIT / NEW / NO PAGE
FLOORPLAN
V1 E2E REQUIRED = YES / NO
DEPENDENCIES
KNOWN RISK
EVIDENCE SOURCE
```

Only after that should the final flowchart be drawn.
