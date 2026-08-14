# WORKOS_FINAL_OWNER_SURFACES_INFORMATION_ARCHITECTURE_V1

TASK = Catalog the owner surfaces; keep domain projections unchanged

BASELINE = f71a8a2f8e19185fb25822c3634901c8345d2061

## Problem

Components and Governance were vertical card stacks. Correct data, weak taxonomy.
Owner verdict on the previous surfaces: `PASS_WITH_UI_INFORMATION_ARCHITECTURE_FOLLOW_UP`.

## Taxonomy

Components:

```text
MODULE ȘI COMPONENTE
Catalog
└── Componente de produs
    ├── Față → Plexiglas 3 mm
    ├── Volum → Aluminiu 0,6 mm
    ├── Spate → Forex 10 mm
    └── Iluminare → Iluminare frontală
```

Governance:

```text
GUVERNANȚA SISTEMULUI
Catalog
├── Autoritate și adevăr
│   ├── Cine deține adevărul
│   └── Surse de adevăr
├── Limite și protecții
│   ├── Limitele sistemelor
│   ├── Reguli de protecție
│   └── Owner gates
├── Stare și maturitate
│   ├── Roadmap
│   ├── Freeze
│   └── Capabilități
└── UI și proiecții
    ├── Reguli UI
    └── Terminologie
```

Only categories with real projection data are rendered. Future buckets (procese, resurse, formulare, cost intern) stay off-screen until they have a consumer.

## Presentation

`buildComponentCatalog` / `buildGovernanceCatalog` wrap existing domain records.
`OwnerCatalogView` is the shared catalog navigator: category → item → focused detail.
Old stack renderers and unused `.info-card` styles were removed.

Component details stay semantic: General, Calcul, Resurse / cost, Lipsă, Tehnic (disclosure).
Governance statuses stay chips. Freeze remains Planificat / Nu este activă.

If a group title repeats the selected item title, the extra heading/card chrome is omitted.

## Responsive

At `56rem` and below: header stacks brand above nav; catalog nav stacks above detail.
Primary nav stays a wrap row, not a hidden menu.

## Cleanup

- No leftover long-stack Components/Governance renderers
- Dead `.info-card` CSS removed
- Domain projections and APIs unchanged

## Screenshots

- `docs/worklog/screenshots/ia-components-initial.png`
- `docs/worklog/screenshots/ia-components-face.png`
- `docs/worklog/screenshots/ia-components-narrow.png`
- `docs/worklog/screenshots/ia-governance-initial.png`
- `docs/worklog/screenshots/ia-governance-authority.png`
- `docs/worklog/screenshots/ia-governance-limits.png`
- `docs/worklog/screenshots/ia-governance-maturity.png`
- `docs/worklog/screenshots/ia-governance-narrow.png`
- `docs/worklog/screenshots/ia-products.png`
- `docs/worklog/screenshots/ia-product-review.png`

## Tests

- `ownerCatalog.test.ts` — category placement, FACE/VOLUME/BACK/LIGHTING, derived products-using, Lighting unavailable, no RETURN_CANT, extra category accepted without rewrite
- `OwnerCatalogView.test.tsx` — category/item navigation; no stacked categories; no duplicate item/group heading
- `e2e/owner-surfaces.spec.ts` — catalog navigation on both pages, Lighting honesty, Freeze planned, product regression

## Limitations

- Presentation taxonomy lives in the web app, not in domain. It does not invent records.
- Governance remains a projection, not an enforcement engine.
- Empty future module categories are intentionally absent.
