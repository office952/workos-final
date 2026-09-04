# WorkOS V1 — Resources cost admin UX amend

```text
PROGRAM = RESOURCES_COST_ADMIN_UX_AMEND
PAGE = /admin/resources
BRANCH = feat/product-batch-1-reuse-first-v1
PR = #7
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
UX_SEVERITY = UX-S1
OLD_ARCHETYPE = CATALOG_MASTER_DETAIL
NEW_ARCHETYPE = ADMIN_WORKSPACE + REGISTRY
OWNER_FEEDBACK = MENU_AFTER_MENU_NOT_CLEAR
OWNER_ACCEPTED_RUNTIME = NO
MERGE_MAIN = NO
UI_GENERAL_REDESIGN = CLOSED_FOR_V1
DOMAIN_WRITE = NO
API_WRITE = NO
DATABASE_WRITE = NO
REAL_CLOUD_WRITE = NO
```

Owner accepted qualified cost-evidence logic and LETTERS depth rates. Runtime rejected the `/admin/resources` interaction: category → item → detail → action.

This amend removes MasterSelector as the primary model on this page only. The page now has one local task switch:

- Costuri interne — flat searchable rate registry, default
- Resurse — inventory
- Rețete — service and labor recipes, including missing recipes

Primary action: Adaugă tarif. Row click opens the current tariff. Qualifier metadata still comes from the generic projection.

Figma family: `RESOURCES_AND_COSTS_V3_FLAT_OWNER_WORKSPACE` in live file `1ev5lg7m2Ze1h3Vqmax8ho`.
- family `203:1733`
- 1440 light `203:1734`
- 768 light `204:7806`
No library publish.

Next step: Independent ChatGPT + Owner runtime review. Do not merge.
