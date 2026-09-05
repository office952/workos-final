# UI20-DL1 — Motion foundation

No new verbs.

## VERB_TABLE

| Verb | Duration | Easing | Strength | Reduced |
| --- | ---: | --- | --- | --- |
| SELECT | 150 | SMART_ANIMATE EASE_OUT | Quiet in-place | End context |
| RESOLVE | 180 | SMART_ANIMATE EASE_OUT | Item relocates | Resolved structure |
| ENTER_WORK | 200 | SMART_ANIMATE EASE_OUT | Row relocates | Moved row |
| FREEZE | 220 + 200 | DISSOLVE EASE_IN then SMART_ANIMATE EASE_OUT | Whole artifact | Frozen artifact instant |
| ADVANCE | 200 | SMART_ANIMATE EASE_IN_AND_OUT | Focus shift | New focus |
| COMPLETE | 200 | SMART_ANIMATE EASE_IN_AND_OUT | Current compresses | Compressed history |
| COMPRESS | 160–200 | SMART_ANIMATE EASE_IN_AND_OUT | Height | One history line |

## DURATION_RANGE

150–220 ms. Variables `select-ms` … `compress-ms`.

## NORMAL_MOTION

One-shot after server confirm. `repeat = 0`. Normal screens stay still.

## REDUCED_MOTION

Same end state. Instant navigation. No spatial hop required.

## NO_MOTION_REQUIRED

Blocked cause, pending, server error.

## RUNTIME_VS_PROTOTYPE

```text
ACTION → PENDING → SERVER CONFIRM → TRANSITION
FIGMA_DEMO_LOOP != PRODUCT_BEHAVIOR
MOTION never creates freeze, acceptance, or Lucrare
```

Page 04 board `129:157`. Instant proof `130:588` → `130:897`.

Lane F (late): the connected source R5 freeze path still uses DISSOLVE 220. That source stays historical. DL1 closes the advisory on the extract, not by rewriting R5.
