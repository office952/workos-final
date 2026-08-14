# WORKOS_FINAL_PRODUCT_CATALOG_AND_FIRST_CANONICAL_PRODUCT_V1

TASK = Realign generic LETTERS pilot to a hierarchical catalog and the first canonical product

BASELINE = 20ef47374d9c80b028f976b97b281ab33efe2fc3

FEATURE COMMITS =
- fb2e58f feat(product): add catalog hierarchy and first canonical product
- fb05e57 feat(product): project catalog and realign product routes

## Catalog architecture

```text
ProductFamily
  → ProductCategory (parentId, recursive)
    → ProductTemplate (the configurable product)
```

No separate Product entity. ProductTemplate is the canonical configurable product, with catalog placement (`familyId`, `categoryId`).

In-code typed catalog. No DB. Tree builder does not assume two levels.

## Legacy audit

Read-only from `office952/workos-vscode`:

- `docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/README.md`
- `docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/01_TEMPLATE_SCOPE.md`
- `backend/seeds/seed_volumetric_owner_confirmed_prices.py`

Product-fixed: litere volumetrice luminoase; față plexiglas; volum aluminiu; spate Forex; iluminare față / LED interior.

Configurable kept: inscription; face finish/color; depth 30/60/80/100; cant finish/color; confirmed perimeter.

Rejected: Intake V6, CostEngine, QuoteOrchestrator, Mini-Module registry, product-specific React, LED catalog expansion, mounting/electrical.

`NO WHOLESALE CODE COPY`

## First product

- Display: Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm
- Code: `PRD-LETTERS-FRONTLIT-PLEXI-AL06`
- legacyReference: `TPL-VOLUMETRIC-LETTERS_v2`
- Family: `LIGHTED_VOLUMETRIC_SIGNS`
- Category: `FRONT_LIT_VOLUMETRIC_LETTERS`
- Halo and full-aluminium categories exist empty. No placeholder products.

## Old pilot

`letters` / family `LETTERS` / `/products/letters` / `/api/product-templates` removed. One active product path.

## API

- GET `/api/product-catalog`
- GET `/api/products/:productCode`
- POST `/api/products/:productCode/compile`
- POST `/api/products/:productCode/confirm`

Confirm / EIC spine unchanged: 12500 mm → 12.5 m → 312.50 EUR PARTIAL.

## UI

- `/products` catalog
- `/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06` configure
- Nav Produse → catalog
- Generic `CatalogTree`

## Rate audit

```text
10+15 = KEEP_TEMPORARILY
```

Legacy owner-confirmed purchase rows are depth-specific (`MAT-PROFIL-LATERAL-LITERE-60MM` = 3 EUR/ml) and forming `RETURN_PROFILE_MACHINE_FORMING` = 5 EUR/ml. Current catalog has one generic aluminium profile + one forming resource, not those identities. Not an exact match. No rate write in this build.

## Limitations

- One product only.
- FACE plexiglas thickness not selected (no confirmed option list transferred).
- BACK Forex treated as product-fixed from template dossier; thickness not configured.
- EIC still RETURN_CANT only.
- Empty halo / full-aluminium categories have no products.

## Roadmap

Product catalog hierarchy established. First canonical product established. Generic LETTERS pilot realigned. Configuration / technical / EIC spine preserved. Phases 2–8 remain PILOT_VALIDATED, not COMPLETE.
