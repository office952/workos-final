# Cursor routine approval elimination V1 — implemented locally, in review

```text
ROLE                       = EVIDENCE
OWNS                       = THIS_SLICE_RECORD
DOES_NOT_OWN               = PRODUCT_TRUTH, LIVE_GITHUB_STATE, OWNER_ACCEPTANCE
AUTHORITY                  = CURSOR_ROUTINE_APPROVAL_ELIMINATION_V1
IMPLEMENTATION             = YES
OWNER_ACCEPTED             = NO
MERGE                      = NO
PRODUCT_TRUTH_EXPANSION    = NO
FIGMA_WRITE                = NO
REAL_CLOUD_WRITE           = NO
FC2_AUTHORIZED             = NO
LAST_RECONCILED_MAIN_BASE  = 4a7656bd2851049d6b643a59dcb2b895556d6c08
```

This worklog is evidence. It is not Owner acceptance and not a second roadmap.

## Scope

Remove WorkOS Harness-generated Cursor “Run?” / approval cards for routine shell. The custom `beforeShellExecution` classifier now emits only ALLOW or DENY.

```text
OWNER_APPROVAL_MODEL               = SCOPE_AUTHORIZATION_NOT_COMMAND_AUTHORIZATION
ROUTINE_APPROVAL_PROMPTS           = 0
ROUTINE_COMMAND_CONFIRMATION       = FORBIDDEN
CUSTOM_HOOK_ASK                    = FORBIDDEN
UNKNOWN_COMMAND_BEHAVIOR           = DENY_REFORMULATE_AUTONOMOUSLY
MALFORMED_COMMAND_BEHAVIOR         = DENY_REFORMULATE_AUTONOMOUSLY
OWNER_COMMAND_APPROVAL             = ROUTINE_NEVER
HARD_GATE_BEHAVIOR                 = DENY
SAFE_ROUTINE_BEHAVIOR              = ALLOW
NATIVE_PLATFORM_DIALOG_SCOPE       = OUTSIDE_HARNESS
TEMP_HELPER_POLICY                 = DENY_REFORMULATE_BODY_NOT_PROVABLE
```

No product app, domain, API, DB, Cloud, or Figma mutation.

## Hook contract

KNOWN SAFE / ROUTINE / REVERSIBLE → ALLOW.

HARD GATE / DESTRUCTIVE / DANGEROUS → DENY.

UNKNOWN / MALFORMED / UNSUPPORTED → DENY with reformulation instruction. Cursor continues autonomously. The Owner is not a command-approval button.

`finalizeHookDecision` coerces any non-allow result to DENY so `permission=ask` cannot be emitted even if a later edit tries to reintroduce it.

Catastrophic-deny remains `failClosed: true` and still DENY-only.

## Temporary helpers

`node .tmp/*.mjs` and `node .tmp/*.js` are DENY. The hook can constrain a path but cannot prove the script body is non-destructive, so a helper must not become an opaque wrapper around a hard gate. Cursor reformulates to a native/MCP/file/browser operation or an already-classified command. Arbitrary executables stay DENY. Node injection flags remain DENY.

## Tests

Deterministic classifier matrix, catastrophic matcher, setup-worktree, isolated E2E runner tests, agent schema, `pnpm cursor:harness:test`, and TIER_4 local verification. `HOOK_PERMISSION_ASK_COUNT = 0` is asserted both from classified results and from hook JSON output.

```text
DOCUMENTATION_IMPACT       = YES
TERMINOLOGY_IMPACT         = NO
FIGMA_AUTHORITY_IMPACT     = NO
CURSOR_WORKFLOW_IMPACT     = YES
ROADMAP_IMPACT             = NO
CONTINUITY_IMPACT          = NO
```

```text
OWNER_UPDATE_LINKS
PURPOSE            = OWNER_AWARENESS
APPROVAL_REQUIRED  = NO
```
