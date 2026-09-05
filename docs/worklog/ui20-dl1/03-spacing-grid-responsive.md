# UI20-DL1 — Spacing, grid, responsive

768 ≠ desktop scaled down.

## GRID_SYSTEM

| Band | Height / inset | Notes |
| --- | --- | --- |
| Destinations | 56 | Hidden on 768 |
| MobileChrome / Meniu | 56 | 768 only |
| ObjectRegister | 48 | ID + lineage |
| Chrome gutter | 28 | Wordmark / ID |
| Artifact inset | 64 | Ofertă work |
| Clarification inset | 36 | Cerere work |
| Primary | 44 | All instruments |

Work surface is the page width. Full-width inside the WorkOS content plane stays.

## SPACING_SCALE

4 / 8 / 12 / 16 / 20 / 28 / 36 / 64. Variables `space-4` … `space-64`.

## RESPONSIVE_BREAKPOINT_BEHAVIOR

| Width | Law |
| --- | --- |
| 1440 | Destination map + Command. Flex columns eat leftover width. |
| 1280 | Same chrome. Flex column contracts. Do not drop Destinations. |
| 768 | Meniu replaces Destinations. Keep object, current work, 44px next act. Config keeps a part strip. |

## DENSITY_RULES

Density is per instrument, not a global token. Resources / Ofertă line = high. Configurator / Exec = focal. Cerere = medium. Do not apply ledger row height to the construction bench.

## OFERTA_768_VALUE_CLIP_ROOT_CAUSE

Source `96:1350` LineHead is 640 wide. `Valoare` kept desktop `x=624` `w=200` → overflow **+184**. The Line row was reflowed; the header was not. 1440/1280 headers also failed to sit over the value cells.

## SYSTEMIC_RULE_TO_PREVENT_CLIP

`COLUMN_HEADER_BOUND_TO_COLUMN`

One track definition at every width:

description (flex) · Cant. (80) · Valoare (min 140, end-aligned)

Headers live inside the track they name. Absolute desktop x is forbidden after contraction. Same law for Resources `LedgerHead`.

Closed on extracts: `130:528` `130:897` `130:685` `130:224`.
