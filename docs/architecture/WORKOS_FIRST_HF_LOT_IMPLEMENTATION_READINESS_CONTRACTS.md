# WorkOS first HF lot — implementation readiness contracts

Single contract truth for the first Owner-accepted high-fidelity lot, **before** any scoped UI implementation.

```text
AUTHORITY                                      = IMPLEMENTATION_READINESS_CONTRACTS
STATUS                                         = OWNER_ACCEPTED
SOURCE_OF_THIS_REVISION                        = OWNER_GO_ACCEPT_IMPLEMENTATION_READINESS_CONTRACTS_AND_FAST_FORWARD_V1
FIRST_HF_LOT_SCREEN_DESIGN                     = OWNER_ACCEPTED
HF_LOT_GATE                                    = CLOSED
FINAL_VISUAL_DIRECTION                         = A_INDUSTRIAL_CLARITY
HIGH_FIDELITY_DESIGN                           = FIRST_LOT_OWNER_ACCEPTED
IMPLEMENTATION_READINESS_CONTRACTS             = OWNER_ACCEPTED
IMPLEMENTATION_READINESS_GATE                  = CLOSED
IMPLEMENTATION_READY                           = YES
VISIBLE_RUNTIME                                = CURRENT_FOUNDATION_NOT_YET_UPDATED
UI_IMPLEMENTATION                              = NOT_STARTED
UI_IMPLEMENTATION_AUTHORIZED                   = NO
FIGMA_WRITE                                    = NO
PRODUCT_CODE_CHANGE                            = FORBIDDEN_BY_THIS_DOCUMENT
STABLE_JOB_ROUTE                               = /jobs/:jobId
STABLE_JOB_UNDERLYING_ID                       = orderSnapshotId
JOB_ENTITY_INVENTED                            = NO
STABLE_QUOTE_ROUTE                             = /quotes/:quoteSnapshotId
STABLE_QUOTE_UNDERLYING_ID                     = quoteSnapshotId
MONEY_POLICY                                   = ALT_B_SCOPED
INTERNAL_COST_OWNER_ONLY                       = YES
MARKUP_OWNER_ONLY                              = YES
MARGIN_OWNER_ONLY                              = YES
MEMBER_COMMERCIAL_PRICE_ONLY                   = YES
OPERATOR_FINANCIAL_PAYLOAD                     = NONE
SELLER_ROLE_CREATED                            = NO
API_ENFORCEMENT_REQUIRED                       = YES
```

`IMPLEMENTATION_READY = YES` means the contracts are closed and later UI work has a single truth to implement against. It is not permission to start React, CSS, routes, or APIs.

This file is the accepted route, access, mapping, foundation, and wave contract. It does not implement React, CSS, routes, APIs, migrations, or Figma writes. A later Owner GO is required before any implementation wave.

Related living authority:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` — sequence and milestone state
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` — accepted direction; not current runtime
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — current implemented presentation law
- `docs/worklog/WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1.md` — accepted lot
- `docs/worklog/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS_V1.md` — this GO’s execution record

Do not create a second implementation-readiness contract file.

## Separation of states

```text
ACCEPTED_DESIGN          = first HF lot in Figma, direction A, pages 12–21
CONTRACTS                = this file, OWNER_ACCEPTED
VISIBLE_RUNTIME          = current foundation shell, routes, and tokens
UI_IMPLEMENTATION        = NOT_STARTED
UI_IMPLEMENTATION_AUTHORIZED = NO
```

The accepted lot is the visual baseline for the pilot. Later refinement after real implementation remains allowed.

The foundation canon still records today’s shell: Level 1 label `Produse`, light-only tokens, current routes. Do not edit that canon as if the accepted Catalog label or the new shell already exist in runtime.

## Sources and honest absences

Read for this revision:

- `AGENTS.md`
- active V1 roadmap
- UI/UX direction canon
- UI/UX foundation canon
- accepted IA worklog
- visual-foundation worklog
- first HF lot worklog
- Order / Quote / Commercial-price / Execution-plan / People / Operator / Workcenters / Resources canons
- `apps/web/src/App.tsx`
- existing jobs, quotes, orders, execution, and cloud-role types and APIs
- Figma pages 10–21, read-only, for mapping only

Historical titles named in the Owner GO that **are not files in this repository**:

```text
21_WORKOS_IMPLEMENTATION_ROUTE.md              = ABSENT_HISTORICAL
Product Aggregate Flow                         = NO_FILE_WITH_THAT_TITLE
Execution Plan Flow                            = NO_FILE_WITH_THAT_TITLE
Execution Task Graph                           = NO_FILE_WITH_THAT_TITLE
Pricing Registry Separation                    = NO_FILE_WITH_THAT_TITLE
Governance Settings Policy                     = NO_FILE_WITH_THAT_TITLE
HR/Pontaj Employee Cost Boundary               = NO_FILE_WITH_THAT_TITLE
Machines/Utilaje Capacity Boundary             = NO_FILE_WITH_THAT_TITLE
```

Substitute living canons, not invented flow documents:

| Named source | Living substitute | Boundary kept |
| --- | --- | --- |
| Product Aggregate Flow | Product System / ProductTemplate / ProductAggregate canons | Template composes; aggregate orchestrates; UI does not own Product Truth |
| Execution Plan Flow | `EXECUTION_PLAN_AND_TASKS_CANON` | Plan materializes from Release; Claim-on-Start; no auto-start |
| Execution Task Graph | same canon + `OPERATOR_IDENTITY_CLAIM_ON_START_CANON` | DAG dependencies; provider only when required |
| Pricing Registry Separation | `COMMERCIAL_PRICE_RULES_CANON` + `RESOURCES_AND_COST_CANON` | Technical quantity ≠ EIC ≠ customer price; rates only in Resources/Cost |
| Governance Settings Policy | domain map + Product System technical settings canon | No global Settings dump; no fake admin Edit/Save |
| HR/Pontaj Employee Cost Boundary | People / skills canons + roadmap Stop doing | HR, pontaj, payroll = `NOT_IMPLEMENTED`; People is operational identity |
| Machines/Utilaje Capacity Boundary | `WORKCENTERS_AND_MACHINES_CANON` | Capability provider ≠ capacity; scheduling/capacity = `NOT_IMPLEMENTED` |

The roadmap already records that `21_WORKOS_IMPLEMENTATION_ROUTE.md` is historical and is not required to live here. Do not invent it.

## Existing identity inventory

### Lucrare

The commercial job root is the **Order Snapshot**. No second job entity exists.

```text
AGGREGATE                 = OrderSnapshot
STABLE_ID                 = orderSnapshotId
FORMAT                    = ord:{acceptanceId}:{contentHash}
JOB_OVERVIEW_ALIAS        = JobOverviewItem.jobId  (= orderSnapshotId)
STATUS                    = FROZEN only
LINEAGE                   = Quote → Acceptance → Order → Production Release → ExecutionPlan
```

`JobOverviewItem` already projects:

- `jobId` = `orderSnapshotId`
- `productCode`, `customerId`, `stage`, `nextAction`
- `releaseSnapshotId` (nullable)
- `planId` (nullable)
- `href` that today is **action-dependent**, not a stable job URL

Current `jobHref` law (`packages/domain/src/jobs/overview.ts`):

- `RELEASE_TO_PRODUCTION` / `CREATE_EXECUTION_PLAN` → `/products/:productCode?order=:orderSnapshotId`
- `OPEN_EXECUTION` / `CONTINUE_EXECUTION` / `VIEW_COMPLETED` → `/execution/:planId` if `planId` exists, else `/products/:productCode`

APIs today:

```text
GET  /api/jobs                                              list only
GET  /api/products/:productCode/orders/:orderSnapshotId     existing order read; requires productCode in the path
POST /api/products/:productCode/orders/:orderSnapshotId/production-release
```

There is no `GET /api/jobs/:jobId`. A single-job projection can be derived from the same join `listJobOverview` already uses. That is a loader gap, not a new aggregate.

A job exists at `ORDER_CREATED` and `RELEASED` **before** any execution plan. Detail must remain addressable without `planId`.

### Ofertă

```text
AGGREGATE                 = QuoteSnapshot
STABLE_ID                 = quoteSnapshotId
FORMAT                    = qts:{productCode}:{contentHash}
DISPLAY_REFERENCE         = OF-… from content hash (not a URL key)
STATUS                    = immutable stored snapshot
```

APIs today:

```text
GET  /api/quotes
GET  /api/products/:productCode/quote-snapshots/:quoteSnapshotId
GET  /api/products/:productCode/quote-snapshots/:quoteSnapshotId/document
```

`runtime.readQuoteSnapshot(quoteSnapshotId)` already looks up by snapshot id. The nested HTTP path still requires `productCode` to match. A product-code-free UI route can load the existing snapshot; a product-code-free public API alias is a loader convenience, not a new aggregate.

Current list continue: `/products/:productCode?quote=:quoteSnapshotId`. There is no `/quotes/:id` route.

### Roles that actually exist

```text
CLOUD_MEMBERSHIP          = owner | member
OPERATOR_WORKSHOP         = OperatorSession (PIN / People), orthogonal to Cloud membership
SELLER_COMPANY_IDENTITY   = seller:current (Date firmă), not a user role
SELLER_COMMERCIAL_ROLE    = DOES_NOT_EXIST
```

Do not invent a third Cloud membership role in this contract. Financial policy must name the missing role as a gap.

## 1. Stable job-detail route

### Existing navigation that must not become the stable URL

- `/products/:productCode?order=` is the current commercial-continue surface.
- `/execution/:planId` is the execution workspace. It does not exist before a plan.

Neither is a stable job detail. Product code is template identity, not job identity. Plan id is optional.

### Underlying identity

```text
UNDERLYING_EXISTING_ID    = orderSnapshotId
ALSO_KNOWN_AS             = JobOverviewItem.jobId
NEW_ENTITY                = FORBIDDEN
PRODUCT_CODE_IN_PATH      = FORBIDDEN
PLAN_ID_REQUIRED          = FORBIDDEN
```

The persistent id is unambiguous. Owner selected the public path. `/orders/:orderSnapshotId` is rejected as the primary UI route.

### Accepted job route

```text
STABLE_JOB_ROUTE_STATUS   = OWNER_ACCEPTED
STABLE_JOB_ROUTE          = /jobs/:jobId
PUBLIC_UI_ROUTE           = /jobs/:jobId
ROUTE_PARAM               = jobId
UNDERLYING_EXISTING_ID    = orderSnapshotId
JOB_OVERVIEW_ALIAS        = JobOverviewItem.jobId
NEW_JOB_ENTITY            = NO
NEW_JOB_TABLE             = NO
JOB_ENTITY_INVENTED       = NO
REJECTED_UI_ROUTE         = /orders/:orderSnapshotId
```

`jobId` resolves from the existing `orderSnapshotId`. No Job table. No second aggregate.

```text
DATA_LOADER               = GET /api/jobs/:jobId
                            project existing Order + optional Release + optional Plan
                            same join as listJobOverview; no new table
AUTHORIZED_ROLES          = authenticated Cloud session (owner | member)
                            OperatorSession is not a substitute for Cloud auth
                            workshop PIN does not create the job URL
                            money fields follow MONEY_POLICY / endpoint family
NOT_FOUND                 = 404 when orderSnapshotId is unknown
UNAUTHORIZED              = Cloud login wall in cloud mode; no job body
STALE_OR_DELETED          = Order Snapshot is immutable FROZEN;
                            unknown id is NOT_FOUND, not a soft-deleted live row
BACK_NAVIGATION           = Lucrări list `/`
EXECUTION_LINK            = /execution/:planId only when planId exists;
                            otherwise job detail stays and next action is
                            release or create plan
LEGACY_LINK_HANDLING      = keep /products/:code?order= until the stable route
                            is implemented and verified
                            do not break existing query continue
                            this GO implements no redirect
```

Loader gap:

```text
BACKEND_GAP               = GET /api/jobs/:jobId does not exist
EXISTING_READ             = GET /api/products/:productCode/orders/:orderSnapshotId
                            usable only when productCode is already known
```

The UI route must not wait for product code. The list already has `jobId` without opening the product page.

Jobs without a plan **must** still have this detail. That is why `/execution/:planId` cannot be the job URL.

This contract does not implement the route.

## 2. Stable quote-inspection route

```text
STABLE_QUOTE_ROUTE_STATUS = OWNER_ACCEPTED
STABLE_QUOTE_ROUTE        = /quotes/:quoteSnapshotId
PUBLIC_UI_ROUTE           = /quotes/:quoteSnapshotId
ROUTE_PARAM               = quoteSnapshotId
UNDERLYING_EXISTING_ID    = quoteSnapshotId
STABLE_QUOTE_UNDERLYING_ID = quoteSnapshotId
NEW_ENTITY                = FORBIDDEN
OF_DISPLAY_CODE_AS_KEY    = NO
DISPLAY_REFERENCE_AS_KEY  = FORBIDDEN
```

No second variant. `/quotes` already exists as the registry. The snapshot id is persistent, unique, and already the list row key. `OF-…` is a document reference, not a stable identifier.

```text
DATA_LOADER               = GET /api/quotes/:quoteSnapshotId
                            or reuse nested product route after resolving
                            productCode from the stored snapshot
                            lookup = runtime.readQuoteSnapshot(id)
AUTHORIZED_ROLES          = authenticated Cloud session (owner | member)
SNAPSHOT_BEHAVIOR         = read stored payload only; do not reprice;
                            do not reread live Customer to rewrite frozen identity
ACCEPTED_OR_RELEASED_BEHAVIOR
                          = same frozen Quote remains inspectable;
                            Acceptance and Order are separate snapshots;
                            inspection does not become job detail
NOT_FOUND                 = 404 when quoteSnapshotId is unknown
UNAUTHORIZED              = Cloud login wall in cloud mode
BACK_NAVIGATION           = Oferte list `/quotes`
LEGACY_LIST_BEHAVIOR      = `/quotes` stays the registry;
                            current row href `/products/:code?quote=` remains
                            continue-into-configurator until a later UI GO remaps href
```

Deep-link and refresh must reconstruct inspection from `quoteSnapshotId` alone. List selection in memory is not a store.

Loader gap:

```text
BACKEND_GAP               = no product-code-free GET /api/quotes/:quoteSnapshotId
EXISTING_READ             = GET /api/products/:productCode/quote-snapshots/:id
```

This contract does not implement the route.

## 3. Financial access policy

Presence on a Figma frame is not authorization. Owner selected `ALT_B_SCOPED`. Enforcement is API / read-model first, not CSS hide.

```text
MONEY_POLICY                      = ALT_B_SCOPED
POLICY_STATUS                     = OWNER_ACCEPTED
DEFAULT                           = DENY
API_ENFORCEMENT_REQUIRED          = YES
INTERNAL_COST_OWNER_ONLY          = YES
MARKUP_OWNER_ONLY                 = YES
MARGIN_OWNER_ONLY                 = YES
MEMBER_COMMERCIAL_PRICE_ONLY      = YES
OPERATOR_FINANCIAL_PAYLOAD        = NONE
SELLER_ROLE_CREATED               = NO
GENERIC_PERMISSION_SYSTEM         = NO
```

### Actors and contexts

| Context | What exists today |
| --- | --- |
| Owner/Admin | Cloud membership `owner` |
| Member în Comercial | Cloud membership `member` on Comercial read models (Cereri, Oferte, Clienți, quote inspection, configurator commercial continue) and on Lucrări / `/jobs/:jobId` (frozen commercial order; not workshop) |
| Operator/Atelier/Execuție | Atelier inbox, PIN identify, `/execution/:planId`, planned-versus-actual. A Cloud `member` in these read models still gets **no** money |
| Neautentificat | No Cloud session in cloud mode |

No Cloud role `seller`. Company Date firmă remains `seller:current`. A later Owner GO may add a finer commercial capability. Do not invent a generic permission system.

Enforcement is by **endpoint family / read model**, not by a context header and not by CSS.

### Accepted matrix

`DENY` = must not appear in that read-model payload. `ALLOW` = may appear in API and UI.

| Field | Owner/Admin | Member în Comercial | Operator/Atelier/Execuție | Neautentificat |
| --- | --- | --- | --- | --- |
| `CLIENT_NET_PRICE` | ALLOW | ALLOW | DENY | DENY |
| `VAT` | ALLOW | ALLOW | DENY | DENY |
| `CLIENT_GROSS_PRICE` | ALLOW | ALLOW | DENY | DENY |
| `INTERNAL_COST` | ALLOW | DENY | DENY | DENY |
| `MARKUP_PERCENT` | ALLOW | DENY | DENY | DENY |
| `MARGIN_VALUE` | ALLOW | DENY | DENY | DENY |
| `RESOURCE_COST_EVIDENCE` | ALLOW | DENY | DENY | DENY |
| `TECHNICAL_IDENTIFIERS` | ALLOW secondary | secondary only | secondary only | DENY |

Closed rules:

- Filter in the API / read model. UI hide is not sufficient.
- Owner keeps the full financial view, including resource cost evidence.
- Member in Comercial (and Lucrări job detail) receives client net, VAT, and gross only.
- Operator / Atelier / Execution payloads contain **no** client price and no internal cost, markup, margin, or resource-cost evidence.
- A `member` identity used on an Atelier or Execution read model still receives `OPERATOR_FINANCIAL_PAYLOAD = NONE`.
- Quote Snapshot stays frozen. Do not reprice. Do not fold HR / pontaj or internal labor rates into commercial price.
- Figma Operator 01 showing customer gross is design chrome. Closed policy wins: workshop payloads have no money.

### Current runtime (do not pretend this is the target)

- Cloud has only `owner` and `member`.
- Live configurator already shows internal cost and markup to whoever can open the product page.
- Quote list already shows customer gross to any authenticated caller.
- Resource cost-evidence **write** is owner-gated. **Read** of resources is still available to members. That is a later enforcement gap.
- These leaks stay current-runtime facts until a later implementation GO applies `ALT_B_SCOPED`.

### Rejected alternatives

```text
ALT_A  member sees the same financial payload as owner     = REJECTED
ALT_B  member prices; operator may see VAT/gross           = SUPERSEDED_BY_ALT_B_SCOPED
ALT_C  only owner sees any money                           = REJECTED
ALT_D  create a Cloud role seller now                      = REJECTED
```

## 4. Figma → code mapping

Figma file `7elwvIscvMPDiEHrX4f6kQ`, pages 10–21, read-only. Pages 12–21 remain `64:2`–`64:11`. Node ids are from the accepted lot / E2E clones and were re-checked read-only for this revision. Classification is for a later implementation GO, not a build order.

Allowed classifications: `REUSE` | `RESTYLE` | `RESTRUCTURE` | `NEW_UI_COMPONENT` | `ROUTE_CONTRACT_REQUIRED` | `BACKEND_GAP` | `OUT_OF_SCOPE`.

Do not collapse domain pages into a universal CRUD.

### Lot and shell

| Ecran / stare | Node Figma | Rută actuală | Rută contractată | Componentă existentă | Date/API | Rol | Stări | Tratament |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shell / top nav | pages 13–19 shared chrome; E2E clones p.21 | `AppShell` + `NAV_ITEMS` | same paths; Level 1 label Catalog is direction, not runtime | `AppShell`, `index.css` `.app-header` | `/api/session` org + operator chip | owner / member / identified operator | cloud login wall; single-plane DEV no login | `RESTRUCTURE` + later label change; do not edit foundation canon as if Catalog already shipped |
| Login | `67:3` / E2E `103:25` | `/login` implicit via `AppGate` | keep Cloud login wall | `LoginPage` | email/password session | `UNAUTHENTICATED` | ready / unavailable / error | `RESTYLE` |
| Lucrări listă | `68:2` empty; `68:30` / `103:39` populated; `68:112` atenție | `/` | `/` | `JobsOverviewPage` | `GET /api/jobs` | authenticated | empty / list / needs action | `RESTYLE` + href remap after route decision |
| Detaliu lucrare | `68:316` normal; `68:353` `68:392` `68:431` blocked / `103:384` | none (continue via `?order=` or `/execution/:planId`) | `/jobs/:jobId` | none as dedicated page; fragments on `ProductConfigurationPage` + `ExecutionWorkspacePage` | order + optional release + optional plan; money per `ALT_B_SCOPED` | owner full; member client prices only | no plan / released / in execution / completed / not found | `ROUTE_CONTRACT_REQUIRED` + `NEW_UI_COMPONENT` + `BACKEND_GAP` |
| Clienți listă | IA + lot client entry | `/clients` | `/clients` | `ClientsOverviewPage` | customers API | authenticated | empty / list | `RESTYLE` |
| Client workspace | `70:85` / `103:130` | `/clients/:customerId` | `/clients/:customerId` | `ClientWorkspacePage` | customer + cereri / oferte / lucrări by `customerId` | authenticated | missing client / lists | `RESTYLE` / `RESTRUCTURE` density; not a second commercial engine |
| Cereri listă | Comercial rail | `/requests` | `/requests` | `RequestsOverviewPage` | requests API | authenticated | empty / list | `RESTYLE` |
| Cerere detaliu | `70:221` / `103:180` | `/requests/:requestId` | `/requests/:requestId` | `RequestDetailPage` | request + attachments metadata | authenticated | missing / with files / continue product | `RESTYLE` |
| Oferte listă | Comercial rail | `/quotes` | `/quotes` | `QuotesOverviewPage` | `GET /api/quotes` (member: client prices only) | owner full; member client prices | empty / needs action / accepted / ordered | `RESTYLE` + href remap |
| Inspecție ofertă | `70:298` / Owner `93:1185` / E2E `103:313` | none (`?quote=` continue) | `/quotes/:quoteSnapshotId` | none as dedicated page; continue on `ProductConfigurationPage` | quote snapshot + acceptance + optional order; no reprice | owner full; member client prices | created / accepted / ordered / not found | `ROUTE_CONTRACT_REQUIRED` + `NEW_UI_COMPONENT` + `BACKEND_GAP` |
| Overlay / second job (Hotel Vest) | `93:1302` / `103:699` → `102:268` / `103:715` | none | same job/quote contracts, second snapshot | none | second frozen quote/order | same | prototype-only density | `REUSE` pattern after routes exist; not a new product |
| Catalog | IA Catalog; runtime Produse | `/products` | `/products` until a later label GO | `ProductCatalogPage` | product catalog | authenticated | family / category / item | `RESTYLE`; label Catalog is direction only |
| Configurator | `71:198` / `103:218` | `/products/:productCode` | `/products/:productCode` | `ProductConfigurationPage`, `FormRenderer` | compile / confirm / EIC / commercial | authenticated; money per policy | incomplete / PARTIAL / COMPLETE | `RESTRUCTURE` controls to match lot; **no new calculator** |
| Atelier | `71:395` / `103:453` | `/atelier` | `/atelier` | `AtelierPage` | ready tasks / claim-on-start; **no money fields** | identified operator; `member` still `OPERATOR_FINANCIAL_PAYLOAD = NONE` | empty / ready / blocked | `RESTYLE` / `RESTRUCTURE` |
| Identificare (PIN) | lot identification chrome | operator chip / identify | keep session, not a new entity | `OperatorSessionContext` | PIN identify / reset | workshop | unidentified / identified / error | `RESTYLE` |
| Execuție | `71:509` / `103:487` | `/execution/:planId` | `/execution/:planId` | `ExecutionWorkspacePage`, `ExecutionPlanPanel` | plan + tasks; **no money fields** | identified operator; assign/start/complete unchanged | blocked / in progress / complete / missing plan | `RESTYLE` / `RESTRUCTURE`; route stays plan-scoped, not job detail |
| Planned vs actual | `71:1089` / `103:596` | same execution workspace | same `/execution/:planId` (section or view) | `ExecutionWorkspacePage` actuals | planned vs actual quantities; cost projection Owner-only | Owner full money; operator/member workshop `NONE` | missing actuals = honest PARTIAL | `RESTRUCTURE`; no second cost engine |
| Resurse | `72:65` | `/admin/resources` | `/admin/resources` | `ResourcesAdminPage`, `CostEvidenceEditor` | resources / cost evidence | owner only for amounts; member DENY evidence | list / detail / owner write | `RESTYLE` / `RESTRUCTURE`; rates stay in Resources/Cost |

### Admin pattern reuse — not universal CRUD

| Ecran / stare | Node Figma | Rută actuală | Rută contractată | Componentă existentă | Date/API | Rol | Stări | Tratament |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| People | reuse list/detail | `/admin/people`, `/admin/people/:id` | same | `PeopleAdminPage`, `PersonAdminPage` | people / skills / PIN | owner writes | add / retire / unavailable | `REUSE` pattern; domain stays People |
| Date firmă / Seller | reuse owner form | `/admin/seller` | same | `SellerAdminPage` | `seller:current` | owner | missing / confirmed | `REUSE` pattern; not a user role |
| Stoc | reuse derived balance | `/admin/stock` | same | `StockAdminPage` | derived movements | authenticated inspect; owner truth | negative allowed | `REUSE` pattern; no purchasing |
| Utilaje / Workcenters | reuse capability map | `/admin/workcenters` | same | `WorkcentersAdminPage` | providers / capabilities | owner inspect | mapped / unmapped | `REUSE` pattern; **not** capacity UI |
| Procese | admin inspect | `/admin/processes` | same | `ProcessesAdminPage` | process catalog | owner | composition / shop-floor ops | `REUSE` if restyled with lot tokens |
| Product System inspect | `/components`, `/admin/product-system` | same | same | `ComponentsPage`, `ProductSystemAdminPage` | settings / labels | owner write labels | inspect | `OUT_OF_SCOPE` for first lot chrome except token restyle if touched |
| HR / pontaj / capacity | — | none | none | none | none | — | — | `OUT_OF_SCOPE` |
| Analyzer | — | none | none | none | none | — | — | `OUT_OF_SCOPE` |
| Mobbin / production kit | — | none | none | none | none | — | — | `OUT_OF_SCOPE` |

### Prototype limits that stay limits

Accepted lot recorded: `Pornește` unwired; Escape / focus specified, not engine-proven. Implementation must not treat the prototype as a second runtime.

## 5. Implementation foundation (no code)

### Tokens

Figma Semantic Proposed exists for LIGHT and DARK. SYSTEM is documented as follow-OS, not a third palette.

Current runtime (`apps/web/src/index.css`) is light-only anonymous tokens: `--bg`, `--surface`, `--ink`, `--accent`, status colors. No dark scheme. No shadcn theme.

```text
TOKEN_SOURCE              = Figma Semantic Proposed (lot foundation)
RUNTIME_TODAY             = light-only custom properties
LIGHT                     = map accepted semantic tokens onto :root
DARK                      = [data-theme=dark] or equivalent; not implemented
SYSTEM                    = prefers-color-scheme → LIGHT | DARK; not implemented
SHADCN                    = NOT_SELECTED
KIT_JUSTIFICATION         = current primitives are local (PageHeader, StatusChip,
                            Notice, EmptyState, Field). Do not adopt shadcn
                            unless a later Owner GO justifies replacing them.
```

### Reusable components (existing, restyle first)

`PageHeader`, `StatusChip`, `StatePill`, `Notice`, `EmptyState`, `Field`, `RegistrySearchField`, `OwnerWriteHint`, button roles already in CSS.

Lot may need **new presentation** components (decision header, money line, job context rail). Those are UI shells. They must not own pricing, readiness, or Product Truth.

### Icons

```text
LUCIDE                    = specified in the lot; not installed in the product
WORKOS_CUSTOM             = 16 icons in Figma; not in the product
INSTALL                   = later UI GO only
```

### Accessibility

```text
FOCUS                     = visible focus on all controls; overlay trap when a drawer exists
KEYBOARD                  = lists, rails, dialogs operable without pointer
CONTRAST                  = WCAG 2.2 AA against accepted LIGHT and DARK tokens
LABELS                    = Romanian visible labels; inputs have accessible names
REDUCED_MOTION            = prefers-reduced-motion: no decorative motion
```

Lot specified Escape/focus; that is a requirement for later implementation, not proven.

### Breakpoints

```text
1440                      = primary lot canvas
1280                      = compress rails; keep top nav
768                       = stack; do not invent mobile-first employee app
BELOW_768                 = out of first-lot promise
```

### Honest states

Every contracted surface must have empty, loading, error, blocked, unauthorized, success. Use existing `EmptyState` / `Notice` before inventing new status chrome.

### What can later be styled without backend change

Shell restyle, login restyle, Lucrări / Cereri / Clienți / Oferte **lists**, Catalog restyle, Atelier restyle, execution restyle, resources restyle, admin pattern restyle, token mapping, icons, 1440/1280/768 layout.

### What needs a contract or API before UI

```text
GET /api/jobs/:jobId                         job detail deep-link; jobId = orderSnapshotId
GET /api/quotes/:quoteSnapshotId             quote inspection; product-code-free
ALT_B_SCOPED field projection                API/read-model; UI hide ≠ API deny
Catalog Level 1 label                        direction accepted; runtime still Produse
Cloud role `seller`                          does not exist; do not invent
```

Route prefix and money policy are Owner-accepted. Loaders and projections remain unimplemented.

## 6. Implementation waves

No wave is authorized. Waves are large enough for E2E progress and small enough to verify. Default order:

### Wave 1 — semantic foundation, theme, shell

```text
FILES_OR_SURFACES         = index.css tokens; AppShell; LoginPage chrome;
                            shared PageHeader / StatusChip / EmptyState / Notice
DEPENDENCIES              = accepted Figma tokens; no route change required
RISK                      = restyle mistaken for Catalog already shipped;
                            dark theme leaking unfinished
TESTS                     = existing shell/login tests stay green;
                            token presence tests; no visual PASS from screenshot alone
VISUAL_PROOF              = 1440 + 1280 + 768 shell and login vs lot frames
ROLLBACK_BOUNDARY         = CSS + shell only; domain untouched
OWNER_GATE                = token/shell visual check; Catalog label still later
```

### Wave 2 — stable routes and decision workspaces

```text
FILES_OR_SURFACES         = App routes; job detail page; quote inspection page;
                            jobHref / quoteOverviewHref remap;
                            GET /api/jobs/:jobId ; GET /api/quotes/:id
DEPENDENCIES              = accepted `/jobs/:jobId` and `/quotes/:quoteSnapshotId`;
                            loaders above; no Job table
RISK                      = inventing a Job entity; keying on productCode;
                            breaking ?order= / ?quote= continue
TESTS                     = deep-link + refresh job without plan;
                            deep-link quote; 404; auth wall; legacy query still works
VISUAL_PROOF              = job blocked states + quote inspection vs lot
ROLLBACK_BOUNDARY         = new routes + loaders; lists can keep old href
OWNER_GATE                = route prefix + first workspace review
```

### Wave 3 — Comercial → lucrare

```text
FILES_OR_SURFACES         = requests, quotes list, clients, client workspace,
                            configurator continue, freeze/accept/order actions
DEPENDENCIES              = Wave 2 routes; `ALT_B_SCOPED` on commercial read models
RISK                      = second commercial engine; UI pricing; rewriting snapshots
TESTS                     = existing commercial E2E + new inspection deep-links
VISUAL_PROOF              = cerere → configurator → ofertă → lucrare
ROLLBACK_BOUNDARY         = commercial UI only; snapshot writers unchanged
OWNER_GATE                = commercial path visual + money visibility
```

### Wave 4 — Atelier → Execuție → planned-versus-actual

```text
FILES_OR_SURFACES         = AtelierPage; ExecutionWorkspacePage; actuals;
                            operator identify chrome
DEPENDENCIES              = existing Claim-on-Start; Wave 1 tokens; job link to plan
RISK                      = any money in atelier/execution payloads;
                            changing DAG law; treating prototype Pornește as wired
TESTS                     = claim/start/complete; actuals PARTIAL honesty;
                            provider blocker; PIN session;
                            member-on-atelier payload has no prices
VISUAL_PROOF              = atelier, blocked execution, PvA vs lot
ROLLBACK_BOUNDARY         = execution UI; planner/runtime law unchanged
OWNER_GATE                = workshop money + PvA readability
```

### Wave 5 — Resources and admin reuse

```text
FILES_OR_SURFACES         = ResourcesAdminPage; CostEvidenceEditor;
                            People / Seller / Stock / Workcenters restyle
DEPENDENCIES              = Wave 1 tokens; owner write gates unchanged
RISK                      = universal CRUD; capacity UI; HR fields
TESTS                     = owner write still owner-only; stock derived; no new writes
VISUAL_PROOF              = resources list/detail vs `72:65`; one admin reuse sample
ROLLBACK_BOUNDARY         = admin CSS/layout only
OWNER_GATE                = admin reuse looks like the lot, not a new product
```

### Wave 6 — regression, accessibility, screenshot comparison

```text
FILES_OR_SURFACES         = all lot routes; a11y checks; screenshot baseline
DEPENDENCIES              = Waves 1–5 closed enough to compare
RISK                      = screenshot-only PASS; claiming runtime equals Figma
TESTS                     = keyboard, contrast, reduced motion, existing E2E
VISUAL_PROOF              = side-by-side lot vs runtime; differences listed
ROLLBACK_BOUNDARY         = test/baseline only if no last-minute visual edits
OWNER_GATE                = visual comparison review; still not Cloud root
```

```text
IMPLEMENTATION_WAVES              = DEFINED_NOT_AUTHORIZED
IMPLEMENTATION_READY              = YES
UI_IMPLEMENTATION_AUTHORIZED      = NO
```

Waves remain a plan. `IMPLEMENTATION_READY = YES` does not start them.

## 7. Owner decisions

Closed by the acceptance GO:

```text
STABLE_JOB_ROUTE                  = /jobs/:jobId
STABLE_JOB_UNDERLYING_ID          = orderSnapshotId
JOB_ENTITY_INVENTED               = NO
REJECTED_JOB_UI_ROUTE             = /orders/:orderSnapshotId
STABLE_QUOTE_ROUTE                = /quotes/:quoteSnapshotId
STABLE_QUOTE_UNDERLYING_ID        = quoteSnapshotId
OF_DISPLAY_CODE_AS_KEY            = NO
MONEY_POLICY                      = ALT_B_SCOPED
INTERNAL_COST_OWNER_ONLY          = YES
MARKUP_OWNER_ONLY                 = YES
MARGIN_OWNER_ONLY                 = YES
MEMBER_COMMERCIAL_PRICE_ONLY      = YES
OPERATOR_FINANCIAL_PAYLOAD        = NONE
SELLER_ROLE_CREATED               = NO
API_ENFORCEMENT_REQUIRED          = YES
```

Later, not this lot: Cloud role `seller`; Catalog label in the live shell.

## 8. What this file forbids

- React / CSS / route / API implementation from this file alone
- a new Job entity or Job table
- a Cloud role `seller` or a generic permission system
- product, pricing, or process law changes
- migrations, seeds, real data, Cloud root
- Figma writes
- treating Figma money chrome as API authorization
- treating `IMPLEMENTATION_READY` as a UI implementation GO
- universal CRUD
- HR / pontaj / capacity / Analyzer / Mobbin
