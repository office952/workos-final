# UI20-R4 — Semantic motion grammar

Existing accepted research: SELECT ≈ 150 ms, FREEZE ≈ 200 ms.

R4A differentiates the five verbs. Normal screens stay still. No loop, idle motion, bounce, playful spring, or cinematic wipe.

| Verb | Grammar | Trigger | Dest | Transition | Duration | Stays | Changes | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RESOLVE | `73:122` | `72:82` | `72:87` | SMART_ANIMATE EASE_OUT | 180 ms | CER object, known/missing structure | item leaves LIPSEȘTE, blocker retreats, next action | resolved structure is enough |
| SELECT | `35:99` | `72:489` / `72:581` | `72:541` / `72:455` | SMART_ANIMATE EASE_OUT | 150 ms | construction stack | selected part + context lens | end context is enough |
| FREEZE | `35:105` | `72:897` | `72:901` | DISSOLVE EASE_IN | 220 ms | OFT, lines, value | editing retreats; provenance/revision settle | frozen artifact is enough |
| ENTER_WORK | `73:126` | `72:1007` | `72:1026` | SMART_ANIMATE EASE_OUT | 200 ms | LUC, other lanes | row relocates; action Pornește → Continuă | moved row is enough |
| ADVANCE | `73:130` | with COMPLETE | `72:1318` | SMART_ANIMATE EASE_IN_AND_OUT | 200 ms | LUC-88 | next operation gains focus | new focus is enough |
| COMPLETE | `73:134` | `72:1311` | `72:1318` | SMART_ANIMATE EASE_IN_AND_OUT | 200 ms | object, commercial history | current → compressed history | compressed history is enough |
| COMPRESS | `73:138` | with ADVANCE | `72:1318` | SMART_ANIMATE EASE_IN_AND_OUT | 160–200 ms | object identity | past height | one history line is enough |

Dialect rule:

- SELECT = quietest in-place attention change
- RESOLVE = item relocates from missing to known
- ENTER_WORK = row relocates; ownership/currentness changes
- COMPLETE = current compresses; production advances
- FREEZE = only whole-artifact dissolve; more final than SELECT

Applied descendant tracks (Plugin API can confirm timeline presence, not property dumps):

| Demo | Node | Intended track |
| --- | --- | --- |
| ResolvedItem | `80:19` | TRANSLATION_X 0 → −168, 180 ms |
| BlockerFade | `80:21` | OPACITY 1 → 0, 180 ms |
| EnterWorkRow | `80:26` | TRANSLATION_Y 0 → −56, 200 ms |
| NextGainsFocus | `80:28` | OPACITY 0.35 → 1, 200 ms |
| CurrentOp | `80:31` | HEIGHT 64 → 36, 200 ms EASE_IN_AND_OUT |
| HistoryLine | `80:34` | OPACITY 0 → 1, 200 ms |
| CompressBlock | `80:35` | HEIGHT 72 → 36, 160 ms |

Video proof exported only for ENTER_WORK and COMPLETE.

Meaning does not depend on motion. MOTION_OFF Ofertă: `73:837` / `73:897`.
