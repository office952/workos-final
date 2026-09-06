# 08 — Spacing, density, responsive

## Foundation spacing (runtime)

From `index.css`: `--space-1` 4px … `--space-5` 24px (assuming 16px root).  
Most page rhythm is still **hardcoded rem** (`0.35rem`, `0.75rem`, `1.25rem` content padding).

Figma must not freeze one page rhythm as law.

Proposed future variables (proposal only):

| Candidate | Meaning | Runtime source | Confidence |
|---|---|---|---|
| `space.1`–`space.5` | Existing scale | `--space-*` | High |
| `space.shell-inline` | Top bar padding | `0.35rem 1rem` | High |
| `space.content` | `.app-content` | `1.25rem 1.5rem 2rem` | High |
| `space.control` | 44px min target | many `min-height: 44px` | High |
| `density.*` | Semantic mode, not a single spacer | page CSS | Medium |

## Density modes (semantic)

| Mode | Typical vertical rhythm | Row height | Control density | Section gap | Evidence |
|---|---|---|---|---|---|
| LOW | Generous sheet padding ~24–32 | Artifact lines ~28–36 | Few 44px acts | Wide | Ofertă `235:66` |
| MEDIUM | 12–16 | Object rows ~44–56 | Normal 44px | 16–24 | Cerere `239:69`, Config, Client Hub |
| MEDIUM_HIGH | 8–12 | Traveler steps compact | 44px acts kept | 12–16 | Lucrare `240:115` |
| HIGH | 6–10 | Scan rows ~44 min | Tight meta, 44px actions | 8–12 | Atelier `240:198`, Resources rate rows |
| FOCUSED | Large title, few rows | Station, not table | One ActionDock | Large rest | Execution |

Do not shrink targets below 44px.

## Surface / line grammar

| Layer | Rule | Avoid |
|---|---|---|
| APP CANVAS | `--surface-canvas` recedes | Full-bleed brand color |
| WORK SURFACE | Paper / primary surface | Card wall |
| RAISED TEMPORARY | Drawer, popover, modal; **shadow allowed here** | Shadow hierarchy on every block |
| INSET | Selected wash, strip | Glass |
| SEMANTIC PLANE | Known / unresolved / composition / lens | One universal card |
| WHOLE OBJECT BOUNDARY | One line around the object | Nested cards |
| RELATION LINE | 2–3px constructive connector | Decorative connectors as chrome |
| ATTENTION EDGE | 3–4px terracotta, local | Rainbow left bars |
| DIVIDER | `--border-subtle` hairline | Heavy rules |
| CURRENT OUTLINE | Focus 2px `--focus-ring` or identity underline | Glow |

Radius: `--radius-s` 4px / `--radius-m` 6px. Do not enlarge.

## Responsive contract

Proof widths: **1440 / 1280 / 768**. Runtime queries also include `48rem` (768), `56rem`, `80rem`, `860px`, `1280px`, `1919px`, `420px`.

| Primitive / page | 1440 | 1280 | 768 |
|---|---|---|---|
| Global L1 | UNCHANGED | COMPRESS gaps | TRANSFORM → Meniu drawer |
| Comercial / Mai multe / Cont | popover | popover | BECOME nested sequential in Meniu |
| ObjectContextStrip | UNCHANGED | COMPRESS | WRAP |
| Cerere Resolution Field | two planes | COMPRESS | STACK / SEQUENTIAL — **still Known vs Unresolved** |
| Config composition + lens | side by side | COMPRESS (critical) | composition remains composition; lens SEQUENTIAL under/over — **not a form dump** |
| Ofertă sheet | centered sheet | COMPRESS | COMPRESS, keep artifact |
| Lucrare traveler | traveler | COMPRESS (critical) | STACK steps |
| Client Hub | workspace | COMPRESS (critical) | WRAP collections |
| Atelier | high scan | high scan | may **increase** scan density; stack actions |
| Execution | focused | focused | focused; no fake desktop shrink |
| Resources ledger | table | COMPRESS | TRANSFORM stacked cells (`860px` already) |
| Admin floorplan | local sidebar | COMPRESS | BECOME_DRAWER via compact triggers |
| Metric bands | 4 col | 4 col | 2 col |
| Requests status chips | chips | chips until 1919 | select filter |

Do not create scaled-down desktop.
