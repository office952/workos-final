# Commercial requests / Cereri de ofertă V1

First real incoming commercial Request in WorkOS Final.

## Decision

CommercialRequest owns what the client asked for. Product Truth, Quote Snapshot, and Order stay separate authorities.
`/requests` is the office queue. Product configuration opens with `?request=`. The existing Quote freeze then persists a Request↔Quote link without changing Quote content.

```text
Cerere → Alege produs → configurează → Ofertă înghețată → OF-* pe cerere
```

Quote may exist without a Request. Request status never stores Creată / Acceptată / Cu comandă.

## Evidence

`docs/worklog/screenshots/requests-*.png`
`docs/worklog/screenshots/request-*.png`
