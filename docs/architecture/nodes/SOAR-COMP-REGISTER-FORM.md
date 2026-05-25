---
id: SOAR-COMP-REGISTER-FORM
name: "RegisterForm"
type: component
status: verified_local
layer: frontend
module: web-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# RegisterForm

| Field | Value |
| --- | --- |
| Description | Register form component that validates account creation fields and submits registration. |
| File path | apps/web/src/features/auth/components/RegisterForm.tsx |
| Related files | apps/web/src/features/auth/components/RegisterForm.test.tsx |
| Parent | [[SOAR-PAGE-REGISTER]] |
| Children |  |
| Depends on | [[SOAR-HOOK-USE-REGISTER-FORM]], [[SOAR-UI-PASSWORD-VISIBILITY-TOGGLE]] |
| Used by | [[SOAR-PAGE-REGISTER]] |
| UI related | [[SOAR-PAGE-REGISTER]] |
| API related | [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-AUTH-FORMS]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Register form surface. |

## Relations

- uses -> [[SOAR-HOOK-USE-REGISTER-FORM]] (verified_local)
- uses -> [[SOAR-UI-PASSWORD-VISIBILITY-TOGGLE]] (verified_local)
- contains <- [[SOAR-PAGE-REGISTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
