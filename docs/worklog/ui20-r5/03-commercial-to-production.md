# UI20-R5 — Commercial to production

Canonical lineage, compressed for the operator:

Confirmed Product Truth → Quote Snapshot → Acceptance → Order Snapshot (`jobId = orderSnapshotId`) → Production Release → ExecutionPlan.

No Job entity.

| Handoff | Stays | Appears | Surface |
| --- | --- | --- | --- |
| Cerere → Config | CER-1042, customer | construction bench | clarification → bench |
| Config → Ofertă | CER lineage | OFT-221 | bench → commercial artifact |
| Ofertă freeze | OFT-221, 624,82 EUR | frozen revision | mutable → immutable |
| Ofertă → Lucrare | OFT provenance | LUC-88 | artifact → traveler |

```text
QUOTE_FREEZE != ACCEPTANCE
ACCEPTANCE != ORDER
FREEZE does not create Lucrare
```

Freeze makes Quote Snapshot immutable. Acceptance is a separate immutable fact (`qad:{quoteSnapshotId}`). Order copies an already-accepted freeze. Lucrare is Order-rooted (`jobId = orderSnapshotId`).

The R5 synthetic fixture continues from frozen OFT-221 to LUC-88 only because those downstream prerequisite facts are already represented separately. Figma therefore shows quiet provenance on frozen 768 (`112:2`) and frozen 1440 (`96:400`), then `Deschide lucrarea`. It does not add `Acceptă oferta`. It does not fake an Order write. `DIRECT_FREEZE_TO_LUCRARE = NO`.
