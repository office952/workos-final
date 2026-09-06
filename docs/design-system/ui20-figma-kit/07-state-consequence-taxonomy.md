# 07 — State / consequence taxonomy

Not every state is universal. Owning domain wins.

| STATE | OWNING DOMAIN | VISUAL ENERGY | COLOR ALLOWED | ICON | TEXT | ACTION CONSEQUENCE | PAGE EXAMPLES | UNIVERSAL? |
|---|---|---|---|---|---|---|---|---|
| NORMAL | presentation | Quiet | Neutral ink/line | No | Optional | None | Default rows | Yes as rest |
| CURRENT | journey / execution | Visible now | Identity green or position, not rainbow | Optional | What is current | Work happens here | Exec current task; Lucrare now | No — page meaning |
| SELECTED | configuration / lists | Clear constructive | Deep green / selected wash | No | What is selected | Lens / detail follows | Config role; catalog row | No |
| READY | backend readiness | Calm ok | Success wash optional | No | Ready label from API | Enable next act | Config confirm; install prequote | No — UI does not compute |
| BLOCKED | operations / request | Local terracotta | Consequence + edge | Optional | **Cause required** | Next act explains unblock | Cerere unresolved; atelier block | Yes as pattern |
| INCOMPLETE | intake / config | Quiet missing | Neutral + structure | No | What is missing | Continue filling | Cerere unknown; required fields | Yes as pattern |
| INCOMPATIBLE | product composition | Local warn | Warning + copy | No | Why incompatible | Change selection | Config role clash | No |
| LOCKED | authorization / capability | Recede | Muted | No | Why unavailable | Hide or disable honestly | Hidden dest; disabled quote create | Yes as pattern |
| READONLY | inspection | Recede | Neutral | No | “doar citire” once | No fake Edit | Admin catalogs | Yes |
| FROZEN | commercial snapshot | Authoritative settle | Neutral + freeze mark | No | Frozen / immutable | No silent edit | Ofertă snapshot | No — commercial |
| ERROR | transport / validation | Distinct danger | `--status-danger` | Optional | Recoverable error | Retry / fix | PageStatus; field-error (today uses warning color) | Yes |
| WARNING | attention | Local | Terracotta family | Optional | What needs attention | Navigate to cause | Client attention row | Yes as pattern |
| INFO | rare | Legacy blue | `--status-info` | No | Informational | None | Sparse | KEEP_LEGACY_ONLY |
| COMPLETED | execution / journey | Recede | Muted / done wash | No | Done | No primary act | Completed tasks | Yes as pattern |
| UNKNOWN | data gap | Honest empty | Neutral | No | Unknown / not projected | Do not show 0 | Missing lineage; empty strip | Yes as pattern |

## Must not conflate

| Pair | Why |
|---|---|
| blocked ≠ incomplete | Blocked has a cause that stops progress; incomplete is unfinished known work |
| unknown ≠ zero | Missing projection is not a metric of 0 |
| frozen ≠ readonly | Frozen is an immutable commercial fact; readonly is inspection without freeze |
| current ≠ selected | Current is where work is; selected is what the operator is inspecting |
| warning ≠ error | Warning is attention; error is failure / invalid |

## Runtime honesty gaps

- Field invalid uses `--status-warning`, not `--status-danger`.
- Default buttons use legacy blue, so “primary” is not yet constructive green.
- StatusChip washes can look like meaning without copy — keep chips sparse.
- ObjectContext empty is correct UNKNOWN, not a fake CER-000.
