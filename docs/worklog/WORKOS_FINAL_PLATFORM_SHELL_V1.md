# WORKOS_FINAL_PLATFORM_SHELL_V1

TASK = Phase 1 micro-slice: minimal real application shell

STARTING HEAD = f72001a2fa81a2aa4cbb07936757da75330498cf

FINAL HEAD = pending commit

SCOPE =
- App header, one real nav item, content area
- Existing health proof moved into the shell
- No fake business menus, no Phase 2

ARCHITECTURE DECISION =
- Reusable AppShell + SystemStatusPage
- No router yet: only one real page exists
- Capability kernel untouched and not rendered

FILES CHANGED =
- apps/web/src/App.tsx
- apps/web/src/AppShell.tsx
- apps/web/src/AppShell.test.tsx
- apps/web/src/SystemStatusPage.tsx
- apps/web/src/HealthStatus.tsx
- apps/web/src/index.css
- e2e/smoke.spec.ts
- AGENTS.md
- docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md
- docs/worklog/WORKOS_FINAL_PLATFORM_SHELL_V1.md

TESTS =
- lint PASS
- typecheck PASS
- unit PASS (web 5, api 1, domain 8)
- build PASS
- E2E PASS
- git diff --check pending

E2E / RUNTIME =
Browser → Vite → GET /api/health → Hono → JSON → Romanian shell + Backend conectat

UI OWNER VERIFICATION =
- URL: http://127.0.0.1:5173/
- Page: Stare sistem
- Header: WorkOS Final
- Nav: Stare sistem
- Content: Verificarea conexiunii cu sistemul. + real health
- No Produse / Comenzi / Rapoarte links

FORBIDDEN SCOPE = Phase 2 and business systems not started

NEXT STEP = Owner verdict on Phase 1, then Phase 2 only with separate GO
