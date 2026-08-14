# WORKOS_FINAL_COMPONENT_CONFIGURATION_MODEL_REALIGNMENT_AND_CLEANUP_V1

BASELINE = 41d1f29294500e40fbba71f0ebc1d62fce10d4de

## Problem

Admin foundation treated FACE_PLEXIGLAS_3MM as if FACE were permanently Plexiglas 3 mm. Same conflation on VOLUME and BACK.

## Owner clarification

Roles are stable functions. A role may be realized by multiple constructive types and configurations. Do not persist the coarse model.

## Corrected model

ROLE → TYPE → CONFIGURATION → RESOURCE → TECHNICAL SETTINGS → CALCULATION

## ID decisions

| Old ID | Decision | Why |
|---|---|---|
| FACE_PLEXIGLAS_3MM | MIGRATE → `PLEXIGLAS_FACE` | conflated type + thickness |
| VOLUME_ALUMINIUM_06 | MIGRATE → `ALUMINIUM_VOLUME` | conflated type + thickness |
| BACK_FOREX_10MM | MIGRATE → `FOREX_BACK` | conflated type + thickness |
| LIGHTING_FRONT_LED | KEEP | valid technology type |
| PRD-LETTERS-FRONTLIT-PLEXI-AL06 | KEEP | stable product identity |

No compatibility aliases.

## Current FACE truth

Runtime now carries `face.opticalType = opal`. Identity fact: Plexiglas 3 mm opal. Resource label updated. No invented SKU.

## Cleanup

Retired thickness-baked variant IDs, `variantId` on composition, and static contract `resourceIds`. Historical worklogs left as evidence.

## Remaining gaps

- `plexiglas_face_3mm` still encodes thickness in the resource id
- no 5 mm / Forex 5 mm live resources
- aluminium profile is still generic vs depth-specific
- no persistence / write path

## Next write path

After this correction: persist **display-label rename** remains lowest risk.

Do not persist thickness-baked variant IDs. If the first write is a setting, persist `LIGHTING_FRONT_LED` + `ledPitchMm` with versioning.
