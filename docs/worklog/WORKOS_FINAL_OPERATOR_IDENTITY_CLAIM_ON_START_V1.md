# WORKOS_FINAL_OPERATOR_IDENTITY_CLAIM_ON_START_V1

Date: 2026-08-17  
Baseline: `089646d` (People skills dynamic truth hardening)  
Plan: `docs/plans/2026-08-17-008-feat-operator-identity-claim-on-start-plan.md`

## Intent

Make the workshop law true: pressing PORNEȘTE as an identified operator claims the task and becomes executor in one atomic server mutation, with first-wins concurrency, without inventing RBAC/Pontaj/OAuth.

## Delivered

- Migration `020_operator_credentials_and_sessions.sql`
- scrypt PIN credential + hashed OperatorSession cookie
- People admin: PIN Configurat / Neconfigurat, set/reset (value never redisplayed)
- AppShell: Identifică-te / Operator chip / Schimbă / Ieși
- Domain + persist `claimAndStartExecutionTask` with SQLite CAS
- Complete ownership by same Person
- Primary Execution UX without required executor dropdown
- Concurrency proof: two sessions, one winner
- Canon + roadmap + governance updates

## Explicit non-goals preserved

No UserAccount, Role, Permission, RBAC, OAuth, Pontaj, takeover, or seeded PINs.

## Evidence

- Domain claim tests
- API operator-session + claim-concurrency tests
- Web Execution / People panel tests
- Browser verification recorded in the final Owner report

## Screenshots

Use operator-facing states only. Never capture a real PIN value.
