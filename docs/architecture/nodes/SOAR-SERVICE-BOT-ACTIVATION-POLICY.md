---
id: SOAR-SERVICE-BOT-ACTIVATION-POLICY
name: "Bot activation policy service"
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

# Bot activation policy service

| Field | Value |
| --- | --- |
| Description | Bot activation and LIVE consent entitlement policy service. |
| File path | apps/api/src/modules/bots/botActivationPolicy.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-SETUP]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-PROFILE-API-KEYS]], [[SOAR-FEATURE-WALLETS]], [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Used by | [[SOAR-SERVICE-BOTS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | LIVE activation is consent and entitlement gated. |

## Relations

- depends_on -> [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)
- depends_on -> [[SOAR-FEATURE-WALLETS]] (verified_local)
- uses <- [[SOAR-SERVICE-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
