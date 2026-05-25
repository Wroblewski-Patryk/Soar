---
id: SOAR-TEST-UPLOAD-API
name: "Upload API tests"
type: test
status: verified_local
layer: testing
module: api-upload
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Upload API tests

| Field | Value |
| --- | --- |
| Description | Avatar upload route and processing e2e/unit tests. |
| File path | apps/api/src/modules/upload/upload.e2e.test.ts |
| Related files | apps/api/src/modules/upload/upload.processing.test.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-UPLOAD-AVATAR]], [[SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-UPLOAD-AVATAR]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-UPLOAD]] |
| Agent related |  |
| Notes | Primary upload proof. |

## Relations

- verified_by <- [[SOAR-API-UPLOAD-AVATAR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
