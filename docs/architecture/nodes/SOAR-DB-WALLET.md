---
id: SOAR-DB-WALLET
name: "Wallet model"
type: database_model
status: verified
layer: data
module: wallets
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, database_model, data, verified]
---

# Wallet model

| Field | Value |
| --- | --- |
| Description | Wallet model for PAPER LIVE account context allocation and order guards. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | LIVE wallet action proof is separated from local implementation proof. |

## Relations

- reads_writes <- [[SOAR-SERVICE-WALLETS]] (verified_local)
- reads <- [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
