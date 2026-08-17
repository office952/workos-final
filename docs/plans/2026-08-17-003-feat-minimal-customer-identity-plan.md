---
title: "feat: Add minimal customer identity"
date: 2026-08-17
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# feat: Add minimal customer identity

## Goal Capsule

Attach a reusable commercial Customer identity to the existing spine without building CRM.

```text
Customer catalog
  → selected before Quote freeze
  → frozen { customerId, displayName } on Quote Snapshot
  → copied through Acceptance / Order
  → projected into Quote PDF and Lucrări
```

Mutable Customer is the current reusable identity. Quote/Order own historical identity. PDF and Lucrări project only.

Authority: OWNER GO `WORKOS_FINAL_CUSTOMER_IDENTITY_MINIMAL_V1` on HEAD `bd67af0`.
This prompt is explicit GO. Scoping confirmation skipped.

## Product Contract

### Requirements

- R1. One minimal Customer entity: `customerId`, `displayName`, `ACTIVE`/`RETIRED`, timestamps.
- R2. `displayName` is the only mandatory business identity. No PERSON/COMPANY split.
- R3. No email, phone, address, CUI, VAT, or contacts.
- R4. New commercial Quotes require an ACTIVE Customer. Domain freeze without customer stays valid for legacy/golden hashes.
- R5. Quote freezes `{ customerId, displayName }`. `contentHash` includes that identity when present.
- R6. PDF reads frozen Quote customer. Regeneration after rename keeps the old name.
- R7. Acceptance does not store a Customer relation. Identity is transitive from Quote.
- R8. Order copies frozen Quote customer. It does not reread the live Customer store.
- R9. Lucrări shows frozen `displayName`. Order remains the job root.
- R10. Product Truth stays customer-independent. Pilot / technical production does not require Customer.
- R11. Historical Quotes without customer still load and produce PDF (no Client line).
- R12. LETTERS 382.50 / 624.82 and ACM 72.644 / 118.66 stay unchanged.
- R13. Admin catalog under Administrare, not top nav. Compact selector + Adaugă client on commercial config.
- R14. After freeze, customer on that Quote/Order is immutable.

### Scope Boundaries

In: Customer domain, SQLite table, minimal API, admin Clienți, quote selector, Quote/Order freeze copy, PDF Client line, Lucrări projection, LETTERS+ACM proofs, rename immutability, two-job distinction.

Out: CRM, leads, pipeline, contacts, billing, invoices, payments, email, customer portal, seller legal identity, Order PDF, ACM execution, Analyzer, scheduling, HR/Pontaj.

### Assumptions

- People is the CRUD/lifecycle pattern to follow (`per:` → `cus:`, ACTIVE/RETIRED, no hard delete).
- Schema version stays 1. Optional `customer` keeps legacy snapshot hashes stable.
- Customer lives under Administrare → Comercial → Clienți. It is a maintained catalog, not a top-nav workflow.
- Names are not unique. Identity is `customerId`.

## Planning Contract

### Key Technical Decisions

- KTD1. Domain Customer mirrors People. `updatedAt` changes on rename/retire. `retiredAt` records retirement.
- KTD2. `freezeQuoteSnapshot(..., { customer })` includes customer in hashed content only when provided. API POST requires `customerId` and freezes the current ACTIVE displayName.
- KTD3. `freezeOrderSnapshot` copies `quote.customer` when present. No live reread.
- KTD4. `projectQuoteDocument` adds optional `customerDisplayName` from `snapshot.customer`. Renderer draws `Client` only when present.
- KTD5. `JobOverviewItem.customerDisplayName` comes from `order.customer`. ExecutionPlan/Task stay clean.
- KTD6. Retired Customer remains readable. New Quotes cannot select it.

### Implementation Units

### U1. Customer domain

**Files:** `packages/domain/src/customers/identity.ts`, tests, domain exports.
**Tests:** create/rename/retire; trim/length; stable id; duplicate names allowed.

### U2. Quote / Order freeze

**Files:** `quoteSnapshot.ts`, `orderSnapshot.ts`, existing golden tests plus customer hash/immutability.
**Tests:** legacy freeze hash unchanged; customer changes hash; rename of live Customer does not change frozen snapshot; Order copies frozen identity.

### U3. PDF + Lucrări

**Files:** `quoteDocument.ts`, PDF renderer, `jobs/overview.ts`.
**Tests:** Client line from frozen name; omitted on legacy; Lucrări projects displayName.

### U4. Persistence + API + UI

**Files:** migration `014_customers.sql`, store/routes/runtime, admin page, quote selector, Lucrări row, e2e.
**Tests:** CRUD API; quote requires customer; historical persist without customer still PDFs; LETTERS/ACM e2e; two jobs; 390px.
