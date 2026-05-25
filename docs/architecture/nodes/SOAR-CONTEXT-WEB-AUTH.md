---
id: SOAR-CONTEXT-WEB-AUTH
name: "AuthContext"
type: context
status: verified_local
layer: frontend
module: web-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, context, frontend, verified_local]
---

# AuthContext

| Field | Value |
| --- | --- |
| Description | Web auth context for current-user bootstrap logout and protected UI session state. |
| File path | apps/web/src/context/AuthContext.tsx |
| Related files | apps/web/src/context/AuthContext.test.tsx |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-AUTH]], [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| Used by | [[SOAR-PAGE-DASHBOARD]], [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related | [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-AUTH-CONTEXT]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Session context boundary. |

## Relations

- calls -> [[SOAR-API-AUTH-ME]] (verified_local)
- calls -> [[SOAR-API-AUTH-LOGOUT]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-AUTH-CONTEXT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
