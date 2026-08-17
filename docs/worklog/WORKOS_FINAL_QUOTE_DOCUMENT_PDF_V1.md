# WorkOS Final — Quote Document PDF v1

Customer-facing **Ofertă** is a projection of the persisted Quote Snapshot.
It does not reprice, reread ProductTemplate, or invent Customer/CRM.

## Law

```text
Quote Snapshot → QuoteDocumentModel → PDF bytes
```

GET `/api/products/:productCode/quote-snapshots/:quoteSnapshotId/document`

## Golden proofs

| Product | Frozen gross | Document |
|---|---|---|
| LETTERS none/none 60 mm | 624.82 EUR | Ofertă, inscription, depth, finish |
| ACM cassette none 1000×500×40 | 118.66 EUR | Panou ACM casetat, folds, Cornier oțel |

Renderer has no `productCode` branch.
Internal EIC, AI_DECISION, rates, and snapshot hashes stay out of the PDF.

## Company / customer

Issuer is the accepted brand `WorkOS Final`.
No CUI, address, VAT number, or customer entity.
No invented validity or contract terms.

## Engine

`pdf-lib` + embedded Noto Sans for Romanian diacritics.
No PDF blob table. Same snapshot regenerates the same commercial content and date.
