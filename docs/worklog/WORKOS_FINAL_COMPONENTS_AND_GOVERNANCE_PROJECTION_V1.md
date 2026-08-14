# WORKOS_FINAL_COMPONENTS_AND_GOVERNANCE_PROJECTION_V1

TASK = Owner-facing read-only projections for components and governance

BASELINE = 842ac3cd3a4222fe564496c5484d65bc2f9c6bdd

## Projection architecture

```text
domain contracts / templates / governance records
→ API /api/components and /api/governance
→ Romanian owner UI
```

UI does not invent architecture. Pages are not editable registries.

## Components page

Route: `/components`
Nav: Module și componente

Roles and variants come from `listComponentContracts()` + `productTemplates`.
Products-using a variant are derived from template composition.
LIGHTING gaps come from the lighting contract profile.

## Governance page

Route: `/governance`
Nav: Guvernanța sistemului

One domain source: `projectSystemGovernance()`.
Freeze = PLANNED, not active.
Commercial / Execution / Analyzer = NOT_IMPLEMENTED.
Capability kernel remains PLANNED (IDs frozen); shown only as secondary detail.

## UI plan

- Four Romanian nav items
- Catalog: Familie / Categorie / Produs cards; empty categories muted
- Review: form hidden; explicit Modifică
- Components and governance: cards, not nested bullet trees

## Cleanup

- No dead RETURN_CANT operator path
- Resource id `return_cant_forming` retained as identity
- Historical worklogs preserved and classified in `docs/README.md`
- Canonical docs updated to current navigation and component-first truth

## Screenshots

- `docs/worklog/screenshots/owner-surfaces-system-status.png`
- `docs/worklog/screenshots/owner-surfaces-products.png`
- `docs/worklog/screenshots/owner-surfaces-components.png`
- `docs/worklog/screenshots/owner-surfaces-governance.png`
- `docs/worklog/screenshots/owner-surfaces-configure.png`
- `docs/worklog/screenshots/owner-surfaces-review.png`
- `docs/worklog/screenshots/owner-surfaces-confirm.png`

## Limitations

- Governance is a projection, not an enforcement engine
- Freeze is documented as planned only
- Capability kernel statuses stay PLANNED by design
