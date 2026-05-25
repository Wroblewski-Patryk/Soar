---
id: SOAR-SERVICE-BOT-PORTFOLIO-HISTORY-READ
name: "Bot portfolio history read service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot portfolio history read service

| Field | Value |
| --- | --- |
| Description | Reads bot portfolio history for runtime and reporting projections. |
| File path | apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-TRADE]], [[SOAR-DB-POSITION]] |
| Used by | [[SOAR-SERVICE-BOTS-RUNTIME-READ]], [[SOAR-FEATURE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-TRADE]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-BOT-PORTFOLIO-HISTORY]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Read model support for historical runtime context. |

## Relations

- calls <- [[SOAR-SERVICE-BOTS-RUNTIME-READ]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
