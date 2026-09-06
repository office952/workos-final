# UI20-RW1 evidence manifest

```text
WAVE                 = UI20_RW1_QUIET_TOP_SHELL
FIXTURE              = SYNTHETIC_LOCAL
REAL_DATA            = NO
FIGMA_FILE           = 0XP0yGa1siWQdTTL7ou8xz
RUNTIME              = http://127.0.0.1:5175
```

## Screenshots

| File | Viewport | Theme | Route | State | Figma ref |
| --- | --- | --- | --- | --- | --- |
| `1440-jobs-shell.png` | 1440 | light | `/jobs` | quiet top shell, Lucrări active | `224:96` |
| `1440-requests-cereri-active.png` | 1440 | light | `/requests` | Cereri L1 active | `224:96` |
| `1440-comercial-open.png` | 1440 | light | `/jobs` | Comercial L2 open | `224:115` |
| `1440-mai-multe-open.png` | 1440 | light | `/jobs` | Mai multe open | `225:66` |
| `1440-cont-open.png` | 1440 | light | `/requests` | Cont + Administrare + theme | `225:90` |
| `1440-atelier-reduced.png` | 1440 | light | `/atelier` | reduced chrome | `222:66` |
| `1280-jobs-dark.png` | 1280 | dark | `/jobs` | shell pressure + dark | `224:96` |
| `1280-admin-resources-mai-multe-open-dark.png` | 1280 | dark | `/admin/resources` | Mai multe open, Resurse active | `225:66` |
| `768-jobs-meniu.png` | 768 | light | `/jobs` | compact Meniu + Cont | `226:66` |
| `768-jobs-drawer-open.png` | 768 | light | `/jobs` | Meniu root | `226:66` |
| `768-comercial-nested.png` | 768 | light | `/jobs` | Comercial nested | `226:91` |
| `figma-224-96-candidate-a.png` | design | — | — | Candidate A | `224:96` |
| `figma-224-115-comercial.png` | design | — | — | Comercial L2 | `224:115` |
| `figma-226-66-768.png` | design | — | — | 768 shell | `226:66` |

## Intentional differences

```text
ACASA_HIDDEN_UNTIL_RW6
SEARCH_OMITTED_UNTIL_FUNCTIONAL
OBJECT_CONTEXT_ROUTE_POPULATION_DEFERRED
FULL_ADMIN_LOCAL_NAV_FLOORPLAN_DEFERRED_RW5
CAPABILITY_AWARE_VISIBILITY_DEFERRED
LEGACY_PAGE_BODIES_TEMPORARILY_RETAINED
```

## Keyboard / focus

Covered by unit tests:

- `MobileNavigationDrawer.test.tsx` — Escape, focus enter, focus return to Meniu
- `AppShell.test.tsx` — skip-link + Cont theme controls
- Desktop popovers use real buttons with `aria-expanded`
