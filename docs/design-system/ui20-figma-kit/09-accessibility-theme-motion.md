# 09 — Accessibility, theme, motion

Figma may **show** these. Implementation must **enforce** them. Figma itself does not prove a11y.

## Current a11y truth

| Requirement | Runtime evidence | Figma may show | Implementation must enforce |
|---|---|---|---|
| Visible focus | `:focus-visible` 2px `--focus-ring` offset 2 | Focus ring on components | Never `outline: none` without replacement |
| 44px targets | Global `button` min-height 44; nav, chips, fields, skip-link | 44px ActionDock | Do not ship 32px “compact” variants |
| Keyboard | L1 links/buttons; drawers | Focus order | Tab order = visual order |
| Escape + restore | Comercial/Mai multe (`GlobalNavigation`); mobile drawer; ActionDrawer | Closed panel | Restore to trigger (RW1A) |
| Modal focus trap | ActionDrawer + identify | Raised layer | Trap while open; `inert` on shell when Meniu open |
| Aria naming | `Navigare principală`, panel regions, brand `WorkOS`, `Context obiect` | Visible labels | Accessible name ≠ route title |
| No color-only | Mixed: attention has copy; chips sometimes color-heavy | Edge + text | State copy required for blocked |
| Headings | Page `h1`; section `h2` | Hierarchy | One h1 per page |
| Landmarks | skip-link → `#continut-principal` `main` | — | Keep skip-link |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` zeros animation/transition | End state | End state without hop |
| 200% zoom | Not specially tokenized | Reflow | Per-wave polish, not this GO |
| Long Romanian | Identity wrap, overflow-wrap on jobs/atelier | Wrap | No ellipsis as the only truth |

### Known a11y gap (report only)

`FormRenderer` renders visible `.choice-chip` buttons inside `aria-hidden="true"` while a clipped native `<select>` remains. Chips stay in tab order. **Do not fix in this GO.** RW2 owns it.

`--text` is undefined on nav items (inheritance works). Calibration later.

## Theme

| Choice | How | Visual |
|---|---|---|
| `system` | default; follows `prefers-color-scheme`; no localStorage | Same hierarchy |
| `light` | `data-theme=light` | Cool gray canvas + blue action + green shell accent |
| `dark` | `data-theme=dark` | Charcoal + lighter blue action + `#8fb5a4` shell accent |

Same component tree. Not a second brand.

Figma Ofertă dark (DL1): charcoal root, **light paper children**, dark ink inside paper. Do not charcoal-wash the quote to “finish” dark.

Contrast concern: runtime dark `--action-primary` `#6fa3d0` on `#0f1216` is OK; UI20 identity green dark `#8fb5a4` is shell-only today.

## Motion

Runtime: almost no authored semantic motion. Global reduced-motion kill-switch only. Hardcoded shadows, no duration tokens.

Figma target families (notes only, no JS framework):

| Family | Figma duration (DL1) | Runtime now |
|---|---|---|
| SELECT | 150ms | none |
| RESOLVE | 180ms | none |
| FREEZE | 220ms dissolve | none |
| ENTER_WORK | 200ms | none |
| ADVANCE / COMPLETE | 200ms | none |

Reduced motion = jump to end state. Motion never creates freeze, acceptance, or Lucrare.

## Tests that currently prove shell/theme/a11y (not aspirations)

| File | Proves |
|---|---|
| `AppShell.test.tsx` | Shell mount / skip / reduced chrome |
| `ui/GlobalNavigation.test.tsx` | L1 / panels |
| `ui/MobileNavigationDrawer.test.tsx` | 768 Meniu |
| `ui/IdentityMenu.test.tsx` | Cont |
| `ui/ObjectContextStrip.test.tsx` | Empty vs truthful props |
| `ui/ActionDrawer.test.tsx` | Drawer |
| `theme/ThemeProvider.test.tsx` | light/dark/system |
| `FormRenderer.test.tsx` | Schema fields (not the a11y gap) |
| `e2e/v3-navigation-shell.spec.ts` | Quiet top L1, Mai multe, unknown → Lucrări |

TRACEABILITY_GAP: no dedicated e2e for Cerere Resolution Field or Config Lens (those pages are not implemented).
