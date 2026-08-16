# Order Snapshot canon

Canonical current law for the immutable commercial job snapshot.
Runtime wins if this document disagrees.

## Permanent lineage

```text
Confirmed Product Truth
  → planned EIC
  → Commercial Price projection
  → Quote Snapshot
  → Quote Acceptance Decision
  → Order Snapshot                 frozen commercial job root
    → [later] Production Release
      → ExecutionPlan
```

Order Snapshot answers: this exact accepted offer is now the canonical commercial job.
It does not answer: what operations will the shop run?

## What this is

An immutable historical copy of one accepted frozen Quote:

- source Quote identity and content hash
- source Acceptance identity and acceptedAt
- copied technical truth, planned quantities, planned EIC, and commercial totals

Order is the canonical root of the accepted commercial job.
After Order exists, future customer production must derive from this snapshot.

## What this is not

Not a draft cart.
Not a customer/CRM record.
Not a Production Release.
Not an ExecutionPlan.
Not an invoice or payment.
Not a second Product Truth / EIC / Commercial calculator.

## Source authority

Create only from persisted identities:

- Quote Snapshot exists, product matches, status `FROZEN`, EIC COMPLETE, Commercial COMPLETE
- Quote Acceptance Decision exists
- acceptance.quoteSnapshotId and acceptance.quoteContentHash match the persisted Quote

The client does not supply Product Truth, EIC, Commercial totals, markup, VAT, quote hash, or acceptedAt.
A frozen Quote without Acceptance is blocked. There is no implicit acceptance.

## Copy, do not calculate

`freezeOrderSnapshot(quote, acceptance)` copies accepted Quote content.
It must not call `compileDefinition`, `compileAggregate`, `compileEic`, `projectCommercialPrice`, or `composeProductProcesses`.

## Status

`FROZEN` only.
No NEW / CONFIRMED / IN_PRODUCTION / COMPLETED / CANCELLED in V1.

## Identity

`orderSnapshotId = ord:{acceptanceId}:{contentHash}`

Content hash is SHA-256 of the canonical frozen content.
It excludes `orderSnapshotId` and `createdAt`.
One Order per Acceptance. A retry returns the existing row and `created: false`.

## Read law

Read the stored payload.
Do not recompute from the current Commercial policy, current resource rates, or live Product Truth.

## Persistence

One `order_snapshots` table. Indexed lookup fields plus JSON payload.
No update. No delete. A later amendment would be a new snapshot.

## Production boundary

Order creation creates zero Production Snapshots, ExecutionPlans, tasks, inventory movements, or actual consumption.

The existing pilot path remains:

```text
Product Truth → Production Snapshot → Execution
```

That path is workshop/technical. It is not customer-job release from Order.
The future explicit action is **Eliberează pentru producție** from Order.

## Frozen-production-input gap

Order copies Quote commercial/technical offer truth.
Quote and Order do **not** freeze:

- operations
- requirements
- usedTechnicalSettings
- usedRecipes

Those belong to Production Release.
Current Order payload is **not** sufficient to create Production Release without a later additive frozen technical payload or a live ProductTemplate / process / EIC reread.
Live recompile after Order is forbidden.
If Production Release is next, first align the frozen production input. Do not solve the gap by rereading live catalogs.

## Operator UI

After **Ofertă acceptată**:

- Before Order: **Creează comanda**
- After Order: **Comandă creată** and “Comanda nu a fost încă eliberată pentru producție.”

**Ofertă acceptată** stays visible.
**Acceptă pentru producție** remains the separate pilot workshop action.
