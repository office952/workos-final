# ACM cost completeness and Quote readiness V1

Date: 2026-08-17
HEAD base: `f26f42d`
Mission: `WORKOS_FINAL_ACM_COST_COMPLETENESS_AND_QUOTE_READINESS_V1`

## Verdict

Canonical `PRD-ACM-CASSETTE-NONE` (1000 × 500 × 40 mm, ACM 3 mm, 2 folds, Cornier oțel, finish none) is EIC COMPLETE, Commercial COMPLETE, and Quote-ready on the existing generic spine.

## Golden quantities

| Fact | Value |
|---|---|
| Face | 1000 × 500 mm = 0.5 m² |
| Frame | 992 × 492 mm |
| Frame perimeter | 2.968 m |
| Developed blank | 1080 × 580 mm = 0.6264 m² |

Blank area remains DEVELOPMENT_DEFAULT geometry, not nesting.

## Cost evidence

| Line | Identity | Qty | Rate | Class | Cost |
|---|---|---|---|---|---|
| ACM sheet | `acm_3mm` | 0.6264 m² | 32 EUR/m² | AI_DECISION | 20.0448 |
| Steel frame | `steel_frame_profile` | 2.968 m | 3.50 EUR/m | AI_DECISION | 10.388 |
| CNC contour + V-groove | `SVC-CNC-SHEET-PANEL` | 0.6264 m² | 18 EUR/m² | AI_DECISION | 11.2752 |
| Manual cassette form | `LAB-FORM-SHEET-CASSETTE` | 1 buc | 8 EUR | AI_DECISION | 8 |
| Metal stock cut | `SVC-CUT-METAL-STOCK` | 2.968 m | 2 EUR/m | AI_DECISION | 5.936 |
| Attach frame | `LAB-ATTACH-INTERNAL-FRAME` | 1 buc | 12 EUR | AI_DECISION | 12 |
| Packing | `SVC-PACK-PRODUCT` | 0.5 m² | 10 EUR/m² | EXISTING_CANONICAL | 5 |

EIC total: **72.644 EUR COMPLETE**
Commercial: markup 35% → net **98.07**, VAT 21% → **20.59**, gross **118.66 EUR**

## AI decisions

All new ACM rates are `source: AI_DECISION` / `classification: AI_DECISION`.
They complete EIC because every required line has a rate.
They are not owner-confirmed.
Vinyl / RAL stay PARTIAL via `LEGACY_EVIDENCE`.
Owner adjusts them in the existing Resources / Cost catalog when workshop invoices exist.

## Process composition

`CUT_SHEET_CNC` → `FORM_SHEET_CASSETTE` → `CUT_METAL_STOCK` → `ATTACH_INTERNAL_FRAME` → `PACK_PRODUCT`

CNC 4020 covers contour and V-groove. Fold is manual. No bending machine.
Mounting COMPLETE is scoped to Cornier oțel only; no extra mounting SKU.
File preparation is not a separate EIC charge.

## Quote

Generic `freezeQuoteSnapshot` accepts ACM. No ACM Quote type.

## LETTERS

Unchanged: 382.50 EUR COMPLETE, 624.82 EUR gross.
