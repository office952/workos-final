# UI20-R4 — Lucrare character

Required R4 screen. Not invented lifecycle.

```text
jobId = orderSnapshotId
NO Job entity
Route hypothesis = /jobs/:jobId
```

Lineage used, compressed: OFT-221 înghețată → Acceptată → Comandă → Eliberare producție → Plan.

Mental model (Romanian): **fișă de producție**. Answers: ce este lucrarea, de unde vine, ce produs e înghețat, unde este acum, ce urmează, ce e în atelier/execuție.

| Variant | Node |
| --- | --- |
| 1440 light | `72:1700` |
| 1280 light | `72:1798` |
| 768 light | `72:1857` |
| 1440 dark | `72:1916` |

Signature: **POZIȚIE CURENTĂ** with AttentionEdge. Prior stages are one compressed line, not a PM timeline.

Does not assign, dispatch, or schedule. Primary action **Continuă execuția** opens the existing station (`72:1795` → `72:1285`).

768 uses Meniu + object + current + next + 44px action. It does not keep the desktop destination row.
