---
id: SOAR-TEST-WEB-AUTH-HOOKS
name: "Web auth hook tests"
type: test
status: verified_local
layer: testing
module: web-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web auth hook tests

| Field | Value |
| --- | --- |
| Description | Web login and register hook tests. |
| File path | apps/web/src/features/auth/hooks/useLoginForm.test.tsx |
| Related files | apps/web/src/features/auth/hooks/useRegisterForm.test.tsx |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-HOOK-USE-LOGIN-FORM]], [[SOAR-HOOK-USE-REGISTER-FORM]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-COMP-LOGIN-FORM]], [[SOAR-COMP-REGISTER-FORM]] |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Focused hook proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-AUTH-SESSION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
