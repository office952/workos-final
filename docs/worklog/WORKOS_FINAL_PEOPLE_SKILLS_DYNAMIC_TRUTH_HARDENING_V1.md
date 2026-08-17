# People + Skills dynamic truth hardening V1

Correct-first after GitHub review of `ad6fbcb`.

## Decision

Trusted legacy seed is one-time bootstrap. After `PEOPLE_TRUSTED_WORKFORCE_V1_APPLIED`, operator-managed DB truth wins.

An already-materialized database (all eight trusted people present, marker missing) receives the marker only. It does not walk `TRUSTED_PEOPLE` again or recreate retired assignments.

PLANNED Start revalidates current eligibility. IN_PROGRESS keeps the executor as execution fact.

Unmapped capability ≠ any person. Absence of a human-skill mapping is `CAPABILITY_UNMAPPED`, not “anyone may do this”.

## Capability mapping review

Source: read-only legacy `seed_operational_workforce_registry.py` (previous WorkOS, not copied).

| Capability | Decision | Evidence |
|---|---|---|
| METAL_CUTTING | leave unmapped | machines exist; no `required_skill_codes` |
| LASER_CUTTING | leave unmapped | machines exist; no `required_skill_codes` |
| STYRO_CUTTING | leave unmapped | machines exist; no `required_skill_codes` |
| PAINTING → SK_ASSEMBLY | keep | legacy maps those operations to SK_ASSEMBLY |
| QUALITY_CONTROL → SK_ASSEMBLY | keep | same explicit legacy mapping |
| PACKAGING → SK_ASSEMBLY | keep | same explicit legacy mapping |

No guessed mappings were added.

## Evidence

`docs/worklog/screenshots/people-skill-removal-before-restart.png`
`docs/worklog/screenshots/people-skill-removal-after-restart.png`
`docs/worklog/screenshots/execution-start-blocked-unavailable.png`
