# WorkOS V1 delivery roadmap

Living delivery authority for finishing WorkOS V1.
This file keeps **state and direction**. Worklogs keep execution detail. Plans keep one-build sequencing. This file is not a worklog and not an implementation plan.

```text
AUTHORITY         = ACTIVE_V1_DELIVERY
THIS_BUILD        = CANONICAL_DIRECTION_CONTROL_V1
REAL_CLOUD_RESUME = NOT_AUTHORIZED_BY_THIS_DOCUMENT
UI_IMPLEMENTATION = FORBIDDEN_UNTIL_OWNER_GO_FOR_SCOPED_UI_IMPLEMENTATION
```

## Authority

This document is the **active** authority for current V1 delivery direction.

It supersedes, for that role only:

- `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` — earlier construction and finalization map; keep it; do not treat it as the live V1 sequence
- `21_WORKOS_IMPLEMENTATION_ROUTE.md` — historical implementation-route document. It is not required to live in this repository. If it appears in evidence, keep it; do not delete it; do not rewrite it; it is not the current V1 roadmap

`README.md` and some older architecture pointers still cite `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md`. Those inbound pointers are stale. This build does not retarget them. Agents must read this file.

Do not create a second V1 delivery roadmap.

Related living authority:

- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` — UI/UX direction
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
ORIGIN_MAIN                          = 95f2df88a66815610241d9f82780474bdd7be8f7
MACHINE_STRICT_V1                    = COMPLETE
MIN_ORG_CONFIGURATION                = COMPLETE
CLOUD_PROVISIONING_ATOMIC_RESUME_V1  = COMPLETE
OWNER_GATE                           = COMPLETE
REAL_CLOUD_CHECKPOINT                = PARTIAL
FIRST_REAL_CLOUD_OWNER               = NOT_CREATED
REAL_HUB_MEDIA_OPERATION             = NOT_PROVEN
PRODUCT_SYSTEM_UI                    = RECORD_ONLY
CANONICAL_DIRECTION_CONTROL_V1       = ESTABLISHED
```

`OWNER_GATE = COMPLETE` means the Cloud initial-Owner product law is closed: fail-closed activation, exactly one initial Owner, explicit resume. It does not mean later operational Owner GOs are already granted.

Meaning, without reopening closed builds:

- The product spine already runs in single-plane DEV: LETTERS none/none 60 mm through Quote, Acceptance, Order, Release, 12-operation ExecutionPlan, Claim/Start/Complete, actuals, stock movements, and actual cost.
- Cloud Foundation plus atomic resume are merged. Synthetic isolation is verified. That is not a real HUB MEDIA operation.
- A real Cloud checkpoint exists only as a partial, resume-eligible organization from an earlier failed provision. This roadmap does not describe that root and does not authorize touching it.
- Product System UI inspects and records current typed truth, including persisted display labels. It is not a full product-administration product.

Do not put passwords, PINs, hashes, personal names, or real Cloud filesystem paths in this file.

## Active milestone

```text
TARGET_MILESTONE = HUB_MEDIA_CLEAN_PILOT
CURRENT_STEP     = CANONICAL_DIRECTION_CONTROL_V1
NEXT_STEP        = REAL_CLOUD_OWNER_RECOVERY
```

`HUB_MEDIA_CLEAN_PILOT` is the target milestone. It includes the first real LETTERS job and closes only after planned-vs-actual Owner sign-off (step 10).

Implementation reports fill:

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_MILESTONE    = <current NEXT_STEP>
```

After this document exists, `NEXT_MILESTONE` is `REAL_CLOUD_OWNER_RECOVERY` until that later GO starts. Do not report a sequence step as if it were a second target milestone.

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
1. CANONICAL_DIRECTION_CONTROL_V1
2. REAL_CLOUD_OWNER_RECOVERY
3. FULL_OLD_AND_NEW_UI_UX_AUDIT
4. UI_UX_CANON_UPDATE_FROM_EVIDENCE
5. FIGMA_INFORMATION_ARCHITECTURE_AND_DESIGN_SYSTEM
6. OWNER_VISUAL_ACCEPTANCE
7. SCOPED_UI_IMPLEMENTATION
8. HUB_MEDIA_ORGANIZATION_CONFIGURATION
9. FIRST_REAL_LETTERS_JOB
10. PLANNED_VS_ACTUAL_OWNER_SIGN_OFF
```

Step 1 is this document and its governance pointers. It does not recover Cloud, audit UI, or change product code.

`FULL_OLD_AND_NEW_UI_UX_AUDIT` still inventories every reachable route in both applications, per `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`. Capture work may finish pilot-blocking surfaces first. Steps 4–7 (canon update, Figma, visual acceptance, scoped UI implementation) may then be limited to those surfaces. That is not an unlimited redesign of the whole product.

The current implemented shell remains the operator surface until a later scoped UI GO. Do not invent a Product System admin rewrite from the historical foundation “next candidate” line.

Step 8 configures the recovered HUB MEDIA organization with the existing explicit provider/CLI path. It is not universal Machine Admin.

Do not start step 2 from this document. Do not start steps 3–10 from this document.

## Real Cloud recovery

The next operational write after this canon is integrated will be a **separate Owner GO**. That later GO, not this file, is the runnable plan. This file only records the required gates:

- backup first
- read-only inspection of the partial state
- explicit `--resume` on the organization ID
- password only through TTY or `--password-stdin`
- verification of exactly one Owner
- login
- backup after success
- STOP

```text
REAL_CLOUD_RESUME = NOT_AUTHORIZED_BY_THIS_DOCUMENT
REAL_CLOUD_ROOT   = UNTOUCHED_BY_THIS_DOCUMENT
SECOND_REAL_ORG   = FORBIDDEN_HERE
```

This file does not authorize that write. It is not a playbook to execute. It does not name the real root. It does not carry credentials.

The intended first Owner path is resume of the existing incomplete organization. “Clean HUB MEDIA organization” means that recovered organization, configured later in step 8, without wholesale old-database adoption and without creating a second real organization from this document. If that leftover is no longer resume-eligible, stop and wait for a later Owner GO. Do not invent a create path here.

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
NEXT_MILESTONE
DIRECTION_CONFLICT
Cat sunt in directia stabilita: X/100%
```

`Cat sunt in directia stabilita` scores how much of **this report’s work** follows the active sequence and stays out of Stop doing. It is not a product-completeness score and not a substitute for PASS evidence.

UI changes also report the change-governance fields in `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
`AGENTS.md` keeps the short shared triple.

Before any implementation, read this file.
Before any UI/UX change, also read `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
