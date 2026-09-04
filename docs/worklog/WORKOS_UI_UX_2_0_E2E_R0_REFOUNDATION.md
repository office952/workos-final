# WorkOS UI/UX 2.0 E2E — R0 refoundation

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_R0_REFOUNDATION
STATUS = LOCAL_IN_REVIEW
KIND = RESEARCH + INFORMATION_ARCHITECTURE + SYSTEM_DESIGN_EXPLORATION
IMPLEMENTATION = NO
REACT_IMPLEMENTATION = HOLD
UI_CODE_WRITE = NO
CSS_WRITE = NO
DOMAIN_WRITE = NO
API_WRITE = NO
DB_WRITE = NO
PRODUCT_SYSTEM_REACT = HOLD
OS_S8 = HOLD
MACHINES_FC2 = HOLD
FIGMA_LIBRARY_PUBLISH = NO
REAL_DATA = NO
CLOUD_WRITE = NO
OWNER_ACCEPTED = NO
NEXT_STEP = CHATGPT_INDEPENDENT_UI20_R0_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
PRODUCT_SYSTEM_CANON_READ = YES
DIRECTION_CONFLICT = OWNER_PROGRAM_RESET_SUPERSEDES_UI_FC1B
CANON_REWRITE = NO
```

## Authority

Living V1 delivery authority remains `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.
Living UI/UX direction authority remains `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
This file does **not** rewrite those canons.

Owner-delegated program reset (this wave):

```text
NEW_PROGRAM = WORKOS_UI_UX_2_0_E2E
UI_DESIGN = CLEAN_SHEET
DOMAIN_REBUILD = NO
BACKEND_REBUILD = NO
PRODUCT_TRUTH_REBUILD = NO
CURRENT_RUNTIME = REFERENCE_AND_CONSTRAINT
CURRENT_FIGMA = RESEARCH_AND_HISTORICAL_REFERENCE
A3_1 = RESEARCH_INPUT_NOT_CANON
UI_FC1B_PRODUCT_SYSTEM_REACT = SUPERSEDED_NOT_IMPLEMENTED
```

The V1 roadmap still records `NEXT_RECOMMENDED_BUILD = UI_FC1_PRODUCT_SYSTEM_DESIGN` and `UI_GENERAL_REDESIGN = CLOSED_FOR_V1`. The Owner GO explicitly supersedes UI-FC1B React and opens a new experience program. ChatGPT review must decide whether the living roadmap/canon flags are updated. This wave only records the Owner decision.

Canon invariants that still bind the new program:

- UI projects business truth; it does not own it.
- Operator UI is Romanian. Internal names stay English.
- Unselected module is silent. Selected module is independently validatable.
- Technical settings live in Product System. Intake does not administer them.
- Resources own rate. Commercial owns price.
- No fake capacity, telemetry, utilization, or invented backend states.

Canon items now **reopened as exploration** (Owner direction change; not silently rewritten here):

- `UI_GENERAL_REDESIGN = CLOSED_FOR_V1` — closed for V1 polish, not for a named 2.0 program.
- `GLOBAL_SIDEBAR = STABLE` — may be kept, quieted, or complemented by a Journey Rail. Not discarded by this file.
- Page-by-page FC1 Product System React — held.

## Identity

```text
REPO = office952/workos-final
EXPECTED_ORIGIN_MAIN = fb0acbb0151236fd55d1a3a17b6746fbfd6f630d
FC1_BRANCH = design/ui-fc1-product-system-blueprint-v1
FC1_HEAD = 61a7ac7c1f6a877b024aad2c466ecdbd05ffc88d
RESEARCH_BRANCH = design/ui-ux-2-e2e-refoundation
NEW_FIGMA_FILE = WorkOS UI UX 2.0 — E2E
NEW_FIGMA_FILE_KEY = 0XP0yGa1siWQdTTL7ou8xz
NEW_FIGMA_URL = https://www.figma.com/design/0XP0yGa1siWQdTTL7ou8xz
HISTORICAL_FIGMA = 1ev5lg7m2Ze1h3Vqmax8ho
IA_HF_FIGMA = 7elwvIscvMPDiEHrX4f6kQ
ARCHITECTURE_C_FIGMA = Q8zfu4MZhsxLjJMGLHUHZh
```

FC1 branch history is preserved. Uncommitted A3.1 React leftovers stay uncommitted and are not this wave.

## Why this reset

Accumulated UI work is valuable and too stacked to keep polishing as if it were one language:

V3 historic · Architecture C · FC0 · A/B/C · A2 · A3 · A3.1 · experimental primitives · accepted frames mixed with studies · card/registry chrome · newer directions living on an older foundation.

A3.1 proved a real WorkOS reading — structure → relation → selection → context — and is the first visual language we would have been willing to ship. That does not make it the operating system of every page. Product System absorbed too much attention for one surface.

We are not rebuilding the application. We are redesigning the **experience**. Domain, API, ProductDefinition, Quote/Order law, and runtime contracts stay.

Success is no longer only “coherent and correct.”

> Îmi face plăcere să lucrez în WorkOS și simt că aplicația mă ajută să gândesc.

---

## A. E2E journey map

No invented backend states. Tokens below are already used in FC0 `JOURNEY.md`.

### J1 — Commercial

```text
Client → Cerere → Configurare → Ofertă → Acceptare → Comandă
```

| Stage | Object | User job | Primary action | Honest blocker |
| --- | --- | --- | --- | --- |
| Client | Customer | Find / open relationship | Deschide cerere / client hub | Missing identity |
| Cerere | CommercialRequest | Completeness / clarification | Completează / Configurează | Missing request-owned facts; installation UNCONFIRMED |
| Configurare | ProductTemplate + order config | Confirm exact definition | Confirmă definiția | Schema needs-input; unselected roles stay silent |
| Ofertă | Quote snapshot | Read frozen commercial decision | Trimite / deschide acceptarea | Live v2 freeze/PDF may be FUTURE_STAGE |
| Acceptare | Acceptance decision | Decide on the reviewed quote | Acceptă / refuză | Live acceptance route may remain refused |
| Comandă | Order snapshot | Hand to production | Deschide lucrarea | Copy only from valid accepted quote |

Deep links already exist for client, request, product+order, quote snapshot. UI 2.0 must preserve them and restore return context.

### J2 — Production

```text
Comandă → Pregătire → Lucrare → Atelier → Execuție → Finalizare
```

| Stage | Object | User job | Must not become |
| --- | --- | --- | --- |
| Pregătire | Release / plan projection | See what is allowed after order | Fake schedule |
| Lucrare | Job = order snapshot | Next allowed step | Recalculate / second product |
| Atelier | Operator inbox | What I can start now | Factory map / occupancy gauges |
| Execuție | Execution task | Do the work | Rewrite quote/order |
| Finalizare | Closed job | Confirm done | Invent planned-vs-actual UI ahead of Owner GO |

History compression: after production starts, Client → Cerere → Ofertă stay reachable and quieter. Atelier → Execuție dominate.

### J3 — Operational foundation

```text
Produs → Proces → Resursă → Utilaj → Persoană
```

This is infrastructure, not the first North Star slice.

| Object | Owns | UI may | UI must not |
| --- | --- | --- | --- |
| ProductTemplate | composition, allowed config | Show construction | Invent types / ghost roles |
| Process | required capability | Show referenced operations | Choose machine / execute |
| Resource | identity + rate | Link identity | Show selling price |
| Machine / workcenter | capability provider | Show eligibility | Fake busy/idle |
| Person | skills / eligibility | Preview who can start | Pontaj / salary |

---

## B. IA / navigation proposal

`IA_DIRECTION_COUNT = 2`

Neither is frozen. V3 one-sidebar is the current runtime constraint and a strong continuity candidate.

### IA-1 — Destination sidebar + object Journey Rail

Keep one global destination surface (current V3 categories as a starting map, names reopenable).

Add an **object-scoped Journey Rail** on Cerere / Configurator / Ofertă / Lucrare / Execuție:

```text
Cerere ── Configurare ── Ofertă ── Comandă ── Lucrare ── Execuție
```

Compact when the page is local work. Expanded when the user is changing stage. Not a decorative stepper. Completed / current / blocked / future use FC0 state vocabulary only.

Best continuity with current runtime. Risk: still feels like “app chrome + extra bar” if the rail is generic.

### IA-2 — Launchpad first, quieter destinations

Today `/` is Lucrări, not Acasă. Hidden registry already has Acasă.

North Star screen 1 tests a real Launchpad: work waiting, blocked objects, next actions — without inventing KPIs.

Sidebar remains one surface but becomes a destination index, not the emotional center. Object rail still exists.

Risk: fights the accepted “`/` is Lucrări” invariant. Only acceptable after Owner/ChatGPT accept a Home that is not a fake dashboard.

### Local navigation

- Registry → object: row / identity opens a stable page. No modal chain.
- Object → related object: deep link + return stack.
- Request → configurator → request: restore selected composition role, scroll, reviewed definition.
- Filters and search persist per registry.

The user must always answer:

```text
WHERE AM I?
WHAT AM I WORKING ON?
WHAT STATE IS IT IN?
WHAT MUST I DO?
WHAT HAPPENS NEXT?
```

---

## C. WorkOS 2.0 experience principles

1. One system, not 29 templates.
2. Orientation is free. The app tells you where you are.
3. The app leads. It does not babysit.
4. Important information comes toward the user.
5. Lists are for finding. Work happens on objects.
6. Objects live. A Cerere becoming a Lucrare is visible.
7. Each page has a job-specific signature.
8. All pages share one language.
9. Dynamics are semantic.
10. Density is earned. Emptiness is honest.
11. Industrial and calm. Not generic SaaS. Not pretty ERP.
12. Pleasure is a success criterion, not decoration.

Information priority before layout:

```text
P0  must understand immediately
P1  needed for the current decision
P2  contextual
P3  on demand
```

API response shape must not become visual hierarchy.

---

## D. Floorplan family

`FLOORPLAN_FAMILY = CANDIDATE_SET_NOT_FROZEN`

| Candidate | Job | First test |
| --- | --- | --- |
| REGISTRY | Find and open | Clienți / Cereri |
| OBJECT WORKSPACE | Live with one object | Client Hub |
| VERTICAL JOURNEY | Stage emphasis | Cerere / Lucrare |
| CONSTRUCTION WORKSPACE | Read / configure construction | Configurator; later Product System |
| CONTEXTUAL CONFIGURATION | Schema beside an object | Configurator sections; Resources evidence |
| DISPATCH | What I can start | Atelier |
| FOCUSED EXECUTION | One task | Execuție |
| LEDGER | Operational accounting | Resurse |
| CAPABILITY WORKSPACE | Eligibility topology | Utilaje / Oameni — after J1/J2 |
| ADMIN SETTINGS | Rare honest form | Date firmă |

Every floorplan must declare 1440 / 1280 / 768 structure that keeps the same mental model.

`OwnerCatalogView` is not a floorplan. It is the pattern 2.0 is leaving.

---

## E. Visual-language comparison

`SYSTEM_VISUAL_DIRECTION_COUNT = 3`

These are system characters, not three skins of one page.

| | A Precision Industrial | B Calm Operational | C Technical Editorial |
| --- | --- | --- | --- |
| Plane | Cool gray, tight | Warmer paper, more air | Near-white, type-led |
| Density | High, hairline | Medium | Selective |
| Border | Rules and geometry | Soft grouping | Few chrome lines |
| Selection | Geometric tint / ring | Quiet fill + relation | Typographic emphasis + one mark |
| Journey | Thin rail | More present rail | Editorial stage line |
| Form | Blueprint-adjacent | Workshop sections | Document sections |
| Closest research | A3.1 spine | Atelier / Cereri V3 calm | Quote-as-document |
| Risk | Laboratory, cold | Generic ops tool | Too much whitespace / magazine |

No direction is chosen in R0. North Star screens should be drawn **three times only after** ChatGPT picks a shortlist (likely A+B or A+C), not 21 finished screens.

---

## F. Motion / dynamics principles

```text
FOCUS              = immediate
SELECTION          = 100–160 ms
CONTEXT REVEAL     = 140–200 ms
STRUCTURAL CHANGE  = 180–240 ms
BLOCKED            = immediate + explanation
REDUCED MOTION     = same meaning, no animation
LOOP               = FORBIDDEN for selection / journey
```

Required dynamics:

```text
select     → context changes
complete   → state resolves
advance    → journey shifts
blocked    → cause appears
open       → context preserved
back       → exact place restored
```

A3.1 motion research to keep as a candidate: old selection settles out, new anchor appears, SelectedRelation path-trim, inspector ~6px settle, topology still. Do not inherit Figma `repeat: Infinity`. Runtime must be one-shot even if Figma tooling misreports loop.

Tokens are not published.

---

## G. North Star screen plan

`NORTH_STAR_SCREEN_COUNT = 7`

Not drawn as final operator UI in R0. Planned slice:

| # | Screen | Floorplan hypothesis | Signature hypothesis | P0 |
| --- | --- | --- | --- | --- |
| 1 | Home / Launchpad | DISPATCH-lite or new | Work waiting | What needs me |
| 2 | Cerere | VERTICAL JOURNEY + canvas | Completeness / clarification | What is missing |
| 3 | Configurator | CONSTRUCTION WORKSPACE | Construction + schema | Selected role / needs-input |
| 4 | Ofertă | OBJECT WORKSPACE | Commercial document | Frozen decision |
| 5 | Lucrare | VERTICAL JOURNEY | Lifecycle / readiness | Next allowed step |
| 6 | Atelier | DISPATCH | Worklist | What I can start |
| 7 | Execuție | FOCUSED EXECUTION | Focus workspace | The active task |

The slice must prove: one shell, one nav model, journey position, different personalities, dynamic forms, context lens, motion, 1440/1280/768, honest state including FUTURE_STAGE.

Do not design the other ~22 surfaces until this slice holds.

---

## H. Current design / research assets worth transferring

Transfer as **ideas**, not artboards. Do not move or delete historical frames.

| Asset | Keep as |
| --- | --- |
| FC0 29-page audit, PAGE_RECORDS, PAGE_MATRIX | Inventory + severity |
| FC0 JOURNEY state vocabulary | Binding constraint |
| Full-width content plane | Binding candidate |
| Page visual signature methodology | Binding method |
| User-first page questions | Binding method |
| Vertical Journey | Candidate chrome |
| Context Lens | Candidate primitive |
| Semantic Spine / Anchor / Branch | Candidate primitive |
| A3.1 open footing, selected relation, ACM silence | Candidate construction reading |
| Progressive / schema-driven forms | Binding for Configurator |
| Figma Motion one-shot lesson | Binding for motion law |
| Capability topology (no gauges) | Binding for Machines later |
| 1440 / 1280 / 768 + 768 Meniu/Cont | Binding viewports |
| Accessibility law (44, focus, landmarks, reduced motion) | Binding |
| Architecture C Resources density | Ledger research |
| V3 Clients / Cereri / Hub | Relationship + request research |
| Atelier inbox | Dispatch research |

Historical files stay:

- `7elwvIscvMPDiEHrX4f6kQ` — IA / first HF lot
- `1ev5lg7m2Ze1h3Vqmax8ho` — V3 + FC1 Product System
- `Q8zfu4MZhsxLjJMGLHUHZh` — Architecture C

---

## I. Current patterns rejected as default 2.0 law

Rejected means “do not continue as the default.” A pattern may still appear where the job needs it.

- Generic dashboard / bento / KPI-first composition
- Card-per-fact and nested card stacks
- Large empty bordered shells
- Lists-over-lists as the work surface
- `OwnerCatalogView` as Product System / Machines / People
- Ghost VOLUME / LIGHTING / Halo / full-aluminium furniture
- Product-code React branches
- Permanent button farms
- Color-only status
- Decorative or looping motion
- Modal chains for object-to-object travel
- Recalculation on Quote / Job
- Rates or selling price in Product System
- Fake capacity / busy-idle / shop-floor replacing Atelier
- Big-bang React rewrite
- Publishing experimental primitives to the shared library
- Continuing clean-sheet work in the crowded Figma file
- Treating “it was designed first” as “it is canon”

---

## J. Product System implication

```text
CURRENT_A3_1_STATUS = RESEARCH_INPUT_NOT_CANON
PRODUCT_SYSTEM_RECOMMENDATION = DEFER_UNTIL_NORTH_STAR_LANGUAGE
PRODUCT_SYSTEM_REACT = HOLD
```

A3.1 remains the strongest construction-reading research we have. Keep:

- composition-driven topology
- no ghost roles
- open footing ≠ fifth role
- selected relation as contextual UI
- inspector as typography + accent
- LIGHTING branch as presentation, not domain “belongs to VOLUME”

Do not implement A3.1 in React as UI-FC1B.

After the North Star language is accepted, Product System is a **construction definition workspace** in that language — administration of templates, not the commercial configurator, and not a catalog dump.

---

## K. Machines implication

```text
MACHINES_RECOMMENDATION = HOLD
MACHINES_FC2 = HOLD
```

FC0 already has an honest Utilaje information model trapped in catalog chrome. 2.0 may later give it a capability workspace.

Do not start Machines implementation. Do not invent occupancy, telemetry, or a shop-floor that replaces Atelier.

---

## L. Implementation migration strategy

No big-bang rewrite. Old runtime stays until a slice replaces it.

```text
1. Accept R0 (this file + new Figma lab)
2. Choose system direction shortlist
3. Draw North Star 7 screens in that language
4. Prototype J1, then J2
5. Migrate runtime by coherent slices:
   Commercial journey
   → Production journey
   → Resources
   → People
   → Administration (including Product System)
6. Share shell/primitives only after a slice proves them
```

Each slice: existing domain projection → UI replacement → E2E on synthetic runtime → Owner accept → then the next slice.

---

## External reference study

Not visual cloning. Cognitive tasks only.

| Reference | Problem it solves | Borrow | Reject | Why WorkOS |
| --- | --- | --- | --- | --- |
| Figma (product) | Selection owns inspector | Context Lens, object continuity | Design-tool metaphor | Operators select construction/work, not layers |
| SAP Fiori | Floorplan family + object page | Named floorplans, intent | Fiori chrome / tile walls | We need a small family, not a SAP skin |
| Siemens IX | Industrial calm | Restraint, status discipline | SCADA / HMI cosplay | Workshop software, not a control room |
| IBM Carbon | Dense productive UI | Type + table discipline | Enterprise heaviness | Experts need density without IBM brand |
| PatternFly | Ops empty/error/filter | Honest empty/error | Widget dashboard default | Registries need this; work pages do not |
| AWS Cloudscape | Split panel / help | Optional context panel | Console density + AWS IA | Lens may split; WorkOS is not a cloud console |
| Fluent | Commanding + motion | Action morph, motion restraint | Office look | Next action should change with state |
| High-performance HMI | Color = alarm | Status ≠ decoration | Gray control-room aesthetic | Office + atelier, not ASM board |
| CAD / product structure | Assembly reading | Spine / structure first | CAD chrome | Configurator + Product System |
| MES worklists | Dispatch | What I can start | Shop-floor map as home | Atelier is inbox |

---

## Smart modularity

UI 2.0 must work for:

- advanced company, many ProductTemplates
- small/manual company, 1–2 templates
- unused families ignored (Halo / full aluminium stay empty)
- later template enablement
- different machine / people depth
- historical Quote/Job snapshots untouched

No client code fork. No Cursor required for normal use. No direct DB for normal viewing.

---

## Figma R0

New file created on the existing Pro team (`Axinte Remus's team`). Historical file was not mutated.

See `docs/worklog/ui-20/FRAMES.md`.

R0 boards are research posters, not finished screens. Page 80 Prototypes is empty on purpose.

---

## Independent Cursor opinion

The reset is the correct move. A3.1 was about to become another locally optimized peak: a better Product System sitting on a still-generic application. Shipping it would have raised one page and made the rest look older.

The danger of 2.0 is the opposite: designing a beautiful system that forgets the already-true journeys and starts inventing Home KPIs, floorplan poetry, or a second navigation religion. IA-1 plus A/B visual comparison is the safest first bet. Launchpad (IA-2) is worth a North Star test, not a silent replacement of `/` = Lucrări.

Pleasure as North Star is usable if we keep it operational: orientation, next action, continuity, honest blockers. If it becomes mood boards, we will have wasted the research we just correctly demoted.

```text
INDEPENDENT_CURSOR_OPINION = 88/100 on the program reset
ALIGNMENT_WITH_OWNER_DIRECTION = 92/100
```
