# Workcenters and Machines canon

Canonical current law for production capability providers.
Runtime wins if this document disagrees.

This is not a manufacturing master document and not a capacity or Execution spec.

## Permanent separation

```text
OPERATIONAL PROCESS
  → requires CapabilityClass
WORKCENTER
  → production area / station / organizational execution location
  → provides one or more CapabilityClasses
MACHINE
  → concrete equipment
  → may belong to a Workcenter
  → provides one or more CapabilityClasses
EXECUTION
  → later chooses the actual provider for a concrete task
```

Do not collapse these layers.

A process never requires `machineId`, `machineCode`, or a machine model.

A Workcenter is not another name for a Machine. A Workcenter may contain machines, represent a station without one unique machine, or provide human/workstation capabilities directly.

## Current demand

Shop-floor capability IDs live only in Operational Processes:

`CNC_ROUTING`, `PROFILE_FORMING`, `VINYL_APPLICATION`, `MANUAL_ASSEMBLY`, `ELECTRICAL_ASSEMBLY`, `PAINTING`, `QUALITY_CONTROL`, `PACKAGING`.

Workcenters / Machines consume those IDs. They do not recreate the capability catalog.

## Live catalog honesty

The typed catalog is the authority. There is no write path and no SQLite persistence for this domain.

Live Workcenter and Machine rows are empty until owner-confirmed identities exist. Legacy evidence named capabilities and stations conceptually, not stable shop assets such as `CNC-01`. A missing-provider map is preferred to fabricated assets.

Coverage statuses:

- `COVERED` — at least one ACTIVE provider exists in the catalog
- `PROVIDER_PLANNED` — only PLANNED providers exist
- `NO_PROVIDER` — no provider exists

Coverage means the catalog has a provider. It does not mean a job can be executed now.

## People boundary

A Workcenter may declare that the station supports a `HUMAN_SKILL` capability.

Employee qualification, certification, and assignment remain future People truth. No employee records live here.

## Capacity boundary

Machine / Workcenter will later own the technical capacity and availability model.

Execution / Scheduling will consume it.

Product System and Operational Processes do not own capacity.

This foundation does not implement capacity planning, calendars, free/busy, or online/offline state. Lifecycle (`ACTIVE` / `PLANNED` / `RETIRED`) is structural only.

## Execution boundary

No ExecutionPlan, ExecutionTask, assignment, or MachineRun.

A future ExecutionTask can choose a provider without mutating the OperationalProcess definition.

The machine catalog does not store actual order runs.

## Cost boundary

No machine-hour rates, labor recipes, or commercial money live on Machine or Workcenter identity.

Resources / Cost remains the monetary authority.

## Administration

Owner inspection lives under Administrare → Utilaje și capacitate.

The label names the domain destination. Capacity planning is not implemented.

Product configuration does not select a machine.
