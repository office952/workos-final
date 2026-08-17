# People operational identity canon

Canonical current law for Person identity used by Execution.
Skills, availability and eligibility: `docs/architecture/PEOPLE_SKILLS_OPERATIONAL_TRUTH_CANON.md`.
Runtime wins if this document disagrees.

## Core law

```text
Person     ≠  Provider
Person     ≠  authenticated user
Person     =  operational identity
```

Provider is the Machine / Workcenter that can perform a required capability.
Person is the human who may execute a task.
Operator Identity (PIN + OperatorSession) answers only: who is operating WorkOS now?
See `docs/architecture/OPERATOR_IDENTITY_CLAIM_ON_START_CANON.md`.

## Person

```text
personId                 stable identity  per:{uuid} or per:legacy:{slug}
displayName              operator-facing name
status                   ACTIVE | RETIRED
availability             AVAILABLE | TEMPORARILY_UNAVAILABLE
unavailableReason        optional, informational
unavailableUntil         optional, informational
roleLabel                optional descriptive label
provenance               OWNER_CONFIRMED_LEGACY | MANUAL | null
createdAt / updatedAt / availabilityUpdatedAt
retiredAt                nullable
```

`personId` is never the display name. Rename does not change identity.

Lifecycle: create → `ACTIVE`. Retire → `RETIRED`. No delete. No DRAFT.
Retire is blocked while the person owns an IN_PROGRESS task.

The trusted starting roster is materialized once (`PEOPLE_TRUSTED_WORKFORCE_V1_APPLIED`). After that, database truth wins. Restart does not restore retired skills or reactivate retired people. The owner can add or retire people on `/admin/people` without a code change.

## Task executor

Primary path is Claim-on-Start: the current OperatorSession Person becomes
`assignedExecutor` in the same mutation that moves the task to `IN_PROGRESS`.

Compatibility/manual assignment (`POST .../executor`) may still preassign a Person.
Only that Person may then Start; others cannot steal the reservation.

An ExecutionTask may persist:

```text
assigned_executor_id
assigned_executor_label
```

Provider remains independent. People cannot bypass a missing REQUIRED provider.
A manual task still needs an eligible executor. It does not need a Machine or Workcenter.

A PLANNED Start / claim revalidates current eligibility.
After Start, the executor is historical execution fact.

## Historical attribution

While `PLANNED`, the read projection may overlay the live display name.
At Claim-on-Start, the then-current display name is frozen on the task.
Retirement after Start does not erase the persisted identity.
Only the same Person may Complete (V1).

## What this is not

Not HR, Pontaj, payroll, contract, department, attendance, shifts, scheduling, or capacity.
Not RBAC / UserAccount. PIN session ≠ Pontaj.
Skills and operational availability are owned by the People + Skills canon.
