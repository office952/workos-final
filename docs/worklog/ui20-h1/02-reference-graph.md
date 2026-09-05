# UI20-H1 — Reference graph

```text
SAFE_TO_DELETE_DEFAULT = NO
BROKEN_PROTOTYPE_LINKS = 0
```

Inspected before any delete. Moves keep the same node IDs, so prototype destinations and instance `mainComponent` references stay valid.

## Current prototype (page 80)

Checked live after the y-offset lift (`y -= 20920`):

| SOURCE | DEST | STATUS |
| --- | --- | --- |
| `96:80` | `96:85` | intact |
| `96:163` | `96:168` | intact |
| `96:202` | `96:254` | intact |
| `96:756` | `96:340` | intact |
| `96:396` | `96:400` | intact |
| `96:763` | `96:456` | intact |
| `96:512` | `96:655` | intact |
| `96:515` | `96:517` | intact |
| `96:567` | `96:586` | intact |
| `96:681` | `96:690` | intact |
| `96:716` | `96:723` | intact |
| `96:1362` | `112:2` | intact |
| `96:1102` | `124:2` | intact |

```text
REFERENCED_BY_CURRENT_PROTOTYPE = YES
SAFE_TO_MOVE = YES
SAFE_TO_DELETE = NO
UNIQUE_EVIDENCE = YES
```

R4 verbs on `72:*` were not moved off their pages. They remain CANONICAL_EVIDENCE with live reactions (RESOLVE / SELECT / FREEZE / ENTER_WORK / COMPLETE).

## Component / instance

| ARTIFACT | COMPONENT_SOURCE | INSTANCE_DEPENDENCIES | SAFE_TO_DELETE |
| --- | --- | --- | --- |
| DL1 primitives `130:6`–`130:40` | source on 02 board `129:153` | DL1A + C1 instances | NO |
| DL1A Cerere/Ofertă/Exec | instances of ObjectRegister, JourneyPosition, AttentionEdge, ActionDock, CommercialLine | unique grammar proof | NO |
| C1 Client Hub / Persoană / Material | ObjectRegister `166:391` `166:292`; AttentionEdge `166:395`; MaterialIdentity `166:449` | current coverage | NO |
| Design Reserve `166:645` | held patterns | none promoted | NO |

## Variables / styles

```text
COLOR = VariableCollectionId:129:31 Light/Dark
SPACING / RADIUS / TYPOGRAPHY_REFERENCE / MOTION_DURATION = LIVE
LIBRARY_PUBLISH = NO
SAFE_TO_DELETE_VARIABLES = NO
```

## Documented references

Current `FRAMES.md` CURRENT UI20 MAP and this wave's `03-current-ui20-map.md` cite the ACTIVE node IDs. Historical worklogs still cite archived IDs. Those IDs were not deleted.

## Unique evidence gate

| SET | UNIQUE_EVIDENCE | SUCCESSOR | SAFE_TO_DELETE |
| --- | --- | --- | --- |
| R3 G1/G2 | YES — how G1 lost | R5 NS + C1 | NO |
| R3A / S1 | YES — signature path | S1-A accepted as history | NO |
| R4 stress | YES — personality without chrome | six-up `99:407` is later, not identical | NO |
| DL1 raw extracts | YES — INSTANCE_COUNT = 0 comparison | DL1A recomposed | NO |
| A–G systems | YES — direction hunt | G leading hypothesis | NO |
| Duplicate-looking 49:* siblings | UNCERTAIN | wrapper frames on 99 | NO |

Uncertain nodes were prefixed `ARCHIVE /` and kept.
