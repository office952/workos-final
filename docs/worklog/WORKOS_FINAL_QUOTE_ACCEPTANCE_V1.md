# Quote Acceptance V1

Immutable commercial decision on an existing frozen Quote Snapshot. Not Order. Not production.

## Decision

Quote stays `FROZEN`. Acceptance is a separate record:

```text
qad:{quoteSnapshotId}
quoteSnapshotId
quoteContentHash
acceptedAt
```

One acceptance per quote. Retry returns the existing row.

## Gate

Reads the persisted snapshot only. No recompile. No reprice. No actor/customer field.

## UI

After **Ofertă salvată**:

- **Acceptă oferta**
- After: **Ofertă acceptată** · 624,82 EUR · nu este comandă

**Acceptă pentru producție** remains a separate pilot action.

## Next

Order Snapshot now copies frozen Quote + this acceptance.
Production Release from Order remains later.
