---
id: SOAR-CONTROLLER-PROFILE-API-KEYS
name: "Profile API-key controller"
type: controller
status: verified_local
layer: backend
module: api-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Profile API-key controller

| Field | Value |
| --- | --- |
| Description | Profile API-key controller for auth checks validation mapping and lifecycle/probe responses. |
| File path | apps/api/src/modules/profile/apiKey/apiKey.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-TYPES-PROFILE-API-KEYS]], [[SOAR-SERVICE-PROFILE-API-KEYS]] |
| Used by | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Controller maps ExchangeNotImplementedError fail-closed responses. |

## Relations

- validates_with -> [[SOAR-TYPES-PROFILE-API-KEYS]] (verified_local)
- calls -> [[SOAR-SERVICE-PROFILE-API-KEYS]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-APIKEY-LIST]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-APIKEY-CREATE]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-APIKEY-TEST]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-APIKEY-STORED-TEST]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-APIKEY-ROTATE]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-APIKEY-REVOKE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
