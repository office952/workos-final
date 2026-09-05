# WorkOS UI/UX 2.0 E2E — Figma pages

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_R5_NORTH_STAR_E2E_OBJECT_CONTINUITY
R3A = ACCEPTED
R3_SIGNATURE_AMENDMENT = ACCEPTED
S1_A = STRUCTURAL_BASE_ACCEPTED
R4_STATUS = PAGE_PERSONALITY_AND_SEMANTIC_DYNAMICS_ACCEPTED_WITH_ADVISORIES
R4A = ACCEPTED
R5_STATUS = DIRECTION_ACCEPTED_WITH_ADVISORIES
R5A_STATUS = ACCEPTED
R5A_1_STATUS = ACCEPTED
R5A_2_STATUS = ACCEPTED
FIGMA_FILE = WorkOS UI UX 2.0 — E2E
FIGMA_FILE_KEY = 0XP0yGa1siWQdTTL7ou8xz
FIGMA_URL = https://www.figma.com/design/0XP0yGa1siWQdTTL7ou8xz
FIGMA_LIBRARY_PUBLISH = NO
OLD_FIGMA_WRITE = NO
ACTUAL_FIGMA_PAGE_COUNT = 14
PAGE_ORDER = 00 01 02 03 04 05 10 20 30 40 50 80 90 99
PAGE_ORDER_SOURCE = figma.root.children
```

Verified Plugin API order after R4A live reorder (`figma.root.insertChild(9, 1:10)`). Independent R4 review had found `50` before `40`. Rechecked `figma.root.children`:

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

This table is live-file order, not a documentation-only claim. R4A rechecked and corrected `40` before `50`.

| PAGE | R3 / R3A CONTENT |
| --- | --- |
| 00 — North Star | R3/R4 kept · R5 decision `96:1775` · journey map `96:1779` only |
| 01 — Foundations | Density + no-color (R2) |
| 02 — Core Design System | Candidate primitives `35:123` |
| 03 — Operational Language | Operational primitives (R2) |
| 04 — Interaction + Motion | R3 SELECT/FREEZE · R4A inspectable dialect: RESOLVE `73:122` ENTER_WORK `73:126` ADVANCE `73:130` COMPLETE `73:134` COMPRESS `73:138` · SELECT `35:99` FREEZE `35:105` |
| 05 — Floorplan Lab | A–G research specimens |
| 10 — E2E Commercial | R3 kept · R4 Cerere/Configurator/Ofertă state pairs at x≥6400 |
| 20 — E2E Production | R3A kept · R4 Lucrare + Atelier/Execuție dynamics at x≥3200 |
| 30 — Resources | R3 ledger · R4 rest/selected `72:1517`/`72:1596` |
| 40 — People | R4 contracts Utilaje `73:142` · Oameni `73:146` |
| 50 — Administration | R4 Admin contract `73:150` |
| 80 — Prototypes | R3/R4 kept · R5 connected North Star at y≥21000 · six-up `99:407` |
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
| Lucrare dark | `72:1916` (R4A CTA `72:1972`) |
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

## R4A live prototype verbs

| Verb | Source | Dest | Transition | Duration |
| --- | --- | --- | --- | --- |
| RESOLVE | `72:82` | `72:87` | SMART_ANIMATE EASE_OUT | 180 ms |
| SELECT | `72:489` | `72:541` | SMART_ANIMATE EASE_OUT | 150 ms |
| SELECT back | `72:581` | `72:455` | SMART_ANIMATE EASE_OUT | 150 ms |
| FREEZE | `72:897` | `72:901` | DISSOLVE EASE_IN | 220 ms |
| ENTER_WORK | `72:1007` | `72:1026` | SMART_ANIMATE EASE_OUT | 200 ms |
| COMPLETE | `72:1311` | `72:1318` | SMART_ANIMATE EASE_IN_AND_OUT | 200 ms |

Video: `docs/worklog/ui20-r4/evidence/enter-work.mp4`, `complete.mp4`.

## R5 North Star connected journey (page 80)

Personality sources stay on 10 / 20. Connected prototype is clones on 80. Fixture: CER-1042 → OFT-221 → LUC-88 · Nord Display SRL.

| ARTIFACT | NODE |
| --- | --- |
| R5 decision (page 00) | `96:1775` |
| R5 journey map (page 00) | `96:1779` |
| Client context 1440 | `96:767` |
| Command lineage 1440 | `96:1749` |
| Cerere missing 1440 | `96:2` |
| Cerere resolved 1440 | `96:85` |
| Config Volum 1440 | `96:168` |
| Config Față 1440 | `96:254` |
| Ofertă editable 1440 | `96:340` |
| Ofertă frozen 1440 | `96:400` |
| Lucrare 1440 | `96:456` |
| Atelier available 1440 | `96:517` |
| Atelier in progress 1440 | `96:586` |
| Exec current 1440 | `96:655` |
| Exec advanced 1440 | `96:690` |
| Exec completed 1440 | `96:723` |
| Cerere 1280 | `96:877` |
| Config 1280 | `96:960` |
| Ofertă 1280 editable | `96:1046` |
| Ofertă 1280 frozen | `124:2` |
| Lucrare 1280 | `96:1106` |
| Atelier 1280 | `96:1165` |
| Exec 1280 | `96:1234` |
| Cerere 768 | `96:1267` |
| Config 768 | `96:1285` |
| Ofertă 768 editable | `96:1306` |
| Ofertă 768 frozen | `112:2` |
| Lucrare 768 | `96:1366` |
| Atelier 768 | `96:1405` |
| Exec 768 | `96:1431` |
| Ofertă frozen dark | `96:1461` |
| Lucrare dark | `96:1517` |
| Exec advanced dark | `96:1576` |
| Six-up logo/H1/accent off | `99:407` |
| Ofertă 768 MobileChrome | `105:2` |
| Ofertă 768 freeze | `96:1362` → `112:2` DISSOLVE EASE_IN 220 |
| Ofertă 768 Deschide lucrarea | `112:62` → `96:1366` SMART_ANIMATE EASE_OUT 200 |
| Ofertă 1280 freeze | `96:1102` → `124:2` DISSOLVE EASE_IN 220 |
| Ofertă 1280 Deschide lucrarea | `124:58` → `96:1106` SMART_ANIMATE EASE_OUT 200 |
| Config 768 construction parts | `105:6` |
| Config 768 Înapoi la cerere | `105:15` → `96:1267` |
| Exec 768 Înapoi la lucrare | `99:4` → `96:1366` |
| 768 shell comparison | `106:2` |

## R5 connected verbs (page 80)

| Verb | Source | Dest | Transition | Duration |
| --- | --- | --- | --- | --- |
| RESOLVE | `96:80` | `96:85` | SMART_ANIMATE EASE_OUT | 180 ms |
| CERERE → CONFIG | `96:163` | `96:168` | SMART_ANIMATE EASE_OUT | 180 ms |
| SELECT | `96:202` | `96:254` | SMART_ANIMATE EASE_OUT | 150 ms |
| CONFIG → OFERTĂ | `96:756` | `96:340` | SMART_ANIMATE EASE_OUT | 180 ms |
| FREEZE | `96:396` | `96:400` | DISSOLVE EASE_IN | 220 ms |
| FREEZE 768 | `96:1362` | `112:2` | DISSOLVE EASE_IN | 220 ms |
| FREEZE 1280 | `96:1102` | `124:2` | DISSOLVE EASE_IN | 220 ms |
| OFERTĂ → LUCRARE | `96:763` | `96:456` | SMART_ANIMATE EASE_OUT | 200 ms |
| OFERTĂ 768 → LUCRARE | `112:62` | `96:1366` | SMART_ANIMATE EASE_OUT | 200 ms |
| OFERTĂ 1280 → LUCRARE | `124:58` | `96:1106` | SMART_ANIMATE EASE_OUT | 200 ms |
| LUCRARE → EXEC | `96:512` | `96:655` | SMART_ANIMATE EASE_OUT | 200 ms |
| LUCRARE → ATELIER | `96:515` | `96:517` | SMART_ANIMATE EASE_OUT | 200 ms |
| ENTER_WORK | `96:567` | `96:586` | SMART_ANIMATE EASE_OUT | 200 ms |
| ATELIER → EXEC | `96:557` | `96:655` | SMART_ANIMATE EASE_OUT | 200 ms |
| COMPLETE | `96:681` | `96:690` | SMART_ANIMATE EASE_IN_AND_OUT | 200 ms |
| EXEC ADVANCE | `96:716` | `96:723` | SMART_ANIMATE EASE_IN_AND_OUT | 200 ms |
| EXEC → LUCRARE | `96:749` | `96:456` | SMART_ANIMATE EASE_OUT | 200 ms |
