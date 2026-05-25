---
id: SOAR-DB-LOG
name: "Log model"
type: database_model
status: verified_local
layer: data
module: audit
feature: profile-api-keys
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# Log model

| Field | Value |
| --- | --- |
| Description | Prisma log model used for API-key lifecycle and connection-test audit metadata. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-SERVICE-PROFILE-API-KEYS]], [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Audit metadata must not contain raw secrets. |

## Relations

- writes <- [[SOAR-SERVICE-PROFILE-API-KEYS]] (verified_local)
- reads <- [[SOAR-SERVICE-LOGS]] (verified_local)
- writes <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
