---
title: "feat: Add client workspace"
date: 2026-08-17
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
product_contract_source: ce-plan-bootstrap
---

# feat: Add client workspace

## Goal Capsule

Office staff can open one Client Workspace and see who the client is now, what they asked, what we offered, and what works exist — projected from existing Customer, CommercialRequest, Quote, and Order truth. Customer profile expands with optional operational fields. CER- references become unique at persistence.

## Problem Frame

Cereri, Oferte, and Lucrări exist, but the daily question “this client is in front of me — what do we know?” has no surface. Admin Clienți is lifecycle only.

## UI hierarchy (required before code)

```text
Top nav: Lucrări | Comercial | Produse | Administrare
Comercial active on /requests, /quotes, /clients
Secondary: Cereri | Oferte | Clienți

/clients                  registry
/clients/:customerId      workspace
```

Workspace page (one identity frame, one content pane — not three stacked tables):

1. Header always visible: current name, Activ/Retras, CUI/contact summary, Editează, Cerere nouă if ACTIVE.
2. Derived next-action line from existing overview attention — no ClientStatus.
3. Section switcher: Prezentare | Cereri | Oferte | Lucrări (all backed by real truth).
4. Prezentare: current profile card labeled Date curente, plus compact counts and optional recent activity from existing createdAt.
5. Other sections: existing list-row patterns for this customerId only.

Current profile is visually distinct from frozen Quote/Order identity.

Admin `/admin/customers` stays lifecycle (name + retire) and links Deschide workspace. Profile edit lives in the workspace.

## Key Technical Decisions

1. Customer remains the technical domain. UI says Client. No `/api/clients`.
2. Optional profile fields on Customer: cui, contactName, phone, email, address, city, notes. Null when empty. Existing rows stay valid.
3. Quote Snapshot frozen customer stays `{ customerId, displayName }`. Do not expand Quote schema.
4. Workspace is a read projection: filter existing Request/Quote/Job overviews by stable customerId.
5. Add `customerId` to Request/Quote/Job overview items so registries can link to `/clients/:id`.
6. CER uniqueness: UNIQUE on `commercial_requests.reference` + bounded create retry. Do not rewrite existing references. Stop if duplicates exist.
7. Commercial grouping: extend AppShell with prefix-active Comercial + compact secondary nav. Keep existing URLs.

## Implementation Units

### U1. Customer profile + workspace projection + CER uniqueness

**Files:** `packages/domain/src/customers/*`, `packages/domain/src/customers/workspace.ts`, overview items (`customerId`), `packages/domain/src/requests/commercialRequest.ts` (`reference_unavailable`), tests.

### U2. Persistence + API

**Files:** `017_customer_profile_and_request_reference.sql`, customer/request stores, runtime, customer routes, persistence + customer + workspace + request tests.

### U3. Client UI + commercial nav + cross-links

**Files:** Clients pages, App/AppShell, customerApi, Cereri/Oferte/Lucrări client links, Admin workspace link, CSS, web tests.

### U4. E2E + docs

**Files:** e2e clients specs, smoke, canon/roadmap/AGENTS/worklog, screenshots.

## Scope Boundaries

Out: CRM, Contact entity, Documents, invoices, People, auth, Quote/Order schema change, legacy import, ClientStatus.

## Verification Contract

Domain/API/web tests in the owner GO. Playwright Scenario A/B/C. Workspace GET is read-only.

## Definition of Done

Human day test all YES. Workspace feels like one client center. One commit after proof. Push main.
