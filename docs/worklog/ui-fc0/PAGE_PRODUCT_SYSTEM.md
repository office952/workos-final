# UI-FC0 — Product System pages

```text
LANE = A_PRODUCT + B_USER
HEAD = bb5952051abace00078a7aa1bf5930ce72cc4abe
PRODUCT_CODE_WRITE = NO
UI_MUST_NOT_INVENT_RATES = YES
```

Source: current page files + canons. Synthesis of independent Product System lane.

## Scores

| Route | PS UI | Signature | Info model | Redesign priority |
| --- | --- | --- | --- | --- |
| `/admin/product-system` | 5/10 | 3/10 | 5/10 | CRITICAL_UI_UX |
| `/components` | 4/10 | 2/10 | 6/10 | CRITICAL_UI_UX |
| `/products` | 6/10 | 5/10 | 6/10 | HIGH (commercial catalog, not PS admin) |
| `/products/:productCode` | 7/10 | 7/10 | 7/10 | HIGH — add ROLE blueprint, keep spine |

```text
PRODUCT_SYSTEM_CURRENT_UI_SCORE = 5
PRODUCT_SYSTEM_REDESIGN_PRIORITY = CRITICAL_UI_UX
PRODUCT_SYSTEM_REDESIGN_DIRECTION_COUNT = 3
```

## Shared finding

`/admin/product-system` and `/components` share `OwnerCatalogView`. Inspection is richer than administration, but they look like the same generic registry. Configurator is the only Product System–adjacent surface with a distinct workspace.

UI must not invent: composition edits, settings Edit/Save, resource rates, parallel Product entity, Analyzer geometry, hardcoded product fields.

## Floorplan directions (required)

1. **VERTICAL PRODUCT BLUEPRINT** — FACE / VOLUME / BACK / LIGHTING as construction stack; selected layer focuses configuration; unselected role stays silent.
2. **MASTER-DETAIL / PRODUCT CONSTRUCTION WORKSPACE** — product pick + inspector; not a peer-category dump.
3. **DOMAIN MAP TREE** (admin) or **COMMERCIAL STAGE DOOR** (configurator) — third alternative, not a cosmetic card variant.

Preserve: component type owns calculation; ProductTemplate owns composition; Resource owns rate; commercial owns selling price.
