# Configurable People + Skills V1

Owner GO: `WORKOS_FINAL_PEOPLE_SKILLS_REAL_TRUTH_V1`
Baseline: `9c509db` `feat: add client workspace`

## Problem

Final People is only name + ACTIVE/RETIRED. Execution treats every ACTIVE person as eligible. Legacy has a real initial roster and SK_* qualifications. The roster must be the starting state of a configurable catalog, not a hardcoded eternal list.

## Law

Person ≠ employment lifecycle ≠ skill assignment ≠ operational availability ≠ executor.
Eligibility is derived in domain/backend.
ExecutionPlan freezes required work/capability, never the employee roster.
Claim-on-Start, Auth, Pontaj, salary are out.

## Legacy reconciliation (read-only source)

`C:\Users\offic\workos_app_vs\backend\seeds\seed_operational_workforce_registry.py`
`C:\Users\offic\workos_app_vs\backend\services\operational_catalog.py`

No ambiguous people. Exact names, no fuzzy merge. Salary/pontaj not imported.

### People

| LEGACY PERSON | LEGACY ID | LEGACY SKILLS | FINAL MATCH | ACTION | CONFLICT |
|---|---|---|---|---|---|
| Calin Cimpean | name key in seed | graphic, quoting, print, laminator, cutter | none expected | CREATE `per:legacy:calin-cimpean` | none |
| Octavian Dumitru | name key | same as Calin | none | CREATE `per:legacy:octavian-dumitru` | none |
| Florin CNC | name key | CNC operator, CNC prep, letter cant | none | CREATE `per:legacy:florin-cnc` | none |
| Putaru Sandu | name key | locksmith, assembly, vinyl, electrician, field | none | CREATE `per:legacy:putaru-sandu` | none |
| Vali Colantator | name key | assembly, vinyl, electrician, field | none | CREATE `per:legacy:vali-colantator` | none |
| Costi Modelator | name key | assembly, vinyl, electrician, field, letter modeling | none | CREATE `per:legacy:costi-modelator` | none |
| Andrei Goghi | name key | assembly, vinyl, electrician, field, CNC operator | none | CREATE `per:legacy:andrei-goghi` | none |
| Chirila Cristian | name key | commercial tech, quoting | none | CREATE `per:legacy:chirila-cristian` | none |

If an exact `displayName` already exists with a different id: attach skills, do not duplicate.
If `per:legacy:*` exists: idempotent skip/create-assignments-only.

### Skills (import only those used by current employees)

All 15 `OPERATIONAL_SKILLS` codes. ACTION = REUSE code, Romanian display label from legacy.

### Capability mapping (no second taxonomy)

CapabilityClass stays the operation requirement. Skill stays human qualification.
Persisted `capability_skill_requirements` (OR if several rows).

| CapabilityClass | Skill | ACTION |
|---|---|---|
| CNC_ROUTING | SK_CNC_OPERATOR | MAP |
| PROFILE_FORMING | SK_LETTER_CANT_OPERATOR, SK_LETTER_MODELING | MAP (OR) |
| MANUAL_ASSEMBLY | SK_ASSEMBLY | MAP |
| VINYL_APPLICATION | SK_VINYL_APPLICATOR | MAP |
| ELECTRICAL_ASSEMBLY | SK_ELECTRICIAN | MAP |
| PRINTING | SK_PRINT_OPERATOR | MAP |
| LAMINATION | SK_LAMINATOR_OPERATOR | MAP |
| PLOTTER_CUTTING | SK_CUTTER_OPERATOR | MAP |
| WELD_STEEL | SK_LOCKSMITH | MAP |
| WELD_ALUMINIUM | SK_LOCKSMITH | MAP |
| RIGID_FILM_LAMINATION | SK_VINYL_APPLICATOR | MAP |
| PAINTING | SK_ASSEMBLY | MAP (legacy alias) |
| QUALITY_CONTROL | SK_ASSEMBLY | MAP (legacy used assembly; no invented QC skill) |
| PACKAGING | SK_ASSEMBLY | MAP (same) |
| METAL_CUTTING, LASER_CUTTING, STYRO_CUTTING | — | DEFER |
| SK_QUOTING, SK_COMMERCIAL_TECH, SK_GRAPHIC_DESIGN, SK_CNC_PREP, SK_FIELD_INSTALLER | no shop-floor CapabilityClass | KEEP_SEPARATE |

Unmapped capability → ACTIVE + AVAILABLE (do not invent a skill).
Mapped capability → ACTIVE + AVAILABLE + active assignment of any mapped active skill.

## Model

- Person: keep ACTIVE/RETIRED. Add AVAILABLE / TEMPORARILY_UNAVAILABLE, optional reason/until (informational), optional roleLabel, provenance, timestamps.
- Skill: skillId, code, displayLabel, status, optional description.
- PersonSkillAssignment: personId, skillId, ACTIVE/RETIRED, assignedAt, retiredAt.
- No JSON blob. No Contact/HR/leave engine.

Retire blocked if person owns an IN_PROGRESS task (`has_active_task`). Availability/skill changes do not mutate tasks.

## API (Customer-style, People family)

`GET/POST /api/people`, `GET/PATCH /api/people/:personId`, skill assign/remove, `GET/POST /api/people/skills`, `PATCH /api/people/skills/:skillId`, `GET /api/people/eligibility?capabilityId=`.
No `/api/employees-v2`.

## UI

`/admin/people` list. `/admin/people/skills` catalog. `/admin/people/:personId` editor.
Subnav: Angajați | Skill-uri. No payroll fields.

## Execution

Selector uses resolver when mapping exists. Provider remains independent.
Start still requires assigned ACTIVE executor; already IN_PROGRESS tasks are not rewritten.
Historical Start still freezes `assigned_executor_label`. Rename of PLANNED live label stays current behavior; full freeze belongs to Claim-on-Start.

## Tests / evidence

Domain eligibility (Florin vacation → Mihai join → return → skill remove).
Persistence of catalog/assignments. Legacy roster assertions. Eligibility API. Execution regression. Runtime screenshots.
