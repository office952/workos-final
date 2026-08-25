# WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1

First high-fidelity lot drawn in Figma for `HUB_MEDIA_CLEAN_PILOT`. Owner accepted it as the visual baseline for the pilot. Acceptance does not freeze later refinement after real implementation and testing. Not UI implementation.

```text
VERDICT                          = PASS
STATUS                           = OWNER_ACCEPTED
FIRST_HF_LOT_SCREEN_DESIGN       = OWNER_ACCEPTED
OWNER_FIRST_HF_LOT_REVIEW        = PASS
HF_LOT_GATE                      = CLOSED
OWNER_DECISION                   = ACCEPTED
FINAL_VISUAL_DIRECTION           = A_INDUSTRIAL_CLARITY
VISUAL_DIRECTION_GATE            = CLOSED
DIRECTION_B                      = NOT_SELECTED_REFERENCE_ONLY
DIRECTION_C                      = NOT_SELECTED_REFERENCE_ONLY
UI_IMPLEMENTATION                = NOT_AUTHORIZED
NEXT_STEP                        = FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS
PRODUCT_CODE_DIFF                = NONE
UI_CODE_DIFF                     = NONE
CSS_DIFF                         = NONE
CANON_DIFF                       = NONE
REAL_CLOUD_ROOT                  = UNTOUCHED
ROUTE_INVENTED                   = NO
REAL_DATA_IN_FIGMA               = NO
```

## A. Identity

```text
REPO     = office952/workos-final
WORKTREE = C:\Users\offic\workspace\workos-final-pilot-hf-scope
BRANCH   = design/first-hf-lot-screen-design-v1
BASE     = fb7b9cb843edf1cdd95e34f4ac4de258da7c5d53
ORIGIN_MAIN = fb7b9cb843edf1cdd95e34f4ac4de258da7c5d53
REMOTE   = https://github.com/office952/workos-final.git
COMMIT   = YES_IF_PASS
PUSH     = NO
SESSION_CONTINUITY = KEEP_THIS_CHAT_AND_WORKTREE
```

```text
ROADMAP_READ             = YES
UI_UX_CANON_READ         = YES
HF_SCOPE_READ            = YES
VISUAL_FOUNDATION_READ   = YES
ROUTE_SOURCE_READ        = YES
FIGMA_00_TO_11_READ      = YES
DIRECTION_CONFLICT       = NO
```

No direction conflict: Owner-accepted IA and visual direction A stay closed. B and C remain reference on page 11. This GO draws the first lot in A and does not reopen A/B/C, invent `/jobs/:id`, `/orders/:id`, or `/quotes/:id`, or authorize React/CSS. The UI/UX canon still records `HIGH_FIDELITY = NOT_STARTED` and the foundation canon still records today’s runtime `Produse` label. That is known canon lag. This GO does not edit canons.

## B. Sources

Read in full before drawing:

- `AGENTS.md`
- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md`
- `docs/worklog/ui-ux-audit-v1/source-to-manifest-reconciliation.md`
- `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md`
- `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_SCOPE_DEFINITION_V1.md`
- `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION_V1.md`
- `apps/web/src/App.tsx` and the first-lot runtime pages
- Figma `7elwvIscvMPDiEHrX4f6kQ` pages 00–11

Closed, not reopened:

```text
GLOBAL_NAV       = Lucrări | Atelier | Comercial | Catalog | Administrare
NAV_STRUCTURE    = TOP_NAV
LEVEL_2          = CONTEXTUAL_ONLY
CATALOG          = COMMERCIAL_CATALOG
CONFIGUREAZĂ     = CONTEXTUAL_ACTION
PRODUCT_SYSTEM   = ADMINISTRARE
DIRECTION        = A_INDUSTRIAL_CLARITY
DENSITY          = INTERMEDIATE
TABLES           = FLAT_AND_SCANNABLE
RADIUS           = 6
STATUS           = DOT_PLUS_TEXT
PRIMARY_ACTION   = ONE_PER_DECISION_REGION
DETAIL           = STABLE_PAGE
SHORT_ACTION     = DRAWER_OR_DIALOG
COLLECTION       = SEARCH_FILTER_LIST_DETAIL
```

Runtime routes used as evidence, not invented:

```text
/                          Lucrări
/clients                   Clienți
/clients/:customerId       Client workspace
/requests                  Cereri
/requests/:requestId       Cerere
/quotes                    Oferte list
/products                  Catalog
/products/:productCode     Configurator
/atelier                   Atelier inbox
/execution/:planId         Execuție
/admin/resources           Resurse
```

```text
STABLE_JOB_ROUTE_CONTRACT   = REQUIRED_BEFORE_UI_IMPLEMENTATION
STABLE_QUOTE_ROUTE_CONTRACT = REQUIRED_BEFORE_UI_IMPLEMENTATION
ROUTE_INVENTED              = NO
```

Job detail is a stable page as architecture. Quote inspection is in the first lot. Neither URL contract is selected here.

## C. Single synthetic story

One fixture across every first-lot screen. Not HUB MEDIA business data.

```text
Org        = Atelier Demo
Operator   = Operator 01
Login      = operator01@atelier.demo
Client     = Hotel Nord
Product    = Litere volumetrice
Cerere     = CER-2026-014
Ofertă     = OF-2026-008
Lucrare    = LUC-2026-003
Plan       = 12 operații
Block      = CNC față lipsă
Cost intern / brut = 382.50 / 624.82 EUR
PvA plan   = 18.40 m / 2.4 h / 382.50
PvA real   = empty until consumption
```

Other foundation names stay in lists only: Atelier Luna, Clinică Est, Magazin Valea, Școală Centrală. Drawer create uses `Hotel Vest`.

Forbidden and not used: real person names, real emails, bank/tax data, real addresses, real Cloud identifiers, real PINs.

## D. Figma

```text
FILE = https://www.figma.com/design/7elwvIscvMPDiEHrX4f6kQ
```

Pages 00–11 were not rewritten.

| Page | ID | Role |
| --- | --- | --- |
| 12 — First HF Lot Coverage | `64:2` | Coverage matrix |
| 13 — Shell, Access & Theme | `64:3` | Login, shell, SYSTEM |
| 14 — Lucrări | `64:4` | Jobs list and job detail |
| 15 — Comercial | `64:5` | Clients, requests, quotes |
| 16 — Catalog & Configurator | `64:6` | Catalog and configure |
| 17 — Atelier & Identification | `64:7` | PIN and inbox |
| 18 — Execution & Planned vs Actual | `64:8` | Execution states |
| 19 — Admin Resources & Domain Reuse | `64:9` | Resources + reuse board |
| 20 — WorkOS Iconography V1 | `64:10` | Lucide + custom icons |
| 21 — First HF Lot Owner Review | `64:11` | Review + same-page E2E |

Tokens remain WorkOS HF / Semantic Proposed (collection `VariableCollectionId:28:83`), Light `28:3`, Dark `28:4`. Type remains IBM Plex Sans + IBM Plex Mono. Radius 6. Intermediate density.

Lot screens were composed with those tokens. They are not all instances of the page 10 candidate set. That is an advisory, not a second visual direction.

## E. Screen inventory and coverage

Coverage board: `72:172`. Status on that board is `DRAWN` per required first-lot state. This file does not declare `FULL` cartesian coverage.

### Unique screens

| Unique screen | Route or contract | Key nodes | Viewports / themes drawn |
| --- | --- | --- | --- |
| Cloud login idle | cloud gate | `67:3` | 1280 LIGHT |
| Cloud login error | cloud gate | `67:17` | 1280 LIGHT |
| Cloud login submit | cloud gate | `67:32` | 1280 LIGHT |
| Shell chrome + account utility | AppShell | `67:47` `67:74` `67:101` `67:133` | 1440 / 1280 / 768 LIGHT + 1280 DARK |
| SYSTEM behavior | documented | `67:160` | structural |
| Lucrări empty | `/` | `68:2` | 1280 LIGHT |
| Lucrări populated | `/` | `68:30` `68:158` `68:234` | 1280 / 768 LIGHT + 1280 DARK |
| Lucrări atenție | `/` filter | `68:112` | 1280 LIGHT |
| Detaliu lucrare normal | stable page, URL unselected | `68:316` | 1280 LIGHT |
| Detaliu lucrare blocaj | stable page, URL unselected | `68:353` `68:392` `68:431` | 1280 / 768 LIGHT + 1280 DARK |
| Clienți empty | `/clients` | `70:2` | 1280 LIGHT |
| Clienți list | `/clients` | `70:36` | 1280 LIGHT |
| Client workspace | `/clients/:customerId` | `70:85` `70:133` | 1280 / 768 LIGHT |
| Cereri list | `/requests` | `70:180` | 1280 LIGHT |
| Cerere detail | `/requests/:requestId` | `70:221` | 1280 LIGHT |
| Oferte list | `/quotes` | `70:257` | 1280 LIGHT |
| Ofertă inspecție | quote URL unselected | `70:298` `70:337` | 1280 LIGHT + DARK |
| Client nou drawer | short action | `70:372` | overlay LIGHT |
| Catalog list / search | `/products` | `71:2` `71:41` `71:80` `71:119` | 1280 / 768 LIGHT + 1280 DARK |
| Configurator initial | `/products/:productCode` | `71:158` | 1280 LIGHT |
| Configurator completat | same | `71:198` | 1280 LIGHT |
| Configurator eroare | same | `71:240` | 1280 LIGHT |
| Configurator gata ofertă | same | `71:281` `71:323` | 1280 / 768 LIGHT |
| PIN gol / mascat | dialog in shell | `71:351` | 1280 LIGHT |
| PIN invalid | dialog in shell | `71:361` | 1280 LIGHT |
| Operator neeligibil | `/atelier` | `71:372` | 1280 LIGHT |
| Atelier inbox | `/atelier` | `71:395` `71:425` `71:456` | 1280 / 768 LIGHT + 1280 DARK |
| Sesiune eligibilă | `/atelier` | `71:486` | 1280 LIGHT |
| Execuție machine-blocked | `/execution/:planId` | `71:509` `71:611` `71:713` | 1280 / 768 LIGHT + 1280 DARK |
| Execuție ineligible | same | `71:793` | 1280 LIGHT |
| Execuție startable | same | `71:895` | 1280 LIGHT |
| Execuție în progres | same | `71:992` | 1280 LIGHT |
| Execuție finalizat + PvA | same | `71:1089` `71:1186` | 1280 / 768 LIGHT |
| Resurse empty / loading / error | `/admin/resources` | `72:2` `72:24` `72:44` | 1280 LIGHT |
| Resurse populated | same | `72:65` | 1280 LIGHT |
| Resursă detail | same | `72:92` `72:114` `72:134` | 1280 / 768 LIGHT + 1280 DARK |
| Admin reuse board | People / Seller / Stoc / Utilaje | `72:156` | 1280 LIGHT comparative |

```text
UNIQUE_SCREENS = 38
FRAMES_CREATED = 70
```

`FRAMES_CREATED` counts top-level lot frames on pages 12–21: 8 shell/access + 9 Lucrări + 10 Comercial + 9 Catalog + 7 Atelier + 8 Execuție + 8 Resurse/reuse + 1 coverage + 1 review + 8 E2E cards + 1 icon proof. It does not count icon components.

Minimum coverage held:

- each unique screen at 1280 LIGHT
- shell and access at 1440 / 1280 / 768
- Lucrări, job detail, Catalog, Configurator, Atelier, Execuție, Resurse at 1280 + 768
- one representative DARK per domain (shell, Lucrări, ofertă, Catalog, Atelier, Execuție, Resurse)
- SYSTEM documented and demonstrated structurally (`67:160` + shell LIGHT/DARK)
- empty + populated on main collections
- blocked / unauthorized / error only where they have meaning

Product System stays in Administrare and is outside this lot.

## F. Prototype E2E

Figma `NAVIGATE` only accepts a different top-level frame on the **same page**. Cross-page reactions from `67:3` to `68:30` were rejected by the API.

Navigable same-page prototype on page 21:

```text
78:135 Login
→ 78:140 Lucrări
→ 78:145 Client
→ 78:150 Cerere
→ 78:161 Ofertă
→ 78:166 Lucrare
→ 78:171 Atelier
→ 78:176 Execuție + PvA
```

Flow start: page 21 `Pilot E2E` → `78:135`.

Intra-page review flows also exist on pages 13–18. Screen-reference path (not a cross-page Figma reaction):

```text
67:3 → 68:30 → 70:85 → 70:221 → 70:298 → 68:353 → 71:395 → 71:509
```

Keyboard specification, not a Figma keyboard prototype:

```text
Tab through Level 1
Enter on the primary action
Escape closes drawer / dialog
```

The prototype does not change product routes and does not invent backend contracts.

## G. Iconography V1

Page 20. Official Lucide source: `lucide-static@0.469.0`. No Iconify. No plugin. No icon font. No product package install.

```text
BASE_ICON_LIBRARY           = LUCIDE
DOMAIN_SPECIFIC_ICONS       = WORKOS_CUSTOM
LUCIDE_ICONS_MAPPED         = 26
WORKOS_CUSTOM_ICONS_CREATED = 16
CUSTOM_ICON_COUNT           = 16
MULTIPLE_MIXED_LIBRARIES    = NO
```

Lucide components (24×24, stroke 2, fill none): search `66:7`, filter `66:13`, plus `66:18`, edit `66:23`, trash `66:31`, close `66:36`, back `66:41`, forward `66:46`, user `66:51`, log-in `66:57`, log-out `66:63`, settings `66:68`, calendar `66:75`, upload `66:81`, download `66:87`, eye `66:92`, eye-off `66:99`, chevron-down `66:103`, chevron-right `66:107`, check `66:111`, warning `66:117`, error `66:123`, info `66:129`, sun `66:141`, moon `66:145`, monitor `66:151`.

Custom WorkOS components used on the first LETTERS lot: cnc-router `66:158`, sheet-forming `66:163`, plexiglas `66:169`, acm `66:175`, led-module `66:182`, volume-letter `66:188`, assembly-table `66:195`, atelier `66:200`, montaj `66:206`, packing `66:212`, execution-plan `66:219`, plan-vs-real `66:228`, missing-machine `66:234`, blocked-job `66:239`, sheet `66:244`, material-roll `66:249`.

Omitted on purpose, not used on this lot’s LETTERS path: CNC laser, plotter, laminator, casetă luminoasă.

Size / touch / grayscale proof: `78:2` (16 / 20 / 24 + 44 target). Geometry is the same in LIGHT and DARK; color is `currentColor` / semantic token. Critical meaning stays icon + text.

## H. Contrast

Measured from resolved Semantic Proposed aliases. Designed and measured, not certified.

| Pair | LIGHT | DARK | AA normal 4.5 |
| --- | ---: | ---: | --- |
| text/primary on canvas | 15.83 | 17.02 | PASS |
| text/secondary on canvas | 8.63 | 11.36 | PASS |
| text/muted on canvas | 4.60 | 6.12 | PASS |
| text/primary on surface | 17.30 | 15.52 | PASS |
| action/on-primary on action/primary | 8.88 | 7.00 | PASS |
| status/danger on canvas | 6.02 | 6.74 | PASS |
| status/warning on canvas | 4.91 | 9.65 | PASS |

```text
CONTRAST_FAILURES = 0
ACCESSIBILITY     = DESIGNED_AND_MEASURED_NOT_CERTIFIED
```

Accessibility designed on the frames: skip link `Sari la conținut`, banner / main landmarks, one `h1` per screen, visible focus reserved to the foundation 3 px ring, 44 px touch on icon controls, labels on fields, login error associated to the form, status as dot + text, decorative icons to be `aria-hidden` at implementation, functional icons with visible text.

## I. Review

P0/P1 found and fixed before this record:

1. Several lot frames hugged after auto-layout and collapsed (Execuție DARK exported at 168 px). Primary axis locked FIXED and heights restored.
2. Operator screens leaked review jargon (`/jobs/:id`, `/quotes/:id`, EIC, DTO, Claim-on-Start, `none/none`). Replaced with operator Romanian. Contracts remain on pages 12 and 21 only.
3. Cross-page Figma prototype is impossible. Same-page E2E cards `78:135`–`78:176` plus intra-page flows.
4. Orphan 768 nav fragments `67:104` and `67:117` sat at `(0,0)` on page 13. Removed.
5. Job-detail blocked primary said `Deschide lucrarea` while already on the job. Primary is now `Deschide execuția`; normal detail secondary is `Înapoi la Lucrări`.

| Lens | Result |
| --- | --- |
| Coherence | PASS — one Hotel Nord story; same IDs and 624.82 / 382.50 / CNC block |
| Visual hierarchy | PASS — A table/scan, radius 6, one primary, no B cards or C rails |
| IA/UX | PASS — Level 1 exact; Level 2 only under Comercial; Catalog Level 1; Product System out |
| Operator workflow | PASS — next action visible; blocked CNC is honest; Atelier stays an inbox |
| Commercial E2E | PASS as design — Client → Cerere → Ofertă inspect → release → Lucrare |
| Accessibility | PASS as designed/measured, not certified |
| Responsive | PASS as 1440 / 1280 / 768 proof; 768 keeps full Administrare |
| Theme | PASS — LIGHT/DARK bound separately; SYSTEM documented |
| Iconography | PASS — Lucide 26 + custom 16; mixed libraries = no |
| Feasibility | PASS — tokens + IBM Plex; no kit lock-in; no React written |
| Scope guardian | PASS — no `apps/` diff; pages 00–11 untouched; no Cloud write |
| Adversarial | PASS — no invented job/quote URL as accepted truth; no auto-accept |
| Privacy | PASS — synthetic only |

Advisories (P2, documented, do not block Owner review):

- Lot screens reuse A tokens; they are not all instances of the page 10 candidate components.
- Icon size proof sits on LIGHT canvas; DARK reuse is geometry + `currentColor`.
- Coverage matrix is a text board, not a data-table component.
- Figma `NAVIGATE` is same-page only. See §L prototype limit.

```text
OVERFLOW      = 0
TEXT_CLIPPING = 0
```

## J. Owner checklist

Review nodes:

```text
Login 67:3
Lucrări 68:30
Detaliu blocaj 68:353
Workspace 70:85
Inspecție 70:298
Catalog 71:2
Configurator 71:198
Atelier 71:395
Exec DARK 71:611
PvA done 71:1089
Resurse 72:65
Iconuri 66:7 / 66:158 / 66:163 / 78:2
Owner cost 85:65
E2E HF start 86:166
```

Owner must decide. This file does not accept the lot.

```text
FIRST_HF_LOT_SCREEN_DESIGN = IN_REVIEW
OWNER_DECISION             = REQUIRED
UI_IMPLEMENTATION          = NOT_AUTHORIZED
NEXT_STEP                  = OWNER_FIRST_HF_LOT_REVIEW
```

## K. Stop

```text
FIGMA_PAGES_00_11   = UNCHANGED
PRODUCT_CODE        = UNCHANGED
REACT_CSS           = NOT_WRITTEN
LUCIDE_IN_PRODUCT   = NOT_INSTALLED
REAL_CLOUD_ROOT     = UNTOUCHED
PUSH                = NO
```

## L. Correction after OWNER_FIRST_HF_LOT_REVIEW = CHANGES_REQUIRED

Same chat, worktree, and branch. Direction A retained. No restart. No UI implementation.

```text
OWNER_FIRST_HF_LOT_REVIEW        = CHANGES_REQUIRED
CORRECTION                       = APPLIED_FOR_SECOND_REVIEW
FIRST_HF_LOT_SCREEN_DESIGN       = IN_REVIEW
OWNER_DECISION                   = REQUIRED
INTERNAL_COST_ACCESS_POLICY      = NOT_CANONIZED
INTERNAL_COST_DESIGN_CHOICE      = HIDE_ON_OPERATOR_01_FRAMES
OWNER_ADMIN_COST_VIEW            = 85:65
PROTOTYPE_LIMIT                  = FIGMA_NAVIGATE_SAME_PAGE_ONLY
```

### What changed

1. Product-UI copy sweep on lot frames 13–19. Design-meta sentences moved out of the operator surface. Coverage / SYSTEM / reuse / Owner Review stay specification.
2. Shell: Level 1 keeps `Catalog` and full `Administrare` at 768. Utility includes organizație, utilizator, temă, ieșire. 768 uses `Cont` plus a reachable utility strip.
3. Lucrări list primary is `Deschide lucrarea`. Execution opens only from job detail. Blocked detail `68:353` now carries configuration, progress, links, and plan disclosure. `68:316` is the same job after CNC recovery, not a contradictory 4/12 Hotel Nord.
4. Quote inspection `70:298` is a decision screen: source request, configuration, frozen snapshot, customer totals (624.82 / TVA 21% / adaos 35%), status, consequence. `Acceptată` restyled as status, not the primary action. Internal cost hidden.
5. Configurator `71:198` uses the LETTERS Product Definition groups: fixed facts, required text/finish/depth/measures, vinyl color dependency, unconfirmed 30/80/100 mm, persistent summary tied to CER-2026-014. Customer price only.
6. Resources `72:65` has search, filter, 11 synthetic rows, selected aluminium 60 mm. Empty / loading / error remain. Costs stay on the Admin surface.
7. Operator 01 execution and job PvA show perimeter, time, and operations — not 382.50. Separate Owner view `85:65` holds planned internal cost and commercial gross. This is a design choice, not a canonized permission model.
8. Custom icons sheet-forming, plexiglas, acm, volume-letter, montaj, blocked-job redrawn. Lucide search/filter/warning and custom CNC / blocked / letter / PvA used on real screens.
9. Page 21 E2E uses full-size clones: `86:166` → `86:180` → `86:264` → `86:312` → `86:348` → `86:417` → `86:463` → `86:510` → `86:540` → `86:644`, plus drawer `86:742`. Schematic cards `78:135`–`78:176` retired in name.

### What stayed

Direction A. IA. Lucide + WorkOS custom contract. Hotel Nord story and identifiers. Pages 00–11. Unselected job and quote URL contracts. No React/CSS. No real data. No Cloud root.

### Advisories remaining

- Lot controls are still token-built more than instanced from page 10.
- Some 768 bodies still use `Cont` rather than a fully expanded utility row; actions remain reachable.
- Figma cannot validate keyboard focus-return or Escape. Specified, not engine-proven.
- `Acceptată` is quieter than a primary button; it is not yet a compact chip component.
- Icon instances on screens are selective, not a full icon audit of every control.

### New or updated node IDs

```text
Job decision panel     = 85:2  (copied 86:791 / 86:796)
Quote decision panel   = 85:7
Configurator groups    = 85:14
Resources rows         = 85:31
Owner cost view        = 85:65
E2E HF clones          = 86:166 86:180 86:264 86:312 86:348 86:417 86:463 86:510 86:540 86:644 86:742
Redrawn custom icons   = 66:163 66:169 66:175 66:188 66:206 66:239
```

### Findings before / after

| Finding | Before | After |
| --- | --- | --- |
| Design-meta in product UI | Present (chrome, fill, card wall, EIC, routes) | Removed from product frames; kept on 12 / 19 reuse / 21 |
| List opens execution | `Deschide execuția` on blocked Hotel Nord | `Deschide lucrarea`; exec only from detail |
| Job detail thin | Title + PvA + cost | Configuration, progress, links, recovery state |
| Quote not decisional | Header + three buttons | Facts + consequence + one primary release |
| Configurator 3 fields | Față / Volum / Adâncime only | Product Definition groups + dependencies |
| Resources one row | Single aluminium line | 11 representative rows + selected |
| Operator sees 382.50 | Yes on PvA / quote / config | Hidden on Operator 01; Owner view separate |
| Icons unused / ambiguous | 24 px only; weak custom marks | Redrawn; used on list/detail/catalog/resources/exec |
| E2E schematic only | Mini-cards 78:135–176 | Full-size clones 86:166–86:644 |

### Acceptance after correction

```text
DESIGN_META_COPY_IN_PRODUCT_UI       = 0
SHELL_INCONSISTENCIES                = 0
JOB_LIST_BYPASSES_STABLE_DETAIL      = NO
JOB_DETAIL_DECISION_COMPLETE         = YES
QUOTE_INSPECTION_DECISION_COMPLETE   = YES
CONFIGURATOR_HIGH_FIDELITY           = YES
RESOURCES_REAL_LIST_DETAIL           = YES
OPERATOR_INTERNAL_COST_VISIBLE       = NO
ICONOGRAPHY_USED_IN_REAL_SCREENS     = YES
AMBIGUOUS_CUSTOM_ICONS_REVIEWED      = YES
ACTUAL_HF_E2E_PROTOTYPE              = YES_WITH_PROTOTYPE_LIMIT
SYNTHETIC_STORY_CONSISTENT           = YES
CONTRAST_FAILURES                    = 0
OVERFLOW                             = 0
TEXT_CLIPPING                        = 0
REAL_DATA_IN_FIGMA                   = NO
ROUTE_INVENTED                       = NO
PRODUCT_CODE_DIFF                    = NONE
UI_CODE_DIFF                         = NONE
CSS_DIFF                             = NONE
UI_IMPLEMENTATION                    = NOT_AUTHORIZED
```

## M. Integration correction after CHANGES_REQUIRED_ROUND_2

Same chat, worktree, and branch. Direction A retained. No restart. No UI implementation. No Owner accept.

```text
OWNER_FIRST_HF_LOT_REVIEW        = CHANGES_REQUIRED_ROUND_2
CORRECTION                       = APPLIED_FOR_THIRD_REVIEW
FIRST_HF_LOT_SCREEN_DESIGN       = IN_REVIEW
OWNER_DECISION                   = REQUIRED
OWNER_ACCEPTED                   = NO
INTERNAL_COST_ACCESS_POLICY      = NOT_CANONIZED
OPERATOR_MARKUP_VISIBLE          = NO
PROTOTYPE_LIMIT                  = FIGMA_NAVIGATE_SAME_PAGE_ONLY
STABLE_JOB_ROUTE_CONTRACT        = REQUIRED_BEFORE_UI_IMPLEMENTATION
STABLE_QUOTE_ROUTE_CONTRACT      = REQUIRED_BEFORE_UI_IMPLEMENTATION
```

### What changed

1. Job detail, quote, configurator, and resources no longer park facts in a detached bottom block. Configuration, blocker, progress, links, plan, commercial decision fields, form groups, and resource detail sit in the body next to the action.
2. Shell matrix on product frames 13–19: five domains in order, `Catalog`, full `Administrare`, utilities `Atelier Demo | Operator 01 | Temă | Ieșire`. 768 uses `Cont` plus that utility surface. Utility is not repeated as page-body chrome.
3. Lucrări primary remains `Deschide lucrarea`. Execution opens from detail. Floating unlabeled icons removed from list/detail. Icons used on the job sit in labeled status/blocker rows.
4. Quote operator screen is a decision layout: client, request, product, snapshot, 624,82 EUR brut, TVA 21%, status chip `Acceptată`, release consequence, PDF, `Eliberează pentru producție`. No adaos. Owner/Admin variant `93:1185` shows adaos 35% and internal 382,50 EUR. Policy remains `NOT_CANONIZED`, documented on `93:1318`.
5. Configurator uses Product Definition controls: fixed facts, inscription, face finish + vinyl color dependency, volume finish + color dependency, depth 30/60/80/100 with unconfirmed depths unavailable, measures, advanced, persistent summary, completeness, `Confirmă`.
6. Resources populated is search-with-icon + filter-with-icon + 11 rows + selected row + detail (cost, unit, provenance, status, update) in one viewport. Duplicate bottom list and floating icons removed. Empty / loading / error stay separate.
7. E2E on page 21 uses full-size clones. Reactions are on controls only. Top-level frame reactions on active E2E frames = 0. Retired schematic reactions cleared.
8. `Client nou` is a 480×900 drawer over a scrim (`93:1302` / `95:1151` / `95:454`), with close, cancel, save, outside-click on scrim, and Escape/focus specified on `93:1318`. Opening is attached to `action/Client nou`, not the Lucrări frame.
9. Romanian grouping: 624,82 EUR · 18,40 m · 250.000 mm² · 2,4 h · 382,50 EUR.

### What stayed

Direction A. IA. Lucide + WorkOS custom. Hotel Nord story. Pages 00–11. Unselected job and quote URL contracts. No React/CSS. No real data. No Cloud root.

### Advisories

- Lot controls still use A tokens more than page-10 instances.
- Figma cannot engine-validate Escape or focus-return. Specified on `93:1318`.
- `PROTOTYPE_LIMIT = FIGMA_NAVIGATE_SAME_PAGE_ONLY`.
- Adaos visibility is a design demonstration, not a canonized permission model.

### Final screen node IDs

```text
Login                         = 67:3
Shell 1440 / 1280 / 768 / DARK = 67:47 67:74 67:101 67:133
Lucrări populated             = 68:30
Detaliu blocaj 1280 / 768 / DARK = 68:353 68:392 68:431
Detaliu recuperare            = 68:316
Ofertă operator               = 70:298
Ofertă DARK                   = 70:337
Ofertă Owner                  = 93:1185
Overlay Client nou            = 93:1302
SPEC financial + drawer a11y  = 93:1318
Configurator completat        = 71:198
Configurator 768              = 71:323
Resurse list/detail           = 72:65
Resurse DARK                  = 72:134
Owner cost view               = 85:65
E2E Login → PvA               = 95:474 95:488 95:579 95:629 95:667 95:762 95:833 95:902 95:937 95:1048
E2E overlay                   = 95:1151
```

### Reactions source → destination (page 21)

```text
95:486 Intră                         → 95:488 Lucrări
95:514 Deschide clientul             → 95:579 Client
95:512 Client nou                    → 95:1151 Overlay
95:541 Deschide lucrarea             → 95:833 Detaliu blocaj
95:615 Deschide cererea              → 95:629 Cerere
95:663 Configurează                  → 95:667 Configurator
95:758 Confirmă                      → 95:762 Ofertă
95:829 Eliberează pentru producție   → 95:833 Detaliu blocaj
95:898 Deschide execuția             → 95:937 Execuție blocată
95:841 nav Atelier                   → 95:902 Atelier
95:935 Pornește                      → 95:937 Execuție blocată
95:1046 După alocare CNC             → 95:1048 PvA
95:1152 scrim / 95:1156 Închide / 95:1163 Anulează → CLOSE
```

`TOP_LEVEL_FRAME_REACTIONS` on active E2E frames = 0.

### Drawer

```text
OVERLAY = 93:1302 / 95:1151 / 95:454
SCRIM   = full 1280×900 at 44% dim
PANEL   = 480×900, x=800
CONTROLS = titlu, Închide, Nume afișat, Anulează, Salvează clientul
SPEC    = 93:1318  (Escape, focus initial, trap, return — specified, not engine-validated)
```

### Role → financial information

| Rol | Cost intern | Adaos | Preț client / TVA |
| --- | --- | --- | --- |
| Operator 01 (atelier / quote 70:298) | hidden | hidden | 624,82 EUR brut · TVA 21% |
| Owner / Admin (93:1185, 85:65) | 382,50 EUR | 35% | 624,82 EUR brut · TVA 21% |
| Policy | NOT_CANONIZED | NOT_CANONIZED | existing commercial projection |

### Acceptance after round 2

```text
DETACHED_BOTTOM_SPEC_BLOCKS          = 0
UNJUSTIFIED_LARGE_EMPTY_ZONES        = 0
SHELL_INCONSISTENCIES                = 0
OPERATOR_INTERNAL_COST_VISIBLE       = NO
OPERATOR_MARKUP_VISIBLE              = NO
JOB_DETAIL_INTEGRATED                = YES
QUOTE_DECISION_LAYOUT_INTEGRATED     = YES
CONFIGURATOR_CONTROLS_COMPLETE       = YES
RESOURCES_VISIBLE_LIST_DETAIL        = YES
FLOATING_UNLABELED_ICONS             = 0
TOP_LEVEL_FRAME_REACTIONS            = 0
REACTIONS_ATTACHED_TO_CONTROLS       = YES
DRAWER_IS_REAL_OVERLAY               = YES
DRAWER_CLOSE_CANCEL_ESCAPE           = YES_SPECIFIED
SOURCE_PROTOTYPE_SEMANTIC_MATCH      = YES
STALE_DESIGN_COPY_IN_PROTOTYPE       = 0
ROMANIAN_NUMBER_FORMAT               = PASS
CONTRAST_FAILURES                    = 0
OVERFLOW                             = 0
TEXT_CLIPPING                        = 0
REAL_DATA_IN_FIGMA                   = NO
ROUTE_INVENTED                       = NO
PRODUCT_CODE_DIFF                    = NONE
UI_CODE_DIFF                         = NONE
CSS_DIFF                             = NONE
OWNER_ACCEPTED                       = NO
UI_IMPLEMENTATION                    = NOT_AUTHORIZED
```

## N. Final visual QA after CHANGES_REQUIRED_FINAL_VISUAL_QA

Same chat, worktree, and branch. Direction A retained. Technical correction only. No new screens beyond the synthetic Hotel Vest success state required by the drawer. No UI implementation. No Owner accept.

```text
OWNER_FIRST_HF_LOT_REVIEW        = CHANGES_REQUIRED_FINAL_VISUAL_QA
CORRECTION                       = APPLIED_FOR_OWNER_RECHECK
FIRST_HF_LOT_SCREEN_DESIGN       = IN_REVIEW
OWNER_DECISION                   = REQUIRED
OWNER_ACCEPTED                   = NO
UI_IMPLEMENTATION                = NOT_AUTHORIZED
```

### What changed

1. Job-detail title and body texts were locked at 10 px (`textAutoResize = NONE`). They now hug line-height. Sources `68:353` / `68:316` / `68:392` / `68:431` and E2E clone `103:384` measure `JOB_DETAIL_TEXT_CLIPPING = 0`. 768 title-row no longer overflows the 720 px content width.
2. Execution leftover `Operator 01` (banner sibling of `utility`) removed on atelier + all execution variants. Absolute warning / CNC / PvA icons removed. Icons sit in `blocker-title` and `pva-title` rows with 8 px gap. 768 execution banners restack: brand + Cont, domains, utility. Measured boxes on `71:1186` do not overlap.
3. `După alocare CNC` removed from product frames. Prototype rail `102:263` (page 18) and `103:961` (page 21) sit outside the app frame.
4. Product copy: configurator keeps `30 / 80 / 100 mm: tarif neconfirmat.` Resources keep `Catalog de resurse și dovada de cost.` Owner cost note `85:67` is operational, not canon language.
5. Numbers: `2,6 h`, `18.400 mm → 18,40 m`, `624,82`, `382,50`. Scan of pages 13–21 product frames: zero remaining `2.6 h` / `18,400` / `624.82`.
6. Owner quote `93:1185` main fill reset to canvas (was resolved 40% gray). Discrete `Vedere Owner` chip `102:261`. Not an overlay.
7. Drawer save: `93:1316` → `102:268` Hotel Vest (page 15); `95:468` → `102:417` (page 14); E2E `103:699` save → `103:715`. Scrim / Închide / Anulează stay `CLOSE`. Escape / focus specified on `93:1318` and clone `103:966`.
8. Page 21 E2E rebuilt by full-frame clone of corrected sources. Source ↔ clone text match = YES for all 11 pairs. Top-level frame reactions = 0.

### Final node IDs

```text
Detaliu blocaj 1280 / 768 / DARK     = 68:353 68:392 68:431
E2E detaliu blocaj                   = 103:384
Execuție blocaj 1280 / DARK / 768    = 71:509 71:611 71:713
E2E execuție blocaj                  = 103:487
Execuție PvA 1280 / 768              = 71:1089 71:1186
E2E PvA                              = 103:596
PROTOTYPE rail page 18 / 21          = 102:263 103:961
Ofertă Owner                         = 93:1185
Vedere Owner chip                    = 102:261
Overlay source / Lucrări / E2E       = 93:1302 95:454 103:699
Hotel Vest page 15 / 14 / E2E        = 102:268 102:417 103:715
SPEC drawer a11y                     = 93:1318 103:966
```

### Source → E2E matrix

| Source | E2E clone | Match |
| --- | --- | --- |
| 68:30 Lucrări | 103:39 | text + height |
| 70:85 Client Nord | 103:130 | text + height |
| 70:221 Cerere | 103:180 | text + height |
| 71:198 Configurator | 103:218 | text + height |
| 70:298 Ofertă | 103:313 | text + height |
| 68:353 Detaliu | 103:384 | text + height |
| 71:395 Atelier | 103:453 | text + height |
| 71:509 Execuție | 103:487 | text + height |
| 71:1089 PvA | 103:596 | text + height |
| 93:1302 Overlay | 103:699 | text + height |
| 102:268 Hotel Vest | 103:715 | text + height |

### Reactions (page 21, controls only)

```text
103:37  Intră / primary                      → 103:39 Lucrări
103:65  Deschide clientul                    → 103:130 Client Nord
103:166 Deschide cererea                     → 103:180 Cerere
103:172 Inspectează oferta                   → 103:313 Ofertă
103:178 Deschide lucrarea (client)           → 103:384 Detaliu
103:208 Configurează                         → 103:218 Configurator
103:216 Deschide oferta                      → 103:313 Ofertă
103:309 Confirmă                             → 103:313 Ofertă
103:380 Eliberează pentru producție          → 103:384 Detaliu
103:449 Deschide execuția                    → 103:487 Execuție
103:963 rail recuperare                      → 103:596 PvA
103:697 Deschide lucrarea (PvA)              → 103:384 Detaliu
103:63  Client nou                           → 103:699 Overlay
103:713 Salvează clientul                    → 103:715 Hotel Vest
103:82  Hotel Nord (listă)                   → 103:384 Detaliu
103:594 Deschide lucrarea (execuție blocată) → 103:384 Detaliu
103:699 scrim / Închide / Anulează           → CLOSE
```

`Pornește` on Atelier / blocked execution stays unwired. No eligible start state exists in the prototype. That limit is declared, not faked.

### Acceptance after visual QA correction

```text
JOB_DETAIL_TEXT_CLIPPING              = 0
EXECUTION_ICON_TEXT_OVERLAP           = 0
PVA_NAV_OVERLAP                       = 0
DUPLICATE_ORGANIZATION_LABELS         = 0
DUPLICATE_USER_LABELS                 = 0
SCENARIO_CONTROLS_VISIBLE_IN_PRODUCT_UI = 0
DESIGN_META_COPY_IN_PRODUCT_UI        = 0
ROMANIAN_NUMBER_FORMAT                = PASS
OWNER_VIEW_ACCIDENTAL_SCRIM           = NO
DRAWER_SAVE_REACTION                  = YES
TOP_LEVEL_FRAME_REACTIONS             = 0
REACTIONS_ATTACHED_TO_CONTROLS        = YES
SOURCE_PROTOTYPE_VISUAL_MATCH         = YES
CONTRAST_FAILURES                     = 0
OVERFLOW                              = 0
TEXT_CLIPPING                         = 0
PRODUCT_CODE_DIFF                     = NONE
UI_CODE_DIFF                          = NONE
CSS_DIFF                              = NONE
REAL_DATA_IN_FIGMA                    = NO
ROUTE_INVENTED                        = NO
OWNER_ACCEPTED                        = NO
UI_IMPLEMENTATION                     = NOT_AUTHORIZED
```

## O. Technical closure V4 — drawer clip + E2E path

Same chat, worktree, and branch. Two defect classes only. Direction A, IA, palette, iconography, and screen content unchanged. No Owner accept.

```text
OWNER_FIRST_HF_LOT_REVIEW        = TECHNICAL_CLOSURE_V4
CORRECTION                       = APPLIED_FOR_OWNER_RECHECK
FIRST_HF_LOT_SCREEN_DESIGN       = IN_REVIEW
OWNER_ACCEPTED                   = NO
UI_IMPLEMENTATION                = NOT_AUTHORIZED
SOURCE_DRAWER_TEXT_CLIPPING      = 0
E2E_DRAWER_TEXT_CLIPPING         = 0
E2E_MAIN_PATH_COMPLETE           = YES
E2E_DRAWER_BRANCH_COMPLETE       = YES
TOP_LEVEL_FRAME_REACTIONS        = 0
```

Drawer titles `93:1306` / `103:703` and helpers `93:1312` / `103:709` now use `textAutoResize = HEIGHT` and match line-height (26 / 16). Panel stays 480 px. Page-14 overlay `95:454` received the same unclip so the three drawers stay equivalent.

Missing control reactions after the V3 reclone were added on the real buttons. Verified destination IDs, not button presence. `Pornește` remains outside the demonstrated path.

## P. Owner acceptance

Recorded after Owner GO `FIRST HF LOT ACCEPTANCE, REVIEW AND FAST-FORWARD V1`. Same chat, worktree, and branch. Figma screens, components, tokens, icons, and reactions on pages 00–20 were not redrawn. Page 21 status block `72:202` records the closed gate.

```text
OWNER_FIRST_HF_LOT_REVIEW        = PASS
FIRST_HF_LOT_SCREEN_DESIGN       = OWNER_ACCEPTED
HF_LOT_GATE                      = CLOSED
UI_IMPLEMENTATION                = NOT_AUTHORIZED
NEXT                             = FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS
DRAWER_SOURCE_TEXT_CLIPPING      = 0
DRAWER_E2E_TEXT_CLIPPING         = 0
E2E_MAIN_PATH_COMPLETE           = YES
E2E_DRAWER_BRANCH_COMPLETE       = YES
TOP_LEVEL_FRAME_REACTIONS        = 0
```

Accepted limits, not defects to “fix” in this file:

- `Pornește` from Atelier stays unwired; no eligible start destination exists in the prototype.
- Escape, focus trap, and focus return are specified, not Figma-engine validated.
- Stable job-detail and quote-inspection URL contracts remain unselected.
- Internal-cost and markup access policy remains `NOT_CANONIZED`.
- UI implementation remains unauthorized.

The next named step must close, before code: the job-detail route contract; the quote-inspection route contract; the internal-cost / markup access policy; Figma → existing component / token / route mapping; and the lot implementation-and-verification plan. This file does not open those contracts.
