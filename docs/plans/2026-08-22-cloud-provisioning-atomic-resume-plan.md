# Cloud provisioning atomicity and explicit resume

Date: 2026-08-22
Branch: `fix/cloud-provisioning-atomic-resume-v1`
Base: `810e16e5f3c794d45a5c1a38c4d8e0edbaa77d37`

## Decision

Owner GO `CLOUD_PROVISIONING_ATOMICITY_AND_EXPLICIT_RESUME_V1`, then correction GO `CLOUD_PROVISIONING_RECOVERY_CONCURRENCY_CORRECTION_V1`.

Brainstorm options considered:

1. Distributed two-phase commit across Control Plane and Operational Plane — rejected. Two SQLite files cannot share one transaction.
2. Delete-and-retry on any failure — rejected. Silent cleanup of unknown files is unsafe.
3. Validate password before any write, mark Control Plane rows `PROVISIONING` until owner + plane invariants hold, resume only with explicit `--organization-id` — accepted.

## How

- Validate the Cloud password before `mkdir`, Control Plane open, or migrations.
- Persist organization + plane registration as `PROVISIONING` with owner-email intent inside one `BEGIN IMMEDIATE` Control Plane transaction that first refuses any `RESUME_ELIGIBLE_ORGANIZATION` and any existing user email.
- Bootstrap the Operational Plane as a separate SQLite. Failure leaves the organization unusable for login.
- Insert user + the initial Owner membership + `ACTIVE` in one `BEGIN IMMEDIATE` Control Plane transaction. Hashing stays outside because scrypt is async. Immediately before those writes the same transaction rereads org/status/email/users/memberships/plane and compare-and-sets `provision_owner_email` when it is null.
- Resume: `cloud:provision -- --resume --root <root> --organization-id <id> --email <email>`.
- `INITIAL_PROVISIONING_INVARIANT = EXACTLY_ONE_INITIAL_OWNER`. General later multi-owner policy is unchanged.
- Fault hooks throw inside the same transaction the CLI uses. They must not open a stepwise autocommit path. Leftover historical rows are seeded only in tests.
- Tests use only temporary roots. The real HUB MEDIA root is not opened.

## Correction notes

- `RESUME_ELIGIBLE_ORGANIZATION` is `PROVISIONING`, `FAILED_RETRYABLE`, or legacy `ACTIVE` with zero Owner memberships. Fresh create refuses if any such organization exists. One leftover returns `incomplete_organization_exists:<id>`. Two or more return `multiple_incomplete_organizations`.
- `BEGIN IMMEDIATE` is limited to the two Control Plane critical sections (register org+plane, complete initial owner). It takes the reserved lock before the first statement so a second process cannot observe “no owner / no leftover” and then write.
- Repeat resume after a successful initial owner does not rotate the password.
- Migration `002` stays the unpushed schema change: nullable intent/failure columns plus a partial unique index on claimed `provision_owner_email`.

## Not executed

Recovering `C:\Users\offic\workos-cloud-data\hub-media-pilot` stays a later Owner GO.
