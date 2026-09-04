# WorkOS V1 — LETTERS return depth coverage V1

```text
PROGRAM = LETTERS_RETURN_DEPTH_COVERAGE_V1
BRANCH = feat/product-batch-1-reuse-first-v1
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
TARGET_PRODUCT = PRD-LETTERS-FRONTLIT-PLEXI-AL06
PRODUCT_TEMPLATE_NEW = NO
COMPONENT_TYPE_NEW = NO
WEB_WRITE = NO
API_WRITE = NO
DATABASE_SCHEMA_WRITE = NO
FIGMA_WRITE = NO
REAL_CLOUD_WRITE = NO
REAL_QUOTE_CREATE = NO
OWNER_ACCEPTED_RUNTIME = NO
MERGE_MAIN = NO
```

Owner GO: keep Product Batch 1 discovery as `PARTIAL_NO_INVENTION`, then continue product utility on the existing front-lit LETTERS product. Halo-lit and full-aluminium stay deferred. No new ProductTemplate.

## Model

One resource identity: `aluminium_return_profile`.

Cost evidence stays in Resources / Cost, qualified by `volume.depthMm`. Forming stays one unqualified workshop rate.

| Depth | Profile rate | Source |
|---|---|---|
| 30 mm | 2 EUR/m | OWNER_CONFIRMED_PURCHASE |
| 60 mm | 3 EUR/m | OWNER_CONFIRMED_PURCHASE |
| 80 mm | 4 EUR/m | OWNER_CONFIRMED_PURCHASE |
| 100 mm | 5 EUR/m | OWNER_CONFIRMED_PURCHASE |

Forming: 5 EUR/m for every currently supported depth.

Unqualified aluminium lookup still does not inherit a qualified rate. An organization that keeps only the 60 mm row still leaves 30 / 80 / 100 PARTIAL.

## Canonical none/none fixture

```text
inscription WORKOS
face.finish = none
volume.finish = none
face.confirmedAreaMm2 = 250000
volume.confirmedPerimeterMm = 12500
```

Profile line = rate × 12.5 m. Other confirmed lines stay 345.00 EUR. Forming stays 62.50 EUR.

| Depth | Profile | EIC | Commercial gross |
|---|---|---|---|
| 30 mm | 25.00 | 370.00 COMPLETE | 604.40 |
| 60 mm | 37.50 | 382.50 COMPLETE | 624.82 |
| 80 mm | 50.00 | 395.00 COMPLETE | 645.23 |
| 100 mm | 62.50 | 407.50 COMPLETE | 665.66 |

60 mm golden arithmetic and the existing 60 mm quote content-hash pin stay unchanged.

## Qualified admin path

```text
QUALIFIED_COST_EVIDENCE_ADMIN_PATH = IMPLEMENTED_LOCAL_IN_REVIEW
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES
```

An already-bootstrapped organization that has only the 60 mm aluminium row does not receive 30 / 80 / 100 by restart or marker reset. The Owner creates those qualified rows from Resurse și costuri, using the generic `when.volumeDepthMm` write on the existing cost-evidence API. Supersede keeps the active qualifier. Members cannot write.

## Outside this wave

Vinyl / RAL stay PARTIAL. No new geometry, Analyzer, ProductTemplate, constructive type, frontend productCode branch, commercial formula, or live Quote.

Discovery record remains `docs/worklog/WORKOS_V1_PRODUCT_BATCH_1_PARTIAL_NO_INVENTION.md`.
