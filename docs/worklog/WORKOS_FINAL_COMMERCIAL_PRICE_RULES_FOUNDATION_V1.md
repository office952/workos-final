# Commercial price rules foundation V1

Owner-confirmed company policy turns planned EIC into a customer price. Not a Quote.

## Policy

- Currency: EUR
- Markup: 35%
- VAT: 21%
- Rounding: 0.01 EUR
- Discount / adjustment: reserved at 0, not editable in the first product UI

Code-owned configuration. No admin write. No fake Edit/Save.

## Formula

Cost-plus. Internal cost remains VAT-exclusive.

Canonical 60 mm none/none:

```text
382.50 → adaos 133.88 → net 516.38 → TVA 108.44 → brut 624.82 EUR
```

## Gate

COMPLETE planned EIC → Commercial COMPLETE.
PARTIAL planned EIC → Commercial PARTIAL; UI does not show a final customer price.
Commercial consumes `{ total, currency, completeness }` only.

## Boundaries

Uses planned EIC, not Actual Internal Cost.
Does not write Production Snapshot.
Does not create Quote, Order, FX, or a second cost engine.
Frontend displays the projection; it does not calculate markup or VAT.

## UI

Confirmed product result, after Cost intern:

- Preț client
- Cost intern
- Adaos comercial
- Preț net
- TVA
- Preț final client
