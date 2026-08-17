# Operator claim-on-start: session actor + SQLite CAS

## Problem
Workshop shared terminals cannot safely do browser assign-then-start. Race windows and spoofable client personIds break first-wins ownership.

## Guidance
- Actor for Start/Complete must come from OperatorSession cookie, never from request body personId.
- Claim + Start is one domain mutation; persist with existing CAS (`status` + `assigned_executor_id` predicates).
- Prove concurrency with real parallel HTTP Starts, not sequential pretend races.
- Keep PIN/session out of RBAC/Pontaj; demote manual `/executor` to compatibility only.
