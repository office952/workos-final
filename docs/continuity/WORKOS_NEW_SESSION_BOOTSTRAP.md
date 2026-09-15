# WorkOS new-session bootstrap

```text
ROLE                       = INDEX
OWNS                       = MINIMAL_NEW_CHAT_START
DOES_NOT_OWN               = PROJECT_HISTORY, ROADMAP_FLAGS, PRODUCT_TRUTH
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = NO
LAST_RECONCILIATION_RULE   = UPDATE_ONLY_WHEN_START_PROTOCOL_CHANGES
```

The Owner should not need a giant handoff prompt.

This file does not embed volatile project history.

## Minimal Owner input

```text
Continuăm WorkOS.
```

The receiving session must reconstruct state from:

1. `docs/continuity/WORKOS_SESSION_CURRENT.md`
2. `AGENTS.md`
3. `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
4. `docs/governance/WORKOS_AUTHORITY_MAP.md`
5. only the applicable canons
6. the latest relevant worklog
7. live GitHub `origin/main` and any open PR / exact-head CI

Then run the continuity preflight in `docs/development/WORKOS_CURSOR_WORKFLOW.md`.

Durable reconstruction rules, not milestone flags:

- current Configurator UI/UX authority is the implemented application on `origin/main`. Figma section `219:3` is the accepted design baseline / reference. Do not force the application back to that frame because the accepted implementation differs from it.
- `OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY`. Other WorkOS pages are not rejected. Do not treat UI20 direction, an implemented shell, Figma existence, or a page existing in the application as page-level Owner acceptance.

Do not start implementation if `CONTINUITY_CONTRADICTION = YES`.

## Fallback prompt

Use this only when automatic context is unavailable:

```text
Continuăm WorkOS.
Citește docs/continuity/WORKOS_SESSION_CURRENT.md, AGENTS.md,
docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md și
docs/governance/WORKOS_AUTHORITY_MAP.md.
Verifică live origin/main pe GitHub.
Nu trata un SHA din documentație ca autoritate de integrare.
Nu trata Figma 219:3 ca autoritate vizuală curentă a Configuratorului.
Nu trata UI20 sau existența unei pagini ca acceptare Owner la nivel de pagină.
Doar Configuratorul are UI/UX Owner-approved la checkpoint-ul curent.
Nu începe un val de produs fără Owner GO.
Raportează CONTINUITY_PREFLIGHT și DIRECTION_CONFLICT înainte de orice scriere.
```
