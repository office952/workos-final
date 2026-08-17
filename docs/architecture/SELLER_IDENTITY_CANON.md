# Seller identity canon

Canonical current law for the company / vânzător profile used on commercial offers.
Runtime wins if this document disagrees.

## Permanent separation

```text
Seller profile                 current mutable company identity
  → selected automatically at Quote freeze
  → Quote Snapshot.seller      frozen seller facts
    → Order Snapshot copies that frozen identity
      → Quote PDF projects it
```

Seller owns today's company facts.
Quote Snapshot owns the historical issuer used by that offer.
PDF does not reread the live profile.

## What this is

One company profile sufficient to issue a customer-ready Ofertă.

Owner-confirmed current facts:

- legal name: HUB MEDIA PRODUCTION S.R.L.
- brand: HUB MEDIA PRODUCTION
- CIF: RO54481582
- trade register: J2026024600006
- address and București
- IBAN and RAIFFEISEN BANK

These are OWNER_CONFIRMED. They are not AI_DECISION, placeholders, or test defaults.

## What this is not

Not a Settings platform.
Not multi-company.
Not billing, invoices, or accounting.
Not Customer / CRM.
Not ProductTemplate truth.
Not invented phone, email, website, payment terms, or legal clauses.

## Freeze law

New commercial Quotes freeze the current seller profile.
`contentHash` includes that identity when present.
A later edit of Date firmă does not rewrite historical Quotes or PDFs.
Historical Quotes without seller remain readable.

## Persistence

One `seller_profile` row (`seller:current`).
Admin write: Administrare → Comercial → Date firmă (`/admin/seller`).

## Surfaces

Normal UI: **Vânzător** vs **Client**.
Do not label both as Firmă.
