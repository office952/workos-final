---
title: "feat: Complete ACM cassette internal cost"
date: 2026-08-17
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# feat: Complete ACM cassette internal cost

## Goal Capsule

Make the canonical `PRD-ACM-CASSETTE-NONE` path commercially usable through the existing EIC → Commercial → Quote spine.
No ACM CostEngine, no frontend pricing, no product-code forks, no documents/PDF, no lighting/vinyl/nesting expansion.

Authority: OWNER GO `WORKOS_FINAL_ACM_COST_COMPLETENESS_AND_QUOTE_READINESS_V1` on HEAD `f26f42d`.

Stop if LETTERS golden 382.50 / 624.82 moves, or if EIC/Commercial/Quote gain a `productCode` branch.

## Product Contract

### Summary

Close exactly one ACM cassette configuration (1000 × 500 × 40 mm, ACM 3 mm, 2 folds, Cornier oțel, finish none) to EIC COMPLETE, Commercial COMPLETE, and generic Quote freeze.
AI development rates are allowed when marked, configurable, and not presented as owner-confirmed.

### Requirements

- R1. Every required ACM material/process line has explicit cost evidence. No hidden zeros.
- R2. Reuse existing Resource / Process / Recipe / EIC / Commercial / Quote authorities. Search before adding.
- R3. Classify each new rate as OWNER_CONFIRMED, EXISTING_CANONICAL, or AI_DECISION / DEVELOPMENT_DEFAULT.
- R4. Do not reuse LETTERS contour CNC rates for ACM sheet work.
- R5. Folding/forming must not stay silently free. Smallest generic process if needed.
- R6. Packing reuses 10 EUR/m² on face area.
- R7. Mounting COMPLETE is scoped to Cornier oțel only; no invented mounting SKU.
- R8. Generic `freezeQuoteSnapshot` must accept ACM once EIC is COMPLETE.
- R9. LETTERS none/none stays 382.50 EUR COMPLETE and 624.82 EUR gross. Vinyl/RAL stay PARTIAL.
- R10. No product-code conditions in EIC, Commercial, or Quote.

### Scope Boundaries

In: ACM 3 mm rate, steel frame rate, ACM CNC cost basis, cassette forming, metal cutting, frame attach, packing reuse, Quote proof, admin visibility, tests/e2e/docs.

Out: illuminated ACM, vinyl, Analyzer, nesting, multi-panel, PDF/CRM, new pricing/commercial/execution engines, Pontaj, provider invention, Acceptance/Order/Release/Execution UI unless already generic.

### Assumptions

- `AI_DECISION` evidence may complete EIC. `DEVELOPMENT_DEFAULT` + `LEGACY_EVIDENCE` continues to keep vinyl/RAL PARTIAL.
- CNC 4020 performs ACM contour and V-groove. Cassette fold after CNC is manual. No bending machine.
- File preparation is not a separate EIC charge.
- foldCount does not change V1 cost quantity.

## Planning Contract

### Key Technical Decisions

- KTD1. Add cost-evidence source `AI_DECISION`. `costEvidenceKeepsEicPartial` treats `AI_DECISION` classification as complete-capable unless source is `LEGACY_EVIDENCE` or `PILOT_INTERNAL_EVIDENCE`.
- KTD2. Keep `acm_3mm` and `steel_frame_profile` identities. Add rates only.
- KTD3. Do not reuse `SVC-CNC-FACE` / `SVC-CNC-BACK`. Add reusable panel CNC service priced on `cassette_blank_area`.
- KTD4. Add optional `applicableTypeIds` on recipes so FACE CNC can be letter-perimeter or panel-blank without a product-code fork.
- KTD5. Add generic `FORM_SHEET_CASSETTE` (manual fold, `MANUAL_ASSEMBLY`) after CNC. Per-product labor. foldCount calibration is later.
- KTD6. Add reusable metal-cut and attach-frame recipes. Packing stays `RCP_PACK_PRODUCT` on `face_area`.
- KTD7. Mounting adds no extra line. COMPLETE is Cornier oțel only.

### Locked V1 rates

| Line | Identity | Qty golden | Rate | Class |
|---|---|---|---|---|
| ACM sheet | `acm_3mm` | 0.6264 m² | 32 EUR/m² | AI_DECISION |
| Steel frame | `steel_frame_profile` | 2.968 m | 3.50 EUR/m | AI_DECISION |
| CNC contour + V-groove | `SVC-CNC-SHEET-PANEL` | 0.6264 m² | 18 EUR/m² | AI_DECISION |
| Manual cassette form | `LAB-FORM-SHEET-CASSETTE` | 1 buc | 8 EUR | AI_DECISION |
| Metal stock cut | `SVC-CUT-METAL-STOCK` | 2.968 m | 2 EUR/m | AI_DECISION |
| Attach frame | `LAB-ATTACH-INTERNAL-FRAME` | 1 buc | 12 EUR | AI_DECISION |
| Packing | `SVC-PACK-PRODUCT` | 0.5 m² | 10 EUR/m² | EXISTING_CANONICAL |

Expected EIC total 72.644 EUR. Commercial: markup 35% → net 98.07, VAT 21% → 20.59, gross 118.66 EUR.

## Implementation Units

### U1. Cost evidence and EIC completeness rule

**Goal:** ACM materials and new process resources have catalog rates; AI decisions can complete EIC without flipping vinyl/RAL.
**Files:** `packages/domain/src/resources/catalog.ts`, `packages/domain/src/resources/eic.ts`, matching tests.
**Approach:** Extend source union, labels, evidence rows, and `costEvidenceKeepsEicPartial`.
**Test scenarios:** ACM materials resolve; vinyl still PARTIAL via `EIC_CALIBRATION_REASON`; LETTERS 382.50 unchanged.

### U2. Type-aware recipes and ACM process composition

**Goal:** Required ACM operations produce EIC lines from reusable recipes.
**Files:** `packages/domain/src/resources/recipes.ts`, `packages/domain/src/processes/catalog.ts`, `packages/domain/src/processes/requirements.ts`, `packages/domain/src/processes/composition.ts`.
**Approach:** New quantity bases `CASSETTE_BLANK_AREA_M2` and `FRAME_PERIMETER_M`. Recipe `applicableTypeIds`. New process `FORM_SHEET_CASSETTE`. Attach depends on CNC, form, and metal cut.
**Test scenarios:** Golden ACM EIC COMPLETE with exact lines; no `PRD-ACM` in eic/compiler; LETTERS recipes unchanged.

### U3. Quote, UI proof, docs

**Goal:** Generic Quote freeze works; operator sees COMPLETE; admin shows rates; canon/worklog updated.
**Files:** `packages/domain/src/product/acmCassetteNone.test.ts`, `e2e/acm-cassette.spec.ts`, active canon, roadmap, worklog.
**Approach:** Assert `freezeQuoteSnapshot` on ACM. Update e2e from PARTIAL to COMPLETE + freeze. No new page.
**Test scenarios:** Quote ok; frozen production input present; 390px screenshot; LETTERS e2e still 624.82.

## Verification Contract

- Domain tests: golden ACM lines, COMPLETE, Quote, LETTERS 382.50, no product-code branch.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e`, `git diff --check`.
- Browser: `/products` → Panou ACM casetat → golden fixture → Confirm → EIC COMPLETE → customer price → Îngheață oferta.

## Definition of Done

Canonical ACM none path is EIC COMPLETE and Quote-ready on the existing spine.
Every required line has classified evidence.
LETTERS unchanged.
One scoped commit pushed to `origin/main`.
