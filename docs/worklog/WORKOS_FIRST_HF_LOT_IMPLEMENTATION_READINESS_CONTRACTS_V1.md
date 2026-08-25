# Worklog — first HF lot implementation readiness contracts V1

```text
DATE                          = 2026-08-26
GO                            = OWNER GO — ACCEPT IMPLEMENTATION READINESS CONTRACTS AND FAST-FORWARD V1
PREVIOUS_GO                   = OWNER GO — FIRST HF LOT IMPLEMENTATION READINESS CONTRACTS V1
WORKTREE                      = C:\Users\offic\workspace\workos-final-pilot-hf-scope
EXPECTED_HEAD                 = f9d16b605045b79cef1678f4f69734563db07d47
EXPECTED_ORIGIN_MAIN          = e06a5365da6248249cfc2d0c41470add55788820
BRANCH                        = docs/first-hf-lot-implementation-readiness-contracts-v1
SESSION_CONTINUITY            = SAME_CHAT_SAME_WORKTREE
MOVE_AGENT_TO_ROOT            = NOT_CALLED
NEW_WORKTREE_FOR_AGENT        = NOT_CREATED
```

## Method

1. Verified worktree, `HEAD`, and `origin/main` before writing. Identity matched. Working tree was clean. Created `docs/first-hf-lot-implementation-readiness-contracts-v1` with `git switch -c` from `origin/main`.
2. Read `AGENTS.md`, the active V1 roadmap, UI/UX direction canon, UI foundation canon, accepted IA worklog, visual-foundation worklog, first HF lot worklog, and the living Order / Quote / Commercial-price / Execution / People / Operator / Workcenters / Resources canons.
3. Read `apps/web/src/App.tsx`, jobs/quotes overview types, product/jobs/quotes HTTP routes, cloud membership roles, and commercial projection fields.
4. Inspected Figma `7elwvIscvMPDiEHrX4f6kQ` read-only for mapping. Confirmed login `67:3` and page 21 `64:11`. Lot page ids `64:2`–`64:11` unchanged. No Figma write tools.
5. Recorded honest absences for historical titles that are not files in this repository.
6. Wrote one contract file. Synced direction-canon and roadmap lag only. Did not edit the foundation canon as if the new shell exists.
7. Independent review against the Owner checklist. One local commit. No push.
8. Owner acceptance GO: recorded `/jobs/:jobId`, `/quotes/:quoteSnapshotId`, `ALT_B_SCOPED`. Amended the same commit. After PASS, normal-push feature branch and fast-forward `origin/main` via a temporary detached worktree.

## Identity

```text
IDENTITY                      = MATCH
BASE                          = origin/main e06a5365da6248249cfc2d0c41470add55788820
HEAD_AT_START                 = e06a5365da6248249cfc2d0c41470add55788820
```

## Findings

### Design vs runtime vs contracts

The first lot is Owner-accepted as visual baseline. Runtime still shows the foundation shell (`Produse`, light-only tokens, action-dependent hrefs). Contracts are `OWNER_ACCEPTED`. UI implementation is `NOT_STARTED` and `UI_IMPLEMENTATION_AUTHORIZED = NO`.

Direction canon records `HIGH_FIDELITY = FIRST_LOT_OWNER_ACCEPTED`, not `NOT_STARTED`. Visible runtime is still the current foundation.

### Job identity

Unambiguous. Commercial job = `OrderSnapshot`. `JobOverviewItem.jobId` already equals `orderSnapshotId`. Owner accepted `/jobs/:jobId`. `/orders/:orderSnapshotId` is rejected as the primary UI route. No Job entity. No Job table. `jobId` resolves from `orderSnapshotId`.

Loader gap remains: `GET /api/jobs/:jobId`. Existing order GET requires `productCode` in the path. Legacy `?order=` stays until the stable route is implemented and verified. `/execution/:planId` stays the plan workspace.

### Quote identity

Unambiguous. Owner accepted `/quotes/:quoteSnapshotId`. Lookup is product-code-free via `runtime.readQuoteSnapshot`. Display `OF-…` is not a key. Deep-link and refresh must not depend on list memory.

### Roles and money

Owner selected `MONEY_POLICY = ALT_B_SCOPED`. API / read-model enforcement is required. Owner: full financials. Member in Comercial and on Lucrări job detail: client net / VAT / gross only. Operator / Atelier / Execution: no financial payload, including client price. A `member` on those workshop read models still gets none. No `seller` role. No generic permission system.

Figma Operator 01 showing customer gross is superseded by the closed policy.

### Named historical sources

`21_WORKOS_IMPLEMENTATION_ROUTE.md` is absent here and already marked historical by the roadmap. Named “Flow / Boundary” titles are not files; living canons substitute. HR/pontaj/capacity stay `NOT_IMPLEMENTED`.

### Kit

Current UI is local CSS primitives. shadcn is not justified and is not selected.

## Owner decisions closed

```text
STABLE_JOB_ROUTE                  = /jobs/:jobId
STABLE_JOB_UNDERLYING_ID          = orderSnapshotId
JOB_ENTITY_INVENTED               = NO
STABLE_QUOTE_ROUTE                = /quotes/:quoteSnapshotId
STABLE_QUOTE_UNDERLYING_ID        = quoteSnapshotId
MONEY_POLICY                      = ALT_B_SCOPED
INTERNAL_COST_OWNER_ONLY          = YES
MARKUP_OWNER_ONLY                 = YES
MARGIN_OWNER_ONLY                 = YES
MEMBER_COMMERCIAL_PRICE_ONLY      = YES
OPERATOR_FINANCIAL_PAYLOAD        = NONE
SELLER_ROLE_CREATED               = NO
API_ENFORCEMENT_REQUIRED          = YES
```

Later only: Cloud role `seller`; Catalog label in the live shell.

## Risks

- Implementing `/execution/:planId` as job detail would leave ORDER_CREATED / RELEASED jobs without a URL.
- Remapping hrefs before loaders exist would break continue-into-configurator.
- CSS-hiding money while APIs still return EIC + markup is not a policy.
- Treating Cloud `member` as Owner because only two roles exist would reopen the lot’s operator hide.
- Restyling admin lists into a universal CRUD would violate domain ownership.
- Editing the foundation canon to say Catalog/shell already shipped would lie about runtime.

## Dead pieces

- Historical `21_WORKOS_IMPLEMENTATION_ROUTE.md` (not in repo; do not invent).
- Named flow/boundary documents that never lived here.
- Figma prototype `Pornește` unwired; Escape/focus specified, not engine-proven.
- Action-dependent `jobHref` / `quoteOverviewHref` as if they were stable detail URLs (legacy continue only).
- Any reading of Figma money chrome as authorization.

## Review

Independent pass after Owner acceptance was recorded. No product, UI, or CSS code is in the diff. Waves remain a plan.

| Lens | Result |
| --- | --- |
| Coherence | Accepted design, accepted contracts, and current runtime stay separate. `IMPLEMENTATION_READY = YES` is not a UI GO. Foundation canon not rewritten as live Catalog/shell. `HIGH_FIDELITY` is not `NOT_STARTED`. |
| Domain boundaries | `/jobs/:jobId` does not invent a Job table. `jobId` = `orderSnapshotId`. Quote loads by snapshot id. No `seller` role. HR/capacity/Analyzer out of scope. |
| Route / API feasibility | Job and quote routes are product-code-free and list-memory-free. Loaders remain unimplemented gaps. Legacy `?order=` stays until a later UI GO. No redirect in this GO. |
| Security / authorization | `ALT_B_SCOPED` is API-first. Owner full money. Member commercial = client prices only. Operator/Atelier/Execution = no financial payload. Member on workshop read models still `NONE`. |
| UX / IA | Lucrări language in the URL. `OF-…` is display only. Execution stays `/execution/:planId`. |
| Accessibility | Unchanged later requirements. Not claimed proven. |
| Scope guardian | Docs only. No React/CSS, no new runtime routes, no DB, no Cloud root, no Figma write. Feature-branch push and FF happen only after this PASS. |
| Adversarial | Later UI PR could still add a Job table or CSS-only money hide. Contracts forbid both. Lot Operator 01 gross must not override `OPERATOR_FINANCIAL_PAYLOAD = NONE`. |
| Canon ↔ roadmap ↔ Figma | Lot remains the accepted baseline. Contracts accepted. Runtime not presented as implemented HF. Next step is `FIRST_HF_LOT_UI_IMPLEMENTATION_OWNER_GO`. |

```text
PRODUCT_CODE_DIFF             = NONE
UI_CODE_DIFF                  = NONE
CSS_DIFF                      = NONE
FIGMA_WRITE                   = NO
REAL_CLOUD_ROOT               = UNTOUCHED
```

## Roadmap awareness

```text
ROADMAP_READ                  = YES
UI_UX_CANON_READ              = YES
HF_LOT_READ                   = YES
DIRECTION_CONFLICT            = NO
CURRENT_MILESTONE             = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP                     = FIRST_HF_LOT_UI_IMPLEMENTATION_OWNER_GO
IMPLEMENTATION_READINESS_GATE = CLOSED
IMPLEMENTATION_READY          = YES
UI_IMPLEMENTATION_AUTHORIZED  = NO
```

## Files changed

```text
docs/architecture/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS.md
docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md
docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md
docs/worklog/WORKOS_FIRST_HF_LOT_IMPLEMENTATION_READINESS_CONTRACTS_V1.md
```

Single contract truth is the architecture file. This worklog is the execution record. Roadmap holds state only. Direction canon holds accepted direction plus the known runtime lag.

## Stop

Owner decisions are recorded. No UI implementation started. `IMPLEMENTATION_READY = YES` is not permission to code.
