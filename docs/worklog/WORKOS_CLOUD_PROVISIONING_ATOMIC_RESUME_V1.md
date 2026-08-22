# Cloud provisioning atomicity and explicit resume V1

Date: 2026-08-22
Branch: `fix/cloud-provisioning-atomic-resume-v1`
Base: `origin/main` `810e16e5f3c794d45a5c1a38c4d8e0edbaa77d37`

## Owner GO

`CLOUD_PROVISIONING_ATOMICITY_AND_EXPLICIT_RESUME_V1`, then correction `CLOUD_PROVISIONING_RECOVERY_CONCURRENCY_CORRECTION_V1`.

```text
VALIDATE_BEFORE_WRITE
CONTROL_PLANE_TRANSACTIONAL_BOUNDARIES
DURABLE_RESUMABLE_PROVISIONING_STATE
EXPLICIT_DURABLE_PROVISIONING_STATE
IDEMPOTENT_EXPLICIT_RESUME
FAIL_CLOSED_INCOMPLETE_ORGANIZATIONS
INITIAL_PROVISIONING_INVARIANT = EXACTLY_ONE_INITIAL_OWNER
GENERAL_ORG_POLICY             = UNCHANGED
```

## Incident

A real `cloud:provision` run left:

```text
REAL_CLOUD_ROOT = C:\Users\offic\workos-cloud-data\hub-media-pilot
1 organization
1 plane
0 users
0 memberships
```

Proven product cause: the Cloud password was validated only inside `createUser`, after Control Plane organization/plane writes and Operational Plane bootstrap. Those writes were independent auto-commits. A later failure left an organization that the old code still stored as `ACTIVE`. Exact TTY failure remains `UNKNOWN`. This build does not reopen, migrate, move, or resume that root.

Independent audit of the first local commit found four more holes on temporary fixtures:

1. Fresh create ignored a leftover `ACTIVE` organization when `provision_owner_email` was null, and could mint a second organization.
2. Two overlapping resumes with different emails could both become Owners.
3. Fault hooks disabled the owner transaction, so tests did not prove real rollback.
4. Repeat resume could rotate the password; documentation over-claimed.

## Decision

- Validate the password immediately after it is read and before `mkdir`, Control Plane open, migrations, or entity writes.
- `RESUME_ELIGIBLE_ORGANIZATION` is any `PROVISIONING` or `FAILED_RETRYABLE` organization, or a leftover `ACTIVE` organization with zero Owner memberships. Fresh create refuses if any such organization exists. One leftover returns `incomplete_organization_exists:<organizationId>`. Two or more return `multiple_incomplete_organizations`.
- Persist organization + plane registration inside one `BEGIN IMMEDIATE` Control Plane transaction after those checks and after the email-user conflict check.
- Insert the user + the initial Owner membership + `ACTIVE` in one `BEGIN IMMEDIATE` Control Plane transaction. Hashing stays outside because scrypt is async. The same transaction rereads org/status/email/users/memberships/plane and compare-and-sets `provision_owner_email` when it is null.
- `activateOrganization` stays the general gate: at least one Owner, not `DISABLED`. Initial provision/resume activates only through `activateOrganizationForInitialProvision`, which requires exactly one Owner and that it matches the claimed email/user.
- Resume is only `cloud:provision -- --resume --root --organization-id --email`. Password is TTY or `--password-stdin`. A successful resume repeated is `already_active` and does not rotate the password.
- Fault hooks throw inside the real owner transaction. They do not open a stepwise autocommit path. Historical leftover rows are seeded only in tests.
- Legacy `ACTIVE` + 0 Owners is treated as resume-eligible so the incident shape can be repaired later. That repair is `NOT_EXECUTED` on the real root.

## Atomicity boundary

```text
CONTROL_PLANE_TRANSACTIONAL_BOUNDARIES
+
DURABLE_RESUMABLE_PROVISIONING_STATE
```

`BEGIN IMMEDIATE` is used only for those two Control Plane critical sections so a second process waits for the reserved lock before its recheck. Operational Plane bootstrap is a separate file: missing or incomplete bootstrap keeps the organization unusable and resume may rebuild it. A hard kill can leave orphan plane files; this build does not delete them.

## Review residuals (accepted)

- `already_active` inspects the Operational Plane and refuses if it is missing or incomplete; it does not rebuild a complete organization’s files.
- A retry of `cloud:provision` without `--resume` refuses when any resume-eligible organization exists, including the incident leftover with `provision_owner_email = NULL`.
- Password write on resume happens only while completing the first initial Owner. Repeat resume does not rotate it.
- `--password` and `--password=` are refused. `--password-stdin` remains allowed.
- Plane-file handle cleanup inside `createProductSystemRuntime` is unchanged. Hard-kill orphan plane files are not deleted.

## Not executed

```text
REAL_HUB_MEDIA_ROOT        = UNTOUCHED
REAL_OWNER_CREATED         = NO
SECOND_REAL_ORG_CREATED    = NO
PUSH / MERGE / PR          = NO
```
