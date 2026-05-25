---
id: SOAR-CONTROLLER-AUTH
name: "Auth controller"
type: controller
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Auth controller

| Field | Value |
| --- | --- |
| Description | Auth controller for register login logout and current-user responses. |
| File path | apps/api/src/modules/auth/auth.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH]], [[SOAR-TYPES-AUTH]], [[SOAR-SERVICE-AUTH-COOKIE]] |
| Used by | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth controller boundary. |

## Relations

- validates_with -> [[SOAR-TYPES-AUTH]] (verified_local)
- calls -> [[SOAR-SERVICE-AUTH]] (verified_local)
- uses -> [[SOAR-SERVICE-AUTH-COOKIE]] (verified_local)
- routes_to <- [[SOAR-API-AUTH-REGISTER]] (verified_local)
- routes_to <- [[SOAR-API-AUTH-LOGIN]] (verified_local)
- routes_to <- [[SOAR-API-AUTH-ME]] (verified_local)
- routes_to <- [[SOAR-API-AUTH-LOGOUT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
