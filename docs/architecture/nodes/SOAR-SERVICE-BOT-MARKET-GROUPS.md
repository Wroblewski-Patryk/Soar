---
id: SOAR-SERVICE-BOT-MARKET-GROUPS
name: "Bot market groups service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot market groups service

| Field | Value |
| --- | --- |
| Description | Bot market-group and strategy-link orchestration service. |
| File path | apps/api/src/modules/bots/botMarketGroups.service.ts |
| Related files | apps/api/src/modules/bots/botLegacyStrategyLink.service.ts |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]], [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-STRATEGY]] |
| Used by | [[SOAR-CONTROLLER-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-MARKET-GROUPS-LIST]], [[SOAR-API-BOT-MARKET-GROUP-CREATE]], [[SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH]] |
| Database related | [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Topology write boundary. |

## Relations

- reads_writes -> [[SOAR-DB-BOT-MARKET-GROUP]] (verified_local)
- reads_writes -> [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
