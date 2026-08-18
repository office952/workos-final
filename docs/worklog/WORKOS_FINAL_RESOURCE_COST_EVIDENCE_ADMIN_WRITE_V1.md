# Resource Cost Evidence Admin Write V1

Status: PASS. Isolated runtime on 8793/5175: virgin LETTERS 382.50 COMPLETE, plexi 16→18 becomes 383 for new confirm, frozen Quote stays 382.50. Screenshots: `docs/worklog/screenshots/resources-cost-evidence-write.png`, `docs/worklog/screenshots/resources-cost-evidence-plexi-18.png`.

Owner decision: saving a new Admin rate makes that row OWNER_CONFIRMED for new calculations. Frozen Quote, Acceptance, Order, Release and actual cost do not change.

## What shipped

- SQLite table `resource_cost_evidence` (migration 022). No resources table.
- Partial unique indexes: one active unqualified row per resource; one active qualified row per resource + `volume_depth_mm`.
- One-time bootstrap `RESOURCE_COST_EVIDENCE_V1_APPLIED` copies the 26 seed rows. Restart does not restore superseded amounts. Vitest runtimes bootstrap too.
- Domain lookup seam `lookupCostEvidence(rows, resourceId, when?)`. Live compile/freeze/admin read database rows once. Seed catalog remains bootstrap + pure domain tests. No live fallback to seed amounts.
- PATCH `/api/resources-admin/cost-evidence/:evidenceRowId` body `{ amount, note }`. Append + supersede. Stale id → 409 `stale_cost_evidence`.
- Owner save maps MATERIAL → `OWNER_CONFIRMED_PURCHASE`, SERVICE/LABOR → `OWNER_CONFIRMED_WORKSHOP`.
- `/admin/resources` Dovezi de cost can edit amount and note. Identity, unit, currency and qualifier stay read-only.

## Proofs

- Virgin bootstrap: LETTERS 60 mm none/none 382.50 COMPLETE; ACM none 72.644 COMPLETE.
- Plexiglas 16 → 18: new EIC/Quote 383.00; frozen Quote stays 382.50. Recipe traces match EIC rates on the same compile.
- Aluminium 60 mm edit does not give 30 mm a rate.
- Duplicate active rows rejected by unique indexes.
- Second PATCH with the old `evidenceRowId` returns 409.

## Out of scope

Commercial policy, resource/recipe CRUD, Pricing engine, snapshot mutation, HR, purchasing.
