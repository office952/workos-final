# WorkOS UI20 transport contract gap closure V1

```text
ROLE                       = EVIDENCE
OWNS                       = IMPLEMENTATION_RECORD
DOES_NOT_OWN               = PRODUCT_TRUTH, DELIVERY_SEQUENCE, UI20_FRONTEND
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = LIVE_GITHUB_WINS
DOCUMENTATION_IMPACT       = YES
TERMINOLOGY_IMPACT         = NO
FIGMA_AUTHORITY_IMPACT     = NO
CURSOR_WORKFLOW_IMPACT     = NO
ROADMAP_IMPACT             = NO
CONTINUITY_IMPACT          = NO
```

Implemented the minimum additive HTTP transport so an isolated UI20 frontend can
render configuration and continue commercially without importing
`@workos-final/domain`.

```text
API_CONTRACT_ID = workos-ui-contract-v1
CONFIGURATION_PREVIEW = POST /api/products/:productCode/preview
CONFIRM_SAFE_CONTRACT = values + crv1 reviewId
QUOTE_FREEZE_SAFE_CONTRACT = values + crv1 reviewId + customerId
PRODUCTDEFINITION_BROWSER_ROUNDTRIP_REQUIRED = NO
CORS_CHANGED = NO
COOKIE_POLICY_CHANGED = NO
CSRF_CHANGED = NO
AUTH_BYPASS = NO
LEGACY_RUNTIME_COMPATIBLE = YES
MERGE_MAIN = NO
OWNER_ACCEPTED = NO
```

Authority: `docs/architecture/WORKOS_UI_TRANSPORT_CONTRACT_V1.md`.

This record does not authorize UI20 frontend implementation, Figma work, or merge
to main.
