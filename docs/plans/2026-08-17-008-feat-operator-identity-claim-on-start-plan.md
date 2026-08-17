---
title: "feat: Operator Identity + Claim-on-Start V1"
type: feat
status: active
date: 2026-08-17
origin: OWNER GO WORKOS_FINAL_OPERATOR_IDENTITY_CLAIM_ON_START_V1
baseline: 089646d1bd2f3af75d695c8413e203c586f997fa
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: owner-go
execution: code
---

# Operator Identity + Claim-on-Start V1

## Goal Capsule

Make this workshop statement true: **Florin pressed Start, therefore Florin became the executor** — in one atomic server mutation, with first eligible person winning under race, without inventing RBAC, UserAccount, Pontaj, or OAuth.

Authority hierarchy:
1. Owner GO `WORKOS_FINAL_OPERATOR_IDENTITY_CLAIM_ON_START_V1` (OPTION A: Person + PIN + OperatorSession)
2. Accepted People hardening at `089646d` (one-time bootstrap, PLANNED eligibility, unmapped ≠ anyone)
3. Existing Execution CAS write in `apps/api/src/execution/store.ts`
4. This plan

Stop conditions / owner STOP gates:
- Need for RBAC, OAuth/SSO, UserAccount authority, task takeover/transfer, or Pontaj → STOP and ask owner
- Frontend `assign → then start` as the claim path → FAIL (race window)
- Raw PIN persisted, logged, or returned in API/screenshots → FAIL
- Concurrency not proven with two near-simultaneous Starts → no PASS / no commit

## Product Contract

### Problem frame

People + Skills now hold live workforce truth, but Execution still expects an operator to **pre-select** an executor, then Start. On a shared terminal that is the wrong workshop law. Identification must answer **who is at the terminal**; Claim-on-Start must answer **who actually started this task**, atomically.

### Actors

- Owner/admin (Administrare → Persoane): configures/resets operator PIN (honest: no Admin RBAC yet)
- Workshop employee (shared tablet/phone): identifies with personal PIN, claims ready tasks, completes own work
- Competing eligible employees: first successful atomic Start wins; loser sees who started it

### Requirements

- R1. Each ACTIVE Person may have an optional individual numeric PIN (4–8 digits; UI recommends 6). No default/shared/legacy-seeded PINs.
- R2. Raw PIN never persisted, logged, URL’d, screenshot’d, or returned after save. Store scrypt hash + random salt + metadata only.
- R3. OperatorSession maps `sessionId → personId` with random unguessable token (DB stores hash only), ~12h expiry, explicit logout, multi-device allowed.
- R4. PIN reset invalidates previous credential immediately and revokes all active sessions for that Person.
- R5. RETIRED Person cannot create a new session; existing sessions must not authorize actions (lazy invalidate on check).
- R6. TEMPORARILY_UNAVAILABLE Person **may** identify; **must not** Claim-on-Start. Identity ≠ Availability.
- R7. Skill changes do not invalidate session; they update eligibility for Claim-on-Start.
- R8. Canonical operator Start path: current session Person + one server mutation `claimAndStart` that validates readiness/eligibility, sets executor, transitions to IN_PROGRESS atomically. No browser assign-then-start.
- R9. First eligible winner under concurrency: exactly one success; conflict names winner safely.
- R10. Failed Start (provider/deps/ineligible/unavailable/unmapped) leaves `assignedExecutor` null / unchanged — no partial claim.
- R11. Manual assign API remains compatibility/test path; primary Execution UX must not require executor dropdown.
- R12. Complete allowed only for same identified Person as executor (V1). No takeover.
- R13. After Start, later unavailability/skill loss does not rewrite IN_PROGRESS history; same Person may Complete.
- R14. Provider remains independent of Person. Missing provider blocks Start before claim.
- R15. PIN/session is not Pontaj, not RBAC, not Skill-as-permission, not commercial/product change.

### Key flows

F1. Owner sets PIN on Person detail → Configurat; never redisplay PIN.
F2. Shared terminal: Identifică operatorul → choose ACTIVE Person with PIN → enter PIN → AppShell shows Operator: {name}.
F3. Ready unclaimed task: PORNEȘTE → atomic claim+start → IN_PROGRESS / Executant: current Person.
F4. Second employee Start → 409 conflict → “Taskul a fost pornit deja de Florin CNC.”
F5. Same executor Complete; other Person Complete blocked.
F6. PIN reset → old session dead; old PIN rejected; new PIN works.

### Acceptance examples

- Florin eligible, CNC provider assigned, no executor → Start → executor Florin + IN_PROGRESS in one write.
- Florin and Andrei Start ~same time → one IN_PROGRESS executor; one conflict.
- No provider → Start fails; executor still null.
- Florin on Concediu → can login; cannot Start; restore AVAILABLE → can Start without new PIN.
- Andrei tries Complete on Florin’s task → blocked.

### Out of scope

Full Auth/RBAC/OAuth/SSO/MFA, UserAccount domain, Pontaj/HR/salary, takeover/transfer/reassign after Start, auto scheduling, Documents, commercial/product changes, Analyzer, ACM expansion.

## Planning Contract

### Key technical decisions

KTD1. **Identity primitives:** `OperatorCredential` + `OperatorSession` attached to `personId` only. No `User` / Role / Permission tables.
Rationale: Owner OPTION A; Person stays canonical human identity.

KTD2. **PIN crypto:** Node `crypto.scrypt` with random salt (e.g. 16+ bytes), store `pin_hash`, `pin_salt`, `kdf=scrypt`, params; verify with `timingSafeEqual` on derived buffers.
Rationale: GO forbids SHA256-alone / Base64-as-security; Node built-in, no new deps.

KTD3. **Session transport:** Prefer **HttpOnly cookie** on same-origin `/api` via Vite proxy (`VITE_API_BASE_URL` empty today). Enable `credentials: 'include'` on operator fetches; extend Hono CORS with `credentials: true` for known web origins. Cookie: HttpOnly, SameSite=Lax, Path=/, Max-Age≈12h; Secure only when HTTPS. If absolute cross-origin API URL is used later, document cookie vs Bearer — do not invent brittle dual modes in V1 unless forced.
Rationale: Matches current proxy topology; raw PIN never becomes session token.

KTD4. **Claim mutation:** Domain `claimAndStartExecutionTask(record, taskId, actorPersonId, startedAt, people, eligibility)` — single transition PLANNED→IN_PROGRESS that sets `assignedExecutor` from actor (or verifies match if compatibility preassignment exists). Persistence reuses existing SQLite transaction + CAS `UPDATE ... WHERE status=? AND IFNULL(assigned_executor_id,'')=? ...` in `writeTaskOperationalState`.
API: `POST /api/execution-tasks/:taskId/start` (or dedicated claim route) resolves **actor from OperatorSession cookie on the server** — do **not** trust a client-supplied `personId` body as the claim identity (spoofable). Empty-body start of a preassigned task remains compatibility only when session Person matches assigned executor.
Idempotency: already `IN_PROGRESS` + same person → `alreadyApplied`; other person → conflict (not silent success). Today’s start alreadyApplied ignores who claimed — Claim-on-Start must fix that distinction.
Rationale: CAS already present; frontend assign+start forbidden; session is authority for WHO.

KTD5. **Complete ownership:** `completeExecutionTask` (or persist wrapper) requires current operator `personId === assignedExecutor.id` when session context is present for operator API path.
Rationale: GO §39; no takeover.

KTD6. **Manual assignment:** Keep `POST .../executor` for tests/compatibility; demote UI primary path. If PLANNED already has executor X, only X’s session may claim/start; others get conflict, no silent steal.
Rationale: GO §29.

KTD7. **Brute-force guard:** In-memory failed-attempt counter per `personId` (+ optional source key) with short lockout. Document as V1 runtime-local (not distributed).
Rationale: Bounded; no CAPTCHA platform.

KTD8. **Migration:** Additive `020_operator_credentials_and_sessions.sql` (verify sequence: 019 is bootstrap markers). Tables `operator_credentials`, `operator_sessions`. No PIN seeds.

### Technical design sketch (directional, not code)

```text
Person ── OperatorCredential (pinHash…)
       └── OperatorSession (tokenHash, expiresAt, revokedAt)
                │
                ▼
         currentOperator.personId
                │
                ▼
claimAndStart(taskId, personId)  -- ONE mutation
  validate PLANNED + deps + provider + eligibility + executor empty/self
  → assignedExecutor + IN_PROGRESS + startedAt
  CAS write; loser → already_claimed_by_other
```

### Assumptions

- A1. Dev/e2e use Vite proxy same-origin `/api` (current Playwright config).
- A2. Existing People hardening marker + eligibility resolver remain authoritative.
- A3. Pre-existing local dirt (`apps/api` listen-retry, old screenshots) stays unstaged.
- A4. Admin PIN UI sits under People without claiming true Admin authorization enforcement.

### Sequencing

1. Migration + credential/session domain + store + API
2. AppShell identity + People PIN admin
3. Domain claimAndStart + Complete ownership + persist CAS path
4. Execution UX primary path swap
5. Concurrency + API + e2e proofs
6. Docs/governance/roadmap + review + commit `feat: add operator claim on start`

### Risks

| Risk | Mitigation |
|---|---|
| Cookie not attached via proxy | Prove with Playwright cookies; adjust Path/SameSite; document |
| Partial claim on failed Start | Single mutation; tests assert NULL executor |
| Two winners | Mandatory concurrent Starts test on real SQLite CAS |
| UI still shows assign dropdown as required | Primary UX rewrite; classify leftover as COMPATIBILITY hidden/advanced |
| PIN confusion with RBAC/Pontaj | Canon + governance honesty |

## Implementation Units

### U1. Operator credential + session persistence

Files:
- `apps/api/src/persistence/migrations/020_operator_credentials_and_sessions.sql`
- `packages/domain/src/people/operatorCredential.ts` (or `operatorIdentity.ts`)
- `packages/domain/src/people/operatorSession.ts`
- `apps/api/src/people/operatorStore.ts` (or under `apps/api/src/operator/`)
- `apps/api/tests/persistence.test.ts` (migration count 20)
- Tests: `packages/domain/src/people/operator-identity.test.ts`

Scenarios:
- Correct PIN verifies; wrong rejects; plain PIN absent from DB rows
- Reset: old PIN fails, new works; sessions revoked
- ACTIVE can identify; RETIRED cannot new session
- TEMPORARILY_UNAVAILABLE can identify
- Expiry / logout / rename preserves personId mapping

### U2. Operator session HTTP API + login projection

Files:
- `apps/api/src/operator/routes.ts` (or people routes extension)
- `apps/api/src/app.ts` (CORS credentials)
- `apps/api/src/productSystem/runtime.ts` wiring
- `apps/api/tests/operator-session.test.ts`

Routes (conceptual):
- `GET /api/operator-session`
- `POST /api/operator-session` `{ personId, pin }`
- `DELETE /api/operator-session`
- `GET /api/operator-candidates` — ACTIVE people, displayName, pinConfigured, availability label only
- People PIN: `PUT/PATCH /api/people/:id/operator-pin` set/reset (owner-facing)

Scenarios:
- Full login → current → logout; no hashes in JSON
- Rate-limit after repeated wrong PIN
- Reset PIN invalidates cookie/session

### U3. Atomic Claim-on-Start + Complete ownership

Files:
- `packages/domain/src/execution/lifecycle.ts` — `claimAndStartExecutionTask`, complete actor check
- `packages/domain/src/execution/plan.ts` — projection: currentOperator relationship, canClaimStart, messages; demote primary canAssignExecutor
- `apps/api/src/execution/store.ts` — `persistClaimAndStart` via existing applyMutation/CAS
- `apps/api/src/product.ts` — Start uses session Person; Complete checks session
- `packages/domain/src/execution/claim-on-start.test.ts`
- `packages/domain/src/execution/claim-concurrency.test.ts` (or API-level)
- `apps/api/tests/claim-on-start.test.ts`
- `apps/api/tests/claim-concurrency.test.ts` **mandatory**

Scenarios:
- Eligible claim empty task → executor+IN_PROGRESS together
- No provider / deps / unavailable / missing skill / unmapped → no claim
- Other Person already claimed → conflict with winner label
- Same actor retry → idempotent
- Concurrent Florin/Andrei → 1 success, 1 conflict, one DB executor
- Complete: same Person ok; other blocked
- Session expire mid-task → re-identify → Complete; executor unchanged
- Post-start unavailable/skill loss → history intact; Complete still ok for same Person
- Provider separation + manual task NOT_REQUIRED

### U4. AppShell + People PIN UI + Execution primary UX

Files:
- `apps/web/src/AppShell.tsx` (+ operator control component)
- `apps/web/src/operatorSessionApi.ts` / context provider
- `apps/web/src/PersonAdminPage.tsx` — PIN Configurat/Neconfigurat, set/reset
- `apps/web/src/ExecutionPlanPanel.tsx` / `ExecutionWorkspacePage.tsx` — Claim-on-Start primary; no required executor select
- Web tests + CSS for 390px
- e2e: `e2e/operator-claim-on-start.spec.ts` (+ multi-context first-wins if practical)

Scenarios / e2e:
- A shared terminal identify → claim → complete
- B first-wins (two contexts or API+UI)
- C unavailable cannot start; restore without relogin
- D PIN reset kills session
- Screenshots without PIN values

### U5. Docs, governance, roadmap, AGENTS

Files:
- `docs/architecture/OPERATOR_IDENTITY_CLAIM_ON_START_CANON.md` (new)
- `docs/architecture/PEOPLE_OPERATIONAL_IDENTITY_CANON.md`
- `docs/architecture/PEOPLE_SKILLS_OPERATIONAL_TRUTH_CANON.md`
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md`
- governance projection / roadmap as needed
- `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md`
- `AGENTS.md`
- `docs/worklog/WORKOS_FINAL_OPERATOR_IDENTITY_CLAIM_ON_START_V1.md`

Content laws: PIN ≠ RBAC; session ≠ Pontaj; Skill ≠ permission; Provider ≠ executor; Claim freezes WHO STARTED; Plan freezes WHAT.

## Verification Contract

- Domain + API + web unit tests for U1–U4
- **Mandatory** SQLite concurrency Claim-on-Start test (not sequential fake)
- Playwright e2e A–D; narrow 390px
- React Doctor `--scope changed`
- Independent read-only review attacking GO §92 A–O
- Network: no PIN in bodies after login request; no unexpected writes on Execution GET
- Commit only after genuine PASS: `feat: add operator claim on start` → `main` → `origin/main`

Commands (repo-standard):
- `pnpm --filter @workos-final/domain test`
- `pnpm --filter @workos-final/api test`
- `pnpm --filter @workos-final/web test`
- `pnpm typecheck`
- `pnpm e2e -- e2e/operator-claim-on-start.spec.ts`
- `npx react-doctor@latest --verbose --scope changed`

## Definition of Done

- Owner human test §107 answers all YES/NO as specified
- Required final answers §106 all match GO
- No frontend assign→start claim path
- Manual assignment classified COMPATIBILITY / TEST, not primary UX
- Pre-existing dirt excluded from commit
- No Auth/Claim scope creep into Pontaj/RBAC

## Appendix

### Baseline check (recorded)

- Local HEAD = `origin/main` = `089646d1bd2f3af75d695c8413e203c586f997fa`
- Unrelated dirt present: `apps/api/src/index.ts` listen-retry, `apps/api/package.json`, `health.test.ts`, mass screenshot mtime noise — preserve / exclude

### Existing CAS (reuse)

`writeTaskOperationalState` already updates executor+status+started_at under `WHERE status = ? AND IFNULL(assigned_executor_id,'') = ?` inside a transaction — foundation for first-wins.

### Manual assignment consumers (initial classify)

| Consumer | Class |
|---|---|
| `ExecutionWorkspacePage` / `ExecutionPlanPanel` executor select | PRIMARY today → demote after U4 |
| `POST /api/execution-tasks/:id/executor` | COMPATIBILITY |
| `apps/api/tests/product.test.ts`, `people-start-eligibility.test.ts`, persistence | TEST |
| e2e helpers assigning executor | TEST / migrate toward claim |

### Session vs Pontaj (explicit)

Login/logout times are not attendance. Task Start is not shift start. No attendance rows in this build.

### Impact reports (expected after implementation)

- Harta sistemelor: **UPDATED** — add OperatorCredential / OperatorSession / Current Operator vs Person / Eligibility / Executor
- Guvernanța: **UPDATED** — ownership lines from GO §96
- Roadmap: Operator Identity + Claim-on-Start → DONE; next recommendation one of: execution/operator workflow closure, Documents, or owner-prioritized gap — **do not start**

### Research tracks (completed, corroborating)

- [People + Skills](c50fa662-44af-4bf1-b35a-1b835cf7d38f): Person/eligibility unchanged; PIN on `PersonAdminPage`; next migration **020**; no auth stack today; bootstrap marker untouched
- [Execution claim paths](2027471a-1eef-40a5-a29e-f3ad92c7ab4a): assign→start race window confirmed; reuse `applyMutation`/`writeTaskOperationalState` CAS; keep `/executor` COMPATIBILITY; primary UI today is ExecutionWorkspace only
- [AppShell CORS session](61dbea6b-e90c-484a-aa5c-c2aa104d6e73): HttpOnly cookie + same-origin `/api` via Vite proxy; chip on `.app-header-row` after nav; `node:crypto` scrypt (do not reuse content `sha256Hex`)
- Track E concurrency: exercise two near-simultaneous Starts against real SQLite CAS, not sequential disguise
- Track F operator UX / e2e QA: scenarios A–D from Owner GO
