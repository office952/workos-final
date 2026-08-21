---
title: "MACHINE_STRICT_MANUAL_WORK_AREAS_FLEXIBLE_OWNER_DECISION_V1"
type: feat
date: 2026-08-21
origin: OWNER DECISION HUB MEDIA — dedicated machine strict, common assembly tables flexible
baseline: e33757b46ae136b5a5d27d159f29c1e65bdd1ec0
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: owner-go
execution: code
owner_go_required: true
implementation_executed: true
---

# Machine-strict, flexible manual work areas

## Goal Capsule

Make this workshop statement true for LETTERS none/none 60 mm: **only the CNC router and the letter-cant former block Start when unassigned; the nine manual operations start with an eligible operator and completed dependencies, without assigning Masa 1 / Masa 2 / postul LED.**

Authority hierarchy:
1. This owner decision (`UTILAJ DEDICAT = STRICT`, `MASA SAU ZONA MANUALA = FLEXIBILA`, `OPERATOR SKILL = STRICT`, `TASK DEPENDENCIES = STRICT`)
2. Existing operation contract `providerRequirement` on `OperationalProcess` (`packages/domain/src/processes/catalog.ts`)
3. Start guards in `packages/domain/src/execution/lifecycle.ts` / `plan.ts` (`taskRequiresProvider`)
4. Frozen production input copies `processProviderRequirement` at snapshot time (`packages/domain/src/production/snapshot.ts`)

Stop conditions:
- Machine Admin, scheduling, capacity, or per-table organization configuration → STOP
- Changing ProductDefinition, EIC, pricing, Quote/Order/Release, inventory, PIN, or Cloud provisioning → STOP
- Inferring provider requirement from capability `kind` (`MACHINE` / `WORKSTATION` / `HUMAN_SKILL`) as a second authority → STOP
- Inventing new field names when `providerRequirement` already expresses the rule → STOP
- Implementing without explicit Owner GO → STOP

```text
IMPLEMENTATION_EXECUTED = YES
OWNER_GO = MACHINE_STRICT_MANUAL_WORK_AREAS_FLEXIBLE_FINAL_QA_AND_COMMIT_V1
```

## Product Contract

### Problem frame

The previous pilot report classified **9/12** LETTERS operations as provider-strict. That was runtime-accurate, not an owner decision. The owner has now confirmed that HUB MEDIA executes all volumetric-letter manual work at **shared assembly tables**. There are no mandatory physical posts for bonding, LED, wiring, PSU, ignition, close, uniformity, QC, or pack.

Today the domain already has a per-operation provider gate. Only three processes set `providerRequirement: "NOT_REQUIRED"` (uniformity, inspect, pack). Six other manual LETTERS processes inherit the fail-closed default `REQUIRED` because the field is omitted. Capability classes and workcenter catalog entries then supply eligible tables/posts, so Start demands `assignedProvider`.

### Actors

- Owner: confirms machine-bound vs manual reality; does not pick internal IDs
- Operator: Claim-on-Start with PIN + skill; does not pick a table to unblock work
- Admin: may still assign the CNC router or cant machine on the three machine-bound tasks

### Requirements

- R1. `CUT_SHEET_CNC` FACE and BACK remain `providerRequirement = REQUIRED`. Same dedicated router. Missing machine → `missing_assignment` / `ineligible_provider`.
- R2. `FORM_ALUMINIUM_PROFILE` remains `REQUIRED`. Dedicated cant former. Missing machine → block Start.
- R3. These six LETTERS operations become `NOT_REQUIRED`, same contract as QC/pack: `BOND_LETTER_BODY`, `PLACE_LED_MODULES`, `WIRE_LIGHTING`, `INSTALL_OR_CONNECT_PSU`, `TEST_LIGHTING_IGNITION`, `CLOSE_LETTER_BODY`.
- R4. `TEST_ILLUMINATION_UNIFORMITY`, `INSPECT_FINISHED_LETTER`, `PACK_PRODUCT` stay `NOT_REQUIRED`.
- R5. Operator skill eligibility stays fail-closed and independent of provider assignment.
- R6. Task dependencies stay fail-closed (`dependencies_incomplete`).
- R7. Assembly tables remain a shared logical area. Do not require Masa 1 / Masa 2 / Masa 3 as organization configuration. Do not schedule tables.
- R8. Optional table mention during execution must not be required for Claim/Start. Current `NOT_REQUIRED` **rejects** provider assign (`ineligible_provider`). Minimum plan uses that existing behavior. A later optional hint/note is out of this unit.
- R9. Vinyl (`APPLY_SURFACE_FINISH`) and RAL (`PAINT_RAL`) stay unchanged. They are not in none/none 12.
- R10. No Machine Admin. No new schema if the existing field is enough.
- R11. No writes until Owner GO.

### Acceptance examples

```text
CUT_SHEET_CNC FACE = provider required
CUT_SHEET_CNC BACK = provider required
FORM_ALUMINIUM_PROFILE = provider required
BOND_LETTER_BODY = provider not required
PLACE_LED_MODULES = provider not required
WIRE_LIGHTING = provider not required
INSTALL_OR_CONNECT_PSU = provider not required
TEST_LIGHTING_IGNITION = provider not required
CLOSE_LETTER_BODY = provider not required
TEST_ILLUMINATION_UNIFORMITY = provider not required
INSPECT_FINISHED_LETTER = provider not required
PACK_PRODUCT = provider not required
```

Skill-ineligible operator cannot Start a manual task. Incomplete dependency cannot Start. Empty provider registry still blocks the three machine tasks and does not block the nine manual tasks.

### Out of scope

ProductDefinition, ProductAggregate, EIC, pricing, commercial snapshots, inventory, actual-cost formulas, PIN, Cloud provisioning, provider allowlist machinery, scheduling, Machine Admin, optional table recording UI.

## Planning Contract

### Current runtime truth

`OperationalProcess.providerRequirement` is optional. `processProviderRequirement` and `frozenProviderRequirement` default missing/undefined to `REQUIRED` (`packages/domain/src/processes/catalog.ts`).

Start and Claim-on-Start call `taskRequiresProvider(task)`, which is true only when the **frozen task field** is `REQUIRED` (`packages/domain/src/execution/plan.ts`). If true and `assignedProvider` is null → `missing_assignment`. If assigned but not in live `providersForCapability` → `ineligible_provider` / `provider_unavailable`.

Assigning a provider onto a `NOT_REQUIRED` task returns `ineligible_provider` (`assignProviderToTask`). That is how QC/pack already work.

Capability `kind` (`MACHINE` / `WORKSTATION` / `HUMAN_SKILL`) is **not** consulted by Start. Counter-proof: `PACKAGING` is `WORKSTATION` but pack is `NOT_REQUIRED`; `MANUAL_ASSEMBLY` is `HUMAN_SKILL` but bond is `REQUIRED` today. Workcenter catalog capability coverage only fills `eligibleProviders`.

Skills resolve from `requiredCapabilityId` via `TRUSTED_CAPABILITY_SKILLS` / eligibility context. Claim-on-Start evaluates skill even when provider is not required (`provider-requirement.test.ts` manual path still demands executor).

Actuals and inventory OUT key off `ActualConsumptionEntry` + `MATERIAL`. They do not read `assignedProvider`.

Snapshot freeze copies `processProviderRequirement(process)` onto each frozen operation. New plans inherit the catalog at freeze time. `frozenProviderRequirement(undefined) === REQUIRED` keeps old rows fail-closed.

### Why the previous report said 9/12

| Count | Operations | Why classified strict |
| --- | --- | --- |
| 3 | FACE CNC, BACK CNC, FORM | Explicit default `REQUIRED` + dedicated machines in catalog |
| 6 | BOND, PLACE LED, WIRE, PSU, IGNITION, CLOSE | Field omitted → default `REQUIRED`; `WC_ASSEMBLY_01/02` and `WC_LED_ASSEMBLY` advertise those capabilities |
| 3 | UNIFORMITY, INSPECT, PACK | Explicit `NOT_REQUIRED` |

9 = 3 machine + 6 omitted-default. Not because capability kind forces a table.

### Target 3/12 matrix

Owner-confirmed. Two distinct machines. Both `CUT_SHEET_CNC` tasks share the router. Nine manuals share flexible tables and must not require a physical provider.

### Contract ownership

The **operation contract** owns machine-bound vs manual (`providerRequirement`). Capability owns skill mapping and (for machine-bound ops) which catalog machines are eligible. Workcenter/machine catalog owns physical/logical provider identities. People/skills own who may Claim-on-Start. Execution owns Start guards. Composition owns dependencies.

Do not give capability `kind` Start authority.

### Variant comparison

| Variant | What | Fit |
| --- | --- | --- |
| A. Explicit `providerRequirement` per operation | Already exists; QC/pack prove the Start path | **Recommended** |
| B. Classify capabilities MACHINE_BOUND vs MANUAL | Conflicts with live kinds; would flip all `ELECTRICAL_ASSEMBLY` / `MANUAL_ASSEMBLY` processes including future ones | Rejected as authority |
| C. Operation authority + capability fallback | Extra resolver; current fail-closed default (`REQUIRED` if omitted) is enough | Rejected for this correction |

### Single recommended architecture

**Variant A only.** Set `providerRequirement: "NOT_REQUIRED"` on the six LETTERS manual processes, identical to the three QC/pack processes. Keep default `REQUIRED` for omitted processes (fail-closed). Do not add fields. Do not key Cloud on HUB MEDIA. Do not activate assembly tables in an org allowlist for this job.

Conceptual mapping onto existing names:

```text
operation
→ requiredCapabilityId          (skill + eligible machines when REQUIRED)
→ providerRequirement           (REQUIRED = dedicated machine; NOT_REQUIRED = no physical assign)
→ optional workcenter catalog   (shared assembly area; not a Start gate)
→ machine in registry           (only consulted when REQUIRED)
```

Owner-facing labels (do not invent new persisted fields): dedicated machine vs common manual area.

### Assumptions

- A1. Owner GO will cover only LETTERS none/none 12 plus this contract correction. Vinyl/RAL stay as today.
- A2. Optional “worked at table X” recording is later; completion note already exists.
- A3. Pilot provider allowlist (separate plan) shrinks to the two dedicated machines if this GO lands first.

### Sequencing

1. Owner GO
2. U1 catalog flags
3. U2 domain/API tests that assumed tables for the six ops
4. U3 only if UI tests fail (projection already branches on `requiresProvider`)
5. Do not sync `/governance` until runtime truth changes and owner accepts

## Implementation Units

### U1. Operation contract flags

Files:
- `packages/domain/src/processes/catalog.ts` — add `providerRequirement: "NOT_REQUIRED"` to BOND, PLACE_LED, WIRE, PSU, IGNITION, CLOSE
- `packages/domain/src/processes/catalog.test.ts` — invert the BOND expectation; assert the six plus existing three

Do not change `processProviderRequirement` default. Do not change capability kinds.

### U2. Execution tests that assign assembly/LED posts

Files likely to need expected-behavior updates (read at implement time; do not edit now):
- `packages/domain/src/execution/golden-path.test.ts` — six `run(..., WC_LED_ASSEMBLY_ID|WC_ASSEMBLY_01_ID)` calls become `runManual`
- `packages/domain/src/execution/plan.test.ts` — bond `eligibleProviders` may still list tables; `requiresProvider` / `canAssign` must become false
- `packages/domain/src/execution/lifecycle.test.ts` — bond reassignment between Masa 1/2
- `packages/domain/src/execution/preview.test.ts`
- `packages/domain/src/execution/actuals.test.ts`, `consumption.test.ts`, `actualCost.test.ts` — helpers that `startAssigned` LED with `WC_LED_ASSEMBLY`
- `packages/domain/src/production/frozenInput.test.ts` — NOT_REQUIRED counts
- API tests that assign those posts, if any

Keep CNC + cant tests on `missing_assignment`. Keep skill fail-closed tests.

### U3. Projection / UI only if broken

`apps/web/src/ExecutionPlanPanel.tsx`, `AtelierPage.tsx`, `ProductConfigurationViews.tsx` hide assign when `requiresProvider` is false. Operator copy is `Necesită utilaj dedicat` / `Alocă utilaj` / `Nu necesită utilaj dedicat`. A zone or table must not appear as a Start gate.

## Verification Contract

After GO, not now:

- Domain: catalog provider-requirement test; golden-path 12; provider-requirement start gate; claim-on-start; start-eligibility CNC still `missing_assignment`
- Empty registry: three machine tasks `noProvider`; nine manuals not counted as `noProvider`
- Skill-ineligible operator cannot Start a manual task
- Assigning Masa 1 to BOND after the change → `ineligible_provider`
- Assigning CNC 4020 to FACE without machine in registry → still blocked
- Actuals/inventory tests still pass without LED workcenter assign
- No Product/EIC/commercial test changes expected

Commands (future authorized build): `pnpm --filter @workos-final/domain test` then targeted API/web files if U2/U3 touch them.

## Definition of Done

- Acceptance matrix in Product Contract is true in runtime + tests
- Default omitted `providerRequirement` remains `REQUIRED`
- No Machine Admin, no table CRUD, no scheduling
- No Cloud/org hardcoding
- Owner GO recorded before the commit
- Docs/AGENTS/`/governance` updated only if this runtime truth is accepted

## Appendix

### Owner A–R report (research)

See the chat report delivered with this plan for the full A–R owner packet. Load-bearing facts are in Planning Contract above.

### Dedicated machines (owner language → catalog candidates, not confirmed IDs)

- Router for 4050 × 2050 mm panels → catalog candidate `MCH-CNC-4020` (label “CNC 4020”, table 4000 × 2000). Mapping is agent-side; owner confirmed the **class of machine**, not the string ID.
- Automatic letter-cant former → catalog candidate `MCH-CNC-CANT-LITERE`.

### Dead pieces

- `WC_LED_ASSEMBLY` / `WC_ASSEMBLY_01` / `WC_ASSEMBLY_02` as Start gates for LETTERS manuals become unused-for-Start. Keep catalog identities as shared-area inspection. Do not delete.
- `accepted-production-snapshot` remains compatibility-only.
- Capability `kind` remains descriptive, not a Start switch.
