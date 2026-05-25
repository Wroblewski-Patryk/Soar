---
id: SOAR-FEATURE-ENGINE-RUNTIME-CORE
name: "Engine runtime core"
type: feature
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, backend, verified_local]
---

# Engine runtime core

| Field | Value |
| --- | --- |
| Description | Engine runtime core maps scan signal execution dedupe lifecycle telemetry topology and simulator services. |
| File path | docs/architecture/04_runtime-contexts.md |
| Related files | docs/architecture/06_execution-lifecycle.md |
| Parent |  |
| Children | [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]], [[SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE]], [[SOAR-SERVICE-RUNTIME-FINAL-CANDLE-DECISION]], [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]], [[SOAR-SERVICE-RUNTIME-ORDER-LIFETIME]], [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]], [[SOAR-SERVICE-RUNTIME-METRICS]], [[SOAR-SERVICE-RUNTIME-TELEMETRY]], [[SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE]], [[SOAR-SERVICE-SIMULATOR]] |
| Depends on | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]], [[SOAR-DOC-API-BOTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from engine runtime service drift. |

## Relations

- has_service -> [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)
- documented_by -> [[SOAR-DOC-EXECUTION-LIFECYCLE]] (verified_local)
- documented_by -> [[SOAR-DOC-API-BOTS]] (verified_local)
- verified_by -> [[SOAR-TEST-API-RESIDUAL-EVIDENCE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
