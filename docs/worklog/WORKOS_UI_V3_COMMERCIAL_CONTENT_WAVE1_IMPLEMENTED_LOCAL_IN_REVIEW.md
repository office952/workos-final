# WorkOS UI V3 commercial content Wave 1 — local in review

```text
IMPLEMENTED_LOCAL_IN_REVIEW = YES
OWNER_ACCEPTED              = NO
OWNER_ACCEPTED_SCOPE        = CLIENTS_FIGMA_FINAL_DIRECTION
CLIENTS_FIGMA_FINAL         = OWNER_ACCEPTED
CLIENTS_RUNTIME_OWNER_ACCEPTED = NO
UI_V3_PAGE_CONTENT_TRANSFORMATION = NOT_STARTED
NEXT_PROGRAM_PRIORITY       = UI_V3_COMMERCIAL_PAGE_REORGANIZATION
NEXT_WAVE                   = NO
PAGINATION_RUNTIME_IMPLEMENTED = NO
RETURN_PAGE                 = DEFERRED_NOT_SUPPORTED
```

Presentation-only Wave 1 on `feat/ui-v3-commercial-content-wave1`.

Owner accepted the Clients Figma final direction. This worklog records that design acceptance and the React implementation status separately. It does not mark the whole commercial reorganization complete.

## Clients implementation

- Visual authority: Figma file `1ev5lg7m2Ze1h3Vqmax8ho`.
- Business authority: current Customer registry projection.
- `/clients` stays list → Client Hub. No SplitPane. No fake pagination.
- Metrics are summary-only, derived from `registry.summary`, not clickable.
- Status filter remains mutually exclusive. `Necesită atenție` is an independent `needsAttention` boolean.
- Result-count slot is always reserved and derived from the filtered set.
- Cards are one semantic `Link`. Signal Edge is 3px warning only when `needsAttention`.
- Default order is `displayName` A–Z. Attention does not reorder.
- Return Context uses `?q=`, `?status=`, `?attention=1`. Scroll is stored per React Router `location.key`, so Back restores the same history entry and a new sidebar visit starts at the top.
- Shared shell: WorkOS mark + WorkOS in the sidebar. The global header no longer shows a page-context title; `PageHeader` owns `Clienți`.
- Operator chrome is interactive only on `/atelier` and `/execution/*`. Commercial and admin pages show an existing operator passively, or nothing.
- APIs, domain contracts, and commercial mutations unchanged.

## Clients final runtime alignment

Focused amendment after independent review of `2c8daf3`. No Clients page redesign.

- Removed `app-context-title` from `AppShell`.
- Replaced admin-only hide of `Identifică-te` with the operational-route law.
- Replaced the global `workos.clients.registry.scroll` key with a per-history-entry key.
- Runtime owner acceptance remains `NO`.
