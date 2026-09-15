# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Pointers

| Need | Authority |
|---|---|
| Delivery direction | `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md` |
| Where to look | `docs/governance/WORKOS_AUTHORITY_MAP.md` |
| Romanian UI terms | `docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md` |
| Documentation roles | `docs/governance/WORKOS_DOCUMENTATION_GOVERNANCE.md` |
| Cursor method | `docs/development/WORKOS_CURSOR_WORKFLOW.md` |
| Figma method | `docs/development/WORKOS_FIGMA_WORKFLOW.md` |
| Session continuity | `docs/continuity/WORKOS_SESSION_CURRENT.md` |
| New-chat start | `docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md` |
| Plugin / MCP inventory | `docs/CURSOR_PLUGINS.md` |
| UI/UX direction | `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md` |
| Implemented presentation | `docs/architecture/UI_UX_FOUNDATION_CANON.md` |

`docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` is construction history.

This file is not a second roadmap, plugin manual, terminology encyclopedia, or Figma catalog.

## Preflight

Before any implementation:
- read `docs/continuity/WORKOS_SESSION_CURRENT.md`
- read `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- fetch / verify live GitHub `origin/main`

Before any UI/UX change, also read `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.

Any agent must report:

```text
ROADMAP_READ
UI_UX_CANON_READ
DIRECTION_CONFLICT
CONTINUITY_PREFLIGHT = PASS | FAIL
```

If recorded continuity, live GitHub, living roadmap, or applicable canon contradict: `CONTINUITY_PREFLIGHT = FAIL`. Do not start implementation.

```text
CURRENT DELIVERY STATE = READ ACTIVE ROADMAP
LIVE_MAIN_AUTHORITY    = GITHUB_ORIGIN_MAIN
AGENTS.md MUST NOT be a second living roadmap
```

Do not duplicate volatile milestone flags here. If this file and the roadmap disagree, the roadmap wins. If this file and live GitHub disagree, live GitHub wins.

## Current position

Two live ProductTemplates: LETTERS front-lit and Panou ACM casetat. FACE / VOLUME / BACK / LIGHTING are roles. See `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`.

Read live flags, next authorized slice, Cloud/pilot gates, and UI closure from the living roadmap and live GitHub. Do not treat older worklogs or this file as the status authority.

## Working rules

- E2E first. A green unit test is not enough. A feature is done when source of truth, contract, backend, API, UI projection, operator interaction, runtime, and tests stay coherent.
- Current WorkOS and other previous repos are read-only reference/evidence. Do not write there. Do not copy architecture or wholesale code.
- UI may code experience. UI must not code business truth: fields, materials, formulas, pricing, readiness, statuses, totals, or Product Truth.
- Operator-facing UI is in Romanian. Internal code and contracts may stay in English.
- Modular product law: an unselected module is silent. A selected module is independently validatable and calculable. Complete product is composition of the same contracts. No hidden parallel calculators. Operator anatomy labels are componente; see the terminology canon for the Configurator “module validate” debt.
- Technical quantity, resource identity, internal cost evidence, EIC, and commercial price stay separate. Rates live only in Resources/Cost.
- Adjustable technical values live in canonical Product System component settings. Documentation explains them. Calculation code consumes them. Intake does not administer them.
- Each domain owns its settings and entities. Do not create a global Settings dump or a new V3 category to place a future system. See `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`.
- Confirm the exact reviewed definition. Do not recompile a later draft at confirm time.
- Catalog organization (family / recursive category) is not product technical truth.
- ProductTemplate is the configurable product. Do not invent a parallel Product entity without Owner GO.
- SVG Analyzer is a separate application. Its output is evidence/proposal, not final truth, until an operator confirms it.
- Owner gates: no business DB, migrations, seeds, or destructive data work without Owner GO.
- Runtime is required. Do not claim PASS from mocks, screenshots, or hardcoded UI states.
- Keep a persistent worklog under `docs/worklog/`.
- Default: one implementation owner. No parallel implementation agents or speculative architecture.
- Operational services that span Request → Quote → Order → Execution follow `docs/architecture/OPERATIONAL_SERVICES_CANON.md`. Installation-specific law is `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.
- Do not implement installation as a LETTERS module or ProductDefinition field.
- Product cost-plus must not price operational services. Service commercial is a separate Owner-only manual-fixed channel.
- Transport remains a separate capability. Do not nest it under montaj.
- Do not create operational-service tasks before a frozen Order / Production Release.
- Do not implement full ACM, illuminated ACM, Analyzer runtime, or a new product template without an explicit Owner GO.
- Every future Owner-facing page requires an old-versus-new UI/UX/code audit before implementation.
- UI20 presentation rebuild is a vertical clean-sheet North Star over the existing domain/API. Do not resume horizontal RW2/RW3 page-by-page main integration. Do not treat current page composition as the required visual foundation. Live sequence flags live only in the roadmap.

## Bootstrap proof

The app has the UI20 Candidate A quiet top shell over existing routes and existing page bodies. That current presentation is reference and constraint, not the required visual migration base. No partial live-route cutover. `/` stays Lucrări until an explicit Acasă contract.

LETTERS none/none at 60 mm is the regression anchor. ACM cassette is the second Quote-ready product on the same engines. Unselected roles stay silent. Historical snapshots stay immutable. Analyzer stays outside WorkOS.

Live flags, Cloud write gates, and the next authorized build live only in `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.

## Cursor method

See `docs/development/WORKOS_CURSOR_WORKFLOW.md`. Harness V2 inventory remains in `docs/CURSOR_PLUGINS.md`. Both are tooling methodology. They are not Product Truth and not a second roadmap.

Owner GO authorizes scope, not command syntax. `ROUTINE_COMMAND_CONFIRMATION = FORBIDDEN`. `EXACT_HEAD_RELEVANT_CI` is required before integration; the CI tier follows change impact. Ambiguous impact is conservative full.

## Owner awareness

Every implementation report must end with:

```text
OWNER_UPDATE_LINKS
PURPOSE           = OWNER_AWARENESS
APPROVAL_REQUIRED = NO
```

These links are not an Owner approval request. If nothing was modified: `MODIFICATIONS = NONE`.
