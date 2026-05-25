---
id: SOAR-TEST-WEB-AUTH-FORMS
name: "Web auth form tests"
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

# Web auth form tests

| Field | Value |
| --- | --- |
| Description | Web LoginForm RegisterForm and password visibility behavior tests. |
| File path | apps/web/src/features/auth/components/LoginForm.test.tsx |
| Related files | apps/web/src/features/auth/components/RegisterForm.test.tsx |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-COMP-LOGIN-FORM]], [[SOAR-COMP-REGISTER-FORM]], [[SOAR-UI-PASSWORD-VISIBILITY-TOGGLE]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]] |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Focused form proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-AUTH-SESSION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
