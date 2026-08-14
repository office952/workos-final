# WorkOS Final — agent notes

WorkOS Final is a clean reconstruction of the product operating system.
It is not a cleanup or fork of previous WorkOS repositories.

## Current position

Hierarchical product catalog plus first canonical LETTERS product.
RETURN_CANT technical / resource / EIC pilot is preserved on that product.

```text
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
- Confirm the exact reviewed definition. Do not recompile a later draft at confirm time.
- Catalog organization (family / recursive category) is not product technical truth.
- ProductTemplate is the configurable product. Do not invent a parallel Product entity without Owner GO.
- SVG Analyzer is a separate application. Its output is evidence/proposal, not final truth, until an operator confirms it.
- Owner gates: no business DB, migrations, seeds, or destructive data work without Owner GO.
- Runtime is required. Do not claim PASS from mocks, screenshots, or hardcoded UI states.
- Keep a persistent worklog under `docs/worklog/`.
- Default: one implementation owner. No parallel implementation agents or speculative architecture.

## Bootstrap proof

The current app has a platform shell, a real health check, a product catalog, one canonical front-lit plexi/aluminium letters product, and a RETURN_CANT technical quantity → resource demand → partial EIC path.
