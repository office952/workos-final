# LETTERS cost-evidence calibration apply V1

Owner-confirmed workshop rates for canonical LETTERS none/none at 60 mm. No invented rates for other aluminium depths.

## Owner decisions applied

One aluminium profile resource identity. Depth stays configuration, not SKU.

| Line | Rate | Basis | Provenance |
|---|---|---|---|
| Aluminium profile 0.6 mm | 3 EUR/m | perimeter | OWNER_CONFIRMED_PURCHASE, only when depth = 60 mm |
| Profile forming | 5 EUR/m | perimeter | OWNER_CONFIRMED_WORKSHOP |
| CNC face | 3 EUR/m | perimeter | OWNER_CONFIRMED_WORKSHOP |
| CNC back | 4.5 EUR/m | perimeter | OWNER_CONFIRMED_WORKSHOP |
| Face–volume bonding | 5 EUR/m | perimeter | OWNER_CONFIRMED_WORKSHOP |
| Body closure | 2 EUR/m | perimeter | OWNER_CONFIRMED_WORKSHOP |
| LED installation | 0.05 EUR/buc | module qty | OWNER_CONFIRMED_WORKSHOP |
| Electrical preparation | 2 EUR/product | 1 buc | OWNER_CONFIRMED_WORKSHOP |
| Packaging | 10 EUR/m² | face area | OWNER_CONFIRMED_WORKSHOP |

Unchanged: Plexiglas 16 EUR/m², Forex 16 EUR/m², LED 0.50 EUR/buc, PSU 12/16/20/40 EUR.

No hourly rates. No elapsed-time costing.

## Aluminium model

```text
one aluminium_return_profile
+
configuration-qualified cost evidence
  when.volumeDepthMm = 60 → 3 EUR/m
  30 / 80 / 100 → unavailable
```

Unqualified lookup does not inherit 3 EUR/m.

## Canonical 60 mm none/none

```text
250000 mm² FACE
12500 mm perimeter
60 mm depth
finish none/none
```

Profile: 12.5 × 3 = 37.50 EUR  
Forming: 12.5 × 5 = 62.50 EUR  
Other confirmed lines unchanged from the previous composition.

Planned EIC: **382.50 EUR COMPLETE**

30 / 80 / 100 mm: profile line omitted, PARTIAL with `Tarif profil aluminiu neconfirmat pentru adâncimea N mm`. Forming still 5 EUR/m.

Vinyl / painted stay PARTIAL because Oracal / RAL remain development evidence.

## Snapshot and actual cost

New 60 mm snapshots freeze 382.50 COMPLETE and the confirmed rates.  
Historical 595 snapshots stay frozen. No migration. No retroactive reprice.  
Actual Internal Cost remains `actualConsumption × frozen snapshot rate`.  
Inventory stays cost-free.

## Outside this build

Commercial, Quote, Order, Analyzer, inventory valuation, 30/80/100 aluminium rates, vinyl/RAL confirmation, hourly costing.
