---
id: SOAR-TEST-BOT-SETUP-API
name: "Bot setup API tests"
type: test
status: verified_local
layer: testing
module: api-bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Bot setup API tests

| Field | Value |
| --- | --- |
| Description | Bot lifecycle wallet contract duplicate guard entitlement market-universe and topology tests. |
| File path | apps/api/src/modules/bots/bots.e2e.test.ts |
| Related files | apps/api/src/modules/bots/bots.wallet-contract.e2e.test.ts, apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts, apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts, apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts, apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts, apps/api/src/modules/bots/botContextValidation.service.test.ts, apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]], [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]], [[SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]] |
| UI related |  |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Primary setup backend proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-BOT-SETUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
