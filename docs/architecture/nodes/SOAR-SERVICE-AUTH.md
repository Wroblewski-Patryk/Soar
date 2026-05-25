---
id: SOAR-SERVICE-AUTH
name: "Auth service"
type: service
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Auth service

| Field | Value |
| --- | --- |
| Description | Auth service for user registration credential verification and session identity behavior. |
| File path | apps/api/src/modules/auth/auth.service.ts |
| Related files | apps/api/src/modules/auth/auth.service.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]], [[SOAR-SERVICE-AUTH-JWT]], [[SOAR-SERVICE-AUTH-ERRORS]] |
| Used by | [[SOAR-CONTROLLER-AUTH]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-API-AUTH-ME]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SERVICE]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth domain service. |

## Relations

- uses -> [[SOAR-SERVICE-AUTH-JWT]] (verified_local)
- uses -> [[SOAR-SERVICE-AUTH-ERRORS]] (verified_local)
- reads_writes -> [[SOAR-DB-USER]] (verified_local)
- verified_by -> [[SOAR-TEST-API-AUTH-SERVICE]] (verified_local)
- calls <- [[SOAR-CONTROLLER-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
