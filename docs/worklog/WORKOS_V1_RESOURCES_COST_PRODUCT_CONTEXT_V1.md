# WorkOS V1 — Resources & costs ProductTemplate context

```text
PROGRAM = RESOURCES_COST_PRODUCT_CONTEXT
PAGE = /admin/resources
BRANCH = feat/product-batch-1-reuse-first-v1
PR = #7
STATUS = IMPLEMENTED_LOCAL_IN_REVIEW
PRODUCT_TEMPLATE = CONTEXT_FILTER
RESOURCE_COST_OWNERSHIP = REMAINS_RESOURCES_AND_COST
DEFAULT = ALL_PRODUCTS
OWNER_ACCEPTED_RUNTIME = NO
MERGE_MAIN = NO
UI_GENERAL_REDESIGN = CLOSED_FOR_V1
DOMAIN_WRITE = GENERIC_READ_PROJECTION
API_WRITE = EXISTING_RESOURCES_PROJECTION_EXTENDED
DATABASE_WRITE = NO
REAL_CLOUD_WRITE = NO
FIGMA_WRITE = NO
```

The flat Resources & Costs workspace stayed. Owner asked for product context before merge: filter Costuri interne / Resurse / Rețete by the current Product System ProductTemplate, without moving rates into Product System and without `productCode` on CostEvidence.

Usage is a generic read projection: ProductTemplate → component types → live resources → process composition / where-used → recipes → shared CostEvidence. Shared resources keep one rate. Unused catalog rows remain under Toate produsele. `/admin/resources?product=<templateCode>` preselects the template. Product System template inspection has a quiet Resurse și costuri link.

Compact counts (resources / confirmed tariffs / needs setup) come from that projection. EIC is omitted; it is configuration-specific, not a template-level fact.

Next step: Independent ChatGPT + Owner runtime review. Do not merge.
