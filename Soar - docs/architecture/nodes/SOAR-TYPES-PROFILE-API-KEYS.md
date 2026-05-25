---
id: SOAR-TYPES-PROFILE-API-KEYS
name: "Profile API-key DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Profile API-key DTO schemas

| Field | Value |
| --- | --- |
| Description | Profile API-key create rotate and connection-test validation schemas. |
| File path | apps/api/src/modules/profile/apiKey/apiKey.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-PROFILE]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-API-KEYS]], [[SOAR-SERVICE-PROFILE-API-KEYS]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-UPDATE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Validation boundary for sensitive credential payloads. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
