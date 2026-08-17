---
title: "feat: Operator Task Inbox / Atelier V1"
type: feat
status: completed
date: 2026-08-17
origin: OWNER GO WORKOS_FINAL_OPERATOR_TASK_INBOX_V1
baseline: 05a8d19904cbf7ac39c115654665e9c1f7a9165e
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: owner-go
execution: code
---

# Operator Task Inbox / Atelier V1

## Goal Capsule

Give an identified workshop employee one surface that answers: **„Ce am eu de făcut acum?”** — across all jobs — without inventing a TaskQueue, scheduler, priority engine, or second Execution Workspace.

Authority hierarchy:
1. Owner GO `WORKOS_FINAL_OPERATOR_TASK_INBOX_V1`
2. Accepted Claim-on-Start at `05a8d19` (OperatorSession + atomic Start + first-wins)
3. Accepted People eligibility hardening
4. This plan

Stop conditions:
- Need for TaskQueue / Assignment / Dispatch / Job entity / scheduling / auto-assign → STOP
- Frontend eligibility calculation → FAIL
- New Claim endpoint duplicating `/start` → FAIL
- New DB table for inbox convenience → RED FLAG / STOP for Owner GO
- Reintroducing primary “Alege executant” → FAIL

## Product Contract

### Problem frame

Claim-on-Start works, but only after someone already opened the correct `/execution/:planId`. The daily shop-floor question is discovery: Florin needs to see his in-progress work and what he can start now, across Lucrări, without browsing every Order.

### Actors

- Workshop employee (shared terminal): identifies via existing AppShell PIN flow; uses Atelier as work door
- Competing eligible employees: both may see the same available task; first-wins Start unchanged
- Owner/admin: no new RBAC; Atelier does not administer People or Machines

### Requirements

- R1. Route `/atelier` with operator-facing title **Atelier** / page lead **Munca mea**.
- R2. Top-level nav becomes: Lucrări | Atelier | Comercial | Produse | Administrare. Admin catalog group already named “Atelier” (Resurse/Stoc/Procese/Utilaje) stays configuration — not this surface. Operator Atelier = current work projection.
- R3. Identity only from existing OperatorSession. No `?personId=`, no localStorage actor, no employee selector as identity.
- R4. No session → clear “Identifică-te pentru a vedea munca disponibilă.” Reuse AppShell identify.
- R5. Backend projection `OperatorTaskInboxProjection` via `GET /api/operator-task-inbox` (session cookie). Frontend does not download all plans to compute eligibility.
- R6. Lanes (derived, not persisted): **În lucru la mine**; **Disponibile pentru mine**; **Urmează** (eligible Person, deps incomplete). Optional fourth presentation for provider-missing within Disponibile or as sub-state — see KTD3.
- R7. Cross-job: scan open ExecutionPlans; prove ≥2 plans in one projection.
- R8. Task row context: frozen Client (when ORDER-backed), product, inscription, process, component/scope, capability, provider state, task state, dependency hint. No hashes/UUIDs/EIC/prices as primary UI.
- R9. Ready Start from Atelier calls existing `POST /api/execution-tasks/:taskId/start` with session cookie. No new claim route.
- R10. Provider REQUIRED + missing: visible as eligible-person work, clearly not startable; open workspace for assign (no auto-select Machine).
- R11. Complete stays in existing Execution Workspace (deep-link). Inbox does not duplicate actuals UI.
- R12. Display order deterministic from existing facts (e.g. plan createdAt + task seq). Explicit disclaimer: not production priority.
- R13. No new migration/table expected. Index-only migration only if measured and Owner GO.
- R14. Switching operator reloads projection from new session immediately.

### Key flows

F1. Identify → `/atelier` → see in-progress + available across jobs.
F2. Available + provider ready → PORNEȘTE → moves to În lucru la mine.
F3. Available + provider missing → “Necesită echipament / zonă” → Deschide lucrarea → assign → return/start.
F4. Conflict Start → existing 409 → refresh inbox.
F5. Switch Florin→Andrei → inbox replaces lanes; no Florin leakage.

### Acceptance examples

- Florin CNC sees CNC tasks from Job A and Job B when eligible; graphic person does not see them as claimable.
- Unavailable Florin: session ok; availableToMe empty; in-progress Florin tasks still listed for him.
- Preassigned to Andrei: Florin does not see as claimable; wording “Rezervat pentru Andrei” if shown.
- After Florin Start: Andrei no longer sees it as available; Florin sees În lucru la mine.

### Out of scope

TaskQueue, Job entity, scheduling, capacity, shifts, auto-assign, priority/deadline engines, notifications, takeover, Pontaj/HR/Documents, commercial/product changes, Analyzer.

## Planning Contract

### Key technical decisions

KTD1. **Projection, not authority.** Atelier owns no truth. ExecutionTask remains task authority. People/Eligibility decide who may start now. OperatorSession is current actor.
Rationale: Owner GO §§2–3, 38.

KTD2. **Read path.** Add `listOpenExecutionPlanRecords` (or equivalent) in execution store: distinct `plan_id` from tasks with status in (`PLANNED`,`IN_PROGRESS`). Hydrate each plan; call `projectExecutionPlanView(record, people, snapshot, eligibility, currentOperatorId)`; flatten into inbox lanes with dedicated classifier (do not misuse `operatorRelation` alone for waiting/provider lanes — it can include reserved-other work).
Rationale: Research; reuse claim readiness (`canClaimStart`); no new table.

KTD3. **Lanes.**
- `inProgressMine`: IN_PROGRESS + assignedExecutor = current Person (execution fact; ignore later skill/availability loss).
- `availableReady`: `canClaimStart === true` (deps done, provider ready, eligible, not reserved other).
- `availableNeedsProvider`: PLANNED + person-eligible + deps complete + provider REQUIRED missing/invalid + executor null or self. Shown under Disponibile with clear non-startable state (or sibling subsection).
- `waitingDependencies` (**Urmează**): PLANNED + person-eligible + deps incomplete + executor null or self.
Exclude COMPLETED. Exclude reserved-for-other from all claimable lanes.
Rationale: Owner lanes + research warning on `operatorRelation` precedence.

KTD4. **Job context.** Per task: from plan `productLabel`, `inscription`; Client via `sourceSnapshotId → AcceptedProductionSnapshot.sourceOrderSnapshotId → OrderSnapshot.customer.displayName` when ORDER-backed; pilot/atelier-test → omit Client or neutral label (not fake client).
Rationale: Research lineage; Lucrări stays Order-rooted.

KTD5. **Navigation.** Implement top-nav **Atelier** → `/atelier` as Owner prefers. Document that Administrare → Atelier remains workshop *configuration* catalog (existing), while top-nav Atelier is *Munca mea*.
Rationale: Owner §6 explicit preference over nested-only placement.

KTD6. **Provider UX.** Prefer **B**: “Deschide lucrarea” → `/execution/:planId?task=taskId` for provider assign + complete. Inbox offers PORNEȘTE only when `canClaimStart`. Do not auto-select Machine. Small inline provider select (A) deferred unless B proves too many clicks in QA.
Rationale: Avoid second assignment UI; reuse ExecutionPlanPanel.

KTD7. **Deep-link.** Add non-authoritative `?task=` (or hash) on ExecutionWorkspacePage: scroll/highlight target task after load; unknown task → compact notice, plan still usable.
Rationale: Owner §18.

KTD8. **API.** `GET /api/operator-task-inbox` → 401/empty identify payload when no session (prefer 401 or 200 with `{ operator: null, inbox: null }` consistent with session GET style — implementer chooses one coherent pattern and tests it). Response: operator summary + lane arrays + counts. No PIN/token/hashes/EIC/prices.
Start mutations unchanged.

KTD9. **Sorting.** Stable: ascending `plan.createdAt`, then `task.seq`. UI footnote: “Ordinea de afișare nu reprezintă programare sau prioritate de producție.”

KTD10. **Dirt.** Exclude listen-retry (`apps/api/src/index.ts`, package.json, health.test) and unrelated screenshot mtimes from commit.

### Technical design sketch (directional)

```text
OperatorSession.personId
        │
        ▼
list open plans (PLANNED|IN_PROGRESS tasks)
        │
        ▼
for each plan: projectExecutionPlanView(..., currentOperatorId)
        │
        ▼
classify → OperatorTaskInboxProjection
  inProgressMine[]
  availableReady[] / availableNeedsProvider[]
  waitingDependencies[]
        │
        ▼
GET /api/operator-task-inbox  →  /atelier UI
PORNEȘTE → existing POST .../start
Deschide → /execution/:planId?task=
```

### Assumptions

- A1. Pilot plans without Order are allowed in Atelier if open tasks exist; Client omitted.
- A2. Current SQLite volume fits hydrate-all-open-plans; no cache infra in V1.
- A3. Cookie same-origin via Vite `/api` proxy remains valid (proven in Claim-on-Start).

### Sequencing

1. Domain inbox projector + store list-open-plans + API
2. Web `/atelier` page + AppShell nav + session-driven reload
3. ExecutionWorkspace `?task=` deep-link
4. Multi-job tests + concurrency regression + UI/runtime screenshots
5. Docs/roadmap/governance + review + commit `feat: add operator task inbox`

### Risks

| Risk | Mitigation |
|---|---|
| `operatorRelation` leaks reserved-other into waiting/provider | Dedicated lane classifier; tests |
| Admin “Atelier” vs top-nav “Atelier” confusion | Page lead “Munca mea”; docs note |
| N+1 hydrate cost | Single API; list only open plans; measure before indexes |
| Stale available after peer claim | Conflict on Start + refresh projection |
| Frontend eligibility temptation | No plan dump API for inbox; only projected lanes |

### Open questions

- Q1 (deferred): Inline provider select in Atelier if Deschide-path is too heavy — only after V1 QA.
- Q2 (deferred): Index migration on `execution_tasks(status, plan_id)` — only if measured slow + Owner GO.

No blocking open questions.

## Implementation Units

### U1. Domain + store inbox projection

**Goal:** Backend-owned cross-job OperatorTaskInboxProjection from existing Execution truth.

**Files:**
- `packages/domain/src/execution/inbox.ts` (new) — types + `projectOperatorTaskInbox`
- `packages/domain/src/execution/index.ts` / `packages/domain/src/index.ts` — exports
- `apps/api/src/execution/store.ts` — `listOpenExecutionPlanRecords`
- `apps/api/src/productSystem/runtime.ts` — `getOperatorTaskInbox(personId)`
- Tests: `packages/domain/src/execution/inbox.test.ts`, `apps/api/tests/operator-task-inbox.test.ts`

**Test scenarios:**
- No current operator id → empty / not used by HTTP without session
- Florin eligible CNC appears in availableReady when provider+deps ok
- Non-CNC person excluded from available
- TEMPORARILY_UNAVAILABLE → no availableReady/NeedsProvider/waiting for new claims; inProgressMine still if any
- CAPABILITY_UNMAPPED → not available
- Deps incomplete → waitingDependencies only
- Provider missing → availableNeedsProvider, not ready Start
- IN_PROGRESS Florin → inProgressMine; Andrei does not see as his
- Preassigned other → not claimable by current
- Multi-job: two plans contribute rows in one projection
- Skill removed then restored updates available set
- Sort stable by createdAt + seq

### U2. HTTP read API

**Goal:** `GET /api/operator-task-inbox` from session only.

**Files:**
- `apps/api/src/operator/routes.ts` or thin register in product/app — prefer operator routes adjacency
- `apps/api/tests/operator-task-inbox.test.ts` (HTTP cases)

**Test scenarios:**
- No/invalid session → identify-required response (no lane data as claimable)
- Valid session returns lanes; body has no pin/token/hash/EIC/price fields
- After Start via existing endpoint, refresh shows move available → inProgress
- Switch person (two cookies) → different projections
- Concurrent first-wins regression still green (`claim-concurrency.test.ts`)

### U3. Atelier UI + nav

**Goal:** Operator-facing `/atelier` discovery + PORNEȘTE + open workspace.

**Files:**
- `apps/web/src/AtelierPage.tsx` (new)
- `apps/web/src/AtelierPage.test.tsx` (new)
- `apps/web/src/operatorTaskInboxApi.ts` (new) — credentials include
- `apps/web/src/App.tsx` — route + nav item
- `apps/web/src/AppShell.tsx` — if subnav patterns needed (likely not)
- `apps/web/src/index.css` — compact lane styles
- Reuse `OperatorSessionContext`, existing start API

**Test scenarios:**
- No operator → identify copy
- Unavailable → honest empty available + message
- Empty available → “Nu ai taskuri disponibile acum.”
- Renders inProgress / available / waiting
- PORNEȘTE calls start + reloads
- Operator switch triggers reload
- No “Alege executant” primary control

### U4. Execution deep-link

**Goal:** `/execution/:planId?task=` focuses target operation.

**Files:**
- `apps/web/src/ExecutionWorkspacePage.tsx`
- `apps/web/src/ExecutionPlanPanel.tsx` (optional highlight prop)
- Tests: `ExecutionWorkspacePage.test.tsx`

**Test scenarios:**
- Known taskId → highlighted / actionable region present
- Unknown taskId → plan loads + notice, no crash

### U5. Docs, runtime QA, ship

**Goal:** Canon/roadmap + screenshots + PASS commit.

**Files:**
- `docs/architecture/OPERATOR_TASK_INBOX_ATELIER_CANON.md` (new)
- Update `docs/architecture/UI_UX_FOUNDATION_CANON.md`, `WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`, `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md`, `AGENTS.md`
- `docs/worklog/WORKOS_FINAL_OPERATOR_TASK_INBOX_V1.md` + screenshots listed in Owner GO §32

**DoD:** Runtime matrix §29–33; React Doctor diagnostic; independent review attacks §35; commit `feat: add operator task inbox`; push `main`.

## Verification Contract

1. Domain inbox tests (multi-job mandatory)
2. API inbox + session switch + claim reuse
3. Keep `claim-concurrency.test.ts` green
4. Web Atelier + deep-link tests
5. Real browser: identify → /atelier → multi-job → PORNEȘTE → workspace → switch operator
6. Network: load = read-only; Start only on button
7. ~390px screenshots
8. React Doctor `--scope changed` (diagnostic)
9. Independent review §35; fix P1/P2
10. Scoped `git diff --check`; one commit; push origin/main

## Definition of Done

Global PASS gates (final report top):
- CROSS_JOB_INBOX_PROVEN = YES
- NO_NEW_TASK_AUTHORITY = YES
- CURRENT_OPERATOR_FILTER_PROVEN = YES
- CLAIM_ENDPOINT_REUSED = YES
- SCHEDULING_OR_AUTOASSIGNMENT_ADDED = NO

Per unit: U1–U5 complete with tests/runtime evidence as above.
No Documents/Pontaj/scheduling creep.
Unrelated dirt unstaged.

## Appendix

### Research breadcrumbs (05a8d19)

- List open plans: query distinct `plan_id` from `execution_tasks` where status in PLANNED|IN_PROGRESS — no list API today (`execution/store.ts`).
- Reuse `projectExecutionPlanView` / `canClaimStart`; lane classifier must not trust `operatorRelation` alone for waiting/provider.
- Client: OrderSnapshot.customer.displayName via production snapshot `sourceOrderSnapshotId`.
- Admin “Atelier” = config catalog; top-nav Atelier = Munca mea.
- Provider assign: prefer open Execution Workspace; deep-link `?task=`.
