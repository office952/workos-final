# Quote Snapshot canon

Canonical current law for the immutable commercial offer snapshot.
Runtime wins if this document disagrees.

## Permanent separation

```text
Confirmed Product Truth
  → planned EIC
  → Commercial Price projection     live, current policy

Quote Snapshot                      frozen commercial evidence
  → [later] customer acceptance
    → [later] Order Snapshot
```

Quote Snapshot answers: what technical and commercial truth did we offer?
Production Snapshot answers: what technical truth is accepted for execution?
They are distinct. Quote does not require production acceptance.

## What this is

An immutable historical copy of one offered configuration and price:

- confirmed product identity and configuration
- planned EIC used for the offer
- Commercial policy id/version and calculated amounts

## What this is not

Not customer acceptance.
Not an Order.
Not a PDF.
Not a Production Snapshot.
Not an ExecutionPlan.
Not a second Product Truth compiler.

## Completeness gate

Create only when planned EIC and Commercial Price are both COMPLETE.
PARTIAL configurations return `incomplete_offer`.

## Identity

`quoteSnapshotId = qts:{productCode}:{contentHash}`

Content hash is SHA-256 of the canonical frozen content.
It excludes `quoteSnapshotId`, `createdAt`, and `sourceConfirmedAt`.
Same confirmed offer → same snapshot. A retry returns the existing row.

## Read law

Read the stored payload.
Do not recompute from the current Commercial policy or current resource rates.

## Persistence

One `quote_snapshots` table. Indexed lookup fields plus JSON payload.
No update. No delete. A correction creates a new snapshot later.
