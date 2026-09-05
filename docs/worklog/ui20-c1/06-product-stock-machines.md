# UI20-C1 — Product, stock, processes, machines

## Product System

```text
ProductTemplate → composition → allowed/fixed configuration
CAD = NO
COSTENGINE_IN_UI = NO
NEW_PRODUCT_TRUTH = NO
A3_1_BLUEPRINT = RESEARCH_INPUT_NOT_CANON
```

Display labels may be edited. Technical identity stays. `/components` maps to this family as inspection, not a second construction authority.

## Processes

Show how work is done and which capability it asks for. No backend graph vocabulary. No scheduling.

## Stock / Material

Identity lives in Resources. Stock shows balance and movements. Rate and customer price stay out.

```text
INVENTORY_MODES = Disabled | Basic | Advanced
REQUIRED_FOR_UNRELATED_FLOWS = NO
RESERVATIONS = PRODUCT_HOLD
PURCHASING = PRODUCT_HOLD
```

Material page may instance MaterialIdentity. Negative sold uses terracotta blocked energy plus copy.

## Machines / Workcenters

Known grammar only: zone vs machine, capability, whether start is blocked. Live catalog may be empty.

```text
MACHINES_FC2 = HOLD
FAKE_TELEMETRY = NO
CAPACITY_THEATRE = NO
SCADA = NO
MachineRun = PRODUCT_HOLD
```
