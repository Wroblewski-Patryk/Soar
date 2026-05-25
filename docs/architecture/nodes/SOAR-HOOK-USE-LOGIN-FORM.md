---
id: SOAR-HOOK-USE-LOGIN-FORM
name: "useLoginForm hook"
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

# useLoginForm hook

| Field | Value |
| --- | --- |
| Description | Login form hook for credential state validation and submit flow. |
| File path | apps/web/src/features/auth/hooks/useLoginForm.ts |
| Related files | apps/web/src/features/auth/hooks/useLoginForm.test.tsx |
| Parent | [[SOAR-COMP-LOGIN-FORM]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-AUTH]] |
| Used by | [[SOAR-COMP-LOGIN-FORM]] |
| UI related | [[SOAR-COMP-LOGIN-FORM]] |
| API related | [[SOAR-API-AUTH-LOGIN]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-AUTH-HOOKS]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Login hook. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-AUTH]] (verified_local)
- uses <- [[SOAR-COMP-LOGIN-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
