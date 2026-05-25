---
id: SOAR-COMP-PROFILE-BASIC-FORM
name: "Profile BasicForm"
type: component
status: verified_local
layer: frontend
module: web-profile
feature: profile-basic
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# Profile BasicForm

| Field | Value |
| --- | --- |
| Description | Profile basic form for display name timezone and basic account metadata. |
| File path | apps/web/src/features/profile/components/BasicForm.tsx |
| Related files | apps/web/src/features/profile/components/BasicForm.test.tsx |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-HOOK-USE-USER]], [[SOAR-SERVICE-PROFILE-BASIC-CACHE]] |
| Used by | [[SOAR-PAGE-PROFILE]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Profile basic UI surface. |

## Relations

- uses -> [[SOAR-HOOK-USE-USER]] (verified_local)
- uses -> [[SOAR-SERVICE-PROFILE-BASIC-CACHE]] (verified_local)
- calls -> [[SOAR-API-PROFILE-BASIC-GET]] (verified_local)
- calls -> [[SOAR-API-PROFILE-BASIC-UPDATE]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] (verified_local)
- contains <- [[SOAR-PAGE-PROFILE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
