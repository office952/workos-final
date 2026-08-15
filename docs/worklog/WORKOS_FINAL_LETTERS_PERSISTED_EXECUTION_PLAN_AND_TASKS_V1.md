# WORKOS_FINAL_LETTERS_PERSISTED_EXECUTION_PLAN_AND_TASKS_V1

Baseline: `5b223d1dbce1c9066b7facb1c06296eaa468421e`

Persisted ExecutionPlan + ExecutionTasks from AcceptedProductionSnapshot.
SHA-256 replaced 32-bit FNV-1a for snapshot content identity.
The digest is the standard SHA-256 of the canonical payload so the domain package stays usable in API and web without a Node-only crypto import.
Development snapshot rows were reset by migration `003`.

## Law

Snapshot → plan → tasks.
Same snapshot returns the existing plan.
Required capability is frozen. Eligible providers are live. Assignment stays empty.

## Canonical none/none

12 frozen operations → 12 planned tasks. EIC reference 595.00 EUR PARTIAL.
No Start / Complete.

## Deferred

Provider assignment. Minimal Start/Complete lifecycle. Actuals.
