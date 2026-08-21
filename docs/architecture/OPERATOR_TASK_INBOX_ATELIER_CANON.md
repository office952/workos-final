# Operator Task Inbox / Atelier canon

Status: IMPLEMENTED_CURRENT / BASIC  
Owner GO: `WORKOS_FINAL_OPERATOR_TASK_INBOX_V1`

## Ownership

| Concern | Owner |
| --- | --- |
| Task state | ExecutionTask |
| Who may start now | People / Eligibility |
| Current actor | OperatorSession |
| Cross-job discovery UI | Atelier (projection only) |

**Atelier owns no truth.** It does not create TaskQueue, Assignment, Dispatch, Job entity, priority, or schedule.

## Surfaces

- Top-nav **Atelier** → `/atelier` (operator page lead: **Munca mea**)
- Administrare → group labeled “Atelier” remains workshop **configuration** (Resurse / Stoc / Procese / Utilaje). Different meaning.

Lucrări remains Order-rooted job orientation. Atelier is cross-job current-operator task orientation.

## Read model

`GET /api/operator-task-inbox` reads the HttpOnly OperatorSession cookie only.
No `?personId=`. No mutation authority.

Backend projects open ExecutionPlans (`PLANNED` / `IN_PROGRESS` tasks) through the same eligibility and Claim-on-Start readiness helpers used by the Execution Workspace.

Derived lanes (not persisted):

1. **În lucru la mine** — `IN_PROGRESS` + assignedExecutor = current Person (execution fact survives later skill/availability loss)
2. **Disponibile pentru mine** — person-eligible `PLANNED` work:
   - ready (`canClaimStart`) → **Pornește**
   - provider required but missing → visible, not startable (“Necesită utilaj dedicat…”)
3. **Urmează** — eligible Person, dependencies incomplete

Display order: `plan.createdAt` then `task.seq`.
Disclaimer: *Ordinea de afișare nu reprezintă programare sau prioritate de producție.*

## Claim path

Ready Start from Atelier calls existing:

`POST /api/execution-tasks/:taskId/start`

with the current OperatorSession. No `/api/atelier/claim`. First-wins concurrency unchanged.

Complete and actual consumption stay on `/execution/:planId` (optional `?task=` focus).

## Explicit non-goals

Scheduling, capacity, shifts, auto-assign, priority/deadline engines, notifications, takeover, Pontaj, HR, Documents.
