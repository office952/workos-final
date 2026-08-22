# WorkOS Final

Clean reconstruction of the WorkOS product operating system.

This is not a cleanup of previous WorkOS code and not a fork of workflow-adv.

## Current status

Product catalog plus first canonical LETTERS product, with FACE / VOLUME / BACK / LIGHTING as roles, reusable constructive types, Product System inspection on `/components`, persisted display-label administration on `/admin`, Resources / Cost inspection on `/admin/resources` including Service / Labor Recipes, Operational Processes inspection on `/admin/processes` including Letters vinyl, RAL, electrical, closure, QC and packing composition plus reusable shop-floor welding / print / cutting processes, Workcenters / Machines capability-provider inspection on `/admin/workcenters` with the accepted assembly tables and the real shop-floor equipment map, owner-facing governance, canonical component technical settings, and lighting calculation left partial because LED geometry, module watts, and PSU catalog identity are still missing.

The app has a platform shell, a real health check, a hierarchical product catalog, and a schema-driven configuration flow for the first canonical product. Product System display labels persist in local SQLite after bootstrap. Resources remain a typed catalog. Persisted execution can assign a provider, start and complete a task, record actual consumption, and append one inventory OUT per stockable actual. Technical settings, actual costing, and commercial price are not writable yet.

## Prerequisites

- Node.js 22+
- pnpm 11.15.1

## Install

```bash
pnpm install
```

## Development

Start the API and the web app in two terminals:

```bash
pnpm dev:api
pnpm dev:web
```

- API: `http://127.0.0.1:8787/api/health`
- Web: `http://127.0.0.1:5173`
- Produse: `http://127.0.0.1:5173/products`
- Module și componente: `http://127.0.0.1:5173/components`
- Guvernanța sistemului: `http://127.0.0.1:5173/governance`
- Administrare: `http://127.0.0.1:5173/admin`

First API start creates `data/product-system.sqlite` (gitignored) unless `WORKOS_DATA_DIR` or `WORKOS_SQLITE_PATH` is set. Bootstrap copies current typed labels once. Later restarts keep owner edits.

In development the web app proxies `/api` to the API. Optional override: `VITE_API_BASE_URL`.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

The first local E2E run needs Playwright's Chromium browser:

```bash
pnpm exec playwright install chromium
```

## Reference repositories

Previous WorkOS repositories are read-only evidence. Do not write to them and do not copy their architecture into this repo.

## Roadmap

Active V1 delivery: [docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md](docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md).

Active UI/UX direction: [docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md](docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md).

Historical construction map: [docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md](docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md).
