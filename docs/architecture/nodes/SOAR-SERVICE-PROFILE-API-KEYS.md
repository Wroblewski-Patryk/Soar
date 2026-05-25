---
id: SOAR-SERVICE-PROFILE-API-KEYS
name: "Profile API-key service"
type: service
status: verified_local
layer: backend
module: api-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Profile API-key service

| Field | Value |
| --- | --- |
| Description | API-key lifecycle service for encrypted storage masking sync options connection tests and lifecycle audit logs. |
| File path | apps/api/src/modules/profile/apiKey/apiKey.service.ts |
| Related files | apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-DB-API-KEY]], [[SOAR-DB-USER]], [[SOAR-DB-LOG]], [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]], [[SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT]], [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-API-KEYS]], [[SOAR-FEATURE-WALLETS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Database related | [[SOAR-DB-API-KEY]], [[SOAR-DB-LOG]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]], [[SOAR-TEST-PROFILE-API-KEY-PROBE]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Raw credentials are encrypted/decrypted only inside backend boundaries. |

## Relations

- reads_writes -> [[SOAR-DB-API-KEY]] (verified_local)
- writes -> [[SOAR-DB-LOG]] (verified_local)
- uses -> [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] (verified_local)
- calls <- [[SOAR-CONTROLLER-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
