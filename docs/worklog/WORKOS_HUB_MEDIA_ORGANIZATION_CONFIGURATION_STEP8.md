# HUB MEDIA organization configuration Step 8

Date: 2026-08-27
Branch: `feat/hub-media-organization-configuration-step8-v1`
Base / origin/main: `b46218927477efdc954932111ce59e5da90f0bfd`

## Owner GO

```text
ROADMAP_DOMAIN       = HUB_MEDIA_ORGANIZATION_CONFIGURATION
STEP                 = 8_CONTINUATION_AND_FINALIZATION
IMPLEMENTATION       = NO
CONTROLLED_NON_PRODUCTION_CLOUD_WRITE = YES
OWNER_ACCEPTED_FINAL_CONFIGURATION = NO
ARCHITECTURE_C_UI_WAVE_2 = NOT_AUTHORIZED
```

This closes Step 8 on the recovered HUB MEDIA Cloud organization. It does not accept the configuration for the Owner and does not start the first real LETTERS job.

## Sources used

Previously Owner-approved sources were identified before write. Isolated clean-pilot data was not imported.

| Fact | Source | Classification |
| --- | --- | --- |
| Complete company / seller profile | `SELLER_IDENTITY_CANON` + `OWNER_CONFIRMED_SELLER` | OWNER_CONFIRMED |
| Operational roster, roles, skills | `TRUSTED_PEOPLE` / `TRUSTED_SKILLS` + people-skills plan | OWNER_CONFIRMED |
| PIN storage and individual change UI | operator store + Administrare → Oameni → PIN operator | RUNTIME_PROVEN |
| Shared initial PIN for this pilot | this Owner GO | OWNER_CONFIRMED |
| Seller legal-name row already on the plane | first Step 8 PATCH | RUNTIME_PROVEN |
| 13 consumed LETTERS 60 mm / none / none rates | first Step 8 Confirmă tarif | RUNTIME_PROVEN |
| CNC Router 4050×2050 + CNC modelator AL 1–2 mm | first Step 8 `cloud:configure-providers` | RUNTIME_PROVEN |

```text
SYNTHETIC_DATA_IMPORTED = NO
SHARED_PIN_NOT_PRODUCT_DEFAULT = YES
```

## Applied

```text
SELLER_CONFIGURATION     = COMPLETE
PEOPLE_SKILLS_APPLIED    = YES
PIN_CONFIGURED_COUNT     = 8
PIN_MISSING_COUNT        = 0
PIN_CHANGE_UI            = AVAILABLE
PIN_HASHED_AT_REST       = YES
PIN_READBACK             = IMPOSSIBLE
PROVIDER_COUNT           = 2
CNC_ROUTING              = CNC Router 4050×2050
PROFILE_FORMING          = CNC modelator AL 1–2 mm
FACE_BACK_SAME_MACHINE   = YES
MANUAL_WORK_AREAS        = NOT_REQUIRED
LETTERS_CONFIRMED_ROWS   = 13
LETTERS_PLATFORM_DEFAULT = 13
EIC_STATUS               = COMPLETE
EIC_CONSEQUENCE_VALUE    = 382.50 EUR
EIC_VALUE_IS_COMMERCIAL_PLAN = NO
CLIENT                   = DEFERRED_NOT_INVENTED
```

Complete seller data was reconciled through PATCH `/api/seller`. The eight previously approved people and their skills were created through the supported people APIs. Initial PINs were set only through PUT `/api/people/:personId/operator-pin`. No PIN value or hash is recorded here.

Costs and providers were already correct from the first Step 8 write and were left idempotent.

## Readiness

```text
HUB_MEDIA_ORGANIZATION_CONFIGURATION = COMPLETE
FIRST_REAL_LETTERS_JOB               = READY_FOR_REAL_CLIENT_ENTRY
LETTERS_12_TASK_COVERAGE             = COMPLETE
CLAIM_ON_START_READINESS             = READY
CUSTOMER_OPERABLE_WITHOUT_CURSOR     = YES
```

No client, quote, order, job, plan, task, inventory movement, or operator session was created.

## Evidence

Ignored pack:

`C:/Users/offic/workspace/workos-final-pilot-hf-scope/.tmp/workos-hub-media-organization-configuration-step8/pack`

```text
MANIFEST_SHA256 = bf3a7bff10b8af60f8b5053317073c1a0a2be6b6042595c8b938e4fcce91a60f
PRIVACY_SCAN    = PASS
TESTS           = PASS 61
WEB_HEALTH      = PASS
API_HEALTH      = PASS
```

## Advisories

- Shared initial PIN is Owner-accepted for this controlled non-production pilot only. Owner can change it individually later. It is not a product default, seed, or other-organization behavior.
- Seller schema has no phone/email contact fields. Legal, fiscal, address, and bank fields are configured.
- Extra vinyl/print capability-skill mappings have no public API. LETTERS none/none uses the existing foundation mappings.
- Universal Machine Admin UI remains unused. The two real providers stay as previously applied.
- Missing real client is not an organization-configuration failure.

## Boundaries

```text
PRODUCT_CODE_DIFF            = NONE
UI_CODE_DIFF                 = NONE
API_CODE_DIFF                = NONE
SCHEMA_DIFF                  = NONE
CLIENT_MUTATIONS             = 0
QUOTE_MUTATIONS              = 0
ORDER_MUTATIONS              = 0
JOB_MUTATIONS                = 0
EXECUTION_PLAN_MUTATIONS     = 0
OPERATIONAL_TASK_MUTATIONS   = 0
INVENTORY_MUTATIONS          = 0
ARCHITECTURE_C_UI_WAVE_1     = CLOSED_INTEGRATED_ON_MAIN
ARCHITECTURE_C_UI_WAVE_2     = NOT_STARTED
PUSH                         = NO
```

## Next step

First real LETTERS job, starting with real client entry. Requires a new Owner GO.
