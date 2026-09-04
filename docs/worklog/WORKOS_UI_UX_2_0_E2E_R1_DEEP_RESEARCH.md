# WorkOS UI/UX 2.0 E2E — R1 deep research

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_R1_DEEP_RESEARCH_AND_SYSTEM_DIRECTION
STATUS = LOCAL_IN_REVIEW
KIND = RESEARCH + EXPERIENCE_ARCHITECTURE + SYSTEM_DIRECTION_LAB
IMPLEMENTATION = NO
UI_CODE_WRITE = NO
CSS_WRITE = NO
DOMAIN_WRITE = NO
API_WRITE = NO
DB_WRITE = NO
PRODUCT_SYSTEM_REACT = HOLD
MACHINES = HOLD
OS_S8 = HOLD
FIGMA_LIBRARY_PUBLISH = NO
OLD_FIGMA_WRITE = NO
REAL_DATA = NO
CLOUD_WRITE = NO
OWNER_ACCEPTED_VISUAL_DIRECTION = NO
CURSOR_CLOSED_DIRECTION = NO
NEXT_STEP = CHATGPT_INDEPENDENT_UI20_R1_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
DIRECTION_CONFLICT = NO_LIVING_FLAGS_RECONCILED_TO_OWNER_RESET
```

## Authority

Living delivery: `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.
Living UI/UX: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
This file does not create a second roadmap or a second canon.

Owner R0 independent verdict (`DIRECTION_ACCEPTED / R0_NOT_COMPLETE`) stands. R1 raises the ceiling: real systems, real IA, real dynamics. Cursor does not pick the visual or IA winner.

## Identity

```text
REPO = office952/workos-final
ORIGIN_MAIN = fb0acbb0151236fd55d1a3a17b6746fbfd6f630d
RESEARCH_BRANCH = design/ui-ux-2-e2e-research-v1
BASE = fb0acbb0151236fd55d1a3a17b6746fbfd6f630d
FC1_BRANCH_PRESERVED = design/ui-fc1-product-system-blueprint-v1
R0_EVIDENCE_BRANCH_PRESERVED = design/ui-ux-2-e2e-refoundation
NEW_FIGMA = 0XP0yGa1siWQdTTL7ou8xz
HISTORICAL_FIGMA = 1ev5lg7m2Ze1h3Vqmax8ho
```

## Supporting directory

`docs/worklog/ui20-r1/`

| File | Content |
| --- | --- |
| 01-reference-patterns.md | 26 analyzed patterns + 3 support |
| 02-current-figma-audit.md | Old file as design-system artifact |
| 03-cognitive-task-map.md | Perceive / decide / act |
| 04-ia-comparison.md | IA-1 vs IA-2, no close |
| 05-system-direction-comparison.md | A/B/C/D philosophies |
| 06-motion-dynamics.md | Four semantic interactions |
| 07-form-as-application.md | Four form models |
| 08-page-signatures.md | 12 page personalities |
| 09-decision-matrix.md | Scores + fatals, no average winner |
| 10-next-north-star-plan.md | 7 wires only |

## Figma factual pages

14 pages exist. Do not report planned pages as missing or extra.

| Page | ID |
| --- | --- |
| 00 — North Star | `0:1` |
| 01 — Foundations | `1:2` |
| 02 — Core Design System | `1:3` |
| 03 — Operational Language | `1:4` |
| 04 — Interaction + Motion | `1:5` |
| 05 — Floorplan Lab | `1:6` |
| 10 — E2E Commercial | `1:7` |
| 20 — E2E Production | `1:8` |
| 30 — Resources | `1:9` |
| 40 — People | `1:10` |
| 50 — Administration | `1:11` |
| 80 — Prototypes | `1:12` |
| 90 — Research Transfer | `1:13` |
| 99 — Deprecated | `1:14` |

## System specimens

| Dir | Name | Node |
| --- | --- | --- |
| A | Precision Industrial | `6:2` |
| B | Calm Operational | `7:2` |
| C | Technical Editorial | `8:2` |
| D | Continuous Object Tool | `10:132` |

A/B/C are mini-systems (shell, registry, object, journey, config, ops, states, type, dark, motion). They are not the seven North Star screens.

## IA

| Dir | Node | Recommendation |
| --- | --- | --- |
| IA-1 Destination + rail | text `8:52` · desktop `10:2` · 768 `10:32` | Not selected |
| IA-2 Launchpad first | text `8:70` · desktop `10:43` · 768 `10:63` | Not selected |

## Navigation pleasure (artifact)

WorkOS must never make the operator reconstruct place.

| Concern | Rule |
| --- | --- |
| Instant orientation | Destination (or launchpad) + object identity + journey position in one glance |
| Deep linking | Every object has a stable URL; related objects are links, not modal stacks |
| Back / forward | Browser works. Explicit “înapoi la {code}” restores selection + scroll + filter |
| Preserved filters / scroll | Registry exit is not a reset |
| Breadcrumbs vs lineage | Lineage is object family (client/cerere/ofertă/lucrare). Breadcrumb is place. Do not merge them into one chrome |
| Recent objects | First-class, especially for IA-2 |
| Command / search | Jump by code (CER-1042) and name. Not a second app |
| Keyboard | Registry, filter, open. Not required for execution focus |
| Return context | Configurator → Cerere restores role + scroll |
| Cross-object | Change room without losing the previous object in Recent |

## Design-system architecture (proposal, not a library)

| Level | Belongs | Library? | Page-specific? | Experiment? |
| --- | --- | --- | --- | --- |
| FOUNDATIONS | Type, color, space, density, state, focus, 44px | Later | No | Modes per direction |
| CORE UI | Button, field, select, link, focus ring | Candidate | No | Yes until direction chosen |
| DATA DISPLAY | Table, ledger row, empty/error | Candidate | Registry density varies | No metric-card default |
| OPERATIONAL PRIMITIVES | Spine, lens, journey, attention, readiness, capability | After language settles | Composed per page | Yes now |
| FLOORPLANS | Registry, object, journey, construction, dispatch, execution, ledger, capability, admin | Never as one component | Yes — floorplan is a page law | Names not frozen |
| INTERACTION | Four semantic motions, Action Morph | Spec first | Timing may vary | Yes |
| DOMAIN COMPOSITIONS | Quote snapshot reader, eligibility board | No | Yes | After North Star |

No publish.

## Plugin strategy (study only)

Do not install random plugins. If a mechanical problem repeats, a WorkOS helper beats a marketplace pile.

| Helper | Leverage now |
| --- | --- |
| WorkOS Frame Manifest | High — node IDs already leak without it |
| WorkOS 44px / Focus Audit | High before any implementation |
| WorkOS Semantic Alignment Audit | Medium — after a direction is chosen |
| WorkOS Responsive Evidence Generator | Medium |
| WorkOS Blueprint Builder | Low until Product System language is chosen |
| WorkOS Navigation State QA | Medium after IA choice |

R1 does not build these.

## Product System after research

```text
PRODUCT_SYSTEM_POST_RESEARCH_VERDICT = SYNTHESIZE_A3_1_WITH_UI20
```

If A3.1 had never existed, we would still invent **structure → relation → selection → context**. We would not invent A3.1 as the visual operating system of Home, Quote, Atelier, and Resources.

- `CONTINUE_A3_1` — rejected (sunk-effort gravity; page personality collapse).
- `REBUILD_PRODUCT_SYSTEM_UI` — too violent; throws away the only proven WorkOS reading.
- `SYNTHESIZE_A3_1_WITH_UI20` — keep the reading; force it to compete inside the winning 2.0 system.

## Machines after research

```text
MACHINES_POST_RESEARCH_DIRECTION = CAPABILITY_WORKSPACE_NOT_ASSET_REGISTRY
```

Machines need: identity, capability, operation requirement, eligibility, manual-area flexibility. Best hosted by operational primitives (capability node + eligibility), not by ClientRegistryCard clones. Visual language: A or a synthesized A/C can carry capability; B must not soften it into consumer tiles; D can inspect a machine as a continuous object. No Machines page in this wave.

## Smart modularity

Every candidate was checked against: advanced production, small/manual, module disabled, module enabled later, different templates, different machine adoption, different people-depth. Empty destinations must be silent. No company-specific fork.

## Independent Cursor opinion (not Owner close)

Aim higher than the R0 text cards — that part of the Owner reset is already paying off. A is the most WorkOS-like and the most dangerous (A3.1 gravity). B is the most humane and the most generic. C is the strongest identity and the weakest shop-floor. D is justified as a research probe, not as a default winner. IA-1 is safer; IA-2 is more pleasurable; a later quiet-destination synthesis is allowed only after review.

Do not implement. Do not publish. Do not draw the seven polished screens.
