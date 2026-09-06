# WORKOS Cloud — Control Plane migration concurrency stabilization (CP-MIG1)

```text
GO                         = OWNER_DELEGATED_CP_MIG1
BRANCH                     = fix/cloud-control-plane-migration-concurrency-ir1a
BASE_HEAD                  = 4f72bfdc36c6769dbc9e02d3e04895ed615c6252
BLOCKER_FOR                = UI20_IR1A_INTEGRATION
REAL_DATA                  = NO
CLOUD_WRITE                = NO
PRODUCTION_PROVISION       = NO
MIGRATION_FILE_WRITE       = NO
TEST_ALLOWED_OUTCOMES      = UNCHANGED
```

## Observed failure

While integrating UI20 IR1A docs on head `4f72bfd…`, CI failed once and local stress of
`keeps one initial owner across two processes` reproduced:

```text
REPRO_RATE_BEFORE          = 5/25 FAIL (local IR1A head)
LOSER_CODE                 = SQLITE_ERROR
LOSER_MESSAGE              = table organizations already exists
FAILURE_PHASE              = CONTROL_PLANE_OPEN → MIGRATION APPLY
```

GitHub rerun of the same SHA later succeeded — intermittent CI mask over a real race.

## Root cause

`applyControlPlaneMigrations` created `schema_migrations`, read applied IDs, then applied each
missing file in its own deferred transaction. Two fresh processes could both observe
`001` as missing and both execute non-idempotent `CREATE TABLE organizations`.

Contributing factor: Control Plane SQLite had no `busy_timeout` (operational SQLite uses 5000).

## Fix

In `apps/api/src/persistence/controlPlaneSqlite.ts`:

1. Configure Control Plane like operational SQLite: `foreign_keys`, `busy_timeout = 5000`, WAL.
2. Run bootstrap + applied-id read + DDL + ledger inserts inside **one** `BEGIN IMMEDIATE` transaction.
3. Close the DB handle before rethrow if open/configure/migrate fails.

Migration SQL files unchanged. Domain loser codes unchanged (`SQLITE_ERROR` still invalid).

## Tests

- New: `control-plane-migration-concurrency.test.ts` + open worker
  (two-process fresh open + reopen already-migrated).
- Existing strict two-process provision test unchanged.

## Evidence (filled after gates)

```text
STRESS_AFTER               = 30/30 PASS (keeps one initial owner across two processes)
SQLITE_ERROR_COUNT         = 0
DUPLICATE_TABLE_COUNT      = 0
FULL_LOCAL_TESTS           = PASS (pnpm lint + typecheck + test + build)
CI_EXACT_FIX_HEAD          = <pending push>
MAIN_EXACT_FIX_HEAD_CI     = <pending FF>
```
