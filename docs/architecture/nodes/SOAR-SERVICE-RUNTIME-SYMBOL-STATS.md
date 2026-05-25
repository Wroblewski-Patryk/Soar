---
id: SOAR-SERVICE-RUNTIME-SYMBOL-STATS
name: "Runtime symbol stats read service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime symbol stats read service

| Field | Value |
| --- | --- |
| Description | Runtime symbol stats read model and enrichment service. |
| File path | apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts |
| Related files | apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts, apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-RUNTIME-SESSION]] |
| Used by | [[SOAR-API-BOT-RUNTIME-SYMBOL-STATS]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-SYMBOL-STATS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime symbol stats node. |

## Relations

- uses <- [[SOAR-SERVICE-RUNTIME-AGGREGATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
