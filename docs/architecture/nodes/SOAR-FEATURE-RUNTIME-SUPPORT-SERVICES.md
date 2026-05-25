---
id: SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES
name: "Runtime support services feature"
type: feature
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, backend, verified_local]
---

# Runtime support services feature

| Field | Value |
| --- | --- |
| Description | Bot runtime and engine support services for ownership read projections consent portfolio history DCA visibility market truth paper runtime pre-trade risk and rule evaluation. |
| File path | docs/modules/api-bots.md |
| Related files | docs/architecture/04_runtime-contexts.md, docs/architecture/06_execution-lifecycle.md |
| Parent |  |
| Children | [[SOAR-SERVICE-BOT-OWNERSHIP]], [[SOAR-SERVICE-BOT-READ-PROJECTION]], [[SOAR-SERVICE-BOTS-RUNTIME-READ]], [[SOAR-SERVICE-PAPER-RUNTIME]], [[SOAR-SERVICE-PRETRADE-RISK]] |
| Depends on | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]], [[SOAR-FEATURE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from apiServices drift around bot/runtime/engine support files. |

## Relations

- has_source -> [[SOAR-SERVICE-BOTS-RUNTIME-READ]] (verified_local)
- verified_by -> [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] (verified_local)
- documented_by -> [[SOAR-DOC-API-BOTS]] (verified_local)
- documented_by -> [[SOAR-DOC-EXECUTION-LIFECYCLE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
