# UI-FC0 — commercial journey visualization

```text
ONE_PROCESS_TRUTH = YES
DIFFERENT_PAGE_FOCUS = YES
INVENT_STATE = NO
```

## Path

```text
Cerere → Configurare → Confirmare → Ofertă → Acceptare → Comandă → Release → Atelier → Execuție → Finalizare
```

## State vocabulary

| Token | Meaning | Safe derivation today |
| --- | --- | --- |
| GLOBAL_JOURNEY_POSITION | Where this object sits on the spine | Request overview / quote stage / job nextAction / execution task state |
| LOCAL_BLUEPRINT | Product construction view | Template + selectedComponentIds + formSchema. **Not** a second journey |
| CURRENT_STAGE | The stage this page is allowed to act on | Page-owned projection |
| COMPLETED_STAGE | Already frozen / copied | Snapshot existence (quote, order, plan) |
| BLOCKED_STAGE | Next action refused | Readiness / installation / live gates |
| NEEDS_INPUT | Operator must complete facts | Missing required schema fields / installation facts |
| NOT_APPLICABLE | Capability not selected | Service mode SERVICE_DISABLED / unselected module |
| FUTURE_STAGE | Exists in law, not this object | No quote yet → Ofertă is future |

If a UI needs a state the API does not project:

```text
STATE_EVIDENCE_GAP
```

Do not invent a progress percentage.

## Page emphasis (same truth)

| Page | Focus | Must not become |
| --- | --- | --- |
| Cerere | What is missing before product/quote | A second configurator |
| Configurator | Construction + confirm exact definition | A quote editor |
| Ofertă | Frozen commercial decision | Recalculate |
| Lucrare | Next allowed step after order copy | Recalculate |
| Atelier | What I can start now | Factory map |
| Execuție | Active task mutation | Job commercial rewrite |

## Gaps

1. No shared journey chrome. Each page restates stage in local copy.
2. Configurator edit mode does not show ROLE blueprint, so LOCAL_BLUEPRINT is invisible.
3. Live v2 freeze / acceptance / PDF remain refused — FUTURE_STAGE must stay honest, not drawn as a working button.

```text
TRANSFORMATION_BLUEPRINT_STATUS = STUDIED_NOT_IMPLEMENTED
STATE_EVIDENCE_GAP_COUNT = 3
```
