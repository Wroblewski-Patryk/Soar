---
id: SOAR-TEST-WEB-AUTH-CONTEXT
name: "Web AuthContext tests"
type: test
status: verified_local
layer: testing
module: web-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web AuthContext tests

| Field | Value |
| --- | --- |
| Description | Web AuthContext bootstrap and session tests. |
| File path | apps/web/src/context/AuthContext.test.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-CONTEXT-WEB-AUTH]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related | [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Auth context proof. |

## Relations

- verified_by <- [[SOAR-CONTEXT-WEB-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
