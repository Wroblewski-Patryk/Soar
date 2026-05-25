---
id: SOAR-SERVICE-RUNTIME-AUTOMATION
name: "Runtime position automation"
type: service
status: verified
layer: backend
module: bot-runtime
feature: runtime-dca-pnl
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, backend, verified]
---

# Runtime position automation

| Field | Value |
| --- | --- |
| Description | Position management automation helper and runtime decision path for DCA TP SL TTP and TSL thresholds. |
| File path | apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts |
| Related files | apps/api/src/modules/engine/runtimePositionAutomation.service.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| Children |  |
| Depends on | [[SOAR-DB-POSITION]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-RUNTIME-DCA-PNL]] |
| Docs related | [[SOAR-DOC-POSITION-PNL-LIFECYCLE]] |
| Agent related |  |
| Notes | Seed node for deeper runtime execution-chain backfill. |

## Relations

- reads_writes -> [[SOAR-DB-POSITION]] (verified_local)
- uses -> [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] (verified_local)
- implemented_by <- [[SOAR-FEATURE-RUNTIME-DCA-PNL]] (verified_local)
- uses <- [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- calls <- [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
