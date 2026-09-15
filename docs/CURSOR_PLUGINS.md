# Cursor plugins — ghid de utilizare pentru WorkOS Final

```text
ROLE                       = TOOLING
OWNS                       = PLUGIN_MCP_INVENTORY_AND_HARNESS_V2
DOES_NOT_OWN               = PRODUCT_TRUTH, DELIVERY_SEQUENCE, CURSOR_METHOD
```

Acest fișier este **inventar tooling**, nu metodă și nu canon de produs.
Metoda WorkOS pentru Cursor: `docs/development/WORKOS_CURSOR_WORKFLOW.md`.
Adevărul de business rămâne în `docs/architecture/` și în contractele de domeniu. `AGENTS.md` nu este Product Truth.
Pluginurile ajută agentul să planifice, să verifice, să citească documentație și să studieze UI.
Nu înlocuiesc Owner GO, one-truth, E2E-first sau `docs/architecture/UI_UX_FOUNDATION_CANON.md`.

CONFIGURED, INSTALLED, AVAILABLE, CONNECTED și ACTUALLY_USED nu sunt sinonime.
Nu pretinde CONNECTED doar pentru că un paragraf vechi spune „deja activ”.

Clasificare folosită aici:

| STATUS | Meaning |
|---|---|
| VERIFIED_CONNECTED | live handshake succeeded in the classifying session |
| VERIFIED_AVAILABLE | namespace or files were visible; no live handshake claimed |
| DOCUMENTED_NOT_REVERIFIED | older prose; not re-proven |
| CANDIDATE_NOT_INSTALLED | intentionally not installed |
| NOT_TESTED | exists as a Cursor type or docs mention; not proven here |
| UNAVAILABLE | looked for and not found |

### Classification this documentation slice (2026-09-15)

| NAME | ROLE | STATUS | REQUIRED_FOR_CURRENT_WORK |
|---|---|---|---|
| Figma MCP | visual / interaction read | VERIFIED_CONNECTED | only when a recorded Figma authority is material |
| Cursor IDE Browser | in-IDE page inspect | VERIFIED_AVAILABLE | UI/runtime claims |
| Playwright MCP | separate browser MCP | VERIFIED_AVAILABLE | not the repo E2E authority |
| Context7 | library docs | VERIFIED_AVAILABLE | library API questions |
| BrowserStack MCP | real-device / Percy tools | VERIFIED_AVAILABLE | not a substitute for isolated E2E |
| Subtext | session replay | VERIFIED_AVAILABLE | only if Fullstory sessions exist |
| 21st.dev | visual inspiration | VERIFIED_AVAILABLE | never Product Truth |
| shadcn MCP | component patterns | VERIFIED_AVAILABLE | consult only; no init |
| Compound Engineering | plan/work/review skills | DOCUMENTED_NOT_REVERIFIED | optional method helper |
| Cursor Team Kit | verify/CI/review skills | DOCUMENTED_NOT_REVERIFIED | optional method helper |
| Bugbot | PR review agent type | NOT_TESTED | no |
| Cloud Agents | remote agents | NOT_TESTED | no |
| Isolated E2E runner | repo runtime proof | VERIFIED_AVAILABLE | product/runtime claims |

Evidence for Figma CONNECTED: read-only `whoami` plus `get_metadata` on recorded file keys in the documentation-continuity session. Identities are not recorded here.

După instalări locale: **Developer: Reload Window** în Cursor, ca skill-urile noi să se încarce.

Instalare / gestionare în UI: sidebar **Customize** → marketplace, sau [cursor.com/marketplace](https://cursor.com/marketplace).
Pluginurile Cursor nu sunt extensii VS Code. Nu le instala din panoul Extensions.

---

## Ce e util aici, și de ce

WorkOS Final are deja UI proprie, Playwright local, `gh`, și reguli stricte.
Am ținut doar pluginuri care ajută acest flux:

| Nevoie | Plugin |
|---|---|
| Studiu / desen UI | Figma |
| Inspirație UI, fără a copia business truth | 21st.dev, shadcn (cu frână) |
| Plan → work → review | Compound Engineering, Cursor Team Kit |
| Documentație de librării, actuală | Context7 |
| Browser live în Cursor | Browser din Cursor + Playwright MCP + browse |
| E2E pe dispozitive reale | BrowserStack |
| Scan React | React Doctor |
| API-uri web moderne (dialog, popover, view transitions) | Modern Web Guidance |
| Audit „poate un agent să pornească repo-ul?” | Agent Compatibility |
| Canvas pentru documentație | Docs Canvas |
| CLI-uri prietenoase cu agenții | CLI for Agents |
| Replay sesiuni / privacy | Subtext (dacă există Fullstory) |

---

## Deja active înainte de acest pas

Acestea erau instalate și folosibile. Nu le-am reinstalat.

### Figma

STATUS: see classification table. Do not treat older “autentificat” prose as a live handshake.

Marketplace: [cursor.com/marketplace/figma](https://cursor.com/marketplace/figma)

**Când:** studiu de ecran, FigJam, sau „fă un fișier Figma din UI-ul actual”.
**Nu:** Code Connect în repo, și nu lăsa Figma să decidă materiale, prețuri, readiness sau Product Truth.

Ce spui în chat:

```text
Deschide acest link Figma și spune-mi structura ecranului.
Creează un fișier Figma de studiu pentru /admin/workcenters.
Fă un FigJam cu fluxul operator: confirmă → snapshot → task-uri.
```

Skill-uri utile: `/figma-create-new-file`, `figma-use`, `figma-generate-design`, `figma-use-figjam`.
Agentul trebuie să încarce skill-ul **înainte** de `use_figma` / `create_new_file`.

### Compound Engineering

Marketplace: [cursor.com/marketplace/compound-engineering](https://cursor.com/marketplace/compound-engineering)

Bucla: ideate → brainstorm → plan → work → review → compound.

```text
/ce-brainstorm
/ce-plan
/ce-work
/ce-code-review
/ce-debug
/ce-explain
```

**Frână WorkOS:** `/ce-compound` vrea să scrie în `docs/solutions/`. În acest repo învățările durabile stau în `docs/worklog/` și în canon, nu într-un al doilea arbore de „solutions”. Nu lăsa pluginul să inventeze STRATEGY.md sau o a doua arhitectură.

### Cursor Team Kit

Marketplace: [cursor.com/marketplace/cursor-team-kit](https://cursor.com/marketplace/cursor-team-kit)

Workflow-uri interne Cursor, fără SaaS extra. Potrivit pentru acest repo.

```text
Verifică afirmația asta cu evidență locală.          → verify-this
Rulează smoke-ul Playwright pe ecranele atinse.      → run-smoke-tests
Curăță slop-ul din diff.                             → deslop
Rezolvă CI-ul căzut.                                 → fix-ci / loop-on-ci
Arată review-ul ca canvas.                           → pr-review-canvas
```

Alte skill-uri: `check-compiler-errors`, `control-ui`, `control-cli`, `review-and-ship`, `get-pr-comments`, `make-pr-easy-to-review`.

### Context7

Marketplace: [cursor.com/marketplace/context7](https://cursor.com/marketplace/context7)
MCP: `plugin-context7-plugin-context7` (poate cere autentificare la primul lookup).

**Când:** „cum se folosește Playwright 1.x / Vite / React Testing Library **acum**”.
**Nu:** refactor, business logic, review de produs.

```text
Ce API are Playwright pentru locators exacte, din docs-ul curent?
```

Agentul face `resolve-library-id`, apoi `query-docs`.

### shadcn/ui

Marketplace: [cursor.com/marketplace/shadcn](https://cursor.com/marketplace/shadcn)

WorkOS Final **nu** are `components.json`. UI-ul operator urmează `docs/architecture/UI_UX_FOUNDATION_CANON.md`.

**Permis:** consultat un pattern (tabs, dialog, focus).
**Interzis:** `shadcn init` sau dump de componente care înlocuiesc gramatica vizuală a produsului.

### browse (Browserbase)

Rulează un browser din CLI. Local nu cere cheie. Cloud cere `BROWSERBASE_API_KEY`.

```text
Deschide http://127.0.0.1:5173/admin/processes și spune ce vede operatorul.
```

Pentru verificări în tab-ul Cursor, preferă browserul built-in. Pentru suite-ul din repo, preferă Playwright-ul proiectului (`e2e/`).

### BrowserStack

STATUS: VERIFIED_AVAILABLE (namespace present). Not claimed CONNECTED or ACTUALLY_USED. A BrowserStack account is required for real devices, Percy, and Test Management.

```text
Rulează suite-ul Playwright pe un Chrome real din BrowserStack.
Fă un scan de accesibilitate pe /admin.
```

Nu înlocuiește E2E-ul local. E pentru dovezi pe browsere/device-e pe care nu le ai aici.

### Subtext (Fullstory)

Replay sesiuni și reguli de privacy. Util doar dacă există sesiuni Fullstory.

```text
Analizează sesiunea asta și spune unde s-a blocat operatorul.
```

Nu e browser live și nu e dovadă E2E. Skill-uri: `subtext-review`, `subtext-session`, `subtext-privacy`.

### 21st.dev

STATUS: VERIFIED_AVAILABLE (namespace present). User-level MCP configuration is outside this repository. Do not commit or quote credentials.

**Când:** inspirație vizuală (card, toolbar, empty state).
**Nu:** copia un kit străin peste UI-ul WorkOS. Operatorul rămâne în română. Business truth nu se mută în componenta inspirată.

```text
Arată-mi 3 variante de toolbar compact pentru o pagină admin read-only.
```

---

## Instalate / reparate în acest pas

### Agent Compatibility — reparat

Junction-ul local era rupt. Acum pointează la cache-ul valid.

```text
Rulează check-agent-compatibility pe workos-final.
```

Sau în terminal:

```powershell
npx -y agent-compatibility@latest .
```

Scorul e heuristic: cât de ușor pornește un agent rece repo-ul. Nu e verdict de calitate de produs.

### Modern Web Guidance — instalat

Skill Chrome pentru API-uri web actuale (popover, dialog, `:has()`, view transitions, container queries).

```text
Folosește un dialog nativ modern, nu un overlay vechi, pentru confirmarea read-only.
```

**Frână:** nu lăsa ghidul să rescrie IA-ul admin sau să inventeze câmpuri de produs. Canonul UX rămâne al nostru. Folosește-l pentru platformă, nu pentru adevăr de business.

### Context7 — skill-uri legate local

MCP-ul exista. Am adăugat manifest Cursor local ca skill-urile / agentul `docs-researcher` să se încarce după reload.

### Docs Canvas — instalat

Cere un canvas navigabil din documentație, nu un markdown plat.

```text
Fă un docs canvas pentru harta admin: Resurse → Procese → Utilaje.
```

Skill-ul e încă outline. Canvas-ul built-in din Cursor rămâne motorul real.

### CLI for Agents — instalat

Când scriem un CLI pe care agentul trebuie să-l poată rula: flag-uri non-interactive, `--help` cu exemple, erori acționabile, dry-run, idempotență.

Nu e nevoie zilnic. Devine util la scripturi de gate / harness.

### React Doctor — instalat

```text
/doctor
Scanează doar fișierele React schimbate și spune dacă scorul a regresat.
```

```powershell
npx react-doctor@latest --verbose --scope changed
```

**Frână:** repară hygiene React (efecte, a11y, bundle). Nu schimba contracte de domeniu și nu „îmbunătăți” copy-ul ca să pară alt produs.

### Playwright MCP

STATUS: VERIFIED_AVAILABLE (namespace present). User-level MCP configuration is outside this repository.

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"]
}
```

**Când:** agentul trebuie să deschidă un browser real, separat de tab-ul Cursor.
**Pentru dovada de produs:** rămân testele din `e2e/` și browserul Cursor pe `http://127.0.0.1:5173/`.

După reload, serverul `playwright` ar trebui să apară în MCP. Prima rulare poate descărca `@playwright/mcp`.

---

## Unelte Cursor built-in (nu sunt pluginuri, dar se folosesc la fel)

| Unealtă | Rol |
|---|---|
| Browser Cursor (`cursor-ide-browser`) | Tab controlat de agent: snapshot, click, screenshot, CDP |
| App Control | Deschide fișiere, redenumește chat, reguli user |
| Canvas skill | Afișează analize / review-uri ca app React lângă chat |
| `gh` din terminal | Issues, PR, checks — deja în fluxul repo-ului |

Pentru o afirmație de UI: agentul deschide app-ul real, nu inventează stări.

---

## Ce nu am instalat, și de ce

| Plugin | Motiv |
|---|---|
| **WorkOS** (workos.com AuthKit / SSO) | Alt produs. Numele se ciocnește cu WorkOS Final. Auth nu e autorizat. |
| Clerk / Auth0 / Stripe | Commercial / auth — fără Owner GO |
| MagicPath / Paper / tldraw / Canva | Dublează Figma |
| Superpowers | Impune un alt workflow obligatoriu peste Owner GO / E2E-first |
| Continual Learning | Rescrie `AGENTS.md` singur — periculos aici |
| Sentry / Datadog / MongoDB / Prisma / Supabase | Nu avem observabilitate prod sau business DB |
| Linear / Slack / Notion / Google | SaaS de echipă, doar dacă le folosești zilnic |
| GitHub MCP | `gh` acoperă fluxul. MCP-ul cere OAuth extra. |

Dacă vrei unul din lista de mai sus: **Customize → Install**, apoi actualizăm acest ghid.

---

## Cum ceri lucruri, pe tip de muncă

### Studiu UI

```text
Deschide /admin/workcenters în browser și compară-l cu gramatica din docs/architecture/UI_UX_FOUNDATION_CANON.md.
Dacă e nevoie de studiu vizual, fă un fișier Figma, nu schimba business truth.
```

### Feature cu GO

```text
/ce-plan pe GO-ul ăsta, apoi implementează. Nu ieși din contractul de domeniu.
La final: lint, typecheck, test, e2e real, nu mock.
```

### Bug

```text
/ce-debug. Reprodu pe runtime. verify-this pe afirmația de fix.
```

### Docs de librărie

```text
Folosește Context7, nu memoria modelului, pentru API-ul X.
```

### Verificare React

```text
/doctor pe apps/web, doar hygiene, fără redesign.
```

---

## Unde stau fișierele

| Loc | Ce e |
|---|---|
| User-level Cursor local plugins directory | Pluginuri încărcate local |
| User-level Cursor plugin cache | Copii marketplace descărcate |
| User-level Cursor MCP config | Figma, shadcn, Subtext, 21st, Playwright — outside this repository |
| Customize în Cursor | On / off, scope user vs project, auth MCP |

Pluginuri locale acum:

```text
agent-compatibility
browse
cli-for-agent
compound-engineering
context7-plugin
cursor-team-kit
docs-canvas
figma
modern-web-guidance
react-doctor
shadcn
subtext
```

---

## Frâne permanente pentru WorkOS Final

1. UI operator = română. Codul intern poate rămâne englez.
2. UI codează experiență, nu adevăr de business.
3. Un fact = un owner. Pluginul nu devine a doua autoritate.
4. Done = path real + evidență runtime, nu screenshot singur.
5. Fără DB de business, auth, Analyzer runtime, sau un produs de catalog nou, fără Owner GO.
6. Nu instala pluginul **WorkOS** de la workos.com în acest workspace.

---

## CURSOR WORKOS HARNESS V2

This section is Cursor engineering methodology. It is not Product Truth, not a delivery roadmap, not Figma authority, and not a business settings store.

Live delivery flags stay in `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`.

### Orchestration model

```text
CURSOR_EXECUTION_MODE     = MAX_CAPABILITY
ONE_WRITER                = SOCIAL_LAW
READONLY_SPECIALISTS      = 3
PLAN_MODE                 = PREFERRED FOR COMPLEX / UNCLEAR WORK
REPORTS                   = EVIDENCE, NOT OWNER ACCEPTANCE
```

Complex, multi-file, or unclear work starts in Plan Mode. A rule cannot flip the IDE mode. Independent research uses readonly subagents. Shared product code has one writer. Do not launch an agent swarm for appearance.

SUBAGENT ≠ SKILL. A subagent is a separate context that returns findings. A skill is a same-context how-to. Phase 1 adds zero new Skills.

### Readonly specialists

Project files in `.cursor/agents/` use only official keys: `name`, `description`, `model`, `readonly`, `is_background`.

| Agent | Job |
|---|---|
| `workos-product-truth-reviewer` | Find invented second owners of business facts. Do not restate Product Truth. |
| `workos-runtime-evidence-reviewer` | Check claims against existing tests/logs/runtime. Do not invent PASS. Do not start servers. |
| `workos-red-team` | Attack the current change. Do not assume PASS. |

They must not commit, push, merge, mutate Cloud/real data, or claim Owner acceptance. One-writer is a social law. Cursor cannot mechanically stop a readonly agent from inheriting MCP or spawning a child.

### Plan Mode / Browser / runtime

Use Plan Mode first when the path is multi-file, architectural, or unclear.

UI or runtime claims need the first-party Browser and the repository tests (`node .cursor/run-isolated-e2e.mjs`, existing unit tests). Screenshots alone are not PASS.

Playwright configuration is `retries: process.env.CI ? 1 : 0`. Do not claim configured retries=0 for CI.

### Hooks

`.cursor/hooks.json` is official schema `version: 1`. Scripts are Node. The general classifier uses `failClosed: false` so a parser crash cannot freeze every shell.

`beforeShellExecution` classifies tokens, not naive substrings:

```text
HOOK_GIT_READONLY          = ALLOW
HOOK_VERIFICATION          = ALLOW
HOOK_GIT_COMMIT            = ALLOW
HOOK_GIT_COMMIT_AMEND      = ASK
HOOK_GIT_FETCH             = ALLOW
HOOK_GIT_NORMAL_HEAD_PUSH  = ALLOW if current branch is not main/master
HOOK_GIT_FORCE_PUSH        = DENY
HOOK_GIT_PUSH_MAIN         = DENY
HOOK_GIT_REPO_REDIRECT_MUTATION = DENY
HOOK_GH_PR_CREATE          = ALLOW
HOOK_GH_PR_INSPECT         = ALLOW
HOOK_GH_PR_MERGE           = DENY
HOOK_GH_API_MERGE          = DENY
HOOK_UNCERTAIN_COMMAND     = ASK
OPAQUE_WRAPPERS            = DENY
DIRECT_PNPM_E2E            = DENY
DIRECT_PLAYWRIGHT_VARIANTS = DENY
ISOLATED_E2E_RUNNER        = ALLOW
HOOK_ASK_SECURITY_GATE     = NO
HOOKS_ARE_ACCIDENT_GUARDRAILS = YES
HOOKS_ARE_SECURITY_SANDBOX = NO
```

Owner authorization is workflow/scope authorization. After a task authorizes COMMIT / PUSH / CREATE_PR, routine reversible commands required for those actions must return ALLOW. ASK is the exception for unknown or still-gated commands, not the normal path.

State-changing git with `-C`, `--git-dir`, or `--work-tree` is DENY. Do not resolve the other repository. Run mutations from the intended WorkOS worktree. Readonly `git -C … status|diff|log|show|rev-parse` stays ALLOW. One-shot `git -c user.name=…` is not repository redirection.

Normal feature-branch push ALLOW is branch-aware. For `git push origin HEAD`, `git push -u origin HEAD`, and `git push --set-upstream origin HEAD`, the hook reads the current branch from `cwd` with `git -C <cwd> branch --show-current`. ALLOW only when that branch is non-empty and not `main`/`master`. Resolution failure is DENY, not ASK. Explicit `git push origin main|master`, force-push, `gh pr merge`, and `gh api` `/pulls/<n>/merge` or `/merges` stay DENY. `git commit --amend` / `--fixup` / `--squash` are not routine ALLOW. Other `git push` / `git merge` forms stay ASK.

Local proof on Cursor 3.20.21: ALLOW executed; DENY was blocked before execution. Later Owner runtime evidence showed ASK can interrupt with `Hook requested approval` (example: `git push -u origin HEAD`). ASK is therefore an interruption signal, not a security gate. Do not use ASK for routine authorized workflow.

Direct `pnpm e2e` and ordinary Playwright entrypoints (`pnpm exec playwright`, `pnpm dlx playwright`, `pnpm playwright`, `npx playwright`, `playwright test`) are DENY. Use `node .cursor/run-isolated-e2e.mjs`.

Opaque wrappers that can hide destructive execution (`-EncodedCommand` / `-enc`, `Invoke-Expression` / `iex`, `node -e` / `--eval`, `python -c` / `python3 -c` / `py -c`, `bash -c`, `sh -c`) are DENY. `powershell -Command "<plain command>"` and `cmd /c "<plain command>"` stay unwrap-and-classify.

A dedicated `failClosed: true` hook (`node .cursor/hooks/catastrophic-deny.mjs`) matches only high-confidence catastrophic command text and always returns DENY. It does not reclassify and does not return ASK. The general before-shell classifier stays `failClosed: false`.

Audit lines go to `.tmp/cursor-hooks-audit/` and record only event, permission, category, timestamp, and optional subagent type/status. They must not store command, cwd, task, output, tokens, or file contents.

`subagentStart` / `subagentStop` audit type/status only. No `stop` followup loops.

Prove classification with `node --test .cursor/hooks/classify-shell.test.mjs .cursor/setup-worktree.test.mjs`. Do not run real destructive commands to test the guard.

### Worktrees

`.cursor/worktrees.json` runs `node .cursor/setup-worktree.mjs` on Windows and Unix. That script may only run `pnpm install --frozen-lockfile`.

Windows uses `pnpm.cmd` with `shell: true`. Unix uses `pnpm` with `shell: false`. The same resolution path can probe `pnpm --version` without installing. The install child environment removes `WORKOS_CLOUD_ROOT`, `WORKOS_SQLITE_PATH`, `WORKOS_CLOUD_E2E`, `WORKOS_CLOUD_E2E_PASSWORD`, `WORKOS_WAVE3_CLOUD_ROOT`, and `WORKOS_DATA_DIR`. PATH and package-manager environment stay.

It does not copy `.env`, `.env.local`, or SQLite. It does not invoke migrate/seed commands or start servers on 5173/8787.

`node .cursor/run-isolated-e2e.mjs` allocates unused ports other than 5173/8787, uses a unique `.tmp/isolated-e2e/<token>` data dir, and removes real Cloud / SQLite pointers from the child environment before invoking the existing `pnpm e2e`. It does not copy `.env` or SQLite. The Harness runner does not invoke migration/seed commands against an existing or real database. WorkOS API startup may initialize/apply its normal schema migrations inside the disposable isolated E2E database under `.tmp/isolated-e2e/<token>`; that disposable migration is expected test initialization.

### Permissions

```text
PROJECT_PERMISSIONS_IMPLEMENTED = YES
CLI_PERMISSIONS_IMPLEMENTED     = NO
RUN_MODE                        = AUTO_REVIEW
PERMISSIONS_ALLOWLIST           = CONVENIENCE_FOR_READONLY_AND_VERIFICATION
STATE_CHANGING_ROUTINE_AUTHORITY = OWNER_GO + CONTEXTUAL_HOOK
AUTO_REVIEW                     = CURSOR_REVIEW_LAYER
HOOKS                           = ACCIDENT_GUARDRAILS
HOOKS_ARE_ACCIDENT_GUARDRAILS   = YES
HOOKS_ARE_SECURITY_SANDBOX      = NO
ONE_WRITER                      = SOCIAL_PROCESS_LAW
PERMISSIONS_SECURITY_BOUNDARY   = NO
HOOK_SECURITY_BOUNDARY          = NO
AUTO_REVIEW_SECURITY_BOUNDARY   = NO
```

`.cursor/permissions.json` is repository-specific convenience for Auto-review. Official Cursor docs (permissions reference, run modes, hooks; read 2026-09-15 against Cursor 3.20.21):

- `terminalAllowlist` entries are case-sensitive command prefixes. This repo allowlists only read-only git, verification, isolated E2E, diagnostics, and GitHub inspection. It does not allowlist `git add`, `git commit`, `git push`, or `gh pr create`.
- State-changing routine commit/push/PR create is authorized by Owner GO plus the contextual project hook, not by prefix matching.
- When the key is present, it overrides the in-app terminal allowlist. An empty array is an empty allowlist, not an IDE fallback. This file does not define `mcpAllowlist`. Official docs also concatenate `~/.cursor/permissions.json` with the repo file; a user-level `git` prefix would still match every git command. This repo file is not an isolated policy.
- Auto-review order: allowlisted calls run immediately; other shell commands may run sandboxed; the rest go to the Auto-review classifier. `autoRun` steers that classifier only.
- Official docs state allowlists and `autoRun` are best-effort convenience, not a security guarantee.
- `beforeShellExecution` input includes `cwd`. The hook uses that for read-only current-branch resolution before allowing `git push origin HEAD`. If `cwd` is omitted or empty, the hook falls back to `process.cwd()` so the Cursor agent shell can still resolve the branch. The classifier still DENYs when the resolved directory has no current branch or the branch is `main`/`master`.
- Target local mode remains Auto-review. Do not switch to Run Everything.

Do not add `.cursor/cli.json`. Do not add a broad `git`, `git push`, `gh pr`, `pnpm`, or `node` prefix.

### MCP scope

Project `.cursor/mcp.json` is not used. User/plugin MCP stays user-level.

Do not commit credentials. Do not duplicate user servers into the repo.

### High-risk review pipeline

1. One writer implements.
2. `workos-product-truth-reviewer` and `workos-runtime-evidence-reviewer` when the change touches those risks.
3. `workos-red-team` after high-risk or tooling work.
4. Exact-head CI before integration, when a PR exists.
5. Owner acceptance is a separate gate.

### Unavailable / unverified

```text
AGENT_CLI                    = NOT_FOUND on this machine
BUGBOT_ON_PRS                = NOT_TESTED / not claimed active
CLOUD_AGENTS                 = DISCOVERY ONLY / no writes
PROJECTS_MIGRATION           = NO
MY_MACHINES                  = DISCOVERY ONLY / no enrollment
NESTED_AGENTS_MD             = NOT ADDED IN PHASE 1
```

Bugbot exists as a Cursor Task type. That does not mean Bugbot auto-reviews WorkOS PRs.

---

## Dacă un plugin nu răspunde

1. Reload Window.
2. Customize → verifică că e instalat și că MCP-ul e enabled.
3. Pentru Figma / Context7 / Subtext / BrowserStack: autentificare MCP (popup).
4. Pentru browse cloud: `BROWSERBASE_API_KEY`.
5. Pentru Playwright MCP: prima rulare `npx @playwright/mcp` trebuie să reușească în terminal.
