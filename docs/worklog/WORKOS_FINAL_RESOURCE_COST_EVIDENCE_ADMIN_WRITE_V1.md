# Resource Cost Evidence Admin Write V1

Status: PASS after closure fix. Architecture accepted on `73f3743`. Closure commit keeps that architecture and fixes UI identity, Save truth, last-changed display, and the SERVICE / freeze-chain proofs.

Owner decision: saving a new Admin rate makes that row OWNER_CONFIRMED for new calculations. Frozen Quote, Acceptance, Order, Release and actual cost do not change.

## What shipped

- SQLite table `resource_cost_evidence` (migration 022). No resources table.
- Partial unique indexes: one active unqualified row per resource; one active qualified row per resource + `volume_depth_mm`.
- One-time bootstrap `RESOURCE_COST_EVIDENCE_V1_APPLIED` copies the 26 seed rows. Restart does not restore superseded amounts. Vitest runtimes bootstrap too.
- Domain lookup seam `lookupCostEvidence(rows, resourceId, when?)`. Live compile/freeze/admin read database rows once. Seed catalog remains bootstrap + pure domain tests. No live fallback to seed amounts.
- PATCH `/api/resources-admin/cost-evidence/:evidenceRowId` body `{ amount, note }`. Append + supersede. Stale id → 409 `stale_cost_evidence`.
- Owner save maps MATERIAL → `OWNER_CONFIRMED_PURCHASE`, SERVICE/LABOR → `OWNER_CONFIRMED_WORKSHOP`.
- `/admin/resources` Dovezi de cost can edit amount and note. Identity, unit, currency and qualifier stay read-only.

## Closure fix

- Catalog UI identity is stable: `cost:${resourceId}:${qualifierIdentity}` (`unqualified` or `volumeDepthMm=60`). `evidenceRowId` is only the active version / PATCH / concurrency token.
- PATCH success consumes the returned Admin and updates the page immediately. A later refresh cannot turn a confirmed Save into “tariful nu a fost schimbat”. No second GET is required for success.
- Dovezi de cost shows **Ultima modificare** from `lastChangedAt` with `toLocaleString("ro-RO")`.
- API regression: owner edit `SVC-CNC-FACE` 3 → 4 appears identically in persisted evidence, new EIC, and `FrozenRecipeTrace`. Old Quote stays 3.
- API regression: Quote A frozen at 382.50, then plexi 16 → 18; Acceptance / Order / Release from Quote A keep 382.50 and plexi 16.

## Proofs

- Virgin bootstrap: LETTERS 60 mm none/none 382.50 COMPLETE; ACM none 72.644 COMPLETE.
- Plexiglas 16 → 18: new EIC/Quote 383.00; frozen Quote stays 382.50. Recipe traces match EIC rates on the same compile.
- Aluminium 60 mm edit does not give 30 mm a rate.
- Duplicate active rows rejected by unique indexes.
- Second PATCH with the old `evidenceRowId` returns 409.
- After Save, Dovezi de cost stays on Plexiglas and shows 18 EUR/m². Isolated QA on `8795` / `5177` with `WORKOS_DATA_DIR=%TEMP%\workos-cost-evidence-closure-qa`. Stale write still 409.

## Screenshots

1. Before edit: `docs/worklog/screenshots/resources-cost-evidence-before.png`
2. Edit state: `docs/worklog/screenshots/resources-cost-evidence-edit.png`
3. Saved rate: `docs/worklog/screenshots/resources-cost-evidence-saved.png`
4. Reload persistence: `docs/worklog/screenshots/resources-cost-evidence-reload.png`
5. 390 px write/read: `docs/worklog/screenshots/resources-cost-evidence-390.png`

Earlier inspect shots remain: `docs/worklog/screenshots/resources-cost-evidence-write.png`, `docs/worklog/screenshots/resources-cost-evidence-plexi-18.png`.

## Out of scope

Commercial policy, resource/recipe CRUD, Pricing engine, snapshot mutation, HR, purchasing, WorkOS Cloud / organization.
