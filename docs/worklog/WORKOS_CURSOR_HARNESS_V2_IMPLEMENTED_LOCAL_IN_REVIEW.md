# WorkOS Cursor Harness V2 — implemented local, in review

```text
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                 = NO
COMMIT                         = NO
PUSH                           = NO
MERGE                          = NO
BRANCH                         = chore/cursor-workos-harness-v2
WORKTREE                       = C:\Users\offic\workspace\workos-cursor-harness-v2
BASE_HEAD                      = c64543a0da21cb548b6b53ad5429c0dcecfdb833
PRODUCT_CODE_CHANGED           = NO
FORM_COMPLETENESS_STARTED      = NO
```

## Purpose

Persistent Cursor engineering control plane before Configurator Form Completeness.
Harness V2 is tooling methodology only. It is not Product Truth and not a second roadmap.

## Lane C disagreement kept visible

Independent red-team argued against:

- any living-roadmap field change
- named custom reviewers
- an always-on orchestration rule
- project hooks

Owner GO required those pieces. Writer implemented them with the documented mitigations (`failClosed: false`, ASK for commit/push, no command audit, no permissions files, no nested AGENTS.md). The disagreement is not suppressed.

## Amendment record

Living roadmap `NEXT_RECOMMENDED_BUILD` is `CONFIGURATOR_FORM_COMPLETENESS`.
`CURRENT_TOOLING_ENABLEMENT` is `CURSOR_WORKOS_HARNESS_V2`.
Historical UI20 blocks were not rewritten.

Hook law: readonly git and classified verification ALLOW; commit / normal push / worktree add-remove ASK; force-push and high-confidence destructive DENY; opaque wrappers DENY; direct Playwright / `pnpm e2e` DENY; isolated runner ALLOW; uncertain ASK.

```text
HOOKS_ARE_ACCIDENT_GUARDRAILS = YES
HOOKS_ARE_SECURITY_SANDBOX = NO
CATASTROPHIC_HOOK = DEDICATED_HARD_DENY
```

## Synthetic evidence (not Owner acceptance)

```text
COMMAND = node --test .cursor/hooks/classify-shell.test.mjs .cursor/hooks/catastrophic-matcher.test.mjs .cursor/setup-worktree.test.mjs .cursor/agents/agent-schema.test.mjs .cursor/run-isolated-e2e.test.mjs
RESULT  = 30 pass / 0 fail
```

## Live hook probes on Cursor 3.20.21

```text
HOOK_ALLOW_RUNTIME_BEHAVIOR = ENFORCED
  git status executed and printed worktree status
HOOK_ASK_RUNTIME_BEHAVIOR   = IGNORED
  git commit --dry-run executed immediately; no approval pause observed
HOOK_ASK_SECURITY_GATE      = NO
HOOK_DENY_RUNTIME_BEHAVIOR  = ENFORCED
  git push --force --dry-run to a fake remote was blocked by a hook before shell execution
```

ASK remains a classifier/audit signal. It is not a mechanical human-approval gate.

Direct `pnpm e2e` and ordinary Playwright entrypoints are DENY. Isolated runner is `node .cursor/run-isolated-e2e.mjs`.
Isolated child env also strips Cloud/Playwright override keys and sets `CI=1` so Playwright will not reuse 5173/8787.
Worktree and isolated Windows launcher is `pnpm.cmd` with `shell: true`. The same resolution path probes `pnpm --version` without install.
Worktree install child env removes WorkOS Cloud/SQLite pointers. PATH stays.
The Harness runner does not invoke migrate/seed against an existing or real database. Disposable schema init inside `.tmp/isolated-e2e/<token>` is expected test initialization.
