# UI20-RW1 / RW1A evidence manifest

```text
WAVE                 = UI20_RW1_QUIET_TOP_SHELL + UI20_RW1A
FIXTURE              = SYNTHETIC_LOCAL
REAL_DATA            = NO
FIGMA_FILE           = 0XP0yGa1siWQdTTL7ou8xz
RUNTIME              = http://127.0.0.1:5195
SHELL_ACCENT         = --ui20-shell-accent (#1f332e light / #8fb5a4 dark)
GLOBAL_ACTION_PRIMARY = UNCHANGED (#1e4d73)
```

## Screenshots

| File | Viewport | Theme | Route | State | Figma ref |
| --- | --- | --- | --- | --- | --- |
| `1440-jobs-shell.png` | 1440 | light | `/jobs` | quiet top shell, Lucrări active, deep-green underline | `224:96` |
| `1440-requests-cereri-active.png` | 1440 | light | `/requests` | Cereri L1 active | `224:96` |
| `1440-comercial-open.png` | 1440 | light | `/jobs` | Comercial L2 open | `224:115` |
| `1440-mai-multe-open.png` | 1440 | light | `/jobs` | Mai multe open | `225:66` |
| `1440-cont-open.png` | 1440 | light | `/requests` | Cont + Administrare + theme | `225:90` |
| `1440-atelier-reduced.png` | 1440 | light | `/atelier` | reduced chrome | `222:66` |
| `1280-jobs-dark.png` | 1280 | dark | `/jobs` | shell pressure + dark accent | `224:96` |
| `1280-admin-resources-mai-multe-open-dark.png` | 1280 | dark | `/admin/resources` | Mai multe open, Resurse active | `225:66` |
| `768-jobs-meniu.png` | 768 | light | `/jobs` | compact Meniu + Cont | `226:66` |
| `768-jobs-drawer-open.png` | 768 | light | `/jobs` | Meniu root | `226:66` |
| `768-comercial-nested.png` | 768 | light | `/clients` | Comercial nested, Clienți current | `226:91` |
| `768-resources-nested.png` | 768 | light | `/admin/resources` | Mai multe nested, Resurse current | `226:91` |
| `768-admin-cont.png` | 768 | light | `/admin` | Cont → Administrare path | `226:114` |
| `figma-224-96-candidate-a.png` | design | — | — | Candidate A | `224:96` |
| `figma-224-115-comercial.png` | design | — | — | Comercial L2 | `224:115` |
| `figma-226-66-768.png` | design | — | — | 768 shell | `226:66` |

## Keyboard / focus

Covered by unit tests:

- `GlobalNavigation.test.tsx` — Escape restores Comercial / Mai multe triggers
- `MobileNavigationDrawer.test.tsx` — nested Comercial / Mai multe / root focus + Escape restore
- `AppShell.test.tsx` — brand accessible name `WorkOS`

## Intentional differences

```text
ACASA_HIDDEN_UNTIL_RW6
SEARCH_OMITTED_UNTIL_FUNCTIONAL
OBJECT_CONTEXT_ROUTE_POPULATION_DEFERRED
FULL_ADMIN_LOCAL_NAV_FLOORPLAN_DEFERRED_RW5
CAPABILITY_AWARE_VISIBILITY_DEFERRED
LEGACY_PAGE_BODIES_TEMPORARILY_RETAINED
```
