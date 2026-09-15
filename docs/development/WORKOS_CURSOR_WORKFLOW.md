# WorkOS Cursor workflow

```text
ROLE                       = AUTHORITY
OWNS                       = HOW_WE_USE_CURSOR_FOR_WORKOS
DOES_NOT_OWN               = PRODUCT_TRUTH, DELIVERY_SEQUENCE, PLUGIN_INVENTORY, FIGMA_FRAMES
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = NO
LAST_RECONCILIATION_RULE   = UPDATE_WHEN_HARNESS_OR_OWNER_GO_METHOD_CHANGES
```

This is the WorkOS method for Cursor. Available tools live in `docs/CURSOR_PLUGINS.md`. Do not treat that inventory as this method, and do not treat this method as Product Truth.

## Method versus tools

| Layer | Owns |
|---|---|
| METHOD (this file) | Plan Mode, one writer, specialists, Browser, isolated E2E, red-team, exact-head CI, Owner GO, reporting |
| AVAILABLE TOOLS | Plugin / MCP / skill inventory and classification |

## Current WorkOS method

```text
CURSOR_MAX_CAPABILITY              = DEFAULT
CURSOR_MAX_PARALLELISM             = NO
PLAN_MODE                          = COMPLEX / ARCHITECTURAL / UNCLEAR WORK
ONE_WRITER                         = DEFAULT FOR SHARED PRODUCT CODE
READONLY_SPECIALISTS               = INDEPENDENT VERIFICATION
BROWSER                            = UI / RUNTIME CLAIMS
ISOLATED_E2E                       = REPOSITORY_AUTHORIZED_RUNTIME_TEST_PATH
RED_TEAM                           = IMPORTANT / HIGH-RISK IMPLEMENTATION
EXACT_HEAD_RELEVANT_CI             = REQUIRED_BEFORE_INTEGRATION
CI_TIERING                         = CHANGE_IMPACT_BASED
AMBIGUOUS_IMPACT                   = CONSERVATIVE_FULL
OWNER_GO                           = SCOPE / WORKFLOW AUTHORIZATION
OWNER_APPROVAL_MODEL               = SCOPE_AUTHORIZATION_NOT_COMMAND_AUTHORIZATION
ROUTINE_APPROVAL_PROMPTS           = 0
ROUTINE_COMMAND_CONFIRMATION       = FORBIDDEN
CUSTOM_HOOK_ASK                    = FORBIDDEN
UNKNOWN_COMMAND_BEHAVIOR           = DENY_REFORMULATE_AUTONOMOUSLY
MALFORMED_COMMAND_BEHAVIOR         = DENY_REFORMULATE_AUTONOMOUSLY
OWNER_COMMAND_APPROVAL             = ROUTINE_NEVER
HARD_GATE_BEHAVIOR                 = DENY
SAFE_ROUTINE_BEHAVIOR              = ALLOW
```

Complex, multi-file, or unclear work starts in Plan Mode. A rule cannot flip the IDE mode.

Independent research uses readonly specialists (`workos-product-truth-reviewer`, `workos-runtime-evidence-reviewer`). Shared product code has one writer. Do not launch an agent swarm for appearance.

UI or runtime claims need the first-party Browser and repository tests. Isolated E2E is `node .cursor/run-isolated-e2e.mjs`. Direct `pnpm e2e` is harness-denied.

After high-risk or tooling work, run `workos-red-team`. Do not assume PASS.

## UI design roundtrip

UI/UX changes must follow `docs/development/WORKOS_FIGMA_WORKFLOW.md` and `docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md`.

For an existing accepted surface, default to:

```text
PRODUCT / DOMAIN CONTRACT
→ CURSOR FUNCTIONAL IMPLEMENTATION
→ RUNTIME + TESTS + BROWSER EVIDENCE
→ CHATGPT INDEPENDENT REVIEW
→ RUNTIME / SOURCE HTML → FIGMA
→ FIGMA POLISH
→ OWNER / CHATGPT DESIGN REVIEW
→ OWNER_ACCEPTED_DESIGN
→ CURSOR DESIGN-DELTA IMPLEMENTATION
→ RUNTIME PARITY
→ CURRENT_VALID_MIRROR
```

Cursor owns logic and functional reality. Figma may polish presentation but cannot silently alter Product Truth, fields, allowed values, requiredness, validation, readiness, formulas, pricing, permissions, lifecycle or execution semantics.

Before implementing a Figma polish delta, classify each material difference as presentation or semantic. Presentation deltas may be implemented under a UI scope. Semantic/Product Truth deltas require a separate Owner/domain decision.

Every canonical Figma state must be recorded in the Figma ↔ runtime registry. Do not rely on remembered node ids from chat or a stale report.

For a new major surface whose layout/floorplan itself is undecided, research and Figma direction may precede implementation; Owner direction acceptance remains separate from runtime implementation acceptance.

## Hard gates

These remain closed unless an Owner GO explicitly opens the named gate:

- merge
- force push
- direct main push
- destructive git
- real Cloud write
- real business DB
- credentials
- Product Truth expansion
- Figma publish / write

Owner GO authorizes **scope**, not individual command syntax. It is not Owner acceptance of the product.

## Owner approval model

```text
OWNER_APPROVAL_MODEL               = SCOPE_AUTHORIZATION_NOT_COMMAND_AUTHORIZATION
ROUTINE_APPROVAL_PROMPTS           = 0
ROUTINE_COMMAND_CONFIRMATION       = FORBIDDEN
CUSTOM_HOOK_ASK                    = FORBIDDEN
UNKNOWN_COMMAND_BEHAVIOR           = DENY_REFORMULATE_AUTONOMOUSLY
MALFORMED_COMMAND_BEHAVIOR         = DENY_REFORMULATE_AUTONOMOUSLY
OWNER_COMMAND_APPROVAL             = ROUTINE_NEVER
HARD_GATE_BEHAVIOR                 = DENY
SAFE_ROUTINE_BEHAVIOR              = ALLOW
```

Once the Owner has authorized a wave or scope, Cursor must autonomously run every routine reversible command needed to finish that work. Do not ask whether to fetch, inspect, lint, test, build, run isolated E2E, commit, push the feature branch, or create the PR.

The WorkOS `beforeShellExecution` hook has only two outcomes: ALLOW or DENY. It must not emit `permission=ask`. ASK from this Harness is what produced Owner “Run?” cards. That path is closed.

Known safe / routine / reversible commands ALLOW. Hard gates DENY. Unknown, malformed, or unparseable formulations DENY with an agent reformulation instruction. DENY is not an Owner approval request.

When a routine command is denied because its formulation is unsupported, Cursor must:

1. understand the intended operation
2. select a safe supported equivalent
3. retry autonomously
4. continue the task

Cursor must not surface an Owner Run approval request, ask whether it should continue, or ask the Owner to choose shell syntax. Only a genuine scope or authority decision may interrupt the Owner.

Routine autonomous operations include, when relevant: `git fetch` / `status` / `diff` / `log` / `show`, worktree inspection, `pnpm install --frozen-lockfile`, `pnpm docs:check`, lint, typecheck, test, build, repository-authorized isolated E2E, Browser inspection, read-only MCP, normal commit, normal feature-branch push, PR create, and CI inspection. Direct Playwright and `pnpm e2e` stay harness-denied; use `node .cursor/run-isolated-e2e.mjs`.

Repo-local temporary Node helpers are DENY. The hook can prove a `.tmp/` path but cannot prove the script body is non-destructive, so a helper must not become an opaque wrapper. Use a native Cursor/MCP/file/browser operation, or an already-classified command, and continue autonomously.

Stop only for a true Owner decision / hard gate: merge, force push, direct main push, destructive git, destructive data, real Cloud write, real business DB write, credentials, Product Truth expansion, Figma write/publish, authority expansion, or unexpected scope change.

Ask about the decision (`Owner GO — MERGE PR #X?`), not the command (`May I run gh pr merge?`).

Native OS or Cursor sandbox permission dialogs are platform enforcement. This program eliminates WorkOS Harness-generated prompts only. It does not claim control over native Cursor or OS security dialogs. The Harness must not add a second approval layer.

## CI tiering

```text
EXACT_HEAD_RELEVANT_CI             = REQUIRED_BEFORE_INTEGRATION
CI_TIER                            = DETERMINED_BY_CHANGE_IMPACT
AMBIGUOUS_IMPACT                   = CONSERVATIVE_FULL
```

Exact-head means the required checks for the classified tier succeeded on the PR head SHA. It does not mean full E2E for every documentation change. Product/runtime changes still require E2E. Unknown or CI-infrastructure changes escalate to conservative full.

| Tier | When | Required |
|---|---|---|
| TIER_1_DOCS | ordinary docs under `docs/`, README, AGENTS, worklog evidence | `pnpm docs:check` |
| TIER_2_STATIC_LOGIC | known-safe static scripts only, currently docs continuity validators | docs:check, lint, typecheck, test, build |
| TIER_3_RUNTIME_E2E | `apps/web`, `apps/api`, `packages/domain`, `e2e` | previous plus Chromium E2E |
| TIER_4_CONSERVATIVE_FULL | CI, classifier, package.json, Playwright, Cursor Harness, unknown scripts | full set plus `pnpm cursor:harness:test` |

Authoritative CI is the pull request. Feature-branch push without a PR does not run GitHub CI. `main` push may run the same change-aware job as post-integration safety; it is not an Owner wait gate unless it fails. `workflow_dispatch` can force full CI.

Locally, classify against `origin/main` plus the working tree (`node scripts/run-local-ci-tier.mjs`). For TIER_3/4 runtime proof use `node .cursor/run-isolated-e2e.mjs`. Direct `pnpm e2e` remains harness-denied on the agent machine.

Do not ask the Owner which verification commands to run. Cursor chooses the tier and executes it.

## Reports are not acceptance

```text
CURSOR_REPORT                      = EVIDENCE_ONLY
CHATGPT_REVIEW                     = INDEPENDENT_DECISION
OWNER_ACCEPTANCE                   = SEPARATE_STATE
INTEGRATION                        = SEPARATE_STATE
```

A green report, a ChatGPT review, and a merged PR are three different facts.

## Continuity preflight

At the start of a future session:

1. Read `docs/continuity/WORKOS_SESSION_CURRENT.md`
2. Read `AGENTS.md`
3. Read the living roadmap
4. Read the authority map
5. Read only applicable canons
6. Fetch / verify live GitHub main
7. Verify active PR / CI if one exists
8. Verify Figma live only when material
9. Verify plugin / MCP status before claiming availability

If recorded state, live GitHub, living roadmap, or applicable canon contradict:

```text
CONTINUITY_CONTRADICTION = YES
```

Do not start implementation. Report the exact contradiction.

If cached documentation is merely older than live GitHub:

```text
HANDOFF_STALE      = YES
LIVE_GITHUB_WINS   = YES
```

Reconcile the durable docs before a decision that depends on the stale state. No silent guessing.

## Session close

At a stable checkpoint:

1. Verify live GitHub
2. Reconcile living roadmap
3. Reconcile worklog
4. Reconcile `WORKOS_SESSION_CURRENT.md`
5. Reconcile terminology if affected
6. Reconcile Figma authority if affected
7. Reconcile Cursor / tool status if affected
8. Record Owner decisions and advisories
9. Record next product gate
10. Contradiction check

Target:

```text
CONTINUITY_CONTRADICTIONS  = 0
NEXT_GATE_UNAMBIGUOUS      = YES
SESSION_CONTINUITY         = COMPLETE
SESSION_HANDOFF_READY      = YES
```

This is methodology. Cursor and ChatGPT cannot autonomously wake each other.

## Implementation report

Every implementation report must include:

```text
ROADMAP_READ
UI_UX_CANON_READ          when the work is UI/UX
DIRECTION_CONFLICT
CONTINUITY_PREFLIGHT      = PASS | FAIL
```

And must end with Owner awareness links. Those links are not an approval request.

```text
OWNER_UPDATE_LINKS
PURPOSE            = OWNER_AWARENESS
APPROVAL_REQUIRED  = NO
```

When applicable include direct URLs for PR, commit, branch, important changed files, Figma file/section/frame, runtime route, exact-head CI, roadmap, and worklog.

If nothing was modified:

```text
OWNER_UPDATE_LINKS
MODIFICATIONS = NONE
```

Current-state links may still be given when useful.

## Documentation impact

Follow `docs/governance/WORKOS_DOCUMENTATION_GOVERNANCE.md`. Code green + stale canon is not closed.
