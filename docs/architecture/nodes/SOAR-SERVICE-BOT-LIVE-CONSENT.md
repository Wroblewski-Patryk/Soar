---
id: SOAR-SERVICE-BOT-LIVE-CONSENT
name: "Bot live consent service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot live consent service

| Field | Value |
| --- | --- |
| Description | Live-trading consent support service for bot runtime actions. |
| File path | apps/api/src/modules/bots/botLiveConsent.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-BOTS]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Consent is safety-critical for LIVE runtime behavior. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
