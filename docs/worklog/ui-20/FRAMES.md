# WorkOS UI/UX 2.0 E2E — Figma pages

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_R4_PAGE_PERSONALITY_AND_SEMANTIC_DYNAMICS
R3A = ACCEPTED
R3_SIGNATURE_AMENDMENT = ACCEPTED
S1_A = STRUCTURAL_BASE_ACCEPTED
R4_STATUS = PAGE_PERSONALITY_IN_REVIEW
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
| 00 — North Star | R3 state `16:2`/`28:2`/`35:120` · R4 direction `73:2` · matrix `73:7` · proof `73:117` |
| 01 — Foundations | Density + no-color (R2) |
| 02 — Core Design System | Candidate primitives `35:123` |
| 03 — Operational Language | Operational primitives (R2) |
| 04 — Interaction + Motion | R3 SELECT/FREEZE/shift · R4 RESOLVE `73:122` ENTER_WORK `73:126` ADVANCE `73:130` COMPLETE `73:134` COMPRESS `73:138` |
| 05 — Floorplan Lab | A–G research specimens |
| 10 — E2E Commercial | R3 kept · R4 Cerere/Configurator/Ofertă state pairs at x≥6400 |
| 20 — E2E Production | R3A kept · R4 Lucrare + Atelier/Execuție dynamics at x≥3200 |
| 30 — Resources | R3 ledger · R4 rest/selected `72:1517`/`72:1596` |
| 40 — People | R4 contracts Utilaje `73:142` · Oameni `73:146` |
| 50 — Administration | R4 Admin contract `73:150` |
| 80 — Prototypes | R3 kept · R4 stress `73:161`–`73:897` at y=20000 |
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

## R3 signature amendment (page 80)

Phase 1 winner S1-A remains visible. S1-B is hidden.

| ARTIFACT | NODE |
| --- | --- |
| S1-A Cerere | `56:2` |
| S1-A Atelier | `56:168` |
| PROP Cerere LOGO_OFF | `59:2` |
| PROP Cerere TITLE_OFF | `59:85` |
| PROP Cerere GRAYSCALE | `59:168` |
| PROP Cerere CONTAINER_OFF | `59:251` |
| PROP Ofertă MOTION_OFF live | `59:334` |
| PROP Ofertă MOTION_OFF frozen | `59:394` |
| PROP Atelier LOGO_OFF | `59:450` |
| PROP Atelier TITLE_OFF | `59:519` |
| PROP Atelier GRAYSCALE | `59:588` |
| PROP Atelier CONTAINER_OFF | `59:657` |
| PROP Resurse GRAYSCALE | `59:726` |

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

## R4 personality + dynamics

| ARTIFACT | NODE |
| --- | --- |
| Page personality matrix | `73:7` |
| Cerere missing 1440 | `72:4` |
| Cerere resolved 1440 | `72:87` |
| Cerere resolved dark | `72:372` |
| Configurator Volum 1440 | `72:455` |
| Configurator Față 1440 | `72:541` |
| Ofertă editable | `72:841` |
| Ofertă frozen | `72:901` |
| Lucrare 1440 | `72:1700` |
| Lucrare 1280 | `72:1798` |
| Lucrare 768 | `72:1857` |
| Lucrare dark | `72:1916` |
| Atelier available 1440 | `72:957` |
| Atelier in progress 1440 | `72:1026` |
| Execuție current 1440 | `72:1285` |
| Execuție advanced 1440 | `72:1318` |
| Execuție advanced dark | `72:1483` |
| Resurse rest | `72:1517` |
| Resurse selected | `72:1596` |
| RESOLVE motion | `73:122` |
| ENTER_WORK motion | `73:126` |
| ADVANCE motion | `73:130` |
| COMPLETE motion | `73:134` |
| COMPRESS motion | `73:138` |
