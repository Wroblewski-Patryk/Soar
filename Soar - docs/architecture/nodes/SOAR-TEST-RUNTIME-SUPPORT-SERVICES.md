---
id: SOAR-TEST-RUNTIME-SUPPORT-SERVICES
name: "Runtime support service tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: runtime-support-services
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Runtime support service tests

| Field | Value |
| --- | --- |
| Description | Aggregate runtime support test proof covering ownership portfolio history mode-switch runtime history DCA visibility PnL strategy context takeover projection drift and external owner behavior. |
| File path | apps/api/src/modules/bots/botOwnership.service.test.ts |
| Related files | apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts, apps/api/src/modules/bots/bots.runtime-history-parity.e2e.test.ts, apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts, apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts, apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts, apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BOT-OWNERSHIP]], [[SOAR-SERVICE-BOTS-RUNTIME-READ]], [[SOAR-SERVICE-PAPER-RUNTIME]], [[SOAR-SERVICE-PRETRADE-RISK]] |
| Used by | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Aggregate service-drift proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
