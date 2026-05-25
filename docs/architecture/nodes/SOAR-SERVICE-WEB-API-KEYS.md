---
id: SOAR-SERVICE-WEB-API-KEYS
name: "Web API keys service"
type: service
status: verified_local
layer: frontend
module: web-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web API keys service

| Field | Value |
| --- | --- |
| Description | Typed frontend service for profile API-key lifecycle and connection-test endpoints. |
| File path | apps/web/src/features/profile/services/apiKeys.service.ts |
| Related files | apps/web/src/features/profile/types/apiKey.type.ts |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-UPDATE]], [[SOAR-API-PROFILE-APIKEY-DELETE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Used by | [[SOAR-HOOK-USE-API-KEYS]] |
| UI related | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-UPDATE]], [[SOAR-API-PROFILE-APIKEY-DELETE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Frontend contract node for credential management. |

## Relations

- calls -> [[SOAR-API-PROFILE-APIKEY-LIST]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-CREATE]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-UPDATE]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-DELETE]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-TEST]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-STORED-TEST]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-ROTATE]] (verified_local)
- calls -> [[SOAR-API-PROFILE-APIKEY-REVOKE]] (verified_local)
- calls <- [[SOAR-HOOK-USE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
