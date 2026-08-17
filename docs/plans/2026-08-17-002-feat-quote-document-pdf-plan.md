---
title: "feat: Add frozen quote PDF"
date: 2026-08-17
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# feat: Add frozen quote PDF

## Goal Capsule

First customer-facing commercial document: persisted Quote Snapshot → typed QuoteDocumentModel → PDF.
The PDF is a projection. It does not price, reread live truth, or become a second commercial authority.

Authority: OWNER GO `WORKOS_FINAL_QUOTE_DOCUMENT_PDF_V1` on HEAD `f4677fa`.
This prompt is explicit GO. Scoping confirmation skipped.

## Product Contract

### Requirements

- R1. Consume only the persisted immutable Quote Snapshot.
- R2. No live reread of ProductTemplate, Product Truth, Resources, rates, Commercial policy, EIC, settings, or recipes.
- R3. One document only: Romanian **Ofertă**. No Order/invoice/production sheet.
- R4. No Customer/CRM. Neutral document if client identity is absent.
- R5. No invented legal company data, validity window, or contractual terms.
- R6. Generic product summary from frozen identity / values / measurements. No `productCode` switch in the renderer.
- R7. Copy frozen commercial net / VAT / gross. Do not recompute 35% / 21%.
- R8. LETTERS golden gross 624.82 EUR. ACM golden gross 118.66 EUR.
- R9. Hide EIC, rates, AI_DECISION, recipe/resource IDs, hashes, schema versions, providers, operations.
- R10. Deterministic date from `createdAt`. Stable customer-safe offer reference.
- R11. GET document from snapshot id. Client does not send prices.
- R12. UI **Descarcă oferta PDF** only when a Quote Snapshot exists. Usable at 390px.

### Scope Boundaries

In: QuoteDocumentModel, pdf-lib renderer, GET document API, download CTA, LETTERS+ACM proofs, immutability test, docs/governance.

Out: Customer/CRM, Order PDF, production sheet, invoice, payment/legal terms, PDF blob table, illuminated ACM, Analyzer, nesting, new pricing engine.

### Assumptions

- No PDF library is installed. Add `pdf-lib` + `@pdf-lib/fontkit` and embed Noto Sans for Romanian diacritics. Font is a render asset, not a user download.
- Canonical issuer text is the accepted brand `WorkOS Final`. Legal CUI/address/VAT are missing — do not invent them.
- Offer reference = `OF-` + first 8 hex of `contentHash`, uppercase. Not a second persistent identity.
- Figma is not required for one restrained A4. Use existing WorkOS print-safe grammar.

## Planning Contract

### Key Technical Decisions

- KTD1. Domain: `QuoteSnapshot → projectQuoteDocument → QuoteDocumentModel`. PDF library stays in API.
- KTD2. Configuration lines come from frozen `truth.values` via field-suffix grammar (`finish`, `depthMm`, `mountingSystem`, …), not product-code branches. Measurements with labels become the technical summary. Skip a value when the same `fieldId` is already a labeled measurement.
- KTD3. Money display formats already-rounded frozen numbers (`624.82` → `624,82`). No `projectCommercialPrice` in document code.
- KTD4. Date uses the UTC calendar date of frozen `createdAt`. Regeneration does not stamp now.
- KTD5. `GET /api/products/:productCode/quote-snapshots/:quoteSnapshotId/document` loads the snapshot, projects, renders. 404 on mismatch. No POST, no PDF table.
- KTD6. Download is an `a.button-link` on every frozen Quote UI state (saved / accepted / ordered).

### Implementation Units

### U1. QuoteDocumentModel

**Goal:** Pure projection of customer-safe offer facts.
**Files:** `packages/domain/src/commercial/quoteDocument.ts`, `packages/domain/src/commercial/quoteDocument.test.ts`, commercial/domain exports.
**Test scenarios:** LETTERS 624.82 / inscription / depth / finish; ACM 118.66 / 1000×500×40 / folds / Cornier oțel; frozen values survive live policy change; model JSON has no EIC, AI_DECISION, markup, product-code, giant hash.

### U2. PDF renderer

**Goal:** A4 Ofertă from the model only. Romanian diacritics. Pagination. No product-code branch.
**Files:** `apps/api/src/quoteDocument/renderQuoteDocumentPdf.ts`, font asset, renderer tests.
**Test scenarios:** `%PDF` bytes; LETTERS/ACM visible lines; diacritics and long/special inscription; source has no `PRD-LETTERS` / `PRD-ACM`.

### U3. API + UI

**Goal:** Deterministic GET PDF and restrained download CTA.
**Files:** `apps/api/src/product.ts`, `apps/api/tests/product.test.ts`, `apps/web/src/productApi.ts`, `apps/web/src/ProductConfigurationViews.tsx`, view tests, `e2e/quote-document.spec.ts`.
**Test scenarios:** API PDF from persisted snapshot only; 404 unknown id; LETTERS+ACM e2e download; 390px CTA.

### U4. Docs / governance

**Goal:** Document the projection law. Update runtime-facing status only.
**Files:** `docs/architecture/QUOTE_DOCUMENT_CANON.md`, quote/commercial canons, AGENTS, roadmap, capabilities/governance, worklog.
