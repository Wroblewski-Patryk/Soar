---
id: SOAR-SERVICE-BOTS-RUNTIME-READ
name: "Bots runtime read service"
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

# Bots runtime read service

| Field | Value |
| --- | --- |
| Description | Runtime read facade for bot monitoring and aggregate runtime API payloads. |
| File path | apps/api/src/modules/bots/botsRuntimeRead.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Used by | [[SOAR-CONTROLLER-BOTS]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-SESSIONS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime read projection support. |

## Relations

- calls -> [[SOAR-SERVICE-BOT-PORTFOLIO-HISTORY-READ]] (verified_local)
- calls -> [[SOAR-SERVICE-RUNTIME-MARKET-TRUTH-STATE]] (verified_local)
- has_source <- [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
