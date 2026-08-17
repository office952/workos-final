# Quote Document canon

Canonical current law for the customer-facing offer PDF.
Runtime wins if this document disagrees.

## Permanent separation

```text
QUOTE SNAPSHOT          immutable commercial + technical freeze
  → QUOTE DOCUMENT      presentation only
    → PDF bytes         render of that presentation
```

Never inverse. The PDF does not own price, Product Truth, live Customer, or Order state.

## What this is

A Romanian **Ofertă** derived only from a persisted Quote Snapshot:

- offer reference and frozen date
- product name and inscription when present
- frozen Client display name when the Quote has one
- customer-safe configuration and measurements
- frozen net / VAT / gross

## What this is not

Not a pricing engine.
Not a second Quote model.
Not a mutable document authority.
Not a live Customer reread or CRM.
Not an Order PDF, production sheet, invoice, or proforma.

## Read law

Load the stored Quote Snapshot by id.
Project `QuoteDocumentModel`.
Render PDF bytes.

Do not reread ProductTemplate, live Product Truth, Resources, current rates, current Commercial policy, current EIC, settings, or recipes.
The client does not send authoritative prices or quantities.

## Identity

Customer-safe reference: `OF-` plus the first eight hex characters of the snapshot `contentHash`.
This is a display projection, not a second persistent identity.

Date is the UTC calendar date of frozen `createdAt`. Regeneration does not stamp the current time.

## Customer and company

Client comes from `quoteSnapshot.customer.displayName` when present.
Seller comes from `quoteSnapshot.seller` when present.
The document does not reread the live Customer catalog or the live seller profile.
Historical Quotes without customer omit the Client line.
Historical Quotes without seller keep issuer text `WorkOS Final` and omit the seller block.
Owner-confirmed current seller facts may appear only when they were frozen into that Quote.

## Validity and terms

No validity window unless a canonical policy exists.
No invented warranty, delivery, or payment terms.

## Persistence

No PDF blob table. The same snapshot regenerates the same commercial content.
