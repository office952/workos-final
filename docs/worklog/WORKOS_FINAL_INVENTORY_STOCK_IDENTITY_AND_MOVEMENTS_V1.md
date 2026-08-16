# Inventory stock identity and movements V1

Actual consumption can now become a stock movement.

## Contract

```text
Resource MATERIAL
  → stock item
    → append-only movements
      → derived balance
```

Complete + actual consumption of a stockable material writes exactly one OUT in the same SQLite transaction. Retries stay one movement (`UNIQUE(source_type, source_id)` + `INSERT OR IGNORE`).

Owner adjustment is a separate bounded command. It writes a movement, never a mutable balance.

Negative stock is honest (`Sold negativ`). Execution is not blocked by missing stock.

Services and labor create no inventory row even if they appear as actual consumption.

## Surfaces

- API: `GET /api/inventory`, `GET /api/inventory/:resourceId`, `POST /api/inventory/:resourceId/adjustments`
- UI: `Administrare → Atelier → Stoc` (`/admin/stock`)
- OUT is created only through task Complete, not by a frontend inventory call

## Outside this build

Reservations, purchasing, suppliers, warehouses, FIFO, valuation, Commercial, QC/Pack providers.

## Legacy

```text
LEGACY_STOCK_REGISTRY_IDEA = ADAPTED
LEGACY_MOVEMENT_IDEA = ADAPTED
LEGACY_INVENTORY_ENGINE = REJECTED
LEGACY_AUTO_PURCHASE = REJECTED
LEGACY_RESERVATIONS = REJECTED
DUPLICATE_RESOURCE_IDENTITY = NONE
```
