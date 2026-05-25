---
id: SOAR-CONTROLLER-BOTS
name: "Bots controller"
type: controller
status: verified_local
layer: backend
module: api-bots
feature: bot-runtime
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Bots controller

| Field | Value |
| --- | --- |
| Description | Express controller for bot runtime graph aggregate session positions trades symbol stats and close command routes. |
| File path | apps/api/src/modules/bots/bots.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children | [[SOAR-API-BOT-RUNTIME-GRAPH]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-SESSIONS]], [[SOAR-API-BOT-RUNTIME-SESSION-GET]], [[SOAR-API-BOT-RUNTIME-SYMBOL-STATS]], [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-API-BOT-RUNTIME-TRADES]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Depends on | [[SOAR-TYPES-BOTS]], [[SOAR-SERVICE-BOTS]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]], [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]], [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Controller maps runtime validation and close-position errors. |

## Relations

- validates_with -> [[SOAR-TYPES-BOTS]] (verified_local)
- delegates -> [[SOAR-SERVICE-RUNTIME-AGGREGATE]] (verified_local)
- delegates -> [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]] (verified_local)
- delegates -> [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]] (verified_local)
- validates_with -> [[SOAR-TYPES-BOTS]] (verified_local)
- calls -> [[SOAR-SERVICE-BOTS]] (verified_local)
- validates_with -> [[SOAR-TYPES-BOTS]] (verified_local)
- calls -> [[SOAR-SERVICE-BOT-ASSISTANT]] (verified_local)
- delegates <- [[SOAR-API-BOT-RUNTIME-AGGREGATE]] (verified_local)
- delegates <- [[SOAR-API-BOT-RUNTIME-POSITIONS]] (verified_local)
- delegates <- [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] (verified_local)
- routes_to <- [[SOAR-API-BOT-LIST]] (verified_local)
- routes_to <- [[SOAR-API-BOT-CREATE]] (verified_local)
- routes_to <- [[SOAR-API-BOT-UPDATE]] (verified_local)
- routes_to <- [[SOAR-API-BOT-DELETE]] (verified_local)
- routes_to <- [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]] (verified_local)
- routes_to <- [[SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT]] (verified_local)
- routes_to <- [[SOAR-API-BOT-SUBAGENT-UPSERT]] (verified_local)
- routes_to <- [[SOAR-API-BOT-SUBAGENT-DELETE]] (verified_local)
- routes_to <- [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
