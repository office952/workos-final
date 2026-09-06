# UI/UX foundation canon

Canonical current law for WorkOS operator/admin presentation.
Runtime wins if this document disagrees.

## UI owns experience, not business truth

React may own layout, hierarchy, interaction, local UI state and responsive behavior.

React must not own product truth, pricing, provider eligibility, executor eligibility, dependencies, task transitions or readiness.

## Shell

This file records the **current implemented** presentation shell. Living UI20 evolution authority remains `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.

```text
IMPLEMENTED_SHELL                      = UI20_CANDIDATE_A_QUIET_TOP_SHELL
GLOBAL_L1_SIDEBAR                      = NO
UI20_RW1                               = OWNER_ACCEPTED_INTEGRATION_CANDIDATE
UI20_RW1A                              = ACCEPTED
CURRENT_RUNTIME_PRESENTATION           = RW1 / existing bodies
NEXT_PRESENTATION_PROGRAM              = VERTICAL_CLEAN_SHEET_NORTH_STAR
UI20_CLEAN_SHEET_RUNTIME               = NOT_IMPLEMENTED
NO_PARTIAL_ROUTE_CUTOVER               = YES
PARTIAL_MAIN_UI_INTEGRATION            = FORBIDDEN
HISTORICAL_SHELL_V3                    = STABLE_SIDEBAR_V3
UI_UX_NAVIGATION_V3_DESIGN             = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION     = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION      = COMPLETE
ALL_EXISTING_PAGES_UI_V3               = INTEGRATED_ON_MAIN
ALL_EXISTING_PAGES_UI_V3_RUNTIME       = OWNER_ACCEPTED
UI_V3_GENERAL_FINALIZATION             = COMPLETE
UI_GENERAL_REDESIGN                    = REOPENED_BY_OWNER_FOR_UI20_E2E
UI_POLISH_MODE                         = SUPERSEDED_BY_UI20_REFOUNDATION
CLIENTS_V3                             = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION                = OWNER_ACCEPTED
CLIENTS_RUNTIME                        = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE                     = CLOSED
CLIENT_HUB_FIGMA_FINAL                 = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME                     = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE              = CLOSED
CLIENT_HUB                             = INTEGRATED_ON_MAIN
CERERI_V3_FIGMA_FINAL                  = OWNER_ACCEPTED
REQUESTS_DIRECTION                     = OWNER_ACCEPTED
CERERI_TECHNICAL_GATE                  = CLOSED
REQUESTS_RUNTIME                       = OWNER_ACCEPTED
CERERI_RUNTIME                         = OWNER_ACCEPTED
CERERI_INTEGRATED_ON_MAIN              = YES
REQUESTS_INTEGRATED_ON_MAIN            = YES
NEXT_PROGRAM_PRIORITY                  = WORKOS_UI_UX_2_0_E2E
```

`HISTORICAL_SHELL_V3 = STABLE_SIDEBAR_V3` and the V3 navigation acceptance remain historical evidence. They do not describe the current runtime shell after UI20-RW1.

This file describes **current implemented presentation only**. It does not claim that the UI20 vertical clean-sheet North Star is already the runtime. That next presentation program is isolated until one cutover GO. See `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` and `docs/worklog/WORKOS_UI20_VERTICAL_NORTH_STAR_CLEAN_SHEET_ARCHITECTURE.md`.

Living UI/UX evolution authority is `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`. Final UI20 IA is Owner-accepted as `IA3_QUIET_DESTINATIONS_OBJECT_CONTINUITY` with Candidate A quiet top shell and `GLOBAL_L1_SIDEBAR = NO`. Final UI20 visual direction is Owner-accepted as `G_LIVING_FABRICATION_INSTRUMENT` (`ACCEPTANCE_AUTHORITY = OWNER_DELEGATE_CHATGPT`). IA acceptance: `docs/worklog/WORKOS_UI20_FINAL_IA_OWNER_ACCEPTANCE.md`. Visual acceptance: `docs/worklog/WORKOS_UI20_FINAL_VISUAL_OWNER_DELEGATE_ACCEPTANCE.md`. RW1/RW1A worklog: `docs/worklog/WORKOS_UI20_RW1_QUIET_TOP_SHELL.md`.

Current global navigation is the UI20 Candidate A quiet top shell. There is no global L1 sidebar. The rendered normal L1 in the **current** runtime is:

```text
L1            Cereri · Comercial · Lucrări · Atelier · Mai multe · Cont
ACASA         hidden; `/` stays Lucrări; `ACASA_ROOT = NOT_AUTHORIZED`
ROOT `/`      Lucrări
`/jobs`       Lucrări
COMERCIAL L2  Clienți · Oferte · Catalog
MAI MULTE     Resurse / Oameni / existing supported secondary destinations from visibility truth
CONT          Administrare → /admin → local Admin navigation
OPERATOR      Atelier + Execution may use reduced chrome
SEARCH        not rendered until functional
OBJECT_CONTEXT presentational primitive only; not a completed North Star continuity instrument
```

Horizontal RW2–RW6 page-by-page main integration is superseded. Do not treat “later RW waves” as the living presentation program.

Capability / destination registry truth is unchanged. Hidden destinations stay in the registry and are not rendered. Historical V3 category layout (for audit only):

```text
HISTORICAL_V3_COMERCIAL     Clienți → /clients · Cereri → /requests · Oferte → /quotes · Catalog → /products
HISTORICAL_V3_PRODUCȚIE     Lucrări → /jobs and / · Atelier → /atelier
HISTORICAL_V3_RESURSE       Resurse și costuri → /admin/resources · Stoc → /admin/stock · Utilaje → /admin/workcenters
HISTORICAL_V3_OAMENI        Angajați → /admin/people
HISTORICAL_V3_ADMINISTRARE  Firmă → /admin/seller · Servicii operaționale → /admin/operational-services · Sistem produs → /admin/product-system · Guvernanță → /governance
HIDDEN                      Acasă · Furnizori · Achiziții · Pontaj · Plăți și avansuri · Politici
```

Stable detail routes:

```text
/jobs/:jobId                 jobId = orderSnapshotId; no Job entity
/quotes/:quoteSnapshotId     OF-… is display only
/products/:code?order=       legacy configurator continue
/products/:code?quote=       legacy configurator continue
/execution/:planId           execution workspace, not job detail
```

`/` remains the operational job overview. It is Lucrări, not Acasă. `/jobs` is an additive alias of the same list. Neither route is a fake Home.
`/atelier` is the operator task inbox (Munca mea). It projects open ExecutionTasks for the current OperatorSession across jobs. It does not own task state, schedule, or assignment.
`/requests` is the incoming-request queue. It projects CommercialRequest office status plus derived linked-offer progress. It does not own Quote or Order status.
`/quotes` is the offer registry. It is a read-only projection of Quote Snapshots and their Acceptance / Order lineage. It does not own quote status.
`/clients` is the Client registry. `/clients/:customerId` is the Client Workspace. Both project existing Customer / Request / Quote / Order truth. They do not own a second commercial engine.

Routes stay stable. Inspection surfaces live under Administrare:

```text
Comercial    Date firmă, Clienți
Operațiuni   Persoane
Atelier      Resurse, Stoc, Procese, Utilaje și zone
Sistem       Sistem produs, Module și componente, Guvernanță, Stare sistem
```

Sidebar **Atelier** (`/atelier`) is shop-floor **Munca mea**. Workshop configuration stays on Resurse / Utilaje pages, not in a second persistent menu. See `docs/architecture/OPERATOR_TASK_INBOX_ATELIER_CANON.md`.

After product confirmation the product page is a commercial workspace: compact progress, one primary next action, customer price first, internal cost / production preview / Atelier collapsed.

Stare sistem lives at `/system`. It is not a menu page; `/system` activates Guvernanță. There is no empty Producție page and no Execution top-nav item. After plan creation the overview and the product page hand off with **Deschide execuția** to the generic job workspace `/execution/:planId`.

## Visual primitives

Small token set in `apps/web/src/index.css`. Shared pieces only where reused:

- `PageHeader`
- `StatusChip`
- `Notice`
- `EmptyState`
- `Field`
- button roles: default primary, `button-secondary`, `button-quiet`, `button-danger`

## Action hierarchy

Primary: Pornește, Finalizează, Îngheață oferta, Acceptă oferta, Creează comanda, Eliberează pentru producție, Acceptă pentru producție, Adaugă persoană.
Secondary: Alocă executant, Retrage persoana.
Quiet: Editează nume, filters, Detalii.

## Status presentation

Operator labels stay Romanian. Internal enums stay English.

Chips are sparse: plan/task status, Activ/Retras, Conform planului / Cu abatere.

## Execution reference pattern

Lead with inscription, progress and the next action.

Task row: SEQ + operation, status, echipament/zonă, executant, quantity, action.

Wait reasons stay compact. Plan ID and capability stay in Detalii.

Completed rows recede. Tasks are grouped: Acum / următorul, Blocate, Urmează, Finalizate, then honest atelier gaps only for provider-required operations that have no eligible Machine/Workcenter. Manual operations are not workshop-configuration gaps.

## Admin catalog pattern

Owner inspection catalogs use category → item → detail. Do not flatten every resource, recipe or evidence row into one list.

Rates show value, currency and unit together, from backend evidence. UI does not convert or calculate.

Provenance uses the actual classification/source labels. Development defaults stay visually distinct from owner-confirmed truth. Raw IDs stay under Detalii.

Read-only admin pages say so once. Do not add disabled Edit controls.

Operational process catalogs use category → process → detail. Process, capability and provider stay visually separate: the process is the operation, the capability is what a provider must be able to do, the provider is where it can be done now. Coverage is a live projection, not process truth. Raw process and capability IDs stay under Detalii.

Workcenter catalogs use zone → equipment → detail. A workcenter-only provider is a zone / workstation, not a fake machine. A machine sits in a parent zone and supplies its own capabilities. Coverage is catalog presence, not busy/idle. Missing providers stay honest. Raw workcenter, machine and capability IDs stay under Detalii.

## People admin pattern

Compact rows. Create form uses `Field`. Retired list is secondary.

## Product configuration / result pattern

While editing, the form leads. Construction facts are a compact summary of supplied identity, not editable fields. Readiness is a short problem list from backend missing labels.

Review is a concise operator summary. Confirm is primary. Modify is secondary.

After confirm, the form recedes. Hierarchy: confirmed product → compact internal cost → customer price → Client selector → quote freeze → quote acceptance → order snapshot → Eliberează pentru producție → Creează planul de execuție → Deschide execuția. Customer price is more prominent than internal cost. PARTIAL commercial must not look like a final offer or allow quote freeze. Quote acceptance is not production acceptance. Creating an order is not production release. Release is not plan creation. After the plan exists, preview is hidden and task work leaves the product page. On a commercial Order the next action is Eliberează pentru producție, then Creează planul de execuție, then Deschide execuția. Acceptă pentru producție remains only the Atelier / test tehnic path when no Order exists.

EIC total stays visible. Rates stay in Detalii. Preview is what production will require. Execution is persisted work.

`?order=` on the product page continues an existing commercial job. It does not recompile or mint a new review.
`?quote=` continues an existing frozen offer. It does not recompile or mint a new review.
`?request=` opens the existing configuration with CommercialRequest context: CER- reference, current Client name, and a locked customerId. It does not parse the request description or mint Product Truth.

## Operational job overview

`/` lists commercial jobs as compact rows: inscription, stage, progress, next action.
Filters are Toate / Necesită acțiune / În execuție / Finalizate.
Metrics stay one summary line. No KPI cards, revenue, or capacity.
Stage, progress, blockers and next action come from `GET /api/jobs`.
Pilot / atelier releases are not listed.

## Offer registry

`/quotes` lists frozen quotes as compact rows: inscription, client, reference, total, stage, next action.
Filters are Toate / Necesită acțiune / Acceptate / Cu comandă.
Stage and next action come from `GET /api/quotes`.
There is no Draft or Sent chip.

## Request registry

`/requests` lists incoming requests as compact rows: title, CER- reference, client, created date, office status, derived offer progress, next action.
The title always opens `/requests/:requestId`. The next-action control may continue the furthest linked Quote.
Filters are Toate / Noi / În lucru / Așteaptă clientul / Gata de ofertă / Blocate / Anulate.
Office status and derived progress come from `GET /api/requests`.
`/requests/:requestId` is the working detail: mutable title/description/status, linked OF-* rows from QuoteOverview, and choose/configure Product from the live catalog.
Do not add empty Documents / Notes / Timeline tabs.

## Future migration

These primitives remain the **current-runtime** law. They are not the North Star visual system.

Do not migrate live `App.tsx` routes to UI20 one surface at a time. `NO_PARTIAL_ROUTE_CUTOVER = YES`. The next presentation program is an isolated vertical clean-sheet North Star over the same domain/API. After whole-spine Owner acceptance, one cutover GO may replace the presentation root.

This file remains the **currently implemented** presentation law. On `feat/architecture-c-ui-wave1-shell-resources-v1`, Architecture C Wave 1 is **implemented locally in review** for the global shell plus `/admin/resources` only. Sibling admin catalogs still use the first-HF `OwnerCatalogView` / `AdminDomainLinks` presentation. Owner has not accepted Wave 1. Wave 2 is not started.

Implemented Wave 1 facts, not a direction rewrite:

- Brand text is **WorkOS Final**. Level 1 stays Lucrări / Atelier / Comercial / Catalog / Administrare. At `max-width: 48rem`, Level 1 moves into **Meniu**; Cont stays in the header.
- Cont is a 44×44 trigger. The open menu shows short organization name, optional legal name (wrap, no 59px clip), authenticated account, theme, and logout when Cloud logout exists.
- `/admin/resources` uses Admin L2 (`Secțiuni administrative`) separate from MasterSelector. Selection authority is `?selected=<stable-catalog-item-id>`. Missing selected shows **Alege un element**. Invalid selected shows **Element inexistent**.
- At 768, **Secțiuni** and **Alege elementul** are mutually exclusive drawers. Overlay, Escape, × (`Închide`), focus return, and scroll lock apply.
- SkipLink stays **Sari la conținut** → `#continut-principal`, hidden until focus. Login wall stays **Sari la autentificare** → `#autentificare`.
- Amounts stay live Resources/Cost projections. Figma `4,25 EUR/m` is not product truth.

A Product System admin rewrite stays unauthorized. It is not the next accepted UI lot.
