---
id: SOAR-SERVICE-PROFILE-API-KEY-PROBE
name: "Profile exchange API-key probe service"
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

# Profile exchange API-key probe service

| Field | Value |
| --- | --- |
| Description | Profile-facing exchange credential probe service with audit-safe result codes. |
| File path | apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts |
| Related files | apps/api/src/modules/exchange/exchangeApiKeyProbeClient.service.ts |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-PROFILE-API-KEYS]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEY-PROBE]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Probe support validates credentials only; execution remains exchange/order owned. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT]] (verified_local)
- uses <- [[SOAR-SERVICE-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
