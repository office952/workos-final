# UI20-C1 — Design Reserve

```text
RESERVE != COMPONENT LIBRARY
PROMOTE_NOW = NO
NODE = 166:645
```

Patterns held for future need. Evidence from one family is not enough to promote.

| Pattern | USE_WHEN | DO_NOT_USE_WHEN | FAMILIES |
| --- | --- | --- | --- |
| Registry Header + Filter | distinct list jobs | same columns everywhere | registries |
| Dense Operational Row | scan + act | CRM cards | Lucrări, Stoc, Cereri |
| Master–Detail Split | stock/material, admin collection | CAD inspector | Stock, Product System |
| Local Admin Navigator | real admin collection | global left sidebar | People, System |
| Context Lens | Client Hub sections | decorative tabs | Client Hub |
| Attention levels | quiet / attention / blocked | severity rainbow | registries, hub |
| State → Cause → Action | Cerere / blocker | icon-only status | Cerere |
| History Compression | Lucrare / Exec | PM timeline | grammar sources |
| Empty / First-use | no objects yet | SaaS illustration | registries |
| Permission / Frozen | owner write, frozen quote | fake Edit/Save | Admin, Ofertă |
| Command result | search in WorkOS | generic spotlight | chrome |
| Pending / Retry / Offline | login + fetch | marketing toasts | quiet |
| Batch / Drawer / Attachment / Audit / Date | later evidence | invent a kit | reserve |

Held primitives remain `NOT_YET`: WorkRow, ConstructionPart. Rejected: Card, MetricCard, ClientRegistryCard.
