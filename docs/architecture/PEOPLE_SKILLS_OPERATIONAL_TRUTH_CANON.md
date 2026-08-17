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
+ (if the capability is mapped) any mapped ACTIVE skill that is itself ACTIVE
```

Unmapped capabilities (METAL_CUTTING, LASER_CUTTING, STYRO_CUTTING) stay ACTIVE + AVAILABLE.
Frontend does not invent eligibility rules.

Vacation / temporary unavailability removes the person from current eligibility.
It does not retire the person and does not destroy skills.
Leaving the company retires the person. History remains. No delete.

## Execution

ExecutionPlan freezes required work and required capability. It does not freeze the employee roster.
The executor selector uses the current resolver.
Assign rejects an unavailable or currently ineligible person.
Start still requires the already-assigned ACTIVE executor.
Availability or skill changes do not rewrite IN_PROGRESS or COMPLETED tasks.
Retire is blocked while the person owns an IN_PROGRESS task.

Claim-on-Start is next. It will consume this resolver. It is not implemented here.

## What this is not

Not HR, Pontaj, payroll, documents, scheduling, capacity, reservations or purchasing.
Not Auth ↔ Person binding.
Not task takeover or reassignment after Start.
