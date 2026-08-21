# MACHINE_STRICT_MANUAL_WORK_AREAS_FLEXIBLE_V1

Owner GO: 2026-08-21. Final QA + isolated commit authorization:
`MACHINE_STRICT_MANUAL_WORK_AREAS_FLEXIBLE_FINAL_QA_AND_COMMIT_V1`.

## Scope

Variant A only: set `providerRequirement: "NOT_REQUIRED"` on the six LETTERS manuals that previously omitted the field. Keep omitted → `REQUIRED`. Do not invent table scheduling, optional provider assignment, Machine Admin, Cloud allowlist, or schema.

## Owner decision

```text
DEDICATED_MACHINE = STRICT
MANUAL_TABLE_OR_AREA = FLEXIBLE
OPERATOR_SKILL = STRICT
TASK_DEPENDENCIES = STRICT
DEFAULT_OMITTED_PROVIDER_REQUIREMENT = REQUIRED
STRICT_MACHINE_TASKS = 3/12
FLEXIBLE_MANUAL_TASKS = 9/12
DISTINCT_STRICT_MACHINES = 2
```

Assigning a physical provider onto a `NOT_REQUIRED` task stays `ineligible_provider`.

## Files

Runtime production change:

- `packages/domain/src/processes/catalog.ts`
- `apps/api/src/product.ts` — assign-provider/executor responses now keep the current operator on the returned plan view, so Start does not disappear after Alocă. Observed in browser QA; start/complete already did this.

Tests / projections of the same truth:

- domain execution / catalog / frozen-input tests
- API `product`, `jobs`, `persistence`
- web Processes admin test
- e2e golden-path, preview, minimal-task, processes-admin, jobs helper

Canon / agent notes:

- `docs/architecture/EXECUTION_PLAN_AND_TASKS_CANON.md`
- `AGENTS.md`
- `docs/plans/2026-08-21-machine-strict-manual-work-areas-flexible-plan.md` (pre-GO plan; kept, marked executed)

## Matrix 3/12 and 9/12

```text
CUT_SHEET_CNC FACE              REQUIRED
CUT_SHEET_CNC BACK              REQUIRED
FORM_ALUMINIUM_PROFILE          REQUIRED
BOND_LETTER_BODY                NOT_REQUIRED
PLACE_LED_MODULES               NOT_REQUIRED
WIRE_LIGHTING                   NOT_REQUIRED
INSTALL_OR_CONNECT_PSU          NOT_REQUIRED
TEST_LIGHTING_IGNITION          NOT_REQUIRED
CLOSE_LETTER_BODY               NOT_REQUIRED
TEST_ILLUMINATION_UNIFORMITY    NOT_REQUIRED
INSPECT_FINISHED_LETTER         NOT_REQUIRED
PACK_PRODUCT                    NOT_REQUIRED
```

Machines: CNC 4020 for both sheet cuts; CNC Cant Litere for forming.

## Tests

```text
packages/domain                              360/360 PASS
API product                                  28/28 PASS
API jobs/persistence/inbox/eligibility       22/22 PASS
web Processes/preview/ExecutionPlan/workspace 24/24 PASS
typecheck                                    PASS
build                                        PASS
git diff --check                             PASS
lint                                         PREEXISTING_FAILURE
e2e preview + processes-admin                PASS
e2e golden-path + minimal-task               2/2 PASS (--retries=0)
```

Lint errors are unused-vars / no-undef / hook warnings in customers, attachments, inbox.ts, atelier-runtime-fixture, and unrelated React files. None are in this change set.

Updated tests prove 3/12 require a provider, 9/12 do not, CNC/form stay blocked without a machine, a skilled operator can start a manual without a table, missing skill stays `ineligible_executor`, incomplete deps stay `dependencies_incomplete`, and assign on a manual stays `ineligible_provider`.

## Browser runtime

Isolated single-plane DEV, no Cloud root, no HUB MEDIA data:

```text
WORKOS_DATA_DIR = .tmp/machine-strict-qa
API = http://127.0.0.1:8811
UI  = http://127.0.0.1:5191
FIXTURE = QAMS21
PLAN = exp:aps:PRD-LETTERS-FRONTLIT-PLEXI-AL06:a612931898b7253f8f480c9f3b086816c12c552e8179911d189846bcb1efb76e
OPERATOR_SKILLED = QA Machine Strict / per:1b9d553e-326b-4d3e-9373-49de6d946c21
OPERATOR_UNSKILLED = QA Fara Skill / per:f743f379-0e6a-42f3-b220-85a2fd2ac6df
```

Click path:

1. `/` → Produse → LETTERS product → fill none/none 60 mm `QAMS21` → Verifică → Confirmă
2. Detalii interne → Previzualizare producție (12 ops)
3. Atelier / test tehnic → Acceptă pentru producție → Creează planul de execuție → Deschide execuția
4. Identifică QA Machine Strict
5. Alocă CNC 4020 on BACK; FACE/FORM remain blocked without machine
6. Complete BACK; LED shows Pornește without Masa/LED post
7. Schimbă → QA Fara Skill → LED: „Nu ești eligibil acum”
8. Restore skilled → Pornește LED without table
9. `/atelier` → LED în lucru; only FACE CNC + FORM in „Necesită pregătire atelier”
10. `/admin/processes` Asamblare → Lipire: Nu necesită utilaj dedicat
11. `/admin/workcenters` Asamblare → Masa 1 / Masa 2 remain catalog zones
12. `/governance` — no stale 9/12 provider claim

`/` stays empty: this fixture used the compatibility atelier snapshot, not a commercial Order. Lucrări lists commercial Orders only.

API proofs on the same fixture:

```text
LED assign WC_LED_ASSEMBLY     422 ineligible_provider
BOND assign WC_ASSEMBLY_01     422 ineligible_provider
FORM assign WC_ASSEMBLY_01     422 ineligible_provider
unskilled LED start            422 ineligible_executor
FACE CNC start no machine      422 missing_assignment
FORM start no machine          422 missing_assignment
skilled LED before BACK done   409 dependencies_incomplete
```

## Screenshots

Evidence pack: `docs/worklog/screenshots/machine-strict-v1/`

- `01-jobs-list-empty.png`
- `02-execution-plan-preview.png`
- `03-execution-workspace-planned.png`
- `04-machine-start-blocked.png`
- `05-back-cnc-in-progress-face-blocked.png`
- `06-led-startable-without-table.png`
- `07-led-unskilled-blocked.png`
- `08-led-started-without-table.png`
- `09-atelier-inbox.png`
- `10-jobs-list-no-commercial-order.png`
- `11-processes-bond-not-required.png`
- `12-workcenters-tables-remain.png`
- `13-governance.png`

## What did not change

ProductDefinition, ProductAggregate, EIC, pricing, Quote, Acceptance, Order, Production Release, inventory, PIN model, People catalog law, skill mapping, task dependencies, `MCH-CNC-4020` identity, Cloud org/owner/allowlist, Machine Admin, DB schema/migrations. `taskRequiresProvider` and omitted → `REQUIRED` stay as they were. Historical snapshots keep their frozen provider flags.

## Rollback

```text
revert commit
```

No migration, no DB rewrite, no snapshot rewrite, no Cloud data to delete.

## Roadmap impact

One real-job E2E is closer: operators can start the nine manuals without fake table assignment. Provider allowlist for later Cloud shrinks to two machines. Do not start allowlist, HUB MEDIA org, or first Cloud owner from this commit.

## Governance impact

`/governance` does not hardcode the 12-task provider matrix. `AGENTS.md` and `EXECUTION_PLAN_AND_TASKS_CANON.md` now state 3 machine-bound / 9 manual. Older worklogs that said 9/12 provider-strict are stale historical records.

## Dead pieces

Masa 1, Masa 2, and Montaj LED remain catalog identities. They are not Start gates for LETTERS manuals. Do not delete them. Do not activate an allowlist for them. Do not create optional provider assignment. `accepted-production-snapshot` stays compatibility-only.

## UI copy correction (owner required before push)

```text
REQUIRED     = Necesită utilaj dedicat / Alocă utilaj / Alocă mai întâi utilajul
NOT_REQUIRED = Nu necesită utilaj dedicat
```

A zone or table must not appear as a Start gate. Catalog zones stay descriptive.

## 107-file classification (commit 45a378e)

```text
RUNTIME_REQUIRED              2   catalog.ts, product.ts
TEST_REQUIRED                15   domain + API + web Processes
E2E_REQUIRED                  6   preview, golden-path, minimal, processes-admin, helpers
CANON_REQUIRED                3   EXECUTION_PLAN canon, AGENTS.md, plan
WORKLOG_REQUIRED              1   this file
SCOPED_EVIDENCE              13   machine-strict-v1/
GENERATED_BASELINE_REQUIRED   0
UNRELATED / visual noise     69   historical e2e screenshot overwrites
TEMPORARY                     0
```

The 69 historical screenshots were write-only e2e captures, not visual assertions. They are restored to `origin/main` and removed from this commit. Amended commit is 54 files.

## Session fix security

`apps/api/src/product.ts` assign-provider/executor only pass `operatorId` from `resolveOperatorSession(HttpOnly cookie)` into `projectPlanView`. Identity is not read from the JSON body. Assign does not set `assignedExecutor`. The owner who allocates a machine does not become the task operator. Logout/expiry still fail session resolution. Claim-on-Start still requires a valid session and remains fail-closed. Org isolation is unchanged (`requireOwnerRole` still wraps assign).

## Tests after copy fix

```text
packages/domain                              360/360 PASS
API product                                  28/28 PASS
web Processes/preview/ExecutionPlan/Atelier/Jobs 29/29 PASS
typecheck                                    PASS
build                                        PASS
git diff --check                             PASS
lint                                         PREEXISTING_FAILURE (unchanged set)
e2e preview + golden-path + minimal          PASS (--retries=0)
e2e processes-admin                          PASS (--retries=0)
```

## Browser QA after copy

Same isolated fixture `QAMS21` on `8811`/`5191`. Workspace, Atelier, `/admin/processes` Lipire, `/admin/workcenters` Asamblare, `/governance`.

```text
FACE CNC / FORM = Necesită utilaj dedicat + Alocă utilaj + Start blocked
LED IN_PROGRESS = Nu necesită utilaj dedicat, no table
BOND / WIRE / PSU / IGNITION / CLOSE / UNIFORMITY / INSPECT / PACK = Nu necesită utilaj dedicat
Atelier prep (2) = FACE CNC + FORM only; copy = Lipsă utilaj dedicat
```

## Commit

Amended local commit on `feat/machine-strict-manual-work-areas-flexible`. Message unchanged. `PUSH = NO`. Exact hash is the current branch HEAD.

## What remains

`WAIT_FOR_OWNER_GO_PUSH`. Do not start allowlist, HUB MEDIA org, or first Cloud login.
