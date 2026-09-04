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

Figma models the post-acceptance Lucrare open. It does not fake an Order write.
