# WorkOS Final

Clean reconstruction of the WorkOS product operating system.

This is not a cleanup of previous WorkOS code and not a fork of workflow-adv.

## Current status

Product catalog plus first canonical LETTERS product, with component-owned FACE / VOLUME / BACK internal cost, a read-only Product System administration foundation on `/components`, owner-facing governance, canonical component technical settings, and lighting left incomplete because PSU reserve is still owner-undecided.

The app has a platform shell, a real health check, a hierarchical product catalog, and a schema-driven configuration flow for the first canonical product. Cross-system administration is mapped; no business database, admin write path, global Administrare nav, or commercial price exists yet.

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

See [docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md](docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md).
