---
id: SOAR-API-UPLOAD-AVATAR
name: "POST /upload/avatar"
type: api_route
status: verified_local
layer: backend
module: api-upload
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /upload/avatar

| Field | Value |
| --- | --- |
| Description | Authenticated avatar upload route with size type pixel and processing limits. |
| File path | apps/api/src/modules/upload/upload.routes.ts |
| Related files | apps/api/src/modules/upload/upload.processing.test.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related | [[SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-UPLOAD-API]] |
| Docs related | [[SOAR-DOC-API-UPLOAD]] |
| Agent related |  |
| Notes | Authenticated file-processing boundary. |

## Relations

- calls -> [[SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING]] (verified_local)
- verified_by -> [[SOAR-TEST-UPLOAD-API]] (verified_local)
- documented_by -> [[SOAR-DOC-API-UPLOAD]] (verified_local)
- mounts <- [[SOAR-ROUTER-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
