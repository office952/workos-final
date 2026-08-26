# WorkOS First HF lot UI implementation Wave 2

```text
GO                         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2_COMMERCIAL_CATALOG_CONFIGURATOR
BRANCH                     = feat/first-hf-lot-ui-wave2-commercial-catalog-configurator-v1
BASE                       = 0dc7702c4b3ad98604b3eb74564a254091c36830
IMPLEMENTATION_HEAD        = 782b498c5c75079e8701c31e444e16a2662a4d60
CURRENT_MILESTONE          = HUB_MEDIA_CLEAN_PILOT
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_2_REVIEW = PASS
OWNER_DECISION             = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_1 = OWNER_ACCEPTED
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2 = OWNER_ACCEPTED
WAVE_2_GATE                = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED = NO
WAVE_3                     = NOT_STARTED
NEXT_STEP                  = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3_CLOUD_LOGIN_ATELIER_IDENTIFICATION_EXECUTION_PVA_OWNER_GO
SESSION_CONTINUITY         = SAME_CHAT_SAME_WORKTREE
```

## Authority

Owner GO for Comercial, Catalog, and the commercial configurator on the Wave 1 foundation. Same chat, same worktree `C:\Users\offic\workspace\workos-final-pilot-hf-scope`. No second worktree. No `move_agent_to_root`. Owner review is `PASS` / `ACCEPTED_WITH_ADVISORIES`. Wave 2 gate is closed. Full first HF lot is not implemented. Wave 3 is not started.

Figma `7elwvIscvMPDiEHrX4f6kQ` was the accepted visual baseline, read-only. This GO did not write to Figma.

```text
ROADMAP_READ        = YES
UI_UX_CANON_READ    = YES
HF_BASELINE_READ    = YES
DIRECTION_CONFLICT  = NO
```

## What this wave implements

1. Comercial Level 2 stays contextual: Cereri | Oferte | Clienți. `/commercial` redirects to `/requests`.
2. `/clients` list + search + data-backed filters + `Client nou` drawer. After save, the created workspace opens.
3. `/clients/:customerId` workspace: identity, cereri, oferte, lucrări, next action, stable links.
4. `/requests` list + `Cerere nouă` drawer. `/requests/:requestId` workspace with Catalog + Configurează, linked quote, linked job when an Order exists.
5. `/quotes` list with display code `OF-…` opening `/quotes/:quoteSnapshotId`. Wave 1 inspection reused. After accept, refetch; after order, navigate to `/jobs/:jobId`.
6. `/products` is the Catalog domain: search, family filters, list + detail, contextual `Configurează`. Product System stays separate.
7. `/products/:productCode` configurator: Product Definition groups, fapte fixe, chips over native select, sticky Rezumat, no UI cost calculation, `Inspectează oferta` → stable quote route.

Hotel Nord is a synthetic E2E story only. It is not hardcoded in components.

## Route / state matrix

| Route | loading | empty | populated | validation | API error | forbidden | not found | success / blocked |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/clients` | Se încarcă clienții | Nu există încă clienți | listă + search + filtre | Nume obligatoriu în drawer | Nu s-au putut încărca | Nu ai acces | — | salvare → workspace |
| `/clients/:id` | Se încarcă clientul | fără cereri/oferte/lucrări | overview + secțiuni | profil existent | nu s-a putut încărca | Nu ai acces | Clientul cerut nu este disponibil | Cerere nouă |
| `/requests` | Se încarcă cererile | Nu există încă cereri | listă + search + stare | client/titlu/descriere | Nu s-au putut încărca | Nu ai acces | — | creare → detaliu |
| `/requests/:id` | Se încarcă cererea | fără fișiere / oferte | context + Catalog + Configurează | salvare existentă | nu s-a putut încărca | Nu ai acces | Cererea cerută nu este disponibilă | ofertă/lucrare legate |
| `/quotes` | Se încarcă ofertele | Deschide catalogul | OF-… + client + brut | — | Nu s-au putut încărca | Nu ai acces | — | next action API |
| `/quotes/:id` | Wave 1 | — | Wave 1 inspection | — | Wave 1 | Wave 1 | Oferta nu a fost găsită | accept → refetch; comandă → `/jobs/:id` |
| `/products` | Se încarcă catalogul | Nu există încă produse | listă + detalii | — | Nu s-a putut încărca | Nu ai acces | no results | Configurează |
| `/products/:code` | Se încarcă produsul | — | form + Rezumat | ReadinessNotice | Nu s-a putut încărca | — | Produsul cerut nu este disponibil | confirm → ofertă |
| `/jobs/:id` | Wave 1 reuse | — | Wave 1 job | — | Wave 1 | Wave 1 | Wave 1 | E2E lands here |

## Before / after

| Before | After |
| --- | --- |
| Clienți: inline create on the list | Drawer `Client nou` (scrim, Escape, focus trap/return) → workspace |
| Cereri: permanent inline create | Drawer `Cerere nouă`; `?customer=` still opens it |
| Catalog H1 already Catalog; weak scan | Family filters, split list/detail, product name is a real link, Configurează remains contextual |
| Configurator: native selects only | Fapte fixe card, choice chips, sticky Rezumat, preț neconfirmat until CostEngine confirms |
| Ofertă created only on the configurator | `Inspectează oferta` opens `/quotes/:quoteSnapshotId` |
| New nav could still land on `?order=` / `?quote=` | New E2E uses `/quotes/:id` then `/jobs/:id`. Legacy continue stays. |
| Comercial L2 on product `?request=` | L2 only on Comercial routes and product `?quote=` / `?order=` |

## Figma → runtime mapping

File `7elwvIscvMPDiEHrX4f6kQ`, read-only. Known nodes still resolve (page list from MCP is thin; frames resolve by id).

| Screen | Frame | Runtime | State |
| --- | --- | --- | --- |
| Workspace client | `70:85` | `/clients/:customerId` | identity + next + cereri/oferte/lucrări |
| Cerere | `70:221` | `/requests/:requestId` | client, stare, Catalog, Configurează |
| Ofertă | `70:298` | `/quotes/:quoteSnapshotId` | Wave 1 inspection reused |
| Catalog | `71:2` | `/products` | list + detail + Configurează |
| Configurator | `71:198` | `/products/:productCode` | groups + Rezumat + Verifică |
| Client nou drawer | `93:1302` | `/clients` drawer | short create |
| Job | Wave 1 frames | `/jobs/:jobId` | reused, not redesigned |
| Page 21 E2E prototype | current frames | synthetic Hotel Nord path | one story, no real data |

## Intended Figma differences

- Runtime CTA is `Configurează`, not Figma `Continuă`. IA: Configurează is the contextual action.
- Lists reuse the existing `jobs-list` row, not a second card kit.
- Configurator keeps `Verifică configurația` because that is the existing compile contract.
- Client workspace keeps current-profile edit and section query (`?section=`). Figma is overview-first.
- Cerere keeps Fișiere client (Documents V1) and office status write. Not a new lifecycle.
- Drawer fields are the existing Customer profile fields, not a universal form.
- Amounts keep the Wave 1 `EUR` suffix.
- Single-plane DEV is Owner-capable: quote/job may show Cost intern / Adaos / Marjă when the commercial payload includes them.
- Pixel-identical is not the criterion. Tokens, IBM Plex, Lucide + WorkOS custom, Industrial Clarity.

## Payload financial matrix

| Context | net / TVA / brut | internal / EIC / markup / margin / rates |
| --- | --- | --- |
| Owner on Comercial / job / quote | YES when payload has them | YES when payload has them |
| Member on Comercial | YES | NO — keys absent, server `ALT_B_SCOPED` |
| Configurator UI | shows confirmed client price only after CostEngine | does not calculate; does not invent unconfirmed rates |
| Quote overview JSON | display gross | no `contentHash`, no compiler codes |
| Atelier / Execution | Wave 1: no commercial money | Wave 1: workshop stripped |

Enforcement remains server-side. UI does not derive permission. Wave 2 E2E asserts raw keys `internalCost`, `markupPercent`, `marginAmount`, `eicTotal` are absent from operator-visible body text on the synthetic path after theme checks. Owner labels such as `Cost intern` may still appear on `/jobs/:id` in this single-plane runtime when the job payload includes them — that is ALT_B_SCOPED, not a leak.

API `tests/financial-access.test.ts` re-ran PASS.

## E2E control / reaction map

| Control | Reaction |
| --- | --- |
| Client nou → Salvează clientul | `/clients/:customerId` |
| Cerere nouă from workspace | `/requests?customer=` opens drawer |
| Creează cererea | `/requests/:requestId` |
| Deschide catalogul / Configurează | `/products?request=` then `/products/:code?request=` |
| Verifică → Confirmă → Creează oferta | CostEngine + Quote Snapshot |
| Inspectează oferta | `/quotes/:quoteSnapshotId` |
| Marchează acceptată | refetch inspection; status Acceptată |
| Creează comanda | `/jobs/:orderSnapshotId` |
| Escape on Client nou | close + focus return |
| Back/forward Catalog ↔ Configurator | request context kept; Rezumat still present |
| Refresh configurator with `?request=` | same request, same form |

Forbidden jumps: client → job without cerere/ofertă; list → execution; Catalog → Product System; ofertă → legacy `?quote=` when the stable route exists.

## Verification executed

| Gate | Result |
| --- | --- |
| Domain unit | 369 passed |
| API unit | 207 passed, including `financial-access` ALT_B_SCOPED |
| Web unit | 102 passed |
| Typecheck | domain, API, web passed |
| Lint | Wave 2 files: 0 errors. Repo `pnpm lint` still has pre-existing unused-symbol errors outside this wave (`renameCustomer`, `dirname`, `quoteB`, domain `_cost` leftovers, `scripts/atelier-runtime-fixture.mjs`). 13 pre-existing warnings. |
| Web production build | passed |
| Playwright Wave 2 | `hf-wave2-commercial-catalog.spec.ts` 2 passed on ports 8799/5185, `WORKOS_E2E_DATA_DIR=.tmp/e2e-wave2-review-2`, `WORKOS_CLOUD_ROOT` unset, `--retries=0` |
| Playwright Wave 1 critical | `hf-wave1-foundation.spec.ts` passed (job/quote refresh, theme, 1440/1280/768, skip-link) |
| Playwright Comercial lists | `client-workspace`, `requests-overview`, `quotes-overview`, `jobs-overview` passed (1 skipped: jobs empty-state when store already has jobs) |
| Playwright Catalog | `product-catalog.spec.ts` passed after Rezumat duplicate-text locator |

No axe/lighthouse plugin was installed (`PLUGIN_INSTALLATION = NONE`). Contrast and 44 px judged against the existing semantic token system and `min-height/min-width: 44px` on chips, drawer close, nav, and primary actions.

## Screenshots

Synthetic only.

- `docs/worklog/screenshots/hf-wave2-clients-list.png`
- `docs/worklog/screenshots/hf-wave2-client-workspace.png`
- `docs/worklog/screenshots/hf-wave2-client-new-drawer.png`
- `docs/worklog/screenshots/hf-wave2-requests-list.png`
- `docs/worklog/screenshots/hf-wave2-request-detail.png`
- `docs/worklog/screenshots/hf-wave2-quotes-list.png`
- `docs/worklog/screenshots/hf-wave2-quote-inspection.png`
- `docs/worklog/screenshots/hf-wave2-catalog.png`
- `docs/worklog/screenshots/hf-wave2-configurator.png`
- `docs/worklog/screenshots/hf-wave2-job-result.png`
- `docs/worklog/screenshots/hf-wave2-1440-clients.png`
- `docs/worklog/screenshots/hf-wave2-1440-catalog.png`
- `docs/worklog/screenshots/hf-wave2-1280-quotes.png`
- `docs/worklog/screenshots/hf-wave2-768-commercial.png`
- `docs/worklog/screenshots/hf-wave2-768-catalog.png`
- `docs/worklog/screenshots/hf-wave2-768-configurator.png`
- `docs/worklog/screenshots/hf-wave2-dark-commercial.png`
- `docs/worklog/screenshots/hf-wave2-dark-catalog.png`
- `docs/worklog/screenshots/hf-wave2-dark-configurator.png`

Wave 1 regression captures were refreshed by `hf-wave1-foundation.spec.ts`.

## Independent review before commit

Read-only lanes informed the writer. One writer. No parallel file edits.

| Review | Verdict |
| --- | --- |
| Coherence | One flow, one shell, one token system. |
| Commercial domain | No new entity or lifecycle. Request/Quote/Order contracts reused. |
| Product Definition / configurator | Fields and dependencies come from the template/schema. Hotel Nord is not a component. |
| Pricing boundary | UI does not compute cost. CostEngine + Pricing Registry remain authority. Snapshot freeze unchanged. |
| Visual / UX | Direction A. Level 1 Catalog. Level 2 Comercial. One primary action per surface. |
| Accessibility | Drawer focus trap/return + Escape proven. Native select remains the labelled control; chips `aria-hidden`. 44 px chips. |
| Security / privacy | 401/403 → forbidden on list/detail. No bank/legal dump. No org leak. ALT_B_SCOPED unchanged. |
| Routing / regression | Stable job/quote routes kept. Legacy `?order=` / `?quote=` kept. Product System routes untouched. |
| Scope / adversarial | No Atelier/PIN/Execution redesign. No SVG/DWG. No PDF work. No new roles. No Wave 3. No Cloud root. |

```text
P0 = 0
P1 = 0
```

## Late pre-write lane notes

These four lanes completed after commit `782b498` and described the pre-implementation worktree. They are not active findings.

```text
LATE_COMMERCIAL_LANE_NOTES      = PRE_WRITE / SUPERSEDED
LATE_CATALOG_LANE_NOTES         = PRE_WRITE / SUPERSEDED
LATE_VISUAL_LANE_NOTES          = PRE_WRITE / SUPERSEDED
LATE_SECURITY_LANE_NOTES        = PRE_WRITE / SUPERSEDED
```

They named `NOT_STARTED`, missing drawers, missing Catalog split, and missing Comercial implementation. Treated state is `782b498`. Do not reintroduce those notes as current defects.

## Advisories (P2 / P3)

Accepted with Wave 2. They do not block the pilot E2E and are not complete implementations.

- Cerere drawer still uses the existing short client selector / `Adaugă client`. Not a universal CRUD form.
- Client current profile can still be edited. Frozen quote and order snapshots keep the identity from freeze time.
- Choice chips are presentation. The labelled native select is the accessible control.
- Member Comercial visibility is proven by API and unit tests, not by a visual member session on this single-plane runtime.
- Repo-root lint still has pre-existing unused-symbol errors outside Wave 2.
- Quote PDF remains unimplemented on the inspection screen.
- Legacy configurator continue `?order=` and `?quote=` remain temporarily.
- Product System, Atelier, PIN, Execution / planned-versus-actual, and Resources are not Wave 2.
- Catalog product-name link navigates immediately; Configurează remains the explicit action.
- Figma `Continuă` vs runtime `Configurează` is an intended IA difference.

## Dead pieces

- `/commercial` → `/requests`
- Legacy configurator continue `?order=` / `?quote=`
- Product System `/components`, `/admin/product-system`
- Atelier, Identification, Execution/PvA, Resurse, People/Seller/Stoc/Utilaje redesign
- PDF on quote inspection (Wave 1 advisory)
- Wave 3

## Method

Four read-only lanes (commercial, catalog/configurator, visual/a11y, security/scope) before write. Single writer. Isolated Playwright on 8799/5185. Owner review runtime uses `.tmp\hf-wave2-review`, not the real Cloud root, not 5173/8787.

## Roadmap awareness

```text
CURRENT_MILESTONE = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP         = FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_3_CLOUD_LOGIN_ATELIER_IDENTIFICATION_EXECUTION_PVA_OWNER_GO
DIRECTION_CONFLICT = NO
Cât sunt în direcția stabilită: 100/100%
```

This accept GO updates only the living roadmap and this worklog. It does not reopen Wave 2 implementation, does not start Wave 3, and does not treat stale pre-write lane notes as current defects.

## Owner accept

```text
OWNER_FIRST_HF_IMPLEMENTATION_WAVE_2_REVIEW = PASS
OWNER_DECISION                              = ACCEPTED_WITH_ADVISORIES
FIRST_HF_LOT_UI_IMPLEMENTATION_WAVE_2       = OWNER_ACCEPTED
WAVE_2_GATE                                 = CLOSED
FULL_FIRST_HF_LOT_IMPLEMENTED                = NO
WAVE_3                                      = NOT_STARTED
```

Accepted as implemented Comercial Level 2, Clienți list/detail, Client nou drawer, Cereri list/detail, Cerere nouă, Oferte list, reused Wave 1 quote inspection, Catalog, commercial configurator, the synthetic Client → Cerere → Ofertă → Lucrare path, LIGHT/DARK/SYSTEM, responsive and accessibility evidence, `ALT_B_SCOPED` financial policy, and Catalog / Product System separation. This is not acceptance of the entire first HF lot.

Wave 3 remains a later Owner GO:

```text
Cloud login
→ Atelier
→ Identificare operator
→ Inbox operațional
→ Execuție
→ Planned-versus-actual
```
