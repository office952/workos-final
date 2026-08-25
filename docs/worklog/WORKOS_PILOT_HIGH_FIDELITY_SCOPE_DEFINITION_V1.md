# WORKOS_PILOT_HIGH_FIDELITY_SCOPE_DEFINITION_V1

Owner-accepted first high-fidelity lot for `HUB_MEDIA_CLEAN_PILOT`, with amendments. Specification only. Not drawing. Not implementation.

```text
VERDICT                              = PASS
OWNER_SCOPE_DECISION                 = ACCEPTED_WITH_AMENDMENTS
HF_SCOPE_GATE                        = CLOSED
STATUS                               = OWNER_ACCEPTED
PILOT_HIGH_FIDELITY_SCOPE_DEFINITION = OWNER_ACCEPTED
HIGH_FIDELITY_DRAWING                = NOT_STARTED
UI_IMPLEMENTATION                    = NOT_AUTHORIZED
PRODUCT_CODE_DIFF                    = NONE
```

## A. Identity

```text
REPO     = office952/workos-final
WORKTREE = C:\Users\offic\workspace\workos-final-pilot-hf-scope
BRANCH   = docs/pilot-high-fidelity-scope-v1
BASE     = f2361bf113e0385d1e4c1893640ad635b3876fa4
REMOTE   = https://github.com/office952/workos-final.git
COMMIT   = YES_IF_PASS
PUSH     = NO
```

```text
ROADMAP_READ       = YES
UI_UX_CANON_READ   = YES
DIRECTION_CONFLICT = NO
```

No direction conflict: IA remains Owner-accepted; Owner has now accepted this scope with amendments. It does not reopen A/B/C, rename Level 1, move Product System, invent routes, or authorize React/CSS. The foundation canon still records today’s `Produse` label. That is current runtime law, not a conflict.

## B. Sources

Read in full before writing:

- `AGENTS.md`
- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md`
- `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md`
- `docs/worklog/ui-ux-audit-v1/evidence-index.md`
- `docs/worklog/ui-ux-audit-v1/source-to-manifest-reconciliation.md`
- `apps/web/src/App.tsx` and the pilot-path pages
- Figma `7elwvIscvMPDiEHrX4f6kQ` pages 00–08

Closed IA, not reopened:

```text
GLOBAL_NAV_STRUCTURE = A_TOP_NAV
LEVEL_1_DOMAINS      = Lucrări | Atelier | Comercial | Catalog | Administrare
LEVEL_2_RULE         = CONTEXTUAL_ONLY_WHEN_NEEDED
CATALOG_LABEL        = Catalog
CONFIGUREAZĂ_ROLE    = CONTEXTUAL_ACTION
PRODUCT_SYSTEM       = Administrare
DENSITY              = INTERMEDIATE
PRIMARY_DETAIL       = STABLE_PAGE
ADMIN_COLLECTIONS    = SPLIT_LIST_DETAIL
SHORT_ACTIONS        = DRAWER_OR_DIALOG
```

B sidebar and C hybrid remain historical evidence.

## C. Three notions, kept separate

```text
HF_REFERENCE_SCREENS              = compositions drawn later, after a drawing GO; scope is now Owner-accepted
IMPLEMENTATION_ROUTE_COVERAGE     = every pilot-blocking App.tsx route has a pattern and acceptance criterion
PILOT_OPERATIONAL_PREREQUISITES   = real org configuration that HF cannot replace
```

A route may reuse a drawn pattern. No pilot-blocking route may stay without pattern, required states, and an acceptance criterion.

## D. Pilot E2E that the first lot must prove

```text
CLIENT
→ CERERE
→ OFERTĂ
→ ACCEPTARE / ELIBERARE
→ LUCRARE
→ PLAN DE EXECUȚIE
→ ATELIER / IDENTIFICARE
→ START / BLOCARE / EXECUȚIE
→ FINALIZARE
→ PLANNED VS ACTUAL
```

```text
JOB_DETAIL_IN_FIRST_LOT       = YES
JOB_DETAIL_SCREEN             = REQUIRED_IN_FIRST_HF_LOT
EXECUTION_IN_FIRST_LOT        = YES
QUOTE_DECISION_INSPECTION     = FIRST_HF_LOT
```

A lot of only shell, homepage, and Catalog is rejected. Without job detail and execution there is no planned-vs-actual review. The operator must inspect the offer before accept / release. That inspection may reuse the stable-detail pattern. It is not deferred until the first lot fails.

## E. Route facts used (not invented)

`apps/web/src/App.tsx` has 26 source routes, including `*`. There is **no** dedicated `/jobs/:id`, `/orders/:id`, or `/quotes/:id`. This file does not invent those paths.

Current continue hrefs:

```text
CURRENT_JOB_NAVIGATION = /products/:code?order= OR /execution/:planId
jobHref    = /products/:code?order=   when next action is release or create plan
           | /execution/:planId       when next action is open / continue / view completed
quoteHref  = /products/:code?quote=   when next action is accept or create order
           | /products/:code?order=   when an order already exists
```

```text
JOB_DETAIL_SCREEN             = REQUIRED_IN_FIRST_HF_LOT
STABLE_JOB_ROUTE_CONTRACT     = REQUIRED_BEFORE_UI_IMPLEMENTATION
STABLE_JOB_ROUTE_FINAL_VALUE  = NOT_SELECTED
```

Job detail is a **missing first-class page**, not a missing business entity. High-fidelity may define the page architecture. UI implementation must not start until a stable job URL contract is decided from the domain model. This file does not select `/jobs/:id`, `/orders/:id`, or any other invented path, and it does not change `jobHref`.

Quote decision inspection is also first-lot. Today there is no `/quotes/:id`. The operator must still inspect the frozen offer before accept / release. HF may reuse P-STABLE-DETAIL. A distinct quote URL, if later needed, is a contract required before implementation. It is not invented here.

Planned-vs-actual already projects on `/execution/:planId` (`ExecutionPlanPanel`). Job detail must make that comparison readable at job level, in operational language, without hashes or DTO names as the hero.

## F. First lot — HF reference screens

Draw these compositions. Variants are states of the same screen, not extra pages.

| # | Composition | Primary route today | Distinct / reuse | Why first lot |
| --- | --- | --- | --- | --- |
| 1 | Shell — top-nav Catalog, L2 Comercial, skip/focus/keyboard, org, operator, logout | chrome | DISTINCT foundation | Bound navigation and a11y start here |
| 2 | Cloud login | gate, not a path | DISTINCT | Real Cloud Owner enters here |
| 3 | Lucrări list | `/` | DISTINCT | Job registry empty/populated |
| 4 | Detaliu lucrare | no dedicated route; see §E | DISTINCT | Owner-required; planned-vs-actual |
| 5 | Clienți list | `/clients` | DISTINCT | E2E starts with Client |
| 6 | Client workspace | `/clients/:customerId` | DISTINCT | Client → cereri / oferte / lucrări |
| 7 | Cereri list | `/requests` | DISTINCT | Incoming queue |
| 8 | Detaliu cerere | `/requests/:requestId` | DISTINCT | Title, files, choose product |
| 9 | Oferte list | `/quotes` | DISTINCT | Frozen offers and next action |
| 10 | Inspecție ofertă (decizie) | no `/quotes/:id`; today `/products/:code?quote=` | DISTINCT via P-STABLE-DETAIL | Inspect before accept / release |
| 11 | Catalog | `/products` | DISTINCT | Search + list/detail; Configurează contextual |
| 12 | Configurator + commercial decisions | `/products/:productCode` plus `?request=` `?quote=` `?order=` | DISTINCT | Confirm, PDF, accept, order, release, create plan |
| 13 | Atelier inbox | `/atelier` | DISTINCT | Identify gate + ready work |
| 14 | Identificare operator | dialog in `AppShell` | DISTINCT short action | Eligible / invalid PIN |
| 15 | Execuție | `/execution/:planId` | DISTINCT | Start, block, complete, actuals |
| 16 | Resurse list/detail | `/admin/resources` | DISTINCT admin model | Large-collection pattern |

Required states (only those that change hierarchy, decision, or primary action):

| Composition | States |
| --- | --- |
| Shell | 1440 / 1280 / 768; LIGHT and DARK same hierarchy; SYSTEM follows OS; skip link; focus visible |
| Cloud login | empty form; invalid credentials; success into shell |
| Lucrări | empty; populated; loading; error; filter empty; needs-attention |
| Detaliu lucrare | awaiting release; awaiting plan; in execution; blocked (lipsă utilaj); completed + planned-vs-actual |
| Clienți | empty; populated; loading; error |
| Client workspace | current profile + linked cereri / oferte / lucrări |
| Cereri | empty; populated; create-in-drawer; loading; error |
| Detaliu cerere | draft/new; with files; ready to configure; linked offer; blocked/cancelled |
| Oferte | empty; needs accept; accepted/create order; with order |
| Inspecție ofertă | frozen offer readable before accept; after accept; with order; PDF from snapshot |
| Catalog | search/filter list; empty category is not a card-wall architecture |
| Configurator | editing; missing/PARTIAL blocked; confirmed COMPLETE; request-locked client; quote freeze/PDF; accept; create order; release; create plan |
| Atelier | unauthorized; eligible inbox empty; eligible with startable task; ineligible |
| Identificare | empty PIN; invalid PIN; success |
| Execuție | planned/startable; machine-blocked; in-progress; completed; ineligible person; planned-vs-actual |
| Resurse | search + filters + list + detail + Detalii disclosure; unconfirmed vs owner-confirmed |

Viewport and theme for every first-lot composition:

```text
VIEWPORTS = 1440 | 1280 | 768
THEME     = LIGHT + DARK + SYSTEM
```

768 must keep hierarchy. It must not become one infinite column. Phone-first rewrite stays deferred.

## G. First lot — route coverage by reuse (not extra compositions)

| Surface | Route | Classification | Pattern reused | Pilot dependence |
| --- | --- | --- | --- | --- |
| Admin door | `/admin` | REUSE | Domain door / list of work areas | Find Sistem produs and Resurse |
| People list | `/admin/people` | REUSE | Admin collection | Operators, PIN, skills |
| Person detail | `/admin/people/:personId` | REUSE | Stable detail + short actions | PIN / availability |
| Skills | `/admin/people/skills` | REUSE | Admin collection | Eligibility |
| Seller | `/admin/seller` | REUSE | Short form / drawer | Ofertă PDF identity |
| Stock list | `/admin/stock` | REUSE | Admin collection | Opening balances before consumption |
| Stock item | `/admin/stock/:resourceId` | REUSE | Stable detail | Same |
| Workcenters | `/admin/workcenters` | REUSE | Admin collection | 3 LETTERS machine operations |
| Processes | `/admin/processes` | REUSE | Admin collection | Inspection only if a process is missing |
| Catch-all | `*` | REUSE | Redirect to Lucrări | Not a designed page |

```text
ADMIN_PATTERN_REUSE        = YES
UNIVERSAL_CRUD             = FORBIDDEN
DOMAIN_SEMANTICS_PRESERVED = YES
```

These are pilot-blocking **operational** surfaces. They do not each get a unique HF artboard if they can reuse Resurse / detail / drawer. They still need states and acceptance criteria.

Visual reuse does not flatten business behavior. People, Seller, Stoc, and Utilaje may share list / detail / form structure. Each keeps its own roles, states, validations, actions, operational language, access rules, and domain truth. Universal CRUD is forbidden.

## H. Second lot

| Composition | Route | Reason |
| --- | --- | --- |
| Sistem produs | `/admin/product-system` | Admin truth; not the first LETTERS sale |
| Module / components inspection | `/components` | Inspection, not daily operator path |
| Guvernanță | `/governance` | Inspection |
| Stare sistem | `/system` | Health, not the job |
| Distinct Utilaje / Procese artboards | `/admin/workcenters`, `/admin/processes` | Only if domain-aware reuse of Resurse fails honesty of coverage |
| Admin customers | `/admin/customers` | Commercial clients already live on `/clients` |

## I. Deferred

- mobile-first rewrite and employee-mobile
- shop-floor map as Atelier replacement
- HR / pontaj / payroll
- command palette as catalog architecture
- universal CRUD / Machine Admin
- Analyzer, Logo, full ACM
- B sidebar and C hybrid
- Intake V6 SVG layers
- final visual style, palette, token values, type ramp, radius, elevation, iconography, shadcn
- Owner visual acceptance
- scoped UI implementation

## J. Pattern map

| Pattern | Used by |
| --- | --- |
| P-SHELL | all first-lot pages |
| P-REGISTRY | Lucrări, Cereri, Oferte, Clienți |
| P-STABLE-DETAIL | Detaliu lucrare, cerere, inspecție ofertă, client workspace, execuție, person, stock item |
| P-COLLECTION | Catalog, Resurse, People, Stock, Workcenters, Processes |
| P-SHORT-ACTION | Identificare, Client nou, Cerere nouă, PIN, seller short write |
| P-CONFIGURATOR | Catalog item → configure → commercial decisions |
| P-TASK-INBOX | Atelier |
| P-TASK-BOARD | Execuție |
| P-THEME | LIGHT / DARK / SYSTEM on every first-lot composition |

Semantic tokens are **planned** in this scope: canvas, surface, ink, border, accent, status, overlay, focus, space, type. Values stay unselected.

## K. Operational prerequisites (not HF)

HF cannot create the first real job. Before the real LETTERS walk:

- recovered HUB MEDIA organization stays the only real org
- People with PIN and skills
- CNC face, CNC back, forming provider
- seller identity for Ofertă PDF
- one real Client
- stock opening balances before first consumption
- no wholesale old-database adoption

## L. Acceptance criteria for later drawing

A later high-fidelity GO PASSes only if:

1. Shell shows Catalog, not Produse, and keeps five Level 1 domains.
2. Comercial Level 2 is contextual only.
3. Job detail is a first-class stable page with client, cerere, ofertă, plan, progress, next action, and planned-vs-actual. The stable job URL contract is decided from the domain model before UI implementation. No invented `/jobs/:id` or `/orders/:id` in this file.
4. Execution shows startable, machine-blocked, in-progress, completed, and ineligible, with the job context kept and the primary action obvious.
5. Commercial path Client → Cerere → Ofertă inspect → accept / eliberare is drawn, not implied. Quote decision inspection is first-lot and may reuse stable detail.
6. Catalog is search + list/detail. Configurează is a contextual action. Product System is not Level 1.
7. Resurse demonstrates the large-collection pattern.
8. LIGHT and DARK keep the same hierarchy. 768 keeps hierarchy.
9. Accessibility is designed with the foundation: skip, focus, keyboard, labels, contrast, not-color-alone, reduced motion.
10. No backend hashes, DTO names, or capability IDs as primary operator language.
11. Short creates use drawer/dialog. Permanent create forms must not push the list below the fold.
12. The page is still specification-faithful: this file and Figma page 09 are scope, not visual style.

## M. Owner Review block

```text
OWNER_SCOPE_DECISION       = ACCEPTED_WITH_AMENDMENTS
HF_SCOPE_GATE              = CLOSED
QUOTE_DECISION_INSPECTION  = FIRST_HF_LOT
JOB_DETAIL                 = FIRST_HF_LOT
EXECUTION                  = FIRST_HF_LOT
STABLE_JOB_ROUTE_CONTRACT  = REQUIRED_BEFORE_IMPLEMENTATION
ADMIN_REUSE                = DOMAIN_AWARE_NOT_UNIVERSAL_CRUD
HIGH_FIDELITY              = NOT_STARTED
VISUAL_STYLE               = NOT_SELECTED
TOKEN_VALUES               = NOT_SELECTED
COMPONENT_LIBRARY          = NOT_SELECTED
UI_IMPLEMENTATION          = NOT_AUTHORIZED
NEXT                       = PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION
```

Owner has accepted this lot with amendments. High-fidelity drawing is still not authorized. Visual style remains unselected.

## N. Matrix

| Domain | Route | Role | Operational purpose | States | 1440/1280/768 | L/D/S | Pattern | HF | Lot | Why | Pilot dep. | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shell | chrome | all | Move between work areas | active, focus, skip | YES | YES | P-SHELL | DISTINCT | 1 | IA lock | — | Catalog; 5 domains; keyboard |
| Auth | cloud gate | owner | Enter Cloud org | empty, invalid, success | YES | YES | P-SHORT-ACTION | DISTINCT | 1 | Real Owner | Cloud Owner exists | Fail-closed login |
| Lucrări | `/` | office / owner | See jobs and next action | empty, populated, load, error, filter-empty | YES | YES | P-REGISTRY | DISTINCT | 1 | Job home | orders exist later | Next action visible |
| Lucrări | job detail (target stable URL) | office / owner | Inspect one job through planned-vs-actual | release, plan, exec, blocked, complete | YES | YES | P-STABLE-DETAIL | DISTINCT | 1 | Owner lock | order + plan | No backend hero; PvA readable |
| Comercial | `/clients` | office | Find client | empty, populated, load, error | YES | YES | P-REGISTRY | DISTINCT | 1 | E2E start | — | List not a form wall |
| Comercial | `/clients/:customerId` | office | Client workspace | profile + linked work | YES | YES | P-STABLE-DETAIL | DISTINCT | 1 | Return flow | customer | One engine, no CRM |
| Comercial | `/requests` | office | Incoming queue | empty, populated, create-drawer | YES | YES | P-REGISTRY | DISTINCT | 1 | Cerere | client | Create off the fold |
| Comercial | `/requests/:requestId` | office | Work one request | new, files, configure, linked offer, blocked | YES | YES | P-STABLE-DETAIL | DISTINCT | 1 | E2E | request | Files + Configurează |
| Comercial | `/quotes` | office | Frozen offers | empty, accept, order | YES | YES | P-REGISTRY | DISTINCT | 1 | Accept path | quote | Next action = inspect/accept |
| Comercial | quote inspect (no `/quotes/:id` today) | office | Inspect frozen offer before accept / release | frozen, accepted, with order, PDF | YES | YES | P-STABLE-DETAIL | DISTINCT | 1 | Owner lock | quote | Inspect first; no invented route |
| Catalog | `/products` | office | Pick sellable product | list/search, no card-wall | YES | YES | P-COLLECTION | DISTINCT | 1 | Configure entry | templates exist | Configurează contextual |
| Catalog | `/products/:productCode` | office | Configure and decide commercially | edit, blocked, confirmed, request/quote/order | YES | YES | P-CONFIGURATOR | DISTINCT | 1 | Quote→release | COMPLETE EIC | One primary action |
| Atelier | `/atelier` | operator | Claim ready work | unauth, empty, startable, ineligible | YES | YES | P-TASK-INBOX | DISTINCT | 1 | Claim-on-Start | PIN + skills | Task first |
| Atelier | identify dialog | operator | Say who works here | empty, invalid, success | YES | YES | P-SHORT-ACTION | DISTINCT | 1 | Identity | People PIN | Modal, labelled |
| Execuție | `/execution/:planId` | operator / office | Do the 12 operations | startable, machine-blocked, in-progress, done, ineligible, PvA | YES | YES | P-TASK-BOARD | DISTINCT | 1 | Owner lock | plan | Job context kept |
| Admin | `/admin/resources` | owner | Cost evidence collection | search, list, detail, Detalii | YES | YES | P-COLLECTION | DISTINCT | 1 | Pattern model | — | No category menu tree |
| Admin | `/admin` | owner | Domain door | loaded | YES | YES | P-SHELL | REUSE | 1 | Find domains | — | Sistem produs not L1 |
| Admin | `/admin/people` | owner | Operators | list | YES | YES | P-COLLECTION | REUSE | 1 cov. | Pilot people | People=0 now | Reuse Resurse |
| Admin | `/admin/people/:personId` | owner | One person | detail + PIN | YES | YES | P-STABLE-DETAIL | REUSE | 1 cov. | Eligibility | — | Names only if authorized |
| Admin | `/admin/people/skills` | owner | Skills | list | YES | YES | P-COLLECTION | REUSE | 1 cov. | Eligibility | — | Reuse |
| Admin | `/admin/seller` | owner | Date firmă | empty, saved | YES | YES | P-SHORT-ACTION | REUSE | 1 cov. | PDF seller | Seller=0 now | No CIF/IBAN invention |
| Admin | `/admin/stock` | owner | Derived balances | list | YES | YES | P-COLLECTION | REUSE | 1 cov. | Opening stock | Stock=0 now | Reuse |
| Admin | `/admin/stock/:resourceId` | owner | One balance | detail | YES | YES | P-STABLE-DETAIL | REUSE | 1 cov. | Same | — | Reuse |
| Admin | `/admin/workcenters` | owner | Machines / zones | list/detail | YES | YES | P-COLLECTION | REUSE | 1 cov. | 3 CNC ops | Machines=0 now | Honesty, not map |
| Admin | `/admin/processes` | owner | Process catalog | list/detail | YES | YES | P-COLLECTION | REUSE | 2 unless gap | Compiler already exists | — | Reuse |
| Admin | `/admin/product-system` | owner | Product truth | collection | YES | YES | P-COLLECTION | DISTINCT | 2 | Not first sale | templates exist | Stay in Administrare |
| Inspect | `/components` | owner | Components | inspect | — | — | P-COLLECTION | REUSE | 2 | Not daily | — | Not L1 |
| Inspect | `/governance` | owner | Governance | inspect | — | — | — | REUSE | 2 | Not daily | — | Not L1 |
| Inspect | `/system` | owner | Health | ok/error | — | — | — | REUSE | 2 | Not the job | — | Romanian |
| Admin | `/admin/customers` | owner | Duplicate client admin | — | — | — | — | DEFER | D | `/clients` wins | — | No second engine |
| Other | `*` | all | Unknown URL | redirect | — | — | P-SHELL | REUSE | 1 cov. | Fail-closed | — | Lands on Lucrări |

`1 cov.` = first-lot implementation coverage by reuse, not a separate artboard.

## O. Adjustments vs the 12-screen proposal

Kept and **moved into the first lot**: Detaliu lucrare, Execuție, Clienți, Configurator commercial states, inspecție ofertă.

Justified additions: Cloud login; identify dialog; Client workspace; Cerere detail. Each is on the E2E path or is the only way to reach a required state.

Moved to second lot: Sistem produs as a distinct artboard.

Not invented: `/jobs/:id`, `/orders/:id`, `/quotes/:id`. Quote inspection and job detail are first-lot screens; their final stable URLs stay unselected until a domain-model contract exists.

## P. Stop

```text
HIGH_FIDELITY_DRAWING = NOT_STARTED
UI_IMPLEMENTATION     = NOT_AUTHORIZED
FIGMA_PAGES_00_08     = UNCHANGED
FIGMA_PAGE_09         = PILOT HIGH-FIDELITY SCOPE
REAL_CLOUD_ROOT       = UNTOUCHED
PUSH                  = NO
```
