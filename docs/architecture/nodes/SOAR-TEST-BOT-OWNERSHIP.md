---
id: SOAR-TEST-BOT-OWNERSHIP
name: "Bot ownership tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: runtime-support-services
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot ownership tests

| Field | Value |
| --- | --- |
| Description | Bot ownership service tests. |
| File path | apps/api/src/modules/bots/botOwnership.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BOT-OWNERSHIP]] |
| Used by | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| UI related |  |
| API related | [[SOAR-API-BOT-GET]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Ownership proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-BOT-OWNERSHIP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
