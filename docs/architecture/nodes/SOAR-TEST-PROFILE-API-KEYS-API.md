---
id: SOAR-TEST-PROFILE-API-KEYS-API
name: "Profile API-key API tests"
type: test
status: verified_local
layer: testing
module: api-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Profile API-key API tests

| Field | Value |
| --- | --- |
| Description | Profile API-key lifecycle e2e tests. |
| File path | apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts |
| Related files | apps/api/src/modules/profile/stage-abuse-throttling.e2e.test.ts |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-PROFILE-API-KEYS]], [[SOAR-CONTROLLER-PROFILE-API-KEYS]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Database related | [[SOAR-DB-API-KEY]], [[SOAR-DB-LOG]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Primary API-key backend proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
