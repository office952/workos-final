# WorkOS UI V3 commercial content Wave 1 — local in review

```text
IMPLEMENTED_LOCAL_IN_REVIEW = YES
OWNER_ACCEPTED              = YES
OWNER_ACCEPTED_SCOPE        = V3_UI_UX_DIRECTION_ONLY
PUSH                        = NO
NEXT_WAVE                   = NO
```

Presentation-only reorganization of Clienți, Client Hub, Cereri, Oferte, and Lucrări on `feat/ui-v3-commercial-content-wave1`.

- `/clients` stays list → Client Hub. No SplitPane.
- One new shared primitive: `MetricCard`. No DataRow, SplitPane, or ObjectHeader.
- Selected-row metadata uses `--text-secondary` (light 8.07:1, dark 7.62:1). `--text-muted` on `--surface-selected` remains forbidden (4.30 / 4.10).
- Request detail local tabs: Prezentare / Fișiere / Montaj. Job detail four lanes. Quote frozen values stay dominant.
- APIs, domain contracts, and commercial mutations unchanged.
