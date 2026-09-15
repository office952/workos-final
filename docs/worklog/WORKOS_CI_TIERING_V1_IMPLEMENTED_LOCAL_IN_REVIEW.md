# WorkOS CI tiering V1 — implemented locally, in review

```text
ROLE                       = EVIDENCE
OWNS                       = THIS_SLICE_RECORD
DOES_NOT_OWN               = PRODUCT_TRUTH, LIVE_GITHUB_STATE, OWNER_ACCEPTANCE
AUTHORITY                  = WORKOS_CI_TIERING_V1
IMPLEMENTATION             = YES
OWNER_ACCEPTED             = NO
MERGE                      = NO
PRODUCT_TRUTH_EXPANSION    = NO
FIGMA_WRITE                = NO
REAL_CLOUD_WRITE           = NO
FC2_AUTHORIZED             = NO
LAST_RECONCILED_MAIN_BASE  = debf5182a657e2794b873b74707d842c816d4f08
```

This worklog is evidence. It is not Owner acceptance and not a second roadmap.

## Scope

Change-aware GitHub CI, deterministic path classification, removal of duplicate feature-branch push + PR full CI, concurrency cancel of stale PR runs, explicit Owner scope-authorization law, and post-PR27 main-base reconciliation.

No product app, domain, API, DB, Cloud, or Figma mutation.

## CI model

```text
CI_MODEL_BEFORE            = push + pull_request, one full job including Chromium E2E
CI_MODEL_AFTER             = pull_request authoritative + main post-merge safety + workflow_dispatch full
FEATURE_BRANCH_PUSH_CI     = NO after this workflow is on main
AUTHORITATIVE_CI           = PULL_REQUEST
EXACT_HEAD_RELEVANT_CI     = REQUIRED_BEFORE_INTEGRATION
AMBIGUOUS_IMPACT           = TIER_4_CONSERVATIVE_FULL
```

Tiers: docs → `docs:check` only. Static/logic → docs:check, lint, typecheck, test, build. Runtime and conservative full → previous plus Chromium E2E.

`main` keeps the same classified job as post-integration safety. The Owner does not wait for it unless it fails. That is an Owner-authorized cheaper main path: a docs-only merge does not re-run Chromium on main. Product/runtime PRs still require E2E before merge. Classification fails closed if GitHub outputs are missing. Renames are collected with `--no-renames`. Workflow/classifier/package/`.cursor/` paths also force full from YAML, not only from HEAD's classifier. Unknown `scripts/**` executables are TIER_4. Known-safe static scripts are only the docs continuity validators. TIER_4 runs `pnpm cursor:harness:test` as an authoritative CI gate.

This migration PR itself is TIER_4. Until the new workflow is on main, the old main workflow may still run full CI on the feature-branch push. That is transitional evidence only.

## Owner interaction law

```text
OWNER_APPROVAL_MODEL               = SCOPE_AUTHORIZATION_NOT_COMMAND_AUTHORIZATION
ROUTINE_APPROVAL_PROMPTS           = 0
ROUTINE_COMMAND_CONFIRMATION       = FORBIDDEN
```

## Tests

Classifier unit cases 1–10, `pnpm docs:check`, lint, typecheck, test, build, repository-authorized isolated E2E.

```text
OWNER_UPDATE_LINKS
PURPOSE            = OWNER_AWARENESS
APPROVAL_REQUIRED  = NO
```
