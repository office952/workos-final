# UI20-R1 — Motion / dynamics

```text
MOTION_EXPERIMENT_COUNT = 4
LOOP = FORBIDDEN
REDUCED_MOTION = SAME_END_STATE
FIGMA_PAGE = 04 — Interaction + Motion
```

| # | Name | Node | START | TRIGGER | END | DURATION | EASING | WHAT STAYS STILL | REDUCED MOTION |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | OBJECT SELECT | `8:86` | FACE selected | click VOLUM | lens on VOLUM | 140 ms | EASE_OUT | Spine / identity | Instant lens |
| 2 | COMPLETE | `8:93` | needs-input | choose 60 mm | resolved + next action | 180 ms | EASE_OUT | Object title | Instant resolved |
| 3 | ADVANCE | `8:100` | Cerere current | confirm definition | Configurare current | 200 ms | EASE_OUT | Object identity | Instant stage tick |
| 4 | BLOCKED | `8:107` | action available | missing eligibility | action closed + cause | 0 + 120 ms cause | EASE_OUT | Surrounding list | Same end, no fade |

Law node `8:114`: reduced motion keeps the same end. Do not animate topology. No celebration. No loop.

## API note

`applyManualKeyframeTrack("OPACITY", string)` failed field validation. Setting `manualKeyframeTracks.OPACITY` on descendant `8:87` succeeded: 0 → 0.14s EASE_OUT, `playbackSettings.loop = false`. Timeline duration remains the default 2s hold after the one-shot — not a loop.

## Results (research, not Owner close)

- Select-as-relation is the only motion that consistently increases comprehension.
- Complete should resolve the field, not congratulate.
- Advance should compress the past, not parade the future.
- Blocked must show **cause**, not only disable.
- Color-only motion fails the no-color test.
