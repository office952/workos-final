# WorkOS V1 delivery roadmap

Living delivery authority for finishing WorkOS V1.
This file keeps **state and direction**. Worklogs keep execution detail. Plans keep one-build sequencing. This file is not a worklog and not an implementation plan.

```text
AUTHORITY         = ACTIVE_V1_DELIVERY
THIS_BUILD        = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5
REAL_CLOUD_RESUME = NOT_AUTHORIZED_BY_THIS_DOCUMENT
UI_IMPLEMENTATION = OWNER_ACCEPTED
UI_IMPLEMENTATION_COMPLETE = YES
FULL_FIRST_HF_LOT_IMPLEMENTED = YES
FULL_FIRST_HF_LOT_CODE_COMPLETE = YES
FULL_FIRST_HF_LOT_REGRESSION_COMPLETE = YES
FULL_FIRST_HF_LOT_OWNER_ACCEPTED = YES
HIGH_FIDELITY     = FIRST_LOT_OWNER_ACCEPTED
WAVE_1_GATE       = CLOSED
WAVE_2_GATE       = CLOSED
WAVE_3_GATE       = CLOSED
WAVE_4_GATE       = CLOSED
WAVE_5_GATE       = CLOSED
WAVE_1            = OWNER_ACCEPTED
WAVE_2            = OWNER_ACCEPTED
WAVE_3            = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5 = OWNER_ACCEPTED
WAVE_4            = OWNER_ACCEPTED
WAVE_5            = OWNER_ACCEPTED
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
- `docs/plans/WORKOS_ARCHITECTURE_C_UI_IMPLEMENTATION_WAVE_1_PLAN.md` — Architecture C UI Wave 1 plan
- `docs/worklog/WORKOS_ARCHITECTURE_C_FINAL_SIMULATION_ACCEPTED_WAVE_1_PLAN_V1.md` — Owner accept of the Architecture C simulation with advisories
- `docs/worklog/WORKOS_ARCHITECTURE_C_UI_WAVE_1_IMPLEMENTED_LOCAL_IN_REVIEW_V1.md` — Architecture C UI Wave 1 local implementation record

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
ORIGIN_MAIN                          = ef4dd73514583bda2754456e2e5730ac96fc5f31
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
BUSINESS_DATA_CONFIGURATION          = OWNER_ACCEPTED
HUB_MEDIA_ORGANIZATION_CONFIGURATION = OWNER_ACCEPTED
FIRST_REAL_LETTERS_JOB               = BLOCKED_BEFORE_QUOTE
FIRST_REAL_LETTERS_PREQUOTE_V1       = IMPLEMENTED_LOCAL_IN_REVIEW
BLOCK_REASON                         = pre-quote wave is local in review; real Cloud write, real Cerere patch, and live quote remain NO
OPTIONAL_SITE_INSTALLATION_V1        = INTEGRATED_ON_MAIN
OPERATIONAL_SERVICES_ARCHITECTURE    = OWNER_ACCEPTED
OS_S1_ORG_CAPABILITY_AND_REQUEST_MODE = IMPLEMENTED_CURRENT / BASIC
OS_S1_INTEGRATION                    = INTEGRATED_ON_MAIN
OS_S2                                = INTEGRATED_ON_MAIN
OS_S2_DESIGN                         = OWNER_ACCEPTED
OS_S2_TYPED_FACTS                    = IMPLEMENTED_CURRENT / BASIC
OS_S2_IMPLEMENTATION                 = INTEGRATED_ON_MAIN
OS_S2_TRANSACTION_SAFETY             = CLOSED
OS_S3                                = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S4                                = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S5                                = IMPLEMENTED_LOCAL_IN_REVIEW
UI_UX_NAVIGATION_V3_DESIGN           = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION   = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION    = IN_PROGRESS
CLIENTS_V3                           = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION              = OWNER_ACCEPTED
CLIENTS_RUNTIME                      = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE                   = CLOSED
CLIENTS_PRODUCT_SHA                  = 6190207b72fb723ef0c0276864d74dcb2bc7aa4a
CLIENT_HUB_FIGMA_FINAL               = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME                   = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE            = CLOSED
CLIENT_HUB                           = INTEGRATED_ON_MAIN
CLIENT_HUB_PRODUCT_SHA               = 05b8ae2ccf769f82ee9c702b37950a108d8203a2
CERERI_V3_FIGMA_FINAL                = OWNER_ACCEPTED
REQUESTS_DIRECTION                   = OWNER_ACCEPTED
CERERI_TECHNICAL_GATE                = CLOSED
REQUESTS_RUNTIME                     = OWNER_ACCEPTED
CERERI_RUNTIME                       = OWNER_ACCEPTED
CERERI_INTEGRATED_ON_MAIN            = YES
REQUESTS_INTEGRATED_ON_MAIN          = YES
CERERI_PRODUCT_SHA                   = 03f2d747036b5ac219f283f5a969d575a9a707c9
CERERI_OWNER_ACCEPT_RECORD           = ef4dd73514583bda2754456e2e5730ac96fc5f31
NEXT_PROGRAM_PRIORITY                = UI_V3_COMMERCIAL_PAGE_REORGANIZATION
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
VISIBLE_RUNTIME                      = WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT
UI_IMPLEMENTATION                    = OWNER_ACCEPTED
UI_IMPLEMENTATION_AUTHORIZED         = WAVE_5
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_1_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_2_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_3_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_4_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_5_REVIEW = PASS
OWNER_DECISION                       = ACCEPTED_WITH_ADVISORIES
WAVE_1_GATE                          = CLOSED
WAVE_2_GATE                          = CLOSED
WAVE_3_GATE                          = CLOSED
WAVE_4_GATE                          = CLOSED
WAVE_5_GATE                          = CLOSED
UI_IMPLEMENTATION_COMPLETE           = YES
FULL_FIRST_HF_LOT_IMPLEMENTED         = YES
FULL_FIRST_HF_LOT_CODE_COMPLETE       = YES
FULL_FIRST_HF_LOT_REGRESSION_COMPLETE = YES
FULL_FIRST_HF_LOT_OWNER_ACCEPTED      = YES
WAVE_2                               = OWNER_ACCEPTED
WAVE_3                               = OWNER_ACCEPTED
WAVE_4                               = OWNER_ACCEPTED
WAVE_5                               = OWNER_ACCEPTED
PRODUCT_SYSTEM_UI                    = RECORD_ONLY
ARCHITECTURE_C_DIRECTION             = OWNER_ACCEPTED
ARCHITECTURE_C_FINAL_SIMULATION      = OWNER_ACCEPTED_WITH_ADVISORIES
ARCHITECTURE_C_UI_WAVE_1_PLANNING    = COMPLETE
ARCHITECTURE_C_UI_WAVE_1             = OWNER_ACCEPTED_WITH_ADVISORIES
ARCHITECTURE_C_UI_WAVE_2             = NOT_STARTED
FIGMA_LIBRARY_PUBLISHED              = NO
```

`OWNER_GATE = COMPLETE` means the Cloud initial-Owner product law is closed: fail-closed activation, exactly one initial Owner, explicit resume. It does not mean later operational Owner GOs are already granted.

Meaning, without reopening closed builds:

- The product spine already runs in single-plane DEV: LETTERS none/none 60 mm through Quote, Acceptance, Order, Release, 12-operation ExecutionPlan, Claim/Start/Complete, actuals, stock movements, and actual cost.
- Cloud Foundation plus atomic resume are merged. Synthetic isolation is verified. That is not a real HUB MEDIA operation.
- A separate Owner GO recovered the existing HUB MEDIA Cloud organization and created the first real Cloud Owner. Login is verified. This file did not authorize that write. Execution detail lives in `docs/worklog/WORKOS_REAL_CLOUD_OWNER_RECOVERY_V1.md`.
- The recovered organization is ACTIVE and Owner-accepted configured: seller complete, 8 operational people with PINs, two LETTERS machines, and confirmed 60 mm / none / none cost rows. Customers, quotes, orders, execution plans, and inventory movements remain empty. Real HUB MEDIA operation is not proven until the first real LETTERS job.
- Product System UI inspects and records current typed truth, including persisted display labels. It is not a full product-administration product.

Do not put passwords, PINs, hashes, personal names, or real Cloud filesystem paths in this file.

## Active milestone

```text
TARGET_MILESTONE  = HUB_MEDIA_CLEAN_PILOT
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
CURRENT_STEP      = FIRST_REAL_LETTERS_PREQUOTE_V1
NEXT_STEP         = INDEPENDENT_REVIEW_THEN_SYNTHETIC_RUNTIME_THEN_OWNER_INSPECTION
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
VISIBLE_RUNTIME   = WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT
UI_IMPLEMENTATION = OWNER_ACCEPTED
UI_IMPLEMENTATION_COMPLETE = YES
FULL_FIRST_HF_LOT_IMPLEMENTED = YES
FULL_FIRST_HF_LOT_CODE_COMPLETE = YES
FULL_FIRST_HF_LOT_REGRESSION_COMPLETE = YES
FULL_FIRST_HF_LOT_OWNER_ACCEPTED = YES
UI_IMPLEMENTATION_AUTHORIZED = WAVE_5
WAVE_2            = OWNER_ACCEPTED
WAVE_3            = OWNER_ACCEPTED
WAVE_4            = OWNER_ACCEPTED
WAVE_4_GATE       = CLOSED
WAVE_5            = OWNER_ACCEPTED
WAVE_5_GATE       = CLOSED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_4_REVIEW = PASS
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_5_REVIEW = PASS
ARCHITECTURE_C_DIRECTION = OWNER_ACCEPTED
ARCHITECTURE_C_FINAL_SIMULATION = OWNER_ACCEPTED_WITH_ADVISORIES
ARCHITECTURE_C_UI_WAVE_1_PLANNING = COMPLETE
ARCHITECTURE_C_UI_WAVE_1 = OWNER_ACCEPTED_WITH_ADVISORIES
ARCHITECTURE_C_UI_WAVE_2 = NOT_STARTED
FIGMA_LIBRARY_PUBLISHED = NO
HUB_MEDIA_ORGANIZATION_CONFIGURATION = OWNER_ACCEPTED
FIRST_REAL_LETTERS_JOB = BLOCKED_BEFORE_QUOTE
FIRST_REAL_LETTERS_PREQUOTE_V1 = IMPLEMENTED_LOCAL_IN_REVIEW
BLOCK_REASON = pre-quote wave is local in review; real Cloud write, real Cerere patch, and live quote remain NO
OPTIONAL_SITE_INSTALLATION_V1 = INTEGRATED_ON_MAIN
OPERATIONAL_SERVICES_ARCHITECTURE = OWNER_ACCEPTED
OS_S1_ORG_CAPABILITY_AND_REQUEST_MODE = IMPLEMENTED_CURRENT / BASIC
OS_S1_INTEGRATION = INTEGRATED_ON_MAIN
OS_S2 = INTEGRATED_ON_MAIN
OS_S2_DESIGN = OWNER_ACCEPTED
OS_S2_TYPED_FACTS = IMPLEMENTED_CURRENT / BASIC
OS_S2_IMPLEMENTATION = INTEGRATED_ON_MAIN
OS_S2_TRANSACTION_SAFETY = CLOSED
OS_S3 = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S4 = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S5 = IMPLEMENTED_LOCAL_IN_REVIEW
UI_UX_NAVIGATION_V3_DESIGN = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION = IN_PROGRESS
CLIENTS_V3 = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION = OWNER_ACCEPTED
CLIENTS_RUNTIME = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE = CLOSED
CLIENT_HUB_FIGMA_FINAL = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE = CLOSED
CLIENT_HUB = INTEGRATED_ON_MAIN
CERERI_V3_FIGMA_FINAL = OWNER_ACCEPTED
REQUESTS_DIRECTION = OWNER_ACCEPTED
CERERI_TECHNICAL_GATE = CLOSED
REQUESTS_RUNTIME = OWNER_ACCEPTED
CERERI_RUNTIME = OWNER_ACCEPTED
CERERI_INTEGRATED_ON_MAIN = YES
REQUESTS_INTEGRATED_ON_MAIN = YES
NEXT_PROGRAM_PRIORITY = UI_V3_COMMERCIAL_PAGE_REORGANIZATION
```

`HUB_MEDIA_CLEAN_PILOT` remains the only target milestone. It includes the first real LETTERS job and closes only after planned-vs-actual Owner sign-off (step 10). Wave 1 of first-lot UI implementation is `OWNER_ACCEPTED` with advisories: financial access `ALT_B_SCOPED`, stable `/jobs/:jobId` and `/quotes/:quoteSnapshotId`, Industrial Clarity theme foundation, composed job detail and quote inspection. Wave 2 is `OWNER_ACCEPTED` with advisories: Comercial Level 2, client/request/quote lists, Client nou / Cerere nouă drawers, Catalog, configurator, and the synthetic Client → Cerere → Catalog → Configurator → Ofertă → Lucrare path. Wave 3 is `OWNER_ACCEPTED` with advisories: Cloud login gate, Atelier identification, operational inbox, `/execution/:planId`, operational planned-versus-actual, and the final accessibility closure. Wave 4 is `OWNER_ACCEPTED` with advisories: domain-aware Resurse plus admin reuse of Utilaje/zone and Oameni, without a parallel catalog or commercial pricing. Wave 5 is `OWNER_ACCEPTED` with advisories: first-lot regression, accessibility, and screenshot closure, including recaptured Planned-versus-Actual, machine-blocked, dependency-blocked, and manual-task proofs. Independent visual review scored 96/100 with no P0/P1. A non-blocking P3 notes that `manifest.json` lists 22 names in `captured` while `required` and the archive contain 24 PNGs. The first HF lot UI is Owner-accepted. Step 8 `HUB_MEDIA_ORGANIZATION_CONFIGURATION` is `OWNER_ACCEPTED`. The next sequence step is `FIRST_REAL_LETTERS_JOB`, currently `BLOCKED_BEFORE_QUOTE` because installation cost/process evidence is incomplete. This file does not authorize that job.

Architecture C is a **parallel UI track**, not a second target milestone and not a replacement for the HUB sequence. The Architecture C final simulation is `OWNER_ACCEPTED_WITH_ADVISORIES`. Wave 1 is `OWNER_ACCEPTED_WITH_ADVISORIES` and integrated on `origin/main`. Wave 2 is not started. The Figma library stays unpublished. Do not flip first-HF `WAVE_*` or `UI_IMPLEMENTATION_COMPLETE` flags for this track.

Implementation reports fill:

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP         = <current next sequence step>
```

`NEXT_STEP` reports the next sequence step inside `HUB_MEDIA_CLEAN_PILOT` only. It is not a second target milestone. After Owner acceptance of Step 8, that value is `FIRST_REAL_LETTERS_JOB`. This file does not authorize that job. Contracts live in `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md`. Wave 1 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1_V1.md`. Wave 2 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2_COMMERCIAL_CATALOG_CONFIGURATOR_V1.md`. Wave 3 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3_CLOUD_LOGIN_ATELIER_IDENTIFICATION_EXECUTION_PVA_V1.md`. Wave 4 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4_RESOURCES_AND_ADMIN_REUSE_V1.md`. Wave 5 record: `docs/worklog/WORKOS_FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_V1.md`. Step 8 record: `docs/worklog/WORKOS_HUB_MEDIA_ORGANIZATION_CONFIGURATION_STEP8.md`.

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
7. SCOPED_UI_IMPLEMENTATION          = OWNER_ACCEPTED
8. HUB_MEDIA_ORGANIZATION_CONFIGURATION = OWNER_ACCEPTED
9. FIRST_REAL_LETTERS_JOB            = BLOCKED_BEFORE_QUOTE
10. PLANNED_VS_ACTUAL_OWNER_SIGN_OFF = NOT_STARTED
```

Step 1 established the living canons and governance pointers. Step 2 recovered the existing HUB MEDIA Cloud organization under a later Owner GO. This file did not authorize that write.

`FULL_OLD_AND_NEW_UI_UX_AUDIT` is complete. The accepted evidence pack is `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md`. Route inventory is source-proven, not full page coverage and not cartesian state coverage.

`UI_UX_CANON_UPDATE_FROM_EVIDENCE` is complete. That revision distinguished invariants, evidence-supported conclusions, Figma candidates, and explicit deferrals. It did not declare a sidebar, a Catalog label, a visual style, or a component library as final. Execution detail lives in `docs/worklog/WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1.md`.

`FIGMA_ACCESS_AND_INFORMATION_ARCHITECTURE` is Owner-accepted with amendments. That 2026-08-25 IA selected top nav and Level 1 Lucrări | Atelier | Comercial | Catalog | Administrare. On 2026-08-30 Owner accepted V3 as living navigation direction: one stable sidebar, six categories, twenty pages. The earlier IA remains historical. `Configurează` stays a contextual action. Product System stays under Administrare. Visual direction A and the first HF lot remain accepted. Execution detail lives in `docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md` and `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.

`PILOT_HIGH_FIDELITY_SCOPE_DEFINITION` is Owner-accepted with amendments. The first lot includes job detail, quote decision inspection, and execution so the pilot can be validated through planned-vs-actual. The stable job URL is `/jobs/:jobId` with `jobId = orderSnapshotId`. `/orders/:orderSnapshotId` is rejected as the primary UI route. No Job table. Admin pattern reuse stays domain-aware; universal CRUD is forbidden. Execution detail lives in `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_SCOPE_DEFINITION_V1.md`.

`PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION` is Owner-accepted with amendments. Final visual direction is A — Industrial Clarity. B and C remain visible comparative reference. Execution detail lives in `docs/worklog/WORKOS_PILOT_HIGH_FIDELITY_FOUNDATION_AND_VISUAL_DIRECTION_V1.md`.

`FIRST_HF_LOT_SCREEN_DESIGN` is `OWNER_ACCEPTED`. The first lot is drawn in Figma on pages 12–21, in direction A, with Lucide plus WorkOS custom icons and a same-page E2E prototype. Job detail and quote inspection are in the lot. Their URL and money contracts are `OWNER_ACCEPTED` in `docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md`: `/jobs/:jobId`, `/quotes/:quoteSnapshotId`, `MONEY_POLICY = ALT_B_SCOPED`. Execution detail lives in `docs/worklog/WORKOS_FIRST_HIGH_FIDELITY_LOT_SCREEN_DESIGN_V1.md`. This file does not authorize React/CSS, Mobbin, or a production component library.

Wave 1 of scoped UI implementation is `OWNER_ACCEPTED` with advisories. Wave 2 is `OWNER_ACCEPTED` with advisories. Wave 3 is `OWNER_ACCEPTED` with advisories. Wave 4 is `OWNER_ACCEPTED` with advisories. Wave 5 is `OWNER_ACCEPTED` with advisories and completes the first HF lot UI. Step 8 is `OWNER_ACCEPTED`. Steps 9–10 remain not started and are not authorized by this accept. Do not invent a Product System admin rewrite from the historical foundation “next candidate” line.

Step 8 configured the recovered HUB MEDIA organization with the existing seller, people, PIN, cost-confirm, and explicit provider/CLI path. It is not universal Machine Admin. Execution detail lives in `docs/worklog/WORKOS_HUB_MEDIA_ORGANIZATION_CONFIGURATION_STEP8.md`.

Step 9 is `BLOCKED_BEFORE_QUOTE` because a live first-job quote is still unauthorized. The pre-quote wave OS-S3 + OS-S4 + OS-S5 is `IMPLEMENTED_LOCAL_IN_REVIEW` on `feat/first-real-letters-prequote-v1`. `200 EUR + TVA` is the first-real-job manual fixed customer price, not an organization default and not installation EIC. It does not authorize a live quote, a live Cerere PATCH, OS-S6, or Architecture C UI Wave 2. The old-versus-new Cerere and Configurator audit is `CLOSED_WITH_ADVISORIES`. The orphan-link gate is `CLOSED`. Neither reopens Phase 1.

Do not start a live first LETTERS quote from this document. The named HUB step remains `FIRST_REAL_LETTERS_JOB`, still blocked before a real quote. OS-S1 and OS-S2 are on main. OS-S3 + OS-S4 + OS-S5 are `IMPLEMENTED_LOCAL_IN_REVIEW` on `feat/first-real-letters-prequote-v1`. They are not Owner-accepted and not integrated on main. OS-S6 transport and later slices still need a separate Owner GO. V3 navigation design is Owner-accepted. This file does not authorize Oferte V3 or Lucrări V3.

## Operational Services program

Owner-accepted application-wide spine. Installation is the first real capability. This is not an isolated installation-cost patch and not an independent side project.

```text
OPERATIONAL_SERVICES_ARCHITECTURE        = OWNER_ACCEPTED
PHASE_1                                  = INTEGRATED_ON_MAIN
OS_S1_ORG_CAPABILITY_AND_REQUEST_MODE    = IMPLEMENTED_CURRENT / BASIC
OS_S1_INTEGRATION                        = INTEGRATED_ON_MAIN
OS_S2                                    = INTEGRATED_ON_MAIN
OS_S2_INSTALL_FACTS                      = IMPLEMENTED_CURRENT / BASIC
OS_S2_TYPED_FACTS                        = IMPLEMENTED_CURRENT / BASIC
OS_S2_DESIGN                             = OWNER_ACCEPTED
OS_S2_IMPLEMENTATION                     = INTEGRATED_ON_MAIN
OS_S2_TRANSACTION_SAFETY                 = CLOSED
OS_S3                                    = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S3_EVIDENCE_AND_EIC                   = IMPLEMENTED_LOCAL_IN_REVIEW
UI_UX_NAVIGATION_V3_DESIGN               = OWNER_ACCEPTED
UI_UX_NAVIGATION_V3_IMPLEMENTATION       = INTEGRATED_ON_MAIN
UI_V3_PAGE_CONTENT_TRANSFORMATION        = IN_PROGRESS
CLIENTS_V3                               = INTEGRATED_ON_MAIN
CLIENTS_FIGMA_DIRECTION                  = OWNER_ACCEPTED
CLIENTS_RUNTIME                          = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE                       = CLOSED
CLIENT_HUB_FIGMA_FINAL                   = OWNER_ACCEPTED
CLIENT_HUB_RUNTIME                       = OWNER_ACCEPTED
CLIENT_HUB_TECHNICAL_GATE                = CLOSED
CLIENT_HUB                               = INTEGRATED_ON_MAIN
CERERI_V3_FIGMA_FINAL                    = OWNER_ACCEPTED
REQUESTS_DIRECTION                       = OWNER_ACCEPTED
CERERI_TECHNICAL_GATE                    = CLOSED
REQUESTS_RUNTIME                         = OWNER_ACCEPTED
CERERI_RUNTIME                           = OWNER_ACCEPTED
CERERI_INTEGRATED_ON_MAIN                = YES
REQUESTS_INTEGRATED_ON_MAIN              = YES
NEXT_PROGRAM_PRIORITY                    = UI_V3_COMMERCIAL_PAGE_REORGANIZATION
OS_S4_SERVICE_COMMERCIAL                 = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S5_MULTI_LINE_QUOTE                   = IMPLEMENTED_LOCAL_IN_REVIEW
OS_S6_TRANSPORT                          = NOT_STARTED / NOT_AUTHORIZED
OS_S7_ORDER_SERVICE_TRUTH                = NOT_STARTED
OS_S8_FIELD_EXECUTION                    = NOT_STARTED
OS_S9_SERVICE_ACTUALS                    = NOT_STARTED
OS_S10_PROFITABILITY                     = NOT_STARTED
OS_S11_ADMIN_MULTI_COMPANY               = NOT_STARTED
PHASE_2_IMPLEMENTATION                   = NOT_AUTHORIZED
LIVE_REQUEST_PATCH                       = NO
QUOTE_CREATE                             = NO
FIRST_REAL_LETTERS_JOB                   = BLOCKED_BEFORE_QUOTE
```

OS-S1 is implemented on main. OS-S2 design is Owner-accepted: structured Request-owned site address; site-only measurements; typed facade/fixing plus OTHER; electrical UNCONFIRMED plus the four accepted outcomes; one typed row per Request/capability, deleted on deselect with confirmation. OS-S2 typed facts are implemented on main. Transaction safety is closed. OS-S3 + OS-S4 + OS-S5 are `IMPLEMENTED_LOCAL_IN_REVIEW`: INTERNAL and SUBCONTRACTED install EIC, Owner-only manual fixed service price, additive Quote v2. They are not Owner-accepted and not on main. Follow-up facts remain unimplemented: ACCESS_METHOD_AND_EQUIPMENT, FIXINGS_CONSUMABLES, SITE_PHOTOS. CREW_SIZE and PLANNED_DURATION are in the local pre-quote wave. OS-S6 transport and later slices still need a separate Owner GO. V3 navigation design is Owner-accepted. This file does not authorize Oferte V3, Lucrări V3, real Cloud write, or a live first-job quote. Missing org configuration does not hide a persisted service selection or remove its freeze/link gates.

Gates: org default `SERVICE_DISABLED` for new orgs and for existing orgs with no selected Requests; persisted selections stay visible and fail-closed until Owner configuration; later org disable is prospective only; lock selection/mode after first linked Quote; transport remains a separate capability; service commercial is `MANUAL_FIXED_PER_REQUEST`, not cost-plus; service price write authority is deferred until OS-S4; internal labor EIC is person-hour based when later implemented; orphan-link gate `CLOSED`; old-versus-new Cerere/Configurator audit `CLOSED_WITH_ADVISORIES`; explicit QUOTE_CREATE GO before the first real multi-line offer; frozen Order/Release before field tasks.

See `docs/architecture/OPERATIONAL_SERVICES_CANON.md` and `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.

Architecture C UI Wave 1 is `OWNER_ACCEPTED_WITH_ADVISORIES` and integrated on `origin/main`. It does not replace the HUB sequence and does not authorize Wave 2, Figma publish, or the first real LETTERS job. Execution detail lives in `docs/worklog/WORKOS_ARCHITECTURE_C_UI_WAVE_1_IMPLEMENTED_LOCAL_IN_REVIEW_V1.md`.

Clients V3 registry is `INTEGRATED_ON_MAIN` at product SHA `6190207b72fb723ef0c0276864d74dcb2bc7aa4a`. Client Hub is `INTEGRATED_ON_MAIN` at product SHA `05b8ae2ccf769f82ee9c702b37950a108d8203a2`. Cereri V3 Figma is `OWNER_ACCEPTED`. Cereri V3 runtime is `OWNER_ACCEPTED` and `INTEGRATED_ON_MAIN` at product SHA `03f2d747036b5ac219f283f5a969d575a9a707c9` (Owner accept record `ef4dd73514583bda2754456e2e5730ac96fc5f31`). Page-content transformation remains `IN_PROGRESS`. Oferte and Lucrări page-content redesigns are not accepted and are not integrated. Commercial page reorganization is not complete. The next unfinished commercial domain is selected only after independent roadmap review. Records: `docs/worklog/WORKOS_UI_V3_CLIENTS_FINAL_INTEGRATED_ON_MAIN.md`, `docs/worklog/WORKOS_UI_V3_CLIENT_HUB_FINAL_INTEGRATED_ON_MAIN.md`, `docs/worklog/WORKOS_UI_V3_CERERI_FIGMA_FINAL_OWNER_ACCEPTED.md`, `docs/worklog/WORKOS_UI_V3_CERERI_IMPLEMENTED_LOCAL_IN_REVIEW.md`, `docs/worklog/WORKOS_UI_V3_CERERI_RUNTIME_FINAL_OWNER_ACCEPTED.md`, and `docs/worklog/WORKOS_UI_V3_CERERI_INTEGRATED_ON_MAIN.md`.

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
PEOPLE                        = 8
WORKCENTERS                   = 2
MACHINES                      = 2
PROVIDER_CONFIGURATION        = APPLIED
SELLER_PROFILE                = COMPLETE
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

V3 map reconciliation, not a V1 implementation GO:

```text
PONTAJ / PLĂȚI INTERNE / FURNIZORI / ACHIZIȚII / RAPOARTE
  BASELINE              = RETAINED_ON_V3_MAP
  IMPLEMENTATION        = NOT_IMPLEMENTED
  AUTHORIZATION         = NOT_AUTHORIZED
```

Those destinations stay on the accepted V3 map. They are not eliminated from the product. They may stay deferred or optional. This file does not authorize building them. Rapoarte stay a shortcut on Acasă, not a new menu page. Internal leave/absence (`OUT-EMP-REQUESTS`) maps to Oameni → Angajați, not Comercial → Cereri.

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
