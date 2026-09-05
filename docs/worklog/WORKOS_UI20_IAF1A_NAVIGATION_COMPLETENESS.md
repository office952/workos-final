# WorkOS UI/UX 2.0 — IAF1A Navigation Completeness

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_IAF1A_NAVIGATION_COMPLETENESS
STATUS = IN_REVIEW
PARENT = UI20_IAF1
IAF1_VERDICT = DIRECTION_ACCEPTED_PENDING_NAV_COMPLETENESS → IAF1A
CANDIDATE_A_PRIMARY = YES
CANDIDATE_B = OPERATOR_CHROME_REDUCTION_ONLY
GLOBAL_L1_SIDEBAR = NO
FINAL_IA = NOT_OWNER_ACCEPTED
FINAL_VISUAL_DIRECTION = NOT_OWNER_ACCEPTED
UI20_IMPLEMENTATION = NOT_AUTHORIZED
REACT = HOLD
PR_CREATE = NO
NEXT_STEP = CHATGPT_FINAL_UI20_IA_OWNER_GATE_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
DIRECTION_CONFLICT = NO
```

## ChatGPT IAF1 live verdict (input)

```text
IAF1_DIRECTION_ACCEPTED
FINAL_IA_HOLD_FOR_ONE_TARGETED_NAV_COMPLETENESS_FIX
Winner = CANDIDATE_A quiet top + object continuity
B = operator chrome reduction only
Global L1 sidebar = REJECTED AS DEFAULT
Issue = destination completeness / discoverability for Clienți, Resurse, Oameni
```

## Identity

```text
REPO = office952/workos-final
BRANCH = design/ui20-iaf1-quiet-global-shell
ORIGIN_MAIN = 3730f798b2b42e4ec828a106b06dd763cbbf55a2
HEAD_BEFORE = 800b07ed80c1df683b367cea1832d523dab6cd20
PARENT = 1ab3abbfc08a053a8359012688c44dd7af5fc0f1
SOURCE_SIG1B = 1ab3abbfc08a053a8359012688c44dd7af5fc0f1
FIGMA = 0XP0yGa1siWQdTTL7ou8xz page 80
```

IAF1 evidence preserved. No Candidate C. No Candidate A redesign.

## Route / canon check

Foundation map places `/clients` in Comercial domain. Cereri (`/requests`) remains high-frequency L1 per accepted IAF1 — **not** duplicated in Comercial L2.

```text
COMERCIAL L2 = Clienți · Oferte · Catalog
CERERI_DUPLICATED_IN_L2 = NO
```

## Final Candidate A grammar

```text
GLOBAL L1 = Acasă · Cereri · Comercial · Lucrări · Atelier
COMMERCIAL L2 = Clienți · Oferte · Catalog
SECONDARY = ONE “Mai multe ▾” · Resurse · Oameni (+ optionals when enabled)
OBJECT CONTEXT = compact semantic strip
LOCAL SIDEBAR = Admin collections + true master-detail ONLY
ADMIN = Cont / Organizație → local Admin navigator
MASTER-DETAIL = Clienți list | Client Hub
OPERATOR = reduced chrome (from B)
SEARCH = supplemental ⌕ · never sole path
ACCOUNT/ORG = Cont ▾ top-right
BACK/RETURN = browser back + explicit ↩
768 = ☰ panel · nested L2/secondary · 44px · no sidebar shrink
```

## Paths proven

| Path | Evidence |
| --- | --- |
| Comercial → Clienți → Registry → Hub | `224:115` `225:121` `225:145` |
| Mai multe → Resurse / Oameni | `225:66` |
| Cont → Administrare → local nav | `225:90` |
| 768 Client | `226:66` |
| 768 Resources | `226:91` |
| 768 Admin | `226:114` |

## Key nodes

```text
IAF1A_SECTION = 224:66
FINAL_IA_GRAMMAR = 224:69
NORMAL_GLOBAL = 224:96
COMERCIAL_L2 = 224:115
SECONDARY_OPEN = 225:66
ACCOUNT_ADMIN = 225:90
CLIENT_REGISTRY = 225:121
CLIENT_HUB = 225:145
768_CLIENT = 226:66
768_RESOURCES = 226:91
768_ADMIN = 226:114
FINAL_NAV_BOARD = 226:138
```

## Quality gates (agent claim; ChatGPT Owner gate decides)

```text
CLIENTS_REACHABLE_WITHOUT_SEARCH = YES
CLIENT_HUB_REACHABLE_WITHOUT_SEARCH = YES
RESOURCES_REACHABLE_WITHOUT_SEARCH = YES
PEOPLE_REACHABLE_WITHOUT_SEARCH = YES
ADMIN_REACHABLE_WITHOUT_SEARCH = YES
SECONDARY_DESTINATION_MECHANISM_COUNT = 1
SEARCH_ONLY_DEPENDENCY = NO
GLOBAL_NAV_DUPLICATION = NO
CERERI_DUPLICATED_IN_L2 = NO
```

## STOP

Nav completeness + board + 768 + roadmap hygiene + worklog + commit/push. No merge, no FINAL_IA Owner accept, no React.
