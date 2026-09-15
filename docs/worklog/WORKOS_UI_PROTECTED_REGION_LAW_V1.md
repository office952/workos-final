# WorkOS UI protected-region law V1 — persisted

```text
ROLE                       = EVIDENCE
OWNS                       = RECORD_THAT_PROTECTED_REGION_LAW_WAS_WRITTEN_INTO_METHODOLOGY
DOES_NOT_OWN               = PRODUCT_TRUTH, FIGMA_FRAMES, DELIVERY_SEQUENCE
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = NO
LAST_RECONCILIATION_RULE   = KEEP_AS_HISTORY_AFTER_INTEGRATION
```

```text
DOCUMENTATION_IMPACT       = YES
TERMINOLOGY_IMPACT         = NO
FIGMA_AUTHORITY_IMPACT     = YES
CURSOR_WORKFLOW_IMPACT     = YES
ROADMAP_IMPACT             = NO
CONTINUITY_IMPACT          = YES
```

This worklog records a methodology persist. It is not Owner acceptance of product implementation and not a second canon.

The Owner accepted the Configurator protected-framework audit: FC2 changed content, not chrome. The required correction was the Cursor ↔ Figma roundtrip wording, which had treated layout / responsive composition as globally polishable.

Durable law now lives in:

- `docs/development/WORKOS_FIGMA_WORKFLOW.md`
- `docs/development/WORKOS_FIGMA_RUNTIME_REGISTRY.md`
- `docs/development/WORKOS_CURSOR_WORKFLOW.md`

`AGENTS.md` and `docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md` point at that law. The Configurator V1 framework file keeps its frozen surface law and adds only a cross-reference.
