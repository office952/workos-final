# WORKOS_FINAL_FIRST_CANONICAL_PRODUCT_TECHNICAL_COMPLETION_V1

TASK = Complete FACE / BACK technical quantity + EIC on the first canonical product; keep LIGHTING honest-unavailable

BASELINE = 0e16e8d8cdad4a51b49f99758c19c634032f4459

## Component matrix

| Component | Fixed | Configurable | Measurement | Quantity | Resource | EIC |
|---|---|---|---|---|---|---|
| FACE | Plexiglas 3 mm | finish / color | confirmed area mm² (operator) | m² | plexiglas 3 mm @ 16 EUR/m² | calculated (material only) |
| RETURN_CANT | Al 0,6 mm | depth / finish / color | confirmed perimeter mm | m | profile 10 + forming 15 EUR/m | calculated (pilot rates) |
| BACK | Forex 10 mm | none | same confirmed FACE area | m² | forex 10 mm @ 16 EUR/m² | calculated (material only) |
| LIGHTING | front-lit required | none | contour / LED layout missing | none | none | unavailable |

## Legacy sources

Read-only `office952/workos-vscode`:

- `docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/01_TEMPLATE_SCOPE.md`
- `docs/intake-v3/templates/TPL-VOLUMETRIC-LETTERS/README.md`
- `backend/seeds/seed_volumetric_owner_confirmed_prices.py`

Extracted: plexi 3 mm 16 EUR/mp; Forex 10 mm 16 EUR/mp; back area uses face area; lighting front-lit when lit; LED count needs contour/pitch layout.

Rejected: CostEngine, QuoteOrchestrator, Intake V6, waste folded into unit cost, invented LED counts, CNC hourly fallback.

`NO WHOLESALE CODE COPY`

## FACE

Operator enters confirmed area. Convert once: mm² / 1_000_000 → m². Test: 250000 mm² → 0.25 m² → 4.00 EUR.

CNC debitare not included: no clean owner-confirmed area/cut rate transferred without inventing hours.

## BACK

BACK FIXED. Quantity reuses FACE confirmed area (legacy back panel area = face area basis). 0.25 m² → 4.00 EUR. No second invented area field.

## LIGHTING

Required and front-lit. EIC blocked: LED module count and PSU sizing need contour geometry, not a fake pitch heuristic. UI explains this. No 0 EUR line.

## RETURN_CANT regression

12500 mm → 12.5 m → 125.00 + 187.50 EUR. Unchanged formula.

## Rate audit

```text
10+15 = KEEP_TEMPORARILY
```

3 EUR/ml is `MAT-PROFIL-LATERAL-LITERE-60MM` (depth-specific profile), not generic 0.6 mm sheet. 5 EUR/ml is `RETURN_PROFILE_MACHINE_FORMING`. Current resources are generic identities. Not an exact match.

FACE/BACK 16 EUR/m² = OWNER_CONFIRMED_PURCHASE from the same seed file.

## EIC

| Line | Qty | Rate | Cost |
|---|---|---|---|
| Profil aluminiu cant | 12.5 m | 10 EUR/m | 125.00 |
| Formare cant | 12.5 m | 15 EUR/m | 187.50 |
| Plexiglas față 3 mm | 0.25 m² | 16 EUR/m² | 4.00 |
| Forex spate 10 mm | 0.25 m² | 16 EUR/m² | 4.00 |
| **Total without lighting** | | | **320.50 EUR** |

Completeness: PARTIAL. Excluded: Iluminare. Also unavailable: Analyzer geometry, CNC debitare.

## UI screenshots

- `docs/worklog/screenshots/technical-completion-catalog.png`
- `docs/worklog/screenshots/technical-completion-configure.png`
- `docs/worklog/screenshots/technical-completion-review.png`
- `docs/worklog/screenshots/technical-completion-confirm.png`

## Roadmap

```text
FIRST CANONICAL PRODUCT = TECHNICAL_PARTIAL
PHASE 6 = PILOT_VALIDATED
PHASE 7 = PILOT_VALIDATED
PHASE 8 = PILOT_VALIDATED
```

## Limitations

- Lighting EIC blocked on real missing contour.
- CNC not priced.
- Vinyl/paint finish not in EIC.
- Waste not applied (legacy: do not fold into unit cost).
- RETURN_CANT rates still AI_DECISION.
- Al 0,6 mm remains product identity from Owner GO; legacy profiles are depth-tiered.
