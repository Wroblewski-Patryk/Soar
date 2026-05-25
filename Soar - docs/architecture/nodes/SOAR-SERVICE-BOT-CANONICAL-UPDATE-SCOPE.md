---
id: SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE
name: "Bot canonical update scope service"
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

# Bot canonical update scope service

| Field | Value |
| --- | --- |
| Description | Bot update scope resolver that prefers canonical market-group topology over legacy projections. |
| File path | apps/api/src/modules/bots/botCanonicalUpdateScope.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Used by | [[SOAR-SERVICE-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Canonical topology prevents stale legacy strategy drift. |

## Relations

- uses <- [[SOAR-SERVICE-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
