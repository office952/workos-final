# Commercial Execution Workspace V1

Turns the persisted ExecutionPlan into an operator job workspace.

## Decision

Product page keeps commercial progression and hands off with **Deschide execuția**.
Task work lives on generic `/execution/:planId`.
Same workspace for commercial Order releases and atelier / pilot plans.

```text
Product page
  → Deschide execuția
  → /execution/:planId
```

Not a dashboard. Not a second execution engine. Not a LETTERS route.

## UI

Tasks are grouped: Acum / următorul, Blocate, Urmează, Finalizate, then honest atelier gaps.
QC / uniformitate / ambalare remain **Necesită configurare atelier**.
Preview is hidden after a persisted plan exists.
No customer price on the execution screen.

## Golden

60 mm none/none still has 12 tasks, 9 executable, 3 provider gaps.
Reload preserves assignment, start, complete and actuals.

## Screenshots

1. `letters-execution-workspace-handoff.png` — product page → Deschide execuția
2. `letters-execution-workspace-initial.png` — workspace, 0 started
3. `letters-execution-workspace-next.png` — next / startable task
4. `letters-execution-workspace-blocked.png` — blocked task explanation
5. `letters-execution-workspace-assigned.png` — assigned provider
6. `letters-execution-workspace-in-progress.png` — În lucru
7. `letters-execution-workspace-completed.png` — Finalizat
8. `letters-execution-workspace-actuals.png` — consum real
9. `letters-execution-workspace-gap.png` — QC / pack gap
10. `letters-execution-workspace-narrow.png` — 390px
