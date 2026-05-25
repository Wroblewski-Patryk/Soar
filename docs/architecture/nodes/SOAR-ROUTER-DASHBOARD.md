---
id: SOAR-ROUTER-DASHBOARD
name: "Dashboard API router"
type: router
status: verified_local
layer: backend
module: api-dashboard
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, router, backend, verified_local]
---

# Dashboard API router

| Field | Value |
| --- | --- |
| Description | Authenticated dashboard aggregate router for profile security icon lookup market stream and other dashboard modules. |
| File path | apps/api/src/router/dashboard.routes.ts |
| Related files | apps/api/src/modules/profile/basic/basic.routes.ts, apps/api/src/modules/profile/security/security.routes.ts, apps/api/src/modules/icons/icons.routes.ts, apps/api/src/modules/market-stream/marketStream.routes.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-ROOT]] |
| Agent related |  |
| Notes | Mounts dashboard-scoped support route modules behind authentication. |

## Relations

- mounts -> [[SOAR-API-ICON-LOOKUP]] (verified_local)
- mounts -> [[SOAR-API-MARKET-STREAM-EVENTS]] (verified_local)
- mounts -> [[SOAR-API-PROFILE-BASIC-GET]] (verified_local)
- mounts -> [[SOAR-API-PROFILE-SECURITY-PASSWORD]] (verified_local)
- mounts <- [[SOAR-ROUTER-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
