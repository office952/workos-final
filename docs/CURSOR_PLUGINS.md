# Cursor plugins — ghid de utilizare pentru WorkOS Final

Acest fișier este **tooling Cursor**, nu canon de produs.
Adevărul de business rămâne în `docs/architecture/` și `AGENTS.md`.
Pluginurile ajută agentul să planifice, să verifice, să citească documentație și să studieze UI.
Nu înlocuiesc Owner GO, one-truth, E2E-first sau `docs/architecture/UI_UX_FOUNDATION_CANON.md`.

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

### Figma — autentificat

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

MCP-ul e deja activ. Cont BrowserStack e necesar pentru device-e reale, Percy, Test Management.

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

MCP-ul e configurat în `~/.cursor/mcp.json`.

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

### Playwright MCP — adăugat în `~/.cursor/mcp.json`

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
| `C:\Users\offic\.cursor\plugins\local\` | Pluginuri încărcate local |
| `C:\Users\offic\.cursor\plugins\cache\cursor-public\` | Copii marketplace descărcate |
| `C:\Users\offic\.cursor\mcp.json` | MCP user: Figma, shadcn, Subtext, 21st, Playwright |
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
5. Fără DB de business, auth, Commercial, Analyzer runtime, sau al doilea produs de catalog, fără Owner GO.
6. Nu instala pluginul **WorkOS** de la workos.com în acest workspace.

---

## Dacă un plugin nu răspunde

1. Reload Window.
2. Customize → verifică că e instalat și că MCP-ul e enabled.
3. Pentru Figma / Context7 / Subtext / BrowserStack: autentificare MCP (popup).
4. Pentru browse cloud: `BROWSERBASE_API_KEY`.
5. Pentru Playwright MCP: prima rulare `npx @playwright/mcp` trebuie să reușească în terminal.
