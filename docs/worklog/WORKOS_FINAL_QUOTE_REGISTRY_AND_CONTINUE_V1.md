# Quote registry and continue V1

Read-only Oferte list over existing Quote Snapshots.

## Decision

Quote Snapshot remains the offer authority. No second quote table. No Draft/Sent status.
`/quotes` projects frozen quotes plus Acceptance / Order lineage.
`?quote=` continues the stored offer without recompiling.

```text
Creată        → Marchează acceptată  → /products/:code?quote=
Acceptată     → Creează comanda      → /products/:code?quote=
Cu comandă    → Deschide comanda     → /products/:code?order=
```

Lucrări stays Order-rooted. Oferte does not list jobs or execution.

## Evidence

`docs/worklog/screenshots/letters-quotes-*.png`
