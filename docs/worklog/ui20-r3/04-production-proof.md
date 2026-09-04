# UI20-R3 — Production proof

## Atelier — inbox-ul operatorului curent

R3A nodes `46:2` (1440) and `46:72` (768). R3 nodes `29:84` and `32:172` are hidden; they contradicted Atelier canon.

Atelier is the current-operator cross-job task inbox. It owns no assignment, dispatch, schedule, or production priority.

Read model:

| Lane | Condition | Action |
| --- | --- | --- |
| În lucru la mine | `IN_PROGRESS` assigned to the current person | **Continuă** |
| Disponibile pentru mine | person-eligible `PLANNED`, ready + `canClaimStart` | **Pornește** |
| Disponibile pentru mine | provider/machine required and missing | visible, not startable, local cause |
| Urmează | eligible, dependencies incomplete | no start |

Removed from the R3 specimen: “Dispecerizare”, “Alege un operator eligibil sau amână montajul.”, “Lipsește operator eligibil” as a staffing reason, and any other-operator assignment affordance.

A task is not actionable merely because some other operator could be eligible.

Synthetic operations only: Debitare CNC față, Cant aluminiu, Montare LED. Not new canonical contracts. No named machine identity.

Blocked Montare LED uses the canonical local cause: **Necesită utilaj dedicat**. The row stays in Disponibile, not startable.

Disclaimer: *Ordinea de afișare nu reprezintă programare sau prioritate de producție.*

Lead destination remains **Munca mea** (mute). The object register is **LUC-88** (IBM Plex Mono), with lineage `CER-1042 · Cant aluminiu · în lucru`. Row status ticks are off. One scan list. Not a three-column dashboard. Not a manager staffing screen.

768: ready work is an explicit 44px **Pornește** control, not “Debitare CNC față · Pornește” as a text line. Current work keeps **Continuă**.

Normal rows stay quiet. The local block is the only raised energy (G2 borrowed only there).

First 3 seconds: my work / LUC-88 in progress / one ready start / one local machine block / one waiting dependency.

Evidence: `evidence/r3a-atelier-1440.png`, `evidence/r3a-atelier-768.png`.

768 keeps Meniu + current object + current work + next action. Compact disclaimer: *Ordinea nu este programare.*

## Execuție — stație activă

Nodes `30:86` light, `46:101` dark (R3 `35:2` hidden; failed visual review).

Radically different from Cerere/Ofertă: reduced chrome, operation title dominates, compact lineage, history compressed as **Dosar comercial**.

Same work object as Flow B: LUC-88 / Cant aluminiu / CER-1042 reachable but secondary.

Focused columns on dark: Respectă / Blocaj / Acum / Urmează. Every extra element answers current work, constraint, block, now, next.

No fake telemetry. No HMI cosplay. No manager controls.

Light title contrast was corrected in R3 (near-white ink bug). R3A removed leftover meta (“Obiectul rămâne / chrome-ul s-a retras”).

Dark evidence: `evidence/r3a-executie-dark-1440.png`. Charcoal paper, cream ink, readable in the export.
