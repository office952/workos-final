# WorkOS UI/UX direction canon

Living direction for WorkOS operator and owner presentation.
This document is normative for **how UI may evolve**. It is not a frozen mockup and not a page-by-page specification.

```text
AUTHORITY                  = ACTIVE_UI_UX_DIRECTION
UI_IMPLEMENTATION          = FORBIDDEN_UNTIL_OWNER_GO_FOR_SCOPED_UI_IMPLEMENTATION
SIDEBAR_FINAL              = NOT_DECLARED
THEME_TOKENS_IMPLEMENTED   = NO
```

This document is not the Owner GO for scoped UI implementation (roadmap step 7). That GO cannot precede the audit, the evidence-pack review, the direction-canon update, Figma, and visual acceptance (roadmap steps 3–6).

Runtime and domain contracts win if this document disagrees with implemented business behavior.
`docs/architecture/UI_UX_FOUNDATION_CANON.md` remains the **current implemented presentation law** (today’s shell, routes, and primitives). This canon does not replace that record. It governs audit, Owner decisions, and later UI change.

Related living authority:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` — active V1 delivery sequence
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md` — domain ownership
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — current implemented presentation

Do not create a second UI/UX direction canon.

## Classification

Every UI direction statement in this file belongs to exactly one class:

```text
INVARIANTS
CANDIDATE_DIRECTION_TO_VALIDATE
OWNER_DECISIONS_PENDING
DEFERRED
```

- **INVARIANTS** — must hold in every later UI task. Changing one is an Owner direction change and requires updating this canon.
- **CANDIDATE_DIRECTION_TO_VALIDATE** — hypothesis for the mandatory old+new UI/UX audit. Not approved implementation.
- **OWNER_DECISIONS_PENDING** — Owner must decide after evidence. Agents must not invent the answer.
- **DEFERRED** — out of this direction’s current horizon. Do not implement to “get ahead.”

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

## INVARIANTS

### 1. Business truth is not a UI text file

Business truth comes from domain and runtime. The UI projects it.

The UI must not calculate, reprice, recompile, invent readiness, or become a second commercial, production, or Product System authority.

UI may own experience: layout, hierarchy, interaction, local UI state, responsive behavior, and generic renderers.

See `docs/architecture/UI_UX_FOUNDATION_CANON.md` and `.cursor/rules/one-truth.mdc`.

### 2. Three navigation layers

Global navigation, local navigation, and page content are different layers.

- **Global** — how the person moves between work areas.
- **Local** — how the person moves inside one work area (tabs, segments, category → item).
- **Content** — the work itself: list, detail, form, decision, result.

Current work-area names (Lucrări, Atelier, Comercial, Produse, Administrare) are examples recorded in `docs/architecture/UI_UX_FOUNDATION_CANON.md`. They are not the final global set. The final global navigation model is OWNER_DECISIONS_PENDING.

A category and the items inside that category must not stay permanently crammed into the same menu.

### 3. Collections and stable selection

Large lists must be able to use search, filters, sort, and pagination or virtualization when volume requires it.

Selecting an item must have a stable URL and a clear detail surface.

Do not rely on ephemeral in-memory selection as the only way to reopen the same record.

### 4. Technical detail is hidden by default

Technical information is available only in:

- Detalii
- diagnostics
- admin
- developer mode

Normal operator UI must not expose hashes, DTO names, raw codes, service names, compiler vocabulary, raw provenance, debug objects, capability IDs, bootstrap markers, or internal JSON.

The operator should see what to complete, what is selected, what is missing, what to confirm, what is blocked and why, the result, and what comes next.

### 5. Badges are for actionable states

Badges are used only for states the user can act on or must notice to act.

Do not display a decorative badge for every property.

### 6. States are designed, not accidental

Empty, loading, error, blocked, unauthorized, and success are designed states.

Screenshots or hardcoded happy-path UI are not PASS. See `.cursor/rules/e2e-first.mdc`.

### 7. One primary action

The page’s primary action must be visible and unambiguous.

Forms and user decisions outrank long explanations.

Important warnings stay visible, but compact and in context. They must not bury the decision.

### 8. Language and role

Operator-facing UI stays in Romanian.

Copy adapts to the current role. An operator, an owner, and a later diagnostic viewer are not the same audience.

Do not teach the workshop the product’s internal architecture.

### 9. Responsive foundation, mobile last

Do not block a coherent responsive foundation.

```text
MOBILE = LAST
RESPONSIVE_FOUNDATION = MUST_NOT_BE_BLOCKED
```

Phone-first redesign of the whole product is DEFERRED.

### 10. Accessibility from the start

Keep accessibility from the first later UI implementation: focus, keyboard, contrast, labels, and reduced motion.

Accessibility is not a post-visual polish pass.

### 11. One visual system

```text
LIGHT  = REQUIRED
DARK   = REQUIRED
SYSTEM = REQUIRED
```

All three modes use the same semantic token system.

The current app already has a small light-only token set recorded in `docs/architecture/UI_UX_FOUNDATION_CANON.md`. That is not the required LIGHT / DARK / SYSTEM system. Later work extends one semantic system; it does not start a second kit.

Forbidden in later UI work:

- hex colors copied into pages
- arbitrary repeated spacing
- local font sizes without a token
- inline styles for normal layout
- CSS duplicated per page
- near-identical components created in parallel
- dark theme obtained through chaotic overrides
- a second UI kit

### 12. Old application is evidence, not a skin

```text
OLD_APP = OPERATIONAL_EVIDENCE
OLD_APP = NOT_VISUAL_BLUEPRINT
```

Do not copy the old structure, menus, CSS, or visual hierarchy by default.

### 13. No UI implementation from this canon alone

This document does not authorize UI implementation, Figma production, or a restructure prompt.

The mandatory audit in this canon must finish. Owner independent review of that evidence pack is a prerequisite of roadmap step 5 (Figma). `OWNER_VISUAL_ACCEPTANCE` is a later, second Owner gate after Figma and a prerequisite of step 7. Do not treat those two Owner reviews as the same gate.

## CANDIDATE_DIRECTION_TO_VALIDATE

These are audit hypotheses. They are not approved implementation. Do not treat them as the next coding spec.

### Information architecture

Candidate pattern to validate against both the old application and the current WorkOS Final shell:

- persistent, collapsible global navigation
- top bar for context, actions, and the signed-in user
- breadcrumb for orientation
- local sub-navigation through tabs or segments
- list / table / search for collections
- page or drawer for detail
- stable routes
- actions that depend on role
- progressive disclosure

```text
SIDEBAR_FINAL = NOT_DECLARED
```

Do not declare the current top navigation final. Do not declare a sidebar final. The audit must compare both applications before Owner accepts an information architecture.

Today’s implemented shell remains recorded in `docs/architecture/UI_UX_FOUNDATION_CANON.md`. Roadmap step 4 updates **this** direction canon from audit evidence. The foundation canon is updated when the implemented shell actually changes, after scoped UI implementation lands. The foundation line that named Product System admin as the next UI candidate is historical to that foundation build. It is not the active next UI task.

### Theme and design tokens

Direction only. Do not implement tokens in this build.

Later implementation must define one semantic token set used by LIGHT, DARK, and SYSTEM:

- background
- surface
- elevated surface
- text primary / secondary / muted
- border
- accent
- success / warning / danger / info
- focus
- spacing
- radius
- shadow
- typography
- motion

Token names and values are OWNER_DECISIONS_PENDING after audit and Figma. This canon only requires that the system exist and stay semantic.

### Later component system

Direction for a later, authorized UI implementation — not this build:

- shadcn/ui as the base **if** the later technical audit confirms compatibility with the current React app
- shared components before local variants
- 21st.dev for inspiration only
- Figma for the design system and prototypes, only after the audit evidence pack and Owner independent review of that pack (not the later visual-acceptance gate)
- Context7 for current library documentation at implementation time
- React Doctor before closing a UI implementation
- BrowserStack for later accessibility and real-device checks

Cursor plugins, MCP servers, and design tools are not runtime product dependencies.

## OWNER_DECISIONS_PENDING

Owner decides after the mandatory audit and independent review. Agents must not fill these in to keep moving.

- Final global navigation model (including whether a sidebar exists)
- Final local-navigation pattern per work area
- Which collections use page detail vs drawer
- Token values and type ramp
- Whether shadcn/ui is accepted as the implementation base
- Which current surfaces are in the scoped UI implementation for the HUB MEDIA pilot
- Which current pages are keep / restructure / remove

## DEFERRED

- Mobile-first redesign of the whole product
- A second visual language for Cloud vs single-plane DEV
- Decorative marketing chrome
- Per-page custom illustration systems
- Universal CRUD shells
- A global Settings dump or a top-nav item per future domain
- Analyzer UI inside WorkOS
- Figma or implementation prompts before the audit evidence pack and Owner analysis

## Mandatory UI/UX audit before implementation

Owner rule:

Before any prompt that restructures UI/UX, audit the old application and the new application.

The audit must inventory every route and page reachable through:

- router
- navigation
- direct link
- role
- hidden states
- dialogs
- drawers
- tabs
- menus
- categories
- filters

For each inventoried surface, capture each **applicable designed state**. Do not require the cartesian product of page regions × states.

Required states, when they exist:

- empty
- populated
- loading
- error
- blocked
- unauthorized
- success

Location notes recorded on the capture, not extra required screenshots:

- full page
- top / middle / bottom when the state is only visible there
- dialog / drawer open
- relevant tab / category / filter

Required manifest for every capture:

| Field                                 |
| ------------------------------------- |
| Application                           |
| Route                                 |
| Role                                  |
| Runtime fixture                       |
| State                                 |
| Viewport                              |
| Screenshot                            |
| Actions required                      |
| Visible business purpose              |
| Problems observed                     |
| Keep / restructure / remove candidate |

Screenshots alone are not PASS. Each captured state on the **new** application must be backed by runtime or E2E assertions in this repository. For the old application, use live runtime observation only. Do not write tests, harnesses, or E2E into previous WorkOS repositories.

Cursor stops after the evidence pack. Owner sends the report and every capture for independent analysis. That analysis is the prerequisite of Figma (roadmap step 5). Do not generate a Figma prompt or a UI implementation prompt before that analysis.

```text
ALL_PAGE_SCREENSHOT_AUDIT = REQUIRED_BEFORE_UI_BUILD
UI_IMPLEMENTATION         = FORBIDDEN_UNTIL_OWNER_GO_FOR_SCOPED_UI_IMPLEMENTATION
```

`ALL_PAGE_SCREENSHOT_AUDIT` means: inventory every reachable route and page in both applications before any UI restructure prompt. Capture work may be sequenced so pilot-blocking surfaces finish first. Roadmap steps 4–7 may then be limited to those blocking surfaces. That limit is not permission to skip the inventory, skip the manifest, or treat screenshots as PASS. A restructure prompt cannot proceed on a surface that was never inventoried.

## Old application

Extract from the old application:

- workshop language people already use
- flows people already know
- useful concepts
- business data and relationships
- what was easy to use
- what was hard to scale

Do not automatically copy structure, menus, CSS, or visual hierarchy.

Previous WorkOS repositories remain read-only evidence. Do not write there.

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
