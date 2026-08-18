# Product System persistence

Canonical current law for the first persisted Product System write path.
Runtime wins if this document disagrees.

## What is persisted

Display metadata only:

- entity kind
- stable ID
- display label
- revision

Kinds: `PRODUCT_FAMILY`, `PRODUCT_CATEGORY`, `PRODUCT_TEMPLATE`, `COMPONENT_TYPE`.

## What remains code

Roles, constructive type IDs, catalog relationships, composition, formulas, compiler, reviewId, technical settings, resource identity, and calculations stay typed contracts. Active cost-evidence amounts live in SQLite after bootstrap; see `docs/architecture/RESOURCES_AND_COST_CANON.md`.

## Runtime authority

Code labels are bootstrap defaults.

After initialization, persisted labels are the only active display authority.

Bootstrap inserts missing IDs. It does not overwrite owner edits.

## Storage

Local SQLite. One Product System table. Deterministic committed migrations.

Not a universal business database. Later domains may reuse the SQLite + migration pattern with their own tables.

## First write path

`PATCH /api/admin/product-system/entities/:kind/:id/display-label`

Only the display label changes. Stable IDs are not writable.

Technical settings and lifecycle remain outside this write path.

## Authorization

Write endpoints are owner/admin actions. Authorization enforcement is `NOT_IMPLEMENTED`.
