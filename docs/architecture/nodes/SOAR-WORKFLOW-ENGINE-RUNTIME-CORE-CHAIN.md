---
id: SOAR-WORKFLOW-ENGINE-RUNTIME-CORE-CHAIN
name: "Engine runtime core workflow"
type: workflow
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, backend, verified_local]
---

# Engine runtime core workflow

| Field | Value |
| --- | --- |
| Description | Workflow from scan loop through signal loop topology cache execution guards lifecycle services telemetry simulator tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-ENGINE-RUNTIME-CORE.md |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]], [[SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE]], [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]], [[SOAR-SERVICE-RUNTIME-TELEMETRY]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]], [[SOAR-DOC-API-BOTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for engine runtime core drift slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
