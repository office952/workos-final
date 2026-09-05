# UI20-DL1 — Accessibility foundation

Accessibility is architecture.

## TARGET_SIZE_44PX

Primaries and Meniu stay 44. Focus demo `129:151`.

## KEYBOARD_MODEL

Tab order: object register → current work → primary → secondary. Command `Ctrl+K` is optional acceleration, not the only path. 768 Meniu is the destination map, conceptually open/close.

## FOCUS_LANGUAGE

2px ink ring. Not color-only. Not underline-as-focus.

## LANDMARKS_AND_HEADINGS

Banner = Destinations or Meniu. Object ID is the work-object name. Page instrument title is next. Current work heading follows. Actions last.

## SR_NAMING_MODEL

Romanian operator language. Object ID spoken. Cause spoken. No DTO names, hashes, or compiler words.

## CONTRAST_LAW

Light ink on paper. Dark cream on charcoal where the page is actually charcoal. Ofertă dark children are light surfaces with `#141619` text. `OFERTA_DARK_REAL_CONTRAST_RISK = NO`.

## OVERFLOW_CLIP_LAW

`COLUMN_HEADER_BOUND_TO_COLUMN`. Text wraps (`textAutoResize = HEIGHT`). No desktop x after 768.

## ZOOM_200_EXPECTATIONS

Flex description column wraps. Fixed qty/value tracks stay readable. Buttons do not shrink below 44.

## REDUCED_MOTION_SEMANTIC_EQUIVALENT

| Verb | Instant meaning |
| --- | --- |
| RESOLVE | Item already in CUNOSCUT; blocker gone |
| SELECT | Selected part + context already present |
| FREEZE | Frozen artifact already shown |
| ENTER_WORK | Row already in În lucru; action already Continuă |
| ADVANCE | Next operation already owns focus |
| COMPLETE | Current already in history |
| COMPRESS | History already one line |

Proof: `130:588` → `130:897` instant. MOTION_OFF Ofertă sources remain `73:837` / `73:897`.

```text
OFERTA_768_VALUE_CLIP = CLOSED
R5_REDUCED_MOTION_ADVISORY = CLOSED
```
