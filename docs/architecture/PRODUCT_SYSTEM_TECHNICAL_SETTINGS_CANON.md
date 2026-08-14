# Product System technical settings

Canonical current architecture. Runtime wins if this document disagrees.

## TECHNICAL SETTINGS SINGLE-TRUTH LAW

For any adjustable technical or business parameter:

1. There is one canonical active value.
2. It has a clear owner.
3. It has a typed identity.
4. It has a unit where relevant.
5. Its source and classification are visible.
6. It can be projected to Product System UI.
7. Calculation code consumes it.
8. Documentation does not become runtime authority.
9. Intake does not administer it unless it is truly order-specific.
10. Old duplicate sources must be retired when canonical ownership exists.

Active technical values live in canonical settings.
Documentation explains them.
Calculation code consumes them.
Intake does not administer them.

## COMPONENT-FIRST CALCULATION LAW

Product owns composition.
Component owns calculation.
ProductAggregate orchestrates. It does not own adjustable technical values.

## OWNERSHIP

| Fact | Owner |
|---|---|
| Adjustable reusable technical parameters | Product System / component technical settings |
| Quantity formulas | Component calculation contract |
| Order-specific inputs (inscription, finish, confirmed area/perimeter) | Intake / ProductDefinition / ProductTruth |
| Immutable product identity (materials, lighting mode) | ProductTemplate |
| Resource rates and purchase cost | Resources / Cost |
| Explanation, provenance, lifecycle | Documentation |

## WHAT IS NOT A SETTING

Software implementation constants stay in code (unit conversion, hash seeds, layout breakpoints).

Do not interpret this law as “every code constant needs a UI field.”

Only legitimately adjustable technical or business parameters belong here.

## CURRENT CANONICAL ACTIVE CONFIGURATION

Display labels are persisted. Technical setting values are still typed canonical configuration.

LED pitch and PSU reserve are not writable in this persistence slice.

Future transition, without rewriting component calculations:

```text
typed canonical settings
→ persistent / versioned owner settings
→ controlled UI editing
```

Future administration:

```text
OWNER
→ Product System
→ Component variant
→ Setări tehnice
→ Edit
→ Validate
→ Save new configuration / version
→ Component calculations consume the new active version
```

Normal setting changes must not require code modification. That lifecycle is not implemented yet.

## FIRST SETTINGS

`LIGHTING_FRONT_LED` is a constructive lighting type, not the LIGHTING role itself.

Variant `LIGHTING_FRONT_LED` currently has two settings:

- `ledPitchMm` — Pas module LED — resolved, configurable, owner-confirmed, 100 mm
- `psuReservePercent` — Rezervă sursă de alimentare — resolved, configurable, owner-confirmed, 25 percent

The active numeric value lives in the typed domain setting, not in this document.

The Product System administration foundation projects these settings onto `/components`. It does not own a second settings registry.

The Lighting calculator consumes these settings. It does not hardcode 25 or 1.25.

LIGHTING calculation is PARTIAL. Settings are resolved. LED module quantity, LED load, and physical PSU selection remain unavailable until geometry, module watts, and a PSU catalog exist. Minimum PSU capacity is calculated only when LED load is known.

## SYSTEM RETIREMENT PRINCIPLE

When a new canonical Product System setting replaces an older active source:

1. Trace consumers.
2. Migrate consumers.
3. Verify behavior.
4. Remove the old active source.
5. Preserve historical evidence only if useful.
6. Update canonical documentation.
7. Do not keep compatibility “just in case.”

## DOCUMENTATION IS EXPLANATION, NOT VALUE AUTHORITY

Docs may say that LED pitch is controlled by `LIGHTING_FRONT_LED` technical settings.
Docs must not be the only place where the current active value lives.
