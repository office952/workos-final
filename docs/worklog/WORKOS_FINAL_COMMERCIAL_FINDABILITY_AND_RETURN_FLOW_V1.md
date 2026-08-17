# WORKOS_FINAL_COMMERCIAL_FINDABILITY_AND_RETURN_FLOW_V1

**Status:** IMPLEMENTED — runtime verified  
**HEAD baseline:** `5641f1e811d6e60d491102e18cf15de49ba9aedc`  
**Branch:** `feat/commercial-findability-v1`  
**Worktree:** `C:\Users\offic\workspace\workos-final-findability`

## Mission

Make existing commercial registries findable at current real data volume (~139 clients, ~186 quotes, many jobs) without a search platform, CRM, Documents, or any commercial mutation.

## Architecture choice

- **Client-side projection filtering** on full registry payloads already loaded by existing GET overview endpoints.
- Shared deterministic `normalizeSearchText` / `matchesSearchFields` in `packages/domain` (trim, case-insensitive `ro`, NFD diacritic fold).
- URL state: `?q=` via `useRegistrySearchQuery` (local draft + immediate replace sync; Back/refresh preserve context).
- Search ∩ existing status/stage filters.
- No DB migration, FTS, or searchableText columns.

## Surfaces

| Surface | Search fields | Notes |
|---|---|---|
| `/clients` | displayName, CUI, contact, phone, email, city | Live Customer registry; phone/email/city projected for findability |
| `/requests` | CER reference, customer display, title | Mutable request truth |
| `/quotes` | frozen customer, product, inscription, OF reference, optional CER ref | Frozen only; optional `Din cererea CER-…` from existing link table |
| `/` Lucrări | frozen client, product, inscription | Order-rooted; Attention semantics unchanged |

## Request → Product return

Product configuration with `?request=` shows Cerere + client context and **Înapoi la cerere** to the exact Request. Provenance only — no Product ownership change.

## Runtime proof (shared DEV DB)

- Clients `?q=HUB` → 3 din 139 (email `ana@hub.ro`); Back from workspace restores `?q=HUB`.
- Requests `?q=CER-9E23E468` → 1 din 10.
- Product `?request=` → Cerere CER-9E23E468 + Înapoi la cerere.
- Quotes `?q=WN2E44` → frozen inscription/client.
- Lucrări `?q=WS28A5` ∩ În execuție → 1 din pool.
- 390px: search usable, no horizontal overflow.

Screenshots:
- `docs/worklog/screenshots/clients-search.png`
- `docs/worklog/screenshots/requests-search-and-filter.png`
- `docs/worklog/screenshots/request-product-context.png`
- `docs/worklog/screenshots/quotes-search.png`
- `docs/worklog/screenshots/jobs-search-filter.png`
- `docs/worklog/screenshots/commercial-search-mobile-390.png`

## Explicit non-goals

Documents, CRM, search engine, omnibox, EIC/pricing/Quote/Order/Execution mutations, DB migration.
