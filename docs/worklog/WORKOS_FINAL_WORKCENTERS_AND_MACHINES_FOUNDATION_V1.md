# WorkOS Final — Workcenters and Machines foundation v1

Owner GO: `WORKOS_FINAL_WORKCENTERS_AND_MACHINES_FOUNDATION_V1`.

## What shipped

Canonical capability-provider model:

```text
OperationalProcess → CapabilityClass → Workcenter / Machine → later ExecutionTask selection
```

Typed catalog is authority. No write. No SQLite. No invented live machines.

## Live catalog

Workcenters: none.
Machines: none.

Letters required capabilities are all `NO_PROVIDER`. That is the honest shop-floor map.

Architecture proofs use fixture registries only. Fixtures are not live assets.

## Legacy evidence

Recovered from `office952/workos-vscode` / `C:\w\psiso` (read-only). No `CNC-01` or `Paint Booth 1`.

| Need | Legacy identity | Type | Owner-confirmed? | Safe to migrate? | Final action |
|---|---|---|---|---|---|
| CNC routing | `MCH-CNC-4020` “CNC 4020”; `WC_CNC_ROUTING`; rate `CNC_ROUTER` | Machine + workcenter + rate | Yes in legacy | Partial | Evidence only |
| Profile forming | `MCH-CNC-CANT-LITERE` “CNC Cant Litere”; `WC_LETTER_FORMING`; rate `RETURN_PROFILE_MACHINE_FORMING` | Machine + workcenter + rate | Yes in legacy | Partial | Evidence only |
| Painting | Rate `PAINTING`; ORR routes to `WC_ASSEMBLY`; no booth machine | Rate + shared assembly WC | Rate yes; no booth | Evidence only | No live row |
| Electrical | `WC_LED_ASSEMBLY`; `WA-ASSEMBLY-01/02`; rates `LED_ASSEMBLY`, `ELECTRICAL_WIRING` | Workcenter + work areas + rates | Yes in legacy | Partial | Evidence only |
| Manual assembly | `WC_ASSEMBLY`; `WA-ASSEMBLY-*`; rate `ASSEMBLY` | Workcenter + work areas | Yes in legacy | Partial | Evidence only |
| QC | Rate `QC_INSPECTION`; ORR → `WC_ASSEMBLY`; test-only `WC_QC` | Rate + shared assembly | No dedicated QC WC | Evidence only | No live row |
| Packaging | Rate `PACKAGING`; ORR → `WC_ASSEMBLY`; UI alias `WC_OUTPUT` | Rate + shared assembly | No pack machine | Evidence only | No live row |

Legacy also mixed pricing codes (`CNC_ROUTER`) with routing codes (`WC_*`). Final does not collapse those layers. No mass import.

`CNC-ALPHA` remains a Final test placeholder only. It is not a live asset.

## Boundaries kept out

Capacity planning, scheduling, MachineRun, Execution, People/skills, machine-hour rates, CNC pricing, Lighting data invention.

## Surfaces

- `/admin/workcenters` — overview, zones, machines, capabilities, Letters coverage
- `/admin/processes` — derived provider coverage, reference only
- `/products` — no machine selection

## Screenshots

See `docs/worklog/screenshots/workcenters-*.png`.

No live machine-detail screenshot exists because no live machine exists.

## Cleanliness

- PROCESS_MACHINE_COUPLING = NONE
- PRODUCT_MACHINE_COUPLING = NONE
- DUPLICATE_CAPABILITY_DEFINITIONS = NONE
- FAKE_MACHINE_PROVIDERS = NONE
- WORKCENTER_MACHINE_CONFLATION = NONE
- CAPACITY_SCHEDULING_LEAK = NONE
- MACHINE_COST_AUTHORITY_LEAK = NONE
- MANUAL_WORK_FAKE_MACHINE = NONE
- DUPLICATE_PROVIDER_LOOKUP = NONE
- DEAD_MACHINE_CODE = NONE
- STALE_ACTIVE_MACHINE_DOCS = NONE
