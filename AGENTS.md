# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Canonical direction

Active V1 delivery authority: `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.
Active UI/UX direction authority: `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`.
`docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` is construction history.
`docs/architecture/UI_UX_FOUNDATION_CANON.md` is the current implemented presentation law.

Before any implementation:
- read `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`

Before any UI/UX change:
- read `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- read `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`

Any agent must report:

```text
ROADMAP_READ
UI_UX_CANON_READ
DIRECTION_CONFLICT
```

Implementation reports also include the V1 roadmap checkpoint. UI changes also include the UI canon change-governance fields.

```text
CURRENT DELIVERY STATE = READ ACTIVE ROADMAP
AGENTS.md MUST NOT be a second living roadmap
```

Do not duplicate volatile milestone flags here. If this file and the roadmap disagree, the roadmap wins.

## Current position

Hierarchical product catalog plus two live ProductTemplates: LETTERS front-lit and Panou ACM casetat. Halo-lit and full-aluminium categories stay empty until Owner construction truth exists. FACE / VOLUME / BACK / LIGHTING are roles. Constructive types and product configuration are separate. See `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`.

Read live delivery flags, next build, Cloud/pilot gates, and UI closure from the active roadmap. Do not treat older worklogs or this file as the status authority.

## Working rules

- E2E first. A green unit test is not enough. A feature is done when source of truth, contract, backend, API, UI projection, operator interaction, runtime, and tests stay coherent.
- Current WorkOS and other previous repos are read-only reference/evidence. Do not write there. Do not copy architecture or wholesale code.
- UI may code experience. UI must not code business truth: fields, materials, formulas, pricing, readiness, statuses, totals, or Product Truth.
- Operator-facing UI is in Romanian. Internal code and contracts may stay in English.
- Modular product law: an unselected module is silent. A selected module is independently validatable and calculable. Complete product is composition of the same contracts. No hidden parallel calculators.
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

## Bootstrap proof

The app has a V3 stable sidebar on existing routes, a hierarchical catalog, schema-driven product configuration, Product System / Resources / Processes / Workcenters inspection, and the generic commercial spine: confirm → EIC → Commercial → Quote Snapshot → Acceptance → Order → Release → ExecutionPlan.

LETTERS none/none at 60 mm is the regression anchor through that spine. ACM cassette is the second Quote-ready product on the same engines. Unselected roles stay silent. Historical snapshots stay immutable. Analyzer stays outside WorkOS.

Live flags, Cloud write gates, and the next authorized build live only in `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.
