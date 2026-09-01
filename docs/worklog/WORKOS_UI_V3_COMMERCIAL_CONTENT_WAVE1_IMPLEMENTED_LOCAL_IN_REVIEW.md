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
- Shared page width: `.app-content` is fluid (`max-width: none`). Workspace fills the shell column; inner controls may keep their own readable max-width.
- Clients rows use identity + flags left, commercial counters right, compact chevron. No dedicated attention column. No DataRow React component.
- Open action is a 44×44 chevron with accessible name `Deschide clientul`.
- Status stays a compact `StatusChip`. Selected-row metadata uses `--text-secondary`.
- One shared primitive remains: `MetricCard`.
- APIs, domain contracts, and commercial mutations unchanged.
