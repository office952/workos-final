# WorkOS UI20 — vertical North Star clean-sheet architecture

```text
STATUS                            = ACCEPTED_WITH_AMENDMENTS
AUTHORITY                         = OWNER_DELEGATE_CHATGPT
UI20_IMPLEMENTATION_STRATEGY      = VERTICAL_CLEAN_SHEET
UI_DESIGN                         = CLEAN_SHEET_PRESENTATION
DOMAIN_REBUILD                    = NO
BACKEND_REBUILD                   = NO
API_REBUILD                       = NO
PRODUCT_TRUTH_REBUILD             = NO
IMPLEMENTATION                    = NO
PARTIAL_MAIN_UI_INTEGRATION       = FORBIDDEN
RW2_PR21                          = SUPERSEDED_AS_IMPLEMENTATION_PATH
RW2_CODE                          = REFERENCE / SELECTIVE_EXTRACTION_ONLY
CANON_RECONCILIATION              = THIS_CONTROL_PLANE
```

Owner / ChatGPT accepted the Cursor architecture with amendments on 2026-09-06.
Accepted IA, Visual Direction, research, and Figma remain valid. RW1 on main
remains historical integrated runtime evidence. RW2 remains reference and
selective extraction only, not a merge path.

Chronology, honestly:

```text
R0 clean-sheet intent (UI_DESIGN = CLEAN_SHEET, DOMAIN_REBUILD = NO)
→ research / accepted IA + visual
→ RW1 shell implementation on main
→ RW2 horizontal page experiment
→ Owner detects horizontal migration risk
→ vertical clean-sheet strategy accepted with amendments
```

Historical acceptance remains historical truth. Living implementation sequence
changes now.

Worktree / branch for this plan:

```text
WORKTREE = C:\Users\offic\workspace\workos-final-wt\ui20-vertical-north-star
BRANCH   = design/ui20-vertical-north-star-clean-sheet
BASE     = origin/main = 8c168dc6417af040eff0f79f033e287fbd9b807c
```

RW2 remains isolated as reference only:

```text
WORKTREE = C:\Users\offic\workspace\workos-final-wt\ui20-rw2-cerere-config
BRANCH   = design/ui20-rw2-cerere-config-composition-lens
HEAD     = 69ecd7bea24f446d66c4a6c9d9382df92b277338
PR       = https://github.com/office952/workos-final/pull/21
PR_ROLE  = HISTORICAL_REMOTE_EVIDENCE_DO_NOT_MERGE
```

---

## Owner decision this plan obeys

Vertical North Star runtime, one coherent product experience, then cutover:

```text
Cerere → Configurator → Ofertă → Acceptare / Order → Lucrare → Atelier → Execuție
```

Order continuity is required even without a dedicated `Comandă` North Star page:

```text
Quote → Acceptance → Order Snapshot → Production Release → Job → Execution Plan → Atelier / Execution
```

Home is a launchpad proof **after** that spine works. Do not migrate `/` to Acasă.
`ACASA_ROOT = NOT_AUTHORIZED`.

Preserve business engines. Do not preserve legacy page composition by default.

Critical rule: **NO PARTIAL MAIN INTEGRATION.** The existing presentation stays
the living operator runtime until Owner accepts the whole vertical instrument.

---

## Canon / direction report

```text
ROADMAP_READ           = YES
AGENTS_READ            = YES
UI_UX_CANON_READ       = YES
FOUNDATION_CANON_READ  = YES
DIRECTION_CONFLICT     = RESOLVED_BY_CANON_RECONCILIATION
```

Living sequence after this control-plane reconciliation:

```text
UI20_IMPLEMENTATION     = RW1_INTEGRATED_VERTICAL_CLEAN_SHEET_NEXT
NEXT_RECOMMENDED_BUILD  = UI20_VERTICAL_NORTH_STAR_CLEAN_SHEET
UI20_RW2                = SUPERSEDED_BY_VERTICAL_CLEAN_SHEET
```

IA / Visual / research remain aligned:

- IA3 Quiet Destinations + Object Continuity
- Candidate A quiet top shell **concept** (RW1 on main is evidence, not the
  final North Star chrome)
- G Living Fabrication Instrument
- Romanian-first
- 1440 / 1280 / 768
- light / dark
- semantic motion
- 44px targets
- keyboard / focus
- object continuity

---

## CURRENT_FRONTEND_ARCHITECTURE

Recorded against this worktree HEAD (`8c168dc`, same as `origin/main`).

### Entry and gate

| Layer | File | Role |
|---|---|---|
| Boot | `apps/web/src/main.tsx` | `ThemeProvider` → `BrowserRouter` → `App` |
| Theme engine | `apps/web/src/theme/ThemeProvider.tsx` | `system` / `light` / `dark`; `data-theme` |
| App | `apps/web/src/App.tsx` | Cloud gate → `OperatorSessionProvider` → `AppShell` → routes |
| Cloud session | `apps/web/src/CloudSessionContext.tsx` | Auth / org / mode |
| Operator session | `apps/web/src/OperatorSessionContext.tsx` | Identify / logout / operator identity |
| Login | `apps/web/src/LoginPage.tsx` | Boot / network / unauthenticated gates |
| Shell | `apps/web/src/AppShell.tsx` | RW1 Candidate A quiet top + object strip + mobile drawer |

`/` and `/jobs` both mount `JobsOverviewPage`. `/` is **not** Home.

### Route → current page → North Star personality

| Runtime route | Current page | North Star instrument | In first vertical runtime |
|---|---|---|---|
| `/requests/:id` | `RequestDetailPage.tsx` | Cerere = Resolution Field | YES |
| `/products/:productCode?request=` | `ProductConfigurationPage.tsx` | Configurator = Construction Composition + Context Lens | YES |
| `/quotes/:id` | `QuoteInspectionPage.tsx` | Ofertă = Commercial Sheet | YES |
| `/jobs/:id` | `JobDetailPage.tsx` | Lucrare = Production Traveler | YES |
| `/atelier` | `AtelierPage.tsx` | Atelier = Dispatch Floor | YES |
| `/execution/:planId` and related | `ExecutionWorkspacePage.tsx` | Execuție = Workstation | YES |
| `/` and `/jobs` | `JobsOverviewPage.tsx` | Lucrări list — **not** Acasă | NO (keep current until later GO) |
| `/home` | not implemented | Acasă launchpad proof only | ISOLATED PROOF ONLY |
| `/requests` | `RequestsOverviewPage.tsx` | Cereri registry | OUT OF FIRST VERTICAL |
| `/quotes` | `QuotesOverviewPage.tsx` | Oferte registry | OUT OF FIRST VERTICAL |
| `/clients`, `/clients/:id` | Clients pages | Client Hub | OUT OF FIRST VERTICAL |
| `/products` | `ProductCatalogPage.tsx` + `OwnerCatalogView.tsx` | Catalog | OUT OF FIRST VERTICAL |
| Admin / Resources / People / Stock | `*AdminPage.tsx` | Control / ledger | OUT OF FIRST VERTICAL |
| `/login` gates | `LoginPage.tsx` | Auth | KEEP ENGINE; restyle later |

### Presentation today

The living UI is a **hybrid**:

1. RW1 quiet top shell (`GlobalShellTop`, `GlobalNavigation`,
   `ObjectContextStrip`, `MobileNavigationDrawer`,
   `ui20NavigationPresentation.ts`).
2. V3 / first-HF page bodies (`*Page.tsx`) composed with generic furniture
   (`PageHeader`, `Notice`, `MetricCard`, `EmptyState`, card stacks).
3. One large `apps/web/src/index.css` that still carries V3 visual law plus
   RW1 shell tokens.
4. `ProductConfigurationPage` is a god page: schema form, compile / confirm,
   EIC / commercial, quote / order / execution continuation, and catalog
   leftovers live in one presentation surface.

Business truth does **not** live in CSS. It lives in `@workos-final/domain`,
API, and the `*Api.ts` clients. Several `*View.ts` files already project
domain contracts into Romanian operator copy without owning Product Truth.

### RW1 / RW2 status for this reset

| Wave | Role now |
|---|---|
| RW1 on main | Evidence that Candidate A can wrap existing routes. Keep as shell **concept**. Do not treat current `AppShell` chrome as the finished North Star. |
| RW2 branch | Evidence that Cerere can be a Resolution Field and Config can be Composition + Lens **without** domain rebuild. Do not merge. Lift projection lessons; discard hybrid furniture. |

---

## KEEP_MAP

Classification for the **current web layer**. Packages outside `apps/web`
(`packages/domain`, `apps/api`, SQLite, tests that prove domain/API) are
preserved by Owner decision and are out of this map except as engines the
web layer must call.

### KEEP_AS_ENGINE

Do not rewrite. Do not fork. New presentation only calls these.

| Area | Files / packages | Why |
|---|---|---|
| Domain contracts | `@workos-final/domain` | ProductDefinition, compile, confirm, quote, order, execution, installation, permissions |
| API / SQLite | `apps/api` | Living backend |
| Product API client | `apps/web/src/productApi.ts` | Schema, draft, compile, confirm, EIC, commercial, quote / order / execution |
| Requests API | `apps/web/src/requestsApi.ts` | Request CRUD, installation facts, attachments, related objects |
| Quotes API | `apps/web/src/quotesApi.ts` | Quote snapshot inspection / acceptance |
| Jobs API | `apps/web/src/jobsApi.ts` | Job / traveler facts |
| Atelier API | `apps/web/src/atelierApi.ts` | Dispatch / operational inbox |
| Customer / seller | `customerApi.ts`, `sellerApi.ts` | Client / firm identity |
| People / inventory / ops / system | `peopleApi.ts`, `inventoryApi.ts`, `operationalServicesApi.ts`, `systemApi.ts` | Adjacent engines used by later surfaces |
| Cloud auth | `cloudAuth.ts`, `cloudSessionApi.ts`, `CloudSessionContext.tsx` | Cloud gate |
| Operator session | `operatorSessionApi.ts`, `OperatorSessionContext.tsx`, `OperatorIdentifyForm.tsx` | Atelier identify |
| Fetch / expiry | `fetchAccess.ts`, `sessionExpiryBridge.ts`, `organizationAccess.ts` | Authz transport |
| Theme engine | `theme/ThemeProvider.tsx` | One theme system; tokens may be recalibrated, not duplicated |
| Route identity | `navigation/routePath.ts`, `navigationRegistry.ts` destination IDs / hrefs | Deep links and destination truth |
| Visibility / capability | `navigation/visibleNavigation.ts` | Who may see which destination |
| Catalog data helpers | `catalogProducts.ts`, `catalogQuery.ts`, `ownerCatalog.ts` (data, not `OwnerCatalogView` chrome) | Catalog identity for product pick |
| Health | `health.ts` | System probe |

### KEEP_AS_NON_VISUAL_LOGIC

Projection, formatting, search, scroll, and orchestration that do not own
business truth. New surfaces import these. If a file mixes projection with
V3 markup, split later: keep the function, replace the JSX.

| File | Keep |
|---|---|
| `requestObjectView.ts` | Primary verb, related quote/job, Romanian request facts |
| `requestsRegistryView.ts` | List projection |
| `clientsRegistryView.ts`, `clientWorkspaceView.ts` | Client projection (later surfaces) |
| `installationPresentation.ts` | Installation copy from domain flags |
| `pvaProjection.ts` | Planned vs actual projection |
| `formatDisplay.ts` | Display formatting |
| `resourcesCatalog.ts`, `resourcesWorkspace.ts`, `workcentersCatalog.ts` | Admin data shaping |
| `useRequestsRegistryState.ts`, `useRegistrySearchQuery.ts`, `useRequestsRegistryScroll.ts`, `useClientsRegistryScroll.ts` | Registry UX state, not Product Truth |
| `requestsWorkspaceOrigin.ts`, `clientsWorkspaceOrigin.ts` | Return / origin continuity |
| `adminNavigation.ts` | Admin destination grouping (data) |
| `ui20NavigationPresentation.ts` | Slot grouping over registry truth — adapt chrome, keep mapping idea |
| RW2 `requestResolutionView.ts` | Known / unresolved partitioning from `RequestDetailProjection` — **lift, do not rewrite as a second brain** |
| RW2 `constructionCompositionModel.ts` | Schema → composition tree from `getComponentContract` — **lift** |

`FormRenderer.tsx` is **not** a business engine. It applies domain
`isFieldVisible` / schema. Keep that contract use. Replace its field chrome.

### ADAPT

Reuse the contract and call path; rewrite only the surface that wraps them.

| Current | Adapt into |
|---|---|
| `App.tsx` Cloud / operator gate | Same gate in isolated `ui20` runtime |
| `AppShell.tsx` + RW1 chrome | New quiet top + object continuity under `ui20/shell` |
| `RequestDetailPage.tsx` + RW2 Resolution Field | `ui20/surfaces/cerere` |
| `ProductConfigurationPage.tsx` + RW2 Composition / Lens | `ui20/surfaces/configurator` — **split the god page**; quote / order / execution leave this surface |
| `QuoteInspectionPage.tsx` | `ui20/surfaces/oferta` |
| `JobDetailPage.tsx` | `ui20/surfaces/lucrare` |
| `AtelierPage.tsx` | `ui20/surfaces/atelier` |
| `ExecutionWorkspacePage.tsx` + `ExecutionPlanPanel.tsx` + `PlannedVersusActual.tsx` | `ui20/surfaces/execution` |
| `RequestInstallationFactsForm.tsx` | Cerere unresolved cluster — same API writes |
| `FormRenderer.tsx` | Configurator lens field renderer |
| `ProductConfigurationViews.tsx` | Keep compile / confirm / commercial **data binding**; replace card furniture |
| `StatePill.tsx`, `ClientLink.tsx` | Recast as North Star chips / object links |
| Theme CSS variables | Recalibrate under `ui20/tokens`; one `data-theme` owner |

### REPLACE_PRESENTATION

Do not copy these into `ui20/` as layout law.

| Current | Why replace |
|---|---|
| All first-vertical `*Page.tsx` JSX composition | V3 page templates |
| `OwnerCatalogView.tsx` presentation | Generic catalog furniture |
| `ui/PageHeader.tsx`, `Notice.tsx`, `MetricCard.tsx`, `EmptyState.tsx`, `MasterSelector.tsx` as default page grammar | Generic card / header language |
| `ui/StableSidebar.tsx` | Old sidebar (already unused by RW1; delete after cutover) |
| Most of `index.css` page / card / V3 rules | Old visual furniture |
| RW1 `GlobalShellTop` / `GlobalNavigation` as **final** chrome | Concept kept; visual rebuild inside `ui20/shell` |
| RW2 hybrid leftovers (`ConfiguratorSummary` / `ConstructionFacts` as parallel authority) | ChatGPT already flagged; do not promote |

### DELETE_LATER_AFTER_CUTOVER

Only after the isolated North Star is accepted and one cutover GO replaces
default presentation. Not now.

- Legacy `*Page.tsx` bodies for the six spine routes
- Orphan V3 CSS
- `StableSidebar.tsx`
- Unused generic furniture if no remaining non-spine page needs it
- Duplicate RW2 files once their projection functions live in
  `apps/web/src/` (non-visual) and `ui20/` (presentation)

Registries, Client Hub, Admin, Resources stay on current pages until a later
vertical or coverage wave. They are not deleted in the first cutover.

---

## REPLACE_MAP

| North Star surface | Current composition to stop using | New presentation owner |
|---|---|---|
| Cerere | `RequestDetailPage` sections, generic cards, mixed install / files / related as V3 stack | `ui20/surfaces/cerere/ResolutionField` |
| Configurator | `ProductConfigurationPage` god-page + `OwnerCatalogView` leftovers + hardcoded role furniture | `ui20/surfaces/configurator/ConstructionComposition` + `ContextLens` |
| Ofertă | `QuoteInspectionPage` inspection cards | `ui20/surfaces/oferta/CommercialSheet` |
| Lucrare | `JobDetailPage` composed job cards | `ui20/surfaces/lucrare/ProductionTraveler` |
| Atelier | `AtelierPage` inbox cards | `ui20/surfaces/atelier/DispatchFloor` |
| Execuție | `ExecutionWorkspacePage` workspace chrome | `ui20/surfaces/execution/Workstation` |
| Shell | RW1 / leftover sidebar as living chrome | `ui20/shell` |
| Home proof | none on `/` | `ui20/shell/HomeLaunchpad` only **after** the commercial→production spine works |

Figma is experience direction, **not** business fields, prices, EIC, or rates.
Do not implement Figma `16,00 EUR / m²` or any hardcoded FACE / VOLUME / BACK /
LIGHTING universal UI. ACM has no VOLUME / LIGHTING.

---

## UI20_NEW_PRESENTATION_BOUNDARY

Proposed isolated tree. **Not created in this wave.**

```text
apps/web/src/
  main.tsx / App.tsx / providers / *Api.ts / ThemeProvider   # SHARED ENGINE
  ui20/
    runtime/
      previewEntry.tsx       # THIN preview selector only; no second auth/session
      Ui20App.tsx            # presentation root; uses shared providers
      Ui20Routes.tsx         # same public pathnames
    shell/
      Ui20Shell.tsx
      QuietTop.tsx
      ObjectContinuity.tsx
      HomeLaunchpad.tsx      # AFTER spine; not Pass A
    surfaces/
      cerere/ ...
      configurator/ ...
      oferta/ ...            # includes acceptance / order / release continuity
      lucrare/ ...
      atelier/ ...
      execution/ ...
    tokens/
      ui20.css
      motion.css
```

Import rule:

```text
ui20/**  MAY import  apps/web/src/*Api.ts
ui20/**  MAY import  apps/web/src/*View.ts and other non-visual projectors
ui20/**  MAY import  @workos-final/domain  for types and already-owned helpers
ui20/**  MUST NOT    reimplement compile / confirm / price / readiness / rates
ui20/**  MUST NOT    be imported by living *Page.tsx until cutover GO
living *Page.tsx     MUST NOT import ui20/** until cutover GO
```

Temporary parallel runtime (amended):

```text
shared bootstrap / providers / auth / session / APIs / ThemeProvider
        │
        ├── LegacyApp        current runtime
        │
        └── Ui20App          isolated North Star preview
```

A second Vite/dev entry is permitted **only** as a thin preview selector.
Two ports may run for comparison. They are two presentations over **one**
WorkOS engine. Do not duplicate auth, Cloud session, operator gate, API
clients, ThemeProvider, permissions, Product Truth, or calculations.

- **Same pathnames**: `/requests/:id`, `/products/:code`, `/quotes/:id`,
  `/jobs/:id`, `/atelier`, `/execution/:planId`.
- Same API origin.
- `/` remains Lucrări in both presentations.
- `/home` is built only after the commercial→production spine works.

Forbidden until cutover GO:

- Swapping `App.tsx` route elements one page at a time
- Shipping Cerere-only or Config-only into default main
- Treating PR #21 as a merge path

---

## SHARED_LOGIC_BOUNDARY

```text
BUSINESS OWNER     = packages/domain + apps/api + SQLite
TRANSPORT OWNER    = apps/web/src/*Api.ts + fetchAccess / session
PROJECTION OWNER   = *View.ts / RW2 view models lifted into apps/web/src/
PRESENTATION OWNER = apps/web/src/ui20/
```

Shared across living runtime and North Star:

- API clients
- session / auth / permissions
- destination hrefs and visibility
- request primary-action rules in `requestObjectView.ts`
- schema visibility via domain `isFieldVisible`
- product compile / confirm / commercial through `productApi.ts`
- quote / order / execution law through existing clients
- ThemeProvider (one `data-theme`)

Not shared:

- JSX page trees
- V3 CSS
- OwnerCatalogView layout
- hardcoded commercial numbers
- a second Product Truth

---

## ROUTE_CUTOVER_STRATEGY

```text
PHASE_0  Isolated Ui20App preview exists. Living App.tsx unchanged.
PHASE_1  Pass A/B/C on one branch; whole spine reviewed as ONE product.
PHASE_2  Owner / ChatGPT accept the vertical instrument.
PHASE_3  ONE cutover GO: presentation root becomes Ui20App.
         Same pathnames. Same domain/API. Same IDs.
PHASE_4  DELETE_LATER_AFTER_CUTOVER.
```

No Phase 3 work in this document. No `/` → Acasă in Phase 3 either.
Acasă root migration remains the existing IA hold (explicit contract later).
Home launchpad is not part of Pass A.

During Phase 0–1, living e2e continues to prove the current runtime.
North Star gets its own e2e against the isolated entry.

---

## NO_DUPLICATE_BUSINESS_LOGIC_PROOF

How the same engines power new chrome:

| Operator action | Living path | North Star path | Forbidden duplicate |
|---|---|---|---|
| Load Cerere | `getRequest` / detail projection | same `requestsApi` | local known/unresolved invented from raw fields |
| Installation facts | `RequestInstallationFactsForm` → requests API | same form contract, new cluster chrome | UI-owned readiness |
| Alege produs | `requestCatalogHref` / `requestObjectPrimaryAction` | same href `/products?request=` | Config owning CommercialRequest Product Truth |
| Schema + visibility | `productApi` + domain `isFieldVisible` | same | hardcoded FACE/VOLUME/BACK/LIGHTING |
| Compile / confirm | `productApi` | same; Configurator does not become Quote | page-local calculator |
| EIC / commercial | product commercial endpoints | Ofertă / existing commercial binding only | Figma prices |
| Quote snapshot | `quotesApi` | Commercial Sheet reads snapshot | mutable quote in UI |
| Acceptance / order / release | existing quote/order/release APIs | same mutations; no invented Comandă page unless product needs one | skip Order and jump Ofertă → Lucrare |
| Job traveler | `jobsApi` | Production Traveler | UI-owned production state |
| Atelier rows | `atelierApi` | Dispatch Floor | UI-owned dispatch ranking |
| Execution tasks | execution APIs already used by workspace | Workstation | creating tasks before frozen Order / Release |
| Rates | Resources / Cost | never in ui20 | `16,00 EUR / m²` |

Proof rule for every later implementation PR:

1. New `ui20` file contains no price, readiness, or Product Truth literal.
2. Mutation goes through an existing `*Api.ts` function.
3. Domain tests stay green without ui20 imports.
4. A side-by-side runtime comparison uses the **same** request / quote / job
   IDs and shows the same business facts, different chrome.

---

## NORTH_STAR_IMPLEMENTATION_SEQUENCE

Authorized only after this canon reconciliation is accepted and a later Owner
implementation GO. One branch. Not horizontal RW waves. Not one page polished
to final before the spine exists.

### PASS A — VERTICAL SKELETON

Functional journey on real existing domain/API behavior:

```text
Cerere
→ Configurator
→ Ofertă
→ Acceptare / Order
→ Lucrare
→ Atelier
→ Execuție
```

Prove the product works as one WorkOS 2.0 path before instrument depth.

### PASS B — INSTRUMENT DEPTH

```text
Cerere       = Resolution Field
Configurator = Construction Composition + Context Lens
Ofertă       = Commercial Sheet
Lucrare      = Production Traveler
Atelier      = Dispatch Floor
Execuție     = Workstation
```

Selective extraction allowed only for reviewed pure projection, especially
`requestResolutionView` and `constructionCompositionModel`, with tests.
Do not cherry-pick the RW2 commit. Do not inherit RW2 CSS, hybrid page
composition, or stacked old/new furniture.

### PASS C — WHOLE PRODUCT POLISH

1440 / 1280 / 768, light / dark, keyboard, focus, 44px, motion, reduced
motion, overflow, Romanian copy, optical Figma/runtime reconciliation.

### After the spine

Home / Acasă launchpad proof only. `/` stays Lucrări.
Client Hub / Resources / Admin stay outside the first vertical build.

Do not start RW3. Do not polish main incrementally.

---

## FIGMA_NODE_MAP

File: `WorkOS UI UX 2.0 — E2E`  
`FILE_KEY = 0XP0yGa1siWQdTTL7ou8xz`

Figma = personality and continuity. Not field authority.

### Accepted VIS1 North Star (1440)

| Instrument | Personality | Node |
|---|---|---|
| Cerere | Resolution Field | `234:66` |
| Configurator | Construction Composition + Context Lens | `234:103` |
| Ofertă light frozen | Commercial Sheet | `235:66` |
| Ofertă dark frozen | Commercial Sheet | `235:102` |
| Lucrare | Production Traveler | `235:138` |
| Atelier | Dispatch Floor | `235:177` |
| Execuție dark | Workstation | `235:260` |

### VIS1 responsive (authoritative table in VIS1 gate)

| Instrument | 1280 | 768 |
|---|---|---|
| Cerere | — | `236:379` |
| Configurator | `236:256` | `236:399` |
| Ofertă | — | `236:421` |
| Lucrare | `236:286` | `236:436` |
| Atelier | `236:311` | `236:456` |
| Execuție | — | `236:489` |

### VIS1A refined nodes (later accepted visual refinements; evidence, not a second IA)

| Instrument | Node | Notes |
|---|---|---|
| Cerere 1440 | `239:69` | VIS1A Resolution Field |
| Configurator 1280 | `240:66` | VIS1A composition + lens |
| Cerere 768 | `241:161` | |
| Configurator 768 | `241:66` | |
| Ofertă 768 | `241:100` | |
| Lucrare 768 | `241:183` | |
| Atelier 768 | `241:126` | |
| Execuție 768 | `241:202` | |

Implementation must prefer the latest Owner-accepted visual node when they
differ, without treating historical A3/A3.1 or H1 inventory IDs as canon.

### Out of first vertical runtime (do not build now)

| Surface | VIS1 node | Why wait |
|---|---|---|
| Client Hub | `236:66` | Not on the six-stop spine |
| Resources | `236:106` | Ledger survival is later coverage |
| Admin | `236:208` | Control surface later |
| Acasă / Home | IA launchpad; no `/` migration | After spine only; no Figma-write; `ACASA_ROOT = NOT_AUTHORIZED` |

### Preserve proofs (not pages)

| Proof | Node |
|---|---|
| Focus | `236:500` |
| No-color | `236:512` |
| Long copy | `236:521` |
| Reduced motion | `236:528` |
| Motion storyboard | `236:536` |

---

## TEST_STRATEGY

```text
DOMAIN / API UNIT + INTEGRATION   = KEEP running against living packages
LIVING WEB UNIT / E2E             = KEEP on current App.tsx until cutover
UI20 ISOLATED E2E                 = NEW, isolated entry, real API
UI20 UNIT                         = NEW, presentation + lifted view models
DO_NOT                             = green living tests as proof that North Star is done
```

Isolated e2e must exercise the real path:

```text
SOURCE OF TRUTH → DOMAIN → API → ui20 PROJECTION → OPERATOR → RUNTIME → TEST
```

Minimum isolated path (synthetic, existing engines):

1. Open Cerere by id.
2. Complete unresolved facts if required (same installation API).
3. Alege produs → Configurator with `?request=`.
4. Schema-driven composition / lens (no hardcoded roles).
5. Confirm through existing product API.
6. Open Ofertă snapshot.
7. Acceptance → Order Snapshot → Production Release (existing APIs; no invented Comandă page).
8. Open Lucrare.
9. Open Atelier row for that job.
10. Open Execuție workstation.

Do not claim PASS from screenshots alone. Screenshots are optical evidence
beside runtime tests.

Living Playwright specs stay pointed at the current runtime so main does not
silently depend on unfinished `ui20` chrome.

---

## RUNTIME_COMPARISON_STRATEGY

Until cutover, two local runtimes may run:

| Runtime | Purpose | Port (local convention) |
|---|---|---|
| Living RW1 main presentation | Operator-safe current app | existing web port |
| Isolated North Star | Review-only clean sheet | new unused port |

Comparison protocol:

1. Same API base, same SQLite, same object IDs.
2. Same operator identity / permissions.
3. Same deep-link pathnames.
4. Record business facts (client, CER, selected product, quote state, job
   state, blocked reason) from both UIs.
5. PASS comparison = facts match, chrome differs.
6. FAIL comparison = ui20 invented a fact, hid a blocker, or called a new
   business path.

RW2 evidence under the RW2 worktree `.tmp/ui20-rw2-evidence/` is optical
reference for Cerere / Config only. It is not a cutover artifact.

---

## ESTIMATED_FILES_AFFECTED

Estimates for the **future** isolated implementation, not this docs-only wave.

| Bucket | Count | Notes |
|---|---|---|
| New under `apps/web/src/ui20/` | 35–70 | runtime, shell, 6 surfaces, tokens |
| Thin preview selector | 1–3 | optional second port; shared providers |
| Lifted / split view models in `apps/web/src/` | 4–8 | resolution + composition + any god-page splits |
| New isolated e2e | 1–3 specs | whole spine |
| Living `App.tsx` / pages during Phase 0–1 | 0 route swaps | isolation rule |
| Cutover later | 1 `App.tsx` + shell mount | single GO |
| Delete later | 8–20 page/CSS/furniture files | after cutover |
| Domain / API | 0 | Owner lock |

This planning file is the only intended current-tree write.

---

## RISKS

1. A later agent ignores living flags and follows a historical RW2 worklog
   or the historical IR1 wave table.
2. `ProductConfigurationPage` currently hosts post-config commercial /
   production continuation. Splitting presentation can accidentally split
   authority if adapters are sloppy.
3. Dual presentation drift if someone “fixes” a bug only in ui20 or only in
   living pages — they share engines, not chrome.
4. Building a second independent application stack instead of a thin preview
   over shared providers.
5. Windows case-insensitive collisions if composition files are named
   `constructionComposition.ts` + `ConstructionComposition.tsx` (RW2 lesson:
   use `constructionCompositionModel.ts`).
6. Figma numbers / universal role chrome leaking into ui20.
7. Building Home first and mistaking it for authorized Acasă root migration.
8. Scope creep into Client Hub / Resources / Admin because VIS1 has those
   nodes.
9. Jumping Ofertă → Lucrare without Acceptance / Order / Release.

---

## BLOCKERS

```text
IMPLEMENTATION_GO                         = MISSING
ACASA_ROOT_MIGRATION                      = NOT_AUTHORIZED
PARTIAL_MAIN_UI_INTEGRATION               = FORBIDDEN
FIGMA_WRITE                               = FORBIDDEN
DOMAIN / API / PRODUCT_TRUTH CHANGE       = FORBIDDEN
RW2_MERGE                                 = FORBIDDEN
```

Canon sequence reconciliation is the control-plane work for this PR.
Implementation must not start until Owner accepts this reconciliation and
issues a later construction GO.

---

## What this control-plane wave did / did not do

Did:

- Record ChatGPT architecture amendments in this worklog.
- Reconcile living roadmap / UI canon / Foundation / IR1 / AGENTS so agents
  no longer read RW2 as the next implementation path.

Did not:

- Implement React / CSS
- Build `apps/web/src/ui20/`
- Merge this PR
- Merge or continue PR #21
- Start RW3
- Write to Figma
- Migrate `/` to Home
- Authorize North Star construction
