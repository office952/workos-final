# WorkOS First HF lot UI implementation Wave 3

```text
GO                         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3_CLOUD_LOGIN_ATELIER_IDENTIFICATION_EXECUTION_PVA
BRANCH                     = feat/first-hf-lot-ui-wave3-cloud-login-atelier-execution-pva-v1
BASE                       = a1150edf03b95644ab467c1b5312f84f6a6f50a0
ORIGIN_MAIN                = a1150edf03b95644ab467c1b5312f84f6a6f50a0
CURRENT_MILESTONE          = HUB_MEDIA_CLEAN_PILOT
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_3_REVIEW = PASS
OWNER_DECISION             = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
WAVE_3_GATE                = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED = NO
WAVE_4                     = NOT_STARTED
NEXT_STEP                  = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4_RESOURCES_AND_ADMIN_REUSE_OWNER_GO
SESSION_CONTINUITY         = SAME_CHAT_SAME_WORKTREE
```

## Authority

Owner GO for Cloud login, Atelier, operator identification, execution, and operational planned-versus-actual. Same chat, same worktree. No second worktree. No `move_agent_to_root`. Owner review is `PASS` / `ACCEPTED_WITH_ADVISORIES`. Wave 3 gate is closed. Full first HF lot is not implemented. Wave 4 is not started.

Figma `7elwvIscvMPDiEHrX4f6kQ` was the accepted visual baseline, read-only. This GO did not write to Figma.

```text
ROADMAP_READ        = YES
UI_UX_CANON_READ    = YES
HF_BASELINE_READ    = YES
DIRECTION_CONFLICT  = NO
```

## What this wave implements

1. Cloud gate outside routes: boot, missing config, unauthenticated, authenticating, invalid credentials, session expired, network, logout. Return stays on the current safe path. No `/login` route. No open redirect.
2. Operator identification from Atelier and the shell drawer. PIN is masked. Invalid PIN copy is `PIN greșit.` Cloud identity and operator identity stay separate.
3. Atelier inbox attention order: Blocate → Pot porni acum → În lucru → Urmează. One primary action per row. Completed tasks are not invented; the inbox API still omits them.
4. `/execution/:planId` stays the plan workspace. Job back-link `Înapoi la lucrare` when the snapshot has an order. Financial UI removed from the execution panel.
5. Operational planned-versus-actual: measured / unknown / not-measured. Zero is not used as unknown. No costs.
6. Workshop financial keys remain absent from Atelier and Execution APIs, including Owner in workshop context.
7. Machine Strict and flexible manual areas are unchanged. Eligibility stays server-side. Start is busy-guarded and refetched.

## Route / state matrix

| Route / surface | loading | empty / blocked | populated | error | notes |
| --- | --- | --- | --- | --- | --- |
| Cloud gate (no route) | Se încarcă | Autentificare indisponibilă | Autentificare | Sistemul nu răspunde | session expired copy is not a wrong password |
| `/atelier` | Se încarcă atelierul | Identifică-te / PIN greșit / gol | Blocate, Pot porni, În lucru, Urmează | Atelierul nu a putut fi încărcat | operator expiry keeps Cloud |
| `/execution/:planId` | Se încarcă execuția | Planul cerut nu este disponibil | plan + PvA | Execuția nu a putut fi încărcată | not job detail |
| Operator session | Se verifică operatorul | Identifică-te | Operator in shell once | PIN greșit. | not a Cloud role |

## Cloud versus operator identity

| Fact | Cloud | Operator |
| --- | --- | --- |
| What it is | authenticated user + active organization | person who executes the task |
| How it is proven | email / password HttpOnly cookie | PIN HttpOnly operator cookie |
| Owner login | does not identify an operator | separate Atelier / drawer action |
| Org change | remounts operator provider | previous operator session is invalid |
| Cloud logout | revokes Cloud + operator cookies | cannot replay |
| Operator expiry | Cloud stays | Atelier asks again |
| Cloud role `operator` | not invented | n/a |

## Eligibility matrix

| State | UI | Server |
| --- | --- | --- |
| STARTABLE | Pornește | claim-on-start |
| MACHINE_BLOCKED | Blocate / missing provider | start rejected `missing_assignment` |
| OPERATOR_INELIGIBLE | no Pornește / notice | `ineligible_executor` |
| DEPENDENCY_BLOCKED | Urmează + Așteaptă | `dependencies_incomplete` |
| ALREADY_IN_PROGRESS | Continuă | second start fails or is owned |
| COMPLETED | execution Finalizate + PvA | no start |
| STALE_STATE | refetch after mutation | existing concurrency / versioning |

## Task / provider matrix

| Class | Law | Wave 3 |
| --- | --- | --- |
| FACE CNC, BACK CNC, forming | Machine Strict | cannot start without eligible dedicated machine |
| Other LETTERS operations | manual flexible | not blocked because Masa / LED post is unassigned |
| FACE / BACK | component roles | not machines |
| CUT_SHEET_CNC | operation | not a capability name in operator copy beyond existing labels |
| CNC_ROUTING | capability | eligibility remains capability-driven |
| Auto-assignment | forbidden | not added |

## Control / reaction map

| Control | Reaction |
| --- | --- |
| Intră with valid Cloud credentials | stay on the intended in-app path |
| Intră with invalid credentials | field-associated `Email sau parolă greșită.` Password stays masked |
| Ieși din cont | real Cloud logout; operator cookie cleared |
| Confirmă PIN | operator session; inbox loads |
| PIN greșit | generic error; field cleared; PIN not echoed |
| Schimbă / Ieși operator | Cloud remains |
| Pornește | server start; busy disables second click; refetch |
| Continuă / Deschide lucrarea | `/execution/:planId` |
| Înapoi la lucrare | `/jobs/:orderSnapshotId` when `jobHref` exists |
| Finalizează | existing complete contract; PvA updates from refetch |

## Financial payload proof

```text
ATELIER_FINANCIAL_PAYLOAD   = NONE
EXECUTION_FINANCIAL_PAYLOAD = NONE
OWNER_IN_WORKSHOP_CONTEXT   = NONE
```

Keys `eicTotal`, `grossPrice`, `actualInternalCost`, `internalCost`, `markupPercent`, `marginAmount` are omitted by `scopeExecutionPlanView(..., workshop)` and `omitForbiddenFinancialFields(inbox, "workshop")`. API `financial-access` and `operator-task-inbox` tests assert absence. Wave 3 E2E asserts the same keys are absent from the execution page and the execution-plan JSON.

Job detail remains commercial family (Wave 1 ALT_B_SCOPED). That is not the workshop payload.

## Figma → runtime mapping

File `7elwvIscvMPDiEHrX4f6kQ`, read-only.

| Screen | Known frame | Runtime | State |
| --- | --- | --- | --- |
| Cloud login | `67:3` | AppGate + `LoginPage` | unauthenticated / error / missing config |
| Atelier | `71:395` | `/atelier` | unidentified, PIN, inbox |
| Execution blocked | `71:509` | `/execution/:planId` | machine / dependency blocked |
| Planned versus actual | `71:1089` | same workspace, PvA section | measured + unknown |
| Responsive / dark | `71:713`, `71:1186` | existing shell + theme | 1440 / 1280 / 768, LIGHT / DARK |

Intended diffs: no product scenario switcher; no financial values on workshop surfaces; inbox API has no completed lane; Cloud login is a gate, not `/login`.

## Verification executed

| Gate | Result |
| --- | --- |
| Domain unit | 369 passed |
| API unit | 209 passed after logout replay assertion (`401 invalid_session` without operator) |
| Web unit | 114 passed |
| Typecheck | domain, API, web passed |
| Lint | Wave 3 files: 0 errors, 5 pre-existing fast-refresh warnings. Repo `pnpm lint` still has pre-existing unused-symbol errors outside this wave |
| Web production build | passed |
| Playwright Wave 3 workshop | `hf-wave3-cloud-atelier-execution.spec.ts` 2 passed, retries 0, isolated 8802/5188, `WORKOS_CLOUD_ROOT` unset |
| Playwright Cloud login | `hf-wave3-cloud-login.spec.ts` 2 passed, retries 0, synthetic Cloud fixture |
| Playwright Wave 1/2 regression | foundation + commercial catalog + jobs/quotes/catalog: 6 passed, 1 skipped (jobs empty-state when store already has jobs) |

No axe or extra plugins (`PLUGIN_INSTALLATION = NONE`). Contrast and 44 px judged against the existing semantic tokens and `min-height/min-width: 44px` on login submit, identify, and Atelier actions.

## Screenshots

Synthetic only. No PIN, password, real email, or real person name is published here.

- `docs/worklog/screenshots/hf-wave3-cloud-loading.png`
- `docs/worklog/screenshots/hf-wave3-auth-config-missing.png`
- `docs/worklog/screenshots/hf-wave3-cloud-login.png`
- `docs/worklog/screenshots/hf-wave3-login-error.png`
- `docs/worklog/screenshots/hf-wave3-atelier-unidentified.png`
- `docs/worklog/screenshots/hf-wave3-pin-masked.png`
- `docs/worklog/screenshots/hf-wave3-pin-invalid.png`
- `docs/worklog/screenshots/hf-wave3-atelier-populated.png`
- `docs/worklog/screenshots/hf-wave3-task-startable.png`
- `docs/worklog/screenshots/hf-wave3-operator-ineligible.png`
- `docs/worklog/screenshots/hf-wave3-machine-blocked.png`
- `docs/worklog/screenshots/hf-wave3-execution-blocked.png`
- `docs/worklog/screenshots/hf-wave3-execution-in-progress.png`
- `docs/worklog/screenshots/hf-wave3-completed.png`
- `docs/worklog/screenshots/hf-wave3-pva.png`
- `docs/worklog/screenshots/hf-wave3-light-atelier.png`
- `docs/worklog/screenshots/hf-wave3-dark-atelier.png`
- `docs/worklog/screenshots/hf-wave3-1440-execution.png`
- `docs/worklog/screenshots/hf-wave3-1280-execution.png`
- `docs/worklog/screenshots/hf-wave3-768-atelier.png`

## Findings by lane

### Auth / security

Cloud gate uses the existing session API. Missing config is not a wrong password. `safeAppPath` rejects protocol-relative and external URLs. 401 on workshop reads probes Cloud session loss without treating operator `invalid_session` as Cloud logout. Cloud logout clears the operator cookie and revokes the operator session.

### Atelier / domain

Inbox lanes were reordered to Owner attention order. Machine Strict and manual flexibility were not rewritten. Claim-on-start remains the start path.

### Execution / PvA

`jobHref` is derived from `sourceOrderSnapshotId`. PvA is operational only. Duration exists only when both timestamps parse.

### Visual / a11y / regression

Industrial Clarity, Lucide + WorkOS marks, and the accepted shell were reused. Wave 1/2 Playwright still passes. No new token system.

Owner review found two accessibility defects on the populated runtime. AppShell no longer autofocuses `main` on every route; first Tab reaches `Sari la conținut`, and Enter / `#continut-principal` moves focus into main. Login wall uses its own skip link to `#autentificare` and does not duplicate AppShell. `a.button-quiet` (`Deschide lucrarea`) and Wave 3 execution text links now have a 44×44 hit area without enlarging the label.

## Accepted advisories

- The Owner review runtime uses only synthetic Cloud data under `.tmp`. Mutable operational states must be restored with the existing local restore if they are consumed. Owner inspection must not press `Pornește` or `Finalizează`.
- Atelier does not list completed tasks. The inbox contract has no completed lane; inventing one would be a second inbox. Planned-versus-actual stays reachable from the execution workspace.
- `AUTH_CONFIG_MISSING` is designed and unit-tested. The loading / missing-config captures use a session mock so they do not require a broken control plane.
- The synthetic fixture is not HUB catalog adoption. `SYNTHETIC_TEST` Cloud planes use the empty foundation registry. Startable CNC still needs a dedicated machine, proven on the isolated single-plane workshop E2E, not by adopting HUB equipment into the synthetic Cloud plane.
- Session-expiry copy is unit-tested; there is no separate expiry pixel capture.
- SYSTEM reuses the previously verified ThemeSwitcher behavior. The final accessibility closure did not change it. Wave 3 pixels cover LIGHT and DARK.
- Historical lint errors outside Wave 3 do not belong to this lot. Repo-wide `pnpm lint` still fails on pre-existing unused symbols outside this wave.
- These limits may be reopened only through a later concrete finding.

## Dead pieces

- Native operator `<dialog>` in the shell was replaced by the accepted `ActionDrawer`.
- Execution plan details no longer show plan id or EIC.
- Atelier no longer repeats the operator name in the page summary; the shell chip is the single active identity.

## Method

Four read-only lanes (auth/security, Atelier/domain, execution/PvA, visual/a11y/regression) before write. Single writer. Isolated Playwright. Owner review runtime uses `.tmp\hf-wave3-review`, not the real Cloud root, not 5173/8787.

## Roadmap awareness

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4_RESOURCES_AND_ADMIN_REUSE_OWNER_GO
DIRECTION_CONFLICT = NO
Cât sunt în direcția stabilită: 100/100%
```

This accept GO updates only the living roadmap and this worklog. It does not reopen Wave 3 implementation, does not start Wave 4, and does not treat stale pre-write lane notes as current defects. `HUB_MEDIA_CLEAN_PILOT` remains the only target. Wave 3 does not close the first real LETTERS job or planned-vs-actual Owner sign-off.

## Owner accept

```text
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_3_REVIEW = PASS
OWNER_DECISION                              = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3       = OWNER_ACCEPTED
WAVE_3_GATE                                 = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED                = NO
WAVE_4                                      = NOT_STARTED
```

Accepted as implemented Cloud login and return-to-route, missing-config design, session expiry, logout, operator identification, PIN masking, eligible and ineligible operators, populated Atelier inbox and attention order, startable / machine-blocked / dependency-blocked / manual-area flexibility with Machine Strict preserved, execution workspace, double-start protection, stale mutation handling, in-progress and completed states, operational planned-versus-actual, job back-link, workshop financial payload none, LIGHT / DARK / SYSTEM, 1440 / 1280 / 768, and the final accessibility closure (first Tab skip link, visible on focus, Enter to main, login-wall skip link, `Deschide lucrarea` 155 × 44, interactive targets under 44 = 0). This is not acceptance of the entire first HF lot.

Wave 4 remains a later Owner GO:

```text
Resurse
→ reuse administrativ domain-aware
```
