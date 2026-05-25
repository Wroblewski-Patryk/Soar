---
id: SOAR-SERVICE-SIMULATOR
name: "Simulator service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: high
completion_percent: 80
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Simulator service

| Field | Value |
| --- | --- |
| Description | Engine simulator service for paper and backtest style execution simulation. |
| File path | apps/api/src/modules/engine/simulator.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-PAPER-RUNTIME]], [[SOAR-SERVICE-RULE-EVALUATOR]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Simulation engine support. |

## Relations

- uses -> [[SOAR-SERVICE-PAPER-RUNTIME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
