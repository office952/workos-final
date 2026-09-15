# WorkOS Figma workflow

```text
ROLE                       = AUTHORITY
OWNS                       = HOW_FIGMA_IS_USED_AND_WHICH_REFS_ARE_RECORDED
DOES_NOT_OWN               = PRODUCT_TRUTH, DOMAIN, PRICING, EXECUTION, LIVE_GITHUB_STATE
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = RECONCILE_WHEN_A_CANON_CHANGES_ITS_FIGMA_FILE_OR_SECTION
```

## Law

```text
FIGMA                          = VISUAL / INTERACTION AUTHORITY ONLY WHEN A CURRENT CANON ASSIGNS THAT CLASS
FIGMA                         != PRODUCT_TRUTH
FIGMA                         != DOMAIN_AUTHORITY
FIGMA                         != PRICING_AUTHORITY
FIGMA                         != EXECUTION_AUTHORITY
FIGMA                         != AUTOMATIC_CURRENT_IMPLEMENTATION_AUTHORITY
FIGMA                         != PAGE_LEVEL_OWNER_ACCEPTANCE
FIGMA_WRITE                    = REQUIRES_EXPLICIT_OWNER_GO
FORCE_SYNC_APP_TO_FIGMA        = NO FOR CONFIGURATOR
UI_UX_DIRECTION               != PAGE_LEVEL_OWNER_ACCEPTANCE
IMPLEMENTED                   != OWNER_ACCEPTED
FIGMA_REFERENCE               != OWNER_ACCEPTED
OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY
```

Recording a file or section is not the same as assigning current implementation visual authority. A Figma frame may describe chrome, spacing, and interaction grammar. It must not invent fields, options, readiness, materials, or prices. It must not force the accepted application back to an older frame. UI20 direction or a Figma class is not page-level Owner acceptance of every WorkOS page.

## WorkOS UI design roundtrip

For an existing accepted surface, the standard method is:

```text
PRODUCT / DOMAIN CONTRACT
→ CURSOR FUNCTIONAL IMPLEMENTATION
→ RUNTIME + TESTS + BROWSER EVIDENCE
→ CHATGPT INDEPENDENT REVIEW
→ RUNTIME / SOURCE HTML → FIGMA
→ FIGMA POLISH
→ OWNER / CHATGPT DESIGN REVIEW
→ OWNER_ACCEPTED_DESIGN
→ CURSOR DESIGN-DELTA IMPLEMENTATION
→ RUNTIME PARITY
→ CURRENT_VALID_MIRROR
```

Cursor owns the real behavior: fields, allowed values, requiredness, validation, readiness, calculations, persistence, Product Truth, permissions, lifecycle and snapshots.

Figma polish is not a global redesign license.

```text
FIGMA_CAN_POLISH_LAYOUT = WITHIN_AUTHORIZED_MUTABLE_REGIONS_FOR_PROTECTED_SURFACES
```

Figma must not silently change Product Truth or other domain semantics. Any Figma delta that adds/removes fields, changes allowed values, requiredness, validation, readiness, formulas, pricing, permissions, lifecycle or execution semantics returns to Owner/domain review before implementation.

For a major new surface whose layout/floorplan is not yet decided, use:

```text
RESEARCH
→ FIGMA DIRECTION CANDIDATE
→ OWNER DIRECTION ACCEPTANCE
→ CURSOR IMPLEMENTATION
→ RUNTIME PROOF
→ PARITY REVIEW
→ REGISTRY UPDATE
```

Do not refresh Figma after every small code change. Refresh after a coherent UI slice is functionally stable.

## Protected region law

WorkOS permanently distinguishes an existing accepted surface from a new or unaccepted surface.

```text
EXISTING_ACCEPTED_SURFACE
NEW_OR_UNACCEPTED_SURFACE
```

### EXISTING_ACCEPTED_SURFACE

A surface is protected when a living canon or an explicit Owner decision has frozen or accepted its framework. The exact protected set is surface-specific and must come from that surface's living canon.

Typical framework-level regions, when that canon names them, include: global shell, branding/logo, global navigation, organization/account area, page canvas, page header, L2 / scope navigation, page padding, main floorplan, column geometry, outer panel/container grammar, footer/CTA grammar, responsive ordering, shared tokens, and field grammar.

For a protected surface, Figma may not globally redesign the page. Polish is limited to the explicitly mutable content slots of that surface.

Configurator V1 is an existing accepted surface. Its frozen regions are named by `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md` and include:

```text
GLOBAL SHELL
PAGE CANVAS
PAGE HEADER
SCOPE RAIL
740fr / 580fr desktop floorplan
768 Editor-before-Blueprint law
BLUEPRINT outer container
FOCUSED EDITOR outer container
EDITOR footer / CTA grammar
existing global token system
existing field grammar
```

Configurator V1 mutable content slots:

```text
BLUEPRINT facts / content
EDITOR fields / values
progressive disclosure inside Editor
field-specific control interiors
catalog-color control interior
catalog-roll control interior
Review facts
field validation presentation
```

New fields or catalog controls are content. They do not reopen the page framework.

### NEW_OR_UNACCEPTED_SURFACE

When a surface has no accepted or frozen framework, Figma may explore floorplan, layout, hierarchy, responsive composition, panel organization, and control presentation, subject to Product Truth, domain semantics, accessibility, and Owner direction.

Once the Owner accepts that framework, later incremental work treats it as an existing accepted surface.

### Figma polish boundary

On a protected surface, authorized polish inside mutable slots may include spacing, typography, hierarchy, density, alignment, grouping, control interior, field layout inside the Editor body, and responsive behavior inside the slot.

It must not change protected outer geometry.

On a new or unaccepted surface, the same presentation verbs may apply to the undecided floorplan until Owner acceptance.

### Owner reopen law

A protected framework may change only through an explicit Owner decision:

```text
OWNER_REOPEN_UI_FRAMEWORK = YES
```

The decision must name the surface, the protected region(s) reopened, the purpose, and the scope.

`polish this page`, `make it nicer`, or `send it through Figma` does not reopen protected regions.

### Design-delta classification

For every Figma → Cursor roundtrip on a protected surface, Cursor must classify material differences as:

```text
MUTABLE_PRESENTATION_DELTA
PROTECTED_REGION_DELTA
SEMANTIC_DELTA
PRODUCT_TRUTH_DELTA
```

```text
MUTABLE_PRESENTATION_DELTA   = allowed in an authorized UI polish wave
PROTECTED_REGION_DELTA       = forbidden without OWNER_REOPEN_UI_FRAMEWORK = YES
SEMANTIC_DELTA               = never visual-only authority
PRODUCT_TRUTH_DELTA          = never visual-only authority
```

Finer presentation labels (`LAYOUT`, `SPACING`, `TYPOGRAPHY`, `CONTROL_PRESENTATION`, `RESPONSIVE`, `ACCESSIBILITY`) remain useful notes. They do not override this four-way classification and are not a license to rebuild a frozen floorplan.

### Figma ↔ runtime registry

Every canonical Figma frame/state must be tracked in:

`docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md`

That registry records the exact runtime/Figma relationship and lifecycle status. Do not rely on remembered node ids from chat.

## Classification

| Class | Meaning |
|---|---|
| VISUAL_AUTHORITY | Current recorded visual / interaction grammar for a named surface, only when a living canon assigns this class |
| ACCEPTED_BASELINE_REFERENCE | Accepted design start. Later Owner-accepted implementation refinements win. Not current implementation visual authority |
| INTERACTION_REFERENCE_ONLY | Motion or click grammar. Not static visual authority. Not Product Truth |
| HISTORICAL | Accepted earlier, superseded for living direction |
| ARCHIVE | Kept as evidence. Do not implement from it |

## Current recorded references

Verified against the repository on this slice. Live MCP reads are recorded separately.

### Configurator V1 — ACCEPTED_BASELINE_REFERENCE

Repository: `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md`

```text
FIGMA_FILE                           = hu6gJrm0KM2NPkaIpQ8Kfo
FIGMA_SECTION                        = 219:3
CLASS                                = ACCEPTED_BASELINE_REFERENCE
CURRENT_IMPLEMENTED_UI_AUTHORITY     = APPLICATION_ON_MAIN
FORCE_SYNC_APP_TO_FIGMA              = NO
URL                                  = https://www.figma.com/design/hu6gJrm0KM2NPkaIpQ8Kfo?node-id=219-3
LIVE_MCP_READ_2026_09_15             = YES
LIVE_SECTION_NAME                    = FINAL CONFIGURATOR — OWNER REVIEW CANDIDATE
```

Section `219:3` is the accepted design baseline / reference for Configurator V1. The Configurator was derived from that section; later UI/UX refinements were accepted in the implemented application. Present Configurator UI/UX authority is the current implementation on `origin/main`. The frozen V1 framework is the documented guardrail of that implementation. Archive `219:2` remains historical. Do not force the application back to `219:3` because the accepted implementation differs from that frame.

### Configurator Make file — INTERACTION_REFERENCE_ONLY

Repository: `docs/worklog/WORKOS_CONFIGURATOR_FINAL_FIGMA_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md`

```text
MAKE_FILE                      = OqSF7nXn1SMjh6fQiua9HP
MAKE_NAME                      = App Builder
MAKE_ROLE                      = INTERACTION_REFERENCE_ONLY
LIVE_MCP_READ_THIS_RUN         = NOT_REVERIFIED
```

Figma MCP `get_metadata` does not support Make files. Do not copy Make synthetic data, COMUN / groups / logo, or hardcoded product values.

### UI20 E2E file — VISUAL_AUTHORITY for UI20 direction only

Repository: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` (`NEW_FIGMA_FILE_KEY`) and living roadmap `NEW_FIGMA`

```text
FIGMA_FILE                     = 0XP0yGa1siWQdTTL7ou8xz
CLASS                          = VISUAL_AUTHORITY
OWNS                           = UI20_DIRECTION_AND_REFERENCE
PAGE_LEVEL_OWNER_ACCEPTANCE    = NOT_IMPLIED
URL                            = https://www.figma.com/design/0XP0yGa1siWQdTTL7ou8xz
LIVE_MCP_READ_2026_09_15       = YES
LIVE_TOP_LEVEL_PAGE            = 547:11 00 — WORKOS ZERO-BASE CANONICAL HANDOFF V1
```

This is UI20 visual direction, not Configurator Product Truth, and not a second roadmap. It does not Owner-accept other WorkOS pages. Other pages are not rejected; they are not Owner-approved merely because they exist in the application, in Figma, or under UI20. At the current checkpoint, the only Owner-approved current UI/UX surface is the implemented Configurator.

### First HF / IA file — HISTORICAL

```text
FIGMA_FILE                     = 7elwvIscvMPDiEHrX4f6kQ
CLASS                          = HISTORICAL
CANON_POINTER                  = WORKOS_UI_UX_DIRECTION_CANON FIGMA_FILE_KEY
```

### V3 Clients / Cereri file — HISTORICAL

```text
FIGMA_FILE                     = 1ev5lg7m2Ze1h3Vqmax8ho
CLASS                          = HISTORICAL
```

Accepted V3 Clients / Client Hub / Cereri geometry remains historical evidence. Living presentation direction is UI20.

## When to use Figma MCP

Use a **read-only** Figma MCP call when:

- a current canon names a file/section and the session must confirm that node still exists
- visual comparison against the accepted Configurator `219:3` baseline is material
- Owner visual review needs the live frame, not a remembered id

A difference between the current accepted Configurator implementation and `219:3` is not a defect and is not a reason to revert the application.

Figma read is optional when the work does not touch a recorded Figma class.

Owner visual review is required when a change claims visual acceptance or would reopen a frozen framework.

Product / domain truth overrides mockup content whenever the mockup shows fields, modules, groups, prices, or readiness that current ProductTemplates do not own.

`FIGMA_WRITE` requires an explicit Owner GO. This slice performed no write, no publish, and no new file.

## Code Connect

```text
CODE_CONNECT_STATUS            = NOT_VERIFIED
```

Do not claim Code Connect mappings exist in this repository.

## MCP verification this run

```text
FIGMA_MCP_LIVE_VERIFICATION    = VERIFIED_CONNECTED
FIGMA_WRITE                    = NO
WHOAMI                         = AUTHENTICATED_HANDSHAKE_ONLY
IDENTITIES                     = NOT_RECORDED_HERE
```
