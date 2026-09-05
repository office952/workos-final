# UI20-C1 — Responsive + accessibility

| Width | Law |
| --- | --- |
| 1440 | canonical family floorplan |
| 1280 | same job unless columns collide; C1 new families do not change materially |
| 768 | compact Meniu 44px shell; stack; no leftover desktop x-offsets |

```text
TARGET_44PX = YES
FOCUS = VISIBLE
KEYBOARD = YES
HEADINGS = H1_PER_PAGE
LANDMARKS = DESTINATIONS_PLUS_MAIN
COLOR_ONLY_STATE = NO
ROMANIAN_WRAP = YES
OVERFLOW = NO_CLIP_PRIMARY_VALUE
200_PERCENT_ZOOM = EXPECTED
```

Ofertă 768 Valoare clip remains closed on DL1 extracts. C1 stock 768 puts the sold figure on its own row so `-2,1 m` cannot clip.

## Attention levels

```text
QUIET = no mark + copy if needed
ATTENTION = ink 3px + semantic copy
BLOCKED_CURRENT = terracotta #9e470f + semantic copy
CRITICAL = not a fourth color; still blocked copy
```

R5 terracotta energy returns for blocker/current. Quiet and attention stay ink. No red/orange/yellow scale.
