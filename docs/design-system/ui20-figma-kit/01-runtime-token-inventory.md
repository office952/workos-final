# 01 — Runtime token inventory

Source of values: `apps/web/src/index.css` (`:root` / `:root[data-theme="light"]` and `:root[data-theme="dark"]`).  
Theme application: `apps/web/index.html` boot script + `apps/web/src/theme/ThemeProvider.tsx` (`data-theme`, `data-theme-choice`, `localStorage` key `workos.theme`).

Do not invent values. Figma hex from DL1/VIS1 is **target direction**, not current runtime.

## Classification key

| STATUS | Meaning |
|---|---|
| KEEP | Honest runtime token; keep name/value unless later calibration GO |
| KEEP_LEGACY_ONLY | Needed by V3 page bodies; do not promote as UI20 identity |
| CALIBRATE | Runtime exists; UI20 semantic role differs (esp. green vs blue) |
| RENAME_LATER | Alias or leftover name; do not rename in this GO |
| UI20_NEW_NEEDED | Semantic role accepted in Figma; no honest runtime token |
| DEPRECATE_LATER | Sidebar / mixed-IA leftovers after later waves |

## Surfaces / text / line / action

| CURRENT_NAME | LIGHT_VALUE | DARK_VALUE | CURRENT_USAGE | UI20_SEMANTIC_ROLE | STATUS |
|---|---|---|---|---|---|
| `--surface-canvas` | `#f3f5f7` | `#0f1216` | `html`/body canvas | App canvas | CALIBRATE (Figma canvas `#f4f3f0` / `#1c1d1f`) |
| `--surface-primary` | `#ffffff` | `#171c23` | Work surfaces, forms, shell | Work surface / paper | CALIBRATE |
| `--surface-elevated` | `#ffffff` | `#1d242e` | Drawers, identity panel, raised rows | Raised temporary / raised work | KEEP |
| `--surface-selected` | `#e8eef4` | `#2a3442` | Selected rows, pressed theme, current nav (legacy) | Selected / current wash | CALIBRATE (cool blue wash) |
| `--text-primary` | `#161b22` | `#f1f4f8` | Body ink | Ink | CALIBRATE |
| `--text-secondary` | `#3d4754` | `#c3cad3` | Meta, secondary copy | Secondary ink | KEEP |
| `--text-muted` | `#66707d` | `#8b94a1` | Labels, idle meta | Muted | KEEP |
| `--border-subtle` | `#d8dee6` | `#2c3542` | Default hairline | Line / divider | CALIBRATE |
| `--border-strong` | `#b7c0cb` | `#3d4a5a` | Selected chip/row border | Strong line | KEEP |
| `--action-primary` | `#1e4d73` | `#6fa3d0` | Default `button`, links, skip-link, V3 primary | Legacy V3 action blue | KEEP_LEGACY_ONLY |
| `--action-primary-hover` | `#163a57` | `#8bb6db` | Hover companion | Legacy V3 | KEEP_LEGACY_ONLY |
| `--action-secondary` | `#e8eef4` | `#2a3442` | Theme buttons, choice chips | Neutral control fill | CALIBRATE |
| `--action-on-primary` | `#ffffff` | `#0f1216` | Text on primary fill | On-primary | KEEP |
| `--focus-ring` | `#1e4d73` | `#6fa3d0` | `:focus-visible` 2px | Focus | CALIBRATE (DL1 wants ink, not blue) |
| `--ui20-shell-accent` | `#1f332e` | `#8fb5a4` | L1 underline / inset current; scoped shell only | Deep green identity / constructive selected | KEEP |
| `--status-info` | `#1e4d73` | `#6fa3d0` | Info (same as legacy blue) | Info | KEEP_LEGACY_ONLY |
| `--status-success` | `#2c6b45` | `#7dbe96` | Success chips, ok tone | Success | CALIBRATE (do not become identity green) |
| `--status-warning` | `#9a3412` | `#f0a06a` | Field error, attention | Warning / terracotta family | CALIBRATE |
| `--status-danger` | `#8a3b2e` | `#e08b7d` | Danger button, bad text | Error / destructive | KEEP |
| `--status-blocked` | `#9a3412` | `#f0a06a` | Blocked card border | Blocked / consequence | CALIBRATE |
| `--overlay` | `rgba(18,22,28,0.45)` | `rgba(6,8,11,0.62)` | Drawer/modal scrim | Overlay | KEEP |
| `--status-neutral` | `var(--surface-selected)` | inherits | Default chip | Neutral chip wash | KEEP_LEGACY_ONLY |
| `--status-progress` | `#dce8f2` | `#243140` | Progress chip | In-progress wash | KEEP_LEGACY_ONLY |
| `--status-done` | `var(--surface-selected)` | inherits | Done chip | Completed wash | KEEP_LEGACY_ONLY |
| `--status-warn` | `#f6ece8` | `#3a2a22` | Warn chip / blocked card fill | Warning wash | KEEP |
| `--status-ok` | `#e7f0ea` | `#1f3228` | Ok chip | Success wash | KEEP |

## Aliases (same computed values)

| CURRENT_NAME | POINTS TO | STATUS |
|---|---|---|
| `--bg` | `--surface-canvas` | RENAME_LATER |
| `--surface` | `--surface-primary` | KEEP |
| `--surface-raised` | `--surface-elevated` | KEEP |
| `--ink` | `--text-primary` | KEEP |
| `--muted` | `--text-muted` | KEEP |
| `--line` | `--border-subtle` | KEEP |
| `--border` | `--border-subtle` | RENAME_LATER |
| `--accent` | `--action-primary` (legacy blue) | KEEP_LEGACY_ONLY — do not remap globally |
| `--ok` | `--status-success` | KEEP |
| `--bad` | `--status-danger` | KEEP |

## Spacing / radius / shell locals

| CURRENT_NAME | VALUE | USAGE | STATUS |
|---|---|---|---|
| `--space-1` | `0.25rem` | Tight gaps | KEEP |
| `--space-2` | `0.5rem` | Compact | KEEP |
| `--space-3` | `0.75rem` | Default section-ish | KEEP |
| `--space-4` | `1rem` | Page header / confirmed | KEEP |
| `--space-5` | `1.5rem` | Admin groups | KEEP |
| `--radius-s` | `0.25rem` | Buttons, fields, many rows | KEEP |
| `--radius-m` | `0.375rem` | Notices, chips, some cards | KEEP |
| `--ui20-shell-height` | `3rem` | Top shell row | KEEP |
| `--ui20-shell-gap` | `0.75rem` | Shell grid gap | KEEP |
| `--sidebar-expanded` | `256px` | Historical V3 rail | DEPRECATE_LATER |
| `--sidebar-collapsed` | `72px` | Historical V3 rail | DEPRECATE_LATER |
| `--sidebar-drawer` | `min(88vw, 384px)` | Mobile drawer width (still used) | KEEP until mobile tokenized |

No shadow tokens. Shadows are hardcoded: nav panel `0 8px 24px color-mix(...)`; identity/drawer/modal `0 12px 32px` / `0 12px 40px` / `-12px 0 32px`. STATUS: UI20_NEW_NEEDED as `shadow.temporary-layer` only.

No motion duration tokens in CSS. Reduced-motion rule exists globally (see `09`).

## Undefined references (TRACEABILITY_GAP)

| NAME | WHERE | NOTE |
|---|---|---|
| `--text` | `.global-nav-item`, `.identity-menu-trigger`, `.app-meniu-trigger` | Not defined. Inherits `color: var(--text-primary)` from `:root`. |
| `--canvas` | `.object-context-strip` fallback `var(--canvas, var(--surface))` | Not defined; fallback used. |

`--text-dim` does **not** exist. Do not report a dim token.

## Typography runtime

| FONT | LOADING_SOURCE | CURRENT_RUNTIME_USE | TARGET_UI20_USE | MISSING | DUPLICATE_LOADING_RISK |
|---|---|---|---|---|---|
| IBM Plex Sans | Google Fonts in `apps/web/index.html` weights 400,500,600,700 | Global `font-family` on `:root` | UI | Weight 650 used in CSS (browser interpolates; 600/700 loaded) | Low — single loader |
| IBM Plex Mono | Google Fonts weights 400,500 | `.object-context-id` only | IDs / technical / numeric truth | Broader numeric/rate use not applied | Low |
| Source Serif 4 | **Not loaded** | None | Ofertă artifact scope only (RW3) | Entire family | Do not add in Figma as global kit font until runtime can load it |
| Segoe UI / Arial | System fallback | Fallback stack | Fallback only | — | — |

No `@font-face` in CSS. No npm font packages in `apps/web`. Body `line-height: 1.45`. Heading sizes are hardcoded rem, not tokens.

## Color semantic law (source-grounded)

| Meaning | Current CSS | Target semantic | Figma variable candidate | Mark |
|---|---|---|---|---|
| Constructive selected / WorkOS identity | `--ui20-shell-accent` `#1f332e` / `#8fb5a4` | Deep green | `color.semantic.identity` | RUNTIME_EXISTING (shell-scoped) |
| Actual blocked / consequence | `--status-blocked` / `--status-warning` `#9a3412` | Terracotta | `color.semantic.consequence` | RUNTIME_TRANSITIONAL |
| Normal truth | `--text-primary` + `--border-subtle` | Neutral | `color.semantic.ink` / `line` | RUNTIME_EXISTING |
| Legacy V3 action | `--action-primary` / `--accent` `#1e4d73` | Legacy blue | do not promote | RUNTIME_TRANSITIONAL / KEEP_LEGACY_ONLY |
| UI20 primary act (Figma) | not a global runtime token | Deep green primary | `color.semantic.action` | FIGMA_ONLY until wave remaps without breaking V3 bodies |
| Focus | `--focus-ring` = legacy blue | Ink focus (DL1) | `focus.ring` | NEEDS_CALIBRATION |

Do **not** remap `--action-primary` globally in the kit. RW1A already forbade that.

## Token counts

```text
DEFINED_ROOT_CUSTOM_PROPERTIES = 47
  (38 named values including 5 space + 2 radius + 10 aliases + 5 status washes)
APP_SHELL_LOCAL_PROPERTIES     = 5
UNDEFINED_BUT_REFERENCED       = 2 (--text, --canvas)
SHADOW_TOKENS                  = 0
MOTION_TOKENS                  = 0
TYPE_SIZE_TOKENS               = 0
```
