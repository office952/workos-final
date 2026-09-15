# WorkOS documentation governance

```text
ROLE                       = AUTHORITY
OWNS                       = DOCUMENT_ROLES, DOCUMENTATION_IMPACT_GATE, CLASSIFICATION_GRAMMAR
DOES_NOT_OWN               = PRODUCT_TRUTH, DELIVERY_SEQUENCE, FIGMA_VISUAL, CURSOR_METHOD, LIVE_INTEGRATION_STATE
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = NO
LAST_RECONCILIATION_RULE   = UPDATE_WHEN_DOCUMENT_ROLES_OR_IMPACT_GATE_CHANGE
```

This file is documentation law. It is not a second roadmap and not Product Truth.

## Document roles

| ROLE | Meaning |
|---|---|
| AUTHORITY | Current law for one named subject. Other docs may explain it; they may not replace it. |
| INDEX | Pointers and reconciliation checkpoints. Never the live decision. |
| TOOLING | Editor, plugin, MCP, harness, CI, and scripts. Not business truth. |
| HISTORY | Earlier construction. Keep it. Do not treat it as live state. |
| EVIDENCE | Worklogs, plans, screenshots, test records. They prove what happened. They do not reopen authority. |

Every new durable WorkOS document must state:

```text
ROLE
OWNS
DOES_NOT_OWN
SUPERSEDES
SUPERSEDED_BY
LIVE_STATE_DEPENDENCY
LAST_RECONCILIATION_RULE
```

`LIVE_STATE_DEPENDENCY = YES` means the document can become stale when GitHub main moves. Such a document must say that live GitHub wins.

## What a document may not become

A WorkOS document must not become a second:

- Product Truth
- delivery roadmap
- Figma visual authority
- engineering / Cursor methodology authority
- live integration-state authority

GitHub current repository state decides what is merged. The living roadmap decides delivery direction. ProductTemplates / FormSchemas / component contracts / `compileDefinition` decide product facts.

## Migration

```text
NEW_DOCUMENTS              = FULLY_CLASSIFIED
DOCUMENTS_TOUCHED_LATER    = CLASSIFY_WHEN_TOUCHED
HISTORICAL_ARCHIVE         = NO_MASS_REWRITE
```

Do not mass-edit historical worklogs only to add headers.

## Documentation impact gate

Every substantive WorkOS change must record:

```text
DOCUMENTATION_IMPACT       = YES | NO
TERMINOLOGY_IMPACT         = YES | NO
FIGMA_AUTHORITY_IMPACT     = YES | NO
CURSOR_WORKFLOW_IMPACT     = YES | NO
ROADMAP_IMPACT             = YES | NO
CONTINUITY_IMPACT          = YES | NO
```

If any field is YES, reconcile the matching durable document in the same change when technically possible.

A change is not closed only because code is green while its current canonical documentation is knowingly stale.

Do not require irrelevant documentation edits for every PR.

## Authority pointers

- Delivery direction: `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- Where to look: `docs/governance/WORKOS_AUTHORITY_MAP.md`
- Romanian UI terms: `docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md`
- Cursor method: `docs/development/WORKOS_CURSOR_WORKFLOW.md`
- Figma method: `docs/development/WORKOS_FIGMA_WORKFLOW.md`
- Session index: `docs/continuity/WORKOS_SESSION_CURRENT.md`
