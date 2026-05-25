---
id: SOAR-ROUTER-API-ROOT
name: "API root router"
type: router
status: verified_local
layer: backend
module: api
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, router, backend, verified_local]
---

# API root router

| Field | Value |
| --- | --- |
| Description | Root API router that mounts auth dashboard admin health readiness metrics alerts worker health and upload routes. |
| File path | apps/api/src/router/index.ts |
| Related files | apps/api/src/router/dashboard.routes.ts, apps/api/src/router/admin.routes.ts, apps/api/src/modules/upload/upload.routes.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-ROUTER-DASHBOARD]], [[SOAR-ROUTER-ADMIN]], [[SOAR-API-UPLOAD-AVATAR]], [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-UPLOAD-AVATAR]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-ROOT]] |
| Agent related |  |
| Notes | Aggregate mount map for API route reachability. |

## Relations

- mounts -> [[SOAR-ROUTER-DASHBOARD]] (verified_local)
- mounts -> [[SOAR-ROUTER-ADMIN]] (verified_local)
- mounts -> [[SOAR-API-UPLOAD-AVATAR]] (verified_local)
- protected_by -> [[SOAR-MIDDLEWARE-REQUIRE-AUTH]] (verified_local)
- observed_by -> [[SOAR-MIDDLEWARE-REQUEST-LOGGER]] (verified_local)
- handled_by -> [[SOAR-MIDDLEWARE-ERROR-HANDLER]] (verified_local)
- has_source <- [[SOAR-FEATURE-API-SUPPORT-ROUTES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
