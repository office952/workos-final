# Order Snapshot V1

Immutable commercial job freeze from an accepted Quote. Not Production Release. Not Execution.

## Source

Server loads the persisted Quote Snapshot and its Quote Acceptance Decision, then copies that frozen truth.
The client supplies only `quoteSnapshotId`.

## Gate

Quote exists, is `FROZEN`, EIC COMPLETE, Commercial COMPLETE.
Acceptance exists and binds the persisted quote hash.
Unaccepted Quote is blocked.

## Frozen golden

```text
EIC 382.50 EUR COMPLETE
Adaos 35% / 133.88
Net 516.38
TVA 21% / 108.44
Gross 624.82 EUR
DEFAULT_COMMERCIAL_POLICY v1
```

Copied from the accepted Quote. No reprice. No recompile.

## Identity

`ord:{acceptanceId}:{sha256}`
One Order per Acceptance. Same retry → same row.

## UI

After **Ofertă acceptată**:

- Before: **Creează comanda**
- After: **Comandă creată** · 624,82 EUR · nu este eliberată pentru producție

**Acceptă pentru producție** remains the separate workshop/pilot action.

## Next

Production Release from Order is not implemented.
Current Order payload does not freeze operations, requirements, usedTechnicalSettings, or usedRecipes.
Do not create Release by rereading live ProductTemplate / process / EIC / Commercial.
