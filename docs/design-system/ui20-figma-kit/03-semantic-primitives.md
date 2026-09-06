# 03 — Semantic primitive candidates

Names are candidates. Do not mint a Figma component without evidence.

## Decision table

| Candidate | Status | Semantic purpose | When to use | When not | Pages | Variants | A11y | Responsive | Dark |
|---|---|---|---|---|---|---|---|---|---|
| SemanticAnchor | FIGMA_ONLY / NEEDED_LATER | Marks the constructive selected part without shouting | Config selected role; maybe traveler current | Not every link; not L1 current | Config, later Lucrare | selected / idle | Not color-only; text + position | UNCHANGED meaning | Same hierarchy |
| AttentionEdge | PARTIALLY_RUNTIME | Local 3–4px consequence edge | Blocked / missing / current exception | Not decorative left bars on every row | Cerere unresolved, Client attention, some registry `is-attention` | blocked / current | Pair with text cause | COMPRESS height, keep edge | Terracotta/warn, no glow |
| ObjectContextStrip | ALREADY_RUNTIME | Quiet object orientation | Object routes with truthful props | Empty mount; no invented lineage | All object families | empty=null | `role="navigation"` `aria-label="Context obiect"` | WRAP | Strip wash |
| WholeObjectBoundary | FIGMA_ONLY / NEEDED_RW2 | One plane = one object | Cerere known/unresolved planes; Config composition plane | Not a card wall | Cerere, Config | known / unresolved | Heading per plane | STACK at 768; keep two semantics | Line, not shadow |
| ContextLens | FIGMA_ONLY / NEEDED_RW2 | Focused facts for the selected construction part | Config only | Not a universal inspector | Config | selected-part / warn | Do not hide required fields under `aria-hidden` | STAY beside composition at 768 if possible; sequential if needed — **composition remains composition** | Same |
| ConstructionRelation | FIGMA_ONLY / NEEDED_RW2 | Relation lines between selected roles | Config graph | Not LETTERS FACE/VOLUME as kit anatomy | Config | connected / silent | Decorative lines + text labels | COMPRESS, do not drop meaning | Line color muted |
| StateCause | PARTIALLY_RUNTIME | Why blocked/incomplete | Notice lists, field-error, atelier block reason | Not a chip that replaces copy | Cerere, Atelier, Config readiness | blocked / incomplete | Text required | WRAP | Contrast on wash |
| ReadinessMarker | PARTIALLY_RUNTIME | Backend readiness projection, not UI formula | Config `ReadinessNotice`, install headlines | Do not invent readiness | Config, request install | ok / warn | Tone + text | UNCHANGED | Token tones |
| JourneyPosition | FIGMA_ONLY / NEEDED_LATER | Commercial-path crumb | Cerere/Config/Ofertă | Hidden Atelier/Exec; not fake stepper | RW3+ | current / complete / upcoming | Text, not color-only | HIDE at 768 if crowded | Quiet |
| LedgerRow | PARTIALLY_RUNTIME | Dense scannable work/rate row | Atelier, Resources | Not Client Hub cards; not Ofertă sheet | Atelier, Resources, maybe Jobs | normal / blocked / complete | 44px row target | TRANSFORM to stacked meta | No zebra glow |
| ActionDock | PARTIALLY_RUNTIME | 44px next valid act cluster | Cerere CTA, config confirm, atelier start | Not a floating FAB | Most work pages | primary + quiet | 44×44 | WRAP | Primary later green; today legacy blue |

## Evidence notes

- `ObjectContextStrip` is implemented and unit-tested (`ui/ObjectContextStrip.test.tsx`). `AppShell` mounts it with no props → renders nothing. Population is RW2+.
- Attention energy already appears as:
  - `.clients-overview .registry-row.is-attention::before` 3px `--status-warning`
  - `.client-attention-row` inset 3px
  - `.decision-card-blocked` / `.notice-blocked`
  These are **not** one shared component.
- `FormRenderer` choice chips are a control, not ContextLens.
- Figma Config `234:103` / `240:66` draws FAȚĂ / VOLUM / SPATE / ILUMINARE. That is **LETTERS specimen**, not kit anatomy. ConstructionRelation must bind to `template.components` / schema, including ACM without fake VOLUME/LIGHTING.
- DL1 named ObjectRegister / ActionDock / AttentionEdge / JourneyPosition / StateCause. Runtime names differ. Map by meaning.

## Forbidden promotions

Universal Page, Universal Workbench, Universal Card, Universal Dashboard, Universal Floorplan, MetricCard-as-kit, Global Search, Acasă radar widgets.
