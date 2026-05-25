---
id: SOAR-TEST-PROFILE-SECURITY-API
name: "Profile security API tests"
type: test
status: verified_local
layer: testing
module: api-profile
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Profile security API tests

| Field | Value |
| --- | --- |
| Description | Profile security password and account deletion route e2e tests. |
| File path | apps/api/src/modules/profile/security/security.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]], [[SOAR-SERVICE-PROFILE-SECURITY]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Primary profile security proof. |

## Relations

- verified_by <- [[SOAR-API-PROFILE-SECURITY-PASSWORD]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
