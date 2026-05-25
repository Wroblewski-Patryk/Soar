---
id: SOAR-SERVICE-BOT-CONTEXT-VALIDATION
name: "Bot context validation service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Bot context validation service

| Field | Value |
| --- | --- |
| Description | Bot wallet strategy market-universe context validation service. |
| File path | apps/api/src/modules/bots/botContextValidation.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-DB-WALLET]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Used by | [[SOAR-SERVICE-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Fail-closed context mismatch guard. |

## Relations

- reads -> [[SOAR-DB-WALLET]] (verified_local)
- reads -> [[SOAR-DB-STRATEGY]] (verified_local)
- reads -> [[SOAR-DB-MARKET-UNIVERSE]] (verified_local)
- uses <- [[SOAR-SERVICE-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
