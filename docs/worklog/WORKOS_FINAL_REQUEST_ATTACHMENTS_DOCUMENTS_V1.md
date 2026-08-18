# WORKOS_FINAL_REQUEST_ATTACHMENTS_DOCUMENTS_V1

**Status:** IMPLEMENTED — runtime verified  
**HEAD baseline:** `0eb798a329d32b988ac18d1758839e21aa697aed`  
**Branch:** `feat/request-attachments-documents-v1`  
**Worktree:** `C:\Users\offic\workspace\workos-final-documents`

## Mission

First concrete Documents capability: real files received from the client, attached to a Commercial Request (Cerere). Not a generic DMS.

## Architecture

- **CommercialRequestAttachment** owns metadata (`att:{uuid}`).
- SQLite table `commercial_request_attachments` (migration `021_commercial_request_attachments.sql`).
- Bytes under `WORKOS_DATA_DIR/documents/requests/<safe-requestId>/<opaque-storage-key>`.
- Request owns the file. Client / Quote / Order do not copy bytes; they reach files via existing relations.
- Upload / list / download only. No delete, versioning, preview, SVG/DWG analysis, portal, or email import.
- CANCELLED: existing downloads work; new uploads blocked.
- Max size: 50 MB. SHA-256 is integrity evidence, not identity (no dedup).

## Backup boundary

Restore requires **both** the SQLite database **and** the `documents/` directory under the WorkOS data root.

## API

- `GET /api/requests/:requestId/attachments`
- `POST /api/requests/:requestId/attachments` (multipart field `file`)
- `GET /api/requests/:requestId/attachments/:attachmentId/download` (`Content-Disposition: attachment`)

## UI

Request Detail (`/requests/:requestId`) section **Fișiere client** after request fields, before Oferte legate.

## Test isolation note

Vitest prefers `:memory:` even when the shell exports `WORKOS_SQLITE_PATH`. Attachment tests also set a temporary `WORKOS_DATA_DIR`.

## Runtime proof (isolated QA data root)

- Request `crq:1e3e60c0-c54a-439f-a7a2-0b21177dba54` / `CER-1E3E60C0`
- URL: `http://127.0.0.1:5173/requests/crq%3A1e3e60c0-c54a-439f-a7a2-0b21177dba54`
- Files: `qa-brief.txt` (30 B), `qa-logo.png` (12 B), long SVG (75 B)
- Attachment IDs: `att:69bfd61c-…`, `att:e96d5296-…`, `att:a5b699cd-…`
- Quote freeze `qts:PRD-LETTERS-FRONTLIT-PLEXI-AL06:ac9cb5ee…` contentHash unchanged by attachments
- Client workspace `/clients/cus:0a77c74d-…` → Cerere → files; no CustomerAttachment
- 390px screenshot: `request-files-mobile-390.png`

DATA_ROOT_SOURCE: `WORKOS_DATA_DIR` (QA used an isolated temp directory)
ATTACHMENT_STORAGE_RELATIVE_ROOT: `documents/requests/<safe-requestId>/<opaque-key>`
DB_TABLE: `commercial_request_attachments`
MIGRATION_ID: `021_commercial_request_attachments.sql`
MAX_UPLOAD_BYTES: 52428800
DOWNLOAD_CONTENT_DISPOSITION: `attachment; filename="…"; filename*=UTF-8''…`

- `docs/worklog/screenshots/request-files-empty.png`
- `docs/worklog/screenshots/request-files-with-attachments.png`
- `docs/worklog/screenshots/request-file-upload-success.png`
- `docs/worklog/screenshots/request-files-mobile-390.png`
- `docs/worklog/screenshots/quote-request-provenance-to-files.png`

## Explicit non-goals

Global DMS, folders/tags, preview engine, file analysis, Product/Quote/Order mutation, public portal, email ingest, RBAC, antivirus platform, deletion/versioning.
