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
| UI_FOUNDATION_V1_ACCEPTANCE | `docs/worklog/WORKOS_UI_FOUNDATION_V1_OWNER_ACCEPTANCE.md` |
| NEW_SESSION_BOOTSTRAP | `docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md` |

## Checkpoint recorded after UI20 closure

This block is a checkpoint copied from the living roadmap plus live GitHub evidence on 2026-09-18. Re-read those authorities before acting. Do not treat this file as the delivery sequence. `POST_UI20_COMMERCIAL_CONTEXT_CLOSURE_V1` is completed history, not the current product program.

```text
LAST_RECONCILED_MAIN_BASE              = f0a14328d3ec1aada2311f7741a7450d414460a6
LAST_COMPLETED_EXTERNAL_PROGRAM        = POST_UI20_COMMERCIAL_CONTEXT_CLOSURE_V1
LAST_COMPLETED_PRODUCT_MILESTONE       = CONFIGURATOR_FORM_COMPLETENESS_FC1_INTEGRATED_ON_MAIN
PR27                                   = INTEGRATED_ON_MAIN
PR33                                   = INTEGRATED_ON_MAIN
UI20_PRESENTATION_REPO                 = office952/workos-ui20
UI20_OWNER_ACCEPTED                    = YES
UI20_INTEGRATED_ON_UI20_MAIN           = YES
UI20_INTEGRATED_HEAD                   = bce6ada83c9a0a427ac62cac8938e7f589dfd2e1
POST_UI20_COMMERCIAL_CONTEXT_CLOSURE_V1 = OWNER_ACCEPTED_AND_INTEGRATED
UI20_PHASE_5_STARTED                   = NO
UI20_PHASE_6_STARTED                   = NO
UI20_DEPLOYED_INTO_WORKOS_FINAL        = NO
UI20_CUTOVER                           = NO
CURRENT_PRODUCT_PROGRAM                = FIRST_REAL_LETTERS_REAL_DATA_PREPARATION_V1
NEXT_PRODUCT_PROGRAM                   = FIRST_REAL_LETTERS_REAL_DATA_PREPARATION_V1
CURRENT_PRODUCT_SLICE                  = NONE_AUTHORIZED
NEXT_PRODUCT_PROGRAM_AUTHORIZED        = NO
NEXT_PRODUCT_SLICE                     = NOT_AUTHORIZED
NEXT_PRODUCT_GATE                      = OWNER_GO_REQUIRED
FC2_AUTHORIZED                         = NO
QUOTE_SNAPSHOT_CUSTOMER_REQUEST        = DETAIL_TRANSPORT_PROJECTION_ONLY / CLOSED_IN_UI20_PRESENTATION
REQUEST_ID_ADDED_TO_QUOTE_SNAPSHOT     = NO
JOB_TO_ATELIER_JOB_CONTEXT             = NOT_A_GAP_CURRENT_CANON
CONFIGURATOR_FREEZE_RUNTIME            = CLOSED_BY_ISOLATED_SYNTHETIC_PROOF
```

### Owner-accepted items relevant to current position

Read the living roadmap for the full accepted set. Do not duplicate volatile flags here. Relevant to the current product position:

- Configurator UI/UX is the only current page-level Owner-approved UI/UX surface. Authority is the implemented application on main. Figma `219:3` is the accepted design baseline / reference, not a reason to revert later accepted refinements.
- FORM_COMPLETENESS_AUDIT_V1 accepted
- FC1 integrated on main via PR #26
- LETTERS and ACM remain the two live ProductTemplates
- UI20 Candidate A quiet top shell is the current implemented presentation and is reference, not the required visual migration base. UI20 direction remains valid. It does not Owner-accept other pages. Other pages are not rejected.
- UI Foundation V1 is Owner-accepted (2026-09-16) as documentation / Figma direction. Living record: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` plus `docs/worklog/WORKOS_UI_FOUNDATION_V1_OWNER_ACCEPTANCE.md`. This does not Owner-accept runtime presentation.

### Open Owner decisions

Category D items from FORM_COMPLETENESS_AUDIT_V1 remain Owner-decision-required (catalogs, richer construction facts). Do not implement them from this file.

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
