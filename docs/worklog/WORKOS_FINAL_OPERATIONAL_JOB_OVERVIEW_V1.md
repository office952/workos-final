# Operational job overview V1

Read-only operator landing for real commercial jobs.

## Decision

Order Snapshot is the job root. No Job table. No mutable JobStatus.
Pilot / atelier releases stay out of Lucrări.
`/` is Lucrări. Stare sistem moved to `/system`.

## Projection

`GET /api/jobs` assembles existing Order → optional Release → optional ExecutionPlan.
Stage and next action are derived in domain from those facts.

```text
Comandă creată              → Eliberează pentru producție   → /products/:code?order=
Eliberată pentru producție  → Creează planul de execuție    → /products/:code?order=
Plan de execuție            → Deschide execuția             → /execution/:planId
În lucru                    → Continuă execuția             → /execution/:planId
Finalizată                  → Lucrare finalizată            → /execution/:planId
```

Completed means all required ExecutionTasks are COMPLETED.

## UI

Compact list on desktop, stacked rows at 390px.
One summary line. Four filters. Empty state goes to Produse.
Product `?order=` continues the frozen job without re-confirm.

## Figma

Figma seat is View-only. No new file could be created.
Visual grammar follows the existing WorkOS tokens and people/stock row density.

## Evidence

`docs/worklog/screenshots/letters-jobs-*.png`
