# UI20-R5 — Atelier / execution handoff

Canonical split:

- Lucrare = Order-rooted traveler. Does not assign or schedule.
- Atelier = current-operator inbox. No assignment truth.
- Execuție = `/execution/:planId` station. Completes tasks.

| Handoff | Dialect | Meaning |
| --- | --- | --- |
| Lucrare → Execuție | SMART_ANIMATE 200 | open the active station |
| Lucrare → Atelier | SMART_ANIMATE 200 | see my inbox for this LUC |
| Atelier Pornește | ENTER_WORK 200 | row becomes mine |
| Atelier Continuă | SMART_ANIMATE 200 | enter the station |
| Exec complete | COMPLETE 200 EASE_IN_AND_OUT | work advances |
| Exec → Lucrare | SMART_ANIMATE 200 | return to traveler |

ENTER_WORK changes ownership/currentness. COMPLETE advances production.
