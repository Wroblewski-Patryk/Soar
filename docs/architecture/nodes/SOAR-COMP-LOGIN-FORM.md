---
id: SOAR-COMP-LOGIN-FORM
name: "LoginForm"
type: component
status: verified
layer: frontend
module: web-auth
feature: auth-session
risk_level: medium
completion_percent: 100
last_verified_at: 2026-05-14
verification_status: verified
tags: [soar-map, component, frontend, verified]
---

# LoginForm

| Field | Value |
| --- | --- |
| Description | Login form component that submits credentials and renders auth errors. |
| File path | apps/web/src/features/auth/components/LoginForm.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-LOGIN]] |
| Children |  |
| Depends on | [[SOAR-API-AUTH-LOGIN]] |
| Used by | [[SOAR-PAGE-LOGIN]] |
| UI related | [[SOAR-PAGE-LOGIN]] |
| API related | [[SOAR-API-AUTH-LOGIN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Exact tests are tracked in Auth proof history. |

## Relations

- calls -> [[SOAR-API-AUTH-LOGIN]] (verified)
- uses -> [[SOAR-HOOK-USE-LOGIN-FORM]] (verified_local)
- uses -> [[SOAR-UI-PASSWORD-VISIBILITY-TOGGLE]] (verified_local)
- contains <- [[SOAR-PAGE-LOGIN]] (verified)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
