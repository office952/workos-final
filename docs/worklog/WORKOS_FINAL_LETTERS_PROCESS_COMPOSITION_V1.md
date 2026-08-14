# WORKOS_FINAL_LETTERS_PROCESS_COMPOSITION_V1

## Baseline

- Repo: `office952/workos-final`
- Branch: `main`
- Expected baseline: `b15aafb7250ffd04e9f74ef05a0dc1e02e1cfffb`

## Evidence audit

Current product: `PRD-LETTERS-FRONTLIT-PLEXI-AL06`.
FACE finish is `none | vinyl`. VOLUME finish is `none | vinyl | painted`.
All four roles are required.

`office952/workos-vscode` was not used as a writable source. Owner-confirmed current canon wins over any legacy task catalog. Owner evidence used for vinyl-before-forming on VOLUME. Painted/RAL order is not invented.

## Composition law

```text
PROCESS DEFINITION ≠ PROCESS COMPOSITION ≠ EXECUTION INSTANCE
```

One compiler: `composeProductProcesses`.
Component types expose the same requirement contract standalone and in the product.
The product adds `BODY:BOND_LETTER_BODY` and explicit dependency edges.
No DAG on ProductTemplate. No DAG inside ProductAggregate / `calculate()`.

## Letters composition

| Node | Classification | Notes |
|---|---|---|
| `FACE:CUT_SHEET_CNC` | REQUIRED_ALWAYS | Required, incomplete (no CNC geometry/price) |
| `FACE:APPLY_SURFACE_FINISH` | REQUIRED_CONDITIONALLY | Only `face.finish = vinyl` |
| `VOLUME:APPLY_SURFACE_FINISH` | REQUIRED_CONDITIONALLY | Only `volume.finish = vinyl`; before forming |
| `VOLUME:FORM_ALUMINIUM_PROFILE` | REQUIRED_ALWAYS | Live service cost remains in Resources |
| `BACK:CUT_SHEET_CNC` | REQUIRED_ALWAYS | Same process definition, distinct node |
| `BODY:BOND_LETTER_BODY` | REQUIRED_ALWAYS when FACE+VOLUME selected | Depends on prepared FACE and formed VOLUME |
| `LIGHTING:PLACE_LED_MODULES` | REQUIRED_ALWAYS | Required but blocked (PSU / lighting) |

Painted volume is not vinyl. Missing process `paint-volume` = `UNKNOWN_OWNER_DECISION`.

`APPLY_SURFACE_FINISH` label is now **Aplicare folie**. Capability stays `VINYL_APPLICATION`.

## Derived order

Topological projection only. No global sequence authority.

Typical vinyl order includes: FACE cut → FACE vinyl; VOLUME vinyl → VOLUME form; then BODY bond. BACK cut is parallel. Lighting has no invented electrical/closure edges.

## Missing processes

| Gap | Classification |
|---|---|
| Vopsire volum | UNKNOWN_OWNER_DECISION |
| Cablare electrică | LATER |
| Montare sursă de alimentare | BLOCKED |
| Închidere corp / prindere spate | LATER |
| Probă funcțională | LATER |
| Control calitate | LATER |
| Ambalare | LATER |

Completeness: **BLOCKED**. Not production-ready.

## UI

`/admin` → Procese operaționale → Compoziții produse:
Fără finisaj / Colantat față și volum / Volum vopsit.

Romanian labels: Proces, Depinde de, Condiție, Componentă/secțiune, Stare, Blocaj.
IDs stay under Tehnic.
`/components` shows the type contract (always + conditional vinyl), not the full graph and not bonding on FACE.

## API

- `GET /api/operational-processes` includes `compositions`
- `GET /api/products/:productCode/process-composition` read-only
- No write. No persistence.

## Tests

- `pnpm lint` PASS
- `pnpm typecheck` PASS
- `pnpm test` PASS (domain 97, api 18, web 17)
- `pnpm build` PASS
- `pnpm e2e` PASS (7)
- `git diff --check` PASS

Canonical product EIC remains 320.50 EUR PARTIAL.

## UI opinion

Owner can see what is required, why it is blocked, and what depends on what without DAG vocabulary.
Derived order is readable. Vinyl vs none vs painted branches are honest.
Narrow viewport stays usable but long. ACM would need grouping or collapse, not a second graph editor.

## Persistence

Typed compiler. No composition SQLite table. No owner process edits.

## Remaining gaps

- Critical missing Letters processes (paint, closure)
- Workcenters / Machines
- Lighting after PSU
- Labor / service recipes
- ExecutionPlan compiler

## Next recommendation

Re-evaluate among: fill critical missing Letters processes, Workcenters/Machines foundation, Lighting completion after PSU, labor/service recipes, ExecutionPlan compiler foundation. Do not auto-pick.
