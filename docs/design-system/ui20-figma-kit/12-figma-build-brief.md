# 12 — Figma build brief (ChatGPT / Figma writer)

Ready-to-execute instruction. Cursor does **not** write Figma.

```text
KIT_IDENTITY     = WORKOS UI20 OPERATIONAL KIT
FILE             = 0XP0yGa1siWQdTTL7ou8xz
FIGMA_WRITE      = CHATGPT_ONLY_AFTER_INDEPENDENT_KIT1_REVIEW
NOT              = generic Material / shadcn catalog
NOT              = one Universal Page / Card / Workbench / Dashboard / Floorplan
```

## Mission

Build a **WorkOS operational kit** so later React waves (RW2+) map to named foundations and primitives without asking Figma to guess the repository.

Three-source law:

1. Current WorkOS repo = domain / runtime / implementation truth  
2. Accepted Figma UI20 = cognitive + visual target  
3. Old WorkOS = operational reference, not visual blueprint  

## Before you draw

Read this package in order: `MANIFEST.md` → `01` tokens → `02` components → `03` primitives → `04` personalities → `06` mapping → `11` modularity.

Do not reopen FINAL IA, FINAL SHELL, FINAL VISUAL, page personalities, RW1, or RW2 direction.

## Future Figma file sections (required)

Create these as kit pages / frames. Classify every element (`FOUNDATION` / `GENERIC_CONTROL` / `SEMANTIC_PRIMITIVE` / `PAGE_SPECIFIC_PATTERN` + runtime status).

### 00 Foundations

Canvas / paper / ink / muted / line / overlay.  
Map from runtime tokens in `01`, then mark CALIBRATE where Figma DNA differs (warm canvas `#f4f3f0` vs runtime `#f3f5f7`; identity green vs legacy blue).  
Do not publish variables that claim runtime already uses Figma hex.

### 01 Typography

IBM Plex Sans = UI.  
IBM Plex Mono = IDs / technical / numeric.  
Source Serif 4 = **Ofertă artifact only** — document as `PAGE_SPECIFIC` + `UI20_NEW` because **runtime does not load it**.  
Do not add a fourth family. Do not make Station 40 or Artifact 36 a global display ramp.

### 02 Semantic Color

| Role | Kit variable candidate | Runtime today |
|---|---|---|
| identity / constructive selected | `color.semantic.identity` | `--ui20-shell-accent` |
| action (future UI20 primary) | `color.semantic.action` | **not global** — do not steal `--action-primary` |
| consequence / blocked | `color.semantic.consequence` | `--status-blocked` / warning |
| ink / muted / line | `color.semantic.ink` etc. | `--text-*` `--border-*` |
| legacy V3 blue | `color.legacy.action` | `--action-primary` — isolate, do not delete |

Solid colors only. No gradient, glass, glow.

### 03 Spacing + Density

Keep `--space-1…5` as foundation.  
Add density modes LOW / MEDIUM / MEDIUM_HIGH / HIGH / FOCUSED as **examples on page specimens**, not one spacer that flattens all pages.  
44px is law.

### 04 Surface + Lines + Borders

Show: canvas, work surface, raised temporary (shadow OK), inset, semantic plane, whole-object boundary, relation line, attention edge, divider, current outline.  
Line is a semantic primitive. Radius 4/6 only.

### 05 Buttons + Actions

Variants from runtime only: primary, secondary, quiet, quiet-selected, danger, disabled.  
Document that runtime primary is **legacy blue** (`RUNTIME_NEEDS_CALIBRATION`).  
Future identity-green primary is a calibration, not 12 colors.  
44px. Hover / pressed / focus / disabled. No loading spinner unless a real runtime state exists (it mostly does not).

### 06 Inputs + Selection

Field (label, hint, error, 44px input, textarea, native select, checkbox).  
Choice chips: show the **a11y contract** (one control, no focusable-under-aria-hidden).  
Registry search = local filter specimen, **not** Global Search.  
No Toggle. No Radio unless you find a real radio field.

### 07 State + Consequence

Specimens for the taxonomy in `07`.  
Must show non-conflation pairs on one board.  
AttentionEdge + StateCause together. Chip-only state is not enough.

### 08 Navigation

Components from **accepted runtime behavior**:

- GlobalShellTop (no Acasă until a clearly labelled RW6 slot; **no Search**)
- GlobalNavigation L1
- Comercial panel
- Mai multe panel (empty-group = hidden)
- Cont / IdentityMenu
- MobileNavigationDrawer + nested
- Operator reduced chrome

Desktop / 1280 pressure / 768 transformation / keyboard / current / dark.

Do not restore Acasă as implemented L1. Do not render dead Search.

### 09 Object Context

`ObjectContextStrip`: type · Mono id · name · return · explicit parent.  
Empty = hide. Never fabricate CER-000.

### 10 Operational Semantic Primitives

Only those in `03` with evidence:

ObjectContextStrip (runtime), AttentionEdge (partial), ActionDock (partial), StateCause (partial), WholeObjectBoundary, ContextLens, ConstructionRelation, SemanticAnchor, JourneyPosition (later), LedgerRow (only if you keep Atelier and Resources as **separate** density examples, not one component forced on Ofertă).

### 11 Ledger / Worklist

Show Atelier row and Resources rate row as **HIGH density examples**.  
Do not merge them with Ofertă CommercialLine.

### 12 Responsive Transformations

One board: 1440 / 1280 / 768 for shell, Cerere planes, Config composition+lens, Atelier rows.  
Label each: UNCHANGED / COMPRESS / WRAP / STACK / TRANSFORM / HIDE / BECOME_DRAWER / BECOME_SEQUENTIAL.

### 13 Dark / System

Same hierarchy. Ofertă dark = charcoal root + light paper children (DL1).  
Do not invent neon dark.

### 14 Accessibility

A board of focus rings, 44px, skip-link, Escape restore, reduced-motion end states.  
Stamp: **Figma does not prove a11y**.

### 15 Figma ↔ React Mapping

Paste/adapt `06-figma-react-mapping.md`. Every kit component must point at a React file or `NONE`.

## Variables proposal (do not write until review)

Categories: `color.semantic.*` · `color.legacy.*` · `type.*` · `space.*` · `line.*` · `surface.*` · `focus.*` · `motion.*` · `density.*`

For each published variable later: semantic meaning, runtime source, light, dark, Figma need, React mapping, confidence.  
Do not blindly mirror CSS names (`--accent` is the wrong identity).

## Hard stops

- No HUB MEDIA fork
- No LETTERS anatomy in foundations
- No universal card
- No Master Polish theatre
- No RW2 page implementation inside the kit (specimens may show personality; they are not a React GO)

## After the kit exists

Return to Owner-delegate review, then release **RW2 implementation** against the kit (Cerere Resolution Field + Config Composition/Lens). This brief does not authorize RW2.
