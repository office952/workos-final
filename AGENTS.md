# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Current position

Hierarchical product catalog plus first canonical LETTERS product.
FACE / VOLUME / BACK / LIGHTING are stable component roles. Constructive types and product configuration are separate. See `docs/architecture/PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`.
Owner-facing projections: Module și componente, Guvernanța sistemului, Administrare.
`/components` is the Product System inspection surface. `/admin` is the owner surface: Product System display-label write, Resources / Cost inspection, and Operational Processes inspection including Letters process composition. The first persisted write is display-label only.
Cross-system domain and administration map is canonical; do not invent a second admin model per domain.
ProductTemplate composes roles/types and owns allowed/fixed configuration. ProductAggregate orchestrates. EIC is generic.
LIGHTING remains unavailable: LED pitch is a canonical component setting; PSU reserve remains owner-undecided.

```text
FIRST CANONICAL PRODUCT = TECHNICAL_PARTIAL
PHASE 6 = PILOT_VALIDATED
PHASE 7 = PILOT_VALIDATED
PHASE 8 = PILOT_VALIDATED
COMMERCIAL = NOT_COMPLETE
```

Do not implement Commercial, Quote, ACM, Analyzer runtime, a second catalog product, or the next product phase without an explicit Owner GO.

## Working rules

- E2E first. A green unit test is not enough. A feature is done when source of truth, contract, backend, API, UI projection, operator interaction, runtime, and tests stay coherent.
- Current WorkOS and other previous repos are read-only reference/evidence. Do not write there. Do not copy architecture or wholesale code.
- UI may code experience. UI must not code business truth: fields, materials, formulas, pricing, readiness, statuses, totals, or Product Truth.
- Operator-facing UI is in Romanian. Internal code and contracts may stay in English.
- Modular product law: an unselected module is silent. A selected module is independently validatable and calculable. Complete product is composition of the same contracts. No hidden parallel calculators.
- Technical quantity, resource identity, internal cost evidence, EIC, and commercial price stay separate. Rates live only in Resources/Cost.
- Adjustable technical values live in canonical Product System component settings. Documentation explains them. Calculation code consumes them. Intake does not administer them.
- Each domain owns its settings and entities. Do not create a global Settings dump or a top-nav link per future system. See `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`.
- Confirm the exact reviewed definition. Do not recompile a later draft at confirm time.
- Catalog organization (family / recursive category) is not product technical truth.
- ProductTemplate is the configurable product. Do not invent a parallel Product entity without Owner GO.
- SVG Analyzer is a separate application. Its output is evidence/proposal, not final truth, until an operator confirms it.
- Owner gates: no business DB, migrations, seeds, or destructive data work without Owner GO.
- Runtime is required. Do not claim PASS from mocks, screenshots, or hardcoded UI states.
- Keep a persistent worklog under `docs/worklog/`.
- Default: one implementation owner. No parallel implementation agents or speculative architecture.

## Bootstrap proof

The current app has a platform shell, a real health check, a product catalog, Product System inspection on `/components`, persisted display-label administration on `/admin`, Resources / Cost inspection under `/admin/resources`, Operational Processes inspection under `/admin/processes` including Letters process composition, owner-facing governance, one canonical front-lit plexi/aluminium letters product, component-owned FACE / VOLUME / BACK calculations with partial internal EIC, a reusable material-family/specification catalog, a typed operational-process catalog with shop-floor capability classes, a deterministic Letters process-composition compiler, canonical component technical settings, and lighting left unavailable because PSU reserve is still owner-undecided.
