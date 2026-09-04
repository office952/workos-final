# UI20-R1 — Form-as-application

Surfaces: Configurator · Request intake · Operational Services.

```text
FORM_DIRECTION_COUNT = 4
FORM_RECOMMENDATION = NOT_OWNER_CLOSED
```

| Code | Model | Orientation | Speed | Error prevention | Density | Next-action | Mobile |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A Classic form | Label / field / save | Weak on long objects | Fast for 3 fields, slow for construction | Easy to miss a silent role | High waste or high scroll | Save is not a job | Stacks; loses section map |
| B Progressive sections | Complete / current / waiting | Strong | Medium | Good — closed sections stay closed | Medium | Clear “next section” | Best of the four on phone |
| C Context lens | Selection owns the fields | Strong if spine is visible | Fast for experts | Excellent if unselected stays silent | High useful density | Action Morph | Hard: spine + lens fight 768 |
| D Construction-driven | Tree / footing / relation | Strong for Product System | Fast once learned | Best for role silence | High | Confirm definition | Needs a different 768 (list of parts, not tree) |

## Measure, do not assume

A3.1 assumed D/C wins for Product System. That may be true **only** for construction objects.

| Surface | Likely better lab | Why |
| --- | --- | --- |
| Configurator | C or D | Object has parts; selection should own settings |
| Request intake | B | Facts are sequential completeness, not a tree |
| Operational Services | B + C | Capabilities are selected modules; each selected module is a section or a lens, never a classic dump |

**Independent Cursor opinion (not Owner close):** do not pick one form model for the whole OS. Classic form is the default reject. Progressive sections are the default for intake. Context lens / construction is the default for Product System and Configurator — if and only if 768 has its own floorplan.

Figma: Floorplan Lab page, form comparison board (R1).
