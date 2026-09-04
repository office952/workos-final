# WorkOS UI/UX 2.0 E2E — Figma pages

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_R3_HIGH_FIDELITY_CHARACTER_PROOF
R3A = TARGETED_AMENDMENT_COMPLETE
FIGMA_FILE = WorkOS UI UX 2.0 — E2E
FIGMA_FILE_KEY = 0XP0yGa1siWQdTTL7ou8xz
FIGMA_URL = https://www.figma.com/design/0XP0yGa1siWQdTTL7ou8xz
FIGMA_LIBRARY_PUBLISH = NO
OLD_FIGMA_WRITE = NO
ACTUAL_FIGMA_PAGE_COUNT = 14
PAGE_ORDER = 00 01 02 03 04 05 10 20 30 40 50 80 90 99
PAGE_ORDER_SOURCE = figma.root.children
```

Verified Plugin API order (R3A):

| i | PAGE | NODE_ID |
| --- | --- | --- |
| 0 | 00 — North Star | `0:1` |
| 1 | 01 — Foundations | `1:2` |
| 2 | 02 — Core Design System | `1:3` |
| 3 | 03 — Operational Language | `1:4` |
| 4 | 04 — Interaction + Motion | `1:5` |
| 5 | 05 — Floorplan Lab | `1:6` |
| 6 | 10 — E2E Commercial | `1:7` |
| 7 | 20 — E2E Production | `1:8` |
| 8 | 30 — Resources | `1:9` |
| 9 | 40 — People | `1:10` |
| 10 | 50 — Administration | `1:11` |
| 11 | 80 — Prototypes | `1:12` |
| 12 | 90 — Research Transfer | `1:13` |
| 13 | 99 — Deprecated | `1:14` |

Independent R3 Plugin API had `40` before `20`/`30` and `99` before `90`. The live file was reordered. This table is not a documentation-only claim.

| PAGE | R3 / R3A CONTENT |
| --- | --- |
| 00 — North Star | Program state `16:2` · current matrix `28:2` · proof links `35:120` |
| 01 — Foundations | Density + no-color (R2) |
| 02 — Core Design System | Candidate primitives `35:123` |
| 03 — Operational Language | Operational primitives (R2) |
| 04 — Interaction + Motion | R1/R2 + R3 SELECT `35:99` FREEZE `35:105` shift `35:111` |
| 05 — Floorplan Lab | A–G research specimens |
| 10 — E2E Commercial | G1/G2 Cerere · Configurator · Ofertă live/frozen · R3A dark `46:135` · 768 |
| 20 — E2E Production | R3A Atelier `46:2`/`46:72` · Execuție light `30:86` · R3A dark `46:101` |
| 30 — Resources | Ledger + 768 |
| 40 — People | Empty of R3 HF |
| 50 — Administration | Empty of R3 HF |
| 80 — Prototypes | IA-3 + Command `35:29` + flows `35:51` + R3A stress clones |
| 90 — Research Transfer | Historical R1 matrix `10:78` + moved R0 leftovers |
| 99 — Deprecated | Empty |

## Current high-fidelity nodes

| ARTIFACT | NODE | SUPERSEDED |
| --- | --- | --- |
| G1 Cerere 1440 | `29:2` | — |
| G2 Cerere 1440 | `30:2` | — |
| Configurator 1440 | `31:2` | — |
| Ofertă 1440 | `32:2` | — |
| Ofertă frozen | `32:61` | — |
| Ofertă dark | `46:135` | `35:57` hidden |
| Cerere 768 | `34:2` | — |
| Configurator 768 | `34:20` | — |
| Atelier 1440 | `46:2` | `29:84` hidden |
| Execuție 1440 | `30:86` | — |
| Execuție dark | `46:101` | `35:2` hidden |
| Atelier 768 | `46:72` | `32:172` hidden |
| Resurse 1440 | `29:149` | — |
| Resurse 768 | `32:147` | — |
| Command Layer | `35:29` | — |
| Current matrix | `28:2` | — |
| Historical R1 matrix | `10:78` | — |

## R3A stress evidence (page 80)

| TEST | NODE |
| --- | --- |
| CERERE LOGO_OFF | `49:2` |
| CERERE TITLE_OFF | `49:86` |
| CERERE GRAYSCALE | `49:170` |
| ATELIER LOGO_OFF | `49:254` |
| ATELIER TITLE_OFF | `49:324` |
| ATELIER GRAYSCALE | `49:394` |
| RESURSE LOGO_OFF | `49:464` |
| RESURSE TITLE_OFF | `49:544` |
| RESURSE GRAYSCALE | `49:624` |
| OFERTA MOTION_OFF live | `49:704` |
| OFERTA MOTION_OFF frozen | `49:764` |

## Research systems (unchanged IDs)

| DIR | NODE |
| --- | --- |
| A | `6:2` |
| B | `7:2` |
| C | `8:2` |
| D | `10:132` |
| E | `16:7` |
| F | `16:64` |
| G | `16:110` |
| IA-3 desktop | `16:157` |
