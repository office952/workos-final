# WorkOS First HF lot UI implementation Wave 5

```text
GO                         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT
BRANCH                     = feat/first-hf-lot-ui-wave5-regression-accessibility-screenshot-v1
BASE                       = 45d74ddd79f61e05ffce0fe2bb27df44ddeb852a
ORIGIN_MAIN                = 45d74ddd79f61e05ffce0fe2bb27df44ddeb852a
CURRENT_MILESTONE          = HUB_MEDIA_CLEAN_PILOT
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_5_REVIEW = PASS
OWNER_DECISION             = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5 = OWNER_ACCEPTED
OWNER_ACCEPTED             = YES
WAVE_5_GATE                = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED = YES
FULL_FIRST_HF_LOT_CODE_COMPLETE = YES
FULL_FIRST_HF_LOT_REGRESSION_COMPLETE = YES
FULL_FIRST_HF_LOT_OWNER_ACCEPTED = YES
CHATGPT_INDEPENDENT_REVIEW = PASS_WITH_ADVISORY
CHATGPT_WAVE_5_REVIEW_SCORE = 96/100
CHATGPT_EVIDENCE_CORRECTION = PASS
FINDINGS_P0                = 0
FINDINGS_P1                = 0
ADVISORIES_RECORDED        = YES
ADVISORIES_BLOCKING        = NO
NEW_CORRECTION_WAVE        = NO
POST_WAVE_5_STEP           = NOT_STARTED
WAVE_6                     = NOT_STARTED
NEXT_STEP                  = HUB_MEDIA_ORGANIZATION_CONFIGURATION
SESSION_CONTINUITY         = SAME_CHAT_SAME_WORKTREE
PUSH                       = YES
```

## Authority

Owner GO for first-lot regression, accessibility, and screenshot closure after Wave 4 accept. Same chat, same worktree. Wave 4 was not reopened for advisories. Owner review is `PASS` / `ACCEPTED_WITH_ADVISORIES`. Wave 5 gate is closed. The first HF lot UI is Owner-accepted. The next named sequence step is `HUB_MEDIA_ORGANIZATION_CONFIGURATION`. It is not started and is not authorized by this accept.

Roadmap implementation Wave 5 is the contracts file “Wave 6 — regression, accessibility, screenshot comparison”: all lot routes, keyboard/contrast/a11y checks, and a screenshot baseline. It is not contracts Wave 5 (Resources and admin reuse), which shipped as implementation Wave 4.

```text
ROADMAP_READ        = YES
UI_UX_CANON_READ    = YES
HF_BASELINE_READ    = YES
DIRECTION_CONFLICT  = NO
ROADMAP_WAVE_5_NAME = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT
ROADMAP_WAVE_5_SCOPE = all lot routes; a11y checks; screenshot baseline
ROADMAP_WAVE_5_ACCEPTANCE = keyboard, contrast, reduced-motion-safe existing E2E; visual comparison review; still not Cloud root
ROADMAP_FIRST_HF_LOT_COMPLETION_RULE = FULL_FIRST_HF_LOT_IMPLEMENTED stays NO until Owner acceptance
ROADMAP_NEXT_STEP_AFTER_WAVE_5 = HUB_MEDIA_ORGANIZATION_CONFIGURATION
```

Difference from the prompt: the readiness contracts still number this work as Wave 6. The living roadmap and this GO name it implementation Wave 5. This report follows the roadmap name.

## Architecture readback

- ProductDefinition, ProductAggregate, Task Graph, Cost Engine, and Pricing Registry stay untouched.
- Execution owns start gates. This wave did not press Pornește or Finalizează.
- Resources / Cost still owns internal tariffs. Atelier and Execution stay workshop-safe.
- People remains operational identity, not HR.

## Regression matrix

| Wave | Surface | Route | Source of truth | Safe actions | Forbidden | Existing test |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Shell, Lucrări, job, quote | `/`, `/jobs/:jobId`, `/quotes/:id` | Order / Quote snapshots | open, inspect | invent Job table | `hf-wave1-foundation.spec.ts`, unit |
| 2 | Comercial, Catalog | `/requests`, `/quotes`, `/clients`, `/products` | Request / Customer / Catalog | open lists | freeze/reprice | `hf-wave2-commercial-catalog.spec.ts` |
| 3 | Login, Atelier, Execution, PvA | gate, `/atelier`, `/execution/:planId` | Cloud session + operator + plan | identify, open | Pornește / Finalizează | `hf-wave3-cloud-*.spec.ts` |
| 4 | Resurse, Utilaje, Oameni | `/admin/resources`, `/admin/workcenters`, `/admin/people` | Resources / workcenters / people | search, select | Adaugă / Salvează / Reset PIN | `hf-wave4-resources-admin-reuse.spec.ts` |
| 5 | Closure pack | all of the above | same | keyboard, theme, screenshots | new domains | this wave spec |

```text
FIRST_HF_LOT_REGRESSION_MATRIX = COMPLETE
WAVE_1_REGRESSION = PASS
WAVE_2_REGRESSION = PASS
WAVE_3_REGRESSION = PASS
WAVE_4_REGRESSION = PASS
WAVE_4_ADVISORIES_REOPENED = NO
```

## Accessibility matrix

| Check | Result |
| --- | --- |
| First Tab skip link | PASS (login wall + authenticated Lucrări) |
| Skip visible on focus | PASS |
| Enter focuses main | PASS |
| Login-wall skip | PASS (`Sari la autentificare`) |
| Authenticated skip | PASS (`Sari la conținut`) |
| Keyboard core nav | PASS |
| Visible focus | PASS |
| Form labels | PASS (label-associated inputs counted) |
| Accessible icon names | PASS (theme buttons have aria-label) |
| Heading hierarchy failures | 0 after two documented fixes |
| Landmark failures | 0 |
| Interactive under 44 | 0 after documented hit-area fixes |
| Contrast failures | 0 |
| Overflow | 0 |
| Text clipping | 0 |

Accepted Wave 4 advisories remain recorded and were not turned into polish tasks.

## Findings and fixes

Only Wave 5 contract failures were corrected. No redesign.

### P2 — catalog heading skip

```text
FINDING          = OwnerCatalogView hid group h3 and kept section h4
SEVERITY         = P2
ROUTE            = /admin/workcenters and other catalog rails
REPRODUCTION     = select CNC Router; heading order h1 → h2 → h4
ROOT_CAUSE       = hideChrome omitted h3
MINIMAL_FIX      = section title is h3 when group chrome is hidden
FILES            = apps/web/src/OwnerCatalogView.tsx, apps/web/src/index.css, OwnerCatalogView.test.tsx
TEST             = unit + Wave 5 Playwright
REGRESSION_RISK  = low; same type size via shared class
```

### P2 — person and execution hit areas

```text
FINDING          = ← Oameni and Detalii / Detalii plan summaries were under 44px
SEVERITY         = P2
ROUTE            = /admin/people/:id, /execution/:planId
REPRODUCTION     = Wave 5 target audit
ROOT_CAUSE       = 44px rules covered catalog/people-list summaries, not person or execution details
MINIMAL_FIX      = button-quiet back link; 44px on people-admin and execution summaries
FILES            = PersonAdminPage.tsx, index.css
TEST             = Wave 5 Playwright
REGRESSION_RISK  = low
```

### P2 — execution heading skip

```text
FINDING          = ExecutionPlanPanel used h3 under page h1
SEVERITY         = P2
ROUTE            = /execution/:planId
REPRODUCTION     = open execution workspace
ROOT_CAUSE       = panel title started at h3
MINIMAL_FIX      = plan title h2, lane titles h3, task titles stay h4
FILES            = ExecutionPlanPanel.tsx, index.css
TEST             = execution unit + Wave 5 Playwright
REGRESSION_RISK  = low
```

```text
FINDINGS_P0 = 0
FINDINGS_P1 = 0
FINDINGS_P2 = 3
FINDINGS_P3 = 0
PRODUCT_FIXES = 3
```

## Screenshot manifest

Saved only under `.tmp/hf-wave5-owner-review-evidence/` (gitignored). Account chip redacted before capture. Login invalid shot clears fields after the alert. 24 required PNGs present. PNG byte scan: email 0, PIN 0.

| File | Provenance |
| --- | --- |
| 00–01 | fresh unauthenticated context, 5187 |
| 02–12, 20–21 | authenticated Owner, no writes |
| 13–15, 18–19 | identified eligible operator; no Pornește |
| 16–17, 22–23 | execution workspace already present in fixture |

Owner review required a later evidence-only recapture of 17–20. Those four files are now focused and unique. 16 remains the full execution workspace. 17 is the Planned-versus-Actual section. 18 is a focused machine-blocked Atelier card. 19 is a focused dependency-blocked Atelier card. 20 is a manual task in `Pot porni acum`. Login shots 00–01 exist on disk and in `required`. They are absent from the `captured` array. That metadata mismatch is a recorded P3 advisory, not a missing file.

## Tests

| Check | Result |
| --- | --- |
| Web unit (shell, login, resources, workcenters, people, skills, person, catalog, atelier, execution) | 39 passed, then 3 catalog + 9 execution/person after fixes |
| API targeted (health, cloud-auth, cost-evidence, people-skills, eligibility) | 24 passed |
| Web typecheck | pass |
| Isolated Playwright Wave 5 on 5187/8801 | 2 passed |
| Default Playwright | not run (protects 5173/8787) |

Wave 5 Playwright does not start or stop servers.

## Runtime

```text
WEB = http://127.0.0.1:5187
API = http://127.0.0.1:8801
FIXTURE = .tmp/hf-wave3-review/cloud
REAL_CLOUD_ROOT = UNTOUCHED
REAL_DATA_USED = NO
```

5173 / 8787 were left running and were not used. Credentials remain only in `.tmp/hf-wave3-review/cloud/owner-auth.txt`.

## Boundaries

```text
PRODUCT_DEFINITION_DIFF         = NONE
PRODUCT_AGGREGATE_DIFF          = NONE
PRICING_DIFF                    = NONE
COST_ENGINE_DIFF                = NONE
QUOTE_DIFF                      = NONE
TASK_GRAPH_SEMANTIC_DIFF        = NONE
EXECUTION_DOMAIN_SEMANTIC_DIFF  = NONE
AUTH_ARCHITECTURE_DIFF          = NONE
WAVE_6_CODE                     = NO
```

## Dead pieces observed, not deleted

- People still use a list/form rail, not the Resurse catalog rail.
- Skill create still needs an internal code field.
- Dual identity chrome (Cloud account vs Identifică-te) remains as Wave 4 accepted advisory.
- Historical `workcenters-*.png` under `docs/worklog/screenshots/` remain pre-Wave-4.

## Roadmap awareness

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP         = HUB_MEDIA_ORGANIZATION_CONFIGURATION
DIRECTION_CONFLICT = NO
Cât sunt în direcția stabilită: 100/100%
```

This accept GO updates only the living roadmap and this worklog. It does not reopen Wave 5 implementation, does not start `HUB_MEDIA_ORGANIZATION_CONFIGURATION`, and does not turn accepted P2/P3 advisories into correction tasks. `HUB_MEDIA_CLEAN_PILOT` remains the only target. Wave 5 closes the first HF lot UI. It does not close the first real LETTERS job or planned-vs-actual Owner sign-off.

## Owner accept

```text
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_5_REVIEW = PASS
OWNER_DECISION                              = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5       = OWNER_ACCEPTED
WAVE_5_GATE                                 = CLOSED
FULL_FIRST_HF_LOT_CODE_COMPLETE             = YES
FULL_FIRST_HF_LOT_REGRESSION_COMPLETE       = YES
FULL_FIRST_HF_LOT_OWNER_ACCEPTED            = YES
FULL_FIRST_HF_LOT_IMPLEMENTED               = YES
WAVE_1                                      = OWNER_ACCEPTED
WAVE_2                                      = OWNER_ACCEPTED
WAVE_3                                      = OWNER_ACCEPTED
WAVE_4                                      = OWNER_ACCEPTED
WAVE_5                                      = OWNER_ACCEPTED
CHATGPT_INDEPENDENT_REVIEW                  = PASS_WITH_ADVISORY
CHATGPT_WAVE_5_REVIEW_SCORE                 = 96/100
CHATGPT_FINDINGS_P0                         = 0
CHATGPT_FINDINGS_P1                         = 0
CHATGPT_EVIDENCE_CORRECTION                 = PASS
CHATGPT_ACCEPTANCE_RECOMMENDATION           = ACCEPT
FINDINGS_P0                                 = 0
FINDINGS_P1                                 = 0
ADVISORIES_RECORDED                         = YES
ADVISORIES_BLOCKING                         = NO
NEW_CORRECTION_WAVE                         = NO
POST_WAVE_5_STEP                            = NOT_STARTED
```

Accepted as implemented first-lot regression, accessibility, and screenshot closure, including the three documented heading and hit-area fixes and the later evidence-only recapture of Planned-versus-Actual, machine-blocked, dependency-blocked, and manual-task proofs. Independent ChatGPT visual review is `PASS_WITH_ADVISORY` at 96/100. This accept closes the first HF lot UI. It does not authorize `HUB_MEDIA_ORGANIZATION_CONFIGURATION`, the first real LETTERS job, or planned-vs-actual Owner sign-off.

Verified recaptured evidence:

- `17-planned-versus-actual-light-1440.png` — distinct Planned versus Actual section with Planificat / Realizat / Diferență / Durată / Stare
- `18-machine-blocked.png` — blocked task with “Necesită utilaj dedicat înainte de pornire.”
- `19-dependency-blocked.png` — task in Urmează with “Așteaptă: Debitare foaie CNC — Spate”
- `20-manual-task-flexibility.png` — manual task in Pot porni acum, Pornește visible, no dedicated machine or table

Hash uniqueness of the accepted evidence pack: 13≠18, 13≠19, 18≠19, 16≠17.

Accepted advisory, recorded factually and not scheduled as a correction wave:

### P3

1. `manifest.json` lists 22 names in `captured` and 24 in `required`. Physical PNG count is 24. `missing` is empty. Login shots 00 and 01 exist in the archive and in `required`, but are not enumerated in `captured`. Archive integrity passed. This is metadata ambiguity only.
