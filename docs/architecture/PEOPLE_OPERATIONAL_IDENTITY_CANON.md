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
Person is the human who may be assigned to execute or confirm a task.
This build has no login, so Complete does not mean “finalizat de utilizatorul autentificat”.

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

An ExecutionTask may persist:

```text
assigned_executor_id
assigned_executor_label
```

Assignment is an explicit operator action. It is not inferred from provider, browser user, machine, or snapshot.

Only currently eligible people may be newly assigned when a capability mapping exists.
A PLANNED Start revalidates the same current eligibility. After Start, assignment is locked.

Start requires completed dependencies, a currently eligible executor, and a valid provider only when the frozen operation requires one.

People cannot bypass a missing provider on a provider-required task.
A manual task still needs an ACTIVE executor. It does not need a Machine or Workcenter.

## Historical attribution

While `PLANNED`, the read projection may overlay the live display name.
At Start, the then-current display name is frozen on the task.
Retirement after Start does not erase the persisted identity or block Complete.
Full historical freeze of executor identity belongs to Claim-on-Start.

## What this is not

Not HR, Pontaj, payroll, contract, department, attendance, shifts, scheduling, or capacity.
Not an authentication system.
Skills and operational availability are owned by the People + Skills canon, not by Pontaj.
