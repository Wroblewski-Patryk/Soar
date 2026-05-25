---
id: SOAR-FEATURE-RUNTIME-DCA-PNL
name: "Runtime DCA exchange PnL threshold"
type: feature
status: verified
layer: backend
module: bot-runtime
feature: runtime-dca-pnl
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, feature, backend, verified]
---

# Runtime DCA exchange PnL threshold

| Field | Value |
| --- | --- |
| Description | Runtime automation evaluates DCA thresholds against exchange PnL and margin truth when available. |
| File path | docs/architecture/reference/position-management-pnl-lifecycle-contract.md |
| Related files | apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts |
| Parent |  |
| Children | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-POSITION]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-RUNTIME-DCA-PNL]] |
| Docs related | [[SOAR-DOC-POSITION-PNL-LIFECYCLE]] |
| Agent related |  |
| Notes | Production readback remains protected-auth scope. |

## Relations

- implemented_by -> [[SOAR-SERVICE-RUNTIME-AUTOMATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
