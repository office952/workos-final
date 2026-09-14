# WorkOS Cursor Harness V2 — autonomy cleanup V1

```text
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                 = NO
COMMIT                         = YES
PUSH                           = YES
MERGE                          = NO
BRANCH                         = chore/cursor-workos-harness-v2
PR                             = 25
PRODUCT_CODE_CHANGED           = NO
FORM_COMPLETENESS_STARTED      = NO
```

## Purpose

Remove routine Owner approval fatigue and close the remaining holes before PR #25 integration:

- `git push origin HEAD` while the current branch is `main`/`master`
- `gh api` merge bypass left as ASK
- `git commit` prefix allowlist covering `--amend`

This is a targeted usability correction. It is not a Harness redesign and not product work.

## Law

```text
OWNER_GO                         = WORKFLOW-SCOPE AUTHORIZATION
PERMISSIONS_ALLOWLIST            = CONVENIENCE_FOR_READONLY_AND_VERIFICATION
STATE_CHANGING_ROUTINE_AUTHORITY = OWNER_GO + CONTEXTUAL_HOOK
HOOKS                            = ACCIDENT_GUARDRAILS
HOOKS_ARE_ACCIDENT_GUARDRAILS    = YES
HOOKS_ARE_SECURITY_SANDBOX       = NO
AUTO_REVIEW                      = CURSOR_REVIEW_LAYER
ONE_WRITER                       = SOCIAL_PROCESS_LAW
PERMISSIONS_SECURITY_BOUNDARY    = NO
HOOK_SECURITY_BOUNDARY           = NO
AUTO_REVIEW_SECURITY_BOUNDARY    = NO
```

None of these layers is a security boundary. The catastrophic DENY hook remains the deterministic backstop for the small set of known destructive commands.

## Cursor evidence

```text
CURSOR_VERSION = 3.20.21
RUN_MODE       = AUTO_REVIEW
DOCS_READ      = cursor.com/docs/reference/permissions
                 cursor.com/docs/agent/security/run-modes
                 cursor.com/docs/hooks
USER_PERMISSIONS_FILE = ABSENT
```

Official prefix semantics: `git` matches every git command. Project `terminalAllowlist` therefore keeps only read-only git, verification, isolated E2E, diagnostics, and GitHub inspection. It does not allowlist `git add`, `git commit`, `git push`, or `gh pr create`.

## Classifier change

- Normal `git add` and normal `git commit` (including one-shot `git -c user.name=... commit`) are ALLOW.
- `git commit --amend` / `--fixup` / `--squash` are not routine ALLOW.
- `git push origin HEAD` / `-u` / `--set-upstream` resolve the current branch read-only from hook `cwd`. ALLOW only when the branch is non-empty and not `main`/`master`. Resolution failure is DENY.
- Explicit main/master push and all force-push forms stay DENY.
- `gh pr create` / view / checks and `gh run view` / list are ALLOW.
- `gh pr merge` and `gh api` `/pulls/<n>/merge` or `/merges` are DENY.

## Residual risks (not claimed closed)

- Repo `terminalAllowlist` concatenates with any later user-level `permissions.json`.
- OWNER_GO is process law. The classifier cannot see task authorization.
- One-writer remains social law.
- GitHub branch protection is not evidenced here.
- `git -C other-repo push origin HEAD` still resolves the hook `cwd`, not the `-C` path.
- If hook input omits `cwd` or sends an empty `cwd`, `before-shell` falls back to `process.cwd()`. The classifier still DENYs when that directory has no current branch or the branch is `main`/`master`.
- Git `-c alias.*` overrides and `gh api graphql` mergePullRequest / mergeBranch are DENY in this slice. Other non-obvious write APIs remain ASK.

```text
HARNESS_TESTS = 34 / 34 PASS
```
