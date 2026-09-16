# Apply UI Foundation V1 to the existing LED calculation surface

```text
ROLE                       = EVIDENCE
OWNS                       = NEXT_UI_SLICE_HANDOFF_ONLY
DOES_NOT_OWN               = PRODUCT_TRUTH, FORMULA_AUTHORITY, RUNTIME_ACCEPTANCE, IMPLEMENTATION_AUTHORIZATION
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = UPDATE_ONLY_WHEN_THE_NEXT_OWNER_GO_AUTHORIZES_OR_SUPERSEDES_THIS_SLICE
```

```text
PLAN                                   = APPLY_ACCEPTED_UI_FOUNDATION_TO_EXISTING_LED_CALCULATION_SURFACE
DATE                                   = 2026-09-16
AUTHORIZED                             = NO
IMPLEMENTATION                         = NOT_STARTED
FORMULA_2                              = NO
NEW_DOMAIN                             = NO
NEW_NAVIGATION                         = NO
PRODUCT_RUNTIME_OWNER_ACCEPTED         = NO
```

This file is the exact implementation contract for the next UI slice. The Foundation V1 accept GO prepared it. It does not authorize execution.

Living documentation authority: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
Acceptance record: `docs/worklog/WORKOS_UI_FOUNDATION_V1_OWNER_ACCEPTANCE.md`.

## Target surface

Apply accepted UI Foundation V1 presentation to the **current existing** single-formula LED calculation surface only.

At documentation time that surface lives as local-in-review on:

```text
BRANCH = feat/led-pitch-single-formula-e2e-v1
HEAD   = 6deb988c67018cc7dfe686f565111cc65012c2b8
```

Verify live HEAD before writing. Do not invent a second LED surface. Do not start from an unrelated dirty worktree. Do not start Formula 2.

Only one formula:

```text
ledModuleQuantity = ceil(volume.confirmedPerimeterMm / ledPitchMm)
```

The LED pilot already proved editable `ledPitchMm` and a visible formula trace. It did not prove Owner-editable formula expressions. Do not claim otherwise.

## Preserve

```text
PRODUCT / COMPONENT CALCULATION → technical quantities → ResourceRequirement / material consumption
RECIPE → SERVICE / LABOR operation quantity → CostEvidence → internal cost
COST EVIDENCE → monetary rate only
LED material = MAT-LED-MODULE
LED placement = RCP_PLACE_LED_MODULES
quantityBasis = LED_MODULE_QTY
```

Material consumption must not move into Recipe. No duplicate business ownership.

```text
PRICES_HARDCODED_IN_PRODUCT_CODE = FORBIDDEN
BUSINESS_FORMULAS_HARDCODED_IN_PRODUCT_CODE = FORBIDDEN as target architecture
MISSING_PRICE = NEVER_A_WORKFLOW_BLOCKER
MISSING_FORMULA = NEVER_A_WORKFLOW_BLOCKER
MANUAL_FALLBACK = ALWAYS_AVAILABLE
MANUAL_OVERRIDE = SUPPORTED_WITH_AUDIT
HISTORICAL_RECORDS = SNAPSHOT_APPLIED_VALUES
FUTURE_CHANGES != RETROACTIVE_RECALCULATION
```

Do not imply that the LED subtotal alone explains the entire client-price delta. Downstream effects such as PSU selection may affect total product / client pricing. The UI must state that relationship honestly.

## Presentation intent

Improve only the existing LED calculation surface:

- visual hierarchy
- relationship between Ofertă and Calcul LED
- compact vs expanded disclosure
- Formula / Inputs / Result hierarchy
- material line
- labor/service line
- subtotal
- provenance
- responsive 1440 / 1280 / 768
- clear distinction between internal LED subtotal and client price

Foundation law to apply, without semantic expansion: CALM INSTRUMENT; Azure = action / interaction; status color is semantic; one stable global shell; cards only where grouping/selection semantics justify them.

Reuse existing real components after a semantic fit check. Do not reconstruct missing node `1:19519`.

The Configurator framework remains frozen. This slice is a mutable presentation application to the existing Calcul LED / Ofertă disclosure. `OWNER_REOPEN_UI_FRAMEWORK` is not granted by the Foundation V1 accept.

## Exact next Owner GO — prepared, not executed

Copy the following prompt only when the Owner later authorizes this slice. Do not execute it from the Foundation V1 documentation accept.

---

OWNER GO — WORKOS APPLY UI FOUNDATION V1 TO SINGLE LED CALCULATION PILOT

OWNER DECISION
===============
This GO authorizes ONLY presentation application of the already Owner-accepted UI Foundation V1 to the current existing single-formula LED calculation surface.

It does NOT authorize:
- Formula 2
- a generic Formula domain
- a formula DSL
- a global formula admin
- new navigation
- a new product domain
- reconstruction of missing Figma node 1:19519
- a new design system or component library
- runtime Owner acceptance by documentation alone

IDENTITY / CONTINUITY
=====================
Repository: office952/workos-final

Before writing anything:
1. verify repo;
2. verify worktree;
3. verify branch;
4. verify HEAD;
5. verify origin/main;
6. verify clean/dirty status;
7. read docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md;
8. read AGENTS.md;
9. read docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md;
10. read docs/architecture/UI_UX_FOUNDATION_CANON.md;
11. read docs/worklog/WORKOS_UI_FOUNDATION_V1_OWNER_ACCEPTANCE.md;
12. read this handoff.

Do not trust remembered hashes. Report exact current values.

Use the existing LED calculation pilot surface. At Foundation V1 documentation time that surface was:

```text
BRANCH = feat/led-pitch-single-formula-e2e-v1
HEAD   = 6deb988c67018cc7dfe686f565111cc65012c2b8
```

Verify live HEAD. Continue that surface. Do not contaminate an unrelated dirty worktree. Do not create a second LED calculation surface.

If the current worktree/branch is not the existing LED calculation surface, STOP and report.

ACCEPTED FOUNDATION
===================
Figma file: WorkOs-F / M3Klzg7sulrtLSyxJBf3Vd
Accepted frames: 12:6, 12:225, 12:579, 15:4
Primary sources: 1:8520, 1:17238, 1:17039
COMPONENT_SYSTEM_1_19519 = MISSING / NOT_RECREATED
TASK2_8_11 = HISTORICAL_REFERENCE_ONLY
PRODUCT_CHARACTER = CALM INSTRUMENT
AZURE = ACTION / INTERACTION

FIGMA_WRITE = NO
FIGMA_DELETE = NO
Read Figma only if needed to apply the accepted foundation. Do not mutate Figma.

SCOPE
=====
ONLY ONE FORMULA:

```text
ledModuleQuantity = ceil(volume.confirmedPerimeterMm / ledPitchMm)
```

Target: the CURRENT EXISTING LED calculation surface only.
The Configurator framework remains frozen. Apply Foundation V1 as a mutable presentation delta to the existing Calcul LED / Ofertă disclosure. OWNER_REOPEN_UI_FRAMEWORK is not granted.

Improve:
- visual hierarchy;
- relationship between Ofertă and Calcul LED;
- compact vs expanded disclosure;
- Formula / Inputs / Result hierarchy;
- material line;
- labor/service line;
- subtotal;
- provenance;
- responsive 1440 / 1280 / 768;
- clear distinction between internal LED subtotal and client price.

The UI must state honestly that the LED subtotal does not by itself explain the entire client-price delta. Downstream effects such as PSU selection may affect total product / client pricing.

Do not promote example copy, 15.2px measurements, illustrative errors, reference-only calculation cards, dark mode, animation/motion, missing historical components, or speculative future screens into canon or tokens unless a proven implementation need appears in this slice.

COMPONENT RULE
==============
When a reusable component is needed:
existing real component → semantic fit check → reuse or minimal shared extraction.
NOT: missing historical library → imagined reconstruction.

ARCHITECTURE TO PRESERVE
========================
PRODUCT / COMPONENT CALCULATION → technical quantities → ResourceRequirement / material consumption
RECIPE → SERVICE / LABOR operation quantity → CostEvidence → internal cost
COST EVIDENCE → monetary rate only

LED material: MAT-LED-MODULE
LED placement: RCP_PLACE_LED_MODULES
quantityBasis: LED_MODULE_QTY

Material consumption MUST NOT move into Recipe.
No duplicate business ownership.

PRICES_HARDCODED_IN_PRODUCT_CODE = FORBIDDEN
BUSINESS_FORMULAS_HARDCODED_IN_PRODUCT_CODE = FORBIDDEN as target architecture
MISSING_PRICE = NEVER_A_WORKFLOW_BLOCKER
MISSING_FORMULA = NEVER_A_WORKFLOW_BLOCKER
MANUAL_FALLBACK = ALWAYS_AVAILABLE
MANUAL_OVERRIDE = SUPPORTED_WITH_AUDIT
HISTORICAL_RECORDS = SNAPSHOT_APPLIED_VALUES
FUTURE_CHANGES != RETROACTIVE_RECALCULATION

The current LED pilot proves editable ledPitchMm and a visible formula trace. It does NOT yet prove Owner-editable formula expressions. Do not claim otherwise.

Do not turn HUB MEDIA-specific visual/detail choices into universal product assumptions.
CUSTOMER_OPERABLE_WITHOUT_CURSOR = REQUIRED
CLIENT_SPECIFIC_CODE_FORK = FORBIDDEN

VOCABULARY
==========
ONE BUSINESS CONCEPT → ONE CANONICAL NAME → ONE OWNER → ONE SOURCE OF TRUTH
NEW TERM only if a semantic gap is proven.
SYNONYM → map to canonical.

MUTATION PERMISSIONS
====================
PRODUCT_CODE_WRITE = YES, only for the existing LED calculation presentation / projection path
NEW_FORMULA = NO
NEW_DOMAIN = NO
NEW_NAVIGATION = NO
CLOUD_WRITE = NO
REAL_BUSINESS_DB_WRITE = NO
QUOTE_WRITE = NO
FIGMA_WRITE = NO
PUSH = NO unless a later Owner GO says so
MERGE = NO

VALIDATION
==========
E2E first on the real LED calculation path.
Prove the formula is unchanged.
Prove material stays MAT-LED-MODULE and placement stays RCP_PLACE_LED_MODULES.
Prove LED subtotal versus client price remains honest.
Verify 1440 / 1280 / 768.
Do not claim product-runtime Owner acceptance from this implementation alone.

PARENT CHAT
===========
Do the work in the parent chat. Do not launch background / async subagents. Never Task resume:self. eCut is forbidden. Put the report in the parent message.

STOP
====
STOP after the existing LED calculation surface applies Foundation V1 presentation and the real path is proven.
Do not begin Formula 2.
Do not merge.
Do not mutate Figma.

---

Do not execute the prompt above from this documentation file.
