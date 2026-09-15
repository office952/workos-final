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

For any UI/UX task, the receiving session must also read:

- `docs/development/WORKOS_FIGMA_WORKFLOW.md`
- `docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md`

Durable reconstruction rules, not milestone flags:

- `EXISTING_ACCEPTED_SURFACE = PROTECTED BY DEFAULT ACCORDING TO ITS CANON`. Generic Figma polish is not a global redesign authorization;
- current Configurator UI/UX authority is the implemented application on `origin/main` unless an exact registered Figma state has explicit `OWNER_ACCEPTED_DESIGN` status for a newer design delta inside authorized mutable regions;
- Figma can polish only authorized mutable content slots and cannot silently change Product Truth, fields, allowed values, requiredness, validation, readiness, formulas, pricing, permissions, lifecycle or execution semantics, or a frozen page framework;
- existing accepted surfaces use the Cursor functional implementation → runtime proof → Figma polish → Cursor design-delta → runtime parity roundtrip, limited by the protected-region law in `docs/development/WORKOS_FIGMA_WORKFLOW.md`;
- every canonical Figma state must be registered in `docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md`; do not rely on remembered node ids from chat;
- `OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY`. Other WorkOS pages are not rejected. Do not treat UI20 direction, an implemented shell, Figma existence, or a page existing in the application as page-level Owner acceptance.

Do not start implementation if `CONTINUITY_CONTRADICTION = YES`.

## Fallback prompt

Use this only when automatic context is unavailable:

```text
Continuăm WorkOS.
Citește docs/continuity/WORKOS_SESSION_CURRENT.md, AGENTS.md,
docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md,
docs/governance/WORKOS_AUTHORITY_MAP.md,
docs/development/WORKOS_CURSOR_WORKFLOW.md,
docs/development/WORKOS_FIGMA_WORKFLOW.md și
docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md.
Verifică live origin/main pe GitHub.
Pentru UI/UX păstrează roundtrip-ul: Cursor implementează realitatea funcțională,
runtime-ul o dovedește, Figma face polish doar în sloturile de conținut autorizate,
Owner/ChatGPT acceptă designul, apoi Cursor implementează numai design delta
mutabil și verifică parity.
O suprafață deja acceptată este protejată implicit de canonul ei.
Figma nu redesenează framework-ul și nu schimbă Product Truth pe ascuns.
Nu trata un SHA sau node id memorat din conversație ca autoritate.
Nu trata UI20 sau existența unei pagini ca acceptare Owner la nivel de pagină.
Doar Configuratorul are UI/UX Owner-approved la checkpoint-ul curent, dacă living canon nu spune altceva.
Nu începe un val de produs fără Owner GO.
Raportează CONTINUITY_PREFLIGHT și DIRECTION_CONFLICT înainte de orice scriere.
```
