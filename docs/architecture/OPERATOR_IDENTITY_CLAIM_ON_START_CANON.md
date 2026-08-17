# Operator Identity + Claim-on-Start canon

Canonical law for workshop operator identification and atomic task claim.
People identity: `docs/architecture/PEOPLE_OPERATIONAL_IDENTITY_CANON.md`.
Skills / eligibility: `docs/architecture/PEOPLE_SKILLS_OPERATIONAL_TRUTH_CANON.md`.
Runtime wins if this document disagrees.

## Ownership split

```text
People            owns Person / Skills / Availability
Operator Identity owns credential + temporary OperatorSession
Eligibility       decides who may Start now
Execution         owns assignedExecutor after atomic Start
```

```text
OperatorSession  ≠  Pontaj
PIN              ≠  RBAC / Role / Permission
Skill            ≠  permission
Provider         ≠  executor
Person           =  canonical human identity
```

## Operator credential

- Optional numeric PIN per ACTIVE Person (4–8 digits; UI recommends 6).
- No seeded / shared / legacy default PINs.
- Persist only scrypt hash + random salt + KDF metadata.
- Raw PIN is never returned, logged, URL’d, or redisplayed after save.
- PIN reset replaces the credential and revokes all sessions for that Person.
- RETIRED Person cannot set PIN or establish a session.

## OperatorSession

- Maps a random unguessable token → `personId`.
- DB stores token hash only.
- Typical TTL ≈ 12h; explicit logout; multi-device allowed.
- Transport: HttpOnly cookie on same-origin `/api` (Vite proxy).
- TEMPORARILY_UNAVAILABLE Person may remain identified; may not Claim-on-Start.
- Skill / availability changes do not rewrite an already started executor.

## Claim-on-Start

Primary operator path:

```text
identify → reach task → PORNEȘTE → become executor
```

One server mutation equivalent to `claimAndStartExecutionTask(taskId, currentPersonFromSession)`:

```text
PLANNED + assignedExecutor = null
→
IN_PROGRESS + assignedExecutor = current Person + startedAt = now
```

Same transactional boundary revalidates: task still PLANNED, dependencies complete,
session valid, Person ACTIVE + AVAILABLE, capability mapped, skill-eligible,
provider present when REQUIRED, no conflicting executor.

Failed prerequisite → no partial claim.

If a compatibility preassignment exists, only that Person may Start; others cannot steal.

## First-wins concurrency

Two eligible operators may press Start nearly simultaneously.
Exactly one wins. Loser receives conflict truth naming the winner.
Proven with real concurrent HTTP requests against the same persisted SQLite task.

## Complete ownership

After Start, executor is execution fact.
Only the same Person may Complete in V1.
No takeover, transfer, or supervisor override.
Later availability / skill loss does not rewrite the IN_PROGRESS executor.
Expired session: re-identify as the same Person, then Complete.

## Manual executor assignment

`POST .../executor` remains COMPATIBILITY / TEST / ADMIN fallback.
It is not the primary happy path. Operator UI does not require “Alege executant”.

## What this is not

Not UserAccount, Role, Permission, RBAC, OAuth/OIDC/SSO, MFA, Pontaj, payroll, HR,
scheduling, capacity, or device enrollment.
