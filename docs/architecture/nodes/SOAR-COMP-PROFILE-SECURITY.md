---
id: SOAR-COMP-PROFILE-SECURITY
name: "Profile Security"
type: component
status: verified_local
layer: frontend
module: web-profile
feature: profile-security
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# Profile Security

| Field | Value |
| --- | --- |
| Description | Profile security component for password change and account deletion flows. |
| File path | apps/web/src/features/profile/components/Security.tsx |
| Related files | apps/web/src/features/profile/components/Security.test.tsx |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-PROFILE-SECURITY]] |
| Used by | [[SOAR-PAGE-PROFILE]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Profile security UI surface. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-PROFILE-SECURITY]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] (verified_local)
- contains <- [[SOAR-PAGE-PROFILE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
