# UI/UX foundation canon

Canonical current law for WorkOS operator/admin presentation.
Runtime wins if this document disagrees.

## UI owns experience, not business truth

React may own layout, hierarchy, interaction, local UI state and responsive behavior.

React must not own product truth, pricing, provider eligibility, executor eligibility, dependencies, task transitions or readiness.

## Shell

This file records the **implemented** shell. Living navigation direction is the V3 stable sidebar in `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.

```text
IMPLEMENTED_SHELL                      = STABLE_SIDEBAR_V3
UI_UX_NAVIGATION_V3_DESIGN             = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION     = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION      = IN_PROGRESS
CLIENTS_V3                             = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION                = OWNER_ACCEPTED
CLIENTS_RUNTIME                        = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE                     = CLOSED
CLIENT_HUB_FIGMA_FINAL                 = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME                     = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE              = CLOSED
CLIENT_HUB                             = INTEGRATED_ON_MAIN
NEXT_PROGRAM_PRIORITY                  = UI_V3_COMMERCIAL_PAGE_REORGANIZATION
```

Wave 1 implements this sidebar on main. Page-content transformation is `IN_PROGRESS`. Clients V3 registry is `INTEGRATED_ON_MAIN`. Client Hub is `INTEGRATED_ON_MAIN`. Cereri, Oferte, and Lucrări page-content transformations remain unaccepted.

Primary navigation is one stable sidebar. Categories are labels. Hidden destinations stay in the registry and are not rendered:

```text
COMERCIAL     Clienți → /clients · Cereri → /requests · Oferte → /quotes · Catalog → /products
PRODUCȚIE     Lucrări → /jobs and / · Atelier → /atelier
RESURSE       Resurse și costuri → /admin/resources · Stoc → /admin/stock · Utilaje → /admin/workcenters
OAMENI        Angajați → /admin/people
ADMINISTRARE  Firmă → /admin/seller · Servicii operaționale → /admin/operational-services · Sistem produs → /admin/product-system · Guvernanță → /governance
HIDDEN        Acasă · Furnizori · Achiziții · Pontaj · Plăți și avansuri · Politici
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

New pages prefer these primitives. Existing pages migrate one surface at a time.

This file remains the **currently implemented** presentation law for the first HF lot. On `feat/architecture-c-ui-wave1-shell-resources-v1`, Architecture C Wave 1 is **implemented locally in review** for the global shell plus `/admin/resources` only. Sibling admin catalogs still use the first-HF `OwnerCatalogView` / `AdminDomainLinks` presentation. Owner has not accepted Wave 1. Wave 2 is not started.

Implemented Wave 1 facts, not a direction rewrite:

- Brand text is **WorkOS Final**. Level 1 stays Lucrări / Atelier / Comercial / Catalog / Administrare. At `max-width: 48rem`, Level 1 moves into **Meniu**; Cont stays in the header.
- Cont is a 44×44 trigger. The open menu shows short organization name, optional legal name (wrap, no 59px clip), authenticated account, theme, and logout when Cloud logout exists.
- `/admin/resources` uses Admin L2 (`Secțiuni administrative`) separate from MasterSelector. Selection authority is `?selected=<stable-catalog-item-id>`. Missing selected shows **Alege un element**. Invalid selected shows **Element inexistent**.
- At 768, **Secțiuni** and **Alege elementul** are mutually exclusive drawers. Overlay, Escape, × (`Închide`), focus return, and scroll lock apply.
- SkipLink stays **Sari la conținut** → `#continut-principal`, hidden until focus. Login wall stays **Sari la autentificare** → `#autentificare`.
- Amounts stay live Resources/Cost projections. Figma `4,25 EUR/m` is not product truth.

A Product System admin rewrite stays unauthorized. It is not the next accepted UI lot.
