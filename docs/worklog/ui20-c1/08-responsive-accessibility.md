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
ROMANIAN_WRAP = PASS
OVERFLOW = PASS
CLIPPING = PASS
HORIZONTAL_OVERFLOW = PASS
VERTICAL_TEXT_CLIP = PASS
PRIMARY_VALUE_CLIP = PASS
200_PERCENT_ZOOM = EXPECTED
```

C1 first-pass 768 proofs used fixed-height 8px text boxes inside clipped 24px shells, plus one 100px Cereri copy container. That is not overflow-safe. C1A corrected the five live 768 proofs by geometry, not by abbreviated copy.

```text
768_TEXT_LAW =
  related copy uses HEIGHT / HUG
  CLIPS_CONTENT = NO for normal copy
  MobileChrome and the 768 artboard may still clip as shells

MOBILE_LEAD_RULE =
  wrap at readable line-height
  or omit the lead
  never keep a vertically sliced sentence

CERERI_COPY_CONTAINER_BEFORE =
  166:532 width=100 clipsContent=true
  child CER-1042 · Nord Display width=182

CERERI_COPY_CONTAINER_AFTER =
  166:532 width=713 clipsContent=false

ACCIDENTAL_TEXT_CLIP_COUNT = 0
MENIU_44PX = 68x44 on all five proofs
STOC_PRIMARY_VALUE = -2,1 m width=58 height=21 unclipped
```

Live nodes: Cereri `166:523` · Client Hub `166:540` · Oameni `166:582` · Admin `166:595` · Stoc `166:628`.

Worklog evidence (support only; geometry is authority): `docs/worklog/ui20-c1/evidence/*-768-c1a.png`.

Ofertă 768 Valoare clip remains closed on DL1 extracts. C1 stock 768 still puts the sold figure on its own row so `-2,1 m` cannot clip.

## Attention levels

```text
QUIET = no mark + copy if needed
ATTENTION = ink 3px + semantic copy
BLOCKED_CURRENT = terracotta #9e470f + semantic copy
CRITICAL = not a fourth color; still blocked copy
```

R5 terracotta energy returns for blocker/current. Quiet and attention stay ink. No red/orange/yellow scale.
