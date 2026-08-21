# Minimum organization operational configuration V1

Date: 2026-08-21
Branch: `feat/minimum-organization-operational-configuration-v1`
Base: `origin/main` `0e0bf35`

## Owner GO

Close the Cloud bootstrap hole without putting HUB MEDIA equipment into every new organization.

```text
NEW_ORGANIZATION_DEFAULT       = EMPTY
ORG_PROVIDER_CONFIGURATION     = EXPLICIT + PERSISTENT
GENERIC_SKILL_FOUNDATION       = PRESENT
TRUSTED_PEOPLE_SEED            = FORBIDDEN
CLOUD_ELIGIBILITY_FAIL_CLOSED  = REQUIRED
MACHINE_ADMIN_UNIVERSAL        = NOT_REQUIRED
```

## Decision

Provider truth for empty-foundation Cloud orgs lives in the Operational Plane SQLite, not in Control Plane and not in the in-memory catalog. Runtime reloads workcenters/machines from those tables on each use. The generic skill foundation is people-free and is reused by single-plane trusted workforce. Cloud Claim/Start is fail-closed when capability mappings are missing.

## Not done

No real HUB MEDIA organization, no real owner, no Machine Admin UI, no push, no merge.
