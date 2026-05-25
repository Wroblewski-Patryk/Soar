---
id: SOAR-TEST-PROFILE-BASIC-API
name: "Profile basic API tests"
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

# Profile basic API tests

| Field | Value |
| --- | --- |
| Description | Profile basic route e2e tests. |
| File path | apps/api/src/modules/profile/basic/basic.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-BASIC-DELETE]], [[SOAR-SERVICE-PROFILE-BASIC]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-BASIC-DELETE]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Primary profile basic proof. |

## Relations

- verified_by <- [[SOAR-API-PROFILE-BASIC-GET]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
