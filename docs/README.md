# Documentation map

Use the authority map when you need to know *where* a fact lives: `docs/governance/WORKOS_AUTHORITY_MAP.md`.

If a current canonical document disagrees with runtime, the runtime / live GitHub wins and the document must be reconciled.

## Current canonical

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` — active V1 delivery direction
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` — UI/UX direction, including Owner-accepted UI Foundation V1 documentation / Figma authority
- `docs/architecture/UI_UX_FOUNDATION_CANON.md` — current implemented presentation law
- `docs/architecture/WORKOS_UI_TRANSPORT_CONTRACT_V1.md` — presentation-safe HTTP boundary for isolated UI / UI20
- `docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md` — documented guardrail of the accepted Configurator implementation; current UI/UX authority is the application on main. At this checkpoint only Configurator UI/UX is Owner-approved; other pages are not rejected and are not Owner-accepted by existence or UI20 direction.
- `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md` — role / type / configuration
- `docs/architecture/PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md` — technical settings
- `docs/architecture/RESOURCES_AND_COST_CANON.md` — resource identity and cost evidence
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md` — domain and administration map
- `README.md` — how to run the app
- `AGENTS.md` — short working rules and pointers

Other live architecture canons stay under `docs/architecture/`.

## Governance

- `docs/governance/WORKOS_DOCUMENTATION_GOVERNANCE.md` — document roles and documentation-impact gate
- `docs/governance/WORKOS_AUTHORITY_MAP.md` — question → authority routing
- `docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md` — operator Romanian terms

## Development method

- `docs/development/WORKOS_CURSOR_WORKFLOW.md` — how we use Cursor
- `docs/development/WORKOS_FIGMA_WORKFLOW.md` — how we use Figma

## Continuity

- `docs/continuity/WORKOS_SESSION_CURRENT.md` — index and reconciliation checkpoint
- `docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md` — minimal new-chat start

These files are not a second roadmap. Live GitHub is the integration authority.

## Tooling

- `docs/CURSOR_PLUGINS.md` — plugin / MCP inventory and Harness V2
- `scripts/verify-workos-docs-continuity.mjs` — deterministic docs check (`pnpm docs:check`)
- `scripts/classify-ci-impact.mjs` — change-impact CI tier (`pnpm ci:classify`)

Tooling does not own Product Truth.

Operator-facing product parts are **componente**: Față / FAȚĂ, Volum / CANT, Spate / SPATE, Iluminare. «Module» is reserved for system modules. Current Configurator progress copy still says `N din M module validate`; that is recorded terminology debt, not a new meaning.

## History / evidence

Worklogs prove what was implemented. They are not current canon.

Current product-program evidence:

- `docs/plans/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC0_PLAN.md`
- `docs/worklog/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC1_IMPLEMENTED_LOCAL_IN_REVIEW.md`
- `docs/worklog/WORKOS_DOCUMENTATION_AND_SESSION_CONTINUITY_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md`
- `docs/worklog/WORKOS_UI_FOUNDATION_V1_OWNER_ACCEPTANCE.md`
- `docs/plans/2026-09-16-apply-ui-foundation-v1-led-calculation-surface.md`

Historical construction map: `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md`.

All other implementation records: `docs/worklog/`.
