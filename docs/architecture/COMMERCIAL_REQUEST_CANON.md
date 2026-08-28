# Commercial Request canon

Canonical current law for the incoming commercial request.
Runtime wins if this document disagrees.

Operator name: **Cerere de ofertă**.
Technical name: **CommercialRequest**.
Do not call this Intake.

## Permanent separation

```text
CommercialRequest     what the client asked for     mutable office truth
Product Truth         what we decided to make       technical authority
Quote Snapshot        what we offered               immutable commercial freeze
Order Snapshot        what was accepted as a job    immutable accepted commercial truth
```

These stay separate. Request is not a Product System, not a Quote engine, not a CRM lead, and not a Job root.

## What this owns

Mutable office facts about an incoming request:

- `requestId` `crq:{uuid}`
- operator reference `CER-{8 hex from uuid}` derived from `requestId`
- `customerId` of the existing Customer
- title, description
- office status
- createdAt / updatedAt
- optional associated commercial scopes (`optionalScopeIds`, default empty)
- optional client-file attachments (`CommercialRequestAttachment`) — evidence received with the request

`SITE_INSTALLATION` is an associated office selection, not Product Truth and not a Quote line in Phase 1. See `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md`.

A Request may point into a Product workspace and may later relate to one or more Quote Snapshots.

## Client-file attachments (Documents V1)

Bounded concept: **CommercialRequestAttachment**.

- Identity: `attachmentId` = `att:{uuid}`
- Metadata in SQLite (`commercial_request_attachments`)
- Bytes under `WORKOS_DATA_DIR/documents/requests/...` with opaque storage keys
- Upload / list / download only; no delete, versioning, preview, or analysis
- CANCELLED Request: existing files remain readable; new uploads blocked
- Client / Quote / Order reach files only through the existing Request relationship
- Attaching a file must not mutate Quote `contentHash`, Product Truth, or Order

Backup requires both the SQLite database and the documents directory.

Uploaded files are opaque untrusted content. WorkOS Final does not parse SVG/DWG/AI/CDR here.

## What this does not own

ProductDefinition, ProductAggregate, EIC, pricing, production input, operations, task graph, component configuration, geometry, materials, ExecutionPlan, Quote status, Acceptance, Order, Lucrări.

No `productCode` on the Request. Product is chosen later from the live catalog.

## Status

Office work only:

```text
NEW               Nouă
IN_REVIEW         În lucru
WAITING_CUSTOMER  Așteaptă clientul
READY_FOR_QUOTE   Gata de ofertă
BLOCKED           Blocat
CANCELLED         Anulată
```

Active states may be corrected. CANCELLED is terminal.

Do not store `QUOTE_CREATED`, `ACCEPTED`, or `ORDERED` on the Request.
Those stages are derived from existing Quote / Acceptance / Order projection:

```text
Ofertă creată
Ofertă acceptată
Comandă creată
```

## Customer

Request references Customer by stable `customerId`. Never by displayName.
Create requires an ACTIVE Customer. Historical Requests stay visible if the Customer is later RETIRED.
The live display name is a projection. Request is not a frozen commercial document.
Customer may be corrected only before the first linked Quote.
Quote continues to freeze Customer separately.

## Request ↔ Quote

A separate persisted link (`commercial_request_quote_links`):

- stable `requestId`
- stable `quoteSnapshotId`
- one Quote links to at most one Request
- one Request may link many Quotes
- idempotent same pair
- Quote Snapshot payload and `contentHash` stay unchanged

Sequence:

```text
Product configuration
→ existing Quote freeze
→ Quote Snapshot persisted
→ Request/Quote link persisted
```

Optional `requestId` on the existing freeze route is context only.
It is not part of Quote content hash.
If the link fails after the Quote exists, the Quote is not deleted.

Quote may exist without a Request. Request may exist without a Quote.
No Request is auto-created.

## Product context

```text
Cerere → Alege produs → /products/:productCode?request=:requestId
```

The existing Product configuration surface runs unchanged.
Request context shows `CER-...` and the current Client name, and locks Customer to `request.customerId`.
Description is not parsed. No auto-selected components. No auto-created Product Truth.

## UI

```text
/requests              Cereri de ofertă
/requests/:requestId   Cerere detail
```

Registry title always opens the Request. The next-action control may open the furthest linked Quote.

Primary nav: Lucrări · Comercial · Produse · Administrare.
Inside Comercial: Cereri · Oferte · Clienți.
Bookmarked `/requests` stays valid.

`commercial_requests.reference` is unique. Existing `CER-XXXXXXXX` values are preserved.
Client Workspace projects requests by `customerId`. It does not own Request truth.

## Persistence

Additive tables `commercial_requests`, `commercial_request_quote_links`, `commercial_request_attachments`, and `commercial_request_optional_scopes`.
Normalized mutable columns. Attachment bytes are filesystem objects under the WorkOS data root, not SQLite BLOBs. No seed. No legacy import.

See `docs/architecture/QUOTE_SNAPSHOT_CANON.md` and `docs/architecture/CUSTOMER_IDENTITY_CANON.md`.
