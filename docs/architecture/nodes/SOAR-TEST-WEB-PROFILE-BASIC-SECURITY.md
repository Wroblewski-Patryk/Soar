---
id: SOAR-TEST-WEB-PROFILE-BASIC-SECURITY
name: "Web profile basic and security tests"
type: test
status: verified_local
layer: testing
module: web-profile
feature: profile-basic
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web profile basic and security tests

| Field | Value |
| --- | --- |
| Description | Profile basic and security component tests plus profile support helpers. |
| File path | apps/web/src/features/profile/components/BasicForm.test.tsx |
| Related files | apps/web/src/features/profile/components/Security.test.tsx |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-COMP-PROFILE-BASIC-FORM]], [[SOAR-COMP-PROFILE-SECURITY]], [[SOAR-HOOK-USE-USER]], [[SOAR-SERVICE-WEB-PROFILE-SECURITY]], [[SOAR-SERVICE-PROFILE-BASIC-CACHE]] |
| Used by | [[SOAR-PAGE-PROFILE]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-BASIC-API]], [[SOAR-TEST-PROFILE-SECURITY-API]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Profile residual Web proof. |

## Relations

- verified_by <- [[SOAR-COMP-PROFILE-BASIC-FORM]] (verified_local)
- verified_by <- [[SOAR-COMP-PROFILE-SECURITY]] (verified_local)
- verified_by <- [[SOAR-PAGE-PROFILE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
