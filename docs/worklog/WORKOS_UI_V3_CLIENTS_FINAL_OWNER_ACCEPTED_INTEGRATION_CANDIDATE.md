# WorkOS V3 — Clients final — clean integration candidate

```text
OWNER_DECISION              = ACCEPT CLIENTS RUNTIME FINAL
OWNER_ACCEPTED_SCOPE        = CLIENTS_FIGMA_AND_RUNTIME_FINAL
CLIENTS_FIGMA_DIRECTION     = OWNER_ACCEPTED
CLIENTS_RUNTIME             = OWNER_ACCEPTED
CLIENTS_UI_UX_GATE          = CLOSED
INTEGRATED_ON_MAIN          = NO
SOURCE_PR_1                 = DRAFT / NOT THE INTEGRATION VEHICLE
SOURCE_PR_1_MERGED          = NO
PAGINATION_RUNTIME          = NOT_IMPLEMENTED
CLIENT_HUB_REDESIGN         = OUT_OF_SCOPE
NEXT_WAVE                   = NO
OS_S3                       = NO
```

Owner accepted the Clients Figma direction and the Clients runtime. This record is the clean Clients-only integration candidate reconstructed from current `origin/main`. It is not a merge of PR #1 and does not cherry-pick mixed Wave 1 commits.

## Identity

```text
REPO               = office952/workos-final
SOURCE_BRANCH      = feat/ui-v3-commercial-content-wave1
SOURCE_HEAD        = 9776e7698445ba076fdf4f5f77bae4102ed54ec6
ORIGIN_MAIN        = c32281da1aed93307f0779ce568878f5d371fb23
MAIN_MOVED         = NO
INTEGRATION_BRANCH = integrate/ui-v3-clients-final-v1
BASE_HEAD          = c32281da1aed93307f0779ce568878f5d371fb23
FIGMA_FILE         = WorkOS V3 — Clients Final Design
FIGMA_FILE_KEY     = 1ev5lg7m2Ze1h3Vqmax8ho
```

Accepted Figma nodes: 1920 Light `2:383`, 1920 Dark `4:314`, 1440 Light `4:379`, 1440 Dark `4:444`, 1280 `4:509`, 768 `4:1734`, Client Card `2:365`, Metric Card `6:1611`, Pagination `6:1653` (future target only), Tokens `4:1912`.

`origin/main` had not moved since the last verified SHA. No rebase conflict.

## Extraction law

Did not merge `feat/ui-v3-commercial-content-wave1`. Did not cherry-pick mixed Wave 1 commits. Classified `origin/main...9776e769` hunk by hunk and applied only `CLIENTS_ACCEPTED` or `SHARED_REQUIRED` hunks.

## CLIENTS_ACCEPTED

- `apps/web/src/ClientsOverviewPage.tsx`
- `apps/web/src/ClientsOverviewPage.test.tsx`
- `apps/web/src/clientsRegistryView.ts`
- `apps/web/src/clientsRegistryView.test.ts`
- `apps/web/src/useClientsRegistryState.ts`
- `apps/web/src/useClientsRegistryScroll.ts`
- `apps/web/src/useClientsRegistryScroll.test.ts`
- `e2e/clients-registry.spec.ts`

## SHARED_REQUIRED

Taken only because the accepted Clients runtime already established these shell / primitive laws:

| File | Why required |
| --- | --- |
| `AppShell.tsx` + test | No global page title. Operator chrome interactive only on `/atelier` and `/execution/*`. Passive operator on commercial/admin. |
| `navigation/navigationRegistry.ts` + test | `isOperationalOperatorRoute`. Remove `contextTitleForLocation`. |
| `ui/StableSidebar.tsx` | WorkOS mark + WorkOS brand. |
| `icons/WorkosBrandMark.tsx` | Sidebar brand mark. |
| `ui/MetricCard.tsx` + test | Four derived Clients metric cards. |
| `RegistrySearchField.tsx` | `hideLabel` + `leadingIcon` used by the accepted toolbar. |
| `ui/Field.tsx` | `hideLabel` for that search field. |
| `ui/PageHeader.tsx` | Page identity stays in `PageHeader`. `lead` accepts `ReactNode` (Clients still passes a string). |
| `index.css` | Hunk-filtered: sidebar brand, remove `app-context-title`, fluid `.app-content`, registry toolbar/search icon, Clients card/metrics. |
| `e2e/helpers/people.ts` | Same operator-route law creates two `Persoană` labels on Execution and needs scoped identify. Required after extraction; not copied automatically. |
| `e2e/smoke.spec.ts` | WorkOS brand assertion; Catalog scoped to the primary nav so Lucrări empty-state `Deschide catalogul` does not collide. |
| `e2e/client-workspace.spec.ts` | Registry no longer has `Deschide clientul`; whole card is the link. Hub assertions stay on main copy. |
| `e2e/cloud-isolation.spec.ts` | `Identifică-te` is no longer on commercial pages after org switch. |

## REJECTED_OTHER_PAGE

Unchanged versus `origin/main`:

- `ClientWorkspacePage.tsx` — Hub stays main
- `RequestsOverviewPage.tsx` + test
- `RequestDetailPage.tsx` + test
- `QuotesOverviewPage.tsx`
- `QuoteInspectionPage.tsx`
- `JobsOverviewPage.tsx`
- `JobDetailPage.tsx`
- `e2e/optional-site-installation.spec.ts`
- `e2e/os-s1-org-capability.spec.ts`
- `e2e/request-installation-facts.spec.ts`
- mixed Wave 1 worklog

## REJECTED_MIXED_UNNECESSARY (CSS)

From source `index.css`, not copied:

- `.jobs-list li.is-selected` and jobs panel color rules
- `.registry-split`, `.registry-panel`, `.job-lanes`, `.object-tabs`
- `.clients-counters`
- `.client-sections` / Hub tab restyle

`.jobs-list` and `.client-sections` remain the existing main rules.

## MIXED_FILES_HUNK_FILTERED

- `apps/web/src/index.css` — Clients floorplan + accepted shell tokens only

## Runtime evidence

Candidate captures in `docs/worklog/screenshots/clients-final-candidate/`:

- `clients_1920_light.png`
- `clients_1920_dark.png`
- `clients_1440_light.png`
- `clients_1440_dark.png`
- `clients_1280.png`
- `clients_768.png`
- `shell_requests_1440.png`
- `shell_quotes_1440.png`
- `shell_jobs_1440.png`
- `shell_atelier_1440.png`
- `shell_admin_1440.png`

Compared against accepted Figma 1920 Light (`2:383`) and the accepted source runtime. No aesthetic reinterpretation. Fluid width, PageHeader owns `Clienți`, no global title, WorkOS sidebar brand, four metrics, toolbar + result-count + right search, Signal Edge, no pagination, no `Identifică-te` on Clients. Sibling routes keep main page content; only accepted shell consequences differ.

## Tests

```text
LINT                      = PASS (0 errors; 11 pre-existing react-refresh/hooks warnings)
TYPECHECK                 = PASS
UNIT_TESTS                = PASS (domain 395 + web 169 + api 251)
BUILD                     = PASS
FOCUSED_E2E               = PASS
FOCUSED_ISOLATED_RECHECK  = 9 passed (clients-registry, client-workspace, admin-stock, smoke, v3-navigation-shell)
ATELIER_IDENTIFY          = PASS (hf-wave3-cloud-atelier-execution, people-hardening)
EXECUTION_IDENTIFY        = PASS (letters-execution-golden-path, minimal-task-execution)
SHARD_B                   = 42 passed / 1 skipped / 0 failed
SINGLE_PROCESS_FULL_E2E   = LOCAL_WINDOWS_INFRA_CASCADE
```

A single local `pnpm e2e --retries=0` reached 52 passed / 5 skipped, then Vite/API `ECONNRESET`. Isolated re-runs of the first two apparent product failures (`admin-stock`, `people-skills`) passed. Shard A later died the same way after an `admin-stock` 5s heading timeout; the same spec passed isolated immediately afterwards. This is the same Windows webServer death seen on the mixed branch. GitHub Ubuntu is the authoritative full suite and was not run because this GO forbids push.

## Explicit non-claims

- PR #1 is not merged and is not the integration vehicle.
- Client Hub, Cereri, Oferte, and Lucrări page-content redesigns are not in this candidate.
- Pagination UI is not in runtime.
- Canon and roadmap were not edited.
- Integration on `main` still requires a later Owner GO.
- `PUSH = NO`
- `MERGE_MAIN = NO`
