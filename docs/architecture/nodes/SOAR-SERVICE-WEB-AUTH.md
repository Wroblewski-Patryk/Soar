---
id: SOAR-SERVICE-WEB-AUTH
name: "Web auth service"
type: service
status: verified_local
layer: frontend
module: web-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web auth service

| Field | Value |
| --- | --- |
| Description | Web auth API service for login and registration requests. |
| File path | apps/web/src/features/auth/services/auth.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Used by | [[SOAR-HOOK-USE-LOGIN-FORM]], [[SOAR-HOOK-USE-REGISTER-FORM]] |
| UI related | [[SOAR-COMP-LOGIN-FORM]], [[SOAR-COMP-REGISTER-FORM]] |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-AUTH-HOOKS]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Auth Web service. |

## Relations

- calls -> [[SOAR-API-AUTH-LOGIN]] (verified_local)
- calls -> [[SOAR-API-AUTH-REGISTER]] (verified_local)
- calls <- [[SOAR-HOOK-USE-LOGIN-FORM]] (verified_local)
- calls <- [[SOAR-HOOK-USE-REGISTER-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
