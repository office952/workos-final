# UI20-R5 — Navigation, return, command

Top nav remains the destination map. Journey position is not a second global nav.

| Return | Source | Dest | Preserved |
| --- | --- | --- | --- |
| Config → Cerere | Înapoi la cerere | resolved CER-1042 | object + known/missing |
| Exec → Lucrare | Înapoi la lucrare | LUC-88 | traveler position |
| Atelier → Exec → Lucrare | Continuă / back | station then traveler | LUC-88 |

```text
RETURN_CONTEXT = PASS
COMMAND_LAYER = OPTIONAL
```

Command overlay `96:1749` understands lineage:

- CER-1042 · din Nord Display SRL → `96:85`
- LUC-88 · din OFT-221 · din CER-1042 → `96:456`
- OFT-221 · specificație din CER-1042 → `96:340`
- Destinație · Mergi la Atelier → `96:517`
- Client · Nord Display SRL → `96:767`

The normal journey does not require Command. 768 Exec return is `99:4` → `96:1366`. 1280 Exec return is `99:7` → `96:1106`.
