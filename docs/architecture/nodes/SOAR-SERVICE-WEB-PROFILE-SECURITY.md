---
id: SOAR-SERVICE-WEB-PROFILE-SECURITY
name: "Web profile security service"
type: service
status: verified_local
layer: frontend
module: web-profile
feature: profile-security
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web profile security service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for profile password and account security actions. |
| File path | apps/web/src/features/profile/services/security.service.ts |
| Related files |  |
| Parent | [[SOAR-COMP-PROFILE-SECURITY]] |
| Children |  |
| Depends on | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Used by | [[SOAR-COMP-PROFILE-SECURITY]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Profile security Web service. |

## Relations

- calls -> [[SOAR-API-PROFILE-SECURITY-PASSWORD]] (verified_local)
- calls -> [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] (verified_local)
- calls <- [[SOAR-COMP-PROFILE-SECURITY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
