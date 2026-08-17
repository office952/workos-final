# People operational identity canon

Canonical current law for the minimal Person registry used by Execution.
Runtime wins if this document disagrees.

## Core law

```text
Person     ≠  Provider
Person     ≠  authenticated user
Person     =  operational executor identity
```

Provider is the Machine / Workcenter that can perform a required capability.
Person is the human who is assigned to execute or confirm a task.
This build has no login, so Complete does not mean “finalizat de utilizatorul autentificat”.

## Person

```text
personId      stable generated identity  per:{uuid}
displayName   operator-facing name
status        ACTIVE | RETIRED
createdAt
retiredAt     nullable
```

`personId` is never the display name. Rename does not change identity.

Lifecycle: create → `ACTIVE`. Retire → `RETIRED`. No delete. No DRAFT.

The registry may start empty. The owner adds real people on `/admin/people`. There is no seeded employee master-data.

## Task executor

An ExecutionTask may persist:

```text
assigned_executor_id
assigned_executor_label
```

Assignment is an explicit operator action. It is not inferred from provider, browser user, machine, or snapshot.

Only `ACTIVE` people may be newly assigned. After Start, assignment is locked.

Start requires completed dependencies, an ACTIVE executor, and a valid provider only when the frozen operation requires one.

People cannot bypass a missing provider on a provider-required task.
A manual task still needs an ACTIVE executor. It does not need a Machine or Workcenter.

## Historical attribution

While `PLANNED`, the read projection may overlay the live display name.
At Start, the then-current display name is frozen on the task.
Retirement after Start does not erase the persisted identity or block Complete.

## What this is not

Not HR, Pontaj, payroll, contract, department, vacation, attendance, skills, availability, shifts, scheduling, or capacity.
Not an authentication system.
