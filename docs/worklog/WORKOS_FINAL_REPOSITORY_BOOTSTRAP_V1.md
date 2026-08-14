# WORKOS_FINAL_REPOSITORY_BOOTSTRAP_V1

TASK = Phase 0 repository foundation: clean repo, real health loop, checks, CI, docs

START STATE = Empty local folder, no git, empty private GitHub repo office952/workos-final

LOCAL PATH = C:\Users\offic\workspace\workos-final

REMOTE = https://github.com/office952/workos-final.git

STACK DECISION =
- Frontend: React + TypeScript + Vite
- Backend: Hono + TypeScript + Node
- Package manager: pnpm workspaces
- Unit tests: Vitest
- E2E: Playwright
- Why: `node` and `pnpm` were on PATH. `python` / `uv` were not on PATH. Phase 0 is a health loop, not product math. One runtime, one package manager. FastAPI deferred.

FILES CREATED =
- .gitignore
- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml
- eslint.config.js
- playwright.config.ts
- README.md
- AGENTS.md
- .github/workflows/ci.yml
- .cursor/rules/e2e-first.mdc
- .cursor/rules/one-truth.mdc
- .cursor/rules/operator-ui-and-analyzer.mdc
- .cursor/rules/boundaries.mdc
- apps/api/package.json
- apps/api/tsconfig.json
- apps/api/vitest.config.ts
- apps/api/src/app.ts
- apps/api/src/index.ts
- apps/api/tests/health.test.ts
- apps/web/package.json
- apps/web/tsconfig.json
- apps/web/tsconfig.app.json
- apps/web/tsconfig.node.json
- apps/web/vite.config.ts
- apps/web/index.html
- apps/web/src/main.tsx
- apps/web/src/App.tsx
- apps/web/src/HealthStatus.tsx
- apps/web/src/health.ts
- apps/web/src/index.css
- apps/web/src/vite-env.d.ts
- apps/web/src/test-setup.ts
- apps/web/src/health.test.ts
- apps/web/src/HealthStatus.test.tsx
- e2e/smoke.spec.ts
- docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md
- docs/worklog/WORKOS_FINAL_REPOSITORY_BOOTSTRAP_V1.md

COMMANDS =
- git init -b main
- git remote add origin https://github.com/office952/workos-final.git
- pnpm install
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm exec playwright install chromium
- pnpm e2e
- Invoke-WebRequest http://127.0.0.1:8787/api/health
- git add / commit / push -u origin main

TESTS =
- lint PASS
- typecheck PASS
- unit PASS (api 1, web 4)
- build PASS
- E2E PASS (1 smoke)

RUNTIME =
- API listened on http://127.0.0.1:8787
- GET /api/health returned HTTP 200 `{"status":"ok","service":"workos-final-api"}`
- Port 8000 was already occupied by an unrelated local Python process; API uses 8787 to avoid touching it

E2E =
- Playwright started API + Vite
- Browser opened `/`
- Title WorkOS Final visible
- Text "Backend conectat" visible from real health response
- Reload
- Same assertions held
- No pageerror / fatal console errors
- 1 passed (7.7s)

BLOCKERS = None. Python exists at Python312 but was not on PATH; stack stayed Node/Hono as planned.

SECURITY CHECK =
- No secrets committed
- .env ignored
- No .env.example needed
- CORS limited to local Vite hosts
- No credentials hardcoded
- Auth deferred

COMMIT = chore: bootstrap WorkOS Final development loop

PUSH = origin/main authorized for office952/workos-final

NEXT STEP = Phase 1 only after Owner GO: platform shell + capability boundaries. Do not implement without GO.
