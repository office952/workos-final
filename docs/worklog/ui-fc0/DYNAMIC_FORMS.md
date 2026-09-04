# UI-FC0 — dynamic form study

```text
SCHEMA_AUTHORITY = YES
HARDCODE_LETTERS_IN_REACT = NO
```

| Surface | Class | Why |
| --- | --- | --- |
| Request detail / intake facts | CONTEXTUAL_FORM_REQUIRED | Request-owned facts + installation; not a generic CRUD form |
| Product configurator | BLUEPRINT_DRIVEN_FORM | Schema + `isFieldVisible` + `selectedComponentIds`. Floorplan should follow ROLE, schema stays authority |
| Operational Services | GENERIC_FORM_OK | One Owner mode select + save |
| Date firmă | GENERIC_FORM_OK | Focused legal identity |
| People / skills eligibility preview | PROGRESSIVE_DISCLOSURE_REQUIRED | Preview is honest; do not turn it into pontaj |

## Configurator ROLE navigator (conceptual)

FACE / VOLUME / BACK / LIGHTING are **roles from template composition**, not React literals.

Interaction states driven by compile/confirm projections:

| State | Source |
| --- | --- |
| default | section visible, no compile |
| section selected | operator focus; UI-only |
| section complete | compile readiness for that selected component |
| needs input | required visible fields empty |
| blocked | compile blockers |
| review | reviewed definition panel |
| confirmed | confirmed snapshot |

Unselected role = silent (no navigator item, or collapsed empty — not a disabled fake module).

Motion: restrained; honor `prefers-reduced-motion`. Not specified as a library.

```text
DYNAMIC_FORM_PAGES_STUDIED = 4
DYNAMIC_FORM_STATUS = STUDIED_NOT_IMPLEMENTED
```
