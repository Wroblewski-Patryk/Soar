---
id: SOAR-DB-API-KEY
name: "ApiKey model"
type: database_model
status: verified_local
layer: data
module: profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# ApiKey model

| Field | Value |
| --- | --- |
| Description | Prisma API-key model storing encrypted exchange credentials and sync options. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-FEATURE-WALLETS]], [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-SERVICE-POSITIONS]] |
| UI related | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-WALLET-PREVIEW-BALANCE]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Secrets must never be stored unencrypted. |

## Relations

- enables -> [[SOAR-API-WALLET-PREVIEW-BALANCE]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-PROFILE-API-KEYS]] (verified_local)
- reads <- [[SOAR-SERVICE-BOT-API-KEY-RESOLVER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
