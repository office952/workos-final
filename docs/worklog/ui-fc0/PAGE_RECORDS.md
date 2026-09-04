# UI-FC0 — page records

```text
WAVE = UI_FC0_CORRECTION
PAGE_AUDIT_ROW_COUNT = 29
HEAD = 2578b77b8aff0878bf9c4abd8a063a11c179d8cf
BASE = bb5952051abace00078a7aa1bf5930ce72cc4abe
SOURCE = apps/web/src/App.tsx + page files + docs/worklog/ui-fc0/*
AUDIT = DOCS_ONLY
UI_MUST_NOT_INVENT_RATES = YES
NO_FAKE_CAPACITY = YES
```

29 rows match `PAGE_MATRIX.md`. `/` and `/jobs` share Lucrări. `/admin/stock` and `/admin/stock/:id` are two compositions of `StockAdminPage`. `/commercial` and `*` are redirects, not rows.

Scores are heuristic from source vs page law, not measured UX. Visual claims not in source = UNKNOWN / NOT_PROVEN. Operator copy is Romanian; field names may stay English.

Figma keys: IA/HF `7elwvIscvMPDiEHrX4f6kQ`; V3 Clients/Cereri/Hub `1ev5lg7m2Ze1h3Vqmax8ho`; Arch C `Q8zfu4MZhsxLjJMGLHUHZh`.

---

## 01 Autentificare

```text
PAGE = Autentificare
ROUTE = Login (AppGate pre-shell; no Route)
SOURCE_COMPONENT = LoginPage (gates: boot | network | auth_config_missing | unauthenticated | session_expired)
PRIMARY_USER = Cont Cloud (email/parolă organizație)
SECONDARY_USER = Owner care configurează auth
WHY_PAGE_EXISTS = Intrare în planul organizației. Fără shell, fără PIN atelier.
PRIMARY_OBJECT = Sesiune Cloud
USER_ENTERS_TO = Deschide aplicația, sesiune expirată, sau auth/rețea lipsă
SUCCESS_MEANS = Cont + organizație acceptate; AppShell pornește
FIRST_3_SECONDS = Card: Autentificare / Se încarcă / Sistemul nu răspunde / Autentificare indisponibilă
PRIMARY_QUESTION = Pot intra în organizație?
PRIMARY_DECISION = Email + parolă; dacă memberships > 1, alege organizația
PRIMARY_ACTION = Intră
NEXT_EXPECTED_ACTION = Revine la returnPath (altfel / Lucrări). PIN se face separat în Atelier.
WHAT_CAN_BLOCK_USER = boot; network; auth_config_missing; credențiale; organization_selection_required; cloud_disabled
WHAT_USER_MUST_NOT_NEED_TO_KNOW = AppGate, CloudSession, hash, DTO, diferența tehnică Cloud vs local
CURRENT_FLOORPLAN = ADMIN_CONTROL gate card (fără sidebar)
CURRENT_VISUAL_SIGNATURE = login-page + login-card; ThemeSwitcher în header
RECOGNIZABLE_WITHOUT_TITLE = YES
HELPS_USER_DECIDE = YES — un card, o acțiune, mesaj de poartă explicit
EMPTY = NOT_IN_SOURCE
LOADING = gate boot: „Se încarcă” / „Pregătim accesul.”; submit „Se autentifică…”
ERROR = loginErrorLabel pe alert; network; session_expired notice
BLOCKED = auth_config_missing (nu e email/parolă); network
DISABLED = email/parolă/org + Intră când busy sau câmpuri goale
SELECTED = organizație în <select> după organization_selection_required
LONG_CONTENT = NOT_IN_SOURCE
CURRENT_FIGMA = 7elwvIscvMPDiEHrX4f6kQ p13 `67:3` idle / `67:17` error / `67:32` submit
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF presupune top-nav după login; runtime e V3 sidebar. Cardul de poartă e aproape; shell-ul de după nu.
USER_ORIENTATION_SCORE = 9
UX_FIT_SCORE = 9
VISUAL_HIERARCHY_SCORE = 8
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = —
OWNER_IMPACT = Fără login nu există operator path.
RECOMMENDED_ACTION = KEEP
```

---

## 02 Lucrări

```text
PAGE = Lucrări
ROUTE = / și /jobs
SOURCE_COMPONENT = JobsOverviewPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner
WHY_PAGE_EXISTS = Registru lucrări: stare, atenție, următorul pas. / este alias, nu Acasă.
PRIMARY_OBJECT = Lucrare comercială (job)
USER_ENTERS_TO = Vede lucrările curente; deschide una; filtrează atenție
SUCCESS_MEANS = Găsește lucrarea și urmează nextActionLabel
FIRST_3_SECONDS = Titlu Lucrări; metrici Lucrări / În execuție / Necesită atenție / Finalizate; listă sau empty
PRIMARY_QUESTION = Ce lucrare cere acțiune acum?
PRIMARY_DECISION = Filtru JOB_FILTERS + căutare vs deschide rând
PRIMARY_ACTION = Link nextActionLabel → /jobs/*
NEXT_EXPECTED_ACTION = Obiect lucrare sau catalog dacă empty
WHAT_CAN_BLOCK_USER = 403 forbidden; fetch error; filtru/căutare fără rezultate
WHAT_USER_MUST_NOT_NEED_TO_KNOW = Că / = /jobs; jobId intern; că lista folosește clasa requests-overview
CURRENT_FLOORPLAN = REGISTRY
CURRENT_VISUAL_SIGNATURE = metric-band + registry-toolbar + registry-row (aceeași familie CSS ca Cereri/Oferte)
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — metric labels differ; row chrome is shared
HELPS_USER_DECIDE = PARTIAL — next action on row; attention sort; chrome not distinct from other registries
EMPTY = „Nu există încă lucrări comerciale.” + link Catalog; filtru/căutare: „Nicio lucrare…”
LOADING = „Se încarcă lucrările…”
ERROR = „Nu s-au putut încărca lucrările.”
BLOCKED = PageStatus forbidden: „Nu ai acces la lista de lucrări.”
DISABLED = NOT_IN_SOURCE
SELECTED = chip filtru is-selected / aria-pressed
LONG_CONTENT = listă sortată atenție apoi createdAt; fără paginare în source
CURRENT_FIGMA = HF p14 `68:2` empty / `68:30` populated / `68:112` atenție
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL (Lucrări V3 not accepted)
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF top-nav; runtime V3 sidebar. / alias vs hidden Acasă. Aceeași familie visual ca Cereri/Oferte.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = S1 — / alias vs Acasă; chrome partajat
OWNER_IMPACT = Prima destinație după login (/).
RECOMMENDED_ACTION = HIGH chrome — distinge registrul Lucrări fără a schimba contractul de job
```

---

## 03 Lucrare

```text
PAGE = Lucrare
ROUTE = /jobs/*
SOURCE_COMPONENT = JobDetailPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Operator atelier (deschide execuția); Owner (cost intern)
WHY_PAGE_EXISTS = Un obiect lucrare: identitate, progres, legături, preț, blocaj execuție
PRIMARY_OBJECT = Job + order snapshot + optional execution
USER_ENTERS_TO = Continuă lucrarea, deschide execuția, sau citește configurația
SUCCESS_MEANS = Următorul pas clar: execuție, configurator, sau lucrare încheiată
FIRST_3_SECONDS = H1 inscripție; client; „Următorul pas: …”; StatusChip; CTA Deschide execuția / nextActionLabel
PRIMARY_QUESTION = Ce trebuie făcut pe această lucrare acum?
PRIMARY_DECISION = Deschide execuția vs configurator vs doar citește
PRIMARY_ACTION = openExecution sau continueConfigurator
NEXT_EXPECTED_ACTION = /execution/* sau /products/:code?order=…
WHAT_CAN_BLOCK_USER = not_found; 403; fetch error; execution.blocked / needsAttention
WHAT_USER_MUST_NOT_NEED_TO_KNOW = orderSnapshotId, truth.values keys, eicTotal, Cost intern / Adaos / Marjă ca decizie de birou
CURRENT_FLOORPLAN = OBJECT_WORKSPACE + VERTICAL_JOURNEY
CURRENT_VISUAL_SIGNATURE = request-object header + request-facts; secțiuni Configurație / Progres / Legături / Plan / Preț client
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — same object chrome as Cerere/Ofertă
HELPS_USER_DECIDE = PARTIAL — CTA + Blocaj exist; Preț client mixes owner money
EMPTY = not_found: „Lucrarea nu a fost găsită.”; „Nicio operație pornită.” / „Fără plan de execuție încă.” / preț lipsă
LOADING = „Se încarcă lucrarea…”
ERROR = „Lucrarea nu a putut fi încărcată.”
BLOCKED = forbidden; secțiune Blocaj din execution.attentionLabel / job.attentionLabel
DISABLED = NOT_IN_SOURCE (doar Link, fără buton busy)
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = stack vertical; fără clamp. Plan vs real arată Cost intern planificat/real când planView.plan.eicTotal e number
CURRENT_FIGMA = HF `68:316` recuperare / `68:353` `68:392` `68:431` blocaj
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF job blocked CTA = Deschide execuția (aligned). Runtime still paints Cost intern / Adaos / Marjă on operator page (S2 presentation; domain ALT_B_SCOPED may strip keys — NOT_PROVEN API leak).
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = S2 — bani interni pe pagina de decizie operator
OWNER_IMPACT = Operator vede marjă/adaos ca fapt obișnuit.
RECOMMENDED_ACTION = HIGH money presentation — păstrează obiectul; mută cost intern la Owner
```

---

## 04 Atelier

```text
PAGE = Atelier
ROUTE = /atelier
SOURCE_COMPONENT = AtelierPage
PRIMARY_USER = Operator de atelier (PIN)
SECONDARY_USER = Owner (citește inbox)
WHY_PAGE_EXISTS = Inbox: ce pot porni / e în lucru / e blocat. Nu e hartă fabrică, nu calculează preț.
PRIMARY_OBJECT = OperatorInboxTaskItem
USER_ENTERS_TO = Identificare PIN, apoi revendică sau continuă task
SUCCESS_MEANS = Task pornit sau Continuă → /execution/*?task=
FIRST_3_SECONDS = Dacă fără sesiune: identify form. Dacă inbox: metrici Blocate / Pot porni / În lucru / Urmează + lane-uri
PRIMARY_QUESTION = Ce pot face eu acum?
PRIMARY_DECISION = Pornește vs Deschide lucrarea vs Continuă
PRIMARY_ACTION = startExecutionTask pe availableReady
NEXT_EXPECTED_ACTION = Workspace execuție pe același task
WHAT_CAN_BLOCK_USER = no_session / expired; fetch error; TEMPORARILY_UNAVAILABLE; already_started_by_other; ineligible; missing_assignment; dependencies
WHAT_USER_MUST_NOT_NEED_TO_KNOW = utilization %, telemetry, eligibilitate ca formulă, preț, taskId intern
CURRENT_FLOORPLAN = DISPATCH (inbox lanes)
CURRENT_VISUAL_SIGNATURE = atelier-page; metric-band; atelier-lane + atelier-task-row + StatusChip
RECOGNIZABLE_WITHOUT_TITLE = YES
HELPS_USER_DECIDE = YES — lane = decizie
EMPTY = no_session EmptyState + OperatorIdentifyForm; inbox gol: „Nu ai taskuri disponibile acum.”; lane empty strings
LOADING = „Se încarcă atelierul…” (și !ready)
ERROR = „Atelierul nu a putut fi încărcat.”
BLOCKED = lane Blocate + notice-uri startNotice; unavailable notice
DISABLED = Pornește disabled când busyTaskId !== null
SELECTED = NOT_IN_SOURCE (focus task e pe /execution?task=)
LONG_CONTENT = lane-uri; waitingDependencies hidden dacă 0; fără paginare
CURRENT_FIGMA = HF p17 `71:372` neeligibil / `71:395` inbox / `71:486` sesiune; PIN `71:351` `71:361`
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF Pornește unwired în prototip; runtime Pornește e live. Shell HF top-nav vs V3 sidebar.
USER_ORIENTATION_SCORE = 9
UX_FIT_SCORE = 9
VISUAL_HIERARCHY_SCORE = 9
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 9
UX_SEVERITY = —
OWNER_IMPACT = Singurul inbox de muncă. Nu-l aplatiza în registru.
RECOMMENDED_ACTION = KEEP
```

---

## 05 Execuție

```text
PAGE = Execuție
ROUTE = /execution/*
SOURCE_COMPONENT = ExecutionWorkspacePage
PRIMARY_USER = Operator atelier (sesiune PIN)
SECONDARY_USER = Operator comercial (citește planul din lucrare)
WHY_PAGE_EXISTS = Planul de taskuri al unei lucrări: alocare, start, complete, PvA
PRIMARY_OBJECT = ExecutionPlanView
USER_ENTERS_TO = Continuă un task (din Atelier ?task=) sau citește planul (din lucrare)
SUCCESS_MEANS = Task pornit/finalizat sau blocaj onest (utilaj, dependență, eligibilitate)
FIRST_3_SECONDS = H1 inscripție; status · completed/total · Următorul: processLabel; ExecutionPlanPanel
PRIMARY_QUESTION = Care e taskul următor și de ce nu pot porni?
PRIMARY_DECISION = Alocă furnizor/executant, Pornește, Finalizează
PRIMARY_ACTION = start / complete pe taskul focusat
NEXT_EXPECTED_ACTION = Următorul task din plan sau Înapoi la Atelier / lucrare
WHAT_CAN_BLOCK_USER = plan missing; fetch error; missing_assignment; dependencies; session; already_started_by_other; wrong_executor; focusTaskId absent
WHAT_USER_MUST_NOT_NEED_TO_KNOW = planId, telemetry fabrică, rate-uri, PvA ca preț client
CURRENT_FLOORPLAN = FOCUSED_EXECUTION
CURRENT_VISUAL_SIGNATURE = execution-workspace + ExecutionPlanPanel + PlannedVersusActual
RECOGNIZABLE_WITHOUT_TITLE = YES — task list + PvA, not a registry
HELPS_USER_DECIDE = YES — next task + mutation notices
EMPTY = missing: „Planul cerut nu este disponibil.”
LOADING = „Se încarcă execuția…”
ERROR = „Execuția nu a putut fi încărcată.”; mutation → taskActionNotice
BLOCKED = notice-uri (utilaj, dependențe, eligibilitate); HF machine-blocked e modelul
DISABLED = busy pe mutații (în ExecutionPlanPanel)
SELECTED = ?task= scrollIntoView + focusTaskId
LONG_CONTENT = listă taskuri; scroll la focus; fără paginare
CURRENT_FIGMA = HF p18 `71:509` blocked / `71:793` ineligible / `71:895` startable / `71:992` progress / `71:1089` PvA
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF top-nav; runtime V3. PvA e în source (PlannedVersusActual) — conținutul numeric e din API, nu inventat în UI.
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 8
VISUAL_HIERARCHY_SCORE = 8
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = —
OWNER_IMPACT = Locul real de start/complete. Nu adăuga hartă/utilizare.
RECOMMENDED_ACTION = KEEP
```

---

## 06 Clienți

```text
PAGE = Clienți
ROUTE = /clients
SOURCE_COMPONENT = ClientsOverviewPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner
WHY_PAGE_EXISTS = Registru clienți + creare. Activitatea zilnică, nu ciclul de viață admin.
PRIMARY_OBJECT = CustomerRegistry row
USER_ENTERS_TO = Găsește clientul, filtrează atenție, sau Client nou
SUCCESS_MEANS = Deschide Hub sau client creat → /clients/:id
FIRST_3_SECONDS = Titlu + Client nou; metrici Clienți / Activi / Retrași / Necesită atenție; listă cu Cereri/Oferte/Lucrări
PRIMARY_QUESTION = Cine e clientul și ce activitate are?
PRIMARY_DECISION = Deschide rând vs Client nou vs filtru status/atenție
PRIMARY_ACTION = Navigate Hub (păstrează scroll/origin)
NEXT_EXPECTED_ACTION = Client Hub sau drawer salvat
WHAT_CAN_BLOCK_USER = 403; fetch error; create fail; filtru/căutare gol
WHAT_USER_MUST_NOT_NEED_TO_KNOW = customerId; că /admin/customers e a doua ușă; CUI ca cheie tehnică
CURRENT_FLOORPLAN = REGISTRY
CURRENT_VISUAL_SIGNATURE = clients-overview; metric-band; registry-row + registry-row-summary (3 counts)
RECOGNIZABLE_WITHOUT_TITLE = YES — counts + CUI search + Client nou
HELPS_USER_DECIDE = YES
EMPTY = „Nu există încă clienți.”; „Niciun client nu corespunde…” / „în acest filtru.”
LOADING = „Se încarcă clienții…”
ERROR = „Nu s-au putut încărca clienții.”; create notice
BLOCKED = forbidden
DISABLED = create form: Anulează/Salvează când busy; Salvează fără displayName
SELECTED = status chip + atenție is-selected
LONG_CONTENT = listă + persist scroll; fără paginare
CURRENT_FIGMA = V3 `1ev5lg7m2Ze1h3Vqmax8ho` Clients 1920/1440/1280/768 L|D; HF `70:2` `70:36`
FIGMA_STATUS = ACCEPTED_CURRENT (V3)
RUNTIME_STATUS = OWNER_ACCEPTED
FIGMA_RUNTIME_DRIFT = Low on registry. HF Comercial p15 partially superseded by this V3 file.
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 8
VISUAL_HIERARCHY_SCORE = 8
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = —
OWNER_IMPACT = Ușa zilnică de client. Nu o înlocui cu /admin/customers.
RECOMMENDED_ACTION = KEEP
```

---

## 07 Client Hub

```text
PAGE = Client Hub
ROUTE = /clients/*
SOURCE_COMPONENT = ClientWorkspacePage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner
WHY_PAGE_EXISTS = Workspace-ul unui client: date, atenție, cereri/oferte/lucrări
PRIMARY_OBJECT = Customer + workspace collections
USER_ENTERS_TO = Citește/editează date; deschide obiect comercial; Cerere nouă
SUCCESS_MEANS = Date salvate sau obiect comercial deschis
FIRST_3_SECONDS = H1 nume; identitate; rail Cereri/Oferte/Lucrări; nav local; atenție dacă există
PRIMARY_QUESTION = Ce trebuie deschis pentru acest client?
PRIMARY_DECISION = Secțiune prezentare/cereri/oferte/lucrări; editează; cerere nouă
PRIMARY_ACTION = Cerere nouă (dacă canCreateRequest) sau link atenție
NEXT_EXPECTED_ACTION = /requests?customer= sau obiect cerere/ofertă/lucrare
WHAT_CAN_BLOCK_USER = missing; 403; fetch/save error; retired (fără Cerere nouă)
WHAT_USER_MUST_NOT_NEED_TO_KNOW = section query internals; snapshot immutability jargon; customerId
CURRENT_FLOORPLAN = OBJECT_WORKSPACE
CURRENT_VISUAL_SIGNATURE = client-workspace header + client-summary-rail + client-local-nav + pane lists
RECOGNIZABLE_WITHOUT_TITLE = YES
HELPS_USER_DECIDE = YES — rail + attention row + next labels
EMPTY = „Clientul nu are încă activitate comercială.”; pane: nicio cerere/ofertă/lucrare; recent activity empty
LOADING = „Se încarcă clientul…” (inclusiv mismatch id)
ERROR = missing / forbidden / „Clientul nu a putut fi încărcat.”; save notice
BLOCKED = retired: „Retras · Istoricul rămâne vizibil.”; fără CTA cerere
DISABLED = Editează/Salvează/Anulează când busy; Salvează fără displayName
SELECTED = nav aria-current pe section
LONG_CONTENT = 4 pane-uri; drawer edit; fără paginare colecții
CURRENT_FIGMA = V3 same file Client Hub (cited ACCEPTED_CURRENT); HF `70:85` `70:133`
FIGMA_STATUS = ACCEPTED_CURRENT (V3; Hub frames need second MCP pass)
RUNTIME_STATUS = OWNER_ACCEPTED
FIGMA_RUNTIME_DRIFT = Low. Do not flatten Hub into registry dump.
USER_ORIENTATION_SCORE = 9
UX_FIT_SCORE = 9
VISUAL_HIERARCHY_SCORE = 9
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 9
UX_SEVERITY = —
OWNER_IMPACT = Cel mai puternic obiect comercial. Referință de floorplan.
RECOMMENDED_ACTION = KEEP
```

---

## 08 Cereri

```text
PAGE = Cereri de ofertă
ROUTE = /requests
SOURCE_COMPONENT = RequestsOverviewPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner
WHY_PAGE_EXISTS = Registru cereri: ce a cerut clientul, stare birou, gata de ofertă
PRIMARY_OBJECT = Request overview row
USER_ENTERS_TO = Deschide cerere, filtrează, sau Cerere nouă (optional ?customer=)
SUCCESS_MEANS = Cerere deschisă sau creată → /requests/:id
FIRST_3_SECONDS = Titlu + Cerere nouă; metrici Cereri / Atenție / Noi / Gata de ofertă; toolbar
PRIMARY_QUESTION = Care cerere e nouă, blocată sau gata de ofertă?
PRIMARY_DECISION = Deschide rând vs creează vs filtru
PRIMARY_ACTION = Link rând (păstrează origin/scroll)
NEXT_EXPECTED_ACTION = Obiect cerere
WHAT_CAN_BLOCK_USER = 403; fetch; create fail; customerLocked fără clienți (select disabled)
WHAT_USER_MUST_NOT_NEED_TO_KNOW = requestId; dublura chip+select e defect de chrome, nu regulă de domeniu
CURRENT_FLOORPLAN = REGISTRY
CURRENT_VISUAL_SIGNATURE = requests-overview; chips + <select> „Stare” duplicate; registry-row
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — same family as Lucrări/Oferte
HELPS_USER_DECIDE = PARTIAL — nextActionLabel + atenție; filtru dublu costă scan
EMPTY = „Nu există încă cereri de ofertă.”; filtru/căutare empty
LOADING = „Se încarcă cererile…”
ERROR = „Nu s-au putut încărca cererile.”
BLOCKED = forbidden
DISABLED = create: customer select dacă customerLocked; submit până title+customer
SELECTED = status chips + atenție is-selected; select Stare same value
LONG_CONTENT = listă + scroll persist; fără paginare
CURRENT_FIGMA = V3 Cereri ACCEPTED_CURRENT geometry; HF `70:180`
FIGMA_STATUS = ACCEPTED_CURRENT (V3 geometry; 2 business lines superseded)
RUNTIME_STATUS = OWNER_ACCEPTED
FIGMA_RUNTIME_DRIFT = Duplicate status control is runtime, not V3 intent.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = S1 — status chips + select duplicate
OWNER_IMPACT = Scan mai lent pe registrul zilnic.
RECOMMENDED_ACTION = HIGH filter duplicate — un singur control Stare
```

---

## 09 Cerere

```text
PAGE = Cerere
ROUTE = /requests/*
SOURCE_COMPONENT = RequestDetailPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner (preț montaj, facts write)
WHY_PAGE_EXISTS = Un obiect cerere: text client, montaj, fișiere, gata de configurare/ofertă
PRIMARY_OBJECT = Commercial request + optional installation scope
USER_ENTERS_TO = Completează lipsuri, atașează fișier, pornește catalog/ofertă
SUCCESS_MEANS = Primary action (href catalog/ofertă sau focus secțiune lipsă)
FIRST_3_SECONDS = H1 title; meta; Editează + primary CTA; dacă montaj selectat, headline readiness
PRIMARY_QUESTION = Ce lipsește ca să pot oferta?
PRIMARY_DECISION = Completează montaj/fișiere vs Configurează vs Deschide oferta
PRIMARY_ACTION = requestObjectPrimaryAction (href sau focus)
NEXT_EXPECTED_ACTION = /products?request= sau /quotes/* sau rămâne pe facts
WHAT_CAN_BLOCK_USER = missing/403/error; installation incomplete; persistedModeIncompatible; selection locked after quote; cancelled no upload; cost incomplet
WHAT_USER_MUST_NOT_NEED_TO_KNOW = SITE_INSTALLATION_SCOPE_ID, eicCompleteness, mode enums, attachment storage
CURRENT_FLOORPLAN = OBJECT_WORKSPACE + VERTICAL_JOURNEY
CURRENT_VISUAL_SIGNATURE = request-object; facts; installation block poate preceda „Ce a cerut”
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL
HELPS_USER_DECIDE = PARTIAL — CTA + Lipsesc list; stack lung; montaj concurează CTA
EMPTY = missing; „Nu există încă fișiere…”; „Nicio ofertă sau lucrare legată.”
LOADING = „Se încarcă cererea…”; upload „Se încarcă fișierul…”
ERROR = load/missing/forbidden; notice-uri service/attachment/price
BLOCKED = installationActivationBlocked (mode required); canChangeSelection false; facts locked; upload readonly dacă anulată
DISABLED = controls when busy; checkbox/mode/price/facts/upload per flags
SELECTED = installation checkbox; mode select; drawer edit
LONG_CONTENT = RequestDescription clamp + „Arată tot” / „Restrânge”; restul stack fără collapse
CURRENT_FIGMA = V3 Cereri detail ACCEPTED_CURRENT geometry; HF `70:221`
FIGMA_STATUS = ACCEPTED_CURRENT (geometry)
RUNTIME_STATUS = OWNER_ACCEPTED
FIGMA_RUNTIME_DRIFT = Runtime stack (montaj + files + related) longer than HF single-column intent. 2 business lines superseded.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = S1 — long stack; montaj competes with CTA
OWNER_IMPACT = Operator pierde next action sub montaj.
RECOMMENDED_ACTION = HIGH stack — păstrează obiectul; ridică CTA / readiness deasupra detaliului
```

---

## 10 Oferte

```text
PAGE = Oferte
ROUTE = /quotes
SOURCE_COMPONENT = QuotesOverviewPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner
WHY_PAGE_EXISTS = Registru snapshot-uri înghețate: acceptare, comandă, atenție
PRIMARY_OBJECT = Quote overview row
USER_ENTERS_TO = Găsește oferta și urmează nextActionLabel
SUCCESS_MEANS = Deschide /quotes/*
FIRST_3_SECONDS = Titlu; metrici Oferte / Atenție / Acceptate / Cu comandă; listă cu brut + OF-
PRIMARY_QUESTION = Care ofertă așteaptă acceptare sau comandă?
PRIMARY_DECISION = Deschide vs filtru vs catalog dacă empty
PRIMARY_ACTION = nextActionLabel → inspection
NEXT_EXPECTED_ACTION = Ofertă obiect
WHAT_CAN_BLOCK_USER = 403; fetch; empty catalog; filtru/căutare
WHAT_USER_MUST_NOT_NEED_TO_KNOW = quoteSnapshotId; că e aceeași familie CSS ca Cereri
CURRENT_FLOORPLAN = REGISTRY
CURRENT_VISUAL_SIGNATURE = requests-overview + commercial-gross pe rând
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — gross + OF- help; chrome shared
HELPS_USER_DECIDE = PARTIAL — next action + stage; weak vs Clients
EMPTY = „Nu există încă oferte.” + Catalog; „Nicio ofertă găsită/în acest filtru.”
LOADING = „Se încarcă ofertele…”
ERROR = „Nu s-au putut încărca ofertele.”
BLOCKED = forbidden
DISABLED = NOT_IN_SOURCE
SELECTED = filter chip is-selected
LONG_CONTENT = listă; fără paginare
CURRENT_FIGMA = HF `70:257`; no accepted Oferte V3
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF Comercial superseded in part by V3 Clients/Cereri; Oferte remains HF-only. Runtime shares Cereri/Lucrări chrome.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = S1 — same CSS family as Cereri/Lucrări
OWNER_IMPACT = Oferta e obiect de bani; registrul arată ca cerere.
RECOMMENDED_ACTION = HIGH chrome
```

---

## 11 Ofertă

```text
PAGE = Ofertă
ROUTE = /quotes/*
SOURCE_COMPONENT = QuoteInspectionPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner (vede cost intern dacă API îl trimite)
WHY_PAGE_EXISTS = Inspectează snapshot înghețat; acceptă sau creează comandă; nu recalculează
PRIMARY_OBJECT = Quote snapshot
USER_ENTERS_TO = Marchează acceptată / Creează comanda / Deschide lucrarea
SUCCESS_MEANS = Stage avansat fără recompile
FIRST_3_SECONDS = H1 inscripție; OF- · înghețată; StatusChip; CTA stage
PRIMARY_QUESTION = Accept, comandă, sau doar citesc?
PRIMARY_DECISION = acceptQuoteSnapshot vs createOrderSnapshot vs open job
PRIMARY_ACTION = buton primary sau Link lucrare
NEXT_EXPECTED_ACTION = același ecran refresh, sau /jobs/:orderSnapshotId
WHAT_CAN_BLOCK_USER = not_found; 403; fetch; actionError; busy
WHAT_USER_MUST_NOT_NEED_TO_KNOW = Cost intern / Adaos / Marjă; quoteSnapshotId; review_mismatch
CURRENT_FLOORPLAN = OBJECT_WORKSPACE
CURRENT_VISUAL_SIGNATURE = request-object; commercial-job-preview brut; request-facts inclusiv owner money
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL
HELPS_USER_DECIDE = PARTIAL — CTA + consequence text; facts mix client price with internal
EMPTY = „Oferta nu a fost găsită.”
LOADING = „Se încarcă oferta…”
ERROR = load/forbidden; Notice actionError
BLOCKED = forbidden; butoane disabled când busy
DISABLED = primary button disabled={busy}
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = NOT_IN_SOURCE (stack scurt)
CURRENT_FIGMA = HF `70:298` operator / `70:337` DARK / `93:1185` Owner
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF had separate Owner money frame. Runtime paints Cost intern/Adaos/Marjă on the same operator page (S2).
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 6
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = S2 — internal cost on operator decision page
OWNER_IMPACT = Decizia de acceptare e amestecată cu marjă.
RECOMMENDED_ACTION = HIGH money presentation
```

---

## 12 Catalog

```text
PAGE = Catalog
ROUTE = /products
SOURCE_COMPONENT = ProductCatalogPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner (inspect)
WHY_PAGE_EXISTS = Alege ProductTemplate vandabil, apoi apoi Configurează. Nu e admin PS.
PRIMARY_OBJECT = CatalogProductItem (family/category projection)
USER_ENTERS_TO = Alege produs; optional ?request= / ?product=
SUCCESS_MEANS = /products/:code (+ ?request=)
FIRST_3_SECONDS = Titlu Catalog; filtre familie; listă stânga + detail dreapta „configurabil”
PRIMARY_QUESTION = Ce produs configurez?
PRIMARY_DECISION = Familie/căutare + select row + Configurează
PRIMARY_ACTION = Link Configurează
NEXT_EXPECTED_ACTION = Configurator
WHAT_CAN_BLOCK_USER = 403; fetch; catalog gol; căutare fără hit
WHAT_USER_MUST_NOT_NEED_TO_KNOW = productCode ca identitate tehnică; familyId; că preview-ul nu e blueprint ROLE
CURRENT_FLOORPLAN = REGISTRY split (list + detail)
CURRENT_VISUAL_SIGNATURE = catalog-workspace + catalog-split; catalog-product-row; description generică
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL
HELPS_USER_DECIDE = PARTIAL — alege produs; preview nu arată FACE/VOLUME/BACK/LIGHTING
EMPTY = „Nu există încă produse în catalog.”; „Niciun produs nu corespunde căutării.”
LOADING = „Se încarcă catalogul…”
ERROR = „Nu s-a putut încărca catalogul de produse.”
BLOCKED = forbidden
DISABLED = NOT_IN_SOURCE
SELECTED = family chip + catalog-product-row is-selected (?product= or first visible)
LONG_CONTENT = groups by family; fără paginare
CURRENT_FIGMA = HF `71:2` `71:41` `71:80` `71:119`
FIGMA_STATUS = ACCEPTED_HF_NOT_V3_FINAL
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF catalog list vs runtime split preview. Preview is composition-weak (lane HIGH).
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 6
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 5
UX_SEVERITY = S1 — composition preview weak
OWNER_IMPACT = Ușa de produs arată ca listă, nu ca construcție.
RECOMMENDED_ACTION = HIGH composition preview — nu inventa produse; arată structura proiectată
```

---

## 13 Configurator

```text
PAGE = Configurator
ROUTE = /products/:productCode (?request= | ?quote= | ?order=)
SOURCE_COMPONENT = ProductConfigurationPage
PRIMARY_USER = Operator comercial
SECONDARY_USER = Owner (costuri interne în details)
WHY_PAGE_EXISTS = Configurează ProductTemplate; confirmă; freeze quote → order → release → plan. Același motor, nu calculator paralel.
PRIMARY_OBJECT = ProductTemplate + definition/confirmed spine
USER_ENTERS_TO = Completează, verifică, confirmă, îngheață ofertă, sau restore snapshot
SUCCESS_MEANS = Snapshot înghețat sau handoff execuție; unselected roles silent
FIRST_3_SECONDS = Titlu template; form sau restore quote/job; sau prequote identity dacă confirmed+installation
PRIMARY_QUESTION = E configurația validă și pot oferta?
PRIMARY_DECISION = Verifică → Confirmă → Creează oferta (customer required dacă nu e din cerere)
PRIMARY_ACTION = Verifică configurația / Confirmă / freeze
NEXT_EXPECTED_ACTION = Ofertă sau Înapoi la cerere; după order → /jobs/*
WHAT_CAN_BLOCK_USER = missing product; compile error; readiness blocked; review_mismatch; missing_customer; installation not prequote-ready; restore quote/job/request fail
WHAT_USER_MUST_NOT_NEED_TO_KNOW = compile, definition hash, EIC keys, owner-internal-costs, FormRenderer schema ids
CURRENT_FLOORPLAN = CONFIGURATOR + commercial spine; optional product-prequote
CURRENT_VISUAL_SIGNATURE = product-page configurator-workspace; FormRenderer + ConfiguratorSummary; prequote header când confirmed+scope
RECOGNIZABLE_WITHOUT_TITLE = YES as workspace; NO as ROLE blueprint (roles not a stack)
HELPS_USER_DECIDE = YES on spine; PARTIAL on construction (no FACE/VOLUME/BACK/LIGHTING map)
EMPTY = missing product/quote/job/request messages
LOADING = „Se încarcă produsul/oferta/lucrarea/cererea…”
ERROR = load fail; ReadinessNotice when definition.readiness === blocked; confirmNotice
BLOCKED = readiness blocked; installation not ready (summary warn); restore missing
DISABLED = Verifică/spine buttons disabled={busy}
SELECTED = form field values; customer select when not from request
LONG_CONTENT = form + confirmed details (owner-internal-costs, atelier-details); prequote vs layout switch
CURRENT_FIGMA = V3 prequote `176:5183` ACCEPTED_CURRENT; HF `71:158` `71:198` `71:240` `71:281`
FIGMA_STATUS = ACCEPTED_CURRENT (prequote) + ACCEPTED_HF (edit/review)
RUNTIME_STATUS = V3_BASELINE_ON_MAIN; FIRST_REAL_LETTERS_PREQUOTE historically accepted
FIGMA_RUNTIME_DRIFT = Prequote V3 vs full spine on same route. No ROLE blueprint in either. Owner costs in <details>, still in DOM.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 7
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = S1 — missing ROLE blueprint; spine keep
OWNER_IMPACT = Singurul PS-adjacent distinct. Nu-l înlocui cu catalog admin.
RECOMMENDED_ACTION = HIGH — add ROLE blueprint, keep spine
```

---

## 14 Sistem produs

```text
PAGE = Sistem produs
ROUTE = /admin/product-system
SOURCE_COMPONENT = ProductSystemAdminPage → OwnerCatalogView + buildProductSystemAdministrationCatalog
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read; OwnerWriteHint)
WHY_PAGE_EXISTS = Admin etichete afișate pe familii/categorii/template-uri/tipuri. Nu editează compoziție sau settings.
PRIMARY_OBJECT = Product System admin projection (label edit targets)
USER_ENTERS_TO = Schimbă display label; link Resurse pentru PRODUCT_TEMPLATE
SUCCESS_MEANS = Etichetă salvată; identitate tehnică neschimbată
FIRST_3_SECONDS = Același OwnerCatalogView: caută / categorii / item + detail. Lead despre etichetă.
PRIMARY_QUESTION = Unde e produsul și ce etichetă are?
PRIMARY_DECISION = Alege item vs editează label vs Resurse și costuri
PRIMARY_ACTION = DisplayLabelEditor (dacă canAdminister + editTarget)
NEXT_EXPECTED_ACTION = Rămâne pe item sau /admin/resources?product=
WHAT_CAN_BLOCK_USER = fetch error; !canAdminister (hint, no editor)
WHAT_USER_MUST_NOT_NEED_TO_KNOW = entityKind, revision, settings Edit/Save, composition, rates
CURRENT_FLOORPLAN = OWNER_CATALOG (master-detail generic)
CURRENT_VISUAL_SIGNATURE = owner-catalog nav + CatalogItemDetail — identical chrome to /components, /governance, utilaje, procese
RECOGNIZABLE_WITHOUT_TITLE = NO
HELPS_USER_DECIDE = NO — peer-category dump, not construction workspace
EMPTY = OwnerCatalogView: „Nu există încă categorii cu date reale.” / căutare / categorie goală
LOADING = „Se încarcă administrarea sistemului de produs…”
ERROR = „Nu s-a putut încărca administrarea sistemului de produs.”
BLOCKED = write gated by canAdminister (OwnerWriteHint)
DISABLED = NOT_IN_SOURCE on page (editor owns its busy)
SELECTED = category is-current + item is-current
LONG_CONTENT = search filter; no pagination
CURRENT_FIGMA = none dedicated (FIGMA_INVENTORY provisional)
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No current Figma page. Runtime is generic catalog, not VERTICAL PRODUCT BLUEPRINT.
USER_ORIENTATION_SCORE = 4
UX_FIT_SCORE = 4
VISUAL_HIERARCHY_SCORE = 3
VISUAL_INFORMATION_MODEL_SCORE = 5
PAGE_SIGNATURE_SCORE = 3
UX_SEVERITY = CRITICAL_UI_UX
OWNER_IMPACT = Owner nu vede sistemul de produs ca obiect. Cel mai slab PS admin.
RECOMMENDED_ACTION = CRITICAL — floorplan nou (blueprint / construction workspace / domain tree). Fără Edit/Save pe settings. Fără rates.
```

---

## 15 Module și componente

```text
PAGE = Module și componente
ROUTE = /components
SOURCE_COMPONENT = ComponentsPage → OwnerCatalogView + buildProductSystemAdminCatalog
PRIMARY_USER = Owner / inspect
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Inspecție ROLE→TYPE. Fără edit etichetă (asta e în /admin/product-system).
PRIMARY_OBJECT = Aceeași ProductSystemAdminProjection, alt catalog builder
USER_ENTERS_TO = Citește roluri și tipuri; nu administrează
SUCCESS_MEANS = Înțelege ce există; nu salvează
FIRST_3_SECONDS = Același OwnerCatalogView ca Sistem produs, fără acțiuni
PRIMARY_QUESTION = Ce roluri/tipuri există?
PRIMARY_DECISION = Alege categorie/item de citit
PRIMARY_ACTION = Select item (no write)
NEXT_EXPECTED_ACTION = /admin/product-system dacă vrea etichetă
WHAT_CAN_BLOCK_USER = fetch error
WHAT_USER_MUST_NOT_NEED_TO_KNOW = De ce e altă rută cu același chrome; hashes; compiler
CURRENT_FLOORPLAN = OWNER_CATALOG
CURRENT_VISUAL_SIGNATURE = identical owner-catalog; lead says inspection only
RECOGNIZABLE_WITHOUT_TITLE = NO
HELPS_USER_DECIDE = PARTIAL — better ROLE→TYPE model than #14, worst signature
EMPTY = same OwnerCatalogView empties
LOADING = „Se încarcă sistemul de produs…”
ERROR = „Nu s-a putut încărca fundația sistemului de produs.”
BLOCKED = NOT_IN_SOURCE (no write, no forbidden)
DISABLED = NOT_IN_SOURCE
SELECTED = category/item is-current
LONG_CONTENT = search; no pagination
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN; not a primary sidebar href
FIGMA_RUNTIME_DRIFT = No page. Looks like admin with buttons removed (lane).
USER_ORIENTATION_SCORE = 3
UX_FIT_SCORE = 4
VISUAL_HIERARCHY_SCORE = 2
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 2
UX_SEVERITY = CRITICAL_UI_UX
OWNER_IMPACT = Inspecția bună e invizibilă. Nu media cu #14.
RECOMMENDED_ACTION = CRITICAL — păstrează inspecția; dă-i floorplan distinct. Nu merge score cu admin.
```

---

## 16 Utilaje

```text
PAGE = Utilaje și zone
ROUTE = /admin/workcenters
SOURCE_COMPONENT = WorkcentersAdminPage → OwnerCatalogView + buildWorkcentersCatalog
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Zone + utilaje + capabilități. Utilaj obligatoriu blochează start. Fără programare/capacitate.
PRIMARY_OBJECT = WorkcentersAdminProjection
USER_ENTERS_TO = Vezi ce există și ce capabilitate lipsește de furnizor
SUCCESS_MEANS = Citește acoperirea; nu alocă aici
FIRST_3_SECONDS = OwnerCatalogView + summary counts + Notice: programarea/capacitatea nu sunt aici
PRIMARY_QUESTION = Ce utilaj/zonă acoperă capabilitatea X?
PRIMARY_DECISION = Zone vs machine în aceeași listă
PRIMARY_ACTION = Select item
NEXT_EXPECTED_ACTION = /admin/processes sau Atelier (nu din CTA dedicat)
WHAT_CAN_BLOCK_USER = fetch error
WHAT_USER_MUST_NOT_NEED_TO_KNOW = utilization, busy/idle, machine-hour rates, telemetry, calendars
CURRENT_FLOORPLAN = OWNER_CATALOG
CURRENT_VISUAL_SIGNATURE = same owner-catalog as Procese; honest notice
RECOGNIZABLE_WITHOUT_TITLE = NO
HELPS_USER_DECIDE = PARTIAL — info model honest; zone+machine mixed
EMPTY = OwnerCatalogView empties
LOADING = „Se încarcă utilajele și zonele…”
ERROR = „Nu s-au putut încărca utilajele și zonele.”
BLOCKED = NOT_IN_SOURCE (read-only; capacity explicitly not implemented)
DISABLED = NOT_IN_SOURCE
SELECTED = category/item is-current
LONG_CONTENT = search
CURRENT_FIGMA = HF reuse board `72:156` comparative only
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN (sidebar Utilaje)
FIGMA_RUNTIME_DRIFT = No machine-profile Figma. Do not invent gauges to fill the gap.
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 6
UX_SEVERITY = CRITICAL_UI_UX (identity, not data)
OWNER_IMPACT = Utilajul nu are chip de obiect. Același chrome ca Procese (info 9).
RECOMMENDED_ACTION = CRITICAL — MACHINE PROFILE / capability map / cross-link Procese. No gauges.
```

---

## 17 Procese

```text
PAGE = Procese operaționale
ROUTE = /admin/processes
SOURCE_COMPONENT = ProcessesAdminPage → OwnerCatalogView + buildProcessesCatalog
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Cum se lucrează: operație → capabilitate. Nu alocă utilaj, om, sau oră.
PRIMARY_OBJECT = OperationalProcessesAdminProjection
USER_ENTERS_TO = Înțelege cerința de capabilitate a unei operații
SUCCESS_MEANS = Citește modelul; write „nu este disponibilă în această etapă”
FIRST_3_SECONDS = Same catalog chrome; summary; notice no edit
PRIMARY_QUESTION = Ce capabilitate cere procesul?
PRIMARY_DECISION = Browse only
PRIMARY_ACTION = Select item
NEXT_EXPECTED_ACTION = Utilaje / Oameni / Skills (manual)
WHAT_CAN_BLOCK_USER = fetch error
WHAT_USER_MUST_NOT_NEED_TO_KNOW = scheduling, assignment, rates
CURRENT_FLOORPLAN = OWNER_CATALOG
CURRENT_VISUAL_SIGNATURE = identical to Utilaje
RECOGNIZABLE_WITHOUT_TITLE = NO
HELPS_USER_DECIDE = YES for reading the model; NO as distinct page
EMPTY = OwnerCatalogView empties
LOADING = „Se încarcă procesele operaționale…”
ERROR = „Nu s-au putut încărca procesele operaționale.”
BLOCKED = write not in this stage (notice only)
DISABLED = NOT_IN_SOURCE
SELECTED = category/item is-current
LONG_CONTENT = search
CURRENT_FIGMA = none dedicated; not a sidebar href
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = Strongest info model, weakest distinction from Utilaje. Do not average.
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 8
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 9
PAGE_SIGNATURE_SCORE = 6
UX_SEVERITY = S1 chrome
OWNER_IMPACT = Modelul bun e invizibil vizual.
RECOMMENDED_ACTION = HIGH chrome — keep model; stop sharing Utilaje skin as identity
```

---

## 18 Oameni

```text
PAGE = Oameni
ROUTE = /admin/people
SOURCE_COMPONENT = PeopleAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Catalog operațional: cine e, ce știe, disponibil. Nu HR/pontaj/salariu.
PRIMARY_OBJECT = Person registry row
USER_ENTERS_TO = Adaugă persoană; deschide /admin/people/:id
SUCCESS_MEANS = Persoană creată sau deschisă
FIRST_3_SECONDS = Metrici Activi/Disponibili/Retrasi; PeopleAdminNav; form Adaugă; listă registry-row
PRIMARY_QUESTION = Cine poate fi luat în calcul acum?
PRIMARY_DECISION = Deschide persoană vs adaugă
PRIMARY_ACTION = Adaugă persoană / Deschide
NEXT_EXPECTED_ACTION = Persoană obiect sau Calificări
WHAT_CAN_BLOCK_USER = fetch; !canAdminister; create fail
WHAT_USER_MUST_NOT_NEED_TO_KNOW = personId; RBAC-as-skills; payroll
CURRENT_FLOORPLAN = REGISTRY clone (requests-overview + metric-band)
CURRENT_VISUAL_SIGNATURE = people-admin requests-overview — Cereri/Clients chrome
RECOGNIZABLE_WITHOUT_TITLE = NO
HELPS_USER_DECIDE = PARTIAL — availability on row; no search/filter
EMPTY = „Nu există persoane active configurate.”
LOADING = „Se încarcă oamenii…”
ERROR = „Nu s-au putut încărca oamenii.”
BLOCKED = OwnerWriteHint; no 403 branch
DISABLED = name + Adaugă când busy/empty
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = unbounded list; no search
CURRENT_FIGMA = HF reuse board `72:156` only
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No people Figma. Runtime borrowed commercial registry.
USER_ORIENTATION_SCORE = 5
UX_FIT_SCORE = 5
VISUAL_HIERARCHY_SCORE = 4
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 4
UX_SEVERITY = CRITICAL identity
OWNER_IMPACT = Oamenii arată ca cereri. Identitate operațională slabă.
RECOMMENDED_ACTION = CRITICAL identity — nu clona Clienți
```

---

## 19 Persoană

```text
PAGE = Persoană
ROUTE = /admin/people/:id  (App.tsx: /admin/people/* after skills)
SOURCE_COMPONENT = PersonAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Un om: nume, PIN, disponibilitate, skills, retragere
PRIMARY_OBJECT = PersonRegistryItem
USER_ENTERS_TO = Setează PIN, skills, indisponibil, retrage
SUCCESS_MEANS = Eligibilitate/PIN actualizate; persoana poate intra în Atelier
FIRST_3_SECONDS = Back + PeopleAdminNav; kicker Persoană; chips status/availability; stacked client-current-card
PRIMARY_QUESTION = Poate lucra acum și cu ce calificări?
PRIMARY_DECISION = PIN vs disponibilitate vs skill vs retrage
PRIMARY_ACTION = context-dependent (Setează PIN / Marchează indisponibil / Adaugă skill)
NEXT_EXPECTED_ACTION = Atelier identify sau înapoi la listă
WHAT_CAN_BLOCK_USER = missing; fetch; !canAdminister; retired; has_active_task on retire; PIN validation
WHAT_USER_MUST_NOT_NEED_TO_KNOW = PIN value after save; skill codes except in details; HR leave
CURRENT_FLOORPLAN = OBJECT clone (Client Hub card stack)
CURRENT_VISUAL_SIGNATURE = client-workspace-header + client-current-card stack
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — kicker Persoană; cards look like Hub
HELPS_USER_DECIDE = YES inside cards; weak as distinct object
EMPTY = missing; „Nicio calificare curentă.”
LOADING = „Se încarcă omul…”
ERROR = load/missing; pinOrPeopleError notices
BLOCKED = retired: no PIN/availability write; OwnerWriteHint
DISABLED = inputs/buttons when busy or !canAdminister; PIN submit < 4 digits
SELECTED = skill <select>
LONG_CONTENT = 4 cards stacked; no collapse
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No person Figma. Chrome copied from Client Hub.
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 5
UX_SEVERITY = S1
OWNER_IMPACT = Modelul e onest; pagina arată a client.
RECOMMENDED_ACTION = HIGH — object identity for person, keep PIN/skills law
```

---

## 20 Calificări

```text
PAGE = Calificări
ROUTE = /admin/people/skills
SOURCE_COMPONENT = SkillsAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read eligibility)
WHY_PAGE_EXISTS = Skill-uri operaționale (cod stabil, etichetă schimbabilă). Preview eligibilitate. Nu RBAC.
PRIMARY_OBJECT = Skill + eligibility preview
USER_ENTERS_TO = Adaugă/retrage skill; întreabă cine e eligibil pentru o capabilitate
SUCCESS_MEANS = Skill în catalog; preview citit (nu alocă task)
FIRST_3_SECONDS = PeopleAdminNav; form Cod/Etichetă; listă; card Eligibilitate curentă
PRIMARY_QUESTION = Ce calificare există și cine e eligibil pentru capabilitatea X?
PRIMARY_DECISION = Creează/retrage vs Arată eligibilii
PRIMARY_ACTION = Adaugă calificare / Retrage / Arată eligibilii
NEXT_EXPECTED_ACTION = Persoană pentru assign skill
WHAT_CAN_BLOCK_USER = fetch; !canAdminister; create/retire fail
WHAT_USER_MUST_NOT_NEED_TO_KNOW = productionCapabilityClasses ids as app permissions
CURRENT_FLOORPLAN = ADMIN_CONTROL
CURRENT_VISUAL_SIGNATURE = people-admin list + client-current-card preview; StatusChip
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL
HELPS_USER_DECIDE = YES for eligibility preview
EMPTY = „Nu există calificări.”; preview „Nicio persoană eligibilă acum.”
LOADING = „Se încarcă calificările…”
ERROR = „Calificările nu au putut fi încărcate.”
BLOCKED = OwnerWriteHint; retired skill has no retrage
DISABLED = create fields/button busy/empty; retrage busy
SELECTED = capability <select> (default CNC_ROUTING)
LONG_CONTENT = skill list + details summary for code
CURRENT_FIGMA = none dedicated; not sidebar href
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No skills Figma. Preview is honest (lane).
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 5
UX_SEVERITY = S1
OWNER_IMPACT = Eligibilitatea e corectă; pagina e form dump.
RECOMMENDED_ACTION = HIGH — keep preview; clarify vs People list
```

---

## 21 Resurse și costuri

```text
PAGE = Resurse și costuri
ROUTE = /admin/resources
SOURCE_COMPONENT = ResourcesAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read; writeState may lock)
WHY_PAGE_EXISTS = Resurse + tarife interne + rețete. Cost intern, nu preț client. Soldul e la Stoc.
PRIMARY_OBJECT = Cost row / resource / recipe (tabs)
USER_ENTERS_TO = Confirmă tarif, filtrează pe produs, deschide drawer
SUCCESS_MEANS = Tarif salvat pentru calcule noi; snapshot-uri vechi neschimbate
FIRST_3_SECONDS = Breadcrumb Admin; tabs Costuri interne / Resurse / Rețete; table sau list; drawer pe ?selected=
PRIMARY_QUESTION = Ce tarif e neconfirmat sau lipsește pentru produsul X?
PRIMARY_DECISION = Tab + filtru produs/tip/stare + deschide rând
PRIMARY_ACTION = Adaugă tarif / click row → drawer editor
NEXT_EXPECTED_ACTION = Drawer save sau /admin/stock/:id
WHAT_CAN_BLOCK_USER = fetch; !canAdminister; writeState !== READY; filters empty
WHAT_USER_MUST_NOT_NEED_TO_KNOW = costRowId, qualifier internals, Arch C vs V3 vs HF archetypes
CURRENT_FLOORPLAN = CONFIGURATION_WORKSPACE (tabs + table + drawer)
CURRENT_VISUAL_SIGNATURE = resources-workspace; resources-rate-table; ActionDrawer
RECOGNIZABLE_WITHOUT_TITLE = YES as workspace; PARTIAL vs other admin
HELPS_USER_DECIDE = PARTIAL — table scannable; detail collapsed into drawer (S1)
EMPTY = „Niciun tarif/resursă/rețetă nu corespunde filtrelor.” (filter empty, not catalog-empty)
LOADING = „Se încarcă catalogul de resurse…”
ERROR = „Nu s-a putut încărca…” + Reîncearcă
BLOCKED = Owner hint; „Editarea nu este disponibilă în această etapă.”
DISABLED = Adaugă tarif only if view=costuri && writable
SELECTED = ?selected= / ?resursa= aria-current; tabs aria-current
LONG_CONTENT = filters + table; no pagination
CURRENT_FIGMA = HF `72:2/24/44/65/92`; V3 RESOURCES_AND_COSTS_V3_FLAT on Clients file; Arch C Wave 1 ?selected=
FIGMA_STATUS = THREE_ARCHETYPES — living runtime = flat workspace; V3-final Owner accept not closed
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = HF category→item vs Arch C selected vs V3 flat. Runtime = flat + drawer, not persistent master-detail.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 6
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = S1 — master-detail collapsed into drawers
OWNER_IMPACT = Tariful e critic; detaliul dispare în overlay.
RECOMMENDED_ACTION = HIGH master-detail — keep one rate owner; pick one living Figma
```

---

## 22 Stoc

```text
PAGE = Stoc
ROUTE = /admin/stock
SOURCE_COMPONENT = StockAdminPage → StockOverviewPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Sold curent pe materiale urmărite. Nu catalog resurse, nu rezervare, nu achiziție, nu preț.
PRIMARY_OBJECT = InventoryStockProjection item
USER_ENTERS_TO = Vezi sold/negativ; deschide material
SUCCESS_MEANS = /admin/stock/:id
FIRST_3_SECONDS = Metrici Materiale / Sold negativ; notice graniță; listă registry-row
PRIMARY_QUESTION = Ce e negativ sau fără mișcări?
PRIMARY_DECISION = Deschide material
PRIMARY_ACTION = Link /admin/stock/:resourceId
NEXT_EXPECTED_ACTION = Material obiect
WHAT_CAN_BLOCK_USER = fetch error
WHAT_USER_MUST_NOT_NEED_TO_KNOW = resourceId; rates; reservations
CURRENT_FLOORPLAN = REGISTRY light
CURRENT_VISUAL_SIGNATURE = requests-overview rows; 2 metrics; no search/filter
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL
HELPS_USER_DECIDE = PARTIAL — negative metric; no search at scale (S1)
EMPTY = NOT_IN_SOURCE — dacă items=[], <ul> gol, fără EmptyState
LOADING = „Se încarcă stocul…”
ERROR = „Nu s-a putut încărca stocul.”
BLOCKED = NOT_IN_SOURCE
DISABLED = NOT_IN_SOURCE
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = unbounded list; no search
CURRENT_FIGMA = HF reuse board `72:156` only
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No stock Figma. Runtime list has no empty/search.
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 6
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 6
UX_SEVERITY = S1 — no search/filter; empty not implemented
OWNER_IMPACT = La scară, soldul nu se găsește.
RECOMMENDED_ACTION = HIGH search — keep inventory law; add findability, not purchasing
```

---

## 23 Material

```text
PAGE = Material
ROUTE = /admin/stock/:id
SOURCE_COMPONENT = StockAdminPage → StockItemPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Un material: sold + mișcări + ajustare Owner. Identitatea rămâne la Resurse.
PRIMARY_OBJECT = InventoryItemDetail
USER_ENTERS_TO = Ajustează sold; citește mișcări; sare la resursă
SUCCESS_MEANS = Ajustare înregistrată sau context resursă deschis
FIRST_3_SECONDS = Back; H1 label; StatusChip (NEGATIV/IN_STOCK/ZERO/NO_MOVEMENTS); sold facts
PRIMARY_QUESTION = Care e soldul și de ce s-a schimbat?
PRIMARY_DECISION = Ajustează vs doar citește vs Vezi resursa
PRIMARY_ACTION = Ajustare stoc / Înregistrează stoc inițial
NEXT_EXPECTED_ACTION = /admin/resources
WHAT_CAN_BLOCK_USER = item not tracked (error); !canAdminister; invalid quantity
WHAT_USER_MUST_NOT_NEED_TO_KNOW = valuation, reservation, purchase
CURRENT_FLOORPLAN = OBJECT_WORKSPACE
CURRENT_VISUAL_SIGNATURE = request-object + client-object-header + request-facts
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — same object chrome as cerere
HELPS_USER_DECIDE = YES for adjust vs read
EMPTY = „Nu există mișcări de stoc pentru acest material.”
LOADING = „Se încarcă materialul…”
ERROR = „Materialul nu este urmărit în stoc.”
BLOCKED = OwnerWriteHint; form hidden if !canAdminister
DISABLED = qty/note/submit busy or qty empty
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = movement list unbounded
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No item Figma. Object chrome reused from commercial.
USER_ORIENTATION_SCORE = 7
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 7
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = —
OWNER_IMPACT = Ajustarea e clară. Păstrează granița Resurse/Stoc.
RECOMMENDED_ACTION = KEEP
```

---

## 24 Date firmă

```text
PAGE = Date firmă
ROUTE = /admin/seller
SOURCE_COMPONENT = SellerAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read-only fields)
WHY_PAGE_EXISTS = Identitate vânzător pe oferte noi. Nu clienți, nu Settings general.
PRIMARY_OBJECT = SellerProfile
USER_ENTERS_TO = Salvează prima identitate sau actualizează
SUCCESS_MEANS = legalName salvat; oferte noi deblocate
FIRST_3_SECONDS = Form legal fields; lead dacă lipsește: ofertele noi rămân blocate
PRIMARY_QUESTION = Avem identitate de vânzător pentru oferta următoare?
PRIMARY_DECISION = Salvează vs doar citește
PRIMARY_ACTION = Salvează datele firmei
NEXT_EXPECTED_ACTION = Oferte / configurator freeze
WHAT_CAN_BLOCK_USER = fetch; !canAdminister; legalName empty; save fail
WHAT_USER_MUST_NOT_NEED_TO_KNOW = seller versioning internals; client catalog
CURRENT_FLOORPLAN = ADMIN_CONTROL
CURRENT_VISUAL_SIGNATURE = seller-form Field stack
RECOGNIZABLE_WITHOUT_TITLE = YES — legal form, not a list
HELPS_USER_DECIDE = YES — blocked-quotes copy when seller null
EMPTY = seller null: copy + empty draft (not EmptyState)
LOADING = „Se încarcă datele firmei…”
ERROR = „Nu s-au putut încărca datele firmei.”; save notice
BLOCKED = quotes new blocked until first save (copy); OwnerWriteHint
DISABLED = all inputs if busy || !canAdminister; submit if !legalName
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = NOT_IN_SOURCE
CURRENT_FIGMA = HF reuse board `72:156`
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE (reuse only)
RUNTIME_STATUS = V3_BASELINE_ON_MAIN (sidebar Firmă)
FIGMA_RUNTIME_DRIFT = No dedicated seller frame. Form is sufficient.
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 8
VISUAL_HIERARCHY_SCORE = 7
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = —
OWNER_IMPACT = Gate real pe oferte noi.
RECOMMENDED_ACTION = KEEP
```

---

## 25 Servicii operaționale

```text
PAGE = Servicii operaționale
ROUTE = /admin/operational-services
SOURCE_COMPONENT = OperationalServicesAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Ce poate oferi org pe cerere: montaj INTERNAL/SUBCONTRACTED/BOTH/DISABLED. Nu preț.
PRIMARY_OBJECT = SITE_INSTALLATION capability offerMode
USER_ENTERS_TO = Configurează/dezactivează selecții noi
SUCCESS_MEANS = offerMode salvat; cereri vechi nerescrise
FIRST_3_SECONDS = Breadcrumb Admin; StatusChip Neconfigurat/Intern/…; un <select>
PRIMARY_QUESTION = Oferim montaj și pe ce cale?
PRIMARY_DECISION = Mode + Salvează
PRIMARY_ACTION = Salvează configurația serviciului
NEXT_EXPECTED_ACTION = Cerere (selecție) / Resources (cost) — not linked as CTA
WHAT_CAN_BLOCK_USER = fetch; !canAdminister; draftMode empty; reserved capabilities
WHAT_USER_MUST_NOT_NEED_TO_KNOW = capabilityId, version as product truth, transport nested under montaj
CURRENT_FLOORPLAN = ADMIN_CONTROL
CURRENT_VISUAL_SIGNATURE = seller-form + admin-breadcrumb; not OwnerCatalogView / Admin L2 table
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL
HELPS_USER_DECIDE = YES for mode; weak in Admin L2 family
EMPTY = if no installation capability, form omitted (no EmptyState)
LOADING = „Se încarcă serviciile operaționale…”
ERROR = „Serviciile operaționale nu au putut fi încărcate.”
BLOCKED = Neconfigurat/Dezactivat = selecții noi oprite; reserved rows
DISABLED = select/submit if busy || !canAdminister; submit until valid mode
SELECTED = draftMode <select>
LONG_CONTENT = NOT_IN_SOURCE
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No Figma. Breaks Admin L2 consistency (S1).
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 7
VISUAL_HIERARCHY_SCORE = 6
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 6
UX_SEVERITY = S1 — off Admin L2 pattern
OWNER_IMPACT = Un control critic arată improvizat.
RECOMMENDED_ACTION = HIGH Admin L2 — keep offer-mode law; align chrome
```

---

## 26 Administrare

```text
PAGE = Administrare
ROUTE = /admin
SOURCE_COMPONENT = AdminHomePage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (browse)
WHY_PAGE_EXISTS = Hub domenii reale (ADMIN_GROUPS). Fără pagini-promisiune.
PRIMARY_OBJECT = Admin destination card
USER_ENTERS_TO = Alege domeniul (Firmă, Clienți admin, Oameni, …)
SUCCESS_MEANS = Navigate to a real admin route
FIRST_3_SECONDS = Grupuri Comercial / Operațiuni / Atelier / Sistem; carduri catalog-family
PRIMARY_QUESTION = Unde administrez X?
PRIMARY_DECISION = Click card
PRIMARY_ACTION = Link item.to
NEXT_EXPECTED_ACTION = Pagina de domeniu
WHAT_CAN_BLOCK_USER = NOT_IN_SOURCE (static)
WHAT_USER_MUST_NOT_NEED_TO_KNOW = ADMIN_L2_WAVE1_SECTION_IDS; că /admin nu e sidebar href
CURRENT_FLOORPLAN = REGISTRY cards
CURRENT_VISUAL_SIGNATURE = admin-groups + catalog-family cards
RECOGNIZABLE_WITHOUT_TITLE = YES as hub
HELPS_USER_DECIDE = YES — group + description
EMPTY = NOT_IN_SOURCE (groups hardcoded)
LOADING = NOT_IN_SOURCE
ERROR = NOT_IN_SOURCE
BLOCKED = NOT_IN_SOURCE
DISABLED = NOT_IN_SOURCE
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = NOT_IN_SOURCE
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN; not sidebar href
FIGMA_RUNTIME_DRIFT = No admin hub Figma. Runtime is honest (no empty-future cards).
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 8
VISUAL_HIERARCHY_SCORE = 7
VISUAL_INFORMATION_MODEL_SCORE = 7
PAGE_SIGNATURE_SCORE = 7
UX_SEVERITY = —
OWNER_IMPACT = Index util. Nu-l transforma în Settings dump.
RECOMMENDED_ACTION = KEEP
```

---

## 27 Clienți admin

```text
PAGE = Clienți admin
ROUTE = /admin/customers
SOURCE_COMPONENT = CustomerAdminPage
PRIMARY_USER = Owner
SECONDARY_USER = Operator (page has no canAdminister gate in source)
WHY_PAGE_EXISTS = Lifecycle: adaugă, redenumește, retrage. Lucrul zilnic e /clients.
PRIMARY_OBJECT = Customer (ACTIVE/RETIRED lists)
USER_ENTERS_TO = Retrage/redenumește; sau Adaugă (paralel cu Client nou)
SUCCESS_MEANS = Status lifecycle changed; sau Deschide workspace
FIRST_3_SECONDS = Same title „Clienți”; link către registru; form Nume; liste Activi/Retrasi
PRIMARY_QUESTION = Retrag sau redenumesc — sau sunt pe ușa greșită?
PRIMARY_DECISION = Workspace vs Editează nume vs Retrage vs Adaugă
PRIMARY_ACTION = Retrage clientul / Salvează nume
NEXT_EXPECTED_ACTION = /clients/:id
WHAT_CAN_BLOCK_USER = fetch; action fail
WHAT_USER_MUST_NOT_NEED_TO_KNOW = A second customer authority (domain has one; UX has two doors)
CURRENT_FLOORPLAN = ADMIN_CONTROL
CURRENT_VISUAL_SIGNATURE = people-create + people-list (People chrome), title „Clienți”
RECOGNIZABLE_WITHOUT_TITLE = NO — title collision with /clients
HELPS_USER_DECIDE = NO — two mental models for one object
EMPTY = „Nu există clienți activi.”; „Niciun client retras.”
LOADING = „Se încarcă clienții…”
ERROR = „Nu s-au putut încărca clienții.”
BLOCKED = NOT_IN_SOURCE (no Owner gate; no 403)
DISABLED = inputs/buttons when busy
SELECTED = editingId inline rename
LONG_CONTENT = two lists; no search
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN; not sidebar href
FIGMA_RUNTIME_DRIFT = No Figma. Dual door vs /clients (S2).
USER_ORIENTATION_SCORE = 4
UX_FIT_SCORE = 4
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 5
PAGE_SIGNATURE_SCORE = 5
UX_SEVERITY = S2 — dual client door
OWNER_IMPACT = Create path divergence risk; not a second domain owner.
RECOMMENDED_ACTION = HIGH dual door — keep lifecycle Owner-only; do not compete with /clients create
```

---

## 28 Guvernanță

```text
PAGE = Guvernanța sistemului
ROUTE = /governance
SOURCE_COMPONENT = GovernancePage → OwnerCatalogView + buildGovernanceCatalog
PRIMARY_USER = Owner
SECONDARY_USER = Operator (read)
WHY_PAGE_EXISTS = Proiectează limitele de autoritate din domeniu. Nu le rescrie.
PRIMARY_OBJECT = GovernanceProjection catalog items
USER_ENTERS_TO = Citește cine decide ce; fără write
SUCCESS_MEANS = Regulă găsită și înțeleasă
FIRST_3_SECONDS = OwnerCatalogView (same chrome as PS/Utilaje) with governance items
PRIMARY_QUESTION = Cine are autoritate pe X?
PRIMARY_DECISION = Browse category/item
PRIMARY_ACTION = Select item
NEXT_EXPECTED_ACTION = Stay / System status
WHAT_CAN_BLOCK_USER = fetch error
WHAT_USER_MUST_NOT_NEED_TO_KNOW = raw codes, hashes, compiler vocabulary
CURRENT_FLOORPLAN = MASTER_DETAIL (owner-catalog)
CURRENT_VISUAL_SIGNATURE = owner-catalog; content is rules, not machines
RECOGNIZABLE_WITHOUT_TITLE = PARTIAL — chrome shared; content distinct if item open
HELPS_USER_DECIDE = YES once item selected
EMPTY = OwnerCatalogView empties
LOADING = „Se încarcă guvernanța…”
ERROR = „Nu s-a putut încărca guvernanța sistemului.”
BLOCKED = NOT_IN_SOURCE (read-only)
DISABLED = NOT_IN_SOURCE
SELECTED = category/item is-current
LONG_CONTENT = search
CURRENT_FIGMA = none dedicated
FIGMA_STATUS = NO_DEDICATED_ACCEPTED_PAGE
RUNTIME_STATUS = V3_BASELINE_ON_MAIN
FIGMA_RUNTIME_DRIFT = No governance Figma. Floorplan works; signature borrowed.
USER_ORIENTATION_SCORE = 8
UX_FIT_SCORE = 8
VISUAL_HIERARCHY_SCORE = 7
VISUAL_INFORMATION_MODEL_SCORE = 8
PAGE_SIGNATURE_SCORE = 8
UX_SEVERITY = —
OWNER_IMPACT = Catalog de limite. Nu-l transforma în Settings write.
RECOMMENDED_ACTION = KEEP
```

---

## 29 Stare sistem

```text
PAGE = Stare sistem
ROUTE = /system
SOURCE_COMPONENT = SystemStatusPage + HealthStatus
PRIMARY_USER = Owner / operator tehnic
SECONDARY_USER = Operator (rare)
WHY_PAGE_EXISTS = Probe de conexiune backend. Nu e business, nu e guvernanță.
PRIMARY_OBJECT = HealthState (loading | connected | unavailable)
USER_ENTERS_TO = Verifică dacă sistemul răspunde
SUCCESS_MEANS = „Backend conectat”
FIRST_3_SECONDS = PageHeader „Stare sistem” + un singur rând de status
PRIMARY_QUESTION = Merge backend-ul?
PRIMARY_DECISION = Nicio decizie de business
PRIMARY_ACTION = None (auto fetchHealth)
NEXT_EXPECTED_ACTION = Leave; login network gate e alt ecran
WHAT_CAN_BLOCK_USER = unavailable probe
WHAT_USER_MUST_NOT_NEED_TO_KNOW = probe URLs, hashes, service names
CURRENT_FLOORPLAN = ADMIN_CONTROL
CURRENT_VISUAL_SIGNATURE = header + one status line (status-loading / status-ok / status-bad)
RECOGNIZABLE_WITHOUT_TITLE = NO
HELPS_USER_DECIDE = PARTIAL — binary connect only
EMPTY = NOT_IN_SOURCE
LOADING = HealthStatus: „Se verifică conexiunea cu backend-ul…”
ERROR = „Backend indisponibil” (unavailable, not PageStatus error)
BLOCKED = NOT_IN_SOURCE
DISABLED = NOT_IN_SOURCE
SELECTED = NOT_IN_SOURCE
LONG_CONTENT = NOT_IN_SOURCE
CURRENT_FIGMA = HF p13 SYSTEM behavior `67:160` (structural, not a V3 page)
FIGMA_STATUS = HF_STRUCTURAL_ONLY
RUNTIME_STATUS = V3_BASELINE_ON_MAIN; matched under Guvernanță nav, not primary href
FIGMA_RUNTIME_DRIFT = IA/HF SYSTEM note vs one-line runtime. No dedicated accepted page.
USER_ORIENTATION_SCORE = 6
UX_FIT_SCORE = 6
VISUAL_HIERARCHY_SCORE = 5
VISUAL_INFORMATION_MODEL_SCORE = 6
PAGE_SIGNATURE_SCORE = 5
UX_SEVERITY = —
OWNER_IMPACT = Diagnostic, nu produs.
RECOMMENDED_ACTION = LOW
```

---

## Count check

```text
PAGE_AUDIT_ROW_COUNT = 29
ROWS_01_29 = Login, Lucrări, Lucrare, Atelier, Execuție, Clienți, Client Hub, Cereri, Cerere, Oferte, Ofertă, Catalog, Configurator, Sistem produs, Module, Utilaje, Procese, Oameni, Persoană, Calificări, Resurse, Stoc, Material, Date firmă, Servicii operaționale, Administrare, Clienți admin, Guvernanță, Stare sistem
NOT_ROWS = /commercial redirect, * redirect
```
