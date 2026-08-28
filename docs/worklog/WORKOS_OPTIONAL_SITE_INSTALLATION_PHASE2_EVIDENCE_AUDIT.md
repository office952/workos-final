# Phase 2 installation evidence readiness audit

Read-only. Does not authorize Phase 2 write, transport, live Cerere PATCH, or quote create.

```text
STATUS                         = AUDIT_COMPLETE
BASE_HEAD                      = 04bebc6e811374d41ecfcfe5cc5559549672356a
OPTIONAL_SITE_INSTALLATION_V1  = INTEGRATED_ON_MAIN
PHASE_1                        = INTEGRATED_ON_MAIN
PHASE_2                        = NOT_STARTED / NOT_AUTHORIZED
TRANSPORT_IMPLEMENTATION       = NOT_STARTED / NOT_AUTHORIZED
FIRST_REAL_LETTERS_JOB         = BLOCKED_BEFORE_QUOTE
REAL_CLOUD_WRITE               = NO
LIVE_REQUEST_READ              = NO
LIVE_REQUEST_PATCH             = NO
```

Runtime and current code win over historical docs.

## Sources

Read in full: `AGENTS.md`, `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`, `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`, `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md`, `docs/architecture/COMMERCIAL_REQUEST_CANON.md`, `docs/architecture/QUOTE_SNAPSHOT_CANON.md`, `docs/worklog/WORKOS_OPTIONAL_SITE_INSTALLATION_V1.md`.

Also inspected: `packages/domain/src/installation/scope.ts`, `packages/domain/src/requests/commercialRequest.ts`, `packages/domain/src/resources/catalog.ts`, `packages/domain/src/resources/recipes.ts`, `packages/domain/src/resources/eic.ts`, `packages/domain/src/people/identity.ts`, `packages/domain/src/customers/identity.ts`, `packages/domain/src/commercial/price.ts`, `packages/domain/src/commercial/quoteSnapshot.ts`, `packages/domain/src/inventory/stock.ts`, `packages/domain/src/workcenters/`, `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`, admin Resources / Cost write path.

Independent lanes (read-only, no repo writes): installation completeness; resources/costs/providers; organization/operability; commercial snapshot / Phase 3 boundary.

## Current runtime (Phase 1)

```text
PERSISTED_INSTALL_FACT     = commercial_request_optional_scopes (request_id, scope_id, selected_at)
SELECTION                  = optionalScopeIds includes SITE_INSTALLATION
UNSELECTED                 = silent (null projection)
SELECTED                   = INSTALLATION_EIC PARTIAL, empty lines, total 0, operator view strips money
INCOMPLETE_REASONS         = five static labels, always shown when selected, never cleared
MODES_IN_CODE              = NONE
FREEZE_AND_LINK            = incomplete_offer until installation EIC is COMPLETE
QUOTE_SNAPSHOT             = product-only schema v1
```

`projectSiteInstallationScope` does not read Resources / Cost. There is no COMPLETE path in code.

`200 EUR + TVA` is Owner-decided customer selling price in canon only. It is not in code and cannot complete EIC.

## Evidence matrix

Evidence classes: `OWNER_CONFIRMED` | `CANONICAL_FOUNDATION` | `RUNTIME_PROVEN` | `SYNTHETIC` | `INFERRED` | `UNKNOWN`.

| COST_OR_FACT_ELEMENT | REQUIRED_FOR_MODE | CURRENT_MODEL | CURRENT_SOURCE | CURRENT_API | CURRENT_UI | CURRENT_DATA | EVIDENCE_CLASS | OWNER_CONFIRMED | REUSABLE | MISSING | REQUIRED_OWNER_DECISION | RECOMMENDED_CONFIGURATION_SURFACE | BLOCKS_INSTALLATION_EIC | BLOCKS_COMMERCIAL | BLOCKS_PHASE_3_ONLY |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mode NOT_SELECTED / INTERNAL / SUBCONTRACTED | When Owner wants a COMPLETE install | Boolean selection only | Canon modes; code has no enum | PATCH `optionalScopeIds` | Cerere checkbox | Scope row only | CANONICAL_FOUNDATION + RUNTIME_PROVEN (selection) | Modes decided; surface not | Selection model yes; mode no | Typed mode, persistence, who may change after linked Quote | Where mode is set (Cerere vs org default) | Cerere associated scope; later optional org default | Yes — no COMPLETE path without mode | Today selection alone blocks freeze | No |
| Internal install labor | INTERNAL | None for site. LETTERS labor recipes exist (bonding, closure, forming, CNC) | `costEvidence` OWNER_CONFIRMED_WORKSHOP manufacture rates | Resources cost-evidence write | `/admin/resources` | Workshop rates only | OWNER_CONFIRMED for workshop; UNKNOWN for site | Workshop yes; site no | CostEvidence + recipe pattern yes | Site-install resource + Owner amount + unit | EUR/job vs EUR/hour | Resources / Cost — new install resource, not a LETTERS recipe | Yes for INTERNAL | Yes until EIC COMPLETE | No |
| Employee / pontaj / payroll cost | Never as offer formula | People operational identity, skills, eligibility | `people/identity.ts`; HR/PAYROLL/PONTAJ = NOT_IMPLEMENTED | People admin / operator session | `/admin` people | No hourly employee cost | RUNTIME_PROVEN (absence) | N/A | People as later crew eligibility only | Must not become customer price | Confirm HR stays signal, not formula | People stays attendance; rate stays Resources / Cost | No if labor uses resource rate | No | No |
| Subcontracted install | SUBCONTRACTED | No supplier entity; no validity window on live evidence (supersede exists on stored rows) | None | None | None | None | UNKNOWN | No | CostEvidence classification/source pattern yes | Supplier cost evidence, unit, validity | EUR/job vs documented unit; validity required? | Resources / Cost supplier evidence | Yes for SUBCONTRACTED | Yes | No |
| Fixings / consumables | When chosen fixing consumes stock | Material catalog + `isStockableResource` = MATERIAL only | Workshop materials (plexiglas, forex, ACM, vinyl) | Inventory OUT on complete when stockable | `/admin/resources`, Stoc | No facade fixings | CANONICAL_FOUNDATION | No for site fixings | Resource identity + optional Inventory | Fixing identity / package | Package vs itemized; Inventory optional | Resources / Cost; Inventory only if company stocks | Yes when fixing consumes cost | Yes | No |
| Access equipment | When height/access requires it | None. Workcenters/machines are workshop CNC/weld/forming/assembly | Shop-floor capability providers | Workcenter inspection | `/admin/workcenters` | Workshop equipment only | CANONICAL_FOUNDATION | No | Provider-join idea later; not as production machine | Owned vs hire cost evidence; trigger | When mandatory; owned vs hire | Resources / Cost or later hire provider — not a workshop machine | Yes when applicable | Yes | Height as separate Quote line is later Owner decision |
| Site electrical | When included | Static reason `SITE_ELECTRICAL_UNCONFIRMED`. `SVC-ELECTRICAL-FINISH` and `SVC-PLACE-LED-MODULES` are workshop | LETTERS electrical finish / LED mount service | Product EIC | Configurator EIC details | Workshop electrical only | OWNER_CONFIRMED workshop; must not reuse | Workshop yes; site no | Exclusion-text pattern missing | INCLUDED / EXCLUDED / SUBCONTRACTED / NOT_APPLICABLE | Default for front-lit LETTERS | Resources / Cost or explicit exclusion | Yes when applicable | Yes | No |
| Site address | Selected install | Customer `address` / `city` only | Customer profile | Customer PATCH | Client workspace | Customer address, not execution site | RUNTIME_PROVEN (customer address) | Customer profile exists | Do not treat as site address | Distinct execution site address | Always distinct when selected? | Cerere / later install configuration | Yes per canon table | No | No |
| Site measurements / height / access / facade / fixing | Conditional per canon | Five static incomplete reason IDs; no inputs | `SITE_INSTALLATION_INCOMPLETE_REASON_IDS` | Request detail `installationScope` | Configurator PARTIAL list | None captured | RUNTIME_PROVEN (labels) | No | Reason IDs reusable | Captured facts + conditional emit | Which facts stay mandatory vs mode-conditional | Install configuration on Cerere or later install surface | Yes while required and missing | Indirect | No |
| Crew size / duration | INTERNAL in canon table | None | Canon only | None | None | None | CANONICAL_FOUNDATION | No | Later execution planning | Whether they are EIC drivers | Required for EIC or only later execution? | Install configuration if EIC is hourly | Only if labor unit is hourly | No | Execution Phase 5 |
| Exclusions / customer responsibilities | COMPLETE commercial install offer | None | Canon Phase 3 PDF target | None | None | None | CANONICAL_FOUNDATION | No | No | Exclusion text | Standard exclusion set | Offer / Phase 3 | Commercial COMPLETE | Yes | Yes |
| Transport | Separate optional scope | Static reason `TRANSPORT_UNCONFIRMED` inside install projection | Install scope labels | Same PARTIAL list | Same list | None | RUNTIME_PROVEN (misplaced label) | No | Must not stay inside INSTALLATION_EIC | Own scope / own EIC | None in this audit (Phase 3) | Own optional scope | Must not block INSTALLATION_EIC once Phase 2 is honest | Own commercial | Yes |
| Customer 200 EUR + TVA | Never for EIC | Not in code | Owner decision 2026-08-28 | None | None | None | OWNER_CONFIRMED commercial decision | Yes as selling price | Must not enter CostEvidence as install EIC | Fixed commercial representation | How commercial COMPLETE is granted without cost-plus | Later commercial line / Owner-confirmed fixed price | No | Yes if cost-plus is applied to install EIC | Yes for multi-line Quote |

## 1. Mode and provider

```text
NOT_SELECTED                 = implemented (default [])
INTERNAL_INSTALLATION        = Owner-decided, not in code
SUBCONTRACTED_INSTALLATION   = Owner-decided, not in code
```

Today the office can only select or clear `SITE_INSTALLATION` on the Cerere. After a Quote is linked, customer is locked; `optionalScopeIds` are still mutable. Changing selection after a product-only Quote exists does not rewrite that Quote; it blocks new links while selected and incomplete.

No org-level on/off. Administration map forbids a global Settings dump. Resources / Cost already owns purchase and workshop rates.

## 2. Internal installation

Reusable: `CostEvidence` (`resourceId`, EUR, `perUnit`, `classification`, `source`, optional `when`, `supersededAt` on persisted rows) and SERVICE/LABOR recipes. Current `ResourceUnit` values are only `m`, `m2`, and `buc`. There is no `hour` or `job` unit. An INTERNAL EUR/job or EUR/hour rate needs a new unit or a documented `buc` = one job convention — that is a model gap, not an invented rate.

Not reusable as site labor: CNC, forming, bonding, closure, vinyl application, LED module placement (`SVC-PLACE-LED-MODULES`, Owner-confirmed workshop “LED installation service”).

People can later constrain who may execute teren tasks. They must not supply the offer formula. No employee hourly cost exists.

## 3. Subcontracted installation

No supplier catalog, no per-job supplier cost, no currency/VAT/period UI for a subcontractor invoice. Cost-evidence admin write can store an amount against a future resource; it does not model a supplier identity or expiry. `supersededAt` is the only existing replacement mechanic.

Supplier cost ≠ customer price.

## 4. Fixings and consumables

Materials are reusable identities. Only `kind === MATERIAL` is stockable. Inventory reservation/purchasing is not implemented. A company can have a costed resource without stock movements. Do not force Inventory.

No facade fixing resource exists.

## 5. Access equipment

Workshop machines/workcenters are production capability providers. A ladder, scaffold, or hire lift is not a CNC/weld station. Do not add access equipment as a shop-floor machine without a later semantic Owner decision. Height access stays inside installation until that later decision.

## 6. Site electrical

Do not reuse LETTERS electrical finish or LED mount. Needed contract: `INCLUDED` | `EXCLUDED_CUSTOMER_RESPONSIBILITY` | `SUBCONTRACTED` | `NOT_APPLICABLE`. Evidence only for included/subcontracted.

## 7. Site facts

Customer address is not execution-site address. No site measurements, height, facade, fixing, unload, crew, duration, or exclusions are persisted. Current incomplete reasons do not include facade/fixing/crew; they always include transport, which the canon treats as a separate scope.

## 8. Transport boundary

```text
TRANSPORT_MODEL          = SEPARATE_OPTIONAL_SCOPE / QUOTE_LINE
TRANSPORT_EIC            = SEPARATE
TRANSPORT_IMPLEMENTATION = NO
```

Existing evidence: none. The install PARTIAL list showing “Transportul nu este confirmat.” is a Phase 1 honesty label, not a transport engine. Phase 2 must not complete or price transport. Phase 2 should stop treating transport as an installation EIC blocker once modes and install evidence exist.

Montaj without transport and transport without montaj remain valid later.

## 9. Commercial 200 EUR + TVA

```text
200 EUR + TVA = CUSTOMER_COMMERCIAL_PRICE
```

`projectCommercialPrice` is the only projector and is cost-plus on EIC. If Phase 2 marks installation EIC COMPLETE and reuses that projector, the sold install price would become markup + VAT on internal cost, not 200 EUR + TVA. That would violate the Owner decision.

Discount/adjustment exist on the policy at 0; they are not an install fixed-price engine.

Historical Quotes stay immutable. Later rate changes must not rewrite them.

Quote Snapshot v1 is one product, one EIC, one commercial block, one frozen production input (LETTERS operations). No optional-scope lines. Phase 2 must not add Quote schema V2, PDF, Order, or ExecutionPlan.

## Smart modularity

```text
AVAILABLE_MODES                    = NOT_SELECTED in runtime; INTERNAL + SUBCONTRACTED decided, not implemented
DEFAULT_MODE                       = NOT_SELECTED
CONFIGURATION_SURFACE              = Cerere checkbox today; Resources / Cost for later rates; no org on/off
CUSTOMER_OPERABLE_WITHOUT_CURSOR   = YES for Phase 1 select/deselect after deploy; NO for COMPLETE install
DISABLED_BEHAVIOR                  = silent
INTERNAL_BEHAVIOR                  = not implemented; must use own EIC, not LETTERS recipes
SUBCONTRACTED_BEHAVIOR             = not implemented; must consume supplier evidence
DEPENDENCIES                       = Request selection; later mode, site facts, cost evidence
SAFE_FALLBACK                      = unselected / PARTIAL / freeze refused
DATA_RETENTION                     = selection rows only
SNAPSHOT_IMPACT                    = existing Quotes immutable; new link blocked while install incomplete
PERMISSION_MODEL                   = Request PATCH + owner cost-evidence write + commercial freeze gates
ADMIN_TOOLING_DEBT                 = YES — no org-level on/off
NO_CLIENT_CODE_FORK                = YES
```

Scenarios:

1. HUB MEDIA internal — blocked: no site labor evidence, no mode.
2. HUB MEDIA subcontracted — blocked: no supplier evidence, no mode.
3. Company without montaj — works today (unselected silent).
4. Small company, simple manual montaj — needs one Owner-confirmed install cost resource; Inventory not required.
5. Company enabling montaj later — add scope selection; no fork.
6. Cost change after accepted Quote — live Resources change; frozen Quote unchanged. New freeze uses new evidence.
7. Expired supplier evidence — no validity window in runtime; would need a rule before SUBCONTRACTED can be COMPLETE.
8. Transport without montaj — not implemented; must stay a separate scope.
9. Montaj without transport — intended; current static transport reason wrongly lists transport inside install PARTIAL.

## Contradictions

1. Canon: transport is a separate optional Quote line. Runtime: `TRANSPORT_UNCONFIRMED` is an installation incomplete reason.
2. Canon: `200 EUR + TVA` is customer price. Runtime commercial projector is cost-plus on EIC only.
3. Canon completeness table: facade, fixing, crew, duration. Runtime reason list: cost, measurements, height, transport, electrical. Facade/fixing/crew are not typed reasons yet.
4. `SVC-PLACE-LED-MODULES` note says “LED installation service” — workshop module mounting, not site montaj.

## Owner questions

Only decisions that change business truth. Not table names, UI polish, or already-recorded law.

| OWNER_QUESTION_ID | DECISION | WHY_REQUIRED | OPTIONS | RECOMMENDED_OPTION | TRADEOFF | BLOCKS_WHAT |
| --- | --- | --- | --- | --- | --- | --- |
| Q1_MODE_SURFACE | Where INTERNAL vs SUBCONTRACTED is chosen | Completeness rows depend on mode; only a checkbox exists | A) Per Cerere only B) Org default + Cerere override C) Org-only | A now; B later if many jobs share a mode | A is operable without org Settings; B needs admin tooling | Mode model and which EIC rows apply |
| Q2_INTERNAL_LABOR_UNIT | Unit of Owner-confirmed internal install labor | Canon allows hour or job; recipes cannot be copied | A) EUR / job B) EUR / hour C) EUR / geometry unit | A for first COMPLETE path | A ignores crew/duration for EIC; B needs crew × duration | INTERNAL INSTALLATION_EIC |
| Q3_HOURLY_DRIVERS | If B: are crew and duration EIC inputs or later execution only? | Avoid building pontaj into price | A) EIC drivers B) Execution planning only | B unless Owner picks hourly | Hourly EIC pulls People toward a formula | Crew/duration fields |
| Q4_SUBCONTRACT_EVIDENCE | Unit and validity of supplier cost | No supplier model exists | A) EUR / job + validity window B) EUR / documented unit + validity C) Amount only, no expiry | A | Expiry honesty vs simpler admin | SUBCONTRACTED INSTALLATION_EIC |
| Q5_FIXINGS_V1 | First fixing/consumable shape | Inventory must stay optional | A) One job package resource, no stock B) Itemized materials, stock optional C) Itemized + stock required | A | Less site fidelity; works for small companies | Fixings EIC row |
| Q6_ACCESS_TRIGGER | When access equipment is required and owned vs hire | Workshop machines must not be reused | A) Required only when office marks height/access B) Required above an Owner height rule C) Always when install selected | A | A is honest and small; B needs a height number | HEIGHT_ACCESS / access EIC |
| Q7_SITE_ELECTRICAL_DEFAULT | Default for selected LETTERS front-lit install | Must not reuse workshop electrical | A) NOT_APPLICABLE B) EXCLUDED_CUSTOMER_RESPONSIBILITY C) INCLUDED with own evidence | A or B | C opens a new cost row immediately | SITE_ELECTRICAL reason |
| Q8_INSTALL_COMMERCIAL_RULE | How install commercial becomes COMPLETE without using 200 EUR as EIC | Cost-plus on install EIC would invent a different customer price | A) Install commercial stays PARTIAL until a later fixed-price line B) Owner-confirmed fixed customer price, not cost-plus, once EIC is COMPLETE C) Cost-plus on installation EIC | A or B; reject C | A keeps freeze blocked after EIC COMPLETE; B needs a commercial exception | Freeze honesty; Phase 3 line design |

Do not ask Owner for table names, function names, or premature UI.

## Future implementation slices (not authorized)

Do not implement these now. Do not touch transport multi-line, Quote schema V2, PDF, Order, ExecutionPlan, Architecture C Wave 2, live Cerere, or the first real offer.

```text
PHASE_2_SLICE                      = P2-S1 MODE_AND_CONDITIONAL_REASONS
PURPOSE                            = Persist INTERNAL vs SUBCONTRACTED; emit incomplete reasons only when applicable; stop using transport as an install EIC blocker
INPUT                              = Q1
OUTPUT                             = Mode on Request; silent unselected unchanged; PARTIAL reasons honest
FILES_OR_DOMAINS_LIKELY_TOUCHED    = installation/scope.ts; commercialRequest; Cerere projection
MIGRATION_EXPECTED                 = additive mode column or scope qualifier — only after Owner GO
UI_SURFACE                         = Cerere associated-scope control
TESTS_REQUIRED                     = domain + request API + freeze still blocked
OWNER_GATE                         = Q1
STOP_STATE                         = still PARTIAL; no COMPLETE EIC
```

```text
PHASE_2_SLICE                      = P2-S2 INTERNAL_LABOR_EVIDENCE
PURPOSE                            = Smallest path to a real INSTALLATION_EIC line from Owner-confirmed Resources / Cost
INPUT                              = Q2, Q8; new install labor resource; Owner amount
OUTPUT                             = INTERNAL + confirmed labor can contribute EIC lines; still no 0 EUR; still no LETTERS recipe reuse
FILES_OR_DOMAINS_LIKELY_TOUCHED    = resources/catalog; installation projection; admin Resources write
MIGRATION_EXPECTED                 = none if existing cost-evidence write is reused
UI_SURFACE                         = /admin/resources for the rate; Cerere mode INTERNAL
TESTS_REQUIRED                     = EIC PARTIAL vs COMPLETE; freeze uses same completeness contract
OWNER_GATE                         = Q2 + Q8 + Owner amount
STOP_STATE                         = COMPLETE only if Q8 does not require remaining site facts
```

```text
PHASE_2_SLICE                      = P2-S3 APPLICABLE_SITE_GATES
PURPOSE                            = Capture only the site facts Q6/Q7 make applicable (electrical default, access trigger). No transport engine.
INPUT                              = Q6, Q7
OUTPUT                             = Conditional reasons can clear; facade/fixings remain PARTIAL until Q5
FILES_OR_DOMAINS_LIKELY_TOUCHED    = installation domain; Cerere or install configuration fields
MIGRATION_EXPECTED                 = additive site-fact persistence
UI_SURFACE                         = Cerere / install configuration — not Product System LETTERS form
TESTS_REQUIRED                     = unselected silent; INTERNAL without access stays valid when Q6 = A
OWNER_GATE                         = Q6 + Q7
STOP_STATE                         = COMPLETE still requires Q5 if fixing is mandatory
```

```text
FIRST_AUTHORIZABLE_SLICE           = P2-S1
```

P2-S2 is the first slice that can change money, and only after Q2, Q8, and an Owner-confirmed amount. P2-S1 is the first safe code slice because it writes no rates.

Do not start P2-S2 until Q8 is answered. Completing EIC while cost-plus remains the only commercial projector would either freeze a false customer install price or need an immediate freeze-rule change.

## Blockers for INSTALLATION_EIC COMPLETE

```text
NO_MODE_IN_RUNTIME
NO_SITE_INSTALL_LABOR_EVIDENCE
NO_SUBCONTRACT_EVIDENCE
NO_FIXINGS_EVIDENCE
NO_ACCESS_EVIDENCE
NO_SITE_ELECTRICAL_CONTRACT
NO_SITE_FACTS_CAPTURE
COMMERCIAL_COST_PLUS_CONFLICTS_WITH_200_EUR
TRANSPORT_REASON_INSIDE_INSTALL_SCOPE
```

None of these authorize implementation. Next Owner action: answer Q1–Q8, then a separate GO for `P2-S1` only.
