# UI-FC0 — Product System direction studies

Conceptual information-architecture studies for Product System. Not implementation. Not React. Not CSS. Not a Figma GO.

```text
LANE                              = A_PRODUCT + B_USER
DOCUMENT_KIND                     = CONCEPTUAL_IA_STUDY
STUDIED_COUNT                     = 3
IMPLEMENTATION                    = NO
UI_MUST_NOT_INVENT_RATES          = YES
FAKE_EDIT_SAVE                    = NO
DISPLAY_LABEL_WRITE_ONLY          = YES
TECHNICAL_SETTINGS                = READ_ONLY
UNSELECTED_MODULE                 = SILENT
RESOURCE_OWNS_RATE                = YES
CLASS                             = FIGMA_CANDIDATE
HEAD                              = bb5952051abace00078a7aa1bf5930ce72cc4abe
SOURCE_PAGES                      = /admin/product-system · /components · /products/:productCode
SOURCE_FILES                      = ProductSystemAdminPage.tsx · ComponentsPage.tsx · ProductConfigurationPage.tsx · OwnerCatalogView.tsx
CANONS                            = PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON · PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON
UI_UX_CANON_READ                  = YES
ROADMAP_READ                      = YES
DIRECTION_CONFLICT                = NO
THEME_IMPACT                      = NONE
NEW_HARDCODED_CSS                 = NO
BACKEND_DETAILS_EXPOSED           = NO
CURRENT DELIVERY STATE            = READ ACTIVE ROADMAP
NEXT_PROGRAM_PRIORITY             = WORKOS_UI_UX_FINAL_CLOSURE_V1
UI_FC0                            = LOCAL_IN_REVIEW
UI_GENERAL_REDESIGN               = CLOSED_FOR_V1
```

`DIRECTION_CONFLICT = NO`: this file studies three later Product System floorplans. It does not reopen the accepted V3 sidebar, does not authorize scoped UI implementation, and does not rewrite canons.

```text
ROADMAP_READ
UI_UX_CANON_READ
DIRECTION_CONFLICT
```

---

## Why this study exists

Current Product System admin and inspection share `OwnerCatalogView`. That chrome is a peer-category dump:

```text
Familii | Categorii | Produse | Tipuri | Setări | Compoziții | Stare și lifecycle
```

The same product appears three times (Produse, Compoziții, Lifecycle). Settings appear as a sibling catalog. Roles are a list item, not a construction. The commercial configurator (`/products/:productCode`) is the only Product System–adjacent surface with a distinct workspace, and it is a commercial spine, not administration.

`PAGE_PRODUCT_SYSTEM.md` already scored this CRITICAL and required three distinct floorplans. This file is that study.

Surfaces in scope:

| Route | Job today | Write allowed |
| --- | --- | --- |
| `/admin/product-system` | Owner administers display labels; inspects composition and readiness | display-label only |
| `/components` | Owner/technician inspects ROLE → TYPE → settings → process contract | none |
| `/products/:productCode` | Operator configures an order on a live ProductTemplate | order configuration + commercial spine |

`/products` commercial catalog is adjacent, not the subject. Catalog organization (family / recursive category) is not product technical truth.

---

## Law that every candidate must preserve

From `PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md` and `PRODUCT_SYSTEM_TECHNICAL_SETTINGS_CANON.md`:

```text
COMPONENT ROLE
  → CONSTRUCTIVE TYPE
  → PRODUCT / ORDER CONFIGURATION
  → MATERIAL / RESOURCE REFERENCE
  → TECHNICAL SETTINGS
  → CALCULATION
```

| Fact | Owner | UI may |
| --- | --- | --- |
| Role (FACE / VOLUME / BACK / LIGHTING) | Product System | show as function; never as a material |
| Constructive type | Component type | inspect; display-label write in admin only |
| Product composition | ProductTemplate | inspect; never edit composition in this slice |
| Order configuration | Intake / ProductDefinition | expose only `CONFIGURABLE_BY_ORDER` |
| Technical settings (`ledPitchMm`, `ledModulePowerW`, `psuReservePercent`) | typed canonical settings on the type | project read-only; no Edit/Save |
| Resource identity | configuration resolves to a resource | show identity / gap; never the rate |
| Internal rate / purchase cost | Resources / Cost | link out; never own |
| Commercial price | Commercial | not a Product System admin fact |
| How work is performed | Operational Processes | show the type's process-requirement contract; do not administer processes here |
| Unselected role / module | composition | silent — no empty form, no ghost calculator |

UI must not invent: composition editors, settings Edit/Save, a parallel Product entity, Analyzer geometry, hardcoded product fields, SKUs, rates, or a second calculator.

Live construction anchors used in the wireframes below (runtime, not invention):

- LETTERS front-lit: FACE `PLEXIGLAS_FACE` · VOLUME `ALUMINIUM_VOLUME` · BACK `FOREX_BACK` · LIGHTING `LIGHTING_FRONT_LED`
- ACM cassette: FACE `ACM_CASSETTE_BODY` · BACK `STEEL_INTERNAL_FRAME` · no VOLUME · no LIGHTING
- Halo-lit and full-aluminium categories stay empty until Owner construction truth exists

---

## How the three candidates differ

These are different nouns and different reading orders. They are not three skins of `OwnerCatalogView`.

| | A Vertical Product Blueprint | B Product Construction Master-Detail | C Domain Map Tree |
| --- | --- | --- | --- |
| Primary noun | the built product as a stack of roles | one ProductTemplate as an object | a node in the ownership graph |
| First question | how is this product constructed? | which product am I inspecting? | what exists, and who owns it? |
| Navigation | layers of one construction | list of products → inspector | hierarchical domain tree |
| Where family/category live | caption under the product | facts on the object, not nav | the tree itself |
| Where settings live | on the selected lighting layer | a read-only band of the inspector | a child of the type node only |
| Configurator relation | same stack becomes the order form | commercial door; inspector stays admin | leaf action from a template node |
| Risk | treating ACM like a letter | becoming Client Hub with extra facts | becoming a generic SaaS folder tree |

Rejected as a third candidate: restyling the current seven peer categories, or using the configurator's commercial stage door as an admin IA. That door is a commercial job.

---

## A. VERTICAL PRODUCT BLUEPRINT

### NAME

Vertical Product Blueprint

The product is read as a standing construction. FACE sits above VOLUME, VOLUME above BACK, LIGHTING is the inner service of the body. The operator sees a letter or a cassette the way the workshop sees it: layers, not registry rows.

### PRIMARY_USER

Owner / product technician who must understand composition before they sell or change a label. Secondary: the same person opening the commercial configurator, because the stack is reused as the order form.

### PRIMARY_OBJECT

One ProductTemplate's construction stack. The object is the built product, not the family and not the constructive type.

### FIRST_3_SECONDS

1. Which product is standing here (LETTERS front-lit or ACM cassette).
2. Which roles are present as real layers, and which are absent (silent — not “empty”).
3. Which layer is focused, and whether that layer is ready or blocked.

### LAYOUT_MODEL

A vertical construction column plus a focused-layer panel. Not list/detail of peer entity kinds.

```text
┌─────────────────────────────────────────────────────────────────┐
│  Litere luminoase față  ·  LETTERS  ·  Față plexi / cant Al     │
│  [Etichetă afișată]                         [Deschide catalog]  │
├──────────────────────────┬──────────────────────────────────────┤
│  CONSTRUCȚIE             │  STRAT SELECTAT — Față               │
│                          │                                      │
│  ┌────────────────────┐  │  Tip: Plexiglas față                 │
│  │ FAȚĂ          ●    │  │  Configurație produs: 3 mm, opal     │
│  │ Plexiglas 3 mm     │◄─┤  Pe comandă: (nimic — FIXED)         │
│  └────────────────────┘  │                                      │
│  ┌────────────────────┐  │  Resursă: Plexiglas 3 mm opal        │
│  │ VOLUM         ●    │  │  Tarif: la Resurse și costuri  →     │
│  │ Aluminiu 0.6 mm    │  │  Pregătire cost: completă | lipsă    │
│  └────────────────────┘  │                                      │
│  ┌────────────────────┐  │  Procese ale tipului:                │
│  │ SPATE         ●    │  │  · Debitare CNC tablă                │
│  │ Forex 10 mm        │  │  (procesul nu alege utilajul)        │
│  └────────────────────┘  │                                      │
│  ┌────────────────────┐  │  Setări tehnice: nu pe acest tip     │
│  │ ILUMINARE     ●    │  │                                      │
│  │ LED față           │  │                                      │
│  └────────────────────┘  │                                      │
│                          │                                      │
│  ACM would omit VOLUM    │                                      │
│  and ILUMINARE entirely  │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

ACM cassette, same IA, different stack:

```text
  ┌────────────────────┐
  │ FAȚĂ   casetă ACM  │
  └────────────────────┘
  ┌────────────────────┐
  │ SPATE  cadru oțel  │
  └────────────────────┘
  (no VOLUME row, no LIGHTING row)
```

### PERSISTENT_REGION

Product identity header: display label, family/category as caption (not as a second menu), construction facts already on the template. The stack itself stays visible while a layer is focused.

### SELECTABLE_REGION

The role layers that exist on this ProductTemplate. Selecting a layer focuses it. Roles that the template does not select are not drawn. Halo-lit / full-aluminium empty categories do not mint ghost layers.

### DETAIL_REGION

The focused layer: constructive type, product-fixed vs order-configurable attributes, resource identity, cost-readiness mark, type process-requirement contract, technical settings if that type owns them.

### PRIMARY_ACTION

On `/admin/product-system`: edit the display label of the product (or of the focused type if the focus is a type label). One write. No Save of construction.

On `/components`: no write. Primary action is “citește stratul”.

On `/products/:productCode`: the stack is the form. Primary action remains Verifică configurația / Confirmă — commercial, not admin.

### HOW_COMPONENTS_ARE_READ

A component is a layer. Role answers function. Type answers how that function is built. FACE is never “the Plexiglas page.” Plexiglas and ACM cassette body can both occupy FACE on different products; they never appear as competing rows on the same stack.

`/components` without a product uses a **role rack**: four role slots as empty frames. Opening a role lists the live types that can occupy it. That is inspection of the type catalog, still role-first, not a family dump.

### HOW_CONFIGURATION_IS_READ

On the focused layer, attributes are grouped by ownership:

- `FIXED_BY_PRODUCT` — shown as locked fact (3 mm opal on LETTERS face). Hidden from Intake.
- `CONFIGURABLE_BY_ORDER` — shown as “pe comandă” (depth / finish on aluminium volume; cassette width / height / depth / folds).
- `MATERIAL_IDENTITY` — inherent (opal), not a finish field.
- `MEASUREMENT` — Product Truth; operator confirms in the configurator, not here.
- `TECHNICAL_SETTING` — never Intake; see settings band.

The configurator reuses the stack: only selected layers grow fields. Unselected modules stay silent — no disabled VOLUME block on ACM.

### HOW_PROCESSES_ARE_READ

Under the focused layer, the **type process-requirement contract** is listed (what this constructive type needs when selected). Product-level nodes (BODY bond/close, PRODUCT inspect/pack) appear under a thin “produs întreg” footing beneath the stack, not invented as a fifth role.

This page does not own process composition graphs. Full product process composition stays in Procese operaționale. The blueprint only projects “this layer requires these operations.” FACE and BACK both requiring `CUT_SHEET_CNC` is two layer footnotes, not two machines.

### HOW_RESOURCES_ARE_REFERENCED

The layer shows the resolved resource identity in workshop language: “Plexiglas 3 mm opal”, “profil retur aluminiu 0.6 mm”. Configuration resolves to identity. A control next to it opens `/admin/resources?product=…` — the existing admin link, not a rate field.

No SKU invention. No thickness minted as a new resource from this UI.

### HOW_COST_READINESS_IS_SHOWN_WITHOUT_OWNING_RATE

A readiness mark on the layer, projected from existing cost evidence / EIC completeness:

```text
Cost intern: complet  |  parțial  |  lipsă
```

The mark is not a number, not a tariff, not a selling price. Vinyl / RAL stay partial while evidence is unconfirmed. ACM material rates remain AI_DECISION unless marked otherwise — the UI reports that classification; it does not invent a workshop rate.

### DYNAMIC_BEHAVIOR

- Changing product rebuilds the stack from that template's composition.
- Focusing a layer fills the detail region; other layers stay visible as context.
- Switching to ACM removes VOLUME and LIGHTING from the DOM of the stack — silent, not collapsed-empty.
- Display-label editor attaches to the product header or the focused type. Saving a label does not recompile calculation.
- Technical settings on LIGHTING stay visible when that layer is focused; they never become inputs.

### RESPONSIVE_BEHAVIOR

Desktop (1440 / 1280): stack column + detail. 768: stack becomes a vertical accordion; the focused layer's detail stacks below it; product header stays sticky. Mobile operations remain deferred. The stack must not become a hamburger of peer categories.

### ADVANTAGES

- Matches how a constructed sign is thought: face, body, back, light.
- Makes ROLE ≠ TYPE ≠ CONFIGURATION visible without teaching enums.
- Unifies admin inspection and the configurator mental model.
- Unselected roles cannot accidentally grow a form.
- ACM and LETTERS look different because they are built differently.

### RISKS

- ACM cassette is not a letter. Forcing four slots and greying two of them violates silence.
- Lighting-as-layer can be misread as a sold module rather than a role.
- Product-level processes (bond, close, inspect, pack) have no natural layer; the footing must stay thin or they will be invented as roles.
- Catalog organization (family / category) is easy to lose; it must remain a caption, not disappear.
- A beautiful stack can tempt a composition editor. That write does not exist.

### WHY_WORKOS / WHY_NOT_GENERIC_SAAS

A generic SaaS “product builder” would show modules as toggles and settings as a form. WorkOS construction is typed: the template already chose the types; the operator does not assemble a product from a checkbox list; calculation stays on the type; money stays in Resources. The blueprint is a reading of a locked composition, not a kit-of-parts editor.

---

## B. PRODUCT CONSTRUCTION MASTER-DETAIL

### NAME

Product Construction Master-Detail

One ProductTemplate is the object. The page is an object workspace, closer to Client Hub than to a registry dump. Family, category, type, settings, composition, and lifecycle are bands of that object — never peer catalogs that re-list the same product.

### PRIMARY_USER

Owner who picks a live product and inspects or names it. Secondary: technician inspecting one constructive type as an object (on `/components`).

### PRIMARY_OBJECT

ProductTemplate (admin / inspect). On `/components`, the object becomes one constructive type. The commercial configurator stays a separate door.

### FIRST_3_SECONDS

1. The list of live templates (two today; empty Halo / aluminium stay out of the master list or sit as empty-state rows, not fake products).
2. Which product is open.
3. Whether that product's construction is complete, and what the one write is (etichetă).

### LAYOUT_MODEL

Stable split: master list of products, detail inspector with construction bands. Matches the accepted admin collection mechanic (`SEARCH + FILTERS + LIST/DETAIL`) but **the list is products only**.

```text
┌──────────────────────┬──────────────────────────────────────────┐
│ PRODUSE CONFIGURABILE│  Litere luminoase față                   │
│                      │  Familie LETTERS · categorie față plexi  │
│ 🔍                   │  [Editează eticheta afișată]             │
│                      │                                          │
│ ● Litere față plexi  │  COMPOZIȚIE                              │
│   ACM casetă         │  Față → Plexiglas                        │
│                      │  Volum → Aluminiu 0.6                    │
│ (Halo — gol)         │  Spate → Forex                           │
│ (Aluminiu — gol)     │  Iluminare → LED față                    │
│                      │                                          │
│                      │  CONTRACT PE ROL                         │
│                      │  [Față] [Volum] [Spate] [Iluminare]      │
│                      │  — local tabs inside the object —        │
│                      │                                          │
│                      │  Setări tehnice (citire)                 │
│                      │  Procese ale tipului (citire)            │
│                      │  Resurse: identitate + pregătire cost    │
│                      │  Stare / retragere / ștergere            │
│                      │                                          │
│                      │  → Resurse și costuri                    │
│                      │  → Deschide în catalog                   │
└──────────────────────┴──────────────────────────────────────────┘
```

Local tabs are object-scoped (canon: local tabs may exist inside an object; they are not global L2). They are the four **selected** roles. ACM opens with Față and Spate only.

### PERSISTENT_REGION

Master list of ProductTemplates + object header (label, family/category caption, display-label action). Search filters products, not entity kinds.

### SELECTABLE_REGION

The product list. Secondary selection inside the object: a selected role tab, which swaps the contract band. Types are not a second master list on this page.

### DETAIL_REGION

The inspector: composition overview, then the focused role's type contract (configuration ownership, settings if any, process requirements, resource references, gaps, lifecycle). Technical identity stays behind Detalii.

### PRIMARY_ACTION

Edit display label on the open product (or type, on `/components`). Secondary: open Resources for this product; open the commercial catalog/configurator. No construction Save.

### HOW_COMPONENTS_ARE_READ

Components are the composition list and the role tabs of the open product. A type is not browsed as a peer of “Familii”. `/components` uses the same workspace with **types** as the master list, grouped visually by role in the list (role as a list heading, not a category menu). Opening `Plexiglas față` shows its independent calculation, configurations per using product, settings (none), process requirements, resource refs.

### HOW_CONFIGURATION_IS_READ

Inside the role tab, each attribute is labeled with ownership (`blocat de produs` / `pe comandă` / `identitate material` / `măsurătoare` / `setare tehnică`). Order-configurable attributes are described, not edited, on admin/inspect. The configurator remains the only place those fields become inputs, driven by the form schema the template already binds — UI does not hardcode the fields.

### HOW_PROCESSES_ARE_READ

A read-only “Procese necesare” band on the focused type. Product-level composition (BODY / PRODUCT nodes, dependencies) is a single link: “Traseu de produs în Procese operaționale.” This IA does not duplicate the process graph that `/admin/processes` already models well.

### HOW_RESOURCES_ARE_REFERENCED

Resource identity lines on the focused type, plus the existing product-scoped link to Resources. The inspector may list “referințe fără tarif confirmat” as readiness, not as amounts.

### HOW_COST_READINESS_IS_SHOWN_WITHOUT_OWNING_RATE

A readiness fact in the object header and on each role tab:

```text
Pregătire cost intern: completă | parțială | lipsă
```

Same projection already used on types (`resourceReadiness`). No EUR, no adaos, no commercial gross on this admin object.

### DYNAMIC_BEHAVIOR

- Selecting another product replaces the inspector; URL should name the product (stable reopen — canon list/detail).
- Role tabs exist only for selected roles; they do not persist as empty ACM lighting tabs.
- Display-label save refreshes the header and list label; composition bands do not change.
- Empty Halo / aluminium: empty-state in the master list (“fără șablon — așteaptă adevăr de construcție”), not placeholder products.

### RESPONSIVE_BEHAVIOR

1440 / 1280: persistent split. 768: list-first; opening a product is a full-panel inspector with back to list (Client Hub pattern). Role tabs become a select or a stacked band. Do not collapse this into the current category+item rails.

### ADVANTAGES

- Scales when more ProductTemplates exist (Halo, full aluminium) without adding peer dumps.
- Matches accepted collection mechanic while remaining distinguishable from commercial catalog.
- Puts the one real write (etichetă) next to the object it names.
- Avoids triple-listing the same product.
- Keeps process graph and money in their owning pages.

### RISKS

- Looks like Client Hub. If chrome, chips, and commercial language leak in, Product System becomes “another object page.”
- Role tabs can be mistaken for composition editing.
- `/components` as type-master can drift back into a peer dump if families are added “for completeness.”
- Configurator stays a different job; this IA must not swallow the commercial spine.
- Local tabs must not become a third global navigation level.

### WHY_WORKOS / WHY_NOT_GENERIC_SAAS

A generic PIM master-detail would let the user edit every attribute, add variants, and type a price. This workspace is a **construction object**: composition is locked, settings are projected, the only write is the human name, and money is a door to Resources. The object is a ProductTemplate, not a SKU record.

---

## C. DOMAIN MAP TREE

### NAME

Domain Map Tree

The Product System is walked as an ownership graph. The question is not “how does this letter stand?” and not “which product record is open?” It is “what exists in the system, and which node owns the next fact?”

```text
Familie
  └ Categorie (recursive)
      └ ProductTemplate
          └ Rol selectat
              └ Tip constructiv
                  ├ Atribute (ownership)
                  ├ Setări tehnice   ← only if the type owns them
                  ├ Contract de proces
                  └ Referință resursă
```

This is cartography of authority. It is not the current peer-category dump: settings, compositions, and lifecycle are not siblings of families.

### PRIMARY_USER

Owner / architect of the product system. The person who must see empty branches (Halo, full aluminium) as honest absences and must never meet settings as a top-level app.

### PRIMARY_OBJECT

A domain node. The selected node's kind changes the detail (family vs template vs type). The tree is the map of the whole system.

### FIRST_3_SECONDS

1. The shape of the system: LETTERS has live children; Halo / aluminium are empty branches.
2. Where the two live templates sit.
3. That settings do not appear until a type that owns them is opened.

### LAYOUT_MODEL

A single hierarchical tree plus a node inspector. One tree. No category buttons for “Compoziții” or “Lifecycle.”

```text
+----------------------------+------------------------------------+
| HARTĂ DOMENIU              |  NOD: LED față                     |
|                            |  Tip constructiv · rol Iluminare   |
| > LETTERS                  |                                    |
|    > Față plexi / Al       |  Setări tehnice (citire)           |
|       > Litere față plexi  |  · Pas module LED      100 mm      |
|          > Față            |    sursă: setare canonică          |
|          > Volum           |    administrare: încă nu           |
|          > Spate           |  · Putere modul        0.75 W      |
|          > Iluminare   *   |  · Rezervă sursă       25 %        |
|             + LED față     |                                    |
|    > Casetă ACM            |  Nu sunt editabile în acest write  |
| > Halo        -- gol       |                                    |
| > Aluminiu    -- gol       |  Folosit de: Litere față plexi     |
|                            |  Calcul: consumă aceste valori     |
|                            |  Resursă: module / surse -> Costuri|
+----------------------------+------------------------------------+
```

Catalog recursion is real (category may have children). It remains organizational, not technical truth — the tree must caption that.

### PERSISTENT_REGION

The domain tree. Empty families stay visible as empty. Search filters nodes in the tree; it does not spawn a second kind menu.

### SELECTABLE_REGION

Any node. Selection is kind-sensitive. You cannot select “Setări tehnice” as a root.

### DETAIL_REGION

Kinded inspector:

| Node | Detail shows |
| --- | --- |
| Family | label, child categories, product count, readiness; display-label write |
| Category | parent, children, products; display-label write |
| ProductTemplate | composition as child roles; form bound or not; display-label write; door to catalog and to Resources |
| Role | only if selected on that template; the occupying type |
| Type | configuration ownership, settings (if any), process contract, resource refs, used-by, gaps |
| Setting | one typed value, unit, source, classification — still no Edit |

### PRIMARY_ACTION

Display-label write when the selected node is a family, category, template, or type. On a setting node: none. On an empty family: none (do not invent “Adaugă produs”).

### HOW_COMPONENTS_ARE_READ

A component type is a leaf under the role that uses it, and it may appear under every template that selects it. The type is still one object (one display-label, one settings set). The tree may show two paths to `PLEXIGLAS_FACE` if two templates use it; the inspector is the same type.

`/components` can be the same tree with families collapsed and the type nodes promoted — still a map, not a dump.

### HOW_CONFIGURATION_IS_READ

On the type node, attributes are listed with ownership. Product-fixed values are facts of the template path you walked. Order-configurable values are marked “apar în configurator, nu aici.” The commercial configurator is a leaf action on the template node (“Deschide configurația de comandă”), not the tree's job.

### HOW_PROCESSES_ARE_READ

On the type node: process-requirement contract. On the template node: a single “traseu de produs” link into Procese, plus a count of missing processes if the existing composition inspection reports them. The tree does not become a second process composer.

### HOW_RESOURCES_ARE_REFERENCED

On the type node: resource identity references. On the template node: the product-scoped Resources door. Rates never appear as tree attributes.

### HOW_COST_READINESS_IS_SHOWN_WITHOUT_OWNING_RATE

Readiness is a property of the node (badge, not a category). Template node: cost completeness for that product. Type node: resource-readiness of that type. Empty family: no cost badge (nothing to cost).

Lifecycle (can retire / can delete / blockers) lives on the same node. There is no `/lifecycle` replica of the tree.

### DYNAMIC_BEHAVIOR

- Expanding a family reveals categories; expanding a template reveals only selected roles.
- Opening LIGHTING on LETTERS reveals the settings child. Opening FACE never reveals a settings folder.
- Empty Halo expand shows an empty-state, not sample types.
- Label save updates the node title. Tree shape does not change.
- Deep-link a node (family / product / type) so the map is reopenable.

### RESPONSIVE_BEHAVIOR

1440: tree + inspector. 1280: narrower tree, labels truncate, kinds stay visible. 768: tree-first full width; inspector is a panel on node open. A tree on mobile is costly — this IA is desktop-primary and should not be the mobile operations design.

### ADVANTAGES

- Makes ownership visible: settings cannot float; lifecycle cannot duplicate; composition is children, not a second list.
- Honest empty branches for unfinished product families.
- Matches “each fact has one owner” as a spatial rule.
- Scales as categories recurse without adding top-level dumps.
- Best IA for an Owner who is lost in the current seven categories.

### RISKS

- This is the candidate most likely to look like generic SaaS folder administration. If the tree is labeled “Entities” and shows raw IDs, it fails the operator-language invariant.
- Large trees tempt CRUD (add category, add type). Those writes are not in this slice.
- Walking FACE → Plexiglas on two products can look like two types.
- Recursion of catalog categories can be mistaken for construction depth.
- Weakest reuse into the commercial configurator — the configurator must not become a tree of fields.

### WHY_WORKOS / WHY_NOT_GENERIC_SAAS

A generic admin tree is a file system of records. This map is a **law of ownership**: a setting node cannot exist except under the constructive type that calculation consumes; an unselected role cannot exist as a folder; a rate cannot exist as a node because Resources owns it. The tree is how WorkOS refuses parallel authorities, not how it stores rows.

---

## Comparison for Owner selection

| Question | Prefer |
| --- | --- |
| Should admin and configurator share one mental model? | A Blueprint |
| Will we have many templates and need an object workspace? | B Master-Detail |
| Is the current confusion “too many peer catalogs”? | C Domain Map |
| Must ACM look unlike LETTERS at a glance? | A |
| Must display-label write sit on a familiar object chrome? | B |
| Must empty Halo / aluminium stay visible as system gaps? | C |

Do not merge A+B+C into one page. A hybrid that keeps seven categories and adds a pretty stack is the current failure.

---

## Shared non-goals

```text
NO composition editor
NO technical-settings Edit / Save / version UI
NO parallel Product entity
NO Analyzer inside Product System
NO rates, SKUs, machine-hour, commercial price in admin
NO hardcoded LETTERS fields in UI
NO fake readiness
NO implementing these IAs from this document
```

Future settings administration, when persistence / validation / versioning / owner authorization exist:

```text
OWNER → Product System → Component variant → Setări tehnice
  → Edit → Validate → Save new version → calculators consume it
```

That lifecycle is not in any of the three IAs. All three only project the current typed values.

---

## Relation to current pages

| Current | A | B | C |
| --- | --- | --- | --- |
| `OwnerCatalogView` peer categories | replace | replace (product list only) | replace (one tree) |
| `/admin/product-system` label write | keep on header / node | keep on object | keep on named nodes |
| `/components` | role rack + layer detail | type master-detail | same map, type-weighted |
| `/products/:code` spine | stack becomes form; spine stays | unchanged commercial door | leaf action only |
| Link to Resources | keep, identity-only | keep | keep |

---

## Studied

```text
PRODUCT_SYSTEM_DIRECTIONS_STUDIED = 3
  A = VERTICAL_PRODUCT_BLUEPRINT
  B = PRODUCT_CONSTRUCTION_MASTER_DETAIL
  C = DOMAIN_MAP_TREE
OWNER_SELECTION                 = NOT_MADE
IMPLEMENTATION_GO               = NOT_AUTHORIZED
```
