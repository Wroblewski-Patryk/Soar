---
id: SOAR-API-PROFILE-APIKEY-TEST
name: "POST /dashboard/profile/apiKeys/test"
type: api_route
status: verified_local
layer: backend
module: api-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /dashboard/profile/apiKeys/test

| Field | Value |
| --- | --- |
| Description | Authenticated provided-credential exchange connection test endpoint. |
| File path | apps/api/src/modules/profile/apiKey/apiKey.routes.ts |
| Related files | apps/api/src/modules/profile/apiKey/apiKey.controller.ts, apps/api/src/modules/profile/apiKey/apiKey.service.ts |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-API-KEYS]], [[SOAR-SERVICE-PROFILE-API-KEYS]], [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]] |
| Used by | [[SOAR-SERVICE-WEB-API-KEYS]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-CREATE]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEY-PROBE]], [[SOAR-TEST-PROFILE-API-KEYS-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Rate-limited user_exchange scoped route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-API-KEYS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
