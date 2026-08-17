# People + Skills real truth V1

Configurable People, Skills and current operational eligibility.

## Decision

The trusted roster is starting state, not a hardcoded product list. Person, skill assignment and operational availability stay separate. CapabilityClass remains the operation requirement. ExecutionPlan freezes required work, not the employee roster.

```text
ACTIVE + AVAILABLE + mapped skill  →  currently eligible
```

Vacation keeps identity and skills. Leaving the company retires the person. A new employee can be added without a code change.

## Evidence

`docs/worklog/screenshots/people-overview.png`
`docs/worklog/screenshots/person-skills.png`
`docs/worklog/screenshots/person-temporarily-unavailable.png`
`docs/worklog/screenshots/skill-catalog.png`
`docs/worklog/screenshots/eligibility-before.png`
`docs/worklog/screenshots/eligibility-after-unavailable.png`
`docs/worklog/screenshots/new-employee-eligible.png`
`docs/worklog/screenshots/people-narrow.png`

## Outside this build

Auth ↔ Person, Claim-on-Start, Pontaj, salary, HR, documents, scheduling, capacity.
