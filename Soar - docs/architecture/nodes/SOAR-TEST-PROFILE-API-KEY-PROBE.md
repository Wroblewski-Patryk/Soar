---
id: SOAR-TEST-PROFILE-API-KEY-PROBE
name: "Profile API-key probe tests"
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

# Profile API-key probe tests

| Field | Value |
| --- | --- |
| Description | Profile exchange API-key probe tests. |
| File path | apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]], [[SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Probe proof is credential validation only. |

## Relations

- verified_by <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
