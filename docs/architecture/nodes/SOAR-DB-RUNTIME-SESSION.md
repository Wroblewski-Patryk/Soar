---
id: SOAR-DB-RUNTIME-SESSION
name: "BotRuntimeSession model"
type: database_model
status: verified
layer: data
module: bot-runtime
feature: dashboard-runtime
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, database_model, data, verified]
---

# BotRuntimeSession model

| Field | Value |
| --- | --- |
| Description | Runtime session model for bot execution state and monitoring readbacks. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]] |
| Used by | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Production freshness depends on protected runtime readback. |

## Relations

- reads <- [[SOAR-API-BOT-RUNTIME-POSITIONS]] (partially_verified)
- observes <- [[SOAR-SERVICE-RUNTIME-TELEMETRY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
