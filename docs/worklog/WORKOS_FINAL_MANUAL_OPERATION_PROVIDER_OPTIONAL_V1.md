# Manual operation provider-optional V1

Close the last three canonical LETTERS execution gaps without inventing workshop zones.

## Owner workshop truth

Probă uniformitate, Control calitate final and Ambalare have no dedicated place.
They are done where the job is being fabricated, or wherever packing is practical.
No QC station, no packaging workstation, no luxmeter, no fake Machine.

## Domain

Operational Process owns `providerRequirement`:

```text
REQUIRED      → provider + executor
NOT_REQUIRED  → executor only
```

Frozen into `FrozenProductionOperation` → Order / Release / ExecutionTask.
Historical records without the field stay REQUIRED.

The three current processes are `NOT_REQUIRED`. CNC, forming, LED, assembly and paint stay required.
No process-name exceptions in UI.

## Start gate

Dependencies complete
AND ACTIVE executor
AND (provider not required OR valid provider assigned)

Assigning a provider to a manual task is rejected.
Packaging recipe 10 EUR/m² and existing QC cost behavior stay unchanged.

## UI

`/execution/:planId` shows **Nu necesită echipament** for manual tasks.
No provider selector. No "Necesită configurare atelier" for those three.
`Fără furnizor` counts only genuine required gaps.

## Proof

Canonical 60 mm none/none: 12 tasks, 0 fake provider gaps, all 12 have a truthful path.
Commercial Order → Release and PILOT snapshot use the same ExecutionTask rules.
