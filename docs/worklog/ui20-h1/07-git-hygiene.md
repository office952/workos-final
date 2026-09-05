# UI20-H1 — Git hygiene

```text
HISTORY_REWRITE = NO
FORCE = NO
REMOTE_BRANCH_DELETE = NO
LOCAL_WORKTREES_REMOVED_COUNT = 0
```

Read-only inspect. Prefer candidates over cleanup.

## Identity at H1 write

| REF | SHA |
| --- | --- |
| `origin/main` | `1533892bb16b54baf78714ae1dcba86b35f88172` |
| H1 branch | `design/ui20-h1-design-hygiene` |
| H1 base | same as `origin/main` (C1 closure) |
| C1 integrated head | `03be0962faa265257a05460f0093c3715e499012` |
| C1 PR | #19 MERGED (strict FF, no merge commit) |

This worktree cannot check out `main` because `C:/Users/offic/workspace/workos-final-pr7-integrate` already has `main`. That worktree's local `main` is **stale** (`aed8c3c`, behind `origin/main`). Do not delete that worktree from H1; it belongs to another program.

## Worktrees

Many sibling worktrees exist under `C:/Users/offic/workspace/`. All classified `KEEP_FOR_ACTIVE_WORK` or `UNKNOWN`. None are objectively dead-only-H1 artifacts.

| CLASS | ACTION |
| --- | --- |
| SAFE_LOCAL_CLEANUP | none taken |
| KEEP_FOR_ACTIVE_WORK | current UI20 H1 worktree; other program worktrees |
| UNKNOWN | detached-HEAD integrate worktrees |

## Stashes

Three stashes exist (`ui-fc1b-held-not-canon`, product-batch WIP, architecture-c planning). `KEEP_FOR_ACTIVE_WORK`. Not dropped.

## Remote branch delete candidates

Report only. Not deleted.

| BRANCH | WHY CANDIDATE | RISK |
| --- | --- | --- |
| `design/ui20-c1-application-coverage` | PR #19 merged; tip `03be096` is ancestor of `origin/main` | low, still useful as named C1 tip |
| `design/ui20-dl1-design-language-foundations` | DL1 closed and integrated | low; confirm PR #18 closed before any delete |
| older merged `design/ui20-r*` | waves closed | keep until Owner wants remote tidy |

Open or unmerged UI20 / feature branches stay `KEEP_FOR_ACTIVE_WORK`.

## Untracked temporary artifacts

None in this worktree at inventory (`git status` showed only the C1 closure-head line until H1 docs were added).
