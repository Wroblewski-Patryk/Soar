---
id: SOAR-SERVICE-BOTS-MONITORING-AGGREGATE
name: "Bots monitoring aggregate service"
type: service
status: verified_local
layer: frontend
module: web-bots
feature: bot-runtime
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Bots monitoring aggregate service

| Field | Value |
| --- | --- |
| Description | Frontend aggregate service shaping bot monitoring payloads for UI sections. |
| File path | apps/web/src/features/bots/services/botsMonitoringAggregate.service.ts |
| Related files | apps/web/src/features/bots/services/botsMonitoringAggregate.service.test.ts |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Used by | [[SOAR-HOOK-BOTS-MONITORING-CONTROLLER]], [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bot monitoring aggregate view-model service. |

## Relations

- calls -> [[SOAR-API-BOT-RUNTIME-AGGREGATE]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] (verified_local)
- calls <- [[SOAR-HOOK-BOTS-MONITORING-CONTROLLER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
