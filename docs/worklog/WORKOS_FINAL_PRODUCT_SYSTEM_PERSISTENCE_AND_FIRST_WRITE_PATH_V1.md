# WORKOS_FINAL_PRODUCT_SYSTEM_PERSISTENCE_AND_FIRST_WRITE_PATH_V1

## Baseline

`86a1f14cc4164093bed4b524e2ba86fb005585ee`

## Problem

The Product System model was aligned, but labels still lived only in code. There was no real owner write path and no Administrare.

## Storage decision

SQLite via `better-sqlite3`.

Why: deterministic migrations, file restart, isolated `:memory:` tests, no cloud, later settings versioning can reuse the same infrastructure. A JSON overlay with code fallback would have created two active truths. An ORM would have been disproportionate.

## Persisted scope

`product_system_display_metadata`: kind, stable ID, display label, revision.

## Canonical authority

After bootstrap, persisted labels are runtime authority. Code values are seed defaults only.

## Bootstrap

`INSERT OR IGNORE` from typed registries. Restart does not overwrite edits.

## Write API

`PATCH /api/admin/product-system/entities/:entityKind/:entityId/display-label`

Optimistic revision check. Authorization enforcement is not implemented.

## Admin UI

`/admin` → Sistem produs. `/components` remains inspection. One Administrare nav item.

## Restart proof

File DB: rename → close → reopen → label remains. E2E: save → reload → SQLite row still has the renamed value.

## Downstream

`/products`, `/components`, `/admin`, compile/confirm use the same presentation service.

## Snapshot note

ProductTruth does not freeze labels. Aggregate copies live labels at confirm time. Future Quote/Order snapshots will need historical display preservation.

## Cleanup

No code-label fallback in API projections. No fake CRUD. Runtime DB files are gitignored.

## Remaining gaps

No settings write. No lifecycle write. No auth. Resource ID `plexiglas_face_3mm` remains coarse.

## Next write recommendation

Re-evaluated: display-label is done. Highest-value next V1 write is still not automatically LED pitch. Prefer a versioned technical-setting write only when the owner wants that risk, or Resources foundation if the next need is material identity. Lifecycle retire is lower value until more entities exist.
