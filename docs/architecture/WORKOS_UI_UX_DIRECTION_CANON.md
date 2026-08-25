# WorkOS UI/UX direction canon

Living direction for WorkOS operator and owner presentation.
This document is normative for **how UI may evolve**. It is not a frozen mockup, not a page-by-page specification, and not a promise that visual design will never change.

```text
AUTHORITY                         = ACTIVE_UI_UX_DIRECTION
SOURCE_OF_THIS_REVISION           = FIRST_HF_LOT_OWNER_ACCEPTED_PLUS_READINESS_CONTRACTS
PREVIOUS_REVISION_SOURCE          = OWNER_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE
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
VISIBLE_RUNTIME                   = CURRENT_FOUNDATION_NOT_YET_UPDATED
UI_IMPLEMENTATION                 = NOT_STARTED
UI_IMPLEMENTATION_AUTHORIZED      = NO
UI_IMPLEMENTATION_AUTHORIZATION   = FORBIDDEN_UNTIL_OWNER_GO_FOR_SCOPED_UI_IMPLEMENTATION
FIGMA_ACCESS_GATE                 = COMPLETE
INFORMATION_ARCHITECTURE          = OWNER_ACCEPTED
OWNER_IA_GATE                     = CLOSED
HIGH_FIDELITY                     = FIRST_LOT_OWNER_ACCEPTED
GLOBAL_NAV_STRUCTURE              = TOP_NAV
CATALOG_LABEL                     = ACCEPTED
THEME_TOKENS_IMPLEMENTED          = NO
THEME_TOKEN_IMPLEMENTATION        = FORBIDDEN_UNTIL_OWNER_SCOPED_UI_GO
```

Figma access, information architecture, visual direction A, and the first high-fidelity lot are accepted. Implementation-readiness contracts are Owner-accepted and the readiness gate is closed. `IMPLEMENTATION_READY = YES` is not a scoped UI implementation GO. This document is not the Owner GO for React/CSS, Mobbin, a production component library, or scoped UI implementation.

Runtime and domain contracts win if this document disagrees with implemented business behavior.
`docs/architecture/UI_UX_FOUNDATION_CANON.md` remains the **current implemented presentation law** (today’s shell, routes, and primitives). This canon does not replace that record. It governs later Owner decisions and later UI change.

Related living authority:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` — active V1 delivery sequence
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md` — domain ownership
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — current implemented presentation
- `docs/worklog/WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1.md` — evidence citations for the previous direction revision
- `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md` — Owner IA acceptance record
- `docs/worklog/WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1.md` — accepted first HF lot
- `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md` — accepted route, access, mapping, and wave contracts

Do not create a second UI/UX direction canon.

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

Still unselected:

- final visual style
- palette
- token values
- final components
- shadcn or another UI kit
- high-fidelity layouts
- full responsive implementation
- mobile rewrite

The implemented shell still shows today’s `Produse` label until a later scoped UI GO changes runtime presentation. See `docs/architecture/UI_UX_FOUNDATION_CANON.md`.

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

### 2. Three navigation layers

```text
LEVEL 1 = global work areas
LEVEL 2 = local navigation inside the selected area
LEVEL 3 = page content and object context
```

- **Level 1** — how the person moves between work areas.
- **Level 2** — tabs, filters, saved views, subsections, categories, breadcrumbs, contextual search.
- **Level 3** — the work itself: list, detail, form, decision, result.

Level 2 is not an infinite extension of the global menu.

### 3. Global navigation stays bounded

Global navigation must stay short and stable.

It contains **work domains**, not catalog categories.

It must not grow with every product, resource, operation, or subcategory.

Subcategories must not appear as new Level 1 items.

Permissions may hide inaccessible domains. They must not change the meaning of the remaining routes.

Owner accepted the Level 1 set, order, `Catalog` label, and top navigation. Do not reopen those from documentation alone.

Still unselected from this document:

- the final narrow-width visual chrome
- the final visual style of the accepted top navigation

Those remain later Figma / visual-acceptance work.

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

The Figma access gate, Owner IA selection, visual-direction gate, and first-lot visual gate are closed. High-fidelity **design** for the first lot is `FIRST_LOT_OWNER_ACCEPTED`. Visible runtime is still the current foundation. UI implementation is `NOT_STARTED`.

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

1. **A — evolved top navigation** — Owner accepted for the next design stage
2. **B — compact / collapsible sidebar** — evaluated, not selected
3. **C — hybrid navigation** — evaluated, not selected

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
GLOBAL_NAV_STRUCTURE       = TOP_NAV
CATALOG_LABEL              = ACCEPTED
HIGH_FIDELITY_DESIGN       = FIRST_LOT_OWNER_ACCEPTED
OWNER_VISUAL_ACCEPTANCE    = FIRST_LOT_CLOSED
HIGH_FIDELITY              = FIRST_LOT_OWNER_ACCEPTED
VISIBLE_RUNTIME            = CURRENT_FOUNDATION_NOT_YET_UPDATED
UI_IMPLEMENTATION          = NOT_STARTED
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
6. DESIGN_TOKEN_FOUNDATION                   = ACCEPTED_IN_FIGMA_NOT_IMPLEMENTED
7. COMPONENT_LIBRARY                         = FIGMA_ONLY_NOT_IMPLEMENTED
8. PILOT_SCREEN_SET                          = FIRST_LOT_OWNER_ACCEPTED
9. OWNER_VISUAL_ACCEPTANCE                   = FIRST_LOT_CLOSED
10. IMPLEMENTATION_READINESS_CONTRACTS       = OWNER_ACCEPTED
11. SCOPED_UI_IMPLEMENTATION                 = NOT_STARTED
```

The first lot lives in the lot worklog and in Figma pages 12–21. Route, money, and wave contracts live in `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md`. They are not implemented.

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
- HR / pontaj / payroll
- post-pilot roadmap features
- shop-floor machine-map UI as a replacement for Atelier inbox
- command palette as the primary catalog architecture

Historical Machine Strict pixels are reference-only. They are not captures of the accepted 283-PNG pack and must not be treated as current visual proof.

## Current implementation versus target

`docs/architecture/UI_UX_FOUNDATION_CANON.md` records what the app does today: five top-nav items with the implemented `Produse` label, Comercial sub-rail, Administrare domain cards, category → item rails on several admin catalogs, light-only tokens. The accepted Level 1 label is `Catalog`; do not edit the foundation canon to pretend that label is already in the shell.

Accepted Figma screens are design truth. They are not visible runtime. `VISIBLE_RUNTIME = CURRENT_FOUNDATION_NOT_YET_UPDATED`.

This canon records where later authorized UI work must go. Do not edit the foundation canon to pretend the target shell already exists.

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
