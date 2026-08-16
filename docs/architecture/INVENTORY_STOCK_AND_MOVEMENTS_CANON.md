# Inventory stock and movements canon

Canonical current law for stock identity, movements, and derived balance.
Runtime wins if this document disagrees.

## Ownership

```text
Resources     owns resource / material identity and unit
Execution     owns actual consumption
Inventory     owns movements and derived balance
EIC           owns planned internal cost
```

Inventory does not feed backward into Product Truth, Aggregate, planned quantities, EIC, or Commercial.

## Stockability

A resource is a stock item only when `kind === MATERIAL`.

Services and labor are not stock. There is no second material catalog.

## Movement

Append-only ledger. Current balance is `SUM(quantity_delta)`.

V1 types:

- `OUT` — from immutable actual consumption of a stockable material
- `ADJUSTMENT` — explicit owner initial / manual quantity

One actual consumption entry creates at most one OUT. Source identity is the consumption entry ID.

Zero actual quantity and non-material consumption create no movement.

## Policy

Negative balances are allowed and shown as `Sold negativ`. Inventory does not block Start or Complete.

No reservations, warehouses, purchasing, FIFO, or valuation.

## Admin

`Administrare → Atelier → Stoc` (`/admin/stock`).
