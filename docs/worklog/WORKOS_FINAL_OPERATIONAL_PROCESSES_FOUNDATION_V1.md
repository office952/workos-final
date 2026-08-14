# WORKOS_FINAL_OPERATIONAL_PROCESSES_FOUNDATION_V1

## Baseline

- Repo: `office952/workos-final`
- Branch: `main`
- Expected baseline: `73474e93c69a4d1cd4ef54e9df3a4993ceb7af5b`

## Legacy audit

Current repo had no process catalog. FACE/BACK gaps named „Debitare CNC”. VOLUME consumed `return_cant_forming` as a SERVICE cost row, not as HOW.

Canon already rejected three parallel legacy task truths: dossier rules, Intake dry-run tasks, product-graph lists. Machine SKU on process is a rejected pattern. Architectural `capabilities.ts` IDs are system ownership, not shop-floor capability.

`office952/workos-vscode` was not present locally; rejected patterns were taken from the current administration map, not copied as code.

## Accepted process model

```text
COMPONENT / PRODUCT
  → PROCESS REQUIREMENT (derived applicability)
    → OPERATIONAL PROCESS
      → CAPABILITY CLASS
        → later WORKCENTER / MACHINE
        → later EXECUTION TASK
```

`return_cant_forming` remains the SERVICE price row.
`FORM_ALUMINIUM_PROFILE` is the process that may consume it.

## Current process set

| ID | Readiness | Why included |
|---|---|---|
| `CUT_SHEET_CNC` | KNOWN_PROCESS | Reusable machine process; FACE + BACK |
| `FORM_ALUMINIUM_PROFILE` | IMPLEMENTED_PROCESS_FOUNDATION | Live service link; VOLUME |
| `APPLY_SURFACE_FINISH` | PLANNED | Finish exists as order config |
| `BOND_LETTER_BODY` | PLANNED | Manual process without employee |
| `PLACE_LED_MODULES` | BLOCKED | Lighting / PSU incomplete |

QC, packing, installation, and a full DAG were left NOT_YET_MODELLED.

## Capability model

CNC_ROUTING, PROFILE_FORMING, MANUAL_ASSEMBLY, VINYL_APPLICATION, ELECTRICAL_ASSEMBLY.
Kinds: MACHINE / WORKSTATION / HUMAN_SKILL.
No machine IDs. No reuse of PRODUCT/EXECUTION kernel IDs.

## Component applicability

Derived from `applicableTypeIds`. Not copied into ProductTemplate or `calculate()`.

## Boundaries

- Resources: forming references the service; process does not own amount/currency
- EIC: unchanged 320.50 EUR
- Machines / workcenters: documented relation only
- Execution: future task may store `processId`; catalog has no instance fields
- Dependencies: no global sequence; composition later

## Cleanup

No process arrays were found on templates. No machine coupling to remove. CNC remains a gap on FACE/BACK calculation, now also a named process.

## UI

`/admin` → Procese operaționale: Categorii / Procese / Capabilități necesare. Read-only.
`/components` shows process labels on the type. `/products` unchanged.

## Tests

- `pnpm lint` PASS
- `pnpm typecheck` PASS
- `pnpm test` PASS (domain 87, api 17, web 17)
- `pnpm build` PASS
- `pnpm e2e` PASS (6)
- `git diff --check` PASS

Canonical product EIC remains 320.50 EUR PARTIAL.

## Persistence

Typed catalog. No process SQLite table. No write.

## Remaining gaps

- Product/process composition for Letters
- Workcenters / Machines
- Labor recipes
- CNC pricing / geometry
- Lighting after PSU
- Process write

## Next recommendation

Re-evaluate among: Letters process composition, Workcenters/Machines, Lighting after PSU, versioned settings write, labor recipes. Do not auto-pick.
