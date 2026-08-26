# WorkOS V1 delivery roadmap

Living delivery authority for finishing WorkOS V1.
This file keeps **state and direction**. Worklogs keep execution detail. Plans keep one-build sequencing. This file is not a worklog and not an implementation plan.

```text
AUTHORITY         = ACTIVE_V1_DELIVERY
THIS_BUILD        = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4
REAL_CLOUD_RESUME = NOT_AUTHORIZED_BY_THIS_DOCUMENT
UI_IMPLEMENTATION = WAVE_4_OWNER_ACCEPTED
UI_IMPLEMENTATION_COMPLETE = NO
FULL_FIRST_HF_LOT_IMPLEMENTED = NO
HIGH_FIDELITY     = FIRST_LOT_OWNER_ACCEPTED
WAVE_1_GATE       = CLOSED
WAVE_2_GATE       = CLOSED
WAVE_3_GATE       = CLOSED
WAVE_4_GATE       = CLOSED
WAVE_1            = OWNER_ACCEPTED
WAVE_2            = OWNER_ACCEPTED
WAVE_3            = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
WAVE_4            = OWNER_ACCEPTED
WAVE_5            = NOT_STARTED
```

## Authority

This document is the **active** authority for current V1 delivery direction.

It supersedes, for that role only:

- `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` — earlier construction and finalization map; keep it; do not treat it as the live V1 sequence
- `21_WORKOS_IMPLEMENTATION_ROUTE.md` — historical implementation-route document. It is not required to live in this repository. If it appears in evidence, keep it; do not delete it; do not rewrite it; it is not the current V1 roadmap

`README.md` points at this file as the active V1 delivery roadmap. Older worklogs and plans may still cite `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` as construction evidence. Do not treat that file as the live sequence.

Do not create a second V1 delivery roadmap.

Related living authority:

- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` — UI/UX direction
- `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md` — accepted first-lot route, access, mapping, and wave contracts
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md` — domain and administration map
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — current implemented presentation law

## Principles

- Close a milestone when it is safe enough. Do not re-audit it forever.
- The next step is the unfinished domain with the highest E2E value.
- Stop horizontal expansion.
- One real job is worth more than another foundation module.
- Owner gates stay explicit.
- This roadmap does not contain worklog detail, secrets, personal names, PINs, hashes, or personal machine paths.

## Current canonical state

Recorded against merged `origin/main`:

```text
ORIGIN_MAIN                          = 0dc7702c4b3ad98604b3eb74564a254091c36830
MACHINE_STRICT_V1                    = COMPLETE
MIN_ORG_CONFIGURATION                = COMPLETE
CLOUD_PROVISIONING_ATOMIC_RESUME_V1  = COMPLETE
OWNER_GATE                           = COMPLETE
CANONICAL_DIRECTION_CONTROL_V1       = ESTABLISHED
REAL_CLOUD_CHECKPOINT                = RECOVERED_ACTIVE
FIRST_REAL_CLOUD_OWNER               = CREATED
REAL_CLOUD_OWNER_RECOVERY_V1         = COMPLETE
OWNER_LOGIN                          = VERIFIED
REAL_HUB_MEDIA_OPERATION             = NOT_PROVEN
BUSINESS_DATA_CONFIGURATION          = NOT_STARTED
FULL_OLD_AND_NEW_UI_UX_AUDIT         = COMPLETE
EVIDENCE_PACK                        = ACCEPTED
UI_UX_CANON_UPDATE_FROM_EVIDENCE     = COMPLETE
FIGMA_ACCESS_GATE                    = COMPLETE
INFORMATION_ARCHITECTURE             = OWNER_ACCEPTED
OWNER_IA_GATE                        = CLOSED
PILOT_HIGH_FIDELITY_SCOPE_DEFINITION = OWNER_ACCEPTED
OWNER_HIGH_FIDELITY_SCOPE_REVIEW     = COMPLETE
PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION = OWNER_ACCEPTED
OWNER_VISUAL_DIRECTION_DECISION      = ACCEPTED_WITH_AMENDMENTS
FINAL_VISUAL_DIRECTION               = A_INDUSTRIAL_CLARITY
VISUAL_DIRECTION_GATE                = CLOSED
FIRST_HF_LOT_SCREEN_DESIGN           = OWNER_ACCEPTED
OWNER_FIRST_HF_LOT_REVIEW            = COMPLETE
HF_LOT_GATE                          = CLOSED
HIGH_FIDELITY                        = FIRST_LOT_OWNER_ACCEPTED
HIGH_FIDELITY_DESIGN                 = FIRST_LOT_OWNER_ACCEPTED
FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS = OWNER_ACCEPTED
IMPLEMENTATION_READINESS_GATE        = CLOSED
IMPLEMENTATION_READY                 = YES
VISIBLE_RUNTIME                      = WAVE_4_RESOURCES_ADMIN_REUSE
UI_IMPLEMENTATION                    = WAVE_4_OWNER_ACCEPTED
UI_IMPLEMENTATION_AUTHORIZED         = WAVE_4
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_1_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_2_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_3_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_4_REVIEW = PASS
OWNER_DECISION                       = ACCEPTED_WITH_ADVISORIES
WAVE_1_GATE                          = CLOSED
WAVE_2_GATE                          = CLOSED
WAVE_3_GATE                          = CLOSED
WAVE_4_GATE                          = CLOSED
UI_IMPLEMENTATION_COMPLETE           = NO
FULL_FIRST_HF_LOT_IMPLEMENTED         = NO
WAVE_2                               = OWNER_ACCEPTED
WAVE_3                               = OWNER_ACCEPTED
WAVE_4                               = OWNER_ACCEPTED
WAVE_5                               = NOT_STARTED
PRODUCT_SYSTEM_UI                    = RECORD_ONLY
```

`OWNER_GATE = COMPLETE` means the Cloud initial-Owner product law is closed: fail-closed activation, exactly one initial Owner, explicit resume. It does not mean later operational Owner GOs are already granted.

Meaning, without reopening closed builds:

- The product spine already runs in single-plane DEV: LETTERS none/none 60 mm through Quote, Acceptance, Order, Release, 12-operation ExecutionPlan, Claim/Start/Complete, actuals, stock movements, and actual cost.
- Cloud Foundation plus atomic resume are merged. Synthetic isolation is verified. That is not a real HUB MEDIA operation.
- A separate Owner GO recovered the existing HUB MEDIA Cloud organization and created the first real Cloud Owner. Login is verified. This file did not authorize that write. Execution detail lives in `docs/worklog/WORKOS_REAL_CLOUD_OWNER_RECOVERY_V1.md`.
- The recovered organization is ACTIVE. People, workcenters, machines, provider configuration, seller, customers, requests, quotes, orders, execution plans, and inventory movements are still empty. Real HUB MEDIA operation is not proven.
- Product System UI inspects and records current typed truth, including persisted display labels. It is not a full product-administration product.

Do not put passwords, PINs, hashes, personal names, or real Cloud filesystem paths in this file.

## Active milestone

```text
TARGET_MILESTONE  = HUB_MEDIA_CLEAN_PILOT
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
CURRENT_STEP      = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4
NEXT_STEP         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_OWNER_GO
HIGH_FIDELITY     = FIRST_LOT_OWNER_ACCEPTED
FIRST_HF_LOT_SCREEN_DESIGN = OWNER_ACCEPTED
OWNER_FIRST_HF_LOT_REVIEW = COMPLETE
HF_LOT_GATE       = CLOSED
FINAL_VISUAL_DIRECTION = A_INDUSTRIAL_CLARITY
FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS = OWNER_ACCEPTED
IMPLEMENTATION_READINESS_GATE = CLOSED
IMPLEMENTATION_READY = YES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_1_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_2_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_3_REVIEW = PASS
OWNER_DECISION    = ACCEPTED_WITH_ADVISORIES
WAVE_1_GATE       = CLOSED
WAVE_2_GATE       = CLOSED
WAVE_3_GATE       = CLOSED
VISIBLE_RUNTIME   = WAVE_4_RESOURCES_ADMIN_REUSE
UI_IMPLEMENTATION = WAVE_4_OWNER_ACCEPTED
UI_IMPLEMENTATION_COMPLETE = NO
FULL_FIRST_HF_LOT_IMPLEMENTED = NO
UI_IMPLEMENTATION_AUTHORIZED = WAVE_4
WAVE_2            = OWNER_ACCEPTED
WAVE_3            = OWNER_ACCEPTED
WAVE_4            = OWNER_ACCEPTED
WAVE_4_GATE       = CLOSED
WAVE_5            = NOT_STARTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_4_REVIEW = PASS
```

`HUB_MEDIA_CLEAN_PILOT` remains the only target milestone. It includes the first real LETTERS job and closes only after planned-vs-actual Owner sign-off (step 10). Wave 1 of first-lot UI implementation is `OWNER_ACCEPTED` with advisories: financial access `ALT_B_SCOPED`, stable `/jobs/:jobId` and `/quotes/:quoteSnapshotId`, Industrial Clarity theme foundation, composed job detail and quote inspection. Wave 2 is `OWNER_ACCEPTED` with advisories: Comercial Level 2, client/request/quote lists, Client nou / Cerere nouă drawers, Catalog, configurator, and the synthetic Client → Cerere → Catalog → Configurator → Ofertă → Lucrare path. Wave 3 is `OWNER_ACCEPTED` with advisories: Cloud login gate, Atelier identification, operational inbox, `/execution/:planId`, operational planned-versus-actual, and the final accessibility closure. Wave 4 is `OWNER_ACCEPTED` with advisories: domain-aware Resurse plus admin reuse of Utilaje/zone and Oameni, without a parallel catalog or commercial pricing. Cursor independent review and ChatGPT visual review are `PASS_WITH_ADVISORIES` (visual score 94/100). It does not implement the entire first lot. Wave 5 is not started and is not authorized. The next sequence step is `FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_OWNER_GO`.

Implementation reports fill:

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP         = <current next sequence step>
```

`NEXT_STEP` reports the next sequence step inside `HUB_MEDIA_CLEAN_PILOT` only. It is not a second target milestone. After this Wave 4 accept, that value is `FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_OWNER_GO`. Contracts live in `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md`. Wave 1 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1_V1.md`. Wave 2 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2_COMMERCIAL_CATALOG_CONFIGURATOR_V1.md`. Wave 3 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3_CLOUD_LOGIN_ATELIER_IDENTIFICATION_EXECUTION_PVA_V1.md`. Wave 4 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4_RESOURCES_AND_ADMIN_REUSE_V1.md`.

Target flow:

```text
Cloud Owner
→ real Client
→ real Cerere + real document
→ LETTERS none/none 60 mm
→ confirmed EIC
→ frozen Ofertă PDF
→ Acceptance
→ Order
→ Release
→ ExecutionPlan with 12 operations
→ Claim / Start / Complete
→ real consumption
→ stock movements
→ actual cost
→ planned vs actual
→ Owner sign-off
```

A synthetic or DEV walkthrough of the same spine does not close this milestone.

## Current sequence

```text
1. CANONICAL_DIRECTION_CONTROL_V1    = COMPLETE
2. REAL_CLOUD_OWNER_RECOVERY         = COMPLETE
3. FULL_OLD_AND_NEW_UI_UX_AUDIT      = COMPLETE
4. UI_UX_CANON_UPDATE_FROM_EVIDENCE  = COMPLETE
5. FIGMA_ACCESS_AND_INFORMATION_ARCHITECTURE = OWNER_ACCEPTED
6. OWNER_VISUAL_ACCEPTANCE           = FIRST_LOT_CLOSED
6a. IMPLEMENTATION_READINESS_CONTRACTS = OWNER_ACCEPTED
7. SCOPED_UI_IMPLEMENTATION          = WAVE_4_OWNER_ACCEPTED
8. HUB_MEDIA_ORGANIZATION_CONFIGURATION = NOT_STARTED
9. FIRST_REAL_LETTERS_JOB            = NOT_STARTED
10. PLANNED_VS_ACTUAL_OWNER_SIGN_OFF = NOT_STARTED
```

Step 1 established the living canons and governance pointers. Step 2 recovered the existing HUB MEDIA Cloud organization under a later Owner GO. This file did not authorize that write.

`FULL_OLD_AND_NEW_UI_UX_AUDIT` is complete. The accepted evidence pack is `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md`. Route inventory is source-proven, not full page coverage and not cartesian state coverage.

`UI_UX_CANON_UPDATE_FROM_EVIDENCE` is complete. That revision distinguished invariants, evidence-supported conclusions, Figma candidates, and explicit deferrals. It did not declare a sidebar, a Catalog label, a visual style, or a component library as final. Execution detail lives in `docs/worklog/WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1.md`.

`FIGMA_ACCESS_AND_INFORMATION_ARCHITECTURE` is Owner-accepted with amendments. Global navigation is top nav. Level 1 is Lucrări | Atelier | Comercial | Catalog | Administrare. `Configurează` is a contextual action. Product System stays in Administrare. Visual direction A and the first HF lot are now accepted; they were unselected at IA time. Execution detail lives in `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md`.

`PILOT_HIGH_FIDELITY_SCOPE_DEFINITION` is Owner-accepted with amendments. The first lot includes job detail, quote decision inspection, and execution so the pilot can be validated through planned-vs-actual. The stable job URL is `/jobs/:jobId` with `jobId = orderSnapshotId`. `/orders/:orderSnapshotId` is rejected as the primary UI route. No Job table. Admin pattern reuse stays domain-aware; universal CRUD is forbidden. Execution detail lives in `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_SCOPE_DEFINITION_V1.md`.

`PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION` is Owner-accepted with amendments. Final visual direction is A — Industrial Clarity. B and C remain visible comparative reference. Execution detail lives in `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION_V1.md`.

`FIRST_HF_LOT_SCREEN_DESIGN` is `OWNER_ACCEPTED`. The first lot is drawn in Figma on pages 12–21, in direction A, with Lucide plus WorkOS custom icons and a same-page E2E prototype. Job detail and quote inspection are in the lot. Their URL and money contracts are `OWNER_ACCEPTED` in `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md`: `/jobs/:jobId`, `/quotes/:quoteSnapshotId`, `MONEY_POLICY = ALT_B_SCOPED`. Execution detail lives in `docs/worklog/WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1.md`. This file does not authorize React/CSS, Mobbin, or a production component library.

Wave 1 of scoped UI implementation is `OWNER_ACCEPTED` with advisories. Wave 2 is `OWNER_ACCEPTED` with advisories. Wave 3 is `OWNER_ACCEPTED` with advisories. Wave 4 is `OWNER_ACCEPTED` with advisories and does not complete the first lot or authorize Wave 5 or steps 8–10. Do not invent a Product System admin rewrite from the historical foundation “next candidate” line.

Step 8 configures the recovered HUB MEDIA organization with the existing explicit provider/CLI path. It is not universal Machine Admin.

Do not start Wave 5 or steps 8–10 from this document. The next named step is `FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_OWNER_GO`.

## Real Cloud recovery

This roadmap never authorized the real resume. A **separate Owner GO** authorized recovery of the existing organization. That recovery is now complete. Any later real write needs another Owner GO.

```text
REAL_CLOUD_RESUME = NOT_AUTHORIZED_BY_THIS_DOCUMENT
REAL_CLOUD_ROOT   = UNTOUCHED_BY_THIS_DOCUMENT
SECOND_REAL_ORG   = FORBIDDEN_HERE
```

This file is not a playbook. It does not name the real root. It does not carry credentials.

“Clean HUB MEDIA organization” means that recovered ACTIVE organization, configured later in step 8, without wholesale old-database adoption and without creating a second real organization from this document.

## Current Cloud business state

State only. No identities, emails, or machine paths.

```text
HUB_MEDIA_ORGANIZATION        = ACTIVE
CLOUD_OWNER                   = EXISTS
OWNER_LOGIN                   = PROVEN
PEOPLE                        = 0
WORKCENTERS                   = 0
MACHINES                      = 0
PROVIDER_CONFIGURATION        = 0
SELLER_PROFILE                = 0
CUSTOMERS                     = 0
REQUESTS                      = 0
QUOTES                        = 0
ORDERS                        = 0
EXECUTION_PLANS               = 0
INVENTORY_MOVEMENTS           = 0
```

## Pilot configuration truths

Keep these confirmed working truths for the clean HUB MEDIA pilot:

- a clean HUB MEDIA organization
- no wholesale adoption of old databases
- the same CNC Router may be allocated separately for face and back
- one CNC that forms 0.6 mm letter-cant sheet, for now
- only 3 of 12 LETTERS operations require a machine
- the other 9 of 12 are manual
- Masa 1, Masa 2, and Montaj LED are not Start gates
- skills and dependencies stay fail-closed
- the 35% markup + 21% VAT + EUR commercial policy is `PILOT_ONLY`: consume the existing code-owned company policy; do not add a second policy, do not add commercial admin write, and do not treat this policy as permanent multi-tenant SaaS pricing law
- real stock and opening balances are an Owner operational prerequisite before the first pilot consumption. Inventory runtime still allows negative balances and does not block Start or Complete. Do not add a new execution lock from this sentence.

People names, PINs, and other personal data belong in controlled pilot configuration and in that pilot’s worklog. Not here.

Domain law that these truths sit on:

- `docs/architecture/EXECUTION_PLAN_AND_TASKS_CANON.md`
- `docs/architecture/WORKCENTERS_AND_MACHINES_CANON.md`
- `docs/architecture/PEOPLE_SKILLS_OPERATIONAL_TRUTH_CANON.md`
- `docs/architecture/OPERATOR_IDENTITY_CLAIM_ON_START_CANON.md`
- `docs/architecture/COMMERCIAL_PRICE_RULES_CANON.md`
- `docs/architecture/INVENTORY_STOCK_AND_MOVEMENTS_CANON.md`
- `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`

## Stop doing

Not in V1. Do not start them to look productive.

- new products
- Logo
- full ACM
- Analyzer inside WorkOS
- HR
- pontaj
- payroll / salarizare
- scheduling
- capacity
- purchasing
- suppliers
- reporting
- invoicing
- global DMS
- Postgres
- billing
- public signup
- SaaS infrastructure
- universal CRUD
- universal Machine Admin
- worklogs or status maps without operational proof
- wholesale adoption of an old database
- SVG / DWG / graphics processing inside WorkOS

ACM cassette remains the existing second-product vertical slice. It is not permission to build full ACM or illuminated ACM.

## Update policy

Update this roadmap when:

- a milestone closes
- the step order changes
- a proven blocker appears
- Owner changes direction
- a capability enters or leaves V1

Do not copy worklog narrative here.

Every later implementation report must include:

```text
ROADMAP_READ
CURRENT_MILESTONE
NEXT_STEP
DIRECTION_CONFLICT
Cat sunt in directia stabilita: X/100%
```

`Cat sunt in directia stabilita` scores how much of **this report’s work** follows the active sequence and stays out of Stop doing. It is not a product-completeness score and not a substitute for PASS evidence.

UI changes also report the change-governance fields in `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
`AGENTS.md` keeps the short shared triple.

Before any implementation, read this file.
Before any UI/UX change, also read `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
