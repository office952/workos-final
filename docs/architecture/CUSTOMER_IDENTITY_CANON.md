# Customer identity canon

Canonical current law for minimal reusable commercial identity.
Runtime wins if this document disagrees.

## Permanent separation

```text
Customer catalog              current reusable identity
  → selected before Quote freeze
  → Quote Snapshot.customer   frozen { customerId, displayName }
    → Order Snapshot copies that frozen identity
      → Quote PDF / Lucrări project it
```

Customer owns the current name.
Quote Snapshot owns the historical name used by that offer.
Order owns the accepted commercial job, including the copied identity.
PDF and Lucrări project only.

## What this is

A reusable commercial identity sufficient to answer: whose offer / job is this?

V1 fields:

- `customerId`
- `displayName`
- `ACTIVE` / `RETIRED`
- `createdAt` / `updatedAt` / `retiredAt`

`displayName` may be a firm, a person, or a project label. V1 does not distinguish PERSON / COMPANY.

## What this is not

Not CRM.
Not leads, pipeline, contacts, notes, tags, or segmentation.
Not billing, CUI/VAT, invoices, payments, or a customer portal.
Not Product Truth.
Not seller / legal company identity.

## Freeze law

New commercial Quotes require an ACTIVE Customer.
The API freezes `{ customerId, displayName }` from the current catalog at freeze time.
`contentHash` includes that identity when present.

After freeze, that Quote's customer identity is immutable.
A later rename of the live Customer does not rewrite historical Quotes, PDFs, or Orders.
Changing the buyer means a new Quote.

## Historical compatibility

Persisted Quotes without `customer` remain valid.
Their PDF omits the Client line.
Domain freeze without customer stays allowed so golden hashes and pilot fixtures do not rewrite.

## Acceptance and Order

Acceptance is a decision bound to the Quote. It does not store a Customer relation.
Order copies `quote.customer` when present. It does not reread the live catalog.

## Pilot / Product Truth

Technical confirmation and Atelier / test production do not require Customer.
Customer is commercial context, not a product field.

## Persistence

One `customers` table. No competing JSON catalog.
No hard delete. A referenced Customer stays historically identifiable if retired.
Names are not unique. Identity is `customerId`.

## Surfaces

Admin catalog: Administrare → Comercial → Clienți (`/admin/customers`).
Commercial selection: compact Client selector + Adaugă client before Quote freeze.
Lucrări shows frozen `displayName`. Order remains the job root.
ExecutionPlan / ExecutionTask do not duplicate Customer truth.
