# WORKOS_PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION_V1

Visual foundation and three comparable high-fidelity directions for `HUB_MEDIA_CLEAN_PILOT`. Owner accepted direction A with amendments. B and C remain comparative reference. Not the full first lot. Not implementation.

```text
VERDICT                              = PASS
STATUS                               = OWNER_ACCEPTED
OWNER_VISUAL_DIRECTION_DECISION      = ACCEPTED_WITH_AMENDMENTS
PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION = OWNER_ACCEPTED
FINAL_VISUAL_DIRECTION               = A_INDUSTRIAL_CLARITY
VISUAL_DIRECTION_GATE                = CLOSED
DIRECTION_B                          = NOT_SELECTED_REFERENCE_ONLY
DIRECTION_C                          = NOT_SELECTED_REFERENCE_ONLY
FULL_FIRST_HF_LOT                    = NOT_STARTED
HIGH_FIDELITY_DRAWING_REMAINING_LOT  = NOT_STARTED
UI_IMPLEMENTATION                    = NOT_AUTHORIZED
ICONOGRAPHY_CONTRACT                 = OWNER_ACCEPTED
ICONOGRAPHY_COMPONENT_DESIGN         = NOT_STARTED
ICONOGRAPHY_CODE_IMPLEMENTATION      = NOT_AUTHORIZED
PRODUCT_CODE_DIFF                    = NONE
```

## A. Identity

```text
REPO     = office952/workos-final
WORKTREE = C:\Users\offic\workspace\workos-final-pilot-hf-scope
OLD_BRANCH = docs/pilot-high-fidelity-scope-v1
NEW_BRANCH = design/pilot-hf-foundation-visual-direction-v1
BASE     = 201989a5c106e15e525b8d4a2d0ddc6b2a1a1050
REMOTE   = https://github.com/office952/workos-final.git
COMMIT   = YES_IF_PASS
PUSH     = NO
```

```text
ROADMAP_READ       = YES
UI_UX_CANON_READ   = YES
HF_SCOPE_READ      = YES
DIRECTION_CONFLICT = NO
```

No direction conflict: IA stays Owner-accepted; the accepted HF scope stays closed; visual direction A is now Owner-accepted with amendments. The foundation canon still records today’s `Produse` runtime label. Canon remains unimplemented-presentation law until a later scoped UI GO. This file does not start the first HF lot.

## B. Sources

Read before writing:

- `AGENTS.md`
- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md`
- `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md`
- `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_SCOPE_DEFINITION_V1.md`
- `apps/web/src/App.tsx` routes
- Figma `7elwvIscvMPDiEHrX4f6kQ` pages 00–09

Closed IA, not reopened:

```text
GLOBAL_NAV       = Lucrări | Atelier | Comercial | Catalog | Administrare
NAV_STRUCTURE    = TOP_NAV
LEVEL_2          = CONTEXTUAL_ONLY
CATALOG          = COMMERCIAL_CATALOG
CONFIGUREAZĂ     = CONTEXTUAL_ACTION
PRODUCT_SYSTEM   = ADMINISTRARE
DENSITY          = INTERMEDIATE
DETAIL           = STABLE_PAGE
COLLECTIONS      = SEARCH + FILTERS + LIST/DETAIL
LANGUAGE         = ROMANIAN_OPERATOR_UI
THEMES           = LIGHT + DARK + SYSTEM
```

Existing Figma IA structural variables and pages 00–09 were left unchanged. Material 3 and Simple Design System libraries are subscribed on the file; they were not used. Local candidate components keep WorkOS from inheriting a generic kit skin.

## C. Figma

```text
FILE     = https://www.figma.com/design/7elwvIscvMPDiEHrX4f6kQ
PAGE_10  = 10 — HF Visual Foundation   (28:2)
PAGE_11  = 11 — Visual Direction Review (28:3)
```

### Variables

| Collection | Modes | Role |
| --- | --- | --- |
| WorkOS HF / Primitives | Value | Raw colors, hidden scopes |
| WorkOS HF / Space | Value | 4–32 plus 44 touch and 3px focus |
| WorkOS HF / Radius | Value | A=6, B=12, C=3 |
| WorkOS HF / Semantic Proposed | Light, Dark | Foundation candidate = direction A |
| WorkOS HF / Semantic B Warmth | Light, Dark | Comparative |
| WorkOS HF / Semantic C Control | Light, Dark | Comparative |

```text
SYSTEM = follow OS unless the user saved an explicit override
```

No third visual set. LIGHT and DARK are the only Figma color modes.

Semantic names (same in A/B/C): `surface/canvas`, `surface/primary`, `surface/elevated`, `surface/selected`, `text/primary`, `text/secondary`, `text/muted`, `border/subtle`, `border/strong`, `action/primary`, `action/primary-hover`, `action/secondary`, `action/on-primary`, `focus/ring`, `status/info`, `status/success`, `status/warning`, `status/danger`, `status/blocked`.

### Typography

IBM Plex Sans + IBM Plex Mono. Realistic web fonts. Foundation / A styles: Display 28/36, Section 18/24, Body 14/20, Label 12/16, Metadata 12/16, Table 13/18, Numeric tabular 13/18. B uses a more generous ramp (Display 32/40, Body 15/22). C uses a denser ramp (Display 22/28, Body 13/16) and Mono on numbers, status, and utility values.

### Candidate components (page 10)

Not a production library. `CODE_MAPPING = NOT_STARTED`.

Top navigation; Level 2 contextual; page header; Button set (Primary/Secondary/Danger/Quiet × Default/Hover/Focus/Active/Disabled); text input Default/Focus/Error/Disabled; select; search; tabs; status badges; blocked alert; table row; empty state; drawer; dialog; pagination; task action bar; list/detail shell; compact 768 nav.

### Comparable screens (page 11)

Same content, IA, and states on A/B/C:

| Direction | Lucrări 1280 L | Lucrări 1280 D | Catalog 1280 L | Catalog 1280 D | Execuție 1280 L | Execuție 1280 D | Lucrări 768 L |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | `32:24` | `34:66` | `32:121` | `34:160` | `33:2` | `34:204` | `34:2` |
| B | `46:29` | `46:147` | `47:2` | `47:46` | `47:90` | `47:263` | `47:436` |
| C | `52:2` | `52:134` | `50:2` | `50:52` | `50:102` | `50:265` | `50:428` |

```text
FRAME_COUNT                   = 21
SAME_CONTENT                  = YES
A_B_C_MATERIALLY_DISTINCT     = YES
DISTINGUISHABLE_IN_GRAYSCALE  = YES
LIGHT_PROOF                   = PASS
DARK_PROOF                    = PASS
RESPONSIVE_768_PROOF          = YES
SCORECARD                     = 51:24
CONTRAST_BOARD                = 51:2
NON_COLOR_DIFFS               = 51:14
FOUNDATION_PAGE               = 28:2
```

Required review nodes:

- A Lucrări LIGHT 1280 `32:24`
- B Lucrări LIGHT 1280 `46:29`
- C Lucrări LIGHT 1280 `52:2`
- A Execuție LIGHT 1280 `33:2`
- B Execuție LIGHT 1280 `47:90`
- C Execuție LIGHT 1280 `50:102`
- A Lucrări LIGHT 768 `34:2`
- B Lucrări LIGHT 768 `47:436`
- C Lucrări LIGHT 768 `50:428`
- Foundation page `28:2`
- Scorecard `51:24`

Direct Lucrări populated LIGHT 1280 links:

- A: https://www.figma.com/design/7elwvIscvMPDiEHrX4f6kQ?node-id=32-24
- B: https://www.figma.com/design/7elwvIscvMPDiEHrX4f6kQ?node-id=46-29
- C: https://www.figma.com/design/7elwvIscvMPDiEHrX4f6kQ?node-id=52-2

## D. Synthetic fixture

Romanian operational fiction. No real names, emails, HUB MEDIA data, PINs, Cloud IDs, local paths, hashes, bank or legal values.

- Org: Atelier Demo
- Operator: Operator 01
- Jobs: Hotel Nord, Atelier Luna, Clinică Est, Magazin Valea, Școală Centrală
- Catalog: Litere volumetrice față luminoasă; Panou ACM casetat
- Execution: Hotel Nord blocked on Debitare CNC față; planned-vs-actual shows planned 18.40 m / 2.4 h / 382.50 and empty actuals
- PIN field in the dialog candidate shows only bullets

## E. Execution machine-blocked proof

The execution screen shows the job, the 12-operation plan, the current blocked task, the missing CNC-față capability in operator language, what the operator can do (read plan, open job) and cannot do (start), planned-vs-actual, one primary action (`Deschide lucrarea`), and status as text + icon + color. No invented `/jobs/:id`. No debug IDs as hero language.

## F. Responsive 768

Compact top bar keeps all five domains on one row (Administrare shortened to `Admin.`). A 44px `Cont` control sits on the first row, separate from Level 1. A utility strip under it keeps Organizație (Atelier Demo), Utilizator (Operator 01), Temă (LIGHT), and Ieșire reachable. List-first; detail would open as a full page. Primary action remains a 44px control. Not a phone rewrite.

```text
UTILITY_ACTIONS_768_REACHABLE = YES
GLOBAL_DOMAINS_768_REACHABLE  = YES
```

## G. Accessibility

Designed, not certified:

- skip link
- banner / navigation / main landmarks by name
- one `h1` per screen
- persistent labels
- error next to the field
- status not color-only
- focus ring 3px on focus variants
- 44px operational targets
- distinct hover / focus / active / disabled
- reduced motion noted as “no animation as the only signal”

Contrast is measured from resolved RGB after modes, formula `(L1+0.05)/(L2+0.05)`, and displayed on page 10 (`51:2`). AA normal ≥ 4.5; AA large ≥ 3. Two tokens failed first measurement and were corrected before scorecard: B DARK `text/muted` 3.33 → 7.02; C LIGHT `text/muted` 4.17 → 6.16. After correction every listed pair PASSes AA normal and AA large.

```text
CONTRAST_MEASURED = YES
AA_NORMAL_TEXT    = PASS  (all listed pairs, all directions, LIGHT and DARK)
AA_LARGE_TEXT     = PASS
CONTRAST_FAILURES = 0
```

## H. Scorecard

Rebuilt after Owner `CHANGES_REQUIRED`. Measured facts stay separate from design judgment. Visible on page 11 (`51:24`).

### Măsurat

| Fact | A | B | C |
| --- | --- | --- | --- |
| Contrast AA normal / large | PASS / PASS | PASS / PASS | PASS / PASS |
| Touch operational 44px | PASS | PASS | PASS |
| Navigation levels | 2 | 2 | 2 |
| Visible jobs at 1280 Lucrări | 5 table rows ~52 | 5 grouped cards | 5 ruled rows + rail |
| Text overflow / clip | 0 | 0 | 0 |
| Viewport coverage | 1280 + 768 | 1280 + 768 | 1280 + 768 |

### Evaluare de design — nu e laborator

| Criterion | A | B | C | Why |
| --- | ---: | ---: | ---: | --- |
| Claritate | 5 | 4 | 5 | A grid is immediate; B is more human, slower scan; C scans fast and colder |
| Caracter | 3 | 5 | 4 | A is stable; B is grayscale-obvious via cards/shadow; C is technical, not A in teal |
| Risc generic | 4 | 5 | 5 | B grouping + shadow and C density avoid kit SaaS |
| Atelier | 4 | 5 | 3 | B is warm workshop; C is console-like |
| Maturitate | 5 | 4 | 4 | A is easiest to hold; B needs card components; C needs table discipline |
| Încredere | 5 | 4 | 4 | A is calm; B Dark muted was corrected; C can feel harsh |
| Scalabilitate | 5 | 3 | 5 | B cards eat vertical space; A/C tables scale |

```text
EVIDENCE_RECOMMENDATION = A
OWNER_DECISION          = ACCEPTED_WITH_AMENDMENTS
FINAL_SELECTION         = A_INDUSTRIAL_CLARITY
```

Owner accepted A for clarity, operational density, scalability, readability, and implementation feasibility. B and C stay on page 11 as reference only. This file does not start the first HF lot.

## Material differentiation (Owner CHANGES_REQUIRED)

Owner rejected the first package: A/B/C were the same UI in three palettes. B and C were rebuilt structurally. IA, routes, content, states, actions, top nav, Level 2, INTERMEDIATE density band, LIGHT/DARK, and viewports stayed the same.

### A — Industrial Clarity

Precise table, cool neutrals, steel accent, flat, radius 6, hairline row rules, ~52px rows, 8px status dots, one full primary button, kv planned-vs-actual with wrapping labels.

### B — Workshop Warmth

Not A in brown. Generous type, card groups with gap, radius 12, drop shadow instead of continuous rules, pill nav, status and action inside each group, rounded-square marks, two human stacks Planificat / Măsurat, warm Dark with measured contrast.

### C — Technical Control

Not A in teal. Denser type, radius 3, 2px nav + column rules, left status rail, Mono on numbers/status/utility, compact actions, Plan \| Real metric grid, scan-first hierarchy.

Non-color differences (also on page 11 `51:14`):

| Pair | Count | Examples |
| --- | ---: | --- |
| A ↔ B | 11 | TYPOGRAPHY 28/14 vs 32/15; SPACING 16 vs 20 + card gap; DENSITY table vs card; SHAPE 6 vs 12; BORDER_OR_ELEVATION hairline vs shadow; NAV text vs pill; ROW table vs card; STATUS dot vs well; ACTION column vs in-group; ICON circle vs square mark; DATA kv vs two stacks |
| A ↔ C | 11 | TYPOGRAPHY 28/14 vs 22/13+Mono; SPACING 16 vs 8; DENSITY intermediate vs scan; SHAPE 6 vs 3; BORDER_OR_ELEVATION hairline vs column rules; NAV text vs 3px rail; ROW stacked cell vs true columns; STATUS dot vs rail+square; ACTION 6 vs 3; ICON circle vs rail; DATA kv vs Plan\|Real grid |
| B ↔ C | 11 | Generous vs dense type; card gap vs 0-gap; human vs scan density; 12 vs 3; shadow vs hard border; pill vs rail; card vs columns; well vs rail; in-group vs compact; expressive vs technical icons; two stacks vs metric grid |

```text
A_B_NON_COLOR_DIFFERENCES >= 5
A_C_NON_COLOR_DIFFERENCES >= 5
B_C_NON_COLOR_DIFFERENCES >= 5
DISTINGUISHABLE_IN_GRAYSCALE = YES
```

### Defects fixed

```text
PLAN_VS_REAL_OVERFLOW         = FIXED
UTILITY_ACTIONS_768_REACHABLE = YES
GLOBAL_DOMAINS_768_REACHABLE  = YES
COPY_ZERO_TO_O                = YES
FOUNDATION_SWATCHES_CLEAN     = YES
TYPE_RAMP_CLIPPING            = NO
COMPONENT_BOARD_READABLE      = YES
TEXT_OVERFLOW                 = 0
TEXT_CLIPPING                 = 0
```

- PvA labels wrap (`textAutoResize = HEIGHT` + FILL). Footer no longer exceeds the 320 panel. A keeps aligned kv; B uses Planificat / Măsurat stacks; C uses a Plan \| Real grid. No hashes or DTO names.
- 768 utility: `Cont` plus Organizație / Utilizator / Temă / Ieșire, separate from Level 1. Five domains stay on one row.
- Copy is `O singură acțiune principală` on all six Execuție frames (letter O, not digit 0).
- Page 10: DARK swatch column uses Dark mode labels; unbound white row fills cleared; type ramp wraps; components sit on an explicit canvas board (`42:2`).

## Owner acceptance (ACCEPTED_WITH_AMENDMENTS)

Recorded after targeted A corrections. B and C were not redesigned.

```text
OWNER_VISUAL_DIRECTION_DECISION = ACCEPTED_WITH_AMENDMENTS
FINAL_VISUAL_DIRECTION          = A_INDUSTRIAL_CLARITY
VISUAL_DIRECTION_GATE           = CLOSED
DIRECTION_B                     = NOT_SELECTED_REFERENCE_ONLY
DIRECTION_C                     = NOT_SELECTED_REFERENCE_ONLY
COPY_ZERO_INSTEAD_OF_O          = 0
A_DARK_SURFACE_DEFECT           = FIXED
UNBOUND_LIGHT_FILL_IN_DARK      = 0
CONTRAST_FAILURES               = 0
OVERFLOW                        = 0
TEXT_CLIPPING                   = 0
```

Amendments applied on accepted A, not a hybrid:

- Execution copy is exactly `O singură acțiune principală`. First character code 79 (`O`). Confirmed on LIGHT `33:119` and DARK `34:321` at 16px SemiBold, including a 4× screenshot. Operation numbers `01`–`09` remain digits.
- A DARK Plan versus real rows `45:28`–`45:43` no longer use unbound white fills. Fills bind `surface/primary` (resolved `[23,28,35]`). Hairline `border/subtle` separates rows without relying on color alone. LIGHT rows bind the same tokens. Contrast on the DARK row surface: primary 15.52, secondary 10.36, muted 5.58 — all AA PASS.
- Figma pages 10–11 now record the closed gate. B/C screens remain in place with reference labels.

## Iconography contract (OWNER_ACCEPTED)

Recorded on Figma page 10 only, compact board `61:2` (`10 / WorkOS Iconography Foundation`). Page 11 and pages 00–09 were not edited. No icons were drawn. No icon components were created. No plugin was installed. No product dependency was added.

```text
ICONOGRAPHY_CONTRACT            = OWNER_ACCEPTED
ICONOGRAPHY_COMPONENT_DESIGN    = NOT_STARTED
ICONOGRAPHY_CODE_IMPLEMENTATION = NOT_AUTHORIZED
BASE_ICON_LIBRARY               = LUCIDE
GENERIC_ACTIONS                 = LUCIDE
DOMAIN_SPECIFIC_ICONS           = WORKOS_CUSTOM
CUSTOM_WORKOS_ICONS             = YES
CUSTOM_ALL_ICONS                = NO
ICON_STYLE                      = INDUSTRIAL_CLARITY
ICON_FORMAT                     = SVG + FIGMA_COMPONENT + REACT_COMPONENT
ICON_FONT                       = NO
MULTIPLE_MIXED_LIBRARIES        = NO
V1_CUSTOM_ICON_BUDGET           = 12_TO_20
ICONIFY                         = RESEARCH_ONLY_NOT_INSTALLED
ICONOGRAPHY_DESIGN              = NOT_STARTED
PLUGIN_INSTALLATION             = NONE
```

Accepted rules (later design; not drawn here):

```text
CANVAS              = 24 × 24
STROKE              = 2 px
FILL                = NONE_BY_DEFAULT
CAPS                = ROUND
JOINS               = ROUND
COLOR               = currentColor / semantic token
SIZES               = 16 | 20 | 24
MIN_TOUCH_TARGET    = 44 × 44
LIGHT_DARK_GEOMETRY = SAME
CRITICAL_MEANING    = ICON_PLUS_TEXT
```

Proposed V1 custom categories, names only: CNC router; CNC laser; modelare tablă; plotter; laminator; rolă material; coală/placă; Plexiglas; ACM/Alucobond; modul LED; literă volumetrică; casetă luminoasă; masă de asamblare; atelier; montaj; ambalare; plan de execuție; Planificat versus Real; utilaj lipsă; lucrare blocată.

Lucide is the only base library. Custom icons cover WorkOS domain concepts only. This record does not start the first HF lot and does not authorize React/CSS.

## I. Review

Re-run after material differentiation. P0/P1 block amend.

| Lens | Result |
| --- | --- |
| Visual design | PASS — A/B/C now differ by shape, density, grouping, not only hue |
| Grayscale differentiation | PASS — cards+shadow vs table+dots vs columns+rail survive without color |
| IA/UX | PASS — Catalog, top nav, contextual Configurează, no sixth domain, same information order |
| Operator workflow | PASS — next action on the row; blocked execution is honest; one primary action |
| Accessibility / contrast | PASS as designed proof, not certified; contrast measured and displayed |
| Theme/tokens | PASS — semantic LIGHT/DARK; SYSTEM documented; two muted tokens corrected |
| Responsive | PASS as 768 proof with Cont + utility; mobile deferred |
| Implementation feasibility | PASS — IBM Plex, semantic tokens, no kit lock-in; A still cheapest |
| Scope guardian | PASS — pages 00–09 untouched; only this worklog + roadmap in repo; no React/CSS |
| Adversarial | PASS — no invented job URL; A accepted without starting the lot; B/C kept as reference; no Cloud write |
| Privacy | PASS — synthetic fixture only |

P0/P1 found and fixed before amend:

1. A/B/C were palette clones. B rebuilt as grouped cards; C rebuilt as a technical table with rails and Mono.
2. Plan versus real footer overflowed the 320 panel. Rebuilt with wrapping text.
3. 768 dropped org / user / logout. Added `Cont` + utility strip.
4. B DARK muted and C LIGHT muted failed AA normal. Tokens corrected and remeasured.
5. Page 10 type ramp used WIDTH_AND_HEIGHT and clipped. Wrapped to HEIGHT. Components moved onto an explicit canvas board.
6. Scorecard height was locked to 10px after rebuild. Set to hug content.
7. Raising B/C actions to 44px clipped the last B Lucrări card and B Exec action bar. Frame heights increased until overflow = 0.

Advisories (non-blocking):

- Button / input candidates sit on page 10; screens were composed with the same tokens rather than every control being an instance, so later drawing should promote instances.
- B Lucrări 1280 is 880 tall and B Exec is 960 tall so 44px actions fit. Viewport width stays 1280; this is not a new breakpoint.
- C 768 stays list-first (same IA as A/B) and uses rails + 3px radius rather than a desktop table.
- Execution lists 12 operator-facing operations as synthetic plan truth, not compiler IDs.
- Material 3 / SDS remain subscribed and unused; do not drop them into later screens.

## J. Stop

```text
FULL_FIRST_HF_LOT     = NOT_STARTED
UI_IMPLEMENTATION     = NOT_AUTHORIZED
ICONOGRAPHY_CONTRACT  = OWNER_ACCEPTED
ICONOGRAPHY_DESIGN    = NOT_STARTED
FIGMA_PAGES_00_09     = UNCHANGED
FIGMA_PAGE_11         = UNCHANGED
REAL_CLOUD_ROOT       = UNTOUCHED
NEXT_STEP             = FIRST_HF_LOT_SCREEN_DESIGN
```
