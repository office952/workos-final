# WorkOS UI/UX 2.0 — SIG1B Final Character Lock

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_SIG1B_FINAL_CHARACTER_LOCK
STATUS = IN_REVIEW
PARENT = UI20_SIG1A
H1_MERGE = NO
SIG1_MERGE = NO
CURRENT_PROMOTION = NO
FINAL_VISUAL_DIRECTION = NOT_OWNER_ACCEPTED
FINAL_IA = NOT_OWNER_ACCEPTED
UI20_IMPLEMENTATION = NOT_AUTHORIZED
REACT = HOLD
MASTER_POLISH = HOLD
LIBRARY_PUBLISH = NO
PR_CREATE = NO_WHILE_H1_UNMERGED
NEXT_STEP = CHATGPT_FINAL_SIG1_CHARACTER_LOCK_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
DIRECTION_CONFLICT = NO
```

## ChatGPT SIG1A live verdict (input)

```text
VERDICT = PASS_WITH_DIRECTION_HOLD_BEFORE_CURRENT_PROMOTION
ACCEPTED = CERERE, OFERTA, LUCRARE, ATELIER_DESKTOP, EXECUTION,
           RESPONSIVE_METHOD, MOTION_PROOF_METHOD, A11Y_PROOF_METHOD,
           VISUAL_REVIEW_BOARD
HOLD = CONFIG_FINAL_C1 not accepted as final configuration semantics
REASON = C1 horizontal spine readable as STEPPER (roles ≠ stages)
C2 = composition more honest but still card-stack-like
TARGET = C2 layer-assembly + C1 selected-relation − cards − stepper
```

## Identity

```text
REPO = office952/workos-final
BRANCH = design/ui20-sig1-signature-operational-instruments
HEAD_BEFORE = 41ff891690eea0176bcce53fa84fbc7c2e658b09
PARENT = b6614b59d2d8428453cc5111607d9903439304cc
ORIGIN_MAIN = 1533892bb16b54baf78714ae1dcba86b35f88172
H1_PR = 20
H1_MERGE = NO
FIGMA = 0XP0yGa1siWQdTTL7ou8xz page 80
```

SIG1A frames preserved as evidence. SIG1B is additive only.

## Why C1 rejected / C2 strengths

| Candidate | Semantic reading | Pro | Risk |
| --- | --- | --- | --- |
| C1 `206:66` | Horizontal spine | Precise selected relation + clean lens | STEPPER / progression |
| C2 `206:104` | Layer assembly | Composition honesty | Large detached cards |
| C3 `213:69` | Continuous construction body + relation | Parts/roles in one assembly; square anchors; relation to lens | Card-wall LOW (flat strips, radius 0) |

## C3 logic

- Dominant geometry = **composition** (vertical construction body + shared rail).
- Roles = flat strips inside one body, not floating cards, not numbered stages.
- Selected = square part-anchor + AttentionEdge + relation line → Context Lens.
- CTA = confirm selected **part**, not “next step”.
- Forbidden: progress bar, stepper dots, checkmarks, %, accordion, 3D/CAD.

## Structural stress test

Frame `214:97`:

- 2 parts: Față casetată / Cant
- 4 parts: Față / Volum / Spate / Iluminare
- 6 parts: generic Rol A–F placeholders (no invented product truth)

Same grammar; no visual collapse.

## Responsive C3 768

`214:66`: compact vertical assembly above Context Lens + action dock. No horizontal tab strip. `clipsContent`; no overflow intended.

## Cerere readiness assumption

Nodes `205:69` / `205:102` **not redesigned**.

Explicit note `214:175`:

```text
CERERE_RESOLVED_STATE_ASSUMPTION =
ALL OTHER COMMERCIAL READINESS BLOCKERS
ARE ALREADY RESOLVED IN THIS SYNTHETIC PROOF.
```

Does not encode “dimension resolved = offer ready.” ProductDefinition remains fail-closed.

## Atelier 768

`214:144`: denser flat rows (radius 0), group labels, AttentionEdge, local state. Desktop Atelier `209:90` unchanged. Card-wall risk reduced for scan speed.

## Shell / IA decoupling

```text
SIG1_SHELL_STATUS = CANDIDATE_ONLY
FINAL_IA = NOT_OWNER_ACCEPTED
```

Proof `214:182`: six page bodies without logo/nav labels — personality must survive sidebar or top-nav. Not a navigation redesign wave.

## Key Figma nodes

```text
SIG1B_SECTION = 213:66
CONFIG_C3_1440 = 213:69
CONFIG_C3_768 = 214:66
STRUCTURAL_STRESS = 214:97
ATELIER_768 = 214:144
CERERE_ASSUMPTION_NOTE = 214:175
SHELL_NEUTRALITY_PROOF = 214:182
FINAL_REVIEW_BOARD = 214:240

SIG1A_PRESERVED:
  CERERE = 205:69 / 205:102
  CONFIG_C1 = 206:66
  CONFIG_C2 = 206:104
  CONFIG_FINAL_C1 = 207:66
  OFERTA = 209:66
  LUCRARE = 207:101 / 208:134
  ATELIER = 209:90 / 208:155
  EXEC = 207:137 / 207:167 / 208:176
```

## Quality gates (agent claim; ChatGPT re-verifies live)

```text
CONFIG_C3_READS_AS_COMPOSITION = YES
CONFIG_C3_READS_AS_STEPPER = NO
CONFIG_C3_CARD_WALL_RISK = LOW
CONFIG_C3_SELECTED_RELATION = CLEAR
CONFIG_C3_CONTEXT_LENS = CLEAR
CONFIG_C3_768_NO_CLIP = YES
CONFIG_C3_768_PRESERVES_ASSEMBLY = YES
CONFIG_STRUCTURAL_STRESS_TEST_2_PART = PASS
CONFIG_STRUCTURAL_STRESS_TEST_4_PART = PASS
CONFIG_STRUCTURAL_STRESS_TEST_6_PART = PASS
CERERE_READY_ASSUMPTION_EXPLICIT = YES
ATELIER_768_CARD_WALL_RISK = LOW
SHELL_STATUS = CANDIDATE_ONLY
FINAL_IA = NOT_OWNER_ACCEPTED
```

## Evidence

`docs/worklog/ui20-sig1b/evidence/`

## STOP

C3 + 768 + stress + shell-neutrality + review board + worklog + commit + push. No merge, no CURRENT promotion, no React, no Master Polish, no library, no Cloud/real data.
