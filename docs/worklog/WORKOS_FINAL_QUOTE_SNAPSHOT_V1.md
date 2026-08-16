# Quote Snapshot V1

Immutable commercial offer freeze. Not acceptance. Not Order. Not Production Snapshot.

## Source

Server recompiles the reviewed ProductDefinition, then freezes planned EIC + Commercial projection.
The client does not supply totals.

## Gate

EIC COMPLETE and Commercial COMPLETE only.
60 mm none/none is eligible. 30/80/100, vinyl, RAL are blocked.

## Frozen golden

```text
EIC 382.50 EUR COMPLETE
Adaos 35% / 133.88
Net 516.38
TVA 21% / 108.44
Gross 624.82 EUR
DEFAULT_COMMERCIAL_POLICY v1
```

## Identity

`qts:{productCode}:{sha256}`
Same content → same row.

## UI

Confirmed result, after Preț client:

- Complet: **Îngheață oferta**
- După: **Ofertă salvată** with frozen amounts
- Parțial: no button

Quote does not start production.
