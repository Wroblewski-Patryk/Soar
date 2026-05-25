---
id: SOAR-SERVICE-BOT-API-KEY-RESOLVER
name: "Bot API-key resolver service"
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

# Bot API-key resolver service

| Field | Value |
| --- | --- |
| Description | Resolves bot API-key context for runtime and exchange-facing operations. |
| File path | apps/api/src/modules/bots/botApiKeyResolver.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-API-KEY]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-SERVICE-BOTS]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-API-KEY]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime support service node. |

## Relations

- reads -> [[SOAR-DB-API-KEY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
