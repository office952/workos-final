# WorkOS UI/UX 2.0 E2E — Figma pages

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_H1_DESIGN_HYGIENE_EVIDENCE_CONSOLIDATION
C1_STATUS = APPLICATION_COVERAGE_ACCEPTED
C1A_STATUS = RESPONSIVE_TEXT_INTEGRITY_ACCEPTED
R3A = ACCEPTED
R3_SIGNATURE_AMENDMENT = ACCEPTED
S1_A = STRUCTURAL_BASE_ACCEPTED
R4_STATUS = PAGE_PERSONALITY_AND_SEMANTIC_DYNAMICS_ACCEPTED_WITH_ADVISORIES
R4A = ACCEPTED
R5_STATUS = DIRECTION_ACCEPTED_WITH_ADVISORIES
R5A_STATUS = ACCEPTED
R5A_1_STATUS = ACCEPTED
R5A_2_STATUS = ACCEPTED
DL1_STATUS = DESIGN_LANGUAGE_DIRECTION_ACCEPTED_WITH_ADVISORY
DL1A_STATUS = REAL_EXTRACTION_PROOF_ACCEPTED
CARRY_ADVISORY = ATTENTIONEDGE_BLOCKED_ENERGY_IS_QUIETER_THAN_R5_TERRACOTTA
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
| 5 | 05 — Floorplan / Design Reserve | `1:6` |
| 6 | 10 — E2E Commercial | `1:7` |
| 7 | 20 — E2E Production | `1:8` |
| 8 | 30 — Resources | `1:9` |
| 9 | 40 — People | `1:10` |
| 10 | 50 — Administration | `1:11` |
| 11 | 80 — Prototypes | `1:12` |
| 12 | 90 — Research Transfer | `1:13` |
| 13 | 99 — Archive | `1:14` |

This table is live-file order, not a documentation-only claim. R4A rechecked and corrected `40` before `50`. H1 renamed `05` and `99` and restored `90` after `80`.

## CURRENT UI20 MAP

Authoritative current nodes: `docs/worklog/ui20-h1/03-current-ui20-map.md` and Figma board `181:79` (body `181:81`) on page 00.

Do not label archived or research nodes CURRENT.

| SURFACE | 1440 | 1280 | 768 | DARK |
| --- | --- | --- | --- | --- |
| CURRENT NORTH STAR | `96:1775` `96:1779` `181:79` | — | — | — |
| CURRENT FOUNDATIONS | `129:79` | — | — | — |
| CURRENT CORE PRIMITIVES | `129:153` | — | — | — |
| CURRENT OPERATIONAL LANGUAGE | `130:41` | — | — | — |
| CURRENT MOTION LAW | `129:157` | — | `130:897` | — |
| CURRENT DESIGN RESERVE | `166:645` | — | — | held |
| CURRENT CERERI REGISTRY | `166:60` | — | `166:523` | — |
| CURRENT CERERE DETAIL | `96:2` / `96:85` | `96:877` | `96:1267` | — |
| CURRENT CLIENTI REGISTRY | `166:15` | — | — | — |
| CURRENT CLIENT HUB | `166:375` | — | `166:540` | — |
| CURRENT OFERTE REGISTRY | `166:107` | — | — | — |
| CURRENT OFERTA EDITABLE | `96:340` | `96:1046` | `96:1306` | — |
| CURRENT OFERTA FROZEN | `96:400` | `124:2` | `112:2` | `96:1461` |
| CURRENT CATALOG | `166:337` | — | — | — |
| CURRENT CONFIGURATOR | `96:168` / `96:254` | `96:960` | `96:1285` | — |
| CURRENT LUCRARI REGISTRY | `166:153` | — | — | `166:742` |
| CURRENT LUCRARE | `96:456` | `96:1106` | `96:1366` | `96:1517` |
| CURRENT ATELIER | `96:517` / `96:586` | `96:1165` / `96:1621` | `96:1405` | — |
| CURRENT EXECUTION | `96:655` / `96:690` / `96:723` | `96:1234` / `96:1690` | `96:1431` | `96:1576` |
| CURRENT RESOURCES | `72:1517` / `72:1596` | — | `72:1675` | — |
| CURRENT STOCK | `166:420` | — | `166:628` | — |
| CURRENT MATERIAL | `166:445` | — | — | — |
| CURRENT PEOPLE | `166:259` | — | `166:582` | — |
| CURRENT PERSON | `166:288` | — | — | — |
| CURRENT SKILLS | `166:561` | — | — | — |
| CURRENT ADMIN | `166:305` | — | `166:595` | — |
| CURRENT PRODUCT SYSTEM | `166:474` | — | — | — |
| CURRENT MACHINES | `166:501` | — | — | — |
| CURRENT GOVERNANCE | `166:612` | — | — | — |
| CURRENT LOGIN | `166:325` | — | — | — |

Product holds (no screens): Acasă, Furnizori, Achiziții, Pontaj, Plăți și avansuri, Politici.

Grammar proof: DL1A `141:3` `141:86` `141:146`.

## CURRENT EVIDENCE

| KIND | WHERE | EXAMPLES |
| --- | --- | --- |
| R4 personality / dynamics | 10 / 20 / 30 / 40 / 50 | `72:4` … `72:1916`, `72:1517`, `73:142` |
| R5 connected journey | 80 | `96:2` … `96:1749`, `112:2`, `124:2` |
| DL1A anonymity / six-up / 768 shell | 80 | `141:234` `99:407` `106:2` |
| Design Reserve (held) | 05 | `166:645` |
| Leading research (not daily screens) | 90 | G `16:110`, IA-3 `16:157`, R1 matrix `10:78` |

## HISTORICAL INDEX

Node IDs below remain valid. Most now live on page 90 or 99 with prefix `ARCHIVE /`. Worklogs may still cite them.

| PAGE | H1 CONTENT |
| --- | --- |
| 00 — North Star | Current decision `96:1775` · journey `96:1779` · map `181:79` |
| 01 — Foundations | DL1 board `129:79` |
| 02 — Core Design System | DL1 board `129:153` |
| 03 — Operational Language | DL1 board `130:41` |
| 04 — Interaction + Motion | DL1 motion law `129:157` |
| 05 — Floorplan / Design Reserve | Design Reserve `166:645` only |
| 10 — E2E Commercial | C1 current · R4 evidence at x≥6400 |
| 20 — E2E Production | C1 Lucrări current · R4 evidence at x≥3200 |
| 30 — Resources | C1 Stoc/Material/Procese · R4 ledger evidence |
| 40 — People | C1 Oameni family · R4 contracts evidence |
| 50 — Administration | C1 Admin family · R4 contract evidence |
| 80 — Prototypes | Current North Star + DL1A + reduced-motion |
| 90 — Research Transfer | A–G, IA, R0/R1 teaching history |
| 99 — Archive | R3/R4/DL1 raw / stress. Prefix `ARCHIVE /` |

## Historical high-fidelity nodes (R3)

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

## R3A stress evidence (now page 99)

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

## R3 signature amendment (now page 99)

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

## DL1 foundations + extraction (not published)

Variables: COLOR `VariableCollectionId:129:31` Light/Dark · SPACING · RADIUS · TYPOGRAPHY_REFERENCE · MOTION_DURATION. No library publish.

| ARTIFACT | NODE |
| --- | --- |
| Foundations board | `129:79` |
| Proven primitives board | `129:153` |
| Operational language board | `130:41` |
| Motion law board | `129:157` |
| ObjectRegister | `130:6` |
| ActionDock | `130:12` |
| CommercialLine | `130:22` |
| StateCause | `130:27` |
| AttentionEdge | `130:33` |
| JourneyPosition | `130:36` |
| MaterialIdentity | `130:40` |
| Extract Cerere 1440 | `130:53` |
| Extract Config 1440 | `130:136` |
| Extract Ofertă 1440 | `130:224` |
| Extract Lucrare 1440 | `130:284` |
| Extract Atelier 1440 | `130:345` |
| Extract Exec 1440 | `130:414` |
| Extract Resources 1440 | `130:449` |
| Extract Ofertă 768 | `130:528` |
| Extract Config 768 | `130:592` |
| Extract Atelier 768 | `130:626` |
| Extract Exec 768 | `130:652` |
| Extract Ofertă 1280 | `130:685` |
| Extract Lucrare dark 1440 | `130:745` |
| Extract Exec dark 1440 | `130:804` |
| Extract Ofertă dark 1440 | `130:838` |
| Extract Ofertă frozen 768 | `130:897` |
| Extract anonymity six-up | `130:961` |
| Reduced-motion instant freeze | `130:588` → `130:897` INSTANT |

Raw DL1 extracts above are historical visual comparison. They are not an applied-component test (`INSTANCE_COUNT = 0`).

## DL1A recomposed proofs (applied-component test)

| ARTIFACT | NODE | INSTANCES |
| --- | --- | --- |
| Recomposed Cerere 1440 | `141:3` | ObjectRegister `141:192` · JourneyPosition `141:196` · AttentionEdge `141:198` · ActionDock `141:203` |
| Recomposed Ofertă 1440 | `141:86` | ObjectRegister `141:209` · JourneyPosition `141:213` · CommercialLine `141:215` · ActionDock `141:224` |
| Recomposed Execuție 1440 | `141:146` | ActionDock `141:229` |
| Anonymity Cerere | `141:234` | — |
| Anonymity Ofertă | `141:317` | — |
| Anonymity Execuție | `141:378` | — |
| DL1A label | `141:2` | — |

```text
COMMERCIAL_LINE_CLASSIFICATION = INSTRUMENT_SCOPED_PRIMITIVE / OFERTA
GRAMMAR_PROOF = PASS
```

## C1 application coverage (not published)

North Star stays concise. C1 coverage proofs live on 10 / 20 / 30 / 40 / 50. Design Reserve lives on 05. Connected journey lives on 80.

| ARTIFACT | NODE | PAGE |
| --- | --- | --- |
| Clienți registry 1440 | `166:15` | 10 |
| Cereri registry 1440 | `166:60` | 10 |
| Oferte registry 1440 | `166:107` | 10 |
| Catalog registry 1440 | `166:337` | 10 |
| Client Hub 1440 | `166:375` | 10 |
| Cereri 768 | `166:523` | 10 |
| Client Hub 768 | `166:540` | 10 |
| Lucrări registry 1440 | `166:153` | 20 |
| Lucrări 1440 dark | `166:742` | 20 |
| Stoc 1440 | `166:420` | 30 |
| Material 1440 | `166:445` | 30 |
| Procese 1440 | `166:457` | 30 |
| Stoc 768 | `166:628` | 30 |
| Oameni 1440 | `166:259` | 40 |
| Persoană 1440 | `166:288` | 40 |
| Calificări 1440 | `166:561` | 40 |
| Oameni 768 | `166:582` | 40 |
| Admin home 1440 | `166:305` | 50 |
| Login quiet 1440 | `166:325` | 50 |
| Product System 1440 | `166:474` | 50 |
| Utilaje 1440 | `166:501` | 50 |
| Admin home 768 | `166:595` | 50 |
| Guvernanță quiet 1440 | `166:612` | 50 |
| Design Reserve | `166:645` | 05 |

```text
OBJECTREGISTER_INSTANCES = Client Hub 166:391 · Persoană 166:292
ATTENTIONEDGE_INSTANCE = Client Hub 166:395
MATERIALIDENTITY_INSTANCE = Material 166:449
COMMERCIALLINE_ON_NEW_PAGES = 0
ACTIONDOCK_ON_NEW_PAGES = 0
C1A_768 = RESPONSIVE_TEXT_INTEGRITY_CORRECTED
C1A_NODES = 166:523 166:540 166:582 166:595 166:628
ACCIDENTAL_TEXT_CLIP_COUNT = 0
```

C1A did not add frames. It corrected the five existing 768 proofs: copy containers hug/fill, normal copy does not clip, mobile leads wrap or are omitted. 1440 proofs are unchanged.
