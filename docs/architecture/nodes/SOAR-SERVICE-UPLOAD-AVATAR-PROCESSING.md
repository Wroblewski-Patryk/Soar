---
id: SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING
name: "Avatar upload processing service"
type: service
status: verified_local
layer: backend
module: api-upload
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Avatar upload processing service

| Field | Value |
| --- | --- |
| Description | Avatar upload validation and image processing boundary implemented in the upload route module and processing tests. |
| File path | apps/api/src/modules/upload/upload.routes.ts |
| Related files | apps/api/src/modules/upload/upload.processing.test.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-API-UPLOAD-AVATAR]] |
| UI related |  |
| API related | [[SOAR-API-UPLOAD-AVATAR]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-UPLOAD-API]] |
| Docs related | [[SOAR-DOC-API-UPLOAD]] |
| Agent related |  |
| Notes | File upload proof is scoped to local processing and route tests. |

## Relations

- scoped_by -> [[SOAR-DB-USER]] (verified_local)
- calls <- [[SOAR-API-UPLOAD-AVATAR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
