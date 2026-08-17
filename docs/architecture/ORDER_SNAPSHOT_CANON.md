# Order Snapshot canon

Canonical current law for the immutable commercial job snapshot.
Runtime wins if this document disagrees.

## Permanent lineage

```text
Confirmed Product Truth
  → planned EIC
  → Commercial Price projection
  → Quote Snapshot + FrozenProductionInput
  → Quote Acceptance Decision
  → Order Snapshot                 frozen commercial job root
    copies FrozenProductionInput
    → Production Release Snapshot  workshop authorization
      → ExecutionPlan
```

Order Snapshot answers: this exact accepted offer is now the canonical commercial job.
Frozen production input answers: what technical production evidence travels with that job.
Order does not become an ExecutionPlan.

## What this is

An immutable historical copy of one accepted frozen Quote:

- source Quote identity and content hash
- source Acceptance identity and acceptedAt
- copied technical truth, planned quantities, planned EIC, and commercial totals
- copied frozen customer identity when the Quote has one

Order is the canonical root of the accepted commercial job.
After Order exists, future customer production must derive from this snapshot.

## What this is not

Not a draft cart.
Not a live Customer record or CRM. It copies frozen Quote customer identity.
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
The explicit commercial action is **Eliberează pentru producție** from Order.
That creates one immutable Production Release Snapshot from Order + frozen production input.
It does not start tasks, assign people/machines, or auto-create an ExecutionPlan.
The next explicit action is **Creează planul de execuție**, which reuses the existing planner against the Release.

## Frozen production input

Quote freeze also freezes a generic `FrozenProductionInput`:

- operations
- requirements
- usedTechnicalSettings
- usedRecipes

Order copies that input. It does not recompile it.
This is technical evidence for a future Production Release. It is not a second Product Truth, EIC, Commercial, or Order.

Production Release consumes Order + this frozen input.
It must not reread live ProductTemplate, process catalog, settings, recipes, Resources, EIC, or Commercial.

## Operator UI

After **Ofertă acceptată**:

- Before Order: **Creează comanda**
- After Order: **Comandă creată** and **Eliberează pentru producție**
- After Release: **Eliberată pentru producție** and **Creează planul de execuție**
- After plan: **Plan de execuție creat**

**Ofertă acceptată** stays visible.
**Acceptă pentru producție** remains only the Atelier / test tehnic path when no commercial Order exists.
