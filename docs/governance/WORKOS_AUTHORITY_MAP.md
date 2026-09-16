# WorkOS authority map

```text
ROLE                       = INDEX
OWNS                       = QUESTION_TO_AUTHORITY_ROUTING
DOES_NOT_OWN               = PRODUCT_TRUTH, DELIVERY_SEQUENCE, LIVE_GITHUB_STATE, FIGMA_FRAMES, CURSOR_PLUGIN_INVENTORY
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = NO
LAST_RECONCILIATION_RULE   = UPDATE_WHEN_A_PRIMARY_AUTHORITY_PATH_MOVES
```

Use this file to answer: *when I need to know X, where is the authority?*

It does not decide current milestones. GitHub live state decides whether something is actually merged.

## Critical law

| Claim | Authority |
|---|---|
| Is it merged? | Live `origin/main` on GitHub |
| What should we build next? | Living roadmap |
| What fields exist? | Current ProductTemplate / FormSchema |
| Is the product ready? | `compileDefinition.readiness` |
| How should it look? | Applicable UI/UX canon. For Configurator: current `apps/web` implementation on main plus `CONFIGURATOR_V1_UI_FRAMEWORK` as documented guardrail. Figma only where a living canon assigns that class |
| Is this page's current UI/UX Owner-approved? | Only Configurator. `OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY`. Other pages: acceptance not granted, not rejected |

A worklog saying `IMPLEMENTED_LOCAL_IN_REVIEW` does not override a live merged PR.
A Figma frame does not override Product Truth.
A Figma frame does not override later accepted Configurator implementation refinements.
UI20 direction, an implemented shell, or a page existing in the app is not page-level Owner acceptance of that page.
Owner-accepted UI Foundation V1 is documentation / Figma foundation direction. It is not runtime Owner acceptance and not a second UI canon.
A session continuity snapshot does not override the roadmap.
A cached SHA is evidence, not current integration authority.

## Routing table

| QUESTION | PRIMARY AUTHORITY | SECONDARY EVIDENCE | MUST_NOT_USE_AS_AUTHORITY |
|---|---|---|---|
| Delivery direction / next authorized slice | `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` | plans under `docs/plans/` | `AGENTS.md`, worklogs, session continuity |
| Current integration / merged state | GitHub `origin/main` and merged PRs | worklogs after reconciliation | cached SHA in a doc, `IMPLEMENTED_LOCAL_IN_REVIEW` alone |
| Product fields / options | Current ProductTemplates and FormSchemas in `packages/domain` | `docs/plans/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC0_PLAN.md` | Figma, UI copy, session files |
| Product readiness | `compileDefinition` | Configurator projection tests | UI progress copy, Figma completeness |
| Isolated UI / UI20 HTTP transport | `docs/architecture/WORKOS_UI_TRANSPORT_CONTRACT_V1.md` | `/api/health` `apiContractId`, preview/confirm/quote tests | importing `@workos-final/domain` in a separate frontend; CORS/cookie invention |
| Component configuration | `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md` | component contracts in `packages/domain` | Figma roles, invented modules |
| Technical settings | `docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md` | Product System settings in domain | Intake fields, docs literals |
| Resources / internal cost | `docs/architecture/RESOURCES_AND_COST_CANON.md` | EIC domain + Resources UI projection | commercial price, Figma |
| Commercial pricing | commercial canons + `CommercialPriceProjection` | Quote Snapshot / PDF canons | EIC, Figma prices |
| Execution | `docs/architecture/EXECUTION_PLAN_AND_TASKS_CANON.md` and related execution canons | Execution worklogs | Configurator, Figma |
| People / operator identity | `docs/architecture/PEOPLE_OPERATIONAL_IDENTITY_CANON.md` | People admin / Atelier projections | account email in Figma |
| Machines / workcenters | `docs/architecture/WORKCENTERS_AND_MACHINES_CANON.md` | `/admin/workcenters` projection | invented capacity UI |
| UI/UX direction | `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` | Foundation canon, UI20 worklogs | plugin inspiration, 21st.dev, treating direction as page-level Owner acceptance |
| Owner-accepted UI Foundation V1 documentation / Figma direction | `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` | `docs/worklog/WORKOS_UI_FOUNDATION_V1_OWNER_ACCEPTANCE.md`; WorkOs-F frames `12:6` / `12:225` / `12:579` / `15:4` | treating Foundation V1 as runtime accept; reconstructing missing `1:19519`; treating Task 2 `8:11` as current |
| Current page-level UI/UX Owner acceptance | Configurator only: implemented application on main plus `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md` | `docs/continuity/WORKOS_SESSION_CURRENT.md` (`OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY`) | UI20 Figma, implemented shell, page existence, historical V3/UI20 accepts as current all-pages accept |
| Implemented presentation law | `docs/architecture/UI_UX_FOUNDATION_CANON.md` | current `apps/web` shell | historical V3 Figma as live shell |
| Configurator current implemented presentation | current `apps/web` Configurator on `origin/main`, plus `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md` as documented guardrail | Configurator worklogs | Figma `219:3` as a reason to overwrite later accepted refinements; ProductTemplate; Figma Make business values |
| Configurator Figma `219:3` | `docs/development/WORKOS_FIGMA_WORKFLOW.md` (`ACCEPTED_BASELINE_REFERENCE`) | recorded `FIGMA_FILE` / `FIGMA_SECTION` in the frozen framework | current implementation visual authority |
| Figma visual / interaction reference | `docs/development/WORKOS_FIGMA_WORKFLOW.md` plus the canon that records the class | live Figma read | Product Truth, pricing, readiness, force-sync of accepted Configurator implementation |
| What Figma may polish on an already accepted surface | `docs/development/WORKOS_FIGMA_WORKFLOW.md` protected-region law | that surface's living canon; `docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md` `FRAMEWORK_CLASS` | generic “polish layout / responsive composition” as a global redesign license |
| Cursor methodology | `docs/development/WORKOS_CURSOR_WORKFLOW.md` | `docs/CURSOR_PLUGINS.md` Harness V2 section | Product Truth, roadmap |
| Plugin / MCP inventory | `docs/CURSOR_PLUGINS.md` | live Cursor namespaces in a session | old “already active” prose without classification |
| Romanian terminology | `docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md` | current operator UI source labels | general translation, English code names in UI |
| Session continuity | `docs/continuity/WORKOS_SESSION_CURRENT.md` | bootstrap + latest worklog | living roadmap replacement |
| Historical implementation evidence | `docs/worklog/` | plans | treating a worklog as current canon |

## Domain map

Cross-system administration ownership: `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`.
