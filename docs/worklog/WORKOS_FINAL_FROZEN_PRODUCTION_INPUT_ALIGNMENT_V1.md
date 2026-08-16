# Frozen production input alignment V1

Closes the Order → Production Release evidence gap. Does not implement Release.

## Decision

OPTION E — hybrid minimal.

Freeze production composition evidence at Quote time, when EIC is already compiled.
Order copies that evidence. Order create still does not compile.

```text
Quote freeze
  → FrozenProductionInput
Order freeze
  → copy FrozenProductionInput
[later] Production Release
  → consume Order + frozen input
```

Not a third business authority. Not a new table. Not a new operator UI. Not Production Release.
Commercial carries the copy on Quote/Order. It does not own production composition.

## Frozen contract

Generic:

- operations
- requirements
- usedTechnicalSettings
- usedRecipes
- contentHash

Same shapes the pilot Accepted Production Snapshot already uses.
Pilot path unchanged.

## Why not freeze at Order compile time

Order create must copy, not calculate.
Compiling at Order time could diverge from the Quote EIC.
IDs in live catalogs are not versioned immutable stores.

## Golden

60 mm none/none keeps EIC 382.50 and Commercial 624.82.
Production input has 12 operations and the used lighting settings (100 mm / 0.75 W / 25%).
