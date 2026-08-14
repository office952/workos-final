# Product System component configuration

Canonical current law. Runtime wins if this document disagrees.

## ROLE ≠ TYPE ≠ CONFIGURATION

```text
COMPONENT ROLE
→ CONSTRUCTIVE TYPE
→ PRODUCT / ORDER CONFIGURATION
→ MATERIAL / RESOURCE REFERENCE
→ TECHNICAL SETTINGS
→ CALCULATION
```

A role answers what function the component performs. It does not freeze one material, thickness, color, or technology.

FACE, VOLUME, BACK, and LIGHTING are roles.

Plexiglas, Aluminium, Forex, and front LED modules are constructive types.

Thickness, optical property, depth, and applied finish are configuration.

## CALCULATION LAW

The component type owns calculation.

The product owns composition and allowed/fixed configuration.

Do not create one calculator per thickness, color, or finish unless the constructive contract is genuinely different.

## ATTRIBUTE OWNERSHIP

| Ownership | Meaning | Intake |
|---|---|---|
| FIXED_BY_PRODUCT | ProductTemplate locks it | hidden |
| CONFIGURABLE_BY_ORDER | Form may expose it | only if this product allows it |
| MATERIAL_IDENTITY | Inherent material property | not a finish field |
| MEASUREMENT | Product Truth | operator confirms |
| TECHNICAL_SETTING | Reusable system parameter | never Intake |

Applied vinyl/paint color is not the same fact as inherent material color or optical type.

## CURRENT LIVE TYPES

| Role | Type | Current product configuration |
|---|---|---|
| FACE | `PLEXIGLAS_FACE` | 3 mm, opal |
| VOLUME | `ALUMINIUM_VOLUME` | 0.6 mm; depth/finish by order |
| BACK | `FOREX_BACK` | 10 mm |
| LIGHTING | `LIGHTING_FRONT_LED` | technology fixed; LED pitch / PSU reserve are settings |

Product code `PRD-LETTERS-FRONTLIT-PLEXI-AL06` is unchanged.

## SETTINGS BOUNDARY

LED pitch and PSU reserve stay technical settings on `LIGHTING_FRONT_LED`.

Material, thickness, depth, area, and rates are not technical settings.

## RESOURCE BOUNDARY

Configuration resolves to a resource identity. Resources own the rate.

Current FACE resource `plexiglas_face_3mm` is the 3 mm opal sheet. It is still too coarse for a full materials catalog. Do not invent SKUs here.
