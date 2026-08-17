# People + Skills operational truth canon

Canonical current law for configurable People, Skills and operational eligibility.
Runtime wins if this document disagrees.

## Dynamic roster

The trusted starting roster is initial state, not eternal product truth.

```text
8 people today  →  12 in three months  →  7 next year
```

Add, retire, assign skills and change availability without a code change.
Do not keep `const PEOPLE = [...]` or `ELIGIBLE_CNC = ["Florin", "Andrei"]` in product logic.

## One-time trusted bootstrap

```text
TRUSTED_PEOPLE / TRUSTED_SKILLS  =  one-time bootstrap evidence
FINAL DATABASE                   =  current authority after bootstrap
```

Materialization runs once, then persists `PEOPLE_TRUSTED_WORKFORCE_V1_APPLIED`.
Restarting the API is observational. It must not restore a retired skill, reactivate a retired person, or overwrite availability.

An already-materialized database receives the marker without reasserting skills.

## Three truths

```text
Person                     who the human is
Skill assignment           what they are qualified to do
Operational availability   can they be considered for work now
```

```text
Person  ≠  employment lifecycle  ≠  skill  ≠  availability  ≠  executor
Person  ≠  Provider
Skill   ≠  CapabilityClass
Skill   ≠  application permission / RBAC
Availability  ≠  Pontaj
```

CapabilityClass stays the operation requirement. Skill is the human qualification.
A CNC task can require a CNC machine and a CNC-skilled person. Those remain independent.

## Eligibility

Current eligibility is derived in domain/backend:

```text
ACTIVE
+ AVAILABLE
+ any mapped ACTIVE skill that is itself ACTIVE
```

```text
UNMAPPED CAPABILITY  ≠  ANY PERSON
```

A capability with no human-skill mapping is unresolved. Eligible people = none.
Absence of mapping is not “no qualification required”. That would need explicit future truth.

METAL_CUTTING, LASER_CUTTING and STYRO_CUTTING stay unmapped until owner-confirmed evidence exists.

Frontend does not invent eligibility rules.

Vacation / temporary unavailability removes the person from current eligibility.
It does not retire the person and does not destroy skills.
Leaving the company retires the person. History remains. No delete.

## Execution

ExecutionPlan freezes required work and required capability. It does not freeze the employee roster.

```text
PLANNED      eligibility is current truth at Assign and at Start
IN_PROGRESS  executor is historical execution fact
```

Assign and Start both reuse the same resolver.
If the assigned person is no longer eligible, Start is blocked. The assignment is not silently deleted.
After Start, later unavailability or skill removal does not cancel, unassign, or rewrite the task. Completion remains possible.

Claim-on-Start consumes this resolver at the same transactional boundary as Start.
See `docs/architecture/OPERATOR_IDENTITY_CLAIM_ON_START_CANON.md`.

## What this is not

Not HR, Pontaj, payroll, documents, scheduling, capacity, reservations or purchasing.
Not Auth ↔ Person binding.
Not task takeover or reassignment after Start.
