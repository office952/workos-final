# Architecture C UI Wave 1 — implemented locally in review

```text
DATE                               = 2026-08-26
BRANCH                             = feat/architecture-c-ui-wave1-shell-resources-v1
BASE                               = e0a5e53a335334433bb6574966687b6b3c1de1a6
HUB_BRANCH                         = feat/hub-media-organization-configuration-clean-pilot-v1
HUB_HEAD                           = f06d7ecc56cc0bc285d974d2dd360fcc6077eaa6
ARCHITECTURE_C_UI_WAVE_1           = CORRECTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                     = NO
ARCHITECTURE_C_UI_WAVE_2           = NOT_STARTED
FIGMA_LIBRARY_PUBLISHED            = NO
PUSH                               = NO
WEB                                = http://127.0.0.1:5189
API                                = http://127.0.0.1:8803
```

## What landed

Global Architecture C shell foundations plus the first migrated route `/admin/resources`. This is not a 27-pattern migration and not Wave 2.

- Brand **WorkOS Final**; L1 Lucrări / Atelier / Comercial / Catalog / Administrare; 768 **Meniu** overflow.
- Cont ≥44×44 with short name, optional legal name wrap, authenticated account, LIGHT/DARK/SYSTEM, logout.
- Office rule on `/admin`: no **Identifică-te** CTA; operator chip only if a session exists, compact and passive.
- Admin L2 distinct from MasterSelector. Canonical L2: Resurse, Utilaje și zone, Oameni, Procese, Guvernanță. `?nav=basic` is ignored on the production route.
- Selection authority: `/admin/resources?selected=<stable-catalog-item-id>` from `buildResourcesCatalog`. Live `GET /api/resources-admin`. No second catalog.
- 768: **Secțiuni** and **Alege elementul** drawers, one open, overlay, Escape, × `Închide`, focus trap, return focus, scroll lock.
- SkipLink compact, hidden until focus. Login wall: **Sari la autentificare**. Authenticated: **Sari la conținut**.
- Cost write label **Confirmă tarif** on the existing PATCH. No Figma `4,25 EUR/m`. No commercial price on Resurse.

## Advisories kept

- IdentityMenu supports the legal name without a 59px fixed width; long names wrap.
- SkipLink is compact and fully visible only when focused.

## Evidence

Owner review pack: `.tmp/workos-architecture-c-ui-wave1-owner-review/`
Desktop copy: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_REVIEW`
Zip: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_REVIEW.zip`

Targeted closure pack: `.tmp/workos-architecture-c-ui-wave1-targeted-closure/`
Desktop copy: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_TARGETED_CLOSURE`
Zip: `C:\Users\offic\Desktop\WORKOS_ARCHITECTURE_C_UI_WAVE1_TARGETED_CLOSURE.zip`

Isolated Cloud root is synthetic and ignored. Credentials stay in that root only. Real HUB Cloud was not used.

## Not done

Owner accept, push, Wave 2, Figma library publish, HUB organization-configuration accept, first real LETTERS job.
