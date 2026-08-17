# Client Workspace canon

Canonical current law for the daily Client surface.
Runtime wins if this document disagrees.

## Permanent separation

```text
Customer                      current mutable profile
  → Client Workspace          read projection keyed by customerId
      ├── CommercialRequest   live office request
      ├── Quote Snapshot      frozen offer + frozen { customerId, displayName }
      ├── Quote Acceptance    decision on that quote
      └── Order / Lucrări     accepted commercial job
```

Customer owns the current profile.
Client Workspace owns no business truth.
CommercialRequest owns what the client asked.
Quote Snapshot owns the frozen offer and the historical client name.
Order owns the accepted job.

## What this is

The daily operator answer to: this client is in front of me — who are they now, what did they ask, what did we offer, what works exist, what next?

Surfaces:

- `/clients` — Clienți registry
- `/clients/:customerId` — Client Workspace

Technical domain remains Customer. UI may say Client. There is no `/api/clients`.

## Current profile V1

Required: `displayName`.
Optional: `cui`, `contactName`, `phone`, `email`, `address`, `city`, `notes`.
Lifecycle: `ACTIVE` / `RETIRED`.

One contact on the Customer row. No Contact entity.
No CRM, invoices, documents subsystem, or responsible employee.

Existing rows stay valid without backfill.

## Current vs frozen identity

Workspace URL and all relations use `customerId`.
Never `displayName`.

Rename or profile edit updates the current Customer and live Request projections.
It does not rewrite Quote Snapshot, Quote PDF, Order Snapshot, or `contentHash`.
Frozen Quote / Order keep `{ customerId, displayName }` from freeze time.

A Quote without a Request still appears.
A Request without a Quote still appears.

## Projection

Backend `CustomerWorkspaceProjection` groups existing Request / Quote / Job overviews by `customerId`.
Frontend does not join those domains with business rules.
Next actions are derived from existing overview attention. There is no ClientStatus or pipeline.
`openRequestCount` is the number of non-cancelled requests. `requestNeedsAction` is the number that still need office action. A request that already has a linked quote can stay open without needing action.

Opening the workspace is read-only: no compile, no reprice, no writes.

## Retired client

Workspace stays readable. History stays visible.
New CommercialRequest remains blocked.
The client is not silently reactivated.

## Surfaces

Daily work: Comercial → Clienți → workspace.
Admin `/admin/customers` stays lifecycle (add, rename, retire) and links to the workspace.
Profile edit lives in the workspace.

## What this is not

Not a ClientAggregate.
Not CRM.
Not Documents.
Not a second Request, Quote, or Job engine.
Not a Contact domain.
Not People / account manager.
