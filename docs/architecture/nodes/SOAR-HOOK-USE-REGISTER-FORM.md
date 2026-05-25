---
id: SOAR-HOOK-USE-REGISTER-FORM
name: "useRegisterForm hook"
type: hook
status: verified_local
layer: frontend
module: web-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useRegisterForm hook

| Field | Value |
| --- | --- |
| Description | Register form hook for account creation state validation and submit flow. |
| File path | apps/web/src/features/auth/hooks/useRegisterForm.ts |
| Related files | apps/web/src/features/auth/hooks/useRegisterForm.test.tsx |
| Parent | [[SOAR-COMP-REGISTER-FORM]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-AUTH]] |
| Used by | [[SOAR-COMP-REGISTER-FORM]] |
| UI related | [[SOAR-COMP-REGISTER-FORM]] |
| API related | [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-AUTH-HOOKS]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Register hook. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-AUTH]] (verified_local)
- uses <- [[SOAR-COMP-REGISTER-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
