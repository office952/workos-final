# Commercial experience closure

Owner GO: `WORKOS_FINAL_V1_COMMERCIAL_EXPERIENCE_CLOSURE`.
Baseline: `f7887dd` on `main`.

## Intent

Keep the canonical commercial spine. Change presentation and add one seller identity owner.

```text
Product configuration → Product Truth → EIC → Commercial
→ Quote Snapshot (frozen customer + seller)
→ Quote PDF → Acceptance → Order → Release → Execution
```

## Decisions

1. Derived commercial stage only. No new mutable workflow state.
2. Seller is one mutable company profile. New Quotes freeze it. Old Quotes stay readable without it.
3. Owner-confirmed HUB MEDIA PRODUCTION values are the seed. Tests that need another name PATCH the live profile.
4. No logo unless a real owner asset exists. None found. Skip.
5. IBAN/bank are owner-confirmed seller facts, not invented payment terms.
6. Unrelated local listen-retry and screenshot noise stay out of the commit.

## Files

- Domain: `packages/domain/src/seller/`, `commercial/experience.ts`, quote/order/document
- API: migration `015_seller.sql`, seller store/routes, freeze seller into Quote
- UI: product-page phase hierarchy, admin Date firmă
- Docs: roadmap, canons, AGENTS.md, worklog
