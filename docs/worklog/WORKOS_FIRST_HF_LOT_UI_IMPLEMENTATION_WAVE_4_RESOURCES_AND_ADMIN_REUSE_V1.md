# WorkOS First HF lot UI implementation Wave 4

```text
GO                         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4_RESOURCES_AND_ADMIN_REUSE
BRANCH                     = feat/first-hf-lot-ui-wave4-resources-admin-reuse-v1
BASE                       = afe7b46b4597192601135d527393b8031e3b7a04
ORIGIN_MAIN                = afe7b46b4597192601135d527393b8031e3b7a04
CURRENT_MILESTONE          = HUB_MEDIA_CLEAN_PILOT
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_4_REVIEW = PASS
OWNER_DECISION             = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4 = OWNER_ACCEPTED
WAVE_4_GATE                = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED = NO
WAVE_5                     = NOT_STARTED
WAVE_5_AUTHORIZED          = NO
CURSOR_INDEPENDENT_OPINION = PASS_WITH_ADVISORIES
CHATGPT_VISUAL_OPINION     = PASS_WITH_ADVISORIES
CHATGPT_VISUAL_SCORE       = 94/100
FINDINGS_P0                = 0
FINDINGS_P1                = 0
ADVISORIES_RECORDED        = YES
ADVISORIES_BLOCKING        = NO
NEXT_STEP                  = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_OWNER_GO
SESSION_CONTINUITY         = SAME_CHAT_SAME_WORKTREE
```

## Authority

Owner GO for Resurse and domain-aware admin reuse after Wave 3 accept. Same chat, same worktree. Wave 3 was not reopened. Owner review is `PASS` / `ACCEPTED_WITH_ADVISORIES`. Wave 4 gate is closed. Full first HF lot is not implemented. Wave 5 is not started and is not authorized.

Roadmap Wave 4 is the implementation of contracts “Wave 5 — Resources and admin reuse”: restyle `/admin/resources` and reuse the admin collection pattern on Utilaje/zone and Oameni. It is not contracts Wave 4 (Atelier/execution), which shipped as implementation Wave 3.

```text
ROADMAP_READ        = YES
UI_UX_CANON_READ    = YES
HF_BASELINE_READ    = YES
DIRECTION_CONFLICT  = NO
```

## Architecture readback

- Resources / Cost owns material, service, and labor identity plus internal cost evidence.
- Workcenters / Machines own zones, machines, capabilities, and coverage. Write is not implemented.
- People owns operational identity, qualifications, and availability. Not HR.
- Execution owns start gates: machine-required tasks stay Machine Strict; manual areas stay flexible.
- Pricing Registry stays separate. Internal tariffs are not customer price.

## UI contract

| Field | Decision |
| --- | --- |
| Placement | Administrare → Resurse `/admin/resources`; sibling Utilaje `/admin/workcenters`; Oameni `/admin/people` |
| Audience | Owner inspect / confirm internal tariffs; member read without inventing a second catalog |
| Page objective | See what exists, its type, what it can do, whether it is active/covered, where it is administered, and how it links to execution |
| Primary information | Type (material / zonă / utilaj / om) + operational meaning + status |
| Primary action | Confirm internal tariff on Resurse; inspect elsewhere |
| Admin vs execution | Admin configures and inspects. Atelier executes. Domain links keep the door visible. |
| Reused | `OwnerCatalogView`, `CostEvidenceEditor`, existing APIs, owner write gates |
| Not reused | Universal CRUD, ActionDrawer as admin shell, merging machines/people/skills into Resurse |

## Reuse map

| Surface | Class | Change |
| --- | --- | --- |
| `/admin/resources` | reusable with adapter | Search + domain links; cost editor unchanged |
| `/admin/workcenters` | reusable with adapter | Zonă / Utilaj / zonă manuală / obligatoriu la start |
| `/admin/people` | reusable with adapter | Oameni / Calificări, loading headers, domain links |
| APIs | reusable as-is | No new writes |

## What this wave implements

1. Shared catalog search on `OwnerCatalogView`, including a search-empty state.
2. Domain links: Administrare, Resurse, Utilaje și zone, Oameni, Procese, Stoc, Atelier — execuție.
3. Utilaje distinguish zone vs machine vs manual area vs machine-required start. FACE / BACK remain component roles.
4. Oameni naming unified; qualifications hide technical codes under Detalii.
5. Field and catalog inputs meet 44×44. No parallel resource catalog. No commercial pricing fields. No Wave 5.

## Fixture and runtime

Reused Wave 3 synthetic Cloud under `.tmp/hf-wave3-review`. `SYNTHETIC_TEST` is EMPTY_FOUNDATION plus the two Wave 3 configured machines. Owner credentials remain only in `.tmp/hf-wave3-review/cloud/owner-auth.txt`. Runtime 5187 / 8801. 5173 / 8787 untouched.

| Need | Live fixture |
| --- | --- |
| Eligible machine | CNC Router 4050 x 2050 · `CNC_ROUTING` · Obligatoriu la start |
| Machine not eligible for CNC | CNC formare cant litere · `PROFILE_FORMING` only |
| Inactive / uncovered | Fără furnizor · 15 capabilities |
| Workcenter mapping | Zona CNC / Zona formare cant |
| Eligible operator | Operator eligibil · CNC and related qualifications |
| Ineligible operator | Operator neeligibil · Fără calificări |
| Manual-area flexibility | Notice + catalog law for assembly/LED zones. No invented tables. |
| Machine-blocked | Same Machine Strict copy: CNC/forming require an eligible machine |

Phase A: local credentials already matched the control-plane hash. Failure was operational (typed/remembered password or stale browser session), not a seed/hash mismatch. No password rotation. No product auth change.

## Files changed

- `apps/web/src/AdminDomainLinks.tsx` (new)
- `apps/web/src/OwnerCatalogView.tsx` and test
- `apps/web/src/ResourcesAdminPage.tsx` / `WorkcentersAdminPage.tsx` / people admin pages
- `apps/web/src/workcentersCatalog.ts`
- `apps/web/src/index.css`
- `apps/web/src/AdminHomePage.tsx`, `PeopleAdminNav.tsx`
- existing e2e helpers: Persoane → Oameni, Calificări
- `e2e/hf-wave4-resources-admin-reuse.spec.ts` (ignored by default Playwright)
- `playwright.wave4-cloud.config.ts`
- this worklog and factual roadmap state

## Tests

| Check | Result |
| --- | --- |
| Web unit (catalog, resources, workcenters, people, skills, person, AppShell) | 29 passed |
| API targeted (cost-evidence, people-skills, system) | 16 passed |
| Web typecheck | pass |
| Web build | pass |
| ESLint on touched files | 0 errors; 2 pre-existing `reload` hook warnings |
| `git diff --check` | pass |
| Playwright Wave 4 on 5187/8801 | 3 passed |
| Default Playwright | not run (would reuse 5173/8787) |

Owner evidence is only under `.tmp/hf-wave4-owner-review-evidence/` and is gitignored.

## Findings

- Implementation Wave 4 = contracts Wave 5. Contracts Wave 4 already shipped as implementation Wave 3.
- Synthetic Cloud does not include assembly tables. Manual flexibility is stated on the page and kept in catalog helpers; tables were not invented.
- Internal tariff remains visible as Tarif intern. Disclaimers say it is not customer price. No salary or Preț client field.
- Cloud shell still shows the synthetic account chip. Password and PIN were not captured.
- People still use a list/form rail. That is reuse, not a second catalog.

## Boundaries

```text
QUOTE_DIFF                 = NONE
COMMERCIAL_PRICING_DIFF    = NONE
COST_ENGINE_DIFF           = NONE
PRODUCT_DEFINITION_DIFF    = NONE
TASK_GRAPH_SEMANTIC_DIFF   = NONE
AUTH_PRODUCT_DIFF          = NONE
REAL_CLOUD_ROOT            = UNTOUCHED
WAVE_5                     = NOT_STARTED
```

## Dead pieces observed, not deleted

- People still use a list/form pattern, not the full catalog rail.
- Skill create still needs an internal code field.
- Historical workcenter screenshots under `docs/worklog/screenshots/workcenters-*.png` are pre-Wave-4.

## Roadmap awareness

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_5_REGRESSION_ACCESSIBILITY_SCREENSHOT_OWNER_GO
DIRECTION_CONFLICT = NO
Cât sunt în direcția stabilită: 100/100%
```

This accept GO updates only the living roadmap and this worklog. It does not reopen Wave 4 implementation, does not start Wave 5, and does not turn accepted P2/P3 advisories into correction tasks. `HUB_MEDIA_CLEAN_PILOT` remains the only target. Wave 4 does not close the first real LETTERS job or planned-vs-actual Owner sign-off.

## Owner accept

```text
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_4_REVIEW = PASS
OWNER_DECISION                              = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_4       = OWNER_ACCEPTED
WAVE_4_GATE                                 = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED                = NO
WAVE_5                                      = NOT_STARTED
WAVE_5_AUTHORIZED                           = NO
CURSOR_INDEPENDENT_OPINION                  = PASS_WITH_ADVISORIES
CHATGPT_VISUAL_OPINION                      = PASS_WITH_ADVISORIES
CHATGPT_VISUAL_SCORE                        = 94/100
FINDINGS_P0                                 = 0
FINDINGS_P1                                 = 0
ADVISORIES_RECORDED                         = YES
ADVISORIES_BLOCKING                         = NO
NEW_CORRECTION_WAVE                         = NO
```

Accepted as implemented domain-aware Resurse, admin reuse of Utilaje și zone and Oameni, no parallel resource catalog, internal cost evidence only on Resurse/Cost, “Tarif intern” as internal-only, Machine Strict preserved, employee skill boundary preserved, LIGHT / DARK / SYSTEM, 1440 / 1280 / 768, keyboard navigation with advisory, and accessibility. Independent Cursor review and independent ChatGPT visual review are `PASS_WITH_ADVISORIES`. This is not acceptance of the entire first HF lot.

`Tarif intern` remains accepted only on the administrative Resurse/Cost surface. It is internal information, not customer price. It is not propagated to Utilaje, Oameni, Atelier, Execution, or the commercial offer. Pricing Registry stays separate. This accept does not authorize quoting by hours, salaries, or machine tariffs.

Accepted advisories, recorded factually and not scheduled as a correction wave:

### P2

1. Owner manual login remains not directly confirmed by Owner, although real login with the local credential file passed in two new contexts.
2. The header still shows “Identifică-te” next to an already authenticated Cloud account; operator identity is correctly separate, but the difference can confuse.
3. In the Oameni list, name and secondary description are visually joined: `Operator eligibilFără rol descriptiv`.
4. The Calificări form exposes the prefilled technical code `SK_LASER`.
5. At 768 px the Resurse catalog stacks fully before the selected detail and produces a long vertical path.
6. “Fără furnizor 15” can be read as a defect, although it represents the incomplete synthetic foundation.
7. Manual-area flexibility is explained in UI, but Wave 4 fixture does not demonstrate a manual area.

### P3

8. Admin Home uses technical jargon visible to the Owner: “fără write”.
9. Oameni and Calificări are create-first and do not use the Resurse catalog rail.
10. Route `/admin/skills` does not exist; the canonical route is `/admin/people/skills`.
11. The header wraps rigidly at 1280 px, but remains usable.
12. Historical `workcenters-*.png` captures and documents from before Wave 4 may still show the old UI.

Wave 5 remains a later Owner GO and is not authorized by this accept:

```text
Regression
→ accessibility
→ screenshot comparison
```
