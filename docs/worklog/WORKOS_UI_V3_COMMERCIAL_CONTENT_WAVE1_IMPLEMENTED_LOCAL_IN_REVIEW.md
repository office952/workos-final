# WorkOS UI V3 commercial content Wave 1 — visual convergence

```text
IMPLEMENTED_LOCAL_IN_REVIEW = YES
OWNER_ACCEPTED              = NO
OWNER_ACCEPTED_SCOPE        = V3_UI_UX_DIRECTION_ONLY
PUSH_IMPLEMENTATION         = YES
PUSH_REVIEW_EVIDENCE        = YES
NEXT_WAVE                   = NO
```

Presentation-only Wave 1 on `feat/ui-v3-commercial-content-wave1`.

- `/clients` stays list → Client Hub. No SplitPane.
- Shared page width: `.app-content` uses the main working region (`max-width: 90rem`, left-aligned, no `margin: auto`).
- Clients rows use one CSS grid law (identity / attention / state / open). No DataRow React component.
- Open action is a 44×44 chevron with accessible name `Deschide clientul`.
- Status stays a compact `StatusChip`. Selected-row metadata uses `--text-secondary`.
- One shared primitive remains: `MetricCard`.
- APIs, domain contracts, and commercial mutations unchanged.
