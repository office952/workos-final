# UI20-C1 — Registry family

Runtime V3 lists share `MetricCard` + the same row chrome. C1 refuses that as grammar.

## Shared

- IA3 destinations (no global left sidebar)
- Registry header + search/filter (Design Reserve; not promoted)
- Dense operational row
- Romanian result counts
- 44px primary when an object is created from the list

## Distinct jobs

| Registry | Job | Signals | DL1 use | DL1 refuse |
| --- | --- | --- | --- | --- |
| Lucrări | production position | current work, blocker, next step | local terracotta mark if blocked | JourneyPosition, CommercialLine, MetricCard |
| Clienți | relationship | activity objects, attention | ink mark if attention | CommercialLine, ObjectRegister on every row |
| Cereri | clarity | missing truth, readiness | terracotta if blocked | inbox badges, StateCause banner |
| Oferte | commercial state | revision, frozen/editable, value in mono | mono value cell | full CommercialLine instance |
| Catalog | product identity | family, configurability | none required | price, shop cards, empty-family invention |

```text
COMMERCIALLINE_ON_REGISTRY = REFUSED
OBJECTREGISTER_ON_REGISTRY_ROW = REFUSED
METRICCARD = REJECTED
SAME_COLUMN_SET = REJECTED
```

Empty Halo-lit / full-aluminium catalog families stay empty. That is product truth, not a UI gap.
