# WorkOS session current

```text
ROLE                       = INDEX
OWNS                       = RECONCILIATION_CHECKPOINT, SESSION_POINTERS
DOES_NOT_OWN               = DELIVERY_SEQUENCE, PRODUCT_TRUTH, LIVE_GITHUB_STATE, FIGMA_FRAMES
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = RECONCILE_AFTER_STABLE_CHECKPOINT_OR_WHEN_HANDOFF_STALE
```

This is an index and reconciliation checkpoint. It is **not** a second roadmap.

If this file disagrees with live GitHub or the living roadmap, live sources win.

```text
HANDOFF_STALE              = YES when this file is older than live GitHub
LIVE_GITHUB_WINS           = YES
LIVE_MAIN_AUTHORITY        = GITHUB_ORIGIN_MAIN
CACHED_SHA                 = EVIDENCE_ONLY
```

Do not treat a cached SHA as current integration authority. This file must not become false merely because its own documentation PR later merges.

## Pointers

| Key | Pointer |
|---|---|
| REPO | `office952/workos-final` |
| LIVE_MAIN_AUTHORITY | GitHub `origin/main` |
| DELIVERY_ROADMAP | `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` |
| AUTHORITY_MAP | `docs/governance/WORKOS_AUTHORITY_MAP.md` |
| TERMINOLOGY_CANON | `docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md` |
| DOCUMENTATION_GOVERNANCE | `docs/governance/WORKOS_DOCUMENTATION_GOVERNANCE.md` |
| CURSOR_WORKFLOW | `docs/development/WORKOS_CURSOR_WORKFLOW.md` |
| CI_TIERING | `docs/development/WORKOS_CURSOR_WORKFLOW.md` plus `scripts/classify-ci-impact.mjs` |
| CURSOR_PLUGIN_REGISTRY | `docs/CURSOR_PLUGINS.md` |
| FIGMA_WORKFLOW | `docs/development/WORKOS_FIGMA_WORKFLOW.md` |
| PRODUCT_TRUTH_AUTHORITIES | current ProductTemplates / FormSchemas / component contracts / `compileDefinition` plus `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md` |
| UI_UX_AUTHORITIES | `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`; `docs/architecture/UI_UX_FOUNDATION_CANON.md`; current Configurator implementation on main plus `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md` as documented guardrail |
| NEW_SESSION_BOOTSTRAP | `docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md` |

## Checkpoint recorded at documentation continuity V1

This block is a checkpoint copied from the living roadmap plus live GitHub evidence. Re-read those authorities before acting. Do not treat this file as the delivery sequence.

```text
LAST_RECONCILED_MAIN_BASE              = 8c2223b3a7853e6c0ebb788e44046401985d7f1f
LAST_COMPLETED_PRODUCT_MILESTONE       = CONFIGURATOR_FORM_COMPLETENESS_FC1_INTEGRATED_ON_MAIN
PR27                                   = INTEGRATED_ON_MAIN
CURRENT_PRODUCT_PROGRAM                = CONFIGURATOR_FORM_COMPLETENESS
CURRENT_PRODUCT_SLICE                  = FC2C_LETTERS_VOLUME_CANT_FORM_AND_RESOLVER
NEXT_PRODUCT_SLICE                     = CONFIGURATOR_LETTERS_RUNTIME_TO_FIGMA_POLISH_ROUNDTRIP
NEXT_PRODUCT_GATE                      = OWNER_REVIEW_FC2C_THEN_LETTERS_ROUNDTRIP
FC2_AUTHORIZED                         = FC2A_LOCAL_IN_REVIEW_ONLY
FC2A_IMPLEMENTED_LOCAL_IN_REVIEW       = YES
FC2A1_IMPLEMENTED_LOCAL_IN_REVIEW      = YES
FC2D_IMPLEMENTED_LOCAL_IN_REVIEW       = YES
FC2B_IMPLEMENTED_LOCAL_IN_REVIEW       = YES
FC2C_IMPLEMENTED_LOCAL_IN_REVIEW       = YES
FC2D_AUTHORIZED                        = NO
FC2B_AUTHORIZED                        = NO
FC2C_AUTHORIZED                        = NO
FC2_DECISION_PACK                      = ACCEPTED_WITH_TARGETED_AMENDMENTS
```

### Owner-accepted items relevant to current position

Read the living roadmap for the full accepted set. Do not duplicate volatile flags here. Relevant to the current product position:

- Configurator UI/UX is the only current page-level Owner-approved UI/UX surface. Authority is the implemented application on main. Figma `219:3` is the accepted design baseline / reference, not a reason to revert later accepted refinements.
- FORM_COMPLETENESS_AUDIT_V1 accepted
- FC1 integrated on main via PR #26
- LETTERS and ACM remain the two live ProductTemplates
- UI20 Candidate A quiet top shell is the current implemented presentation and is reference, not the required visual migration base. UI20 direction remains valid. It does not Owner-accept other pages. Other pages are not rejected.

### Open Owner decisions

Category D items from FORM_COMPLETENESS_AUDIT_V1 remain Owner-decision-required except the FC2A shared Finish / Color / Roll foundation, the FC2A1 cost-readiness / capability-semantics correction, the FC2D resource identities plus functional provisional costing, the FC2B LETTERS FACE V2 form + catalog resolver, and the FC2C LETTERS VOLUME/CANT V2 form + catalog resolver, all local in review. Historical LETTERS templateVersion = 1 snapshots stay on the V1 form. Do not start Figma write, design-delta implementation, or resume PURE CLIMATE from this file.

### Accepted advisories

- `CONFIGURATOR_PROGRESS_MODULE_COPY` terminology debt
- `VOLUME_LABEL_CANT_VS_VOLUM` terminology debt
- Category C Form Completeness items remain deferred

### Policies

```text
REAL_CLOUD_POLICY                        = NO_WRITE_WITHOUT_EXPLICIT_OWNER_GO
PRODUCT_TRUTH_WRITE_POLICY               = NO_EXPANSION_WITHOUT_EXPLICIT_OWNER_GO
FIGMA_WRITE_POLICY                       = NO_WRITE_WITHOUT_EXPLICIT_OWNER_GO
MERGE_POLICY                             = NO_MERGE_WITHOUT_EXPLICIT_OWNER_GO
CONFIGURATOR_CURRENT_UI_UX_AUTHORITY     = CURRENT_IMPLEMENTED_APPLICATION_ON_MAIN
FIGMA_219_3_ROLE                         = ACCEPTED_BASELINE_REFERENCE
FORCE_SYNC_APP_TO_FIGMA                  = NO
OWNER_APPROVED_CURRENT_UI_UX_SURFACES    = CONFIGURATOR_ONLY
CONFIGURATOR_CURRENT_UI_UX               = OWNER_APPROVED_IMPLEMENTED_APPLICATION
OTHER_PAGE_UI_UX_OWNER_ACCEPTANCE        = NOT_GRANTED
OTHER_WORKOS_PAGES_UI_UX                 = NOT_OWNER_APPROVED_BY_CURRENT_ACCEPTANCE
UI_UX_DIRECTION                         != PAGE_LEVEL_OWNER_ACCEPTANCE
IMPLEMENTED                             != OWNER_ACCEPTED
FIGMA_REFERENCE                         != OWNER_ACCEPTED
```

## Protocols

SESSION_START_PROTOCOL: `docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md` and the preflight in `docs/development/WORKOS_CURSOR_WORKFLOW.md`.

SESSION_CLOSE_PROTOCOL: session-close routine in `docs/development/WORKOS_CURSOR_WORKFLOW.md`.

If contradiction exists after preflight:

```text
CONTINUITY_CONTRADICTION = YES
```

Do not start implementation until the contradiction is reported or reconciled.
