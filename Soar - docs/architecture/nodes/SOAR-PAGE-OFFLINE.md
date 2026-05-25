---
id: SOAR-PAGE-OFFLINE
name: "Offline page"
type: page
status: verified_local
layer: frontend
module: web-shell
feature: web-residual-surfaces
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Offline page

| Field | Value |
| --- | --- |
| Description | Offline route for app shell connectivity fallback. |
| File path | apps/web/src/app/offline/page.tsx |
| Related files | apps/web/src/app/offline/page.test.tsx |
| Parent | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-SHARED]] |
| Used by | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-SHARED]] |
| Agent related |  |
| Notes | Offline fallback surface. |

## Relations

- verified_by -> [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
