# UI20-H1 — Safe-delete manifest

```text
FIGMA_DELETED_COUNT = 0
REPO_FILES_DELETED_COUNT = 0
LOCAL_WORKTREES_REMOVED_COUNT = 0
REMOTE_BRANCH_DELETE = NO_BY_DEFAULT
```

Archive by default. A node may be deleted only if all gates are true **and** two independent reviewers agree `SAFE_TO_DELETE`.

## Gate (none passed)

| GATE | RESULT |
| --- | --- |
| NO prototype incoming links | not proven for candidates |
| NO unique outgoing prototype requirement | not proven |
| NO component/instance dependency | not proven |
| NO variable/style source dependency | not proven |
| NO current FRAMES.md requirement | historical IDs still cited |
| NO current roadmap/canon reference | worklogs cite IDs |
| NO unique state / responsive / dark / motion evidence | uncertain or unique |
| SUCCESSOR explicitly identified | sometimes |
| Two independent reviewers agree | NO — delete lane not opened |

## Inspected but kept

| ARTIFACT | WHY_NOT_DELETED | SUCCESSOR | REFERENCE_CHECK |
| --- | --- | --- | --- |
| R3 G1/G2 `29:2` `30:2` … | unique comparison | R5 NS + C1 | FRAMES historical index |
| R3A / S1 / PROP | unique signature path | S1-A docs | R3 worklog |
| R4 stress `73:161+` | unique chrome-off states | six-up is later, not identical | R4 worklog |
| DL1 raw extracts | unique INSTANCE_COUNT=0 proof | DL1A | DL1 worklog |
| 49:* unprefixed siblings | UNCERTAIN duplicate vs inner frame | wrappers on 99 | archived, not deleted |
| Design Reserve unused patterns | intentionally held | none | C1 / this map |
| Product-hold *absence* | hold is the fact | no screens | C1 coverage |

## Repo

No `_tmp` / `_before` / orphan temporary files. No accepted worklog deleted.

## Actual deletions

None.

If a later reviewer proves a duplicate with a named successor and a clean reference check, delete in a follow-up with one row per artifact. Do not bulk-clean.
