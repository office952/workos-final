# Configurator V1 UI/UX framework

Frozen presentation architecture for `/products/:code` while editing.
This file freezes **UI/UX patterns only**. It does not freeze field inventory or Product Truth.

```text
AUTHORITY                      = CONFIGURATOR_V1_UI_FRAMEWORK
FIGMA_FILE                     = hu6gJrm0KM2NPkaIpQ8Kfo
FIGMA_SECTION                  = 219:3
OWNER_VISUAL_ACCEPTED_LOCAL    = YES
UI_UX_FRAMEWORK_FROZEN_V1      = YES
UI_UX_FRAMEWORK_FREEZE_READY   = YES
FORM_COMPLETENESS_PASS         = NEXT / NOT PART OF THIS FRAMEWORK
FORM_COMPLETENESS_DEFERRED     = YES
NEXT_PROGRAM                   = CONFIGURATOR_FORM_COMPLETENESS
PRODUCT_TRUTH_OWNER            = ProductTemplates / FormSchemas / compileDefinition
```

During FORM COMPLETENESS, do not redesign the floorplan without an explicit Owner reopen.

Future form or product work must reuse these patterns. Do not invent a second Configurator chrome, rail, Blueprint, editor, field, or footer.

## FROZEN V1

- shell
- organization / account identity
- page header
- title → rail spacing
- adaptive real-scope rail
- immutable rail geometry
- content-hug active brackets
- scope completion ✓
- Blueprint
- Blueprint 128 / 12 density
- focused Editor
- Edit → Review → Edit visual continuity
- field visual grammar
- horizontal segmented controls
- required = *
- complete = ✓
- contextual validation
- CTA / footer
- Composition read-only grammar
- 1440 / 1280 two-column law
- 768 Editor-before-Blueprint product configuration
- Composition responsive semantic exception
- zero-layout-shift law
- stable scrollbar
- keyboard / accessibility behavior

## NOT FROZEN

- Product Truth
- field inventory
- product-specific options
- future group / layer contract
- logo
- assembly
- richer ACM contract

## SHELL

UI20 quiet top shell. Configurator pages keep the same L1 destinations.
Content canvas is `#f7f8fa`. Horizontal page pad is `48px` at 1440 / 1280 and `24px` at 768.

Company / account identity lives in the global shell, not in Product Form completeness.

```text
ORGANIZATION            ≠ AUTHENTICATED ACCOUNT ≠ OPERATIONAL OPERATOR
TRIGGER PRIMARY         = session organization short / display name
TRIGGER SECONDARY       = authenticated account email or current account label
LEGAL NAME              = dropdown only, wrap naturally
```

Do not hardcode a company name. Do not invent a person name. Do not fold operator identity into this menu.
Atelier / Execution keep operational operator identity. Office routes stay passive where current session law already supports it.

Dropdown keeps: organization short name, legal company name where available, authenticated account, organization switch when multiple memberships exist, Administrare, Theme, Logout.

## PAGE HEADER

Object context (return · client · inscription) then the compact title row, then the scope rail.

```text
TITLE_TO_SCOPE_RAIL     = 18px
TOKEN                   = --cfg-title-to-rail / CFG_TITLE_TO_SCOPE_RAIL_PX
```

The title row stays compact (`36px`). The token is the gap after that row, not extra chrome around the whole header.
Status is compiler progress (`N din M module validate` or `Configurare completă`).
No orange `INCOMPLET` badge.

## SCOPE RAIL

Render **only real supported scopes**. Never invent PANOU ACM, ANSAMBLARE, COMUN, GRĂDINIȚA, PRICHINDEL, or LOGO to fill the line.

```text
4 real scopes  = distributed   Figma 4-slot datum
3 real scopes  = proportional  compact cluster, 48px gap
2 real scopes  = group         compact cluster, 40px gap
```

Current LETTERS and ACM runtimes have two scopes, so they use `group`.

Final accepted bracket law:

```text
INCOMPLETE
[  PANOU ACM  ]
[  LITERE  ]
[  COMPOZIȚIE  ]

COMPLETE
[  PANOU ACM  ✓  ]
[  LITERE  ✓  ]
[  COMPOZIȚIE  ✓  ]
```

The bracket hugs visible content. `✓` appears next to the label only when that scope is complete. Outer item geometry still reserves the completion width so labels, item `x` / center, the next scope, and the 40px two-scope gap do not move.

`✓` uses the same Blueprint completion token (`--cfg-brand-mark`, accessible name `Complet`).
Product scope is complete only from that product's `compileDefinition` / ProductDefinition truth.
Composition is complete only when every real contributing scope is complete.
Today that means `LITERE ✓ → COMPOZIȚIE ✓` and `PANOU ACM ✓ → COMPOZIȚIE ✓`.
Future composite (PANOU ACM + LITERE + ANSAMBLARE) must keep the same AND rule. Do not invent those scopes now.
No frontend readiness calculator. No badge / pill / circle decoration.

Do not distribute two items across the full page width.
Preserve local brackets, active tick, full-width rule, IBM Plex Mono 11px, keyboard tab order, and 44px targets.

Scope anchors are immutable. Active brackets are layout-neutral pseudo-elements. Active, hover, focus, and font color must not change label `x`, item `x` / center, next-scope `x`, rail-group `x`, or the 40px two-scope gap. Only the decorative bracket right edge may expand or contract to hug visible content. Do not hardcode LETTERS vs ACM coordinates.

## BLUEPRINT

Left column. Compact scan: component → label → value.

```text
label column = 128px
column gap   = 12px
```

Values stay next to labels. Do not stretch pairs across the card.
`✓` appears only when that module is complete per `compileDefinition` / current ProductDefinition truth.
`✓` uses `--cfg-brand-mark` (Figma 202:163 mark square). Accessible name is `Complet`.
Missing facts display `NECONFIGURAT`. No orange required furniture.

## FOCUSED EDITOR

Right column. Same card top edge as Blueprint.
Desktop grid is `content = viewport - 96px`, tracks `740fr 580fr`, gap `24px`.
At 768 the Editor stacks above Blueprint. Composition stays Blueprint then Composition because it is review, not configuration.
Changing scope or component must not move panel x/width or page scroll. Use `focus({ preventScroll: true })`. `html:has(.configurator-final)` uses `scrollbar-gutter: stable` and `overflow-anchor: none`. Edit ↔ review retains the current page / content scroll origin.

## EDIT / REVIEW CONTINUITY

`EDIT → VALIDATED REVIEW → EDIT` stays in the same Editor card.
Review keeps the editor title, replaces the lead with `Revizuiește configurația înainte de confirmare.`, and projects the same structured label/value facts from the current Configurator view / `compileDefinition`.
No legacy confirmation heading, narrative dump, or bullet list.
Footer: secondary `Modifică configurația`, primary `Confirmă configurația` at 258×44 right-aligned.
Do not move Blueprint, Editor, rail, or page origin when entering or leaving review.

## SEGMENTED CONTROL

Required selects with options render as an accessible radiogroup of horizontal chips.
The native `<select>` stays synchronized, `aria-hidden`, and out of tab order.

## FIELD

Visual labels may strip role words. Accessible names stay the schema labels.
Number fields may show a unit suffix projected from the schema label.
Do not invent fields or options in the UI.

## REQUIRED STATE

Required = `Label *` plus `required` / `aria-required`.
No orange dots, no `Necesar`, no `NECESAR: Selectează…` before validation.

## COMPLETE STATE

Complete module = Blueprint `✓` / `Complet` from compiler truth only.
Complete product / composition scopes use the same token from the same compiler truth.
The UI must not compute a second completeness rule.

## VALIDATION STATE

Validation appears only after the operator invokes `Verifică configurația`.
Then show contextual `Completează acest câmp.` on compiler-missing fields, plus the existing readiness notice.
Changing a value clears the compile result.

## EDITOR FOOTER / CTA

Quiet incomplete hint: `Completează câmpurile marcate cu *.`
Primary action stays `Verifică configurația`. Behavior is unchanged.

```text
width  = 258px
height = 44px
align  = right
```

At 768 the button stretches to the editor width. Height stays 44px.

## COMPOSITION SUMMARY

`COMPOZIȚIE` is read-only. Edit links return to the real product scope.
No synthetic assembly or multi-product composition.
The composition rail check follows contributing-scope completeness, not a second calculator.

## RESPONSIVE 1440 / 1280 / 768

Same components. 1440 and 1280 keep the 740:580 ratio and the compact rail cluster.
768 stacks Editor above Blueprint. Composition keeps Blueprint above the composition card. Rail stays a compact group.

## ZERO-LAYOUT-SHIFT RULE

```text
SELECT COMPONENT  ≠  SCROLL PAGE
                  ≠  MOVE PANELS
                  ≠  CHANGE COLUMN WIDTHS
                  ≠  SHIFT X/Y
```

No `scrollIntoView` on desktop.

## Out of scope

Do not implement here: missing product fields, richer finish catalog, new measurements, new ACM attributes, group/layer persistence, logo contract, assembly contract.
