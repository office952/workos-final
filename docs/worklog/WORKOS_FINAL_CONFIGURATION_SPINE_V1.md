# WORKOS_FINAL_CONFIGURATION_SPINE_V1

TASK = First unified product vertical for LETTERS: template → form → definition → confirm → truth → aggregate

BASELINE = 4c6161f5b0a4bfa0406bb211a4eadceca84d7b53

FINAL HEAD = pending

## Research

Consulted read-only via GitHub `office952/workos-vscode` (no local clone, no writes):

- docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/README.md
- docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/01_TEMPLATE_SCOPE.md
- docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/03_FINISH_MODEL.md
- docs/qa/template-activation-v1/runtime/TPL-VOLUMETRIC-LETTERS_v2_activation.json

Kept conceptually: FACE / RETURN_CANT / BACK / LIGHTING composition; finish as configuration; fail-closed required fields; Romanian operator labels.

Rejected: Intake V6, pricing/EIC/AI defaults, Oracal/RAL catalogs, operation/task seeding, Quote adapters, family-specific frontend, publication theater, fake geometry.

`NO WHOLESALE CODE COPY`

## Architecture

```
ProductTemplate + FormSchema (domain)
→ Draft Configuration (operator)
→ POST compile → ProductDefinition
→ explicit confirm
→ ProductTruth CONFIRMED_IN_RUNTIME
→ ProductAggregate derived from truth
```

## LETTERS pilot

- Family LETTERS / Litere volumetrice
- Template `letters` v1
- Required: FACE, RETURN_CANT, BACK
- Optional: LIGHTING (unselected = silent)
- No pricing, catalogs, Analyzer, DB

## API

- GET /api/product-templates/:templateCode
- POST /api/product-templates/:templateCode/compile
- POST /api/product-templates/:templateCode/confirm

## UI

- /products/letters
- Nav: Stare sistem, Produse
- Generic FormRenderer
- Review then Confirmă configurația

## Tests

- lint / typecheck / unit / build / E2E PASS

## Known limitations

- Runtime confirmation only, not persisted
- Aggregate has no geometry, consumption, or price
- One product family only

## Forbidden scope

Resources, EIC, Commercial, Quote, Order, Execution, People, Reports, DB, auth, Analyzer, ACM, Logo = not built

## Next direction

Technical aggregate enrichment only when Analyzer/resources exist. Next vertical build is likely Resource Catalogs → EIC, not another isolated form slice.
