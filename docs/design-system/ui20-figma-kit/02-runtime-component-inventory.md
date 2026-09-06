# 02 — Runtime component inventory

Current source wins. Names come from `apps/web/src`, not worklogs.

Appearing twice is not enough. Meaning must match.

## Shell / navigation / identity / theme

| FILE | COMPONENT | SEMANTIC PURPOSE TODAY | ROUTES USED | REUSABILITY | UI20 STATUS |
|---|---|---|---|---|---|
| `ui/GlobalShellTop.tsx` | `GlobalShellTop` | Quiet top chrome: brand, L1, Meniu, utilities | All authed routes via `AppShell` | HIGH | RUNTIME_EXISTING / CANDIDATE_KIT_PRIMITIVE |
| `ui/GlobalNavigation.tsx` | `GlobalNavigation` | L1 + Comercial/Mai multe popovers; Escape restores trigger | All office routes; reduced on operator | HIGH | RUNTIME_EXISTING / CANDIDATE_KIT_PRIMITIVE |
| `ui/MobileNavigationDrawer.tsx` | `MobileNavigationDrawer` | 768 Meniu + nested Comercial/Mai multe | ≤768 via `AppShell` | HIGH | RUNTIME_EXISTING / CANDIDATE_KIT_PRIMITIVE |
| `ui/ObjectContextStrip.tsx` | `ObjectContextStrip` | Formats explicit object type/id/name/return/parent; returns null if empty | Mounted in `AppShell` with **no props** | HIGH primitive / LOW populated | RUNTIME_EXISTING + RUNTIME_NEEDS_CALIBRATION (population = RW2+) |
| `ui/IdentityMenu.tsx` | `IdentityMenu` | Cont: org name, switch, theme, Administrare, logout | All authed | HIGH | RUNTIME_EXISTING / CANDIDATE_KIT_PRIMITIVE |
| `theme/ThemeSwitcher.tsx` | `ThemeSwitcher` | System / light / dark; 44px | Identity menu + login | HIGH | RUNTIME_EXISTING |
| `theme/ThemeProvider.tsx` | `ThemeProvider` | Resolves theme onto `data-theme` | App root | HIGH | RUNTIME_EXISTING |
| `icons/WorkosBrandMark.tsx` | `WorkosBrandMark` | Mark SVG (sidebar leftover) | Historical sidebar | LOW | LEGACY_TRANSITIONAL |
| `AppShell.tsx` | skip-link + `is-ui20-top` + reduced chrome | Landmarks, skip, operator chip | All authed | HIGH shell | RUNTIME_EXISTING |
| `ui/StableSidebar.tsx` | `StableSidebar` | Historical V3 rail | Not used by current `AppShell` | — | DEPRECATED_LATER |
| `ui/NavigationGroup.tsx` | `NavigationGroup` | Sidebar category group | Sidebar path | — | DEPRECATED_LATER |
| `ui/NavigationPageLink.tsx` | `NavigationPageLink` | Sidebar page link | Sidebar path | — | DEPRECATED_LATER |

## Controls / feedback / forms

| FILE | COMPONENT | SEMANTIC PURPOSE TODAY | ROUTES USED | REUSABILITY | UI20 STATUS |
|---|---|---|---|---|---|
| `index.css` `button` | default primary | Legacy blue fill via `--accent` | Global | HIGH visually / WRONG semantic for UI20 identity | RUNTIME_NEEDS_CALIBRATION / KEEP_LEGACY_ONLY |
| `index.css` `.button-secondary` | secondary | Raised, accent text | Many | HIGH | RUNTIME_NEEDS_CALIBRATION |
| `index.css` `.button-quiet` | quiet / selected filter | Transparent; `.is-selected` | Registries, pages | HIGH | RUNTIME_EXISTING |
| `index.css` `.button-danger` | destructive | Transparent + danger color | Sparse | HIGH | RUNTIME_EXISTING |
| `index.css` `.button-link` | primary navigation CTA | Link styled as primary | Registries, jobs | HIGH | RUNTIME_NEEDS_CALIBRATION |
| `ui/Field.tsx` | `Field` | Label + hint + error + control slot | Forms, registries, admin | HIGH | RUNTIME_EXISTING / CANDIDATE_KIT_PRIMITIVE |
| `FormRenderer.tsx` | `FormRenderer` | Schema-driven product fields | `/products/:code` | MEDIUM (product only) | RUNTIME_NEEDS_CALIBRATION — native select hidden; visible chips `aria-hidden` but focusable |
| `index.css` `.choice-chip` | choice chips | Visual select companion | FormRenderer | MEDIUM | RUNTIME_NEEDS_CALIBRATION |
| `RegistrySearchField.tsx` | `RegistrySearchField` | **Local registry** filter, not global search | Clients, requests, owner catalog | MEDIUM | PAGE_SPECIFIC — do not promote as Global Search |
| `ui/Notice.tsx` | `Notice` | Blocked / ok / compact messages | Requests, config, many | HIGH | RUNTIME_EXISTING; partial AttentionEdge |
| `ui/StatusChip.tsx` | `StatusChip` | Sparse status wash | Jobs, execution, people | MEDIUM | RUNTIME_NEEDS_CALIBRATION |
| `StatePill.tsx` | `StatePill` | Governance implemented/planned/missing | `/governance` | LOW | PAGE_SPECIFIC |
| `ui/EmptyState.tsx` | `EmptyState` | Dashed empty | Many | HIGH | RUNTIME_EXISTING |
| `ui/PageHeader.tsx` | `PageHeader` | Title + lead + actions | Many office/admin | HIGH | RUNTIME_EXISTING |
| `ui/PageStatus.tsx` | `PageStatus` | Loading / error / retry | Many | HIGH | RUNTIME_EXISTING |
| `ui/ActionDrawer.tsx` | `ActionDrawer` | Right drawer + scrim + focus | Identify, client edit, request create | HIGH | RUNTIME_EXISTING / CANDIDATE_KIT_PRIMITIVE |
| `ui/MasterSelector.tsx` | `MasterSelector` | Admin master list | Admin master-detail | MEDIUM | PAGE_SPECIFIC |
| `ui/CatalogItemDetail.tsx` | `CatalogItemDetail` | Catalog detail pane | Catalog/admin | LOW | PAGE_SPECIFIC |
| `ui/MetricCard.tsx` | `MetricCard` | Compact count tile | Clients, requests, atelier | LOW as universal dashboard | PAGE_SPECIFIC / NOT_GENERALIZABLE as kit card |

## Page bodies (not kit)

These own personality. Kit may supply primitives; not a Universal Page.

| FILE | ROUTE FAMILY | NOTE |
|---|---|---|
| `RequestDetailPage.tsx` | `/requests/:id` | V3 object + facts + related list; **not** Resolution Field |
| `RequestsOverviewPage.tsx` | `/requests` | Registry rows + local search |
| `ProductConfigurationPage.tsx` + `ProductConfigurationViews.tsx` | `/products/:code` | Form + summary rail; **not** Composition + Lens |
| `QuotesOverviewPage.tsx` / `QuoteInspectionPage.tsx` | `/quotes` | Frozen snapshot registry / inspection |
| `JobsOverviewPage.tsx` / `JobDetailPage.tsx` | `/` `/jobs` `/jobs/:id` | Job list / traveler-not-yet |
| `AtelierPage.tsx` | `/atelier` | Operator inbox lanes |
| `ExecutionWorkspacePage.tsx` / `ExecutionPlanPanel.tsx` | `/execution/:planId` | Workstation-not-yet; task rows |
| `ClientsOverviewPage.tsx` / `ClientWorkspacePage.tsx` | `/clients` | Relationship workspace (HF lot closer than others) |
| `ResourcesAdminPage.tsx` | `/admin/resources` | Rate ledger rows |
| `AdminHomePage.tsx` + admin `*-AdminPage.tsx` | `/admin/*` | Quiet control + local nav |
| `LoginPage.tsx` | unauthenticated | Gate / login card |

## Control existence (do not invent variants)

| Control | Runtime? | Notes |
|---|---|---|
| Button primary/secondary/quiet/danger | YES | CSS classes, not a React `Button` |
| Link as button | YES | `.button-link` |
| Text input / textarea / number | YES | `Field` + native |
| Native select | YES | Also visually hidden in FormRenderer |
| Checkbox | YES | `.field-choice` + FormRenderer boolean |
| Radio | NO dedicated primitive | Do not invent a Radio kit unless a real field type appears |
| Search field | Local registry only | Global Search **not rendered** |
| Toggle | Theme choice is 3 buttons, not a switch | Do not invent Toggle |
| Icon button | Informal (Meniu, clear search, chevrons) | No shared IconButton |
| Dialog | `operator-modal` CSS exists; identify uses drawer | Sparse |
| Drawer | `ActionDrawer` + mobile nav drawer | YES |
| Popover | Comercial / Mai multe / Cont panels | YES — nav-specific |
| Tabs | `.page-object-tabs`, Client local nav underline | Page-local, not a shared Tabs kit |

## Counts (inventory rows above)

```text
SHELL_NAV_IDENTITY     = 12
CONTROLS_FEEDBACK      = 19
PAGE_BODIES_LISTED     = 11 families
```
