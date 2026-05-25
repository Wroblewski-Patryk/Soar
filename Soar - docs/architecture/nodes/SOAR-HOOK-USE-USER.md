---
id: SOAR-HOOK-USE-USER
name: "useUser hook"
type: hook
status: verified_local
layer: frontend
module: web-profile
feature: profile-basic
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useUser hook

| Field | Value |
| --- | --- |
| Description | Profile user hook for current user state and basic profile refresh. |
| File path | apps/web/src/features/profile/hooks/useUser.ts |
| Related files |  |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-CONTEXT-WEB-AUTH]], [[SOAR-API-PROFILE-BASIC-GET]] |
| Used by | [[SOAR-COMP-PROFILE-BASIC-FORM]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-BASIC-GET]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Profile current-user hook. |

## Relations

- uses <- [[SOAR-COMP-PROFILE-BASIC-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
