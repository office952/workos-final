# Minimum organization operational configuration V1

Status: `implementation_ready`
Base: `main` `0e0bf35`

## Architecture decision

```text
AUTHORITY = Operational Plane SQLite (per organization)
NOT Control Plane provider profile
NOT env-only / in-memory registry
NOT NEW_ORGANIZATION default machines
```

`WorkcenterRegistry` for `NEW_ORGANIZATION` / `SYNTHETIC_TEST` stays empty until an explicit CLI/service write. Runtime reloads that registry from the Operational Plane DB, so restart and in-process apply both see the same rows. Single-plane and `ADOPT_EXISTING` keep the code catalog. No org-name branching. No Machine Admin UI.

## Units

1. Generic operational skill foundation (no people) on NEW_ORGANIZATION / SYNTHETIC_TEST; reused by trusted workforce.
2. Cloud eligibility fail-closed when capability mappings are missing; single-plane may keep permissive `null`.
3. Persistent org provider tables + CLI `--organization-id` + `--dry-run`/`--execute`.
