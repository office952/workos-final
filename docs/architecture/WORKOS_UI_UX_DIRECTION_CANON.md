# WorkOS UI/UX direction canon

Living direction for WorkOS operator and owner presentation.
This document is normative for **how UI may evolve**. It is not a frozen mockup, not a page-by-page specification, and not a promise that visual design will never change.

```text
AUTHORITY                         = ACTIVE_UI_UX_DIRECTION
SOURCE_OF_THIS_REVISION           = OWNER_UI20_E2E_RESET
PREVIOUS_REVISION_SOURCE          = OWNER_ACCEPTED_V3_STABLE_NAVIGATION
EVIDENCE_PACK                     = docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md
IA_ACCEPTANCE                     = docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md
HF_LOT_ACCEPTANCE                 = docs/worklog/WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1.md
READINESS_CONTRACTS               = docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md
FIGMA_FILE                        = WorkOS V1 — Information Architecture
FIGMA_FILE_KEY                    = 7elwvIscvMPDiEHrX4f6kQ
HIGH_FIDELITY_DESIGN              = FIRST_LOT_OWNER_ACCEPTED
HF_LOT_GATE                       = CLOSED
FINAL_VISUAL_DIRECTION            = A_INDUSTRIAL_CLARITY
IMPLEMENTATION_READINESS_CONTRACTS = OWNER_ACCEPTED
IMPLEMENTATION_READINESS_GATE     = CLOSED
IMPLEMENTATION_READY              = YES
VISIBLE_RUNTIME                   = WAVE_1_FOUNDATION_ROUTES_ACCESS
UI_IMPLEMENTATION                 = IN_REVIEW
UI_IMPLEMENTATION_AUTHORIZED      = WAVE_1_ONLY
UI_IMPLEMENTATION_AUTHORIZATION   = OWNER_GO_WAVE_1_FOUNDATION_ROUTES_ACCESS
FIGMA_ACCESS_GATE                 = COMPLETE
INFORMATION_ARCHITECTURE          = OWNER_ACCEPTED
OWNER_IA_GATE                     = CLOSED
HIGH_FIDELITY                     = FIRST_LOT_OWNER_ACCEPTED
GLOBAL_NAV_STRUCTURE              = STABLE_SIDEBAR
UI_UX_NAVIGATION_V3_DESIGN        = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION  = COMPLETE
ALL_EXISTING_PAGES_UI_V3           = INTEGRATED_ON_MAIN
ALL_EXISTING_PAGES_UI_V3_RUNTIME   = OWNER_ACCEPTED
UI_V3_GENERAL_FINALIZATION         = COMPLETE
UI_GENERAL_REDESIGN                = REOPENED_BY_OWNER_FOR_UI20_E2E
UI_POLISH_MODE                     = SUPERSEDED_BY_UI20_REFOUNDATION
UI20_PROGRAM                       = OWNER_AUTHORIZED_REFOUNDATION
UI20_CURRENT_VISUAL_DIRECTION      = NOT_SELECTED
UI20_CURRENT_IA                    = NOT_SELECTED
UI20_IMPLEMENTATION                = NOT_AUTHORIZED
CLIENTS_V3                         = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION            = OWNER_ACCEPTED
CLIENTS_RUNTIME                    = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE                 = CLOSED
CLIENT_HUB_FIGMA_FINAL             = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME                 = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE          = CLOSED
CLIENT_HUB                         = INTEGRATED_ON_MAIN
CERERI_V3_FIGMA_FINAL              = OWNER_ACCEPTED
REQUESTS_DIRECTION                 = OWNER_ACCEPTED
CERERI_TECHNICAL_GATE              = CLOSED
REQUESTS_RUNTIME                   = OWNER_ACCEPTED
CERERI_RUNTIME                     = OWNER_ACCEPTED
CERERI_INTEGRATED_ON_MAIN          = YES
REQUESTS_INTEGRATED_ON_MAIN        = YES
FIRST_REAL_LETTERS_PREQUOTE_V1     = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED_RUNTIME             = YES
NEXT_PROGRAM_PRIORITY              = WORKOS_UI_UX_2_0_E2E
CATALOG_LABEL                     = ACCEPTED
THEME_TOKENS_IMPLEMENTED          = WAVE_1_FOUNDATION
THEME_TOKEN_IMPLEMENTATION        = WAVE_1_FOUNDATION_ONLY
```

Figma access, information architecture, visual direction A, and the first high-fidelity lot are accepted. Implementation-readiness contracts are Owner-accepted and the readiness gate is closed. `IMPLEMENTATION_READY = YES` is not a scoped UI implementation GO. This document is not the Owner GO for React/CSS, Mobbin, a production component library, or scoped UI implementation.

On 2026-08-30 Owner accepted V3 as the living navigation map: one stable sidebar, six discrete categories, twenty pages. Wave 1 implementation is `INTEGRATED_ON_MAIN`. All existing runtime pages are now V3 baseline closed (`ALL_EXISTING_PAGES_UI_V3 = INTEGRATED_ON_MAIN`, `OWNER_ACCEPTED`). Page-content transformation is `COMPLETE`. Clients, Client Hub, Cereri, and Product Configuration remain historically accepted. That V3 closure (`UI_GENERAL_REDESIGN = CLOSED_FOR_V1`) remains historical evidence. Living Owner direction is now `WORKOS_UI_UX_2_0_E2E`: clean-sheet experience research, domain/backend/product truth preserved, implementation not authorized.

Runtime and domain contracts win if this document disagrees with implemented business behavior.
`docs/architecture/UI_UX_FOUNDATION_CANON.md` remains the **current implemented presentation law**. The implemented shell is the V3 stable sidebar on main. This direction canon does not replace that record. It governs later Owner decisions and later UI change.

Related living authority:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` — active V1 delivery sequence
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md` — domain ownership
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — current implemented presentation
- `docs/worklog/WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1.md` — evidence citations for the previous direction revision
- `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md` — Owner IA acceptance record
- `docs/worklog/WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1.md` — accepted first HF lot
- `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md` — accepted first-lot route, access, mapping, and wave contracts
- `docs/plans/WORKOS_ARCHITECTURE_C_UI_IMPLEMENTATION_WAVE_1_PLAN.md` — Architecture C `/admin/resources` Wave 1 plan; implementation is local in review
- `docs/worklog/WORKOS_ARCHITECTURE_C_UI_WAVE_1_IMPLEMENTED_LOCAL_IN_REVIEW_V1.md` — Wave 1 implementation record
- `docs/worklog/WORKOS_ARCHITECTURE_C_FINAL_SIMULATION_ACCEPTED_WAVE_1_PLAN_V1.md` — Owner accept of the Architecture C simulation

Do not create a second UI/UX direction canon.

## Architecture C track (next UI lot)

Recorded 2026-08-26. This is a later Owner-accepted shell and floorplan track. It does not reopen the first HF lot and does not change `FINAL_VISUAL_DIRECTION = A_INDUSTRIAL_CLARITY` for that closed lot.

```text
ARCHITECTURE_C_DIRECTION                         = OWNER_ACCEPTED
ARCHITECTURE_C_FIGMA_FILE_KEY                    = Q8zfu4MZhsxLjJMGLHUHZh
ARCHITECTURE_C_FINAL_SIMULATION                  = OWNER_ACCEPTED_WITH_ADVISORIES
FIGMA_LIBRARY_PUBLISHED                          = NO
ARCHITECTURE_C_UI_WAVE_1_PLANNING                = COMPLETE
ARCHITECTURE_C_UI_WAVE_1                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                                   = NO
ARCHITECTURE_C_UI_WAVE_2                         = NOT_STARTED
ARCHITECTURE_C_FIRST_ROUTE                       = /admin/resources
```

The first HF lot (Industrial Clarity, pages 12–21 in the earlier Figma file) stays Owner-accepted and implemented. Architecture C Wave 1 is implemented locally on the UI branch for the global shell and `/admin/resources`. Owner has not accepted that implementation. Do not publish the Architecture C library from this document. Do not create a second implementation-readiness contract file for this track.

Accepted advisories that the product must keep: IdentityMenu wraps the legal name without a fixed 59px width; SkipLink stays compact and is fully visible only on focus.

## ACCEPTED OWNER IA DECISION

Recorded 2026-08-25. These are Owner-accepted information-architecture decisions. They do not approve visual style, tokens, components, or implementation.

```text
OWNER_IA_DECISION         = ACCEPTED_WITH_AMENDMENTS
GLOBAL_NAV_STRUCTURE      = TOP_NAV
LEVEL_1_DOMAINS           = Lucrări | Atelier | Comercial | Catalog | Administrare
LEVEL_2_RULE              = CONTEXTUAL_ONLY
CATALOG_LABEL             = ACCEPTED
CONFIGUREAZĂ_ROLE         = CONTEXTUAL_ACTION
PRODUCT_SYSTEM_LOCATION   = ADMINISTRARE
PRIMARY_DETAIL_PATTERN    = STABLE_PAGE
ADMIN_COLLECTION_PATTERN  = SPLIT_LIST_DETAIL
SHORT_ACTION_PATTERN      = DRAWER_OR_DIALOG
INFORMATION_DENSITY       = INTERMEDIATE
```

That 2026-08-25 Level 1 top-nav set remains historical IA. Living navigation direction is the 2026-08-30 V3 accept below. Do not treat `GLOBAL_NAV_STRUCTURE = TOP_NAV` as current direction.

Still unselected:

- final visual style
- palette
- token values
- final components
- shadcn or another UI kit
- high-fidelity layouts
- full responsive implementation
- mobile rewrite

Wave 1 of first-lot UI implementation now shows Level 1 `Catalog` and stable `/jobs/:jobId` plus `/quotes/:quoteSnapshotId` routes. Full first-lot visual implementation is not complete. See `docs/architecture/UI_UX_FOUNDATION_CANON.md` and `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1_V1.md`.

## OWNER RESET — UI20 E2E

Recorded 2026-09-04. Newer than the V3 “incremental polish only” closure. Does not rewrite historical Owner acceptance of V3, Clients, Client Hub, Cereri, first HF lot, or Architecture C.

```text
OWNER_DECISION                     = UI20_E2E_CLEAN_SHEET_UX
NEXT_PROGRAM_PRIORITY              = WORKOS_UI_UX_2_0_E2E
UI_GENERAL_REDESIGN                = REOPENED_BY_OWNER_FOR_UI20_E2E
UI_GENERAL_REDESIGN_V1_HISTORICAL  = CLOSED_FOR_V1
UI20_CURRENT_VISUAL_DIRECTION      = NOT_SELECTED
UI20_CURRENT_IA                    = NOT_SELECTED
UI20_IMPLEMENTATION                = NOT_AUTHORIZED
UI20_R1                            = RESEARCH_ACCEPTED_WITH_ADVISORIES
UI20_R2                            = RESEARCH_ACCEPTED_WITH_ADVISORIES
UI20_R2_DOCUMENTATION              = DOCUMENTATION_READY
UI20_LEADING_VISUAL_HYPOTHESIS     = G_LIVING_FABRICATION_INSTRUMENT
UI20_LEADING_IA_HYPOTHESIS         = IA3_QUIET_DESTINATIONS_OBJECT_CONTINUITY
UI20_R3                            = CHARACTER_PROOF_ACCEPTED_WITH_ADVISORIES
UI20_R3A                           = ACCEPTED
UI20_R3_SIGNATURE_AMENDMENT        = ACCEPTED
S1_A                               = STRUCTURAL_BASE_ACCEPTED
NEXT_RECOMMENDED_BUILD             = UI20_R4_PAGE_PERSONALITY_AND_SEMANTIC_DYNAMICS
PRODUCT_SYSTEM_FC1B                = SUPERSEDED_BEFORE_RUNTIME_IMPLEMENTATION
A3_1                               = RESEARCH_INPUT_NOT_CANON
OS_S8                              = HOLD_UNTIL_UI20_E2E_DIRECTION_AND_IMPLEMENTATION_CLOSURE
MACHINES_FC2                       = HOLD
NEW_FIGMA_FILE_KEY                 = 0XP0yGa1siWQdTTL7ou8xz
HISTORICAL_FIGMA_FILE_KEY          = 1ev5lg7m2Ze1h3Vqmax8ho
```

The implemented runtime remains the V3 sidebar and accepted page contracts until a later implementation GO. UI20 may explore alternative IA and visual systems. It must not invent domain states. Agents must not resume UI-FC1B React from older flags.

## ACCEPTED OWNER V3 NAVIGATION

Recorded 2026-08-30. Living navigation direction for the whole application. Wave 1 shell implementation is integrated on main.

```text
OWNER_DECISION                         = V3_NAVIGATION_DESIGN_ACCEPTED
GLOBAL_NAVIGATION                      = ONE_STABLE_SIDEBAR
UI_UX_NAVIGATION_V3_DESIGN             = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION     = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION      = COMPLETE
ALL_EXISTING_PAGES_UI_V3               = INTEGRATED_ON_MAIN
ALL_EXISTING_PAGES_UI_V3_RUNTIME       = OWNER_ACCEPTED
UI_V3_GENERAL_FINALIZATION             = COMPLETE
UI_GENERAL_REDESIGN                    = CLOSED_FOR_V1
UI_POLISH_MODE                         = INCREMENTAL
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
NEXT_PROGRAM_PRIORITY                  = PRODUCT_DEVELOPMENT
PRODUCT_IMPLEMENTATION                 = WAVE_1_SHELL_ON_MAIN
PACK_SHA256                            = 8cd54c20144d8d1c25c59551f8c1655e163e358fbcee8af0d1d762206166b70e
PACK_NAME                              = WORKOS_MAP_V3_COLLAPSIBLE_SIDEBAR_REVIEW_PACK
```

The design pack lives outside git under `.tmp`. Do not commit the board, reconstructed screenshots, or video.

### Categories

Categories are discrete visual labels. They are not links, have no icons, receive no active state, and do not open required landing pages.

Order:

1. PRINCIPAL
2. COMERCIAL
3. PRODUCȚIE
4. RESURSE
5. OAMENI
6. ADMINISTRARE

### Pages

Pages are clickable and have Lucide icons. The same twenty destinations stay in this order on every route. A route change updates only the active page.

```text
PRINCIPAL
  Acasă
COMERCIAL
  Clienți
  Cereri
  Oferte
  Catalog
PRODUCȚIE
  Lucrări
  Atelier
RESURSE
  Resurse și costuri
  Stoc
  Utilaje
  Furnizori
  Achiziții
OAMENI
  Angajați
  Pontaj
  Plăți și avansuri
ADMINISTRARE
  Firmă
  Politici
  Servicii operaționale
  Sistem produs
  Guvernanță
```

Sister pages never disappear after navigation. No global horizontal menu. No persistent L2. No third navigation level.

The top bar holds context, organization, account, and later a real search if one exists. It is not a second menu.

Local tabs may exist only inside an object or workspace. They must not become global navigation.

Current runtime routes stay until a later implementation GO. This document does not create pages, paths, or empty shells.

### Dimensions and behavior

```text
EXPANDED_WIDTH   = 256px
COLLAPSED_WIDTH  = 72px
```

Collapsed state is persisted locally. Collapsed keeps the same icons and order. Tooltip and accessible name use `Categorie — Pagină`. The active page is scrolled into view. The sidebar scrolls independently. The collapse control must not cover the last destination.

At 768 px the same tree opens in a drawer:

```text
DRAWER_WIDTH     = min(88vw, 384px)
```

The active page is visible on open. Focus goes to the active page or Close. Escape and scrim close the drawer. Focus returns to Menu.

### Roles and capabilities

The menu may differ only by role or organization configuration, and then stays stable for the session. It must not change from route to route.

A disabled capability may hide an optional destination consistently. It must not delete or hide historical data that must be kept.

### OUT-EMP-REQUESTS

```text
CATEGORY  = Oameni
PAGE      = Angajați
ROUTE     = /people
NEW_PAGE  = NO
NOT       = Comercial / Cereri
```

Internal leave or absence belongs on the person. Attendance may receive the effect after approval.

## Classification

Every UI direction statement in this file belongs to exactly one class:

```text
INVARIANTS
EVIDENCE_SUPPORTED
FIGMA_CANDIDATE
DEFERRED
```

- **INVARIANTS** — must hold in every later UI task. Changing one is an Owner direction change and requires updating this canon.
- **EVIDENCE_SUPPORTED** — conclusions clear enough from the accepted OLD + NEW audit. They guide Figma and later implementation. They are not final visual, component, or layout decisions.
- **FIGMA_CANDIDATE** — solutions that must be compared visually before Owner accepts them. Do not treat a candidate as an invariant.
- **DEFERRED** — outside the HUB MEDIA pilot or later high-fidelity / scoped UI work. Do not implement to “get ahead.”

Do not promote a Figma candidate into an invariant to keep moving.

## Objective

WorkOS must be:

- clean
- calm
- aesthetic
- intuitive
- logical
- easy to learn
- scalable for more products and domains
- oriented to the user’s next action
- adapted to the current role
- written in human atelier and business language

The operator must not need to understand database structure, enums, capability IDs, bootstrap markers, or other backend machinery.

```text
OPERATOR_UI_LANGUAGE = Romanian
INTERNAL_CODE_AND_IDS = English
```

NEW remains the domain authority. Restructuring UI does not change business truth.

```text
OLD_APP = OPERATIONAL_EVIDENCE
OLD_APP ≠ VISUAL_BLUEPRINT
```

## INVARIANTS

### 1. Business truth is not a UI text file

Business truth comes from domain and runtime. The UI projects it.

The UI must not calculate, reprice, recompile, invent readiness, or become a second commercial, production, or Product System authority.

UI may own experience: layout, hierarchy, interaction, local UI state, responsive behavior, and generic renderers.

See `docs/architecture/UI_UX_FOUNDATION_CANON.md` and `.cursor/rules/one-truth.mdc`.

### 2. One global navigation surface

```text
NAVIGATION_SURFACES = ONE
GLOBAL_SIDEBAR      = STABLE
```

The sidebar is the only global menu. Page content holds the work: list, detail, form, decision, result. Local tabs, filters, and breadcrumbs may exist only inside an object or workspace. They are not a second global menu and not a third navigation level.

### 3. Global navigation stays bounded

Global navigation must stay short and stable.

It contains the accepted V3 categories and twenty pages, not catalog families or resource subcategories.

It must not grow with every product, resource, operation, or subcategory.

Do not invent a new category or a third level to place a function.

Permissions and organization configuration may hide optional destinations for a whole session. They must not change the menu because the route changed.

Owner accepted the V3 sidebar map on 2026-08-30. Wave 1 shell implementation is local in review; this file does not authorize missing pages or OS-S3.

### 4. Large collections use list/detail, not menu trees

For products, resources, costs, people, clients, and other registries:

```text
SEARCH + FILTERS + LIST/DETAIL + PROGRESSIVE DISCLOSURE
```

Commercial catalog collections and Product System / admin collections may share that mechanic. They must stay distinguishable by job, language, and primary action: sell / configure versus inspect / administer truth.

Not:

```text
CATEGORY MENU → SUBCATEGORY MENU → LONG ITEM MENU
```

Lists must be able to scale to hundreds or thousands of records without growing global navigation.

Selecting an item must have a stable URL and a clear detail surface.

Do not rely on ephemeral in-memory selection as the only way to reopen the same record.

### 5. Commercial catalog is not Product System administration

```text
Commercial catalog/configurator
≠
Product System administration
```

`/products` is the sellable catalog and the entry toward cerere / ofertă / comandă.

Product System is the administrative truth about families, templates, components, contracts, structure, lifecycle / publication, and readiness.

Product System stays in Administrare. It must not become a commercial menu.

The accepted Level 1 label for that commercial work area is `Catalog`. `Configurează` is a contextual action, not a Level 1 domain. Existing URLs do not change:

```text
/products             = catalog + configurator comercial
/admin/product-system = Product System
```

### 6. Technical detail is hidden by default

Technical information is available only through progressive disclosure:

- Detalii
- diagnostics
- admin
- developer mode

Normal operator UI must not expose hashes, DTO names, raw codes, service names, compiler vocabulary, raw provenance, debug objects, capability IDs, bootstrap markers, or internal JSON as primary language.

The operator should see what to complete, what is selected, what is missing, what to confirm, what is blocked and why, the result, and what comes next.

IDs and internal codes may exist as secondary identifiers. They must not be the hero title when a human name, product, or task exists.

### 7. Badges are for actionable states

Badges are used only for states the user can act on or must notice to act.

Informative statuses use calmer visual treatment.

Do not display a decorative badge for every property.

Do not revive COMPAT / AUDIT / Live DB / STAGING chrome as operator language.

### 8. States are designed, not accidental

Empty, loading, error, blocked, unauthorized, and success are designed states.

Screenshots or hardcoded happy-path UI are not PASS. See `.cursor/rules/e2e-first.mdc`.

### 9. One primary action

The page’s primary action must be visible and unambiguous.

Forms and user decisions outrank long explanations.

Important warnings stay visible, but compact and in context. They must not bury the decision.

### 10. Language, role, and People names

Operator-facing UI stays in Romanian.

Copy adapts to the current role. An operator, an owner, and a later diagnostic viewer are not the same audience.

Do not teach the workshop the product’s internal architecture.

Authorized People UI may show real staff names. The defect is real identities in demo, evidence, or unauthorized exposure — not names in the authorized operational catalog.

### 11. Operator attention order in Atelier and Execution

The operator sees first what they have to do.

In Atelier and Execution, present in this order:

1. the task
2. the job and the product
3. the relevant component
4. the dependencies
5. the person / machine
6. the possible action
7. extra details

### 12. Responsive foundation, mobile last

Desktop is the primary pilot surface.

A coherent responsive foundation must be included in the later Figma foundation. This line does not start Figma and does not authorize responsive CSS from this document.

```text
MOBILE_OPERATIONS = DEFERRED
RESPONSIVE_FOUNDATION = MUST_NOT_BE_BLOCKED
```

Narrow desktop must not collapse into an infinite single column with no hierarchy.

Global navigation must have deterministic behavior at reduced widths.

Phone-first rewrite of the whole product is DEFERRED.

### 13. Accessibility from the start

Keep accessibility from the first later UI implementation:

- focus
- keyboard
- contrast
- labels, including screen-reader labels
- touch targets
- information not conveyed by color alone
- reduced motion

Accessibility is not a post-visual polish pass.

Dark theme must be designed and checked separately. It must not be an uncontrolled automatic inversion of light styles.

### 14. One semantic visual system

```text
THEME = LIGHT + DARK + SYSTEM
```

This is a later-UI invariant. It does not authorize adding tokens, CSS variables, dark stylesheets, or theme plumbing from this document.

`SYSTEM` follows the operating-system preference and still allows an explicit persisted choice.

One semantic token system covers:

- color
- typography
- spacing
- radius
- elevation
- borders
- focus
- motion
- density, if Figma later proves it is needed

Primitive tokens stay separate from semantic tokens.

Components and pages use semantic tokens.

Forbidden in later UI work:

- hex colors copied into pages
- inline colors for normal layout
- arbitrary repeated spacing
- local font sizes without a token
- CSS duplicated per page
- chaotic dark overrides
- a second UI kit
- business truth in CSS

The current app already has a small light-only token set recorded in `docs/architecture/UI_UX_FOUNDATION_CANON.md`. That is not the required LIGHT / DARK / SYSTEM system. Later work extends one semantic system; it does not start a second kit.

shadcn may be the later implementation base. It does not decide the product or the information architecture.

Token names and values remain FIGMA_CANDIDATE.

### 15. Old application is evidence, not a skin

Do not copy the old structure, menus, CSS, or visual hierarchy by default.

### 16. No UI implementation from this canon alone

This document does not authorize UI implementation, plugin installation, or a restructure prompt.

The Figma access gate, Owner IA selection, visual-direction gate, and first-lot visual gate are closed. High-fidelity **design** for the first lot is `FIRST_LOT_OWNER_ACCEPTED`. Visible runtime for Wave 1 is `WAVE_1_FOUNDATION_ROUTES_ACCESS`. Full first-lot UI implementation is not complete. Wave 1 is `IN_REVIEW`.

`OWNER_VISUAL_ACCEPTANCE` for the first lot is closed as `HF_LOT_GATE`. That closed visual gate is not a scoped UI implementation GO. Do not treat accepted Figma screens as if they already exist in the product.

## EVIDENCE_SUPPORTED

These conclusions are clear enough from the accepted 283-PNG pack and the audit report. They are not final visual chrome or layouts. The accepted IA labels and navigation structure are recorded in the Owner decision above.

### Navigation and information architecture

- NEW’s short global set of work areas scales better than OLD’s long sidebar. Keep the **bounded-domain** principle. Owner later accepted five Level 1 domains and top navigation; that acceptance is recorded above, not invented here.
- Comercial is a work area, not four Level 1 siblings. Cereri, Oferte, and Clienți belong in Level 2.
- Product System administration already lives under Administrare in NEW. Keep that domain split.
- Categories and items already leak into page-local trees on NEW `/products` and several admin catalogs. That pattern does not scale. Treat those trees as collections, not as a second global menu.
- OLD master–detail on Oferte and Clienți is operationally useful. NEW list-only quote rows lose inspect-one-offer density. Restoring a local master–detail pattern is allowed later; the commercial engine must stay one.

Before Owner acceptance, Level 1 names were a hypothesis. The accepted set is now:

```text
Lucrări
Atelier
Comercial
Catalog
Administrare
```

`Configurează` is not a Level 1 name. It is the contextual action that opens configuration from Catalog or from a selected sellable product.

Today’s implemented names remain recorded in `docs/architecture/UI_UX_FOUNDATION_CANON.md` until a later scoped UI GO.

### OLD — keep as principle

- master–detail for large registries
- global search as a findability hint, not as a second architecture
- clear local context
- operational summaries
- role-adapted entry pages
- fast access to the next action
- useful density on operational screens

### OLD — do not copy

- a very long global sidebar
- mixing work domains with technical, legacy, and DEV pages
- competing visual levels (sidebar + flow rail + breadcrumbs + banners + KPIs)
- debug / backend / internal status in operator UI
- overloaded Product Studio / compiler vocabulary on operator paths
- a menu structure that grows with every feature
- the OLD skin, CSS, or visual hierarchy

### NEW — keep

- cleaner domain truth
- Commercial / Execution / Product System separation
- stable routes
- fail-closed states (empty, blocked, ineligible, invalid credentials, invalid PIN)
- machine-capability honesty
- no HUB MEDIA business-data copy in bootstrap
- operator UI in Romanian

### NEW — change / improve

- long card walls
- repeated metadata at the same visual weight
- too much text before the action
- vertical category / item rails that become the page
- weak use of wide desktop space
- Product System hard to discover — improve the Administrare door and label only; do not add Product System as a Level 1 work area or a second product app
- near-duplicate administrative inspection pages
- unnecessary backend details in the default view
- weak hierarchy between summary, decision, and detail
- missing LIGHT / DARK / SYSTEM

### Theme and CSS readiness

NEW is light-only. OLD already shows a theme toggle. That proves the need. It does not license copying the OLD control or palette.

Page-local hex and duplicate token names exist in the current CSS. Later implementation must retire that drift into one semantic system. Do not “fix” it by copying more page CSS from this canon.

### Accessibility readiness

Keyboard, focus, landmarks, dialog modality, and contrast still have gaps. Those gaps are evidence that accessibility must be designed with the foundation, not added after a skin.

## FIGMA_CANDIDATE

Figma compared three information-architecture variants. That comparison is closed for navigation structure. Keep the candidate history. Do not rewrite the scores after the Owner decision.

1. **A — evolved top navigation** — Owner accepted on 2026-08-25 for that IA stage; superseded as living direction on 2026-08-30
2. **B — compact / collapsible sidebar** — evaluated in 2026-08-25 IA, not selected then
3. **C — hybrid navigation** — evaluated, not selected

Owner later accepted a stable collapsible sidebar (V3) as living navigation direction. Keep the 2026-08-25 scores as history. Do not rewrite them. Do not treat `A_TOP_NAV` as current direction.

Evidence scores on page 07 were not restated after acceptance:

```text
A_TOP_NAV = 85
B_SIDEBAR = 76
C_HYBRID  = 77
```

Each variant was tested with a realistic WorkOS volume, not with two demo items, and demonstrated menu scale, catalog scale, Lucrări, Atelier, Comercial, catalog / configurator, administrative Product System, resource administration, LIGHT / DARK / SYSTEM structure, wide desktop, narrow foundation, and progressive disclosure.

Closed by Owner IA acceptance:

- Level 1 count and order
- top navigation versus sidebar versus hybrid
- Level 1 label: `Catalog`
- `Configurează` as contextual action, not a Level 1 domain
- primary entity detail = stable page
- admin collections = split list/detail
- short actions = drawer or dialog
- information density = intermediate

Still FIGMA_CANDIDATE / unselected:

- token values, type ramp, and motion
- whether shadcn/ui is accepted as the implementation base
- high-fidelity layouts
- which of the twelve proposed pilot screens enter the next high-fidelity scope
- which current pages are keep / restructure / remove after visual acceptance
- final visual style and palette

```text
GLOBAL_NAV_STRUCTURE       = STABLE_SIDEBAR
CATALOG_LABEL              = ACCEPTED
HIGH_FIDELITY_DESIGN       = FIRST_LOT_OWNER_ACCEPTED
OWNER_VISUAL_ACCEPTANCE    = FIRST_LOT_CLOSED
HIGH_FIDELITY              = FIRST_LOT_OWNER_ACCEPTED
VISIBLE_RUNTIME            = WAVE_1_FOUNDATION_ROUTES_ACCESS
UI_IMPLEMENTATION          = IN_REVIEW
UI_UX_NAVIGATION_V3_IMPLEMENTATION = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION = COMPLETE
ALL_EXISTING_PAGES_UI_V3 = INTEGRATED_ON_MAIN
ALL_EXISTING_PAGES_UI_V3_RUNTIME = OWNER_ACCEPTED
UI_V3_GENERAL_FINALIZATION = COMPLETE
UI_GENERAL_REDESIGN = REOPENED_BY_OWNER_FOR_UI20_E2E
UI_POLISH_MODE = SUPERSEDED_BY_UI20_REFOUNDATION
CLIENTS_V3                 = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION    = OWNER_ACCEPTED
CLIENTS_RUNTIME            = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE         = CLOSED
CLIENT_HUB_FIGMA_FINAL     = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME         = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE  = CLOSED
CLIENT_HUB                 = INTEGRATED_ON_MAIN
CERERI_V3_FIGMA_FINAL      = OWNER_ACCEPTED
REQUESTS_DIRECTION         = OWNER_ACCEPTED
CERERI_TECHNICAL_GATE      = CLOSED
REQUESTS_RUNTIME           = OWNER_ACCEPTED
CERERI_RUNTIME             = OWNER_ACCEPTED
CERERI_INTEGRATED_ON_MAIN  = YES
REQUESTS_INTEGRATED_ON_MAIN = YES
NEXT_PROGRAM_PRIORITY      = WORKOS_UI_UX_2_0_E2E
```

`OWNER_VISUAL_ACCEPTANCE` for the first lot is closed. It is not the closed IA gate and it is not a scoped UI implementation GO.

## Figma gate

`FIGMA_ACCESS_AND_INFORMATION_ARCHITECTURE` is accepted. Visual direction A and the first HF lot are accepted. Implementation-readiness contracts are `OWNER_ACCEPTED`. This file does not authorize React/CSS.

Recorded process, without rewriting earlier steps as if Mobbin had run:

```text
1. FIGMA_ACCESS_GATE                         = COMPLETE
2. MOBBIN_RESEARCH                           = NOT_STARTED
3. THREE_INFORMATION_ARCHITECTURE_CANDIDATES = COMPLETE
4. OWNER_IA_SELECTION                        = ACCEPTED_WITH_AMENDMENTS
5. PILOT_HIGH_FIDELITY_SCOPE_DEFINITION      = OWNER_ACCEPTED
6. DESIGN_TOKEN_FOUNDATION                   = WAVE_1_FOUNDATION
7. COMPONENT_LIBRARY                         = FIGMA_ONLY_NOT_IMPLEMENTED
8. PILOT_SCREEN_SET                          = FIRST_LOT_OWNER_ACCEPTED
9. OWNER_VISUAL_ACCEPTANCE                   = FIRST_LOT_CLOSED
10. IMPLEMENTATION_READINESS_CONTRACTS       = OWNER_ACCEPTED
11. SCOPED_UI_IMPLEMENTATION                 = WAVE_1_IN_REVIEW
```

The first lot lives in the lot worklog and in Figma pages 12–21. Route, money, and wave contracts live in `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md`. Wave 1 implements foundation routes and access. Remaining lot screens are not implemented.

This file does not start scoped UI implementation.

## DEFERRED

Keep outside this stage and outside high-fidelity / scoped UI implementation:

- mobile-first rewrite
- employee-mobile routes
- universal redesign of every page
- all V2 pages
- complex decorative animation
- free-form theme personalization
- universal CRUD
- universal Machine Admin
- SVG / DWG analysis inside WorkOS
- Logo
- Analyzer inside WorkOS
- HR / payroll as commercial price or REVISAL
- pontaj, internal payments, suppliers, purchasing, and reports as **implementation** — they remain on the accepted V3 map as destinations; they are not eliminated from the product; this file does not authorize building them
- post-pilot roadmap features
- shop-floor machine-map UI as a replacement for Atelier inbox
- command palette as the primary catalog architecture

Historical Machine Strict pixels are reference-only. They are not captures of the accepted 283-PNG pack and must not be treated as current visual proof.

## Current implementation versus target

`docs/architecture/UI_UX_FOUNDATION_CANON.md` records what the app does today: five top-nav items, Comercial sub-rail, Administrare domain cards, category → item rails on several admin catalogs, light-only tokens. That is implemented presentation. It is not the accepted V3 map.

The accepted navigation target is the V3 stable sidebar. Do not edit the foundation canon to pretend that sidebar already exists.

Accepted first-lot Figma screens remain design truth for those pages. They are not a second navigation law. `VISIBLE_RUNTIME` stays the implemented first-lot runtime until a later UI GO.

The foundation line that named Product System admin as the next UI candidate is historical to that foundation build. It is not the active next UI task.

## Change governance

Any later implementation report includes the V1 roadmap checkpoint. Any later UI change also reports:

```text
UI_UX_CANON_READ        = YES
ROADMAP_READ            = YES
DIRECTION_CONFLICT      = NO | description
THEME_IMPACT            = NONE | LIGHT | DARK | SYSTEM | BOTH
NEW_HARDCODED_CSS       = NO
BACKEND_DETAILS_EXPOSED = NO
```

`AGENTS.md` and the always-on Cursor rule keep the short shared triple (`ROADMAP_READ`, `UI_UX_CANON_READ`, `DIRECTION_CONFLICT`). They do not replace the fuller UI or roadmap checkpoints.

Update this canon only when a direction decision changes. Do not edit it after every minor visual adjustment, and do not edit it only to justify a build after the fact.

If a prompt contradicts this canon or the active V1 roadmap, stop and report. Do not “fix” the canon to match the prompt.
