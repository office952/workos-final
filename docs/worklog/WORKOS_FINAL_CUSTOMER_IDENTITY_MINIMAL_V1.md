# Customer identity minimal V1

Reusable commercial identity without CRM.

```text
Customer catalog
  → selected before Quote freeze
  → frozen { customerId, displayName } on Quote Snapshot
  → copied through Acceptance / Order
  → projected into Quote PDF and Lucrări
```

Mutable Customer owns the current name.
Quote/Order own historical identity.
PDF and Lucrări project only.

## Proof

- LETTERS none/none 60 mm stays 382.50 EIC / 624.82 gross with Client Demo LETTERS.
- ACM none 1000×500×40 stays 72.644 EIC / 118.66 gross with Client Demo ACM.
- Rename after freeze leaves the old PDF/Quote name unchanged.
- Lucrări distinguishes two similar jobs by frozen Client name.
- Pilot / technical production still does not require Customer.

## Screenshots

- `customers-catalog.png` / `customers-created.png`
- `letters-customer-selected.png` / `letters-quote-customer-frozen.png` / `letters-quote-customer.pdf`
- `acm-quote-customer-frozen.png` / `acm-quote-customer.pdf`
- `jobs-customer-letters.png` / `jobs-two-customers.png`
- `letters-quote-customer-after-rename.png`
- `letters-customer-narrow.png`

Canon: `docs/architecture/CUSTOMER_IDENTITY_CANON.md`.
