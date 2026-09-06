# 06 — Figma ↔ React mapping

Main deliverable. STATUS values are the only allowed set from the GO.

| FIGMA_NAME | SEMANTIC_ROLE | FIGMA_SOURCE_NODE | CURRENT_REACT | TARGET_REACT | CURRENT_CSS_TOKEN | TARGET_TOKEN_CANDIDATE | ROUTES | RESPONSIVE | A11Y | STATUS |
|---|---|---|---|---|---|---|---|---|---|---|
| GlobalShellTop | Quiet top shell | `224:96` | `GlobalShellTop` | same | `--surface`, `--line`, `--ui20-shell-height` | `surface.shell` + `line.hairline` | all authed | 768: nav → Meniu | skip-link, 44px, brand name `WorkOS` | RUNTIME_EXISTING |
| GlobalNavigation | L1 destinations | `224:96` | `GlobalNavigation` | same | `--ui20-shell-accent` current | `color.semantic.identity` | office | 768 TRANSFORM drawer | Escape restores trigger | RUNTIME_EXISTING |
| Comercial panel | L2 commercial door | `224:115` | `GlobalNavigation` popover | same | `--surface`, inset accent | `surface.raised` | /clients /quotes /products | 768 nested Meniu | region label Comercial | RUNTIME_EXISTING |
| Mai multe panel | Secondary destinations | `225:66` | `GlobalNavigation` + groups | same | group label muted | `type.label` | /admin/resources people stock machines | HIDE empty groups | no Coming Soon | RUNTIME_EXISTING |
| Cont / IdentityMenu | Account + Admin entry | `225:90` | `IdentityMenu` | same | `--surface-elevated` | `surface.raised` | /admin via Cont | WRAP legal name | 44px; no 59px clamp | RUNTIME_EXISTING |
| MobileNavigation | 768 Meniu | IAF1A mobile (see RW1) | `MobileNavigationDrawer` | same | drawer + overlay | `surface.raised` + `overlay` | all | BECOME_DRAWER | nested focus, Escape | RUNTIME_EXISTING |
| Operator reduced chrome | Workshop attention | `222:66` | `AppShell` `is-reduced-chrome` | same | hides L1 except Atelier | — | /atelier /execution/* | UNCHANGED meaning | operator chip named | RUNTIME_EXISTING |
| ObjectContextStrip | Object continuity | objStrip on VIS1A frames | `ObjectContextStrip` empty mount | populate per page wave | `.object-context-*`, Mono id | `type.object-id` | object routes | WRAP | landmark Context obiect | RUNTIME_NEEDS_CALIBRATION |
| WorkOS wordmark | Identity | `224:99` | brand link text `WorkOS` | same | font 1rem/650 | `type.wordmark` | all | UNCHANGED | accessible name exact `WorkOS` | RUNTIME_EXISTING |
| Search | Global find | `224:107` ⌕ | **not rendered** | none until functional | — | — | — | — | dead control forbidden | DEPRECATED_LATER in Figma chrome / NOT_GENERALIZABLE |
| Acasă L1 | Work radar entry | `224:100` | hidden (`home` href null) | RW6 | — | — | no /home | — | no dead L1 | PAGE_SPECIFIC / UI20_NEW later |
| Resolution Field | Known vs Unresolved | `239:69` `241:161` | `RequestDetailPage` facts/list | page-specific layout | `.request-object` | `density.medium` + planes | /requests/:id | STACK keep semantics | headings per plane | UI20_NEW / PAGE_SPECIFIC |
| AttentionEdge | Local consequence | `239:100` / client inset | CSS `is-attention` / Notice | shared primitive later | `--status-warning` | `color.semantic.consequence` + `line.attention` | cerere, clients | COMPRESS | text required | RUNTIME_NEEDS_CALIBRATION |
| Construction Composition | Role graph | `234:103` `240:66` `241:66` | `FormRenderer` sections | page-specific composition | `.form-section` `.configurator-*` | not LETTERS tiles | /products/:code | composition stays composition | no focusable aria-hidden | UI20_NEW / PAGE_SPECIFIC |
| Context Lens | Selected-part facts | `234:138` `240:101` | `ConfiguratorSummary` | page-specific lens | `.configurator-summary` | — | /products/:code | COMPRESS not inspector dump | visible fields | UI20_NEW / PAGE_SPECIFIC |
| ConstructionRelation | Relation line | rel1/rel2/rel3 in `234:103` | none | page-specific | none | `line.relation` | config | COMPRESS | decorative + labels | UI20_NEW / PAGE_SPECIFIC |
| Commercial Sheet | Frozen offer artifact | `235:66` | `QuoteInspectionPage` | page-specific sheet | commercial-* | `type.artifact` Source Serif later | /quotes/:id | COMPRESS | frozen ≠ readonly | PAGE_SPECIFIC / UI20_NEW |
| Production Traveler | Past/current/next | `240:115` | `JobDetailPage` | page-specific | decision-* leftovers | `density.medium-high` | /jobs/:id | WRAP | current ≠ selected | PAGE_SPECIFIC |
| Dispatch Floor | High-density inbox | `240:198` | `AtelierPage` | page-specific | `.atelier-task-row` | `density.high` | /atelier | HIGH scan | 44px actions | PAGE_SPECIFIC |
| Workstation | Focused station | VIS1 exec / `241:202` | `ExecutionWorkspacePage` | page-specific | `.execution-lane` `.task-row` | `density.focused` | /execution/:planId | FOCUSED | reduced chrome | PAGE_SPECIFIC |
| Relationship Workspace | Client chronology | `240:160` | `ClientWorkspacePage` | same family | `.client-workspace` | `density.medium` | /clients/:id | WRAP collections | local nav current | RUNTIME_NEEDS_CALIBRATION |
| Evidence Ledger | Rate/work rows | VIS1 resources | `ResourcesAdminPage` | page-specific | `.resources-rate-row` | `density.high` | /admin/resources | TRANSFORM stacked | 44px rows | PAGE_SPECIFIC |
| Quiet Control | Admin local nav | `225:90` + VIS1 admin | `AdminHomePage` + admin floorplan | same | `.admin-sidebar` | `density.medium-high` | /admin/* | 768 BECOME_DRAWER triggers | local current | RUNTIME_EXISTING |
| Button / Action | Next valid act | 44px CTA in VIS1A | CSS `button` / `.button-*` | SemanticButton later | `--accent` blue | `color.semantic.action` later | global | 44px min | visible focus | RUNTIME_NEEDS_CALIBRATION |
| Field / Input | Operator input | DL1 action 14 | `Field` | same | `--border`, 44px | `space.control` | forms | STACK | label+error | RUNTIME_EXISTING |
| Choice chips | Visible select | — | FormRenderer chips | fix a11y | `.choice-chip` | — | config | WRAP | **gap**: aria-hidden + focusable | RUNTIME_NEEDS_CALIBRATION |
| StatusChip | Sparse status | DNA state energy | `StatusChip` | calibrate | `--status-*` | do not invent rainbow | many | UNCHANGED | not color-only | RUNTIME_NEEDS_CALIBRATION |
| Notice | Blocked/ok message | StateCause | `Notice` | keep | `.notice-blocked` | — | many | WRAP | heading + list | RUNTIME_EXISTING |
| EmptyState | Honest empty | — | `EmptyState` | keep | dashed border | `line.dashed` | many | UNCHANGED | — | RUNTIME_EXISTING |
| ActionDrawer | Short action layer | — | `ActionDrawer` | keep | overlay + elevated | `surface.raised` | identify, edits | BECOME full-height | trap + restore | RUNTIME_EXISTING |
| LedgerRow | Scan row | Atelier/Resources | several CSS rows | optional later share | row borders | `density.high` | atelier, resources, jobs | TRANSFORM | 44px | NOT_GENERALIZABLE until meaning matches |
| MetricCard | Count tile | rejected by DL1 | `MetricCard` | do not kit | `.metric-card` | — | clients, requests, atelier | 768 2-col | — | NOT_GENERALIZABLE |
| StableSidebar | Historical L1 | Control `242:946` preview | `StableSidebar` unused | delete later | `--sidebar-*` | — | none in AppShell | — | — | DEPRECATED_LATER / LEGACY_TRANSITIONAL |
| LETTERS role tiles | Product anatomy | `234:121`–`234:132` | none as kit | **never generic** | — | — | config specimen only | — | — | NOT_GENERALIZABLE |

## Classification counts (this matrix)

```text
RUNTIME_EXISTING              = 12
RUNTIME_NEEDS_CALIBRATION     = 7
UI20_NEW                      = 6
PAGE_SPECIFIC                 = 8
LEGACY_TRANSITIONAL           = 1 (with StableSidebar also DEPRECATED_LATER)
DEPRECATED_LATER              = 2
NOT_GENERALIZABLE             = 4
```

Counts overlap when a row carries two statuses (e.g. StableSidebar). Use the worklog roll-up, not a fake unique total.
